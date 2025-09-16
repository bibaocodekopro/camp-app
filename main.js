const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { chromium } = require("playwright");

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("renderer/get-skuid.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 📌 Lắng nghe IPC từ renderer và chạy Playwright
ipcMain.on("start-camp", async (event, { url, qty, mode }) => {
  console.log("Camp start:", url, qty, mode);

  try {
    const browser = await chromium.launch({ headless: false }); // mở Chrome thật
    const page = await browser.newPage();
    await page.goto(url);

    for (let i = 0; i < qty; i++) {
      await page.click("text=+"); 
    }

    console.log("✅ Đã click nút +", qty, "lần");

    // ví dụ thêm bước thanh toán
    // await page.click("button:has-text('Thanh toán')");
  } catch (err) {
    console.error("❌ Lỗi khi chạy Playwright:", err);
  }
});
