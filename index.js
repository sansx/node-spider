const cheerio = require('cheerio');
const superagent = require('superagent');
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const iconv = require('iconv-lite');
const superag = require('superagent-charset')(superagent);




router.get('/', (ctx)=>{new Promise ((resolve)=>{
	const i=1;
	const data = geturl(5,{data:[],num:i});

	ctx.response.body = data;
	
	})}
);

function geturl(max,data){
	const num = data['num'];
	//console.log(num);
	return new Promise((resolve)=>{
			superag.get(`http://www.ygdy8.com/html/gndy/dyzz/list_23_${num}.html`)
				.charset('gb2312')
				.then(function(sres,err){
					if(err){
						resolve(item);
						return next(err);
					}
					if (!sres.text) {
						reject(new error('数据错误'));
					}
					var $ = cheerio.load(sres.text);
					var item = data['data'];
					//item.push(i);
					$('.co_content8 ul').find('a').each(function(aa,element){
						var $element = $(element);
						var $getlink = $element.attr('href');
						
						if ($getlink){
							item.push({
								title:$element.text(),
								href:$getlink
							});
							//console.log('title:'+$element.text()+'link:'+$element.attr('href'));
							/*if (i>=max) {
								resolve(item);
							}else{
								i++;
								resolve(geturl(max,i++));
							}*/
							
						}
					});
					//console.log(item);
					resolve({data:item,num:num});
				})
	}).then((arr)=> new Promise ((resolve)=>{
					//console.log(arr.data);
					if (arr['num']<=1) {
						var gurl=arr.data;
						//console.log(gurl);
						var link;
						for(var d of gurl){
							
							//link = getdown();
							console.log(d)
							//d.push(link);
						}
						
						arr['num']++;
						setTimeout(()=>{console.log('link');resolve(geturl(max,arr));},500);
						//setTimeout(()=>{console.log(link);return geturl(max,arr);},500);
					}else{
						setTimeout(()=>{resolve(arr.data)},500);
						//setTimeout(()=>{return arr.data},500);
					}
				})).catch((err)=>{console.log(err)});
};

function getdown(aurl){
			superagent.get(`http://www.ygdy8.com${aurl}`)
			.charset('gb2312')
			.then((sers,err)=>{
				if (err) {
					reject(new error('出错啦'));
				}
				var $ = cheerio.load(sers.text);
				var link = $('#Zoom td').find('a').attr('href');
				//console.log(link);
				//resolve();

				//resolve(link);
				return link;

			})
		};
		

app.use(router.routes());

app.listen(1234);
console.log('server start at 1234');