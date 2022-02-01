//switchbotのデバイスIDとシーンIDを取得してスプレッドシートに書き込む関数
//参考 https://qiita.com/TMUS_SH/items/9197c2c78faab5fd6164
function GetIdList(){
	//Jsonからtoken取得
	const jsonToken = ReadJson('token.json');
	const token = jsonToken["switchbot"]["token"];

	//Jsonからスプレッドシートを取得
	const jsonSettings = ReadJson('settings.json');
	const sheetId = jsonSettings["spreadsheet"]["idList"];
	
	//apiリクエストの準備
	const devicesUrl = "https://api.switch-bot.com/v1.0/devices/"
	const scenesUrl = 'https://api.switch-bot.com/v1.0/scenes'

	const headers ={"Authorization": token};
	const options ={ 
		"headers" : headers,
	}

	//配列を作成
	var idList = [];

	//デバイスリストを取得
		var response = UrlFetchApp.fetch(devicesUrl,options);	
		var json=JSON.parse(response.getContentText());

		//配列に格納
		for(i=0;i<json['body']['deviceList'].length;i++){

			idList.push([json['body']['deviceList'][i].deviceId, json['body']['deviceList'][i].deviceName, json['body']['deviceList'][i].deviceType, json['body']['deviceList'][i].hubDeviceId])	
		} 

		CountSwitchbotApi('getDeviceList','list')

	//シーンリストを取得
		var response = UrlFetchApp.fetch(scenesUrl,options);	
		var json=JSON.parse(response.getContentText());
    
		//配列に格納
		for(i=0;i<json['body'].length;i++){

			idList.push([json['body'][i].sceneId, json['body'][i].sceneName, 'scene', ''])
		} 

		CountSwitchbotApi('getSceneList','list')
  
  console.log(idList)

	//シート取得
	const spreadsheet = SpreadsheetApp.openById(sheetId);
	const sheet = spreadsheet.getSheets()[0];

	//データ入力
	const sheet_header = [['ID','Name','Type','HubID']];
	sheet.getRange(1, 1, sheet_header.length, sheet_header[0].length).setValues(sheet_header)

	sheet.getRange(2, 1, idList.length, idList[0].length).setValues(idList)


}