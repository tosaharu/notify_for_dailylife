//気象庁が公開しているJSONからデータを読み込む
const area_id = 270000

function GetForecastData() {
  //JSONデータの取得
  const url = 'https://www.jma.go.jp/bosai/forecast/data/forecast/'+area_id+'.json';
 
  let response = "";
  try {
    response = UrlFetchApp.fetch(url);
  } catch(e) {
    console.log('エラー：取得urlに問題があるようです')
    return response;
  }
  let data = JSON.parse(response);
 
  //後から使う変数
  let forecast = [];
  let date = "";
  let num = "";
 
  //基礎情報
  //forecast.push("発表者：" + data[0]["publishingOffice"]);
  date = data[0]["reportDatetime"];
  date = date.replace("T", " ");
  date = date.replace(":00+09:00", "");
  forecast.push("\n▼天気予報");
  forecast.push("報告日時：" + date);
  forecast.push("【" + data[0]["timeSeries"][0]["areas"][0]["area"]["name"] + "】");
 
  //今日・明日・明後日の天気
  let weather = "";
  let rNum = "";
  const telopSh = SpreadsheetApp.openById("1stXrKBVhkiUTkDWgT1InzL9owfDIpXetSzyO393bU_A").getSheetByName("telop");
  const telop = Array.prototype.concat.apply([], telopSh.getRange(2, 1, 122, 1).getValues());
  let day = "";
 
  num = data[0]["timeSeries"][0]["timeDefines"].length
  for(let i = 0; i < num; i++) {
    rNum = telop.indexOf(Number(data[0]["timeSeries"][0]["areas"][0]["weatherCodes"][i]));
    weather = telopSh.getRange(rNum + 2, 2).getValues();
    switch(i) {
      case 0:
        day = "今日"
        break;
      case 1:
        day = "明日"
        break;
      case 2:
        day = "明後日"
        break;
    }
    forecast.push(day + "の天気：" + weather);
    forecast.push("概況：" + data[0]["timeSeries"][0]["areas"][0]["weathers"][i]);
    //forecast.push("風：" + data[0]["timeSeries"][0]["areas"][0]["winds"][i]);
    //forecast.push("波の高さ" + data[0]["timeSeries"][0]["areas"][1]["waves"][i] + "\n");
    forecast.push("");
  }
 
  //降水確率
  forecast.push("■降水確率");
  num = data[0]["timeSeries"][1]["timeDefines"].length
  for(let j = 0; j < num; j++) {
    date = data[0]["timeSeries"][1]["timeDefines"][j];
    date = date.replace("T", " ");
    date = date.replace(":00+09:00", "");
    forecast.push(date + "｜" + data[0]["timeSeries"][1]["areas"][0]["pops"][j] + "%")
  }
  forecast.push("");
 
  //気温
  forecast.push("■気温");
  num = data[0]["timeSeries"][2]["timeDefines"].length
  for(let k = 0; k < num; k++) {
    date = data[0]["timeSeries"][2]["timeDefines"][k];
    date = date.replace("T", " ");
    date = date.replace(":00+09:00", "");
    forecast.push(date + "｜" + data[0]["timeSeries"][2]["areas"][0]["temps"][k] + "℃");
  }

//let toString = Object.prototype.toString; 
//console.log(toString.call(forecast))
forecast_str = forecast.join("\n")
//console.log(forecast_str)

SendLine(forecast_str)
}

function GetJRWTrainData(){
  // データ取得
  let url1 = "https://www.train-guide.westjr.co.jp/api/v3/osakaloop.json"
  let response1 = UrlFetchApp.fetch(url1)
  let traindata = JSON.parse(response1)
  let url2 = "https://www.train-guide.westjr.co.jp/api/v3/osakaloop_st.json"
  let response2 = UrlFetchApp.fetch(url2)
  let stationdata = JSON.parse(response2)

  // 駅のidと名前の一覧を取得作成
  let station = {}
  for( let i in stationdata["stations"] ){
    station[stationdata["stations"][i]["info"]["code"]] = stationdata["stations"][i]["info"]["name"]
  }

  // 遅延している電車のデータを取得
  let message = []
  let delaycount = 0
  for( let i in traindata["trains"] ){
    if(traindata["trains"][i]["delayMinutes"] > 0){
      //外回り、内回りを日本語化
      let loopdirection = ""
      if(traindata["trains"][i]["direction"] == 0){
        loopdirection = "外回り"
      }else if(traindata["trains"][i]["direction"] == 1){
        loopdirection = "内回り"
      }else{
        console.log("directionが空、もしくはif文に問題があります")
      }

      //出発地を判別するために、positionデータの前後駅を抽出
      splitpos = traindata["trains"][i]["pos"].split("_")
      
      // pos if "pos": "2510_####" => 2510 に停車中
      //     if direction = 0 外回り "pos": "2510_2511" => 2511 を出発
      //     if direction = 1 内回り "pos": "2510_2511" => 2510 を出発

      let departurepos_id = ""
      let departurepos_name = ""
      let departurepos_nameandtext = "" 

      if(splitpos[1] == "####"){
        departurepos_id = splitpos[0]
        departurepos_name = station[departurepos_id]
        if(typeof departurepos_name === "undefined"){
          departurepos_name = "環状線外"
        }  
        departurepos_nameandtext = departurepos_name+" を出発しました"
      }else{
        if(loopdirection == "外回り"){
          departurepos_id = splitpos[1]
        }else if(loopdirection = "内回り"){
          departurepos_id = splitpos[0]
        }else{
          console.error("loopdirectionが空、もしくはif文に問題があります")
        }
        departurepos_name = station[departurepos_id]
        if(typeof departurepos_name === "undefined"){
          departurepos_name = "環状線外"
        }        
        departurepos_nameandtext = departurepos_name+" に停車中です"
      }

      message.push("【"+loopdirection+"】"+traindata["trains"][i]["displayType"]+"・"+traindata["trains"][i]["dest"]["text"]+" 行き："+traindata["trains"][i]["delayMinutes"]+" 分遅れで "+departurepos_nameandtext)
      delaycount += 1
    }else{
    }
  }

  if(delaycount == 0){
    message.push("遅延はありません")
  }
message_str = message.join("\n")
message_str = "\n▼環状線遅延情報\n"+message_str
console.log(message_str)
SendLine(message_str)
}

function GetTrashDay(){
  //曜日ごとの種別を設定
  let trash_setteings = {}
  trash_setteings = ["なし","普通ごみ","なし","プラごみ","普通ごみ","紙ごみ","資源ごみ","なし"] //日曜からカウントして0,1,2~
  
  //本日の曜日を取得
  let date = new Date()
  let dayofweek = date.getDay() //日曜からカウントして0,1,2~

  //本日のごみを返す
  message = "\n▼ゴミ出し\n"+trash_setteings[dayofweek]
  SendLine(message)
}
