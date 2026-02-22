const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let hasError = false;

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER ERROR:', msg.text());
            hasError = true;
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE EXCEPTION:', error.message);
        hasError = true;
    });

    try {
        await page.goto('http://localhost:5175', { waitUntil: 'networkidle', timeout: 5000 });
        if (!hasError) {
            console.log('No errors captured in 5 seconds.');
        }
    } catch (e) {
        console.log('Navigation failed:', e.message);
    }
    await browser.close();
})();
