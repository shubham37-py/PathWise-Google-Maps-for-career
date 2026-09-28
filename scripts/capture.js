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

  // 1. Profile Builder Desktop Light (1440x900)
  console.log("Capturing Profile Builder (Desktop Light)...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000?tab=profile&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "profile-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "profile-1440-light.png") });

  // 2. Profile Builder Desktop Dark (1440x900)
  console.log("Capturing Profile Builder (Desktop Dark)...");
  await page.goto("http://localhost:3000?tab=profile&theme=dark", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "profile-1440-dark.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "profile-1440-dark.png") });

  // 3. Profile Builder Mobile Light (375x812)
  console.log("Capturing Profile Builder (Mobile Light)...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000?tab=profile&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "profile-375-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "profile-375-light.png") });

  // 4. Landing Page Desktop Light (1440x900)
  console.log("Capturing Landing Page (Desktop Light)...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000?tab=landing&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "landing-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "landing-1440-light.png") });

  await browser.close();
  console.log("Profile & Landing screenshots captured successfully.");
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
