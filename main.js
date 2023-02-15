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
var save_dealer_card = [0, 0];//隠すためのカード情報
var card_type = ["club", "diamond", "heart", "spade"];


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
  //プレイヤー側の追加
  if (person == 1) {//ハートとか　　数字
    //htmlのカード画面書き換え
    document.querySelector(".playercard" + Number(card_count + 1)).src = "img/card_" + card_type[type_number] + "_" + ("00" + Number(sheets_number + 1)).slice(-2) + ".png";
    //ポイント用
    //ジャック、クイーン、キング、ではないかの確認
    if (sheets_number == 0) {
      my_points[1] += 1;
    }
    else if (sheets_number < 10) {
      my_points[0] += sheets_number + 1;
    }
    //ジャック、クイーン、キングは一律10;
    else {
      my_points[0] += 10;
    }
    document.querySelector(".player_score").innerHTML = "数値の合計：" + put_out_sum(my_points, null_points);

  }


  //ディーラー側の追加
  if (person == 0) {

    //2回目以降実行
    if (card_count != 0) {
      //htmlのカード画面書き換え
      document.querySelector(".dealercard" + Number(card_count + 1)).src = "img/card_" + card_type[type_number] + "_" + ("00" + Number(sheets_number + 1)).slice(-2) + ".png";
      //ジャック、クイーン、キング、ではないかの確認
      if (sheets_number == 0) {
        output_dealer_points[1] += 1;
      }
      else if (sheets_number < 10) {
        output_dealer_points[0] += sheets_number + 1;
      }
      //ジャック、クイーン、キングは一律10;
      else {
        output_dealer_points[0] += 10;
      }
      document.querySelector(".dealer_score").innerHTML = "相手の合計：" + put_out_sum(output_dealer_points, null_points);
    }

    //1回目のみ
    else {
      //隠すためのカード情報
      save_dealer_card[0] = type_number;
      save_dealer_card[1] = sheets_number;
      //ジャック、クイーン、キング、ではないかの確認
      if (sheets_number == 0) {
        save_dealer_points[1] += 1;
      }
      else if (sheets_number < 10) {
        save_dealer_points[0] += sheets_number + 1;
      }
      //ジャック、クイーン、キングは一律10;
      else {
        save_dealer_points[0] += 10;
      }
      //1か

    }

  }

};


//追加いらないjsでhtml書き換えられればいい
//カードを配る
function distribute_card(person) {
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
  //合計の関数
  let all_points = [0, 0];
  all_points[0] = points[0] + sub_points[0];
  all_points[1] = points[1] + sub_points[1];
  //ディーラーの出しているポイントと隠しているポイントを合計する

  while (all_points[0] <= 21 - 11 && all_points[1] > 0) {
    all_points[0] += 11;
    all_points[1] -= 1;
  }
  return all_points[0] + all_points[1];
}


//ディーラーのカードを引くかひかないかを決める
function correct_AI() {
  if (put_out_sum(save_dealer_points, output_dealer_points) < 17) {
    return 1;
  }
  else {
    return 0;
  }
}

//勝ち負け判定
function Win_or_lose() {
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
  //隠れているカードを出す
  document.querySelector(".dealercard1").src = "img/card_" + card_type[save_dealer_card[0]] + "_" + ("00" + Number(save_dealer_card[1] + 1)).slice(-2) + ".png";
  //合計値変更
  document.querySelector(".dealer_score").innerHTML = "相手の合計：" + put_out_sum(output_dealer_points, save_dealer_points);
  //次のターンに続行

  //勝敗を決める
  //ポイントを加算
  //負け
  if (Win_or_lose() == 0) {
    //クッキー書き込み
    write_cookie("my_bed", Number(my_beds) - Number(bed_score));
    document.querySelector(".judgement").src = "./img/pose_lose_boy.png";
  }
  //勝ち
  else if (Win_or_lose() == 1) {
    write_cookie("my_bed", Number(my_beds) + Number(bed_score * 2));
    document.querySelector(".judgement").src = "./img/pose_win_boy.png";
  }
  //ブラックジャック勝ち
  else if (Win_or_lose() == 2) {
    write_cookie("my_bed", Number(my_beds) + Number(bed_score * 3));
    document.querySelector(".judgement").src = "./img/pose_win_boy.png";
  }
  //ドロー
  else {
    my_beds += bed_score;
    document.querySelector(".judgement").src = "./img/animal_lemming.png";
  }
  write_cookie("game_count", Number(game_count) + 1);
  setTimeout(move_site, 3000);

}
//ゲーム終了

//bet.htmlに移る
function move_site() {
  if (game_count != 5) {
    window.location.href = "./bet.html";
  }
  else {
    window.location.href = "./index.html";
  }
}


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


//画面読み込み時に始動game.html
window.onload = function () {
  let path = location.pathname
  //cookie情報の読み込み
  game_count = read_cookie("game_count");
  my_beds = read_cookie("my_bed");
  bed_score = read_cookie("bed_score");
  document.querySelector(".round h3").innerHTML = "ラウンド" + game_count;



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
    card_count++;
    distribute_card(1);

    //バーストしたかの確認ーバーストしてたら強制スタンド移行
    if (put_out_sum(my_points, null_points) >= 21) {
      stand();
    }
  }
});



//スタンドボタン
//1ゲーム終了
document.querySelector(".sbtn").addEventListener("click", function () {
  stand()
});
function stand() {
  //ベッドした後か確認
  if (start_flag == 1) {
    card_count = 2;
    while (correct_AI() == 1) {
      distribute_card(0);
      card_count++;
    }
    //ヒット、スタンドを動かないようにする
    start_flag = 0
    //ターン終了
    finish_game();
  }
}