## 1. Asset Relocation & Frontend Setup

- [x] 1.1 Create `frontend/public/assets/logo/` directory and copy `logo.png`, `logopublicidad.png`, `logowpp.png` from `docs/logo/`
- [x] 1.2 Remove logo binaries from `docs/logo/` to keep documentation lean and text-focused
- [x] 1.3 Verify logo accessibility from Vite public path (`/assets/logo/logo.png`)

## 2. Codebase Reference Updates

- [x] 2.1 Search and update all image source references across `frontend/src` components to point to `/assets/logo/logo.png`
- [x] 2.2 Verify brand logo rendering in Header/Navbar and modals

## 3. Architecture Documentation & Folder Alignment

- [x] 3.1 Update `docs/05-arquitectura.md` with the official, scalable directory structure guidelines for frontend and backend
- [x] 3.2 Ensure frontend (`src/components`, `src/features`, `src/services`, `src/hooks`, `src/types`, `src/utils`) and backend (`src/domain`, `src/application`, `src/infrastructure`, `src/presentation`) conform to the blueprint

## 4. Verification & Build Checks

- [x] 4.1 Run TypeScript typecheck and build on `frontend` (`npm run build`)
- [x] 4.2 Run TypeScript typecheck and build on `backend` (`npm run build`)
