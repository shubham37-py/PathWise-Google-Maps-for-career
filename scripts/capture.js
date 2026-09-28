const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\user\\.gemini\\antigravity\\brain\\8c38bbad-e4cd-4c09-9f68-078e0fb35c5f\\screenshots";
const LOCAL_DIR = "D:\\Hackathon\\PathWise\\screenshots";

async function main() {
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  page.on("console", (msg) => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}]`, msg.text());
  });

  page.on("pageerror", (err) => {
    console.error("[PAGE ERROR]", err.message);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });

  // 1. Desktop Light (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(LOCAL_DIR, "pathway-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "pathway-1440-light.png") });
  console.log("Saved pathway-1440-light.png");

  // Click on a node or select MBBS pathway to open drawer
  try {
    const node = await page.$(".react-flow__node");
    if (node) {
      await node.click();
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(LOCAL_DIR, "pathway-1440-drawer.png") });
      await page.screenshot({ path: path.join(ARTIFACT_DIR, "pathway-1440-drawer.png") });
      console.log("Saved pathway-1440-drawer.png");
    }
  } catch (e) {
    console.warn("Could not click node:", e.message);
  }

  // 2. Desktop Dark (1440x900)
  await page.goto("http://localhost:3000?theme=dark", { waitUntil: "networkidle0" });
  await page.setViewport({ width: 1440, height: 900 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(LOCAL_DIR, "pathway-1440-dark.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "pathway-1440-dark.png") });
  console.log("Saved pathway-1440-dark.png");

  // 3. Mobile Light (375x812)
  await page.goto("http://localhost:3000?theme=light", { waitUntil: "networkidle0" });
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(LOCAL_DIR, "pathway-375-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "pathway-375-light.png") });
  console.log("Saved pathway-375-light.png");

  // 4. Mobile Dark (375x812)
  await page.goto("http://localhost:3000?theme=dark", { waitUntil: "networkidle0" });
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(LOCAL_DIR, "pathway-375-dark.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "pathway-375-dark.png") });
  console.log("Saved pathway-375-dark.png");

  await browser.close();
  console.log("All screenshots captured successfully.");
}

main().catch((err) => {
  console.error("Capture script error:", err);
  process.exit(1);
});
