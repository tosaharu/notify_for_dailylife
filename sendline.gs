const LINE_NOTIFY_TOKEN = '※ラインから取得したTOKEN※'; 
const LINE_NOTIFY_API = 'https://notify-api.line.me/api/notify';

//BOTを通じてラインを送信する
function SendLine(message){
let options = {
  "method"  : "post",
  "payload" : {"message" : message},
  "headers" : {"Authorization" : "Bearer "+ LINE_NOTIFY_TOKEN}
  };
UrlFetchApp.fetch(LINE_NOTIFY_API, options);
}
