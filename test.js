const cheerio = require('cheerio');
const superagent = require('superagent');
const superag = require('superagent-charset')(superagent);
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const fs = require('fs');

var writefs = fs.createWriteStream('input.txt');

router.get('/', async (ctx, next) => {

	const data = await bili('111');
	console.log(data);
	ctx.response.body = data;
});

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
				writefs.write(atr,'utf8');
				
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



app.use(router.routes());


app.listen(1111);
console.log('server start');