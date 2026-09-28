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

  // 1. What-If Simulator Desktop Light (1440x900)
  console.log("Capturing What-If Simulator...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000?tab=whatif&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  // Click first preset: "I don't get MBBS"
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const text = await (await b.getProperty("innerText")).jsonValue();
    if (text && text.includes("I don't get MBBS")) {
      await b.click();
      await new Promise((r) => setTimeout(r, 800));
      break;
    }
  }
  await page.screenshot({ path: path.join(LOCAL_DIR, "whatif-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "whatif-1440-light.png") });

  // 2. What-If Simulator Mobile Light (375x812)
  console.log("Capturing What-If Simulator (Mobile)...");
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000?tab=whatif&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "whatif-375-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "whatif-375-light.png") });

  // 3. Funding & Loans Desktop Light (1440x900)
  console.log("Capturing Funding & Loans...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000?tab=funding&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "funding-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "funding-1440-light.png") });

  // 4. Institution Comparison Desktop Light (1440x900)
  console.log("Capturing Institution Comparison...");
  await page.goto("http://localhost:3000?tab=comparison&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "comparison-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "comparison-1440-light.png") });

  // 5. Decision Matrix Desktop Light (1440x900)
  console.log("Capturing Decision Matrix...");
  await page.goto("http://localhost:3000?tab=decide&theme=light", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "matrix-1440-light.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "matrix-1440-light.png") });

  // 6. Decision Matrix Desktop Dark (1440x900)
  console.log("Capturing Decision Matrix (Dark)...");
  await page.goto("http://localhost:3000?tab=decide&theme=dark", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(LOCAL_DIR, "matrix-1440-dark.png") });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "matrix-1440-dark.png") });

  await browser.close();
  console.log("All comprehensive platform screenshots captured successfully.");
}

main().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
