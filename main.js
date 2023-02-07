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
var my_points = [0, 0];      //自分のポイント[点数,1の個数]
var dealer_points = [0, 0];  //ディーラーのポイント[点数,1の個数]
var output_dealer_points = [0,0]; //ディーラーの表示用のポイント
var save_dealer_points = [0,0];//ディーラーの隠している分のポイント
var bed_Score = 0;//ベッド数
var turns_number = 0;//ターン数
var my_card;//自分の持っているカード
var dealer_card;//相手が持っているカード
var start_flag = 0;//進んでいいかの確認フラグ


var card_correct = new Array(4);//画像の確認配列
//2次元目の画像配列
for (let i = 0; i < 4; i++) {
  card_img[i] = new Array(13).fill(1);
};


//ランダム生成関数
function create_random_13() {
  return Math.floor(Math.random() * 100 % 13);
};
function create_random_4() {
  return Math.floor(Math.random() * 100 % 4);
};


//配られたカードを持っているカードに追加
function add_distribute_card(type_number, sheets_number, person) {
  //プレイヤー側の追加
  if (person == 1) {               //ターン数　　ハートとか　　数字
    my_card.push([turns_number, type_number, sheets_number]);
    //ジャック、クイーン、キング、ではないかの確認
    if (sheets_number <= 10) {
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
    dealer_card.push([turns_number, type_number, sheets_number]);
  }
  //ジャック、クイーン、キング、ではないかの確認
  if (sheets_number <= 10 && sheets_number != 0) {
    dealer_points[0] += sheets_number + 1;
  }
  //ジャック、クイーン、キングは一律10;
  else {
    dealer_points[0] += sheets_number + 10;
  }
  //1か
  if (sheets_number == 0) {
    dealer_points[1] += 1;
  }
};



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
function put_out_sum(points,sub_points) {
  //ディーラーの出しているポイントと隠しているポイントを合計する
  points+=sub_points;
  
  while (points[0] <= 21 - 11 && points[1] > 0) {
    points[0] += 11;
    points[1] -= 1;
  }
  return points[0] + points[1];
}


//ディーラーのカードを引くかひかないかを決める
function correct_AI() {
  if (put_out_sum(dealer_points) < 17) {
    return 1;
  }
  else {
    return 0;
  }
}


//1.ベッド数を入力
document.querySelector().addEventListener("click", function () {
  bed_Score = document.querySelector();
  //カードを2枚ドロー
  for (let i = 0; i < 2; i++) {
    //プレイヤー側
    distribute_card(1)

    //ディーラー側
    distribute_card(0)

    turns_number += 1;
  };
  //ヒット、スタンドボタンを動くようにする
  start_flag = 1;
});


//ヒットボタン
document.querySelector().addEventListener("click", function () {
  //ベッドした後か確認
  if (start_flag == 1) {
    //プレイヤー側
    distribute_card(1);
    //ディーラー側
    if (correct_AI == 1) {
      distribute_card(0);
    }
  }
});