@echo off
echo Setting up...

REM Check if we have Node.js and npm
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js required but not found.
    echo.
    echo Install Node.js:
    echo   - Download from https://nodejs.org/
    echo   - Use chocolatey: choco install nodejs
    echo   - Use scoop: scoop install nodejs
    echo   - Use winget: winget install OpenJS.NodeJS
    echo.
    echo Then run this setup script again.
    exit /b 1
)

echo Found tools:
node --version
npm --version
echo.

REM Install dependencies
echo Installing dependencies...

echo Installing backend dependencies...
cd apps\backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    exit /b 1
)
cd ..\..

echo Installing frontend dependencies...
cd apps\frontend

REM Try normal install first, fallback to legacy peer deps if needed
call npm install
if %errorlevel% neq 0 (
    echo    Normal install failed, trying with --legacy-peer-deps...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo Failed to install frontend dependencies
        exit /b 1
    )
)

cd ..\..

echo Dependencies installed.

REM Set up environment files
echo Setting up environment files...

if not exist "apps\backend\.env" (
    if exist "apps\backend\.env.example" (
        copy "apps\backend\.env.example" "apps\backend\.env" >nul
        echo   Created backend .env
    ) else (
        echo DATABASE_URL=postgresql://explorer_user:explorer_pass@localhost:5432/explorer_db> apps\backend\.env
        echo NODE_ENV=development>> apps\backend\.env
        echo PORT=3001>> apps\backend\.env
        echo   Created backend .env
    )
) else (
    echo   Backend .env exists, skipping
)

if not exist "apps\frontend\.env" (
    if exist "apps\frontend\.env.example" (
        copy "apps\frontend\.env.example" "apps\frontend\.env" >nul
        echo   Created frontend .env
    ) else (
        echo NUXT_PUBLIC_API_BASE=http://localhost:3001> apps\frontend\.env
        echo NUXT_PUBLIC_API_VERSION=v1>> apps\frontend\.env
        echo NUXT_HOST=localhost>> apps\frontend\.env
        echo NUXT_PORT=3000>> apps\frontend\.env
        echo   Created frontend .env
    )
) else (
    echo   Frontend .env exists, skipping
)

REM Check for Docker
where docker >nul 2>nul
if %errorlevel% equ 0 (
    where docker-compose >nul 2>nul
    if %errorlevel% equ 0 (
        echo Docker detected. Start with:
        echo   npm run start:windows
        echo.
        echo Or run locally:
        echo   npm run dev
    ) else (
        goto :no_docker
    )
) else (
    :no_docker
    echo Docker not found. To run locally:
    echo.
    echo Setup PostgreSQL:
    echo   createdb explorer_db
    echo   createuser -s explorer_user
    echo   psql -c "ALTER USER explorer_user PASSWORD 'explorer_pass';"
    echo   psql -d explorer_db -f database\init.sql
    echo.
    echo Start app:
    echo   npm run dev
)

echo.
echo Setup complete. Access at:
echo   App: http://localhost:3000
echo   API: http://localhost:3001
echo   Docs: http://localhost:3001/swagger
