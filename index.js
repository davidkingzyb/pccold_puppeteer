const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({
        executablePath:'/usr/bin/chromium-browser',//raspi
        headless:true,
        args: [
            '–disable-gpu',
            '–disable-dev-shm-usage',
            '–disable-setuid-sandbox',
            '–no-first-run',
            '–no-sandbox',
            '–no-zygote',
            '–single-process'
        ]
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
            var exitcode=1;
            if (resp.data.rtmp_url && resp.data.rtmp_live) {
                console.log('$$$$' + resp.data.rtmp_url + '/' + resp.data.rtmp_live + '$$$$');
                exitcode=0;
            }
            try {
                await page.close();
                await browser.close();
            } catch (e) {
            }
            process.exit(exitcode);
        }
    })
    try {
        await page.goto('https://douyu.com/20360', { timeout: 60000 }); //config
    } catch (e) {
        await sleep(1000);
        console.log('err',e);
        try {
            await page.close();
            await browser.close();
            process.exit(4);
        } catch (e) {
            process.exit(4);
        }
    }
    await sleep(1000);
    try {
        await page.close();
        await browser.close();
        process.exit(3);
    } catch (e) {
        process.exit(3);
    }

})();

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    })
}
