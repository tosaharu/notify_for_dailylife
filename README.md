# notify_for_dailylife
開発期間:2~3日(2022/7)

## 機能概要

- LINE BOT を通じてデイリーで必要な情報を通知する  
  1. Googleカレンダー
  1. 天気予報
  1. 電車遅延情報
  1. ゴミ分別
  
- TIME TREE アプリにGoogleカレンダー情報を自動登録する  
⇒複数人でスケジュール共有をしたいが諸事情で直でGoogleカレンダー共有できず困った。  
解決策としてTime Treeを通して共有。  

## 使用技術

- 開発言語
  - GoogleAppScript

- API
  - LINE API
  - TimeTree API

- データ
  - 気象庁天気予報
  https://www.jma.go.jp/bosai/forecast/
  - JR西日本運行情報
  https://www.train-guide.westjr.co.jp/area_kinki.html

## 参考
https://qiita.com/takatama/items/21f0afd911d7d6f04862  
https://qiita.com/k_kado__j_ichi/items/7081bc62618bef32eb0e
