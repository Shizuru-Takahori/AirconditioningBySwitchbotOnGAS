//Jsonを読み込む関数
//参考 https://qiita.com/msnaru/items/512157e7b98a999c53a5, https://auto-worker.com/blog/?p=3760
function ReadJson(fileName){
  console.log('--start ReadJson--')

  const file= DriveApp.getFilesByName(fileName).next();
  const jsonData = file.getBlob().getDataAsString('utf8');
  const json = JSON.parse(jsonData);

  console.log('---end ReadJson---')

  return json;
}


//switchbotの機器を操作する関数
function SwitchbotController(name,command){

  console.log('--start SwitchbotController--')
  console.log('name:[%s] command:[%s]', name, command)

  //Jsonの読み込み
  const jsonToken = ReadJson('token.json');
  const token = jsonToken["switchbot"]["token"];

  //apiHeaderの作成
  const headers ={"Authorization": token};

  //シーンだった時の処理
  if(command == 'scene'){
    
    //JSONからIDを取得
    const id = jsonToken["switchbot"]["sceneList"][name];

    var options ={ 
      'method' : 'post',
      'contentType': 'application/json',
       "headers" : headers,
    }

    var url = "https://api.switch-bot.com/v1.0/scenes/" + id + "/execute";

  }else{
    //デバイスのときの処理
    //JSONからIDを取得
    const id = jsonToken["switchbot"]["deviceList"][name];

    const payload ={
      "command": command,
      "parameter": "default",
      "commandType": "command"
    };
    
    var options ={ 
      'method' : 'post',
      'contentType': 'application/json',
      "headers" : headers,
      "payload" : JSON.stringify(payload)
    }

    var url = "https://api.switch-bot.com/v1.0/devices/" + id + "/commands";

    //propertyに結果を格納
    if(command == 'turnOn'){
      SetProperty(name, 1)
    }else{
      SetProperty(name, 0)
    }
  }


  UrlFetchApp.fetch(url,options)

  CountSwitchbotApi(name,command)

  console.log('---end SwitchbotController---')

}


//switchbotAPIのリクエストを記録する関数
function CountSwitchbotApi(deviceName, command){
  
  console.log('--start CountSwitchbotApi--')

  //前回の記録日時と回数propertyを取得
  var CSA = GetProperty('CSA');
  const previousDate = GetProperty('dateCSA');

  //日付を取得
  const newDate = new Date();
  const today = newDate.getDate();
  
  //Jsonからスプレッドシートを取得
  const jsonSettings = ReadJson('settings.json');
  const sheetId = jsonSettings["spreadsheet"]["CountSwitchbotApi"];
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheets()[0];
  
  //日付を跨いだかを確認
  if (previousDate == today){
    var CSA = CSA + 1
  }else{
    var CSA = 0
  }  

  //スプレッドシートに記入
    //headerが無い場合作成
    if(sheet.getRange('A1').isBlank() == 1){
      const sheetHeader = [['date','deviceName','command','requested']];
      sheet.getRange(1, 1, sheetHeader.length, sheetHeader[0].length).setValues(sheetHeader)
    }

  sheet.appendRow([newDate, deviceName, command, CSA]);

  //propertyに格納
  SetProperty('dateCSA', today);
  SetProperty('CSA', CSA);

  console.log('---end CountSwitchbotApi---')
}
