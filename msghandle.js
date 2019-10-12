const formatMsg = require('./fmtwxmsg');

function help(){
    //字符串形式返回帮助信息
    //还可以是以读取文件的形式来返回
    return '你好，这是一个测试号，目前会原样返回用户输入的消息，暂不支持视频类型'
}
/**
 * @param {object} wxmsg解析XML消息的对象
 * @param {object} retmsg要返回的数据对象
 */

function userMsg(wxmsg,retmsg){
    /*
        检测是否为文本消息，如果是文本消息则先要检测是不是支持的关键词回复。
    */
    //关键字自动回复
    if (wxmsg.MsgType == 'text') {

        if (wxmsg.Content == '帮助' || wxmsg.Content == 'help' || wxmsg.Content == '?' || wxmsg.Content == '？') {
            retmsg.msg = help();
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);
        } else if (wxmsg.Content == 'hello' || wxmsg.Content == '你好'){
            retmsg.msg = '你好，你可以输入一些关键字测试消息回复，输入help/?获取帮助';
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);
        } else if(wxmsg.Content == 'who'){
            retmsg.msg = '----------开发者信息----------\n姓名：董心\n学号：2017011950\n'
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);
        } else if(wxmsg.Content == 'about'){
            retmsg.msg = '我是这个测试号的开发者，如有问题请发邮件到23333@qq.com'
            retmsg.msgtype = 'text';
            return formatMsg(retmsg);
        } else {
            retmsg.msg = wxmsg.Content;
            retmsg.msgtype = wxmsg.MsgType;
            return formatMsg(retmsg);
        }
    } else {
        switch(wxmsg.MsgType) {
            case 'image':
            case 'voice':
                retmsg.msg = wxmsg.MediaId;
                retmsg.msgtype = wxmsg.MsgType;
                break;
            default:
                //retmsg.msgtype类型为空
                //格式化数据会返回default处的数据
                //提示用户改类型不被支持
                retmsg.msg = '不支持的类型';
        }

        return formatMsg(retmsg);
    }
}
exports.help = help;
exports.userMsg = userMsg;
//后续还会加入事件消息支持
exports.msgDispatch = function msgDispatch(wxmsg, retmsg) {
    return userMsg(wxmsg, retmsg);
};