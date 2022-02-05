# AirconditioningBySwitchbotOnGAS
SwitchBotでお部屋を最適な気温と湿度に保ちます｡</br>
ナイトモードやお出かけモードにも対応｡</br>
</br>
詳しい情報はこちらから</br>
https://qr.ae/pGE2jB</br>
</br>
# 要件
- ｢SwitchBotスマートプラグ｣に接続した加湿器
- ｢Switchbot温湿度計｣1つ
- SwitchBotの｢Hub Mini｣､もしくは｢Hub Plus｣
- Google Apps Scriptが実行できる環境
 
</br>

# インストール方法
1. 以下のURLを開き､コピーを作成する｡</br>
https://script.google.com/home/projects/1venkm6ofbS90jMsmaoqawzQYPbBRdxRU7aT-YW_3uv0aGTZjktKu6z0m</br>
2. GitHubからsettings.jsonをダウンロードする
3. settings.jsonに以下を記入する
   1. "humidity"の隣にある"fill"に任意のスプレッドシートIDを記入する
   2. "CountSwitchbotApi"の隣にある"fill"に任意のスプレッドシートIDを記入する
   3. "idList"の隣にある"fill"に任意のスプレッドシートIDを記入する
5. 2と同様にtoken.jsonをダウンロードする
6. token.jsonに以下を記入する
    1. "thermometer" : "fill"の"fill"に｢Switchbot温湿度計｣のデバイスIDを記入する
    2.  "humidifier" : "fill"の"fill"に｢SwitchBotスマートプラグ｣のデバイスIDを記入する
    3.  "airConditionerOn": "fill"の"fill"にエアコンをつける手動実行シーンのシーンIDを記入する
    4.  "airConditionerOff" : "fill"の"fill"にエアコン消す手動実行シーンのシーンIDを記入する
8. settings.jsonとtoken.を1でダウンロードしたプロジェクトと同じ場所に保存する
10. doGet.gsをウェブアプリとしてデプロイする
11. URLを控える
</br>

# 使い方
プロジェクトのトリガーを設定することで自動実行します｡
1. RecordHumidityを時間トリガーで任意の間隔に設定します(5~10分を推奨)
2. AirconditioningControllerを時間トリガーで任意の間隔に設定します(1~5分を推奨)
 
 またデプロイしたWebアプリのURLにパラメータを付けることでモードの切り替えが可能です｡</br>
 
 
 ---
 
 https: //script.google.com/macros/s/AKfycbybiKJKk1-_CHJ7Owlw8a0FapWd7asdjgxi1A/exec</br>
 というURLの場合､URLの末尾に"?p1=1"などパラメータを加えてリンクを踏むとモードが切り替えられます｡</br>
 0がoff, 1がonとなっており､パラメータは
  - p1: 家にいるかを判断する｢お家モード｣
  - p2: 空調管理を行う｢エアコンモード｣
  - p2: 空調管理を行わない｢おやすみモード｣
となっています｡
 実行例)</br>
   https: //script.google.com/macros/s/AKfycbybiKJKk1-_CHJ7Owlw8a0FapWd7asdjgxi1A/exec?p1=1&p2=1&p3=0</br>
   お家モードon､エアコンモードon､おやすみモードoff
   
