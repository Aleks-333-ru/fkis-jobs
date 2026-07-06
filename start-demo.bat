@echo off
chcp 65001 >nul
title FKiS demo
cd /d C:\Клауд

echo.
echo  ВАЖНО: перед показом ОТКЛЮЧИ AmneziaVPN — иначе туннель не поднимется.
echo.

REM 1) Запускаем сайт в отдельном окне
start "FKiS server" "C:\Program Files\nodejs\node.exe" --env-file=.env server.js

REM 2) Ждём, пока сервер поднимется
timeout /t 3 >nul

echo  Поднимаю публичную ссылку. Скопируй адрес вида
echo  https://XXXX.trycloudflare.com  из строчки ниже и отправь руководителю.
echo  (Окно не закрывать до конца показа.)
echo.

REM 3) Публичный туннель (адрес появится в этом окне)
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000 --protocol http2
