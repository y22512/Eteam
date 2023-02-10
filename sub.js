//index.html専用
//クッキー構成
/*
[key]
game_count 何ゲーム目か
bed_score  ベッド数
my_bed     自分の持ち金

*/

//クッキー書き込み
function write_cookie(key, value) {
    document.cookie = (key + "=" + value);
};


//クッキー読み込み
function read_cookie(key) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(key))
        .split('=')[1];
};
//スタート時に動く
window.onload = function () {
    let path = location.pathname
    //index.htmlの時に動く
    if (path == "/index.html") {
        //所持金の更新
        //kookieの初期化
        write_cookie("game_count", 0);
        write_cookie("bed_score", 0);
        write_cookie("my_bed", 100);
    }
    //bet.htmlの時に動く
    if (path == "/bet.html") {
        my_beds = read_cookie("my_bed");
        document.querySelector(".money").innerHTML = my_beds;
    }

}
document.querySelector(".bet-btn").addEventListener("click", function () {
    bed_score = document.querySelector(".betform").value;
    //正規表現
    if(/^[0-9]+$/.test(bed_score)){
        if((bed_score<=Number(read_cookie("my_bed"))||(bed_score<=100))){
            
            document.querySelector(".bet-btn").href="./game.html"
        }
        else{
            alert("掛け金が多すぎです");
        }
    }
    else{
        alert("数値を半角で入力してください");
    }
    //正規表現で数値のみ受付
    //クッキーの書き込み Numberで数値に変換
    write_cookie("bed_score", Number(bed_score));
    console.log(read_cookie);

});

