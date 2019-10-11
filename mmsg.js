const titbit = require('titbit');
const crypto = require('crypto');
const xmlparse = require('xml2js').parseString;// 将xml文本解析成json对象的插件


var app = new titbit();

var {router} = app;

router.get('/wx/msg', async c => {
    let token = 'msgtalk';

    let urlargs = [
        c.query.nonce,//随机数
        c.query.timestamp,//时间数
        token//自己设置的token
    ];

    urlargs.sort();  //字典排序

    let onestr = urlargs.join(''); //拼接成字符串
    
    //生成sha1签名字符串
    // 创建sha1加密的Hash对象
    let hash = crypto.createHash('sha1');
    let sign = hash.update(onestr);// 进行hash散列计算
    
    // 转换成16进制字符串编码格式和signature对比
    // 如果相同则返回随机字符串
    if (c.query.signature === sign.digest('hex')) {
        c.res.body = c.query.echostr;
    }
});
router.post('wx/msg',async c =>{
    //输出获取的消息数据
    console.log(c.body);
    try{
        let data = await new Promise((rv,rj) => {
            xmlparse(c.body,{explicitArray:false},
                (err,result) =>{
                    if(err){
                        rj(err);
                    }else{
                        rv(result.xml);
                    }
            });
        });
        if(data.MsgType === 'text'){
            c.res.body =
             `<xml>
                <FromUserName>${data.ToUserName}</FromUserName>
                <ToUserName>${data.FromUserName}</ToUserName>
                <CreateTime>${parseInt(Date.now()/1000)}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[${data.Content}]]></Content>
            </xml>`;
        }
    }catch(err){
        console.log(err);
    }
});
app.run(8004, 'localhost');
