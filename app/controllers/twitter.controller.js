const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const fs = require('fs');
const { response } = require("../helpers");

module.exports = {
    index: async (req, res, next) => {
        try {
            const linkTwitter = req.query.linkTwitter;
            if (!linkTwitter) return response({ res, status: 400, message: "Bad Request" });
            let driver = await new Builder().forBrowser(Browser.CHROME).build();
            await driver.get(linkTwitter);
            let homeTimeline = await driver.wait(
                until.elementLocated(
                    By.css("div[aria-label='Home timeline']")
                ),
                30000,
                "Timed out after 30 seconds",
                5000
            );
            const homeTimelineHTML = await homeTimeline.getAttribute("innerHTML");
            fs.writeFile(`${process.cwd()}/output/index.html`, homeTimelineHTML, err => {
                if (err) throw err;
                response({ res, data: homeTimelineHTML, status: 200, message: "Success" });
            })
            driver.quit();
        }
        catch (err) {
            console.log(err);
            response({ res, status: 500, message: "Error" });
        }
    },
};
