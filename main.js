// 遊び大全ルール
/*
    1,ベット数を入力
    2,最初に2枚配られる
      ディーラーは最後の１枚は見えない
    3,ヒット-カードを１枚ドロー
      ダブルダウン-掛け金を倍にして１枚ドロー
    4,21を超えたらバースト
    5,勝ったら掛け金の1.5倍を返す
      ブラックジャック(21)なら２倍にして返す
*/

//クッキー構成
/*
[key]
game_count 何ゲーム目か
bed_score  ベッド数
my_bed     自分の持ち金

*/

//2/8仕様変更　ディーラーのbedいらない

var my_beds = 100;//自分の持ち金
var dealer_beds = 100;//ディーラーの持ち金
var my_points = [0, 0];      //自分のポイント[点数,1の個数]
var output_dealer_points = [0, 0]; //ディーラーの表示用のポイント
var save_dealer_points = [0, 0];//ディーラーの隠している分のポイント
var bed_score = 0;//ベッド数
var start_flag = 0;//進んでいいかの確認フラグ
var card_count = 0;//カードの枚数
var dealer_first_flag = 0;//最初かの確認
var null_points = [0, 0];//空
var save_dealer_card=[0,0];//隠すためのカード情報
var card_type = ["club", "diamond", "heart", "spade"];
//var neutral_card_info=document.getElementsByClassName("player2");//初期状態のカードの並び


var card_correct = new Array(4);//画像の確認配列
//2次元目の画像配列
for (let i = 0; i < 4; i++) {
  card_correct[i] = new Array(13).fill(1);
};


//ランダム生成関数
function create_random_13() {
  return Math.floor(Math.random() * 100 % 13);
};
function create_random_4() {
  return Math.floor(Math.random() * 100 % 4);
};

//追加いらないjsでhtml書き換えられればいい
//配られたカードを持っているカードに追加
function add_distribute_card(type_number, sheets_number, person) {
  console.log("add_distribute_card");
  //プレイヤー側の追加
  if (person == 1) {//ハートとか　　数字
    //htmlのカード画面書き換え
    // document.querySelector(".dealercard" + card_count).src = "/img/card_" + card_type[type_number] + "_" + ("00" + sheets_number).slice(-2);
    document.querySelector(".playercard"+Number(card_count+1)).src = "img/card_club_02.png";
    console.log("jkfsdjklsdf");
    //ポイント用
    //ジャック、クイーン、キング、ではないかの確認
    if (sheets_number < 10) {
      my_points[0] += sheets_number + 1;
    }
    //ジャック、クイーン、キングは一律10;
    else {
      my_points[0] += sheets_number + 10;
    }
    //1があるか
    if (sheets_number == 0) {
      my_points[1] += 1;
    }
  }


  //ディーラー側の追加
  if (person == 0) {
    //dealer_card.push([type_number, sheets_number]);
    
    //2回目以降実行
    if (card_count != 0) {
      output_dealer_points[0] += save_dealer_points[0];
      output_dealer_points[1] += save_dealer_points[1];
      //htmlのカード画面書き換え
    document.querySelector(".dealercard" +Number(card_count+1)).src = "img/card_club_02.png";
    }
    //1回目のみ
    else{
      //隠すためのカード情報
      save_dealer_card[0]=type_number;
      save_dealer_card[1]=sheets_number;
    }
    //ジャック、クイーン、キング、ではないかの確認
    if (sheets_number <= 10) {
      save_dealer_points[0] += sheets_number + 1;
    }
    //ジャック、クイーン、キングは一律10;
    else {
      save_dealer_points[0] += sheets_number + 10;
    }
    //1か
    if (sheets_number == 0) {
      save_dealer_points[1] += 1;
    }
  }

};


//追加いらないjsでhtml書き換えられればいい
//カードを配る
function distribute_card(person) {
  console.log("distribute_card");
  let draw_type_number = create_random_4();
  let draw_sheets_number = create_random_13();
  while (card_correct[draw_type_number][draw_sheets_number] == 0) {
    draw_type_number = create_random_4();
    draw_sheets_number = create_random_13();
  };
  //ドローしたので0にする
  card_correct[draw_type_number][draw_sheets_number] = 0
  //ドローしたカードを追加する
  add_distribute_card(draw_type_number, draw_sheets_number, person)

}


//点数計算
//sub_pointsはディーラーのみ、普段は[0,0]を代入
function put_out_sum(points, sub_points) {
  console.log("put_out_sum");
  //ディーラーの出しているポイントと隠しているポイントを合計する
  points[0] += sub_points[0];
  points[1] += sub_points[1];

  while (points[0] <= 21 - 11 && points[1] > 0) {
    points[0] += 11;
    points[1] -= 1;
  }
  return points[0] + points[1];
}


