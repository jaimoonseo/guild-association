# Guild Association 프로젝트 진행 과정 및 이슈 사항

## 프로젝트 개요
- **프로젝트명**: Guild Association (길드 협회)
- **목적**: 게이미피케이션을 통한 작업 관리 시스템
- **기술 스택**:
  - Frontend: React + TypeScript + Vite
  - Backend: Node.js + Express + TypeScript + Prisma
  - Database: PostgreSQL (Supabase)
  - Deployment: Vercel
  - Authentication: GitHub OAuth (Passport.js)

## 프로젝트 진행 과정

### 1단계: 초기 설정
- React + TypeScript 프론트엔드 구성
- Express + TypeScript 백엔드 구성
- Prisma ORM 설정
- GitHub OAuth 인증 시스템 구현

### 2단계: 데이터베이스 설정
- Supabase PostgreSQL 데이터베이스 생성
- Prisma 스키마 정의 (User, Quest, Submission 모델)
- Database migration 실행

### 3단계: Vercel 배포
- Frontend 배포: https://guild-association.vercel.app
- Backend 배포: https://guild-association-backend.vercel.app
- 환경 변수 설정

## 주요 이슈 및 해결 과정

### 이슈 #1: TypeScript 빌드 에러
**문제**:
```
Parameter 'err' implicitly has an 'any' type
```

**원인**:
- Passport.js 콜백 함수의 매개변수에 타입이 명시되지 않음

**해결**:
```typescript
import type { Request, Response, NextFunction } from 'express';

passport.authenticate('github', (err: any, user: any, info: any) => {
  // ... 코드
})
```

### 이슈 #2: Database Connection 에러 - "Tenant or user not found"
**문제**:
```
FATAL: Tenant or user not found
```

**시도한 해결 방법**:
1. ❌ 새 Supabase 프로젝트 생성 (`pnzhxxowdpswfeugnsxo`) - DNS/연결 문제 발생
2. ✅ 기존 Supabase 프로젝트 사용 (`oqpusmrvorxpmxufykwc`)

**최종 해결**:
- Transaction Pooler 연결 방식 사용
- 연결 문자열: `postgresql://postgres.oqpusmrvorxpmxufykwc:rpuIRgZEKq0z1mlA@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`

**환경 변수 설정**:
```bash
DATABASE_URL=postgresql://postgres.oqpusmrvorxpmxufykwc:rpuIRgZEKq0z1mlA@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=c0bd2f6efa1d4908a22c87b17a0b46a0e344462586ad27923f2a76f7e9dfd8ac
NODE_ENV=production
```

### 이슈 #3: 세션 쿠키 전달 문제 (가장 큰 이슈)
**문제**:
- GitHub 로그인은 성공하지만 프론트엔드가 인증 상태를 인식하지 못함
- 로그인 버튼이 로그아웃으로 변경되지 않음
- `/auth/me` 호출 시 "Not authenticated" 에러

**증상**:
```
Cookies: undefined
Is Authenticated: false
```

**원인 분석**:
1. 백엔드가 세션 쿠키를 설정함 (데이터베이스에 세션 저장 확인)
2. 하지만 브라우저가 쿠키를 받지 못하거나, 다음 요청에 포함하지 않음
3. Vercel Serverless 환경에서 크로스 도메인 쿠키 처리 문제

**시도한 해결 방법**:
1. ✅ CORS 설정 확인 - 정상 작동
2. ✅ 쿠키 설정 확인 (`secure: true`, `sameSite: 'none'`) - 설정됨
3. ❌ 디버그 로깅 추가 - 쿠키가 전달되지 않음을 확인
4. ✅ **최종 해결**: Vercel Serverless 환경을 위한 세션 설정 추가

**최종 해결 코드**:
```typescript
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'guild-secret-key',
    resave: false,
    saveUninitialized: false,
    name: 'guild.sid', // 명시적 쿠키 이름
    proxy: true, // Vercel 프록시 신뢰
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);
```

**핵심 변경사항**:
- `proxy: true` 추가 - Vercel의 프록시를 신뢰하도록 설정
- `name: 'guild.sid'` 추가 - 명시적인 쿠키 이름 지정
- `httpOnly: true` 명시 - 보안 강화

## 기술적 학습 내용

### Supabase 연결 방식
1. **Direct Connection (Port 5432)**:
   - 연결 문자열: `postgresql://postgres:password@db.PROJECT_REF.supabase.co:5432/postgres`
   - 장점: 낮은 지연시간
   - 단점: 연결 풀 제한, Serverless 환경에서 문제 발생 가능

2. **Transaction Pooler (Port 6543)** ✅ 사용:
   - 연결 문자열: `postgresql://postgres.PROJECT_REF:password@aws-region.pooler.supabase.com:6543/postgres`
   - 장점: Serverless 환경에 최적화, 연결 풀링
   - 단점: 약간 높은 지연시간

### Vercel Serverless 환경에서의 세션 관리
- Serverless Functions는 stateless이므로 세션을 외부 저장소에 저장 필요
- PostgreSQL을 세션 저장소로 사용 (`connect-pg-simple`)
- `proxy: true` 설정으로 Vercel 프록시 헤더 신뢰
- 크로스 도메인 쿠키를 위해 `sameSite: 'none'` + `secure: true` 필수

### CORS 설정
- 크로스 도메인 요청을 위한 CORS 설정:
  ```typescript
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // 쿠키 전송 허용
  }));
  ```

- 프론트엔드에서도 `withCredentials: true` 설정 필요:
  ```typescript
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });
  ```

## 배포 환경 변수

### Backend (Vercel)
```bash
# Database
DATABASE_URL=postgresql://postgres.oqpusmrvorxpmxufykwc:rpuIRgZEKq0z1mlA@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres

# Session
SESSION_SECRET=c0bd2f6efa1d4908a22c87b17a0b46a0e344462586ad27923f2a76f7e9dfd8ac

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23li4QO1a1Ow2ZWHfC
GITHUB_CLIENT_SECRET=[SECRET]
GITHUB_CALLBACK_URL=https://guild-association-backend.vercel.app/auth/github/callback

# Server
NODE_ENV=production
FRONTEND_URL=https://guild-association.vercel.app
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://guild-association-backend.vercel.app
```

## 향후 개선 사항
1. ~~세션 쿠키 문제 해결~~ ✅ 완료
2. 프론트엔드 UI/UX 개선
3. Quest 생성/수정 기능 구현
4. 리더보드 실시간 업데이트
5. 사용자 프로필 커스터마이징
6. 알림 시스템 구현

## 참고 자료
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Passport.js GitHub Strategy](http://www.passportjs.org/packages/passport-github/)
- [Express Session](https://github.com/expressjs/session)
- [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple)
