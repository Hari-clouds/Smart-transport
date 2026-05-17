@echo off
title RIT Smart Transport — Choose Browser
cls
echo.
echo  ==========================================
echo   RIT Smart Transport — Open in Browser
echo  ==========================================
echo.
echo   Select a browser to open the app:
echo.
echo   [1] Google Chrome
echo   [2] Microsoft Edge
echo   [3] Mozilla Firefox
echo   [4] Opera
echo   [0] Cancel
echo.
set /p choice="  Enter choice (1-4): "

set FILE=%~dp0index.html

if "%choice%"=="1" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%FILE%"
    if errorlevel 1 start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%FILE%"
    goto done
)
if "%choice%"=="2" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%FILE%"
    if errorlevel 1 start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%FILE%"
    goto done
)
if "%choice%"=="3" (
    start "" "C:\Program Files\Mozilla Firefox\firefox.exe" "%FILE%"
    if errorlevel 1 start "" "C:\Program Files (x86)\Mozilla Firefox\firefox.exe" "%FILE%"
    goto done
)
if "%choice%"=="4" (
    start "" "C:\Users\%USERNAME%\AppData\Local\Programs\Opera\opera.exe" "%FILE%"
    goto done
)
if "%choice%"=="0" goto done

echo   Invalid choice. Please run again.
pause
goto done

:done
