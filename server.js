// ============================================================================
//  Вакансии ФКиС — локальный сервер-посредник (без внешних зависимостей)
//  Запуск:  node server.js     →  http://localhost:3000
//  Требуется Node.js 18+ (в нём есть встроенный fetch).
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// --- Базовые поисковые термины для сферы «физическая культура и спорт» --------
// Их можно править под себя: добавить/убрать профессии.
const FKIS_TERMS = [
  'тренер',
  'инструктор по спорту',
  'учитель физкультуры',
  'преподаватель физической культуры',
  'фитнес',
  'инструктор тренажёрного зала',
  'спортивный методист',
];

// hh.ru понимает язык запросов с OR/кавычками — собираем один запрос.
const HH_QUERY = '(тренер OR инструктор OR фитнес OR "учитель физической культуры" OR "учитель физкультуры" OR "физическая культура" OR "спортивный")';

// --- Ключи API дополнительных источников -------------------------------------
// hh.ru и «Работа России» работают без ключей. SuperJob — по бесплатному ключу.
// Пока ключ пустой, источник просто отключён (ошибок не будет).
//   SuperJob:  получить на  https://api.superjob.ru/register
// Удобнее задавать через переменную окружения, чтобы не хранить ключ в коде:
//   SUPERJOB_KEY=... node server.js
const SUPERJOB_KEY = process.env.SUPERJOB_KEY || '';

// --- Авторизация hh.ru (по желанию) -------------------------------------------
// Публичные вакансии hh отдаёт и без ключей, но авторизованные запросы
// надёжнее (лимиты выше, меньше шансов на блокировку анти-ботом).
// Задайте в .env либо готовый токен, либо пару Client ID/Secret приложения —
// тогда сервер сам получит и будет обновлять токен приложения:
//   HH_ACCESS_TOKEN=...          (если токен уже есть)
//   HH_CLIENT_ID=... HH_CLIENT_SECRET=...   (получим токен сами)
const HH_ACCESS_TOKEN = process.env.HH_ACCESS_TOKEN || '';
const HH_CLIENT_ID = process.env.HH_CLIENT_ID || '';
const HH_CLIENT_SECRET = process.env.HH_CLIENT_SECRET || '';

// Таймаут запроса к внешнему источнику: кто не успел — пропускаем,
// чтобы один зависший API не держал всю выдачу.
const FETCH_TIMEOUT_MS = 12000;
const withTimeout = () => AbortSignal.timeout(FETCH_TIMEOUT_MS);

// --- Категория должности по названию вакансии --------------------------------
function categorize(title = '') {
  const t = title.toLowerCase();
  if (/трен[её]р/.test(t)) return 'Тренер';
  if (/(учител|преподавател).*(физ|культур)|физкультур/.test(t)) return 'Учитель ФК';
  if (/инструктор/.test(t)) return 'Инструктор';
  if (/фитнес/.test(t)) return 'Фитнес';
  if (/методист/.test(t)) return 'Методист';
  return 'Другое';
}

// Профильность вакансии по названию. SuperJob ищет по широким ключевым словам
// и отдаёт мусор («Продавец-консультант…»), поэтому требуем в названии явные
// слова из сферы физкультуры и спорта.
function isRelevant(title = '') {
  const t = String(title).toLowerCase();
  // явно непрофильный («корпоративный»/торговый/сервисный) контекст — сразу отсекаем
  if (/бизнес[\s-]*трен|трен\S*\s+по\s+(продаж|обучени|персонал|сервис|рост)|корпоративн|менеджер|автомобил|автосервис|\bавто\b|вождени|продаж|сервис\S*\s+автомоб|механик|техническ\S*\s+трен|\bmajor\b|слесар|сантехник|электрик|обслуживани\S*\s+здан|продавец|кассир|консультант|администратор|ресепшен|промо|оборудовани|барист|официант|уборщ|охранн|горничн|грузчик|водител|автотренаж|симулятор|инженер|эксплуатаци|визуализатор|маркетинг|маркетолог/.test(t)) return false;
  // явные профильные слова
  if (/трен[её]р|фитнес|физкультур|спорт|плавани|лыжн|гимнаст|атлет|единоборств|тренаж[её]р|оздоровит|(^|\s)гто(\s|$)|(^|\s)лфк(\s|$)|бассейн|физическ\S*\s+культ/.test(t)) return true;
  // «инструктор/методист/преподаватель/учитель» — только в спортивном контексте
  if (/инструктор|методист|преподавател|учител/.test(t)
      && /физ|спорт|адаптивн|плавани|фитнес|трен|лыж|гимнаст|секци|культур/.test(t)) return true;
  return false;
}

