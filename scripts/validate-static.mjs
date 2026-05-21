import { access, readFile } from "node:fs/promises";

const requiredFiles = ["index.html", "styles.css", "script.js", "README.md"];

await Promise.all(requiredFiles.map((file) => access(file)));

const html = await readFile("index.html", "utf8");
const requiredSnippets = [
  "LASERTAG",
  "RANKING LEAGUE",
  "Грай.",
  "Заробляй очки.",
  "Рости в рейтингу.",
  "D",
  "C",
  "B",
  "A",
  "S",
  "Найближча рейтингова гра"
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing required landing content: ${snippet}`);
  }
}

console.log("Static landing validation passed.");
