import { chromium } from "../../landing-varta-school-v2/node_modules/playwright/index.mjs";

const outputDir = "C:/Users/Admin/Downloads/lend/landing-rating-league-concept/screenshots";
const url = "http://127.0.0.1:8080/";
const executablePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const browser = await chromium.launch({
  headless: true,
  executablePath
});

async function capture(name, width, height, fullPage = false) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "no-preference"
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}"
  });

  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  }));

  await page.screenshot({
    path: `${outputDir}/${name}.png`,
    fullPage
  });

  await page.close();
  return { name, ...metrics };
}

const results = [
  await capture("desktop-1440", 1440, 900),
  await capture("mobile-390", 390, 844),
  await capture("full-page-desktop", 1440, 900, true),
  await capture("full-page-mobile", 390, 844, true),
  await capture("check-360", 360, 800),
  await capture("check-430", 430, 900)
];

await browser.close();

console.log(JSON.stringify(results, null, 2));