// Убирает html-теги и схлопывает пробелы
function clean(s = '') {
  return String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Очищает адрес. API «Работы России» часто склеивает два варианта адреса
// подряд, и второй начинается с повтора региона. Берём только первый полный
// адрес — до того места, где первый сегмент (регион) встречается снова.
function cleanAddress(s = '') {
  const parts = String(s).split(',').map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return '';
  const norm = (p) => p.toLowerCase().replace(/\s+/g, ' ');
  const region = norm(parts[0]);
  const out = [parts[0]];
  const seen = new Set([region]);
  for (let i = 1; i < parts.length; i++) {
    const key = norm(parts[i]);
    if (key === region) break;   // начался повтор адреса — обрываем
    if (seen.has(key)) continue; // дубль сегмента внутри адреса — пропускаем
    seen.add(key);
    out.push(parts[i]);
  }
  return out.join(', ').replace(/[;,\s]+$/, '');
}

// Русское склонение слова «год» для опыта работы (1 год, 2 года, 5 лет)
function yearsWord(n) {
  const a = Math.abs(n) % 100, b = n % 10;
  if (a > 10 && a < 20) return 'лет';
  if (b === 1) return 'год';
  if (b >= 2 && b <= 4) return 'года';
  return 'лет';
}

// Токен приложения hh: берём из .env или получаем по Client ID/Secret.
// Держим в памяти; при 403/401 сбрасываем и пробуем получить заново
// (hh позволяет запрашивать новый токен приложения не чаще раза в 5 минут).
let hhToken = HH_ACCESS_TOKEN;
let hhTokenFetchedAt = 0;
async function getHHToken() {
  if (hhToken) return hhToken;
  if (!HH_CLIENT_ID || !HH_CLIENT_SECRET) return '';
  if (Date.now() - hhTokenFetchedAt < 5 * 60 * 1000) return '';
  hhTokenFetchedAt = Date.now();
  try {
    const res = await fetch('https://api.hh.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'FKiS-Jobs/1.0 (aleksandr220395@gmail.com)',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: HH_CLIENT_ID,
        client_secret: HH_CLIENT_SECRET,
      }),
      signal: withTimeout(),
    });
    if (!res.ok) throw new Error('hh token: ' + res.status);
    const data = await res.json();
    hhToken = data.access_token || '';
    if (hhToken) console.log('  hh.ru: токен приложения получен');
    return hhToken;
  } catch (e) {
    console.warn('  hh.ru: не удалось получить токен приложения —', e.message);
    return '';
  }
}

// --- Запрос к hh.ru ----------------------------------------------------------
async function fetchHH(userText, page = 0) {
  const text = userText ? `${HH_QUERY} AND (${userText})` : HH_QUERY;
  const url = new URL('https://api.hh.ru/vacancies');
  url.searchParams.set('text', text);
  // Ищем только в названии вакансии — иначе hh находит запрос в описаниях
  // («спортивный зал» в списке льгот приводит комплектовщиков и инженеров).
  url.searchParams.set('search_field', 'name');
  url.searchParams.set('area', '113'); // только Россия
  url.searchParams.set('per_page', '100');
  url.searchParams.set('page', String(page));
  url.searchParams.set('order_by', 'publication_time');

  const headers = {
    'User-Agent': 'FKiS-Jobs/1.0 (aleksandr220395@gmail.com)',
    'Accept': 'application/json',
    'Accept-Language': 'ru,en;q=0.9',
  };
  const token = await getHHToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(url, { headers, signal: withTimeout() });
  if (res.status === 401 || res.status === 403) {
    // токен мог протухнуть/быть отозванным — сбросим, чтобы получить новый
    if (token) hhToken = '';
    throw new Error('hh.ru ответил ' + res.status);
  }
  if (!res.ok) throw new Error('hh.ru ответил ' + res.status);
  const data = await res.json();

  return (data.items || []).map((v) => ({
    id: 'hh:' + v.id,
    source: 'hh',
    title: v.name || '',
    company: v.employer?.name || 'Не указана',
    region: v.area?.name || '',
    salaryFrom: v.salary?.from ?? null,
    salaryTo: v.salary?.to ?? null,
    currency: v.salary?.currency || 'RUR',
    employment: v.employment?.name || '',
    schedule: v.schedule?.name || '',
    url: v.alternate_url || '',
    publishedAt: v.published_at || '',
    description: [v.snippet?.responsibility, v.snippet?.requirement]
      .filter(Boolean).join(' ').replace(/<[^>]+>/g, ''),
    requirement: clean(v.snippet?.requirement),
    address: cleanAddress(v.address?.raw
      || [v.address?.city, v.address?.street, v.address?.building].filter(Boolean).join(', ')),
    category: categorize(v.name),
  })).filter((v) => isRelevant(v.title));
}

