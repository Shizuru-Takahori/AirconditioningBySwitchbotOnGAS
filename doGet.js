//外部からパラメータを受取る関数
//参考 https://qiita.com/hirohiro77/items/a947416f803f45777338
function doGet(e){
  Logger.log('---start doGet---')

  //パラメータの設定
  const parameters = [['home', e.parameter.p1],
                ['airConditionerMode', e.parameter.p2],
                ['nightMode', e.parameter.p3]];

  var getValue = '';

  console.log(parameters)

  for(let i = 0; i < parameters.length; i++){

    if(parameters[i][1] != undefined){        
      let key = parameters[i][0];
      let value = parameters[i][1];

      //propertyに格納
      SetProperty(key, value)

      //通知に追加
      var getValue = getValue + '{key: ' + key + ', value: ' + value +'}';
    }
  } 

  //エラーの処理
  if(getValue == ''){
    var getValue = 'undefined'
  }

  //通知する
    //Json格納用の配列
    const rowData = {};
  rowData.value = getValue;
  var result = JSON.stringify(rowData);
  
  Logger.log('---end doGet---')

  return ContentService.createTextOutput(result);

    

}