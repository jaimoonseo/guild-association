# Guild Association Deployment Log

## 프로젝트 정보
- **프로젝트명**: Guild Association - Developer Quest Platform
- **GitHub Repo**: https://github.com/jaimoonseo/guild-association
- **Frontend URL**: https://guild-association.vercel.app
- **Backend URL**: https://guild-association-backend.vercel.app
- **데이터베이스**: Supabase PostgreSQL

## 진행 상황 (2026-04-03)

### ✅ 완료된 작업

1. **프로젝트 초기 설정**
   - Supabase PostgreSQL 데이터베이스 생성 및 Prisma 스키마 적용
   - GitHub OAuth 앱 생성 및 설정
   - Vercel 프로젝트 생성 (frontend, backend)

2. **백엔드 배포 수정**
   - Vercel serverless 환경을 위한 구조 리팩토링
   - `backend/api/index.ts` 생성 (serverless entry point)
   - `backend/src/app.ts` 생성 (Express app export)
   - `backend/src/index.ts` 수정 (로컬 개발 전용)
   - `backend/vercel.json` 수정 (api/index.ts로 라우팅)

3. **프론트엔드 설정**
   - TypeScript 빌드 에러 수정 (unused imports 제거)
   - `.env.production` 파일에 백엔드 URL 설정
   - Navbar 컴포넌트에서 authAPI 사용하도록 수정

4. **세션 스토어 개선**
   - `connect-pg-simple` 설치 및 설정
   - PostgreSQL 세션 스토어로 변경 (메모리 세션 → DB 세션)
   - Vercel serverless 환경에서 세션 지속성 확보

5. **에러 처리 개선**
   - 백엔드 에러 핸들러 개선 (상세 메시지 포함)
   - GitHub OAuth 콜백 에러 처리 개선
   - 프론트엔드에 에러 표시 UI 추가

6. **빌드 설정**
   - `vercel.json`에 `buildCommand` 추가
   - Prisma 클라이언트 생성을 빌드 프로세스에 포함

### ⚠️ 현재 이슈

**문제**: GitHub OAuth 로그인 시 지속적으로 에러 발생

**증상**:
```
https://guild-association-backend.vercel.app/auth/github/callback?code=...
{"error":"Something went wrong!"}
```

**시도한 해결책**:
1. ✅ Serverless 구조 리팩토링
2. ✅ PostgreSQL 세션 스토어 추가
3. ✅ 에러 핸들링 개선
4. ✅ Prisma 빌드 명령어 추가
5. ⏳ 데이터베이스 연결 테스트 엔드포인트 추가 (`/test-db`)

**추정 원인**:
- Prisma 클라이언트가 Supabase에 연결하지 못함
- passport.authenticate() 내부에서 에러 발생
- 세션 저장 과정에서 문제 발생 가능

### 📝 다음 단계

1. **Vercel 로그 확인** (진행 중)
   - Vercel 대시보드에서 Function Logs 확인
   - 실제 에러 메시지 및 스택 트레이스 확인

2. **데이터베이스 연결 테스트**
   - `/test-db` 엔드포인트로 Prisma 연결 확인
   - 배포 완료 후 테스트 실행

3. **대안 고려**
   - JWT 기반 인증으로 전환 (세션 없이)
   - 로컬 개발 환경에서 먼저 테스트

## 환경 변수

### Backend (Vercel)
- `DATABASE_URL`: Supabase PostgreSQL 연결 문자열
- `SESSION_SECRET`: 세션 암호화 키
- `GITHUB_CLIENT_ID`: Ov23li4QO1a1Ow2ZWHfC
- `GITHUB_CLIENT_SECRET`: 0f68e26a1d694f4d6984a8ab406f8a7648934892
- `GITHUB_CALLBACK_URL`: https://guild-association-backend.vercel.app/auth/github/callback
- `FRONTEND_URL`: https://guild-association.vercel.app

### Frontend (Vercel)
- `VITE_API_URL`: https://guild-association-backend.vercel.app

## Git 커밋 히스토리

1. Initial commit: Guild Association backend and frontend setup
2. Fix TypeScript build errors (unused imports)
3. Refactor backend for Vercel serverless compatibility
4. Fix frontend production API URL
5. Fix Navbar to use authAPI for GitHub login
6. Add PostgreSQL session store for Vercel serverless
7. Improve error handling for debugging
8. Add buildCommand to vercel.json for Prisma generation
9. Display auth errors on frontend
10. Add database connection test endpoint

## 기술 스택

### Frontend
- Next.js (React)
- TypeScript
- TailwindCSS
- Axios
- React Router

### Backend
- Express.js
- TypeScript
- Prisma ORM
- Passport.js (GitHub OAuth)
- PostgreSQL (Supabase)
- connect-pg-simple (세션 스토어)

### 배포
- Vercel (Frontend + Backend)
- Supabase (Database)
- GitHub (OAuth Provider)

## 참고 사항

- 모든 코드는 Git으로 버전 관리 중
- 자동 배포: GitHub push → Vercel 자동 배포
- 배포 시간: 약 1-2분