// --- Запрос к «Работа России» (trudvsem) ------------------------------------
// У trudvsem полнотекстовый поиск, поэтому делаем несколько коротких запросов
// и объединяем результаты.
async function fetchTrudvsemOne(term, page = 0) {
  const url = new URL('https://opendata.trudvsem.ru/api/v1/vacancies');
  url.searchParams.set('text', term);
  url.searchParams.set('limit', '50');
  url.searchParams.set('offset', String(page * 50));

  const res = await fetch(url, { signal: withTimeout() });
  if (!res.ok) throw new Error('trudvsem ответил ' + res.status);
  const data = await res.json();
  const list = data?.results?.vacancies || [];

  return list.map((item) => {
    const v = item.vacancy || {};
    return {
      id: 'tv:' + (v.id || Math.random().toString(36).slice(2)),
      source: 'trudvsem',
      title: v['job-name'] || '',
      company: v.company?.name || 'Не указана',
      region: v.region?.name || '',
      salaryFrom: v.salary_min ?? null,
      salaryTo: v.salary_max ?? null,
      currency: v.currency || 'RUR',
      employment: v.employment || '',
      schedule: v.schedule || '',
      url: v.vac_url || '',
      publishedAt: v['creation-date'] || '',
      description: clean(v.duty),
      requirement: (() => {
        const parts = [];
        const edu = v.requirement?.education;
        const exp = v.requirement?.experience;
        if (edu) parts.push(edu);
        if (exp != null) parts.push(exp > 0 ? `опыт от ${exp} ${yearsWord(exp)}` : 'без опыта');
        return parts.join(' · ');
      })(),
      address: cleanAddress(v.addresses?.address?.[0]?.location || ''),
      category: categorize(v['job-name']),
    };
  });
}

async function fetchTrudvsem(userText, page = 0) {
  const terms = userText ? [userText] : FKIS_TERMS;
  const settled = await Promise.allSettled(terms.map((t) => fetchTrudvsemOne(t, page)));
  const all = [];
  for (const r of settled) if (r.status === 'fulfilled') all.push(...r.value);
  return all;
}

// --- Запрос к SuperJob -------------------------------------------------------
// Требует заголовок X-Api-App-Id с секретным ключом приложения.
async function fetchSuperJobOne(term, page = 0) {
  const url = new URL('https://api.superjob.ru/2.0/vacancies/');
  url.searchParams.set('keyword', term);
  url.searchParams.set('count', '100');
  url.searchParams.set('page', String(page));

  const res = await fetch(url, { headers: { 'X-Api-App-Id': SUPERJOB_KEY }, signal: withTimeout() });
  if (!res.ok) throw new Error('SuperJob ответил ' + res.status);
  const data = await res.json();

  return (data.objects || []).map((v) => ({
    id: 'sj:' + v.id,
    source: 'superjob',
    title: v.profession || '',
    company: v.firm_name || v.client?.title || 'Не указана',
    region: v.town?.title || '',
    salaryFrom: v.payment_from || null,
    salaryTo: v.payment_to || null,
    currency: v.currency || 'rub',
    employment: v.type_of_work?.title || '',
    schedule: v.place_of_work?.title || '',
    url: v.link || '',
    publishedAt: v.date_published ? new Date(v.date_published * 1000).toISOString() : '',
    description: (v.candidat || v.vacancyRichText || '').replace(/<[^>]+>/g, '').trim(),
    requirement: clean(v.candidat),
    address: cleanAddress(v.address || ''),
    category: categorize(v.profession),
  })).filter((v) => isRelevant(v.title));
}

