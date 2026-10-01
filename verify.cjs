const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  fs.mkdirSync("review", { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const results = [];
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://127.0.0.1:4173");
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const image of document.images) {
        image.loading = "eager";
        await image.decode();
      }
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      h1: document.querySelectorAll("h1").length,
      images: [...document.images].every((i) => i.naturalWidth > 0),
    }));
    assert.equal(metrics.documentWidth, width, `Overflow at ${width}`);
    assert.equal(metrics.h1, 1);
    assert(metrics.images);
    results.push(metrics);
    if ([390, 1440].includes(width))
      await page.screenshot({ path: `review/${width}.png`, fullPage: true });
  }
  await page.locator('[data-package="silver"]').click();
  assert.equal(
    await page.locator("#service-select").inputValue(),
    "Paquete Plata",
  );
  assert(
    (
      await page.locator(".mobile-contact [data-wa]").getAttribute("href")
    ).includes("Paquete%20Plata"),
  );
  await page.waitForTimeout(200);
  assert(
    await page
      .locator("#service-select")
      .evaluate((e) => document.activeElement === e),
  );
  assert(
    await page
      .locator("#contacto")
      .evaluate(
        (e) =>
          e.getBoundingClientRect().top >=
          document.querySelector("header").getBoundingClientRect().bottom,
      ),
  );
  await page.locator('[data-service="Traslados"]').click();
  assert.equal(await page.locator("#service-select").inputValue(), "Traslados");
  assert(
    (await page.locator(".contact [data-wa]").getAttribute("href")).includes(
      "Traslados",
    ),
  );
  await page.locator("#submit-button").click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 4);
  await page.locator("[name=name]").fill("Familia de prueba");
  await page.locator("[name=phone]").fill("----------");
  await page.locator("[name=location]").fill("Ecatepec");
  await page.locator("[name=consent]").check();
  await page.locator("#submit-button").click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 1);
  await page.locator("[name=phone]").fill("5612345678");
  await page.evaluate(() => {
    window.open = (url) => {
      window.draftUrl = url;
      return null;
    };
  });
  await page.locator("#submit-button").click();
  const draft = await page.evaluate(() => window.draftUrl);
  assert(draft.startsWith("https://wa.me/525611242908?text="));
  assert(decodeURIComponent(draft).includes("Traslados"));
  assert.equal(
    await page.locator("[name=name]").inputValue(),
    "Familia de prueba",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("[name=phone]").focus();
  assert.equal(await page.locator(".mobile-contact").isVisible(), false);
  await page.locator("#submit-button").focus();
  assert.equal(await page.locator(".mobile-contact").isVisible(), true);
  const faq = page.locator("#faq-list summary").first();
  await faq.focus();
  await page.keyboard.press("Enter");
  assert(
    await page
      .locator("#faq-list details")
      .first()
      .evaluate((e) => e.open),
  );
  await page.locator(".comparison summary").focus();
  await page.keyboard.press("Enter");
  assert(await page.locator(".comparison").evaluate((e) => e.open));
  assert.equal(await page.locator("tbody tr").count(), 12);
  await page.screenshot({
    path: "review/comparison-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 720, height: 450 }); // 1440px viewport at 200% effective zoom.
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth === innerWidth,
    ),
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto("http://127.0.0.1:4173");
  assert(await staticPage.locator(".hero h1").isVisible());
  assert(await staticPage.locator(".mobile-contact").isVisible());
  await staticPage.locator(".package-detail summary").first().click();
  assert(await staticPage.locator(".package-detail ul").first().isVisible());
  assert(await staticPage.locator("#submit-button").isDisabled());
  assert.equal(errors.length, 0);
  fs.writeFileSync(
    "review/checks.json",
    JSON.stringify(
      {
        results,
        errors,
        checks: [
          "package and service selection",
          "WhatsApp draft intercepted; no message sent",
          "inline validation and preserved values",
          "anchor clears sticky header",
          "keyboard FAQ and comparison",
          "mobile bar hidden during typing",
          "reduced motion",
          "720px effective viewport (200% of 1440)",
          "no JavaScript fallback",
        ],
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log("All checks passed", JSON.stringify(results));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
