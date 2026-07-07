import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const distDir = "dist";
const cloudflareDir = `${distDir}/cloudflare`;
const standaloneHtmlPath = `${distDir}/zahradni-dashboard-standalone.html`;
const cloudflareZipPath = `${distDir}/zahradni-dashboard-cloudflare.zip`;
const shouldCreateZip = process.argv.includes("--zip");

function inlineAssets(html, css, dataJs, appJs) {
  return html
    .replace('  <link rel="stylesheet" href="styles.css">\n', `  <style>\n${css}\n  </style>\n`)
    .replace('  <script src="data.js"></script>\n  <script src="app.js"></script>', `  <script>\n${dataJs}\n  </script>\n  <script>\n${appJs}\n  </script>`);
}

async function createStandaloneHtml() {
  const [html, css, dataJs, appJs] = await Promise.all([
    readFile("index.html", "utf8"),
    readFile("styles.css", "utf8"),
    readFile("data.js", "utf8"),
    readFile("app.js", "utf8"),
  ]);

  await writeFile(standaloneHtmlPath, inlineAssets(html, css, dataJs, appJs));
}

async function createCloudflarePackage() {
  await rm(cloudflareDir, { recursive: true, force: true });
  await mkdir(cloudflareDir, { recursive: true });

  await Promise.all([
    copyFile("index.html", `${cloudflareDir}/index.html`),
    copyFile("styles.css", `${cloudflareDir}/styles.css`),
    copyFile("data.js", `${cloudflareDir}/data.js`),
    copyFile("app.js", `${cloudflareDir}/app.js`),
    copyFile("README.md", `${cloudflareDir}/README.md`),
    copyFile("DESIGN_SYSTEM.md", `${cloudflareDir}/DESIGN_SYSTEM.md`),
    copyFile("DATA_GOVERNANCE.md", `${cloudflareDir}/DATA_GOVERNANCE.md`),
    cp("records", `${cloudflareDir}/records`, { recursive: true }),
    cp("assets", `${cloudflareDir}/assets`, { recursive: true }),
  ]);

  await Promise.all([
    rm(`${cloudflareDir}/.DS_Store`, { force: true }),
    rm(`${cloudflareDir}/assets/.DS_Store`, { force: true }),
  ]);

  if (shouldCreateZip) {
    await rm(cloudflareZipPath, { force: true });
    await run("zip", ["-qr", "../zahradni-dashboard-cloudflare.zip", ".", "-x", "*.DS_Store", "__MACOSX/*"], {
      cwd: cloudflareDir,
    });
  }
}

await mkdir(distDir, { recursive: true });
await createStandaloneHtml();
await createCloudflarePackage();

console.log(`Standalone HTML: ${standaloneHtmlPath}`);
if (shouldCreateZip) {
  console.log(`Cloudflare ZIP: ${cloudflareZipPath}`);
} else {
  console.log(`Cloudflare output: ${cloudflareDir}`);
}
