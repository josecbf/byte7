/* eslint-disable no-console */
/**
 * Gera screenshots de cada tela do projeto Byte7 Demo.
 *
 * Sobe o servidor Next em http://localhost:3100 (precisa estar rodando)
 * e usa Playwright para capturar full-page de cada rota — pública, admin
 * autenticado e investidor autenticado. Os PNGs vão para docs/screenshots.
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const OUT_DIR = resolve(process.cwd(), "docs/screenshots");
const VIEWPORT = { width: 1440, height: 900 };

const SESSION_COOKIE = "byte7_session";

function encodeSession(session) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64");
}

const ADMIN_SESSION = encodeSession({
  userId: "usr_admin_1",
  role: "admin",
  name: "Admin Byte7"
});
const INVESTOR_SESSION = encodeSession({
  userId: "usr_inv_1",
  role: "investor",
  name: "Marina Azevedo"
});

const PUBLIC_ROUTES = [
  ["home", "/"],
  ["sobre", "/sobre"],
  ["valores", "/valores"],
  ["produtos", "/produtos"],
  ["blog", "/blog"],
  ["blog-post", "/blog/como-a-tokenizacao-de-energia-funciona"]
];

const AUTH_ROUTES = [
  ["admin-login", "/admin/login"],
  ["investidor-login", "/investidor/login"]
];

const ADMIN_ROUTES = [
  ["admin-overview", "/admin"],
  ["admin-dashboard", "/admin/dashboard"],
  ["admin-posts", "/admin/posts"],
  ["admin-posts-new", "/admin/posts/new"],
  ["admin-posts-edit", "/admin/posts/post_001/edit"],
  ["admin-investidores", "/admin/investidores"],
  ["admin-investidores-new", "/admin/investidores/new"],
  ["admin-investidores-edit", "/admin/investidores/inv_001/edit"]
];

const INVESTOR_ROUTES = [
  ["investidor-overview", "/investidor"],
  ["investidor-aportes", "/investidor/aportes"],
  ["investidor-contrato", "/investidor/contrato"],
  ["investidor-usinas", "/investidor/usinas"]
];

function cookieFor(value) {
  return {
    name: SESSION_COOKIE,
    value,
    domain: "localhost",
    path: "/",
    httpOnly: false,
    sameSite: "Lax",
    secure: false
  };
}

async function captureGroup(browser, label, sessionCookie, routes) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo"
  });
  if (sessionCookie) await context.addCookies([cookieFor(sessionCookie)]);

  const page = await context.newPage();
  for (const [name, route] of routes) {
    const url = `${BASE_URL}${route}`;
    process.stdout.write(`  [${label}] ${name.padEnd(28)} → ${route}\n`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    } catch (err) {
      console.warn(`    networkidle falhou (${err.message}); tentando domcontentloaded`);
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    }
    await page.waitForTimeout(800);
    const file = resolve(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
  }
  await context.close();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  try {
    console.log("Capturando telas públicas…");
    await captureGroup(browser, "site", null, PUBLIC_ROUTES);
    console.log("Capturando telas de login…");
    await captureGroup(browser, "auth", null, AUTH_ROUTES);
    console.log("Capturando telas do admin…");
    await captureGroup(browser, "admin", ADMIN_SESSION, ADMIN_ROUTES);
    console.log("Capturando telas do investidor…");
    await captureGroup(browser, "investor", INVESTOR_SESSION, INVESTOR_ROUTES);
  } finally {
    await browser.close();
  }
  console.log(`\nPronto. Screenshots em ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
