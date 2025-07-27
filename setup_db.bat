@echo off
echo Setting up PostgreSQL database...
echo.
set /p DB_USER=Enter PostgreSQL username (default: postgres): 
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASSWORD=Enter PostgreSQL password: 
if "%DB_PASSWORD%"=="" (
    echo Password cannot be empty
    goto :eof
)

set /p DB_NAME=Enter database name (default: event_registration): 
if "%DB_NAME%"=="" set DB_NAME=event_registration

REM Create database
echo Creating database %DB_NAME%...
psql -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;"

if %ERRORLEVEL% NEQ 0 (
    echo Failed to create database. Please check your PostgreSQL installation and credentials.
    pause
    goto :eof
)

REM Update .env file
echo DB_USER=%DB_USER%> backend\.env
echo DB_PASSWORD=%DB_PASSWORD%>> backend\.env
echo DB_NAME=%DB_NAME%>> backend\.env
echo DB_HOST=localhost>> backend\.env
echo DB_PORT=5432>> backend\.env

echo.
echo Database setup complete!
echo Environment variables saved to backend/.env
echo.
echo To start the application:
echo 1. Run "run.bat" to start the application
pause
