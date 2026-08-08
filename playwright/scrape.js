import { chromium } from "playwright";

const URLS = [];
for (let seed = 69; seed <= 78; seed++) {
  URLS.push(`https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`);
}

async function sumTables(page) {
  await page.waitForLoadState("networkidle");

  return await page.evaluate(() => {
    let total = 0;
    document.querySelectorAll("table").forEach(table => {
      const text = table.innerText.replace(/,/g, "");
      const nums = text.match(/-?\d+(\.\d+)?/g) || [];
      nums.forEach(n => (total += Number(n)));
    });
    return total;
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const url of URLS) {
    console.log("Visiting:", url);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    const pageSum = await sumTables(page);
    console.log("Page sum:", pageSum);
    grandTotal += pageSum;
  }

  await browser.close();

  console.log("=================================");
  console.log("TOTAL_SUM:", grandTotal);
  console.log("=================================");
}

main().catch(err => {
  console.error("FAILED:", err);
  process.exit(1);
});