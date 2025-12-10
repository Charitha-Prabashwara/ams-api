@echo off
echo ===========================================
echo   Checking for compromised npm packages
echo   (September 2025 Supply Chain Attack)
echo ===========================================
echo.

REM List of compromised package@version pairs
set COMPROMISED=chalk@5.6.1 debug@4.4.2 ansi-styles@6.2.2 strip-ansi@7.1.1 supports-color@10.2.1

for %%p in (%COMPROMISED%) do (
    echo Checking %%p ...
    call :checkPackage %%p
)

goto :end

:checkPackage
for /f "tokens=1,2 delims=@" %%a in ("%1") do (
    npm ls %%a@%%b >nul 2>&1
    if %errorlevel%==0 (
        echo   [!!] FOUND: %%a@%%b is installed!
    ) else (
        echo   [OK] %%a@%%b not found.
    )
)
goto :eof

:end
echo.
echo Done.
pause
