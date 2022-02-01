//温湿度のデータを取得する関数
//参考 https://qiita.com/TMUS_SH/items/9197c2c78faab5fd6164
function RecordHumidity(){
  console.log('--start RecordHumidity--')

  //Jsonからtoken取得
  const jsonToken = ReadJson('token.json');
  const deviceID = jsonToken["switchbot"]["deviceList"]["thermometer"];
  const token = jsonToken["switchbot"]["token"];

  //Jsonからスプレッドシートを取得
  const jsonSettings = ReadJson('settings.json');
  const sheetId = jsonSettings["spreadsheet"]["humidity"];

  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet = spreadsheet.getSheets()[0];
  var date = new Date();

  //switchbotApiを叩く
  var url = "https://api.switch-bot.com/v1.0/devices/";
  var headers ={"Authorization": token};
  var options ={ 
      "headers" : headers,
  }

    var url = "https://api.switch-bot.com/v1.0/devices/" + deviceID + "/status";
    var data = UrlFetchApp.fetch(url,options);//温湿度計のステータスを取得
    var datajson=JSON.parse(data.getContentText());   
    var temp = datajson['body']['temperature'];
    var rhumidity = datajson['body']['humidity'];
    var rhumidity =  rhumidity/100 
    var ahumidity =217*(6.1078*10**(7.5*temp/(temp+237.3)))/(temp+273.15)*rhumidity //絶対湿度（g/m^3)を算出

  // シートにデータ入力
    //headerが無い場合作成
      if(sheet.getRange('A1').isBlank() == 1){
        const sheetHeader = [['date','temp','rhumidity','ahumidity']];
        sheet.getRange(1, 1, sheetHeader.length, sheetHeader[0].length).setValues(sheetHeader)
      }

  sheet.appendRow([date, temp, rhumidity, ahumidity]);

  ///propertyに格納
  SetProperty('temp', temp)
  SetProperty('rhumidity', rhumidity)
  SetProperty('ahumidity', ahumidity)

  console.log('---end RecordHumidity---')
              
}



//湿度と温度を適温に保つ関数
function AirconditioningController(){

  //Jsonから湿度ターゲットを取得
  const jsonSettings = ReadJson('settings.json');

  const maxAhumidity = jsonSettings["humidityTarget"]["maxAhumidity"];
  const minAhumidity = jsonSettings["humidityTarget"]["minAhumidity"];
  const maxTemp = jsonSettings["humidityTarget"]["maxTemp"];
  const minTemp = jsonSettings["humidityTarget"]["minTemp"];
  const maxRhumidity = jsonSettings["humidityTarget"]["maxRhumidity"];

  const targetAhumidity = (maxAhumidity + minAhumidity) * 1/2;
  console.log('averageAhumidity:', targetAhumidity)

  //property読み込み
  const temp = GetProperty('temp');
  const rhumidity = GetProperty('rhumidity');
  var ahumidity = GetProperty('ahumidity');
  
  var humidifier = GetProperty('humidifier');
  var airConditioner = GetProperty('airConditioner');
  
  const home = GetProperty('home');
  const airConditionerMode = GetProperty('airConditionerMode');
  const nightMode = GetProperty('nightMode');

  //家判別
  if(home == 0){
    console.log('out now')

  }else{

    //絶対湿度がターゲットよりも低いなら加湿器on
    if(ahumidity < targetAhumidity && humidifier == 0){
      SwitchbotController('humidifier','turnOn')

    }else if(ahumidity > maxAhumidity && humidifier == 1){
      SwitchbotController('humidifier','turnOff')
    }


    //エアコン処理
    if(nightMode == 0){

      //airConditionerModeの処理｡気温が低いかつModeがonならエアコンをつけ､気温が低いまたはModeがoffならばエアコンを消す｡
      if(airConditioner == 0 && airConditionerMode == 1 && temp < maxTemp){

        SwitchbotController('airConditionerOn', 'scene')
        SetProperty('airConditioner', 1)

        }else if(airConditioner == 1 && (temp > maxTemp ||airConditionerMode == 0)){

          SwitchbotController('airConditionerOff', 'scene')
          SetProperty('airConditioner', 0)

      }
  
     }else{
      //nightMode処理
      //相対湿度が規定外ならエアコンを付けて相対湿度を下げる処理
      if(airConditioner == 0 && rhumidity > maxRhumidity){

        SwitchbotController('airConditionerOn', 'scene')
        SetProperty('airConditioner', 1)
  
       }else if(airConditioner == 1 && maxRhumidity > rhumidity ){

        SwitchbotController('airConditionerOff', 'scene')
        SetProperty('airConditioner', 0)
      }
    }

  }
  
  console.log('---end humidityController---')

}