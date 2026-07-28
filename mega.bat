@echo off
:: Admin (Yonetici) yetkisi kontrolu ve otomatik yukseltme
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Yonetici yetkisi aliniyor...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title Ordex Sunucu - Otomatik Baslatici

:: BAT dosyasinin bulundugu klasore odaklan
cd /d "%~dp0"

echo ===================================================
echo [1/2] Ordex Flask App (app.py) Baslatiliyor...
echo ===================================================
:: app.py dosyasini ayrı bir pencerede başlatır
start "Ordex Flask Server" cmd /k "python app.py"

:: Flask sunucusunun tamamen açılması için 3 saniye bekleme
timeout /t 3 /nobreak >nul

echo.
echo ===================================================
echo [2/2] Cloudflare Tunnel Baslatiliyor...
echo ===================================================
echo.
:: Cloudflare tünelini çalıştırır
cloudflared tunnel --url http://localhost:3000/

pause