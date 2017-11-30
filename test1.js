const cheerio = require('cheerio');
const superagent = require('superagent');
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
//const iconv = require('iconv-lite');
const superag = require('superagent-charset')(superagent);
const Sequelize = require('Sequelize');
const config = require('./config.js');
const asyncn = require('async');



var sequelize = new Sequelize(config.database,config.username,config.passwd,{
	'host':config.host,
	'dialect':'mysql',
	 omitNull: true
});

var getin = sequelize.define('mvdown',{
	id:{
		type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: 1,
        field: 'id'
	},
	'title':Sequelize.TEXT,
	'link':Sequelize.TEXT
},{
	timestamps:false
});


router.get('/', async (ctx,next)=>{
	const i = 1;
	const data = await getloop([],1);
	const fillda = await getlink(data);
	
	
	ctx.response.body = `iasgdi${fillda}`;

});








const getloop = async (adata,num) =>{
		const data = await getweb(adata,num)
		if (data.num<150) {
			await wait(500);
			let num = data.num;
			num++;
			console.log(`第${num}页，开始获取...`);
			return new Promise((resolve)=>{resolve(getloop(data.data,num))});
		}else{
			
			return new Promise((resolve)=>{resolve(data.data)});
		}
	
};


const getweb = (data,num)=>{
	return superag.get(`http://www.ygdy8.com/html/gndy/dyzz/list_23_${num}.html`)
			.charset('gb2312')
			.retry(20)
			.then(function(sres,err){
				var item = data;
				
				if(err){
					return {data:item,num:num};
					
				}
				var $ = cheerio.load(sres.text);
				$('.co_content8 ul').find('a').each(function(aa,element){
					var $element = $(element);
					item.push({
						title:$element.text(),
						href:$element.attr('href')
					});
					
				});
				setTimeout(()=>{},500);
				return {'data':item,'num':num};
			});
}
	
	


function wait(ms){
	return new Promise((resolve)=>{setTimeout(resolve(),ms);});
}


const anum = 1;

async function getlink(alink){
	const ndata = [];
	console.log(alink.length);

	asyncn.mapLimit(alink,1,(url,cb)=>{

		(async (url,cb)=>{
			
			await wait(10000);
			const link = await getdownload(url);

			await wait(3000);
			console.log(link);
			if (link!=undefined) {
				ndata.push(link);
				await (async (a)=>{
					var p = await getin.create({
					'id':ndata.length,
					'title':a.title||'1',
					'link':a.download||'1'
					});
					
					})(link);
					await wait(3000);
			}
			return cb(null,link);
		})(url,cb);
	},function(err,results) {
    console.log('1.3 err: ', err);
    console.log(results);
}
	//return new Promise((resolve)=>{resolve(ndata)});
	)
		
};





function getdownload(u){
	return 	superagent.get(`http://www.ygdy8.com${u.href}`)
		.charset('gb2312')
		.retry(20)
		.then((sers,err)=>{
			if (err) {
				console.log(err+'!!!');
				return new Promise((resolve)=>{setTimeout(resolve(),5000);});
			}
			var $ = cheerio.load(sers.text);
			var link = $('#Zoom td').find('a').attr('href');
			u.download = link;
			return new Promise((resolve)=>{setTimeout(resolve(u),10000);});
		}).catch(err=>{return;});

}
		

app.use(router.routes());

app.listen(1234);
console.log('server start at 1234');