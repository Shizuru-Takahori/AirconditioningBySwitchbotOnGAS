//参考 https://qiita.com/iron-samurai/items/76c9837e398922d79a69

//propertyを全て取得
function GetpAllProperties(){
  Logger.log('--start getAllproperties--')
  const sp = PropertiesService.getScriptProperties();
  const data = sp.getProperties();
  var properties = [];
  var log = ""

  for (var key in data) {
    properties.unshift([key, data[key]])
    var log = log + key + ' : ' + data[key] + '\n';
  }

  Logger.log(log);
  Logger.log('---end getAllproperties---')

  return properties

}

//全propertyの削除
function DeleteAllProperties(){
  const sp = PropertiesService.getScriptProperties();
  sp.deleteAllProperties();
  GetpAllProperties()

}

//propetyの取得
function GetProperty(key){
  const sp = PropertiesService.getScriptProperties();
  const property = Number(sp.getProperty(key));

  return property

}

//propertyの格納
function SetProperty(key, data){
  const sp = PropertiesService.getScriptProperties();

  const previous = sp.getProperty(key);
  
  sp.setProperty(key, data);

  console.log('set[%s: %s]from[%s]', key , sp.getProperty(key), previous)

}

//Propertyの削除
function DeleteProperty(key){
  const sp = PropertiesService.getScriptProperties();
  const previous =sp.getProperty(key);
  
  sp.deleteProperty(key);

  console.log('delete[%s: %s]from[%s]', key , sp.getProperty(key), previous)
}