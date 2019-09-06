const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({
        // executablePath:'/usr/bin/chromium-browser',//raspi
        // args:[]
    });
    const page = await browser.newPage();
    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36");
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().indexOf('lapi/live/getH5Play') != -1) {
            var data = request.postData().replace(/rate=.+?&/, 'rate=1&'); //quality
            // console.log('get play', data);
            request.continue({ postData: data });
        } else if (request.url().indexOf('douyucdn.cn/live') != -1) {
            // console.log(request.url());
        } else {
            // console.log(request.url());
            request.continue({});
        }
    });
    page.on('response', async response => {
        if (response.url().indexOf('lapi/live/getH5Play') != -1) {
            var resp = await response.json();
            if (resp.data.rtmp_url && resp.data.rtmp_live) {
                console.log('$$$$' + resp.data.rtmp_url + '/' + resp.data.rtmp_live + '$$$$');
            }
            try {
                await page.close();
                await browser.close();
                process.exit(0);
            } catch (e) {
                process.exit(1);
            }
        }
    })
    try {
        await page.goto('https://douyu.com/20360', { timeout: 60000 }); //config
    } catch (e) {
        try {
            await page.close();
            await browser.close();
            process.exit(1);
        } catch (e) {
            process.exit(1);
        }
    }
    await sleep(10000);
    try {
        await page.close();
        await browser.close();
        process.exit(0);
    } catch (e) {
        process.exit(0);
    }

})();

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    })
}
