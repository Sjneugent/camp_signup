@echo off
echo This will reset all classes to the configuration in backend/config/classes.json
echo WARNING: This will remove all existing class selections!
echo.
set /p CONFIRM=Are you sure you want to proceed? (y/n): 

if /i "%CONFIRM%"=="y" (
    echo Resetting classes...
    node backend/reset-classes.js
) else (
    echo Operation cancelled.
)
pause
