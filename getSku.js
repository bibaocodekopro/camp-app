const { chromium } = require("playwright");

async function getSkuFromApi(url) {
  const browser = await chromium.launch({ headless: true }); // headless = true: chạy ngầm
  const page = await browser.newPage();

  // Gửi request trực tiếp đến endpoint API
  const response = await page.goto(url);

  if (!response.ok()) {
    console.error("Request failed:", response.status(), response.statusText());
    await browser.close();
    return null;
  }

  const content = await response.json();

  let list = [];
  if (content && content.skus && Array.isArray(content.skus)) {
    list = content.skus.map(s => ({
      skuId: s.skuId,
      title: s.title
    }));
  }

  await browser.close();
  return list;
}

(async () => {
  const url = "https://shopapi.popmart.com/vn/products/5966/SKULLPANDA%20L%E2%80%99impressionnisme%20Series%20Plush%20Doll";
  const skus = await getSkuFromApi(url);
  console.log("SKU list:", skus);
})();
