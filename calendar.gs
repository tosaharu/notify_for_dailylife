const G_CALENDAR_ID = '※GoogleCalendarのID※'

//GoogleCalendarに登録されている内容を取得
function getCalendarEvent(){
  //アクセス可能なカレンダーのIDを指定して、Googleカレンダーを取得する
  let myCalendar = CalendarApp.getCalendarById(G_CALENDAR_ID);
  
  //Googleカレンダーから取得するイベントの開始日(今日)を設定する
  let acquireDate = new Date();
  
  /*
  //Googleカレンダーから取得するイベントの終了日(1週間後)を設定する
  let endDate = new Date();
  endDate.setDate(acquireDate.getDate() + 7);
  //開始日～終了日に存在するGoogleカレンダーのイベントを取得する
  let myEvent = myCalendar.getEvents(acquireDate, endDate);
  */

  // 指定日（当日）の予定オブジェクトの配列を取得
  return myEvent = myCalendar.getEventsForDay(acquireDate);
}

//GoogleCalendarに登録されている内容を取得、TimeTreeとLINEに投稿する
function GetandPostCalenderEvent() {
  let myEvent = getCalendarEvent()
  // メッセージ格納用の配列作成
  let messageArray = [];
  
  //forループの処理で取得したイベントの件名をログ出力する
  for(let i = 0 ; i < myEvent.length ; i++ ){
    let title = (myEvent[i].getTitle());
    let startHour = myEvent[i].getStartTime().getHours().toString().padStart(2, '0');
    let startMinute = myEvent[i].getStartTime().getMinutes().toString().padStart(2, '0');
    let endHour = myEvent[i].getEndTime().getHours().toString().padStart(2, '0');
    let endMinute = myEvent[i].getEndTime().getMinutes().toString().padStart(2, '0');
    let message = '\n'+startHour+':'+startMinute+'～'+endHour+':'+endMinute+' ： '+title;
    messageArray.push(message);
    let start = Utilities.formatDate(myEvent[i].getStartTime(), 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ssZ");
    let end = Utilities.formatDate(myEvent[i].getEndTime(), 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ssZ");
    console.log(title)
    if (title == "") {
      console.log('空文字')
    } else {
      console.log('空文字でない')}

    // Timetreeに投稿
    posttest(title,start,end)
  }
  let acquireDate = new Date();
  let mon = acquireDate.getMonth()+1; //１を足すこと
	let day = acquireDate.getDate();

  let new_messageArray = '\n'+mon+'月'+day+'日'+String(messageArray);
  console.log(new_messageArray)

  // LINEに投稿
  SendLine(new_messageArray)  
}
