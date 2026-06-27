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
// hh.ru и «Работа России» работают без ключей. SuperJob и Jooble — по бесплатному
// ключу. Пока ключ пустой, источник просто отключён (ошибок не будет).
//   SuperJob:  получить на  https://api.superjob.ru/register
//   Jooble:    получить на  https://jooble.org/api/about
// Удобнее задавать через переменные окружения, чтобы не хранить ключи в коде:
//   SUPERJOB_KEY=... JOOBLE_KEY=... node server.js
const SUPERJOB_KEY = process.env.SUPERJOB_KEY || '';
const JOOBLE_KEY = process.env.JOOBLE_KEY || '';

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

// --- Запрос к hh.ru ----------------------------------------------------------
async function fetchHH(userText, page = 0) {
  const text = userText ? `${HH_QUERY} AND (${userText})` : HH_QUERY;
  const url = new URL('https://api.hh.ru/vacancies');
  url.searchParams.set('text', text);
  url.searchParams.set('per_page', '100');
  url.searchParams.set('page', String(page));
  url.searchParams.set('order_by', 'publication_time');

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'FKiS-Jobs/1.0 (aleksandr220395@gmail.com)',
      'Accept': 'application/json',
      'Accept-Language': 'ru,en;q=0.9',
    },
  });
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
    category: categorize(v.name),
  }));
}

// --- Запрос к «Работа России» (trudvsem) ------------------------------------
// У trudvsem полнотекстовый поиск, поэтому делаем несколько коротких запросов
// и объединяем результаты.
async function fetchTrudvsemOne(term, page = 0) {
  const url = new URL('https://opendata.trudvsem.ru/api/v1/vacancies');
  url.searchParams.set('text', term);
  url.searchParams.set('limit', '50');
  url.searchParams.set('offset', String(page * 50));

  const res = await fetch(url);
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
      description: (v.duty || '').replace(/<[^>]+>/g, ''),
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

  const res = await fetch(url, { headers: { 'X-Api-App-Id': SUPERJOB_KEY } });
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
    category: categorize(v.profession),
  }));
}

async function fetchSuperJob(userText, page = 0) {
  const terms = userText ? [userText] : FKIS_TERMS;
  const settled = await Promise.allSettled(terms.map((t) => fetchSuperJobOne(t, page)));
  const all = [];
  for (const r of settled) if (r.status === 'fulfilled') all.push(...r.value);
  return all;
}

// --- Запрос к Jooble (агрегатор: hh, Авито, Rabota.ru и др.) ------------------
// POST с ключом в пути URL. Зарплата приходит строкой — вытаскиваем числа.
function parseSalary(str = '') {
  const nums = (String(str).replace(/\s/g, '').match(/\d{4,7}/g) || []).map(Number);
  if (nums.length >= 2) return { from: nums[0], to: nums[1] };
  if (nums.length === 1) return /до/i.test(str) ? { from: null, to: nums[0] } : { from: nums[0], to: null };
  return { from: null, to: null };
}

async function fetchJooble(userText, page = 0) {
  const keywords = userText || 'тренер, инструктор, фитнес, учитель физической культуры, методист';
  const res = await fetch('https://jooble.org/api/' + JOOBLE_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords, page: String(page + 1) }),
  });
  if (!res.ok) throw new Error('Jooble ответил ' + res.status);
  const data = await res.json();

  return (data.jobs || []).map((v) => {
    const s = parseSalary(v.salary || '');
    return {
      id: 'jb:' + (v.id || Math.random().toString(36).slice(2)),
      source: 'jooble',
      title: v.title || '',
      company: v.company || 'Не указана',
      region: v.location || '',
      salaryFrom: s.from,
      salaryTo: s.to,
      currency: 'RUR',
      employment: v.type || '',
      schedule: '',
      url: v.link || '',
      publishedAt: v.updated || '',
      description: (v.snippet || '').replace(/<[^>]+>/g, '').trim(),
      category: categorize(v.title),
    };
  });
}

// --- Сборка: тянем источники, склеиваем, убираем дубли -----------------------
async function getVacancies({ text, sources, page = 0 }) {
  const want = sources && sources.length ? sources : ['hh', 'trudvsem', 'superjob', 'jooble'];
  const tasks = [];
  const errors = [];
  if (want.includes('hh')) tasks.push(fetchHH(text, page));
  if (want.includes('trudvsem')) tasks.push(fetchTrudvsem(text, page));
  if (want.includes('superjob')) {
    if (SUPERJOB_KEY) tasks.push(fetchSuperJob(text, page));
    else errors.push('SuperJob отключён: не задан ключ SUPERJOB_KEY');
  }
  if (want.includes('jooble')) {
    if (JOOBLE_KEY) tasks.push(fetchJooble(text, page));
    else errors.push('Jooble отключён: не задан ключ JOOBLE_KEY');
  }

  const settled = await Promise.allSettled(tasks);
  let merged = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') merged.push(...r.value);
    else errors.push(String(r.reason?.message || r.reason));
  }

  // Дедупликация по «название + работодатель»
  const seen = new Set();
  merged = merged.filter((v) => {
    const key = (v.title + '|' + v.company).toLowerCase().replace(/\s+/g, ' ').trim();
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

  return { vacancies: merged, errors };
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

// --- Сервер ------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');

  if (u.pathname === '/api/vacancies') {
    try {
      const text = (u.searchParams.get('text') || '').trim();
      const sources = (u.searchParams.get('source') || '').split(',').filter(Boolean);
      const page = parseInt(u.searchParams.get('page'), 10) || 0;
      const result = await getVacancies({ text, sources, page });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
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
