const cheerio = require('cheerio').load;
const superagent = require('superagent');
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const iconv = require('iconv-lite');
const superag = require('superagent-charset')(superagent);


var getpage = 2
let downloadbox = []


router.get('/',async (ctx,next)=>{
	const i=1;
	const data = await geturl({data:[],num:i},getpage);
	ctx.response.body = data;
	console.log(data);
	
	//await next
});

async function geturl(data,max){
	let num = data['num'];
	//console.log(num);
	let totalinfo = []
	return new Promise((resolve)=>{
		superag.get(`http://www.ygdy8.com/html/gndy/dyzz/list_23_${num}.html`)
				.charset('gb2312')
				.retry(2)
				.then(function(sres,err){
					if(err){
						resolve(item);
						return next(err);
					}
					if (!sres.text) {
						reject(new error('数据错误'));
					}
					var $ = cheerio(sres.text);
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
					return {num:num,max:max,data:item,};
				}).then((res,err)=> {//new Promise ((resolve)=>{
					//console.log(max)
					let arr = res 
					//console.log(res)
					if (arr['num']<arr["max"]) {
						//console.log(arr)
						var gurl=arr.data;
						var link;
						let linkbox = []
						for(var d of gurl){
							link = new Promise(resolve=>{
								resolve(getdown(d.href))
							})
							linkbox.push(link)
						}
						Promise.all(linkbox).then(res=>{
							//console.log(res)
							downloadbox = [...res]
							arr['num']++;
							if (arr['num']<max) {
								setTimeout(()=>{
									geturl(arr,arr["max"])
								},1000) 
							}else{
								return resolve(downloadbox)
							}
							//console.log(arr['num'])
							
						})
						.catch(err=>console.log(err))
						//arr['num']++;
						//setTimeout(()=>{console.log('link');resolve(geturl(max,arr));},500);
						//setTimeout(()=>{console.log(link);return geturl(max,arr);},500);
					}else{
						//console.log(downloadbox);
						console.log("end");
						
						return resolve(downloadbox)
						//setTimeout(()=>{resolve(arr.data)},500);
						//setTimeout(()=>{return arr.data},500);
					}
							//})).catch((err)=>{console.log(err)});
				})
			//resolve(downloadbox)
	})
};

function getdown(aurl){
	return 	superagent.get(`http://www.ygdy8.com${aurl}`)
		.charset('gb2312')
		.then((sers,err)=>{
			if (err) {
				reject(new error('出错啦'));
			}
			var $ = cheerio(sers.text);
			var link = $('#Zoom td').find('a').attr('href');
			//console.log($)
			return link;
		})
};
		

app.use(router.routes());

app.listen(1234);
console.log('server start at 1234');