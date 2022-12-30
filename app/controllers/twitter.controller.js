const { Builder, Browser, By, until } = require("selenium-webdriver");
const {
    Options,
    ServiceBuilder,
} = require('selenium-webdriver/chrome');
const fs = require('fs/promises');
const { response } = require("../helpers");
const {handleHomeTimelineData} = require("../services/twitter.service");
require('chromedriver');

let options = new Options();
let driverRef = null;
options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");
options.addArguments('--disable-dev-shm-usage');


class TwitterController {
    async index(req, res, next) {
        try {
            const twitterPostUrl = req.query.twitterPostUrl;
            const fetchTime = new Date();

            if (!twitterPostUrl) return response({ res, status: 400, message: "Bad Request" });

            let serviceBuilder = new ServiceBuilder(process.env.CHROME_DRIVER_PATH);
            let driver = await new Builder()
                .forBrowser(Browser.CHROME)
                .setChromeOptions(options)
                .setChromeService(serviceBuilder)
                .build();

            // reference to driver to close in case of error
            driverRef = driver;

            await driver.get(twitterPostUrl);

            let homeTimeline = await driver.wait(
                until.elementLocated(
                    By.css("div[aria-label='Home timeline']")
                ),
                30000,
                "Timed out after 30 seconds",
                10000
            );
            const homeTimelineHTML = await homeTimeline.getAttribute("innerHTML");

            const result = handleHomeTimelineData({ twitterPostUrl, homeTimeline, homeTimelineHTML, fetchTime });

            // await fs.writeFile(`${process.cwd()}/output/index.html`, homeTimelineHTML)

            await driver.quit();
            response({ res, status: 200, message: "Success", data: result });
        }
        catch (err) {
            console.log(err);
            driverRef.quit();
            response({ res, status: 500, message: "Error" });
        }
    }
};

module.exports = new TwitterController();
