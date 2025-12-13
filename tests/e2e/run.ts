import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page, APIRequestContext } from 'playwright';

class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    request!: APIRequestContext;
    [key: string]: any;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async initBrowser(browserType: 'chromium' | 'firefox' | 'webkit') {
        this.browser = await (browserType === 'firefox' ? firefox : browserType === 'webkit' ? webkit : chromium).launch();
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        this.request = this.context.request;
    }

    async closeBrowser() {
        await this.page.close();
        await this.context.close();
        await this.browser.close();
    }
}

setWorldConstructor(CustomWorld);

// (async () => {
//     const world = new CustomWorld({
//         attach: () => {},
//         log: () => {},
//         parameters: {},
//     });
//     await world.initBrowser('chromium'); // Change to 'firefox' or 'webkit' as needed
//
//     // Here you would typically run your tests, e.g., using Cucumber's runner
//
//     await world.closeBrowser();
// })();