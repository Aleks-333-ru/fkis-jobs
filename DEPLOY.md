# Развёртывание на своём сервере

Сайт — это **приложение на Node.js** (сервер-посредник, который ходит в API
hh.ru и «Работа России»), а не набор статических HTML-файлов. Поэтому просто
загрузить файлы недостаточно: на сервере нужно установить Node.js, запустить
сервер и направить домен на него через nginx с HTTPS.

Инструкция для **Linux (Ubuntu/Debian)** — самый частый вариант для своего
сервера/VPS. Если сервер на Windows — скажите, подготовлю другой вариант.

Схема работы: `домен → nginx (443, HTTPS) → node (127.0.0.1:3000)`.

---

## Что понадобится
- Сервер с Linux (Ubuntu 22.04/Debian 12) и доступом по SSH.
- Node.js 18+.
- nginx.
- Домен, у которого **A-запись** указывает на IP сервера.

---

## Шаг 1. Загрузить проект на сервер
Проще всего через git (папка `/var/www/fkis`):

```bash
sudo apt update && sudo apt install -y git
sudo git clone https://github.com/Aleks-333-ru/fkis-jobs.git /var/www/fkis
```

(Или залейте файлы вручную через SFTP в `/var/www/fkis`.)

## Шаг 2. Установить Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v      # должно показать v20.x
```

## Шаг 3. Проверить, что сервер запускается
```bash
cd /var/www/fkis
node server.js
# в другом окне:  curl http://localhost:3000    → должен вернуться HTML
# остановить: Ctrl+C
```
Если в браузере/curl приходит страница — приложение работает.

## Шаг 4. Автозапуск через systemd (чтобы работал всегда)
```bash
sudo cp /var/www/fkis/deploy/fkis.service /etc/systemd/system/fkis.service
sudo systemctl daemon-reload
sudo systemctl enable --now fkis
sudo systemctl status fkis      # должно быть active (running)
```

## Шаг 5. nginx + домен
```bash
sudo apt install -y nginx
sudo cp /var/www/fkis/deploy/nginx-fkis.conf /etc/nginx/sites-available/fkis
# ВАЖНО: замените ВАШ_ДОМЕН в файле на реальный домен:
sudo nano /etc/nginx/sites-available/fkis
sudo ln -s /etc/nginx/sites-available/fkis /etc/nginx/sites-enabled/fkis
sudo nginx -t && sudo systemctl reload nginx
```
Откройте `http://ВАШ_ДОМЕН` — сайт должен открыться.

## Шаг 6. HTTPS (бесплатный сертификат Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ВАШ_ДОМЕН -d www.ВАШ_ДОМЕН
```
Certbot сам добавит HTTPS (443) и перенаправление с http на https.

---

## Шаг 7. Обновить домен в коде и ключах
1. **Мета-теги** в `public/index.html`: замените `https://fkis-jobs.onrender.com`
   на `https://ВАШ_ДОМЕН` (это Open Graph и canonical — для красивого превью
   ссылки). Найти: строки с `og:url`, `og:image`, `twitter:image`, `canonical`.
2. **Ключ Яндекс.Карт**: в кабинете разработчика Яндекса добавьте `ВАШ_ДОМЕН`
   в разрешённые (HTTP Referer) для ключа карт — иначе карта не отрисуется.
3. После правок в коде на сервере: `sudo systemctl restart fkis`.

## Ключи источников (по желанию)
- **SuperJob** — задаётся переменной `SUPERJOB_KEY`. Впишите её в
  `deploy/fkis.service` (строка `Environment=`) и `systemctl restart fkis`.
- hh.ru и «Работа России» ключей не требуют.

---

## Конструктор резюме (`/resume/`)

Конструктор резюме — отдельное React-приложение в папке `resume-app/`. Оно
**собирается заранее на вашем компьютере**, а готовый результат кладётся в
`public/resume/` и хранится в репозитории вместе с сайтом. Поэтому **на сервере
ничего собирать не нужно** — сервер по-прежнему просто отдаёт статику через
`node server.js`, без установки зависимостей.

Как пересобрать после правок в `resume-app/` (локально, где стоит Node.js):
```bash
cd resume-app
npm install        # только в первый раз
npm run build      # положит свежую сборку в ../public/resume
```
Затем закоммитьте изменения в `public/resume/` и `git push`. На сервере —
обычное обновление (см. ниже). Ключей и внешних сервисов конструктор не требует:
данные хранятся в браузере пользователя, PDF формируется печатью страницы.

## Обновление сайта в будущем
```bash
cd /var/www/fkis
sudo git pull
sudo systemctl restart fkis
```

## Ответ на вопрос «должно заработать, если закину файлы?»
Само по себе — нет: нужны шаги 2–6 (Node.js + запуск + nginx + HTTPS). Но всё
готово и расписано выше. Хорошая новость: с **российского IP** вашего сервера
hh.ru и «Работа России» должны отдавать данные без блокировок (в отличие от
зарубежного хостинга).
