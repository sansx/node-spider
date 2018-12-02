const cheerio = require('cheerio');
const superagent = require('superagent');
const superag = require('superagent-charset')(superagent);
const fs = require('fs');
// var webPage = require('webpage');
// var page = webPage.create();
// const Koa = require('koa');
// const router = require('koa-router')();
// const app = new Koa();
// const inquirer = require('inquirer');
var writefs = fs.createWriteStream('input.txt');
const puppeteer = require('puppeteer');

function getWinfo(adress){puppeteer.launch().then(async browser => {
	const page = await browser.newPage();
	const startTime = new Date().getTime()
	await page.goto(adress, { waitUntil: 'networkidle2' });


	await page.waitFor(".username")
	// await page.evaluate(()=>{
	// 	console.log(config);
	// })
	console.log(`${new Date().getTime() - startTime}:成功进入页面，等待加载`);

	await page.waitFor('.WB_detail')
	const bodyHandle = await page.$eval('.WB_detail',el=>{
		return new Promise(resolve=>{
			
			let text = document.querySelectorAll(".WB_from.S_txt2>a")
			// document.querySelector("a").
			let res = [...text].map(el=>{
				return el.innerHTML
			})
			resolve(res)

		})
	});

	console.log(bodyHandle);
	

	// let res = await bodyHandle.then(res=>{
	// 	console.log(res);
		
	// })
	// const html = await page.evaluate(body => body.innerHTML, bodyHandle);
	// await bodyHandle.dispose();
	// writefs.write(bodyHandle, 'utf8');
	// // console.log(bodyHandle);
	// // console.log();

	// writefs.end();
	// writefs.on('finish', function () {
	// 	console.log("写入完成。");
	// });
	const spendTime = new Date().getTime() - startTime
	console.log(`花费了：${spendTime}`);
	await browser.close();
});}

var bili = (search) => {
	return superag.get(`https://search.bilibili.com/all?keyword=${search}&page=1&order=pubdate`)
		.then((res, err) => {
			if (err) {
				return 'some worron!';
			}
			var $ = cheerio.load(res.text);
			var str = '';
			var data = $('.video.matrix>a').each((re, el) => {
				var $el = $(el);
				var atr = $el.attr('title');
				writefs.write(atr, 'utf8');
				str += atr;
			});
			//console.log(data);
			writefs.end();
			writefs.on('finish', function () {
				console.log("写入完成。");
			});

			return str;
		})
}


getWinfo(`https://weibo.com/jiuguimoye?is_all=1`)
getWinfo(`https://www.weibo.com/u/5933834580?is_all=1`)