//ディーラーのカードを引くかひかないかを決める
function correct_AI() {
  console.log("correct_AI");
  if (put_out_sum(save_dealer_points, output_dealer_points) < 17) {
    return 1;
  }
  else {
    return 0;
  }
}

//勝ち負け判定
function Win_or_lose() {
  console.log("Win_or_lose");
  //バーストしているか
  if (put_out_sum(my_points, null_points) > 21) {
    //ディーラーの勝利
    return 0;
  }
  else if (put_out_sum(my_points, null_points) == 21) {
    return 2;//ブラックジャック勝利
  }
  else if (put_out_sum(save_dealer_points, output_dealer_points) > 21) {
    return 1;//プレイヤーの勝利
  }
  else if (put_out_sum(save_dealer_points, output_dealer_points) == 21) {
    return 0;//ブラックジャック負け
  }
  else if (put_out_sum(save_dealer_points, output_dealer_points) > put_out_sum(my_points, null_points)) {
    return 0;//ディーラーの勝利
  }
  else if (put_out_sum(save_dealer_points, output_dealer_points) == put_out_sum(my_points, null_points)) {
    return 3//ドロー
  }
  else {
    return 1//プレイヤー勝利
  }
}

//1ゲーム終了
function finish_game() {
  console.log("finish_game");
  //次のターンに続行
  if (game_count != 5) {
    //勝敗を決める
    //ポイントを加算
    //負け
    if (Win_or_lose() == 0) {

    }
    //勝ち
    else if (Win_or_lose() == 1) {
      my_beds += bed_score * 2
    }
    //ブラックジャック勝ち
    else if (Win_or_lose() == 2) {
      my_beds += bed_score * 2.5;
    }
    //ドロー
    else {
      my_beds += bed_score;
    }
    //カードを隠す
    //ドローカードをリセット
    reset()
  }
  //ゲーム終了
  else {

  }
};

//次のターン用のリセット
// function reset(){
//   my_points = [0, 0];      //自分のポイント[点数,1の個数]
//   output_dealer_points = [0, 0]; //ディーラーの表示用のポイント
//   save_dealer_points = [0, 0];//ディーラーの隠している分のポイント
//   bed_score = 0;//ベッド数
//   delete my_card;//自分の持っているカード-削除
//   delete dealer_card;//相手が持っているカード-削除
//   var my_card=0;//自分の持っているカード
//   var dealer_card=0;//相手が持っているカード
//   start_flag = 0;//進んでいいかの確認フラグ
//   dealer_first_flag = 0;//最初かの確認
//   delete card_correct;//削除
//   var card_correct = new Array(4);//画像の確認配列
//   for (let i = 0; i < 4; i++) {
//     card_img[i] = new Array(13).fill(1);
//   };
//   document.getElementsByClassName("player2")=neutral_card_info;
//   document.getElementsByClassName("player1")=neutral_card_info;
// }


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




//所持金額を表示
// window.onload = () => {
//   let path = location.pathname
//   if(path == "./bet.html"){
//     document.querySelector(".money").innerHTML=my_beds;
//   }
// }
//bet.htmlの金額を表示

console.log(location.pathname);
//画面読み込み時に始動game.html
window.onload = function () {
  let path = location.pathname
    //cookie情報の読み込み
    game_count = read_cookie("game_count");
    my_beds = read_cookie("my_bed");
    bed_score = read_cookie("bed_score");




    //カードを2枚ドロー
    for (let i = 0; i < 2; i++) {
      card_count = i;
      //プレイヤー側
      distribute_card(1)
      //ディーラー側
      distribute_card(0)
    };

    //ヒット、スタンドボタンを動くようにする
    start_flag = 1;

}


//ヒットボタン
document.querySelector(".hbtn").addEventListener("click", function () {
  //ベッドした後か確認
  if (start_flag == 1) {
    //プレイヤー側
    distribute_card(1);
    //バーストしたかの確認ーバーストしてたら強制スタンド移行
    if (put_out_sum(my_points, null_points) > 21) {
      stand();
    }
  }
});


//スタンドボタン
//1ゲーム終了
document.querySelector(".sbtn").addEventListener("click", function stand() {
  //ベッドした後か確認
  if (start_flag == 1) {
    while (correct_AI() == 1) {
      distribute_card(0);
    }
    //ターン終了
    finish_game();
  }
});