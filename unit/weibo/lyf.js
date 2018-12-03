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

function getWinfo(adress) {
	puppeteer.launch().then(async browser => {
		const page = await browser.newPage();
		const startTime = new Date().getTime()
		await page.goto(adress, { waitUntil: 'networkidle2' });


		await page.waitFor(".username")
		// await page.evaluate(()=>{
		// 	console.log(config);
		// })
		console.log(`${new Date().getTime() - startTime}:成功进入页面，等待加载`);
		await page.waitFor('.WB_detail')
		const bodyHandle = await page.$eval('.WB_text.W_f14', el => {
			// console.log(el);
			
			return new Promise(resolve => {
				let text = document.querySelectorAll(".WB_from.S_txt2>a")
				// document.querySelector("a").
				let res = [...text].map(el => {
					// if(/今天.*\d+:\d+/.test(el.innerHTML)){return el.innerHTML}
					if(/今天.*\d+:\d+/.test(el.innerHTML)){resolve(el.innerHTML)}
				})
				resolve(false)
			})
		});
		console.log(bodyHandle);
		const spendTime = new Date().getTime() - startTime
		console.log(`花费了：${spendTime}`);
		await browser.close();
	});
}

try {
    getWinfo(`https://weibo.com/jiuguimoye?is_all=1`);
    getWinfo(`https://www.weibo.com/u/5933834580?is_all=1`);
}

catch(error) {
    console.error(error);
    // expected output: SyntaxError: unterminated string literal
    // Note - error messages will vary depending on browser
  }