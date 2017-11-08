const cheerio = require('cheerio');
const superagent = require('superagent');
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
//const iconv = require('iconv-lite');
const superag = require('superagent-charset')(superagent);
const Sequelize = require('Sequelize');
const config = require('./config.js');


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
	const data = await geturl(2,{data:[],num:i});
	console.log(data);
	const fillda = await getlink(data);
	//console.log(fillda);
	ctx.response.body = `iasgdi${fillda[0]}`;

});



async function geturl(max,data){
	const num = data['num'];
	return new Promise ((resolve)=>{
	superag.get(`http://www.ygdy8.com/html/gndy/dyzz/list_23_${num}.html`)
			.charset('gb2312')
			.then(function(sres,err){
				var item = data['data'];
				if(err){
					resolve({data:item,num:num});
					return err;
				}
				var $ = cheerio.load(sres.text);
				$('.co_content8 ul').find('a').each(function(aa,element){
					var $element = $(element);
					item.push({
						title:$element.text(),
						href:$element.attr('href')
					});
				});
				setTimeout(()=>{resolve({data:item,num:num})},1000);	
	})
	}).then((data)=>{
		if(data.num<max){
			console.log(max+','+data.num);
			data.num++;
			return geturl(max,data);
		}else{
			return data.data;
		}
	}).catch((err)=>{return err;})
};

function wait(ms){
	return new Promise((resolve)=>{setTimeout(resolve(),ms);});
}

async function getlink(alink){
	const ndata = [];
	for(let [c,u] of Object.entries(alink)){
		console.log(u+"??");
		a = await getdownload(u);
		await wait(1000);
		await (async (a)=>{
			var p = await getin.create({
			'id':ndata.length,
			'title':a.title||'',
			'link':a.download||''
			});
			await wait(1000);
	    	return new Promise((resolve)=>{resolve(console.log('created.' + JSON.stringify(p)))});
			})(a);
		ndata.push(a);
	};
	return new Promise((resolve)=>{resolve(ndata)});
};



function getdownload(u){
	return 	superagent.get(`http://www.ygdy8.com${u.href}`)
		.charset('gb2312')
		.then((sers,err)=>{
			if (err) {
				return u;
			}
			var $ = cheerio.load(sers.text);
			var link = $('#Zoom td').find('a').attr('href');
			u.download = link;
			return u;
		});

}
		

app.use(router.routes());

app.listen(1234);
console.log('server start at 1234');