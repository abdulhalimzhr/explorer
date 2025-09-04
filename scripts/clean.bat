@echo off
echo Cleaning...

echo Removing backend dependencies...
if exist "apps\backend\node_modules" (
    rmdir /s /q "apps\backend\node_modules"
    echo   Removed apps\backend\node_modules
)

if exist "apps\backend\bun.lockb" (
    del "apps\backend\bun.lockb"
    echo   Removed apps\backend\bun.lockb
)

if exist "apps\backend\package-lock.json" (
    del "apps\backend\package-lock.json"
    echo   Removed apps\backend\package-lock.json
)

echo Removing frontend dependencies...
if exist "apps\frontend\node_modules" (
    rmdir /s /q "apps\frontend\node_modules"
    echo   Removed apps\frontend\node_modules
)

if exist "apps\frontend\package-lock.json" (
    del "apps\frontend\package-lock.json"
    echo   Removed apps\frontend\package-lock.json
)

if exist "apps\frontend\.nuxt" (
    rmdir /s /q "apps\frontend\.nuxt"
    echo   Removed apps\frontend\.nuxt
)

if exist "apps\frontend\.output" (
    rmdir /s /q "apps\frontend\.output"
    echo   Removed apps\frontend\.output
)

echo Removing root dependencies...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo   Removed root node_modules
)

if exist "package-lock.json" (
    del "package-lock.json"
    echo   Removed root package-lock.json
)

echo Stopping and removing Docker containers...
where docker-compose >nul 2>nul
if %errorlevel% equ 0 (
    docker-compose down --volumes --remove-orphans
    echo   Stopped containers and removed volumes
) else (
    echo   Docker Compose not found, skipping container cleanup
)

echo Done
