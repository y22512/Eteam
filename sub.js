//index.html専用
//クッキー構成
/*
[key]
game_count 何ゲーム目か
bed_score  ベッド数
my_bed     自分の持ち金

*/

//クッキー書き込み
function write_cookie(key,value){
    document.cookie=(key+"="+value);
};
  
  
//クッキー読み込み
function read_cookie(key){
    return document.cookie
    .split('; ')
    .find(row => row.startsWith(key))
    .split('=')[1];
};
//スタート時に動く
//kookieの初期化
window.onload = function(){
    write_cookie("game_count",0);
    write_cookie("bed_score",0);
    write_cookie("my_bed",100);
}
