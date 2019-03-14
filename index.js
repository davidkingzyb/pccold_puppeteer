const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36");
  await page.setRequestInterception(true);
  page.on('request', request => {
  	if(request.url().indexOf('lapi/live/getH5Play')!=-1){
      var data=request.postData().replace(/rate=.+?&/,'rate=1&');//quality
        console.log('get play',data);
        request.continue({postData:data});
  	}else if(request.url().indexOf('douyucdn.cn/live')!=-1){
  		// console.log(request.url());
  	}else{
  	    request.continue({});
  	}
  });
  page.on('response',async response =>{
    if(response.url().indexOf('lapi/live/getH5Play')!=-1){
      var resp=await response.json();
      console.log('$$$$'+resp.data.rtmp_url+'/'+resp.data.rtmp_live+'$$$$');
      await browser.close();
    }
  })
  await page.goto('https://douyu.com/20360');//room config
  await browser.close();
})();
