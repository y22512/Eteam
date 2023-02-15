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
        //所持金の更新
        //kookieの初期化
write_cookie("game_count", 0);
write_cookie("bed_score", 0);
write_cookie("my_bed", 100);
