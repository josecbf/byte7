/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Captura screenshots de todas as telas do COOPERGAC para docs/screenshots/.
 * Requer o servidor Next.js rodando em http://localhost:3000.
 *
 * Uso:   node scripts/capture-screens.js
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.resolve(__dirname, "..", "docs", "screenshots");

const PUBLIC_PAGES = [
  { file: "01-home",            path: "/" },
  { file: "02-sobre",           path: "/sobre" },
  { file: "03-valores",         path: "/valores" },
  { file: "04-produtos",        path: "/produtos" },
  { file: "05-blog",            path: "/blog" },
  { file: "06-blog-post",       path: "/blog/como-a-geracao-distribuida-funciona" },
  { file: "07-investidor-login", path: "/investidor/login" },
  { file: "08-admin-login",     path: "/admin/login" }
];

// Páginas protegidas do investidor: precisam de sessão coopergac_session.
// Montamos o cookie no formato que o middleware.ts decodifica (base64 JSON).
function makeSession(role, userId, name) {
  return Buffer.from(JSON.stringify({ userId, role, name }), "utf8").toString("base64");
}

const INVESTOR_SESSION = makeSession("investor", "usr_inv_1", "Marina Azevedo");
const ADMIN_SESSION    = makeSession("admin",    "usr_admin_1", "Admin COOPERGAC");

const PROTECTED_PAGES = [
  { file: "09-investidor-dashboard",  path: "/investidor",           cookie: INVESTOR_SESSION },
  { file: "10-investidor-aportes",    path: "/investidor/aportes",   cookie: INVESTOR_SESSION },
  { file: "11-investidor-usinas",     path: "/investidor/usinas",    cookie: INVESTOR_SESSION },
  { file: "12-investidor-contrato",   path: "/investidor/contrato",  cookie: INVESTOR_SESSION },
  { file: "13-admin-dashboard",       path: "/admin",                cookie: ADMIN_SESSION },
  { file: "14-admin-posts",           path: "/admin/posts",          cookie: ADMIN_SESSION },
  { file: "15-admin-post-new",        path: "/admin/posts/new",      cookie: ADMIN_SESSION },
  { file: "16-admin-investidores",    path: "/admin/investidores",   cookie: ADMIN_SESSION },
  { file: "17-admin-investidor-new",  path: "/admin/investidores/new", cookie: ADMIN_SESSION }
];

async function capture(page, { file, url, cookie }) {
  const cookies = [];
  if (cookie) {
    cookies.push({
      name: "coopergac_session",
      value: cookie,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax"
    });
  }
  if (cookies.length) {
    await page.setCookie(...cookies);
  } else {
    const all = await page.cookies();
    if (all.length) await page.deleteCookie(...all);
  }
  await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
  // Espera extra para gráficos e mapas terminarem de montar.
  await new Promise((r) => setTimeout(r, 1500));
  const dest = path.join(OUT, `${file}.png`);
  await page.screenshot({ path: dest, fullPage: true });
  console.log(`ok  ${file}  <-  ${url}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  try {
    for (const p of PUBLIC_PAGES) {
      await capture(page, { file: p.file, url: BASE + p.path });
    }
    for (const p of PROTECTED_PAGES) {
      await capture(page, { file: p.file, url: BASE + p.path, cookie: p.cookie });
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
