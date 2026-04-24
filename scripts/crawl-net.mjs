#!/usr/bin/env node
/**
 * scripts/crawl-net.mjs
 * Phase 9 / Plan 09-03 — Fallback crawl script for proactivsports.net.
 * Uses Node.js 22 built-in fetch + recursive HTML link extraction.
 *
 * Usage:
 *   node scripts/crawl-net.mjs [--start-url=https://proactivsports.net] [--output=PATH]
 *
 * Output: CSV with columns: url,status,redirect_to,discovered_from,domain,error
 *
 * Preferred: Run Screaming Frog SEO Spider (free, ≤500 URLs) instead.
 * This script is a fallback for when Screaming Frog is unavailable.
 *
 * Crawl all three legacy properties:
 *   node scripts/crawl-net.mjs --start-url=https://proactivsports.net
 *   node scripts/crawl-net.mjs --start-url=https://hk.proactivsports.net \
 *     --output=.planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY-HK.csv
 *   node scripts/crawl-net.mjs --start-url=https://sg.proactivsports.net \
 *     --output=.planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY-SG.csv
 */

import { writeFileSync } from "fs";
import { URL } from "url";

const DEFAULT_START = "https://proactivsports.net";
const DEFAULT_OUTPUT = ".planning/phases/09-legacy-net-migration-security/NET-URL-INVENTORY.csv";
const MAX_URLS = 500;
const CONCURRENCY = 3;
const DELAY_MS = 300;

const args = process.argv.slice(2);
const startUrl = args.find((a) => a.startsWith("--start-url="))?.split("=")[1] ?? DEFAULT_START;
const outputPath = args.find((a) => a.startsWith("--output="))?.split("=")[1] ?? DEFAULT_OUTPUT;

const startDomain = new URL(startUrl).hostname;
const visited = new Set();
const queue = [startUrl];
const results = [];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "ProActivBot/1.0 (+https://proactivsports.com/)" },
      signal: AbortSignal.timeout(10000),
    });
    const status = res.status;
    const redirectTo = res.headers.get("location") ?? "";

    let links = [];
    if (status >= 200 && status < 300) {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("text/html")) {
        const html = await res.text();
        links = extractLinks(html, url);
      }
    }
    return { status, redirectTo, links };
  } catch (err) {
    return { status: 0, redirectTo: "", links: [], error: err.message };
  }
}

function extractLinks(html, baseUrl) {
  const base = new URL(baseUrl);
  const hrefs = [...html.matchAll(/href=["']([^"'#?][^"']*?)["']/gi)].map((m) => m[1]);
  const links = [];
  for (const href of hrefs) {
    try {
      const abs = new URL(href, base).href;
      const parsed = new URL(abs);
      if (parsed.hostname === startDomain && parsed.protocol.startsWith("http")) {
        links.push(abs.split("?")[0].split("#")[0]); // strip query + fragment
      }
    } catch {
      // ignore malformed hrefs
    }
  }
  return [...new Set(links)];
}

async function crawl() {
  console.log(`Crawling ${startUrl} (max ${MAX_URLS} URLs, concurrency ${CONCURRENCY})...`);

  while (queue.length > 0 && results.length < MAX_URLS) {
    const batch = queue.splice(0, CONCURRENCY);
    await Promise.all(
      batch.map(async (url) => {
        if (visited.has(url)) return;
        visited.add(url);

        const { status, redirectTo, links, error } = await fetchPage(url);
        const row = {
          url,
          status,
          redirect_to: redirectTo,
          discovered_from: startUrl,
          domain: startDomain,
          error: error ?? "",
        };
        results.push(row);
        process.stdout.write(`  [${results.length}] ${status} ${url}\n`);

        if (links) {
          for (const link of links) {
            if (!visited.has(link) && !queue.includes(link)) {
              queue.push(link);
            }
          }
        }
      }),
    );
    await sleep(DELAY_MS);
  }
}

function writeCSV(rows, path) {
  const headers = ["url", "status", "redirect_to", "discovered_from", "domain", "error"];
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ];
  writeFileSync(path, lines.join("\n") + "\n", "utf-8");
  console.log(`\nWrote ${rows.length} rows to ${path}`);
}

crawl().then(() => {
  writeCSV(results, outputPath);
  console.log("Crawl complete.");
});