async function fetchSuperJob(userText, page = 0) {
  const terms = userText ? [userText] : FKIS_TERMS;
  const settled = await Promise.allSettled(terms.map((t) => fetchSuperJobOne(t, page)));
  const all = [];
  for (const r of settled) if (r.status === 'fulfilled') all.push(...r.value);
  return all;
}

// --- Сборка: тянем источники, склеиваем, убираем дубли -----------------------
async function getVacancies({ text, sources, page = 0 }) {
  const want = sources && sources.length ? sources : ['hh', 'trudvsem', 'superjob'];
  const tasks = [];
  const errors = [];   // реальные сбои — показываются посетителям
  const notices = [];  // служебные заметки — только в консоль/для администратора
  if (want.includes('hh')) tasks.push(fetchHH(text, page));
  if (want.includes('trudvsem')) tasks.push(fetchTrudvsem(text, page));
  if (want.includes('superjob')) {
    if (SUPERJOB_KEY) tasks.push(fetchSuperJob(text, page));
    else notices.push('SuperJob отключён: не задан ключ SUPERJOB_KEY');
  }

  const settled = await Promise.allSettled(tasks);
  let merged = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') merged.push(...r.value);
    else errors.push(String(r.reason?.message || r.reason));
  }

  // Дедупликация по «название + работодатель + регион».
  // Регион обязателен в ключе: сетевые работодатели публикуют одинаковые
  // вакансии в разных городах — это разные вакансии, а не дубли.
  const seen = new Set();
  merged = merged.filter((v) => {
    const key = (v.title + '|' + v.company + '|' + (v.region || ''))
      .toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Сортируем: сначала с указанной зарплатой, затем по дате
  merged.sort((a, b) => {
    const sa = a.salaryFrom || a.salaryTo || 0;
    const sb = b.salaryFrom || b.salaryTo || 0;
    if (!!sb !== !!sa) return sb ? 1 : -1;
    return (b.publishedAt || '').localeCompare(a.publishedAt || '');
  });

  return { vacancies: merged, errors, notices };
}

// --- Статика -----------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  const file = path.join(__dirname, 'public', p);
  if (!file.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}

// --- Кеш ответов API ----------------------------------------------------------
// Вакансии меняются нечасто, а каждый запрос к /api/vacancies стоит до 15
// обращений к внешним API. Кешируем готовый ответ на 10 минут: сайт отвечает
// мгновенно, источники не перегружаются (меньше шансов попасть под анти-бот).
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 100;
const apiCache = new Map(); // key -> { at, body }

function cacheGet(key) {
  const hit = apiCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) { apiCache.delete(key); return null; }
  return hit.body;
}
function cacheSet(key, body) {
  if (apiCache.size >= CACHE_MAX) {
    // выселяем самый старый ключ
    const oldest = apiCache.keys().next().value;
    apiCache.delete(oldest);
  }
  apiCache.set(key, { at: Date.now(), body });
}

// --- Сервер ------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');

  if (u.pathname === '/api/vacancies') {
    try {
      const text = (u.searchParams.get('text') || '').trim();
      const sources = (u.searchParams.get('source') || '').split(',').filter(Boolean);
      const page = parseInt(u.searchParams.get('page'), 10) || 0;

      const key = `${text.toLowerCase()}|${[...sources].sort().join(',')}|${page}`;
      let body = cacheGet(key);
      if (!body) {
        const result = await getVacancies({ text, sources, page });
        body = JSON.stringify(result);
        // не кешируем полностью неудачные ответы (все источники упали)
        if (result.vacancies.length || !result.errors.length) cacheSet(key, body);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ vacancies: [], errors: [String(e.message || e)] }));
    }
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`\n  Вакансии ФКиС запущены:  http://localhost:${PORT}\n`);
});
