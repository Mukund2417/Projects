@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
cd /d "%~dp0\.."

REM Kill any node processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a >nul 2>nul

REM Build frontend if not present
IF NOT EXIST build (
  echo Building frontend...
  npm run build
)

REM Ensure dist exists (serve build if dist missing)
IF NOT EXIST dist (
  echo Copying build to dist...
  xcopy /E /I /Y build dist >nul
)

REM Start server
node backend\production-server.js
ENDLOCAL
