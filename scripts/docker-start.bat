@echo off
echo Starting with Docker...

REM Check if this is the first run
if not exist "apps\backend\.env" goto :first_run
if not exist "apps\frontend\.env" goto :first_run
goto :start_containers

:first_run
echo First run - setting up environment...
call scripts\setup.bat
if %errorlevel% neq 0 exit /b 1
echo.

:start_containers
echo Building and starting containers...
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:3001
echo    API Docs: http://localhost:3001/swagger

docker-compose up -d --build

if %errorlevel% equ 0 (
    echo Containers started
    echo.
    echo Commands:
    echo    View logs: docker-compose logs -f
    echo    Stop: npm run docker:stop
    echo    Restart: docker-compose restart
) else (
    echo Failed to start containers
    exit /b 1
)
