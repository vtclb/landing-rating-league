import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

import "./validate-static.mjs";

const dist = "dist";
const repoName =
  process.env.GITHUB_PAGES === "true"
    ? process.env.GITHUB_PAGES_REPO || "landing-rating-league"
    : "";
const basePath = repoName ? `/${repoName}/` : "./";

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

let html = await readFile("index.html", "utf8");
html = html
  .replace(/href="\.\/styles\.css([^"]*)"/, `href="${basePath}styles.css$1"`)
  .replace(/src="\.\/script\.js([^"]*)"/, `src="${basePath}script.js$1"`);

await writeFile(`${dist}/index.html`, html);
await cp("styles.css", `${dist}/styles.css`);
await cp("script.js", `${dist}/script.js`);

console.log(`Static landing built to ${dist} with base ${basePath}`);
