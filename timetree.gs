const APITOKEN = '※TimeTreeのトークン※'
const USER_ID = '※TimeTreeのユーザーID※'
const CHALENDER_ID = '※TimeTreeのカレンダーID※'

const URL = 'https://timetreeapis.com/user' //認可ユーザーの取得
const URL1 = 'https://timetreeapis.com/calendars?include=labels,members' //カレンダーリストの取得
const URL2 = 'https://timetreeapis.com/calendars/'+CHALENDER_ID+'/labels' //ラベルリストの取得
const URL3 = 'https://timetreeapis.com/calendars/'+CHALENDER_ID+'/members' //参加者リストの取得
const URL4 = 'https://timetreeapis.com/calendars/'+CHALENDER_ID+'/upcoming_events?days=7' //予定リストの取得（当日以降、7日以内）
const URL5 = 'https://timetreeapis.com/calendars/'+CHALENDER_ID+'/events' //予定の作成


function posttest(title,start,end) {
  //グーグルカレンダーのタイトルが空の場合は空文字扱い。postする際、titleが空文字だとエラーになるので、空のときは「（タイトルなし）」を入力する
  if (title == "") {
         title = "（タイトルなし）"
          } else {
         // なにもしない
        }

  let headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+APITOKEN,
    'Accept': 'application/vnd.timetree.v1+json'
  }

  let payload = {
    'data': {
      'attributes': {
        'category': 'schedule',
        'title': title,
        'all_day': false,
        'start_at': start,
        'start_timezone': 'UTC',
        'end_at': end,
        'end_timezone': 'UTC',
        'description': '',
        'location': 'osaka',
        //'url': 'https://developers.timetreeapp.com/ja/docs/api/oauth-app#oauth-app-and-personal-access-token'
      },
      'relationships': {
        'label': {
          'data': {
          'id': CHALENDER_ID+',7'/*PropertiesService.getScriptProperties().getProperty('timetree_calender1_label')*/,
          'type': 'label'
          }
        }
      }
    }
  }

  let options = {
    'meathod':'post',
    'headers':headers,
    'payload':JSON.stringify(payload)
  }

  let response = UrlFetchApp.fetch(URL5,options)
  Logger.log(response)
}

function gettest() {
  let headers = {
    'Accept': 'application/vnd.timetree.v1+json',
    'Authorization': 'Bearer '+APITOKEN
  }

  let options = {
    'method':'get',
    'headers':headers,
    'payload':''
  }

  let response = UrlFetchApp.fetch(URL4,options)
  Logger.log(response)
}
