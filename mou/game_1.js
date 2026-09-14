const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ====================
// シーン
//  0: タイトル
//  1: オープニング
//  2: 操作説明
//  3: ゲーム画面
//  4: エンディング
//  5: 設定(FROM オープニング)
//  6: 設定(FROM ESC)
//  7: メニュー
//  8: セーブスロット選択
//  9: ロードスロット選択
// ====================
let scene = 0;
// タイトル画面
const titleNormal = new Image();
titleNormal.src = "title.png";

const titleStart = new Image();
titleStart.src = "title_start.png";

const titleLoad = new Image();
titleLoad.src = "title_load.png";

const titleSetting = new Image();
titleSetting.src = "title_config.png";

let titleImage = titleNormal;
let seVolume = 50;

const sounds = {
    startButton : new Audio("startButton.mp3"),
    messageDisplay : new Audio("messageDisplay.mp3"),
    pickItem : new Audio("pickItem.mp3"),
    move : new Audio("move.mp3"),
    NGmove: new Audio("NGmove.mp3"),
    walking : new Audio("walking.mp3"),
    itemUse : new Audio("itemUse.mp3"),
    openDoor : new Audio("openDoor.mp3"),
    openBath : new Audio("openBath.mp3"),
    panch : new Audio("panch.mp3"),
    dial : new Audio("dial.mp3"),
    openDial : new Audio("openDial.mp3"),
    tv : new Audio("tv.mp3")
};
sounds.messageDisplay.loop = true;
sounds.walking.loop = true; 

sounds.startButton.volume = 0.4;
sounds.messageDisplay.volume = 0.3;
sounds.pickItem.volume = 0.4;
sounds.move.volume = 0.4;
sounds.NGmove.volume = 0.4;
sounds.walking.volume = 0.5;
sounds.itemUse.volume = 0.1;
sounds.openDoor.volume = 0.4;
sounds.openBath.volume = 0.4;
sounds.panch.volume = 0.4;
sounds.dial.volume = 0.3;
sounds.openDial.volume = 0.4;
sounds.tv.volume = 0.35;

// 設定50のときの基準音量を保存
const baseSEVolume = {};

for(const name in sounds){
    baseSEVolume[name] = sounds[name].volume;
}

function updateSEVolume(){

    const ratio = seVolume / 50;

    for(const name in sounds){
        sounds[name].volume = Math.min(baseSEVolume[name] * ratio, 1);
    }
}


function playSound(name){
    const sound = sounds[name];

    if(!sound) return;

    sound.currentTime = 0;
    sound.play();
}

function drawTitle(){
    ctx.drawImage(
        titleImage,
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function drawSetting(){

    // 背景
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 外枠
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 520);


    // ====================
    // タイトル
    // ====================

    ctx.fillStyle = "white";
    ctx.font = "28px 'DotGothic16'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("設定",400,90);

    // ====================
    // SE音量
    // ====================

    ctx.font = "20px 'DotGothic16'";
    ctx.fillText("SE音量",290,170);

    ctx.fillText("◀",380,170);

    ctx.fillText(seVolume + "%",440,170);

    ctx.fillText("▶",500,170);


    // ====================
    // 区切り線
    // ====================

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(150, 230);
    ctx.lineTo(650, 230);
    ctx.stroke();

    // ====================
    // CREDIT
    // ====================

    ctx.font = "18px 'DotGothic16'";
    ctx.fillText("CREDIT",400,285);

    ctx.font = "20px 'DotGothic16'";
    ctx.fillText("Yuzella",400,335);


    ctx.font = "17px 'DotGothic16'";
    ctx.fillText("X : @ yuzella_gm",400,375);

    ctx.font = "15px 'DotGothic16'";
    ctx.fillText("感想やフォローをいただけると嬉しいです！",400,420);


    // ====================
    // 戻る
    // ====================

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        320,
        485,
        160,
        45
    );

    ctx.font = "18px 'DotGothic16'";
    ctx.fillStyle = "white";

    ctx.fillText(
        "戻る",
        400,
        507
    );
}

canvas.addEventListener("mousemove", function(event){

    const rect = canvas.getBoundingClientRect();

    const mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY = (event.clientY - rect.top) * canvas.height / rect.height;

    // ====================
    // タイトル画面
    // ====================

    if(scene === 0){

        // はじめから
        if(
            mouseX >= 140 &&
            mouseX <= 370 &&
            mouseY >= 290 &&
            mouseY <= 335
        ){
            titleImage = titleStart;
        }

        // つづきから
        else if(
            mouseX >= 140 &&
            mouseX <= 370 &&
            mouseY >= 350 &&
            mouseY <= 395
        ){
            titleImage = titleLoad;
        }

        // 設定
        else if(
            mouseX >= 140 &&
            mouseX <= 370 &&
            mouseY >= 410 &&
            mouseY <= 455
        ){
            titleImage = titleSetting;
        }

        else{
            titleImage = titleNormal;
        }

        return;
    }

    // ====================
    // 操作説明
    // ====================

    if(scene === 2){

        if(
            mouseX >= 260 &&
            mouseX <= 540 &&
            mouseY >= 510 &&
            mouseY <= 555
        ){
            explainStartHover = true;
        }
        else{
            explainStartHover = false;
        }

        return;
    }

    if(scene === 7){

        // セーブ
        if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 160 &&
            mouseY <= 215
        ){
            menuHover = 0;
        }

        // ロード
        else if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 240 &&
            mouseY <= 295
        ){
            menuHover = 1;
        }

        // タイトルに戻る
        else if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 320 &&
            mouseY <= 375
        ){
            menuHover = 2;
        }

        // ゲームに戻る
        else if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 400 &&
            mouseY <= 455
        ){
            menuHover = 3;
        }

        else{
            menuHover = -1;
        }

        return;
    }

    if(scene === 8 || scene === 9){

        slotHover = -1;
        deleteHover = -1;

        for(let i = 1; i <= 3; i++){

            const y = 140 + (i - 1) * 110;

            // スロット本体
            if(
                mouseX >= 180 &&
                mouseX <= 620 &&
                mouseY >= y &&
                mouseY <= y + 80
            ){
                slotHover = i;
            }

            // 削除ボタン
            if(
                scene === 9 &&
                mouseX >= 630 &&
                mouseX <= 720 &&
                mouseY >= y &&
                mouseY <= y + 80
            ){
                deleteHover = i;
            }
        }

        return;
    }
});

let slotHover = -1;
let deleteHover = -1;
let loadFrom = 0;
// 0 : タイトル
// 1 : ゲーム中メニュー

function drawSlotMenu(type){

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 520);

    ctx.fillStyle = "white";
    ctx.font = "28px 'DotGothic16'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if(type === "save"){
        ctx.fillText("セーブ", 400, 90);
    }
    else{
        ctx.fillText("ロード", 400, 90);
    }


    for(let i = 1; i <= 3; i++){
        const x = 180;
        const y = 140 + (i - 1) * 110;
        const width = 440;
        const height = 80;

        // ホバー
        if(slotHover === i){
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, width, height);

            ctx.fillStyle = "black";
        }
        else{
            ctx.fillStyle = "black";
            ctx.fillRect(x, y, width, height);

            ctx.strokeStyle = "white";
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "white";
        }

        ctx.font = "20px 'DotGothic16'";
        ctx.fillText("スロット " + i,300,y + 28);

        const data = localStorage.getItem("mouSaveData" + i);

        ctx.font = "14px 'DotGothic16'";

        if(data !== null){

            const saveData = JSON.parse(data);

            ctx.fillText("セーブデータあり",480,y + 25);

            if(saveData.savedAt){
                ctx.fillText(saveData.savedAt,480,y + 52);
            }
        }
        else{
            ctx.fillText("データなし",480,y + 40);
        }

        // ロード画面だけ削除ボタンを表示
        if(type === "load"){

            if(deleteHover === i){

                // ホバー中
                ctx.fillStyle = "white";
                ctx.fillRect(630, y, 90, height);

                ctx.fillStyle = "black";
            }
            else{

                // 通常
                ctx.fillStyle = "black";
                ctx.fillRect(630, y, 90, height);

                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.strokeRect(630, y, 90, height);

                ctx.fillStyle = "white";
            }

            ctx.font = "16px 'DotGothic16'";

            ctx.fillText("削除",675,y + height / 2);
        }
    }


    // 戻る
    ctx.strokeStyle = "white";
    ctx.strokeRect(320, 490, 160, 45);

    ctx.fillStyle = "white";
    ctx.font = "18px 'DotGothic16'";
    ctx.fillText("戻る", 400, 512);
}

function drawMenu(){

    // 背景
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 外枠
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 520);

    // タイトル
    ctx.fillStyle = "white";
    ctx.font = "28px 'DotGothic16'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("メニュー", 400, 100);

    function drawMenuButton(text, x, y, width, height, index){

        // マウスが乗っている
        if(menuHover === index){

            ctx.fillStyle = "white";
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = "black";
        }

        // 通常
        else{

            ctx.fillStyle = "black";
            ctx.fillRect(x, y, width, height);

            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "white";
        }

        ctx.font = "18px 'DotGothic16'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            text,
            x + width / 2,
            y + height / 2
        );
    }

    drawMenuButton("セーブ", 270, 160, 260, 55, 0);
    drawMenuButton("ロード", 270, 240, 260, 55, 1);
    drawMenuButton("タイトルに戻る", 270, 320, 260, 55, 2);
    drawMenuButton("ゲームに戻る", 270, 400, 260, 55, 3);
}

// ====================
// オープニングの文章
// ====================
let openingMessages = [
    "俺の名前は黒崎悠真。21歳の大学生。",
    "俺は半年前、交通事故で両目の視力を失った。",
    "杖が欠かせない生活は初めはきつかったが、時間が経つにつれ次第に慣れてきた。",
    "今の季節は冬。今年の冬は夜こそ信じられない寒さだが、昼はそこまで寒くない。\nとりあえず早く家に帰ってコーヒーでも飲もう。",
    "俺の前を歩く人が気を遣って俺を避けて通ってくれるのはありがたいが、\n申し訳ないという気持ちも同時に沸く。\nこの感情だけは慣れることはなさそうだ。",
    "角を曲がって、人の気配がしない裏道を通る。大学からのいつもの帰り道だ。",
    "途端、鈍い音がして地面に倒れこむ。後頭部を殴られた。\n殴ってきた人に運ばれるのを感じながら、気を失ってしまった。",
    "目を覚ます。自分がどこにいるのかも分からない。\n冬とは思えない暖かさだ。おそらく室内だろう。",
    "杖がない。急に不安が押し寄せてきた。",
    "それでも悠長にしている余裕はない。\nじっとしていると何が起こるかわからない。\n早く脱出しなければ。"
];

let messageIndex = 0;


// ====================
// ゲーム画面の文章
// ====================
let gameMessages = [
    "脚がないタイプの\nソファがある。", // 0
    "棚が置いてある。\n本など、いろいろなものが\n入っている。", // 1
    "ローテーブルが置いてある。", // 2
    "ローテーブルが置いてある。\n机の上には温かいコップが\n1つ置いてある。", // 3
    "物干し竿だ。\nいくつか服が干してある。", // 4
    "窓がある。\n窓に手を当てると、\nあまりにも冷たい冷気を感じた。\n人や車の気配も一切しない。", // 5
    "テレビがある。\n電源は入っていない。", // 6
    "腰の高さほどの机がある。", // 7
    "腰の高さほどの机がある。\n机の上にリモコンを見つけた。", // 8
    "木のような材質の\n椅子がある。", // 9
    "ストーブがある。\n電源は入っていない。", // 10
    "クローゼットのようだ。\n奥には暖かそうな服が\nハンガーにかけてあった。", // 11
    "クローゼットのようだ。\nダイヤル付きの鍵がかかった\n大きな金庫が置いてある。", // 12
    "クローゼットのようだ。\n金庫にはもう何も入っていない。",//13
    "冷蔵庫だ。\n中には冷凍食品など、\n多くはないが中身が入っている。", // 14
    "トイレだ。", // 15
    "シャワーがある。", // 16
    "浴槽がある。", // 17
    "キッチンだ。\n結構広い。", // 18
    "キッチンだ。\n木製のまな板の上に\n包丁が置いてある。", // 19
    "キッチンだ。\n木製のまな板がある。", // 20
    "キッチンだ。\nIHヒーターが3つある。\n羨ましい。", // 21
    "玄関だ。\nここから出られそうだ。", // 22
    "閉まっているドアがある。", // 23
    "さっき開けたドアがある。", // 24
    "壁がある。", //25
    "玄関だ。\n杖がないと出ても無駄だ。\nまずは杖を探そう。", //26
    "洗濯機がある。", //27
    "靴棚がある。\nそこまで数は多くない。", //28
    "机がある。\nさっきここでリモコンを拾った。", //29
    "棚が置いてある。\n本など、いろいろなものが\n入っている。\n電池を見つけた。", //30
    "クローゼットのようだ。\n金庫の中には、杖が入っている。", //31
    "クローゼットのようだ。\n正面に回ろう。"//32
];

let tvMessages = [
    "リモコンのボタンを押し、テレビをつけた。",
    "テレビをつけると、ニュースが流れていた。",
    "「十時のニュースです。今から45分前に起きた大学生への暴行、\n監禁事件について、最新の情報が入ってきました。」",
    "俺の事件のことが報道されている。",
    "「現場には『時間を忘れないように。』と書かれた紙が落ちていました。」",
    "「警察は犯人が計画的な犯行に及んだとみて、捜査を続けています。」",
    "ニュースが終わり、テレビを切った。",
    "時間を忘れないように...。\n犯人は犯行に及ぶ時間を決めて、忘れないようにしていたのか。"
];

let tvMessages_repeat = [
    "もうテレビをつける必要はない。",
    "さっきの十時のニュースで言っていたことをまとめると、\n事件が起きたのは今から45分前。",
    "現場には犯人が書いたらしい「時間を忘れないように」と\n書かれた紙が落ちていた。このくらいだろう。"
];

// ====================
// エンディング画面の文章
// ====================

let endMesseges_1 = [ //監禁エンド
    "杖も持った。ここがどこかは分からないが、とにかく出ることが最優先だ。",
    "外に出たら助けを呼ぼう。叫べば、きっと誰かが助けてくれる。",
    "淡い期待を胸にドアノブに手をかける。",
    "「出られると思った？」",
    "聞き覚えのある声とともに、後頭部を殴られる。あの時と同じだ。\nそのまま気を失ってしまった。",
    "目が覚める。手足を動かすことができない。もうここから出るのは無理だろう。",
    "毎日数回体のあらゆる部位を殴られる。抵抗することもできない。",
    "あれから何日たっただろう。もう抵抗する気力も失った。",
    "もういっそ、殺してくれればいいのに。",
    "END1 復讐"
];
let endMesseges_2 = [ //殺害エンド
    "杖も持った。ここがどこかは分からないが、とにかく出ることが最優先だ。",
    "外に出たら助けを呼ぼう。叫べば、きっと誰かが助けてくれる。",
    "淡い期待を胸にドアノブに手をかける。",
    "「出られると思った？」",
    "知っている声がした。俺のことを監禁してきたやつ。許さない。",
    "持っていた包丁でそいつのことを突き刺す。",
    "声で分かった。俺を監禁した犯人は畠中。俺の高校時代の同級生だ。",
    "高校時代、俺はこいつのことをいじめていた。靴を隠したり、教科書を破ったり、\n机の上に一輪の花が入った花瓶を置いてみたり。",
    "こいつの反応を見るのが楽しくて仕方がなかった。",
    "だが、こいつはとうとう学校に来なくなった。",
    "高校を卒業して、大学に入学した。普通の生活を送っていたある日、\n車が俺に向かって突撃してきた。",
    "犯人は畠中だった。\n俺はこの事故で視力を失った。\n畠中は警察に捕まることなく、逃走を続けていた。",
    "そして俺は逃走を続ける畠中に殴られ、監禁されたというわけだ。",
    "「復讐のつもり？」\n動く気配のしない畠中に語り掛ける。",
    "ドアを開け、外に出る。のちに警察が俺のもとに来たが、\n監禁されていた俺は正当防衛ということで無罪となった。",
    "お前ごときが、俺に復讐できると思うなよ。",
    "END2 報復"
];

let door = [false,false,false]
let angle = 1;


// ====================
// 文字表示用
// ====================

let charIndex = 0;
const textSpeed = 65;
let isTyping = false;
let textTimer = null;
let currentText;
let explainStartHover = false;

// ====================
// 文章を開始
// ====================

function startMessage(){
    charIndex = 0;
    isTyping = true;

    sounds.messageDisplay.currentTime = 0;
    sounds.messageDisplay.play();

    if(textTimer !== null){
        clearInterval(textTimer);
    }

    textTimer = setInterval(function(){
        charIndex++;

        if(charIndex >= openingMessages[messageIndex].length){
            charIndex = openingMessages[messageIndex].length;
            isTyping = false;

            // 文章が流れ終わったら止める
            sounds.messageDisplay.pause();
            sounds.messageDisplay.currentTime = 0;

            clearInterval(textTimer);
            textTimer = null;
        }
    }, textSpeed);
}


// ====================
// 文章表示 シーン1
// ====================

function drawMessage(){
    // 文章ボックス
    ctx.fillStyle = "black";
    ctx.fillRect(40, 430, 720, 130);

    // 枠線
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 400, 720, 160);

    // 現在表示する文章
    if(scene == 1){
        currentText = openingMessages[messageIndex].substring(0, charIndex);
    }

    // 改行
    let lines = currentText.split("\n");

    // 文章
    ctx.fillStyle = "white";
    ctx.font = "18px 'DotGothic16'";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    for(let i = 0; i < lines.length; i++){
        ctx.fillText(lines[i], 60, 450 + i * 35);
    }

    // 全文表示後
    if(!isTyping){
        ctx.font = "18px sans-serif";
        ctx.fillText("▼", 700, 535);
    }
}


// ====================
// 操作説明 シーン2
// ====================

function gameExplain() {

    // 背景
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 外枠
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 520);

    // タイトル
    ctx.fillStyle = "white";
    ctx.font = "28px 'DotGothic16'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("操作説明", 400, 90);

    // ====================
    // キー表示用関数
    // ====================
    function drawKey(key, x, y, width = 50){

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            width,
            40
        );

        ctx.fillStyle = "white";
        ctx.font = "18px 'DotGothic16'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            key,
            x + width / 2,
            y + 20
        );

        ctx.textAlign = "left";
    }

    ctx.font = "18px 'DotGothic16'";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    drawKey("W", 180, 135);
    ctx.fillText("前進",330,155);

    drawKey("A", 180, 195);
    drawKey("D", 240, 195);
    ctx.fillText("左を向く / 右を向く",330,215);

    drawKey("E", 180, 255);
    ctx.fillText("アイテムの取得 / 使用",330,275);
   
    drawKey("R", 180, 315);
    ctx.fillText("スタート地点からやり直す",330,335);
    
    drawKey("ESC", 170, 375, 70);
    ctx.fillText("メニュー",330,395);

    ctx.font = "15px 'DotGothic16'";
    ctx.textAlign = "center";

    ctx.fillText("※ 持ち物に「リモコン (1)」のように数字が表示された場合、",400,460);

    ctx.fillText("対応する数字キーを押すとアイテムを使用できます。",400,490);

    // ====================
    // ゲーム開始ボタン
    // ====================

    const buttonX = 260;
    const buttonY = 510;
    const buttonWidth = 280;
    const buttonHeight = 45;

    if(explainStartHover){

        // 白背景
        ctx.fillStyle = "white";
        ctx.fillRect(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight
        );

        // 黒文字
        ctx.fillStyle = "black";
    }
    else{

        // 黒背景
        ctx.fillStyle = "black";
        ctx.fillRect(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight
        );

        // 白枠
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight
        );

        // 白文字
        ctx.fillStyle = "white";
    }

    ctx.font = "18px 'DotGothic16'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("ここをクリックしてゲーム開始",buttonX + buttonWidth / 2,buttonY + buttonHeight / 2);
}


// ====================
// ゲーム画面　シーン3
// ====================

let ingameMessage = "";
let messageTimer = null;
let item = [false,false,false,false]; //リモコン、電池、包丁、杖
let findItem = [false,false,false,false];
let map = [ //x=0,1,2,...,15
    ["壁","壁","壁","壁","壁","壁","壁","壁","壁","ド0","壁","壁","壁","壁","壁","壁","壁"], //Y=0
    ["","棚","ソ","ソ","ソ","","","","","ド0","","","","","","","玄"], //Y=1
    ["","物","ロ1","ロ1","ロ2","","ス","","","冷","","キ1","キ2","キ3","洗","靴","壁"], //Y=2
    ["窓","","","","","","","","ク1","ド1","ド1","ド2","浴","","","","壁"], //Y=3
    ["窓","","","","","","","","ク2","","","","浴","","","","壁"], //Y=4
    ["","テ","","","机1","机2","椅","","ク2","","ト","シ","浴","","","","壁"], //Y=5
    ["","テ","","","机1","机1","椅","","ク2","","","","","","","","壁"],  //Y=6
    ["壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁","壁"] //Y=7
];

let leftMessage = "";
let frontMessage = "";
let rightMessage = "";
let tempMessage = "";
let haveBattery = false;
let needBattery = false;
let safeOpen = false;          // 金庫の入力画面を表示中か
let safeNumber = [0, 0, 0, 0]; // 現在の4桁
let safeUnlocked = false;
let tvWatched = false;
let tvPlaying = false;
let tvMessageIndex = 0;
let openDoorCheck = false;
let resetCheck = false;
let endingType = 0;
let menuHover = -1;

function drawSafe(){

    // 金庫入力画面の背景
    ctx.fillStyle = "black";
    ctx.fillRect(400, 410, 380, 170);

    // 枠
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(400, 410, 380, 170);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 三角形
    ctx.font = "18px sans-serif";

    for(let i=0;i<4;i++){

        let x = 500 + i * 60;

        // 上
        ctx.fillText("▲", x, 465);

        // 数字
        ctx.font = "22px 'DotGothic16'";
        ctx.fillText(safeNumber[i], x, 500);

        // 下
        ctx.font = "18px sans-serif";
        ctx.fillText("▼", x, 535);
    }
}

function drawMessage_scene3(message, x, y) {
    const lines = message.split("\n");

    lines.forEach((line, i) => {
        ctx.fillText(line, x, y + i * 25);
    });
}


function showMessage(text) {
    ingameMessage = text;

    // 前のタイマーがあれば解除
    if(messageTimer !== null){
        clearTimeout(messageTimer);
    }

    // 画面を再描画
    gameStart();

}

function observe_check(directAngle,direct){
    switch(direct){
        case "壁":
            tempMessage = gameMessages[25];
            break;
        case "棚":
            if(!item[1] && needBattery && !haveBattery){
                tempMessage = gameMessages[30];
            }
            else{
                tempMessage = gameMessages[1];
            }
            break;
        case "ソ":
            tempMessage = gameMessages[0];
            break;
        case "玄":
            if(item[3]){ //杖所持
                tempMessage = gameMessages[22];
            }else{
                tempMessage = gameMessages[26];
            }
            break;
        case "物":
            tempMessage = gameMessages[4];
            break;
        case "ロ1":
            tempMessage = gameMessages[2];
            break;
        case "ロ2":
            tempMessage = gameMessages[3];
            break;
        case "ス":
            tempMessage = gameMessages[10];
            break;
        case "冷":
            if(positionX ==  8 && positionY == 2){
                tempMessage = gameMessages[25];
            }
            else{
                tempMessage = gameMessages[14];
            }
            break;
        case "キ1":
            if(positionX == 10){
                tempMessage = gameMessages[25];
            }
            else{
                if(positionY == 3 && door[2]){
                    tempMessage = gameMessages[24];
                }
                else{
                    tempMessage = gameMessages[18];
                }
            }
            break;
        case "キ2":
            if(item[2]){//包丁
                tempMessage = gameMessages[20];
            }
            else{
                tempMessage = gameMessages[19];
            }
            break;
        case "キ3":
            tempMessage = gameMessages[21];
            break;
        case "洗":
            tempMessage = gameMessages[27];
            break;
        case "靴":
            tempMessage = gameMessages[28];
            break;
        case "窓":
            tempMessage = gameMessages[5];
            break;
        case "ク2":
            tempMessage = gameMessages[11];
            break;
        case "ク1":
            if(positionX == 8 && positionY == 2){
                tempMessage = gameMessages[32];
            }
            else if(item[3]){ //杖
                tempMessage = gameMessages[13];
            }
            else if(safeUnlocked){
                tempMessage = gameMessages[31];
            }
            else{

                tempMessage = gameMessages[12];
            }
            break;
        case "浴":
            tempMessage = gameMessages[17];
            break;
        case "テ":
            tempMessage = gameMessages[6];
            break;
        case "机1":
            tempMessage = gameMessages[7];
            break;
        case "机2":
            if(item[0]){
                tempMessage = gameMessages[29];
            }
            else{
                tempMessage = gameMessages[8];
            }
            break;
        case "椅":
            tempMessage = gameMessages[9];
            break;
        case "ト":
            tempMessage = gameMessages[15];
            break;
        case "シ":
            tempMessage = gameMessages[16];
            break;
        case "ド0":
            if(door[0]){
                if(positionX == 9){
                    tempMessage = gameMessages[24];
                }
                else{
                    tempMessage = "何もない。";
                }
            }
            else{
                tempMessage = gameMessages[23];
            }
            break;
        case "ド1":
            if(door[1]){
                if(positionY == 3 && positionX == 10){
                    tempMessage = gameMessages[24];
                }
                else{
                    tempMessage = "何もない。";
                }
            }
            else{
                tempMessage = gameMessages[23];
            }
            break;
        case "ド2":
            if(door[2]){
                tempMessage = "何もない。";
            }
            else{
                tempMessage = gameMessages[23];
            }
            break;
        default:
            tempMessage = "何もない。";
            break;
    }
    switch(directAngle){
        case 0:
            frontMessage = tempMessage;
            break;
        case 1:
            leftMessage = tempMessage;
            break;
        case 2:
            rightMessage = tempMessage;
            break;
        default:
            break;
    }
}

function observe(){
    let front,left,right;
    let directAngle = 0; //0:front 1:left 2:right
    switch(angle){
        case 1:
            front = map[positionY+1][positionX];
            left = map[positionY][positionX-1];
            right = map[positionY][positionX+1];
            break;
        case 2:
            front = map[positionY][positionX-1];
            left = map[positionY-1][positionX];
            right = map[positionY+1][positionX];
            break;
        case 3:
            front = map[positionY-1][positionX];
            left = map[positionY][positionX+1];
            right = map[positionY][positionX-1];
            break;
        case 4:
            front = map[positionY][positionX+1];
            left = map[positionY+1][positionX];
            right = map[positionY-1][positionX];
            break;
    }

    itemCheck();

    observe_check(directAngle,front);
    directAngle = 1;
    observe_check(directAngle,left);
    directAngle = 2;
    observe_check(directAngle,right);

    ctx.fillStyle = "white";
    ctx.font = "14px 'DotGothic16'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    if(leftMessage !== ""){
        drawMessage_scene3(leftMessage, 150, 70);
    }
    if(frontMessage !== ""){
        drawMessage_scene3(frontMessage, 370, 70);
    }
    if(rightMessage !== ""){
        drawMessage_scene3(rightMessage, 590, 70);
    }
}

function itemCheck(){
    if(positionX == 5 && positionY == 4 && angle != 3){ //リモコンが拾える
        findItem[0] = true;
    }
    else{
        findItem[0] = false;
    }

    if(positionX == 2 && positionY ==1 && angle != 4){ //電池が拾える（要リモコンの電池が欠けてることへの気づき）
        findItem[1] = true;
    }
    else{
        findItem[1] = false;
    }

    if(positionX == 12 && positionY == 1 && angle != 3){ //包丁が拾える
        findItem[2] = true;
    }
    else{
        findItem[2] = false;
    }

    if(positionX == 7 && positionY == 3 && angle != 2){ //杖が拾える
        findItem[3] = true;
    }
    else{
        findItem[3] = false;
    }
}

function checkSafe(){
    if(safeNumber[0] == 2 &&
        safeNumber[1] == 1 &&
        safeNumber[2] == 1 &&
        safeNumber[3] == 5 &&
        tvWatched
    ){
        safeUnlocked = true;
        safeOpen = false;
        playSound("openDial");
        showMessage("金庫が開いた。");
    }
}


function gameStart() {
    //ゲーム枠
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 140, 600);
    ctx.strokeRect(0, 0, 800, 50);
    ctx.strokeRect(360, 0, 220, 400);
    ctx.strokeRect(140, 400, 660, 200);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 7;
    ctx.strokeRect(0, 0, 800, 600);

    //ゲーム画面（文字）
    ctx.fillStyle = "white";
    ctx.font = "18px 'DotGothic16'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    ctx.fillText("持ち物", 70, 25);
    ctx.fillText("左", 250, 25);
    ctx.fillText("正面", 470, 25);
    ctx.fillText("右", 690, 25);

    if(ingameMessage !== ""){
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(ingameMessage, 170, 430);
    }

    if(item[0]){
        ctx.fillStyle = "white";
        ctx.font = "14px 'DotGothic16'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("・リモコン (1)", 20, 90);
    }
    if(item[1]){
        ctx.fillStyle = "white";
        ctx.font = "14px 'DotGothic16'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("・電池 (2)", 20, 120);
    }
    if(item[2]){
        ctx.fillStyle = "white";
        ctx.font = "14px 'DotGothic16'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("・包丁 (3)", 20, 150);
    }
    if(item[3]){
        ctx.fillStyle = "white";
        ctx.font = "14px 'DotGothic16'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("・杖 (4)", 20, 180);
    }

    observe();

    if(tvPlaying){
        ctx.fillStyle = "black";
        ctx.fillRect(140, 400, 660, 200);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(140, 400, 660, 200);

        ctx.fillStyle = "white";
        ctx.font = "18px 'DotGothic16'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        if(tvWatched){
            drawMessage_scene3(
                tvMessages_repeat[tvMessageIndex],
                170,
                430
            );
        }
        else{
            drawMessage_scene3(
                tvMessages[tvMessageIndex],
                170,
                430
            );
        }

    ctx.textAlign = "center";
    ctx.fillText("▼", 750, 550);
}

    if(safeOpen){
        if(positionX == 7 && positionY == 3 && angle == 4){
            drawSafe();
        }
        else{
            safeOpen = false;
        }
    }
}

// ====================
// ゲーム操作 シーン3
// ====================
let positionX = 3;
let positionY = 1;
let endingMessageIndex = 0;
document.addEventListener("keydown", function(event){

    if(event.repeat) return;

    if(event.key === "Escape"){

        // ゲーム → メニュー
        if(scene === 3){
            playSound("move");
            menuHover = -1;
            scene = 7;
            return;
        }

        // メニュー → ゲーム
        if(scene === 7){
            playSound("move");
            menuHover = -1;
            scene = 3;
            return;
        }
    }

    if(scene != 3) return;
    if(tvPlaying) return;

    if(ingameMessage !== ""){
        ingameMessage = "";
        
        if(messageTimer !== null){
            clearTimeout(messageTimer);
            messageTimer = null;
        }

        gameStart();
    }

    if(event.key.toLowerCase() === "y") {
        if(openDoorCheck){
            scene = 4;
            if(item[2]){
                endingType = 2;
            }
            else{
                endingType = 1;
            }
            endingMessageIndex = 0;
            openDoorCheck = false;
            startEndingMessage();
        }
        else if(resetCheck){
            positionX = 3;
            positionY = 1;
            angle = 1;
            resetCheck = false;
        }
    }
    else if(event.key.toLowerCase() === "n") {
        if(openDoorCheck){
            openDoorCheck = false;
            ingameMessage = "";
        }
        if(resetCheck){
            resetCheck = false;
            ingameMessage = "";
        }
    }
    else{
        openDoorCheck = false;
        if(event.key.toLowerCase() === "w"){ //前進
            playSound("move");
            switch(angle){
                case 1: //上方向
                    switch(positionY){
                        case 3:
                        case 5:
                            positionY++;
                            break;
                        case 6:
                            showMessage("壁がある。これ以上前には進めない。");
                            break;
                        case 4:
                            switch(positionX){
                                case 2:
                                case 3:
                                case 7:
                                    positionY++;
                                    break;
                                case 1:
                                    showMessage("テレビがある。これ以上前には進めない。");
                                    break;
                                case 4:
                                case 5:
                                    showMessage("机がある。これ以上前には進めない。");
                                    break;
                                case 6:
                                    showMessage("椅子がある。これ以上前には進めない。");
                                    break;
                                case 10:
                                    showMessage("トイレがある。これ以上前には進めない。");
                                    break;
                                case 11:
                                    showMessage("シャワーがある。これ以上前には進めない。");
                                    break;
                                default:
                                    showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error1");
                                    break;
                            }
                            break;
                        case 2:
                            if(positionX == 10){
                                if(door[1]){
                                    positionY++;
                                }
                                else{
                                    showMessage("ドアに激突してしまった。");
                                }
                            }
                            else if(positionX == 8){
                                showMessage("クローゼットがある。これ以上前には進めない。");
                                break;
                            }
                            else{
                                positionY++;
                            }
                            break;
                        case 1:
                            switch(positionX){
                                case 2:
                                case 3:
                                case 4:
                                    showMessage("ローテーブルがある。これ以上前には進めない。");
                                    break;
                                case 6:
                                    showMessage("ストーブがある。これ以上前には進めない。");
                                    break;
                                case 9:
                                    showMessage("冷蔵庫がある。これ以上前には進めない。");
                                    break;
                                case 11:
                                case 12:
                                case 13:
                                    showMessage("キッチンがある。これ以上前には進めない。");
                                    break;
                                case 14:
                                    showMessage("洗濯機がある。これ以上前には進めない。");
                                    break;
                                case 15:
                                    showMessage("靴を置く棚がある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionY++;
                                    break;
                            }
                            break;
                        default:
                            showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error2");
                            break;
                    }
                    break;
                case 2: //左方向
                    switch(positionY){
                        case 5:
                        case 6:
                            switch(positionX){
                                case 3:
                                    positionX--;
                                    break;
                                case 2:
                                    showMessage("テレビがある。これ以上前には進めない。");
                                    break;
                                case 7:
                                    showMessage("椅子がある。これ以上前には進めない。");
                                    break;
                                default:
                                    showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error3");
                                    break;
                            }
                            break;
                        case 4:
                            switch(positionX){
                                case 1:
                                    showMessage("窓がある。これ以上前には進めない。");
                                    break;
                                case 10:
                                case 11:
                                    showMessage("壁がある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionX--;
                                    break;
                            }
                            break;
                        case 3:
                            switch(positionX){
                                case 1:
                                    showMessage("窓がある。これ以上前には進めない。");
                                    break;
                                case 10:
                                    showMessage("さっき開けたドアがある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionX--;
                                    break;
                            }
                            break;
                        case 2:
                            switch(positionX){
                                case 5:
                                    showMessage("ローテーブルがある。これ以上前には進めない。");
                                    break;
                                case 7:
                                    showMessage("ストーブが置いてある。これ以上前には進めない。");
                                    break;
                                case 8:
                                    positionX--;
                                    break;
                                case 10:
                                    showMessage("冷蔵庫がある。これ以上前には進めない。");
                                    break;
                                default:
                                    showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error4");
                                    break;
                            }
                            break;
                        case 1:
                            switch(positionX){
                                case 2:
                                    showMessage("棚がある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionX--;
                                    break;
                            }
                            break;
                        default:
                            showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error5");
                            break;
                    }
                    break;
                case 3: //下方向
                    switch(positionY){
                        case 4:
                        case 5:
                        case 6:
                            positionY--;
                            break;
                        case 3:
                            switch(positionX){
                                case 1:
                                    showMessage("物干し竿がある。これ以上前には進めない。");
                                    break;
                                case 2:
                                case 3:
                                case 4:
                                    showMessage("ローテーブルがある。これ以上前には進めない。");
                                    break;
                                case 6:
                                    showMessage("ストーブがある。これ以上前には進めない。");
                                    break;
                                case 11:
                                    showMessage("さっき開けたドアがある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionY--;
                                    break;
                            }
                            break;
                        case 2:
                            switch(positionX){
                                case 5:
                                case 7:
                                case 8:
                                case 10:
                                    positionY--;
                                    break;
                                default:
                                    showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error6");
                                    break;
                            }
                            break;
                        case 1:
                            switch(positionX){
                                case 9:
                                    showMessage("さっき開けたドアがある。これ以上前には進めない。");
                                    break;
                                default:
                                    showMessage("壁がある。これ以上前には進めない。");
                                    break;
                            }
                            break;
                        default:
                            showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error7");
                            break;
                    }
                    break;
                case 4: //右方向
                    switch(positionY){
                        case 5:
                        case 6:
                            switch(positionX){
                                case 3:
                                    showMessage("机がある。これ以上前には進めない。");
                                    break;
                                case 7:
                                    showMessage("クローゼットがある。これ以上前には進めない。");
                                    break;
                                case 2:
                                    positionX++;
                                    break;
                                default:
                                    showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error8");
                                    break;
                            }
                            break;
                        case 4:
                            switch(positionX){
                                case 7:
                                    showMessage("クローゼットがある。これ以上前には進めない。");
                                    break;
                                case 10:
                                    showMessage("壁がある。これ以上前には進めない。");
                                    break;
                                case 11:
                                    showMessage("浴槽がある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionX++;
                                    break;
                            }
                            break;
                        case 3:
                            switch(positionX){
                                case 7:
                                    if(!safeOpen){
                                        showMessage("クローゼットがある。これ以上前には進めない。");    
                                    }
                                    break;
                                case 10:
                                    if(door[2]){
                                        positionX++;
                                    }
                                    else{
                                        showMessage("ドアに激突した。");
                                    }
                                    break;
                                case 11:
                                    showMessage("浴槽がある。これ以上前には進めない。");
                                    break;
                                default:
                                    positionX++;
                                    break;
                            }
                            break;
                        case 2:
                            switch(positionX){
                                case 5:
                                    showMessage("ストーブがある。これ以上前には進めない。");
                                    break;
                                case 7:
                                    positionX++;
                                    break;
                                case 8:
                                    showMessage("壁がある。これ以上前には進めない。");
                                    break;
                                case 10:
                                    showMessage("キッチンがある。これ以上前には進めない。");
                                    break;
                                default:
                                    showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error9");
                                    break;
                            }
                            break;
                        case 1:
                            switch(positionX){
                                case 8:
                                    if(door[0]){
                                        positionX++;
                                    }
                                    else{
                                        showMessage("ドアに激突した。");
                                    }
                                    break;
                                case 15:
                                    showMessage("玄関のドアに激突した。");
                                    break;
                                default:
                                    positionX++;
                                    break;
                            }
                            break;
                        default:
                            showMessage("ここにたどり着くはずがない。何かバグが起きている。"+ positionX + ", " + positionY + " angle: " + angle + "error10");
                            break;
                    }
                    break;
                default:
                    break;
            }
        }
        else if(event.key.toLowerCase() === "a") { //左を向く
            playSound("move");
            angle++;
            if(angle == 5) angle = 1;
        }
        else if(event.key.toLowerCase() === "d") { //右を向く
            playSound("move");
            angle--;
            if(angle == 0) angle = 4;
        }
        else if(event.key.toLowerCase() === "e"){ //アイテムを拾う
            if(positionX == 7 && positionY == 3 && angle == 4 && !safeUnlocked){
                safeOpen = true;
            }
            else if(findItem[0]){ //リモコン
                playSound("pickItem");
                item[0] = true;
            }
            else if(findItem[1] && needBattery && !haveBattery){ //電池
                playSound("pickItem");
                item[1] = true;
            }
            else if(findItem[2]){ //包丁
                playSound("pickItem");
                item[2] = true;
            }
            else if(findItem[3] && safeUnlocked){ //杖
                playSound("pickItem");
                item[3] = true;
            }
            else if(positionX == 7 && positionY == 3 && (angle == 1 || angle == 3)){
                showMessage("ダイヤルを操作しにくい。正面を向こう。");
            }
            else if(positionX == 8 && positionY == 1  && angle != 2 && !door[0]){
                playSound("openDoor");
                showMessage("ドアを開けた。");
                door[0] = true;
            }
            else if(positionX == 10 && positionY == 2  && angle != 3 && !door[1]){
                playSound("openDoor");
                showMessage("ドアを開けた。");
                door[1] = true;
            }
            else if(positionX == 10 && positionY == 3  && angle != 2 && !door[2]){
                playSound("openBath");
                showMessage("ドアを開けた。");
                door[2] = true;
            }
            else if(positionX == 15 && positionY == 1 && angle == 4 && item[3]){
                showMessage("ドアを開けて脱出しますか？\n はい(y)　いいえ(n)");
                openDoorCheck = true;
            }
        }

        else if(event.key.toLowerCase() === "r"){
            showMessage("スタート地点からやり直しますか？\n はい(y)　いいえ(n)");
            resetCheck = true;
        }

        else if(event.key.toLowerCase() === "1" && item[0]){
            playSound("itemUse");
            if(haveBattery){
                if(positionX == 2 && (positionY == 5 || positionY == 6) && angle == 2){
                    tvPlaying = true;
                    tvMessageIndex = 0;
                }
                else{
                    showMessage("テレビのリモコンだ。電池も入っている。");
                }
            }
            else{
                showMessage("テレビのリモコンだ。電池が入っていない。");
                needBattery = true;
            }
        }
        else if(event.key.toLowerCase() === "2" && item[1] && !haveBattery){
            playSound("itemUse");
            showMessage("単三の電池だ。リモコンに電池を入れた。");
            item[1] = false;
            haveBattery = true;
        }
        else if(event.key.toLowerCase() === "3" && item[2]){
            playSound("itemUse");
            showMessage("包丁だ。何かに使えるかもしれない。");
        }
        else if(event.key.toLowerCase() === "4" && item[3]){
            playSound("itemUse");
            showMessage("持ち慣れた自分の杖だ。これがあると安心する。");
        }
    }

    
});


// ====================
// エンディング　シーン4
// ====================

function startEndingMessage(){

    charIndex = 0;
    isTyping = true;

    sounds.messageDisplay.currentTime = 0;
    sounds.messageDisplay.play();

    if(textTimer !== null){
        clearInterval(textTimer);
    }

    let messages;

    if(endingType == 1){
        messages = endMesseges_1;
    }
    else{
        messages = endMesseges_2;
    }

    textTimer = setInterval(function(){

        charIndex++;
        if(charIndex >= messages[endingMessageIndex].length){

            charIndex = messages[endingMessageIndex].length;
            isTyping = false;

            sounds.messageDisplay.pause();
            sounds.messageDisplay.currentTime = 0;

            clearInterval(textTimer);
            textTimer = null;
        }

    }, textSpeed);
}

function ending(){

    let messages;

    if(endingType == 1){
        messages = endMesseges_1;
    }
    else{
        messages = endMesseges_2;
    }

    // 文章ボックス
    ctx.fillStyle = "black";
    ctx.fillRect(40, 430, 720, 130);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 400, 720, 160);

    // 現在の文章
    let currentEndingText =
        messages[endingMessageIndex].substring(0, charIndex);

    let lines = currentEndingText.split("\n");

    ctx.fillStyle = "white";
    ctx.font = "18px 'DotGothic16'";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    for(let i = 0; i < lines.length; i++){
        ctx.fillText(
            lines[i],
            60,
            450 + i * 35
        );
    }

    // 全文表示後
    if(!isTyping){
        ctx.font = "18px sans-serif";
        ctx.fillText("▼", 700, 535);
    }
}

function resetGame(){

    // プレイヤー位置
    positionX = 3;
    positionY = 1;
    angle = 1;

    // アイテム
    item = [false, false, false, false];
    findItem = [false, false, false, false];

    // ドア
    door = [false, false, false];

    // リモコン・電池
    haveBattery = false;
    needBattery = false;

    // 金庫
    safeOpen = false;
    safeNumber = [0, 0, 0, 0];
    safeUnlocked = false;

    // テレビ
    tvWatched = false;
    tvPlaying = false;
    tvMessageIndex = 0;

    // 確認画面
    openDoorCheck = false;
    resetCheck = false;

    // ゲーム中メッセージ
    ingameMessage = "";
    leftMessage = "";
    frontMessage = "";
    rightMessage = "";
    tempMessage = "";

    // オープニング
    messageIndex = 0;

    // エンディング
    endingType = 0;
    endingMessageIndex = 0;

    // 文字送り
    charIndex = 0;
    isTyping = false;
    currentText = "";

    // タイマー
    if(textTimer !== null){
        clearInterval(textTimer);
        textTimer = null;
    }

    if(messageTimer !== null){
        clearTimeout(messageTimer);
        messageTimer = null;
    }

    // 鳴っている文章SEを停止
    sounds.messageDisplay.pause();
    sounds.messageDisplay.currentTime = 0;
}


// ====================
// ゲームループ
// ====================

function gameLoop(){

    // 背景
    ctx.fillStyle = "black";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // 枠線
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    ctx.strokeRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ====================
    // シーンによる分岐
    // ====================

    switch (scene){
        case 0:
            drawTitle();
            break;
        case 1:
            // オープニング
            drawMessage();
            break;
        case 2:
            // 操作説明
            gameExplain();
            break;
        case 3:
            // ゲーム
            gameStart();
            break;
        case 4:
            // エンディング
            ending();
            break;
        case 5:
            //設定
            drawSetting();
            break;
        case 6:
            break;
        case 7:
            //メニュー
            drawMenu();
            break;
        case 8:
            drawSlotMenu("save");
            break;
        case 9 :
            drawSlotMenu("load");
            break;
        default:
            console.error("存在しないscene");
            break;
    }
    requestAnimationFrame(gameLoop);
}


// ====================
// クリック処理
// ====================

canvas.addEventListener("click", function(event) {

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY = (event.clientY - rect.top) * canvas.height / rect.height;

    // ====================
    // scene 0
    // タイトル画面
    // ====================

    if(scene === 0){

        // はじめから
        if(
            mouseX >= 140 &&
            mouseX <= 370 &&
            mouseY >= 300 &&
            mouseY <= 350
        ){
            resetGame();
            playSound("startButton");
            titleImage = titleNormal;
            scene = 1;
            playSound("walking");
            startMessage();
            return;
        }

        // つづきから
        if(
            mouseX >= 140 &&
            mouseX <= 370 &&
            mouseY >= 360 &&
            mouseY <= 410
        ){
            playSound("startButton");
            titleImage = titleNormal;
            loadFrom = 0;
            slotHover = -1;
            scene = 9;
            return;
        }

         // 設定
        if(
            mouseX >= 140 &&
            mouseX <= 370 &&
            mouseY >= 410 &&
            mouseY <= 455
        ){
            playSound("startButton");
            titleImage = titleNormal;
            scene = 5;
            return;
        }

        return;
    }
    
    // ====================
    // scene 1
    // オープニング
    // ====================

    if(scene == 1){
        if(isTyping){
            // 一気に全文表示
            charIndex = openingMessages[messageIndex].length;
            isTyping = false;
            if(textTimer !== null){
                clearInterval(textTimer);
                textTimer = null;
            }

            sounds.messageDisplay.pause();
            sounds.messageDisplay.currentTime = 0;

            return;
        }

        // 全文表示済み
        if(messageIndex < openingMessages.length - 1){
            // 次の文章
            messageIndex++;

            if(messageIndex == 6){
                sounds.walking.pause();
                sounds.walking.currentTime = 0;
                playSound("panch");
            }

            startMessage();
        }else{
            scene = 2;
        }
        return;
    }

    // ====================
    // scene 2
    // 操作説明
    // ====================

    if (scene === 2) {
        if(
            mouseX >= 260 &&
            mouseX <= 540 &&
            mouseY >= 510 &&
            mouseY <= 555
        ){
            playSound("startButton");
            explainStartHover = false;
            scene = 3;
        }
    }

    // ====================
    // scene 3
    // ゲーム
    // ====================

    if(scene === 3){

        if(tvPlaying){
            if(tvWatched){
                // 2回目以降
                if(tvMessageIndex < tvMessages_repeat.length - 1){
                    tvMessageIndex++;
                }
                else{
                    tvPlaying = false;
                    tvMessageIndex = 0;
                }
            }
            else{
                // 初回
                if(tvMessageIndex < tvMessages.length - 1){
                    tvMessageIndex++;
                    playSound("tv");
                }
                else{
                    tvPlaying = false;
                    tvWatched = true;
                    tvMessageIndex = 0;
                }
            }

            return;
        }

        if(safeOpen){
            const rect = canvas.getBoundingClientRect();

            const mouseX =
                (event.clientX - rect.left) * canvas.width / rect.width;
            const mouseY =
                (event.clientY - rect.top) * canvas.height / rect.height;

            for(let i = 0; i < 4; i++){
                let x = 500 + i * 60;
                // ▲をクリック
                if(
                    mouseX >= x - 20 &&
                    mouseX <= x + 20 &&
                    mouseY >= 445 &&
                    mouseY <= 480
                ){
                    playSound("dial");
                    safeNumber[i]++;

                    if(safeNumber[i] == 10){
                        safeNumber[i] = 0;
                    }
                    checkSafe();
                    return;
                }

                // ▼をクリック
                if(
                    mouseX >= x - 20 &&
                    mouseX <= x + 20 &&
                    mouseY >= 515 &&
                    mouseY <= 550
                ){
                    playSound("dial");
                    safeNumber[i]--;
                    if(safeNumber[i] == -1){
                        safeNumber[i] = 9;
                    }
                    checkSafe();
                    return;
                }
            }
            return;
        }
        return;
    }

    // ====================
    // scene 4
    // エンディング
    // ====================

    if(scene === 4){

        let messages;

        if(endingType == 1){
            messages = endMesseges_1;
        }
        else{
            messages = endMesseges_2;
        }

        // 文字が途中なら一気に全文表示
        if(isTyping){

            charIndex =
                messages[endingMessageIndex].length;

            isTyping = false;

            if(textTimer !== null){
                clearInterval(textTimer);
                textTimer = null;
            }
            
            sounds.messageDisplay.pause();
            sounds.messageDisplay.currentTime = 0;
            
            return;
        }

        // 次の文章
        if(endingMessageIndex < messages.length - 1){

            endingMessageIndex++;
            startEndingMessage();

        }
        else{
            scene = 0;
        }

        return;
    }

    if(scene === 5){

        // 音量を下げる
        if(
            mouseX >= 350 &&
            mouseX <= 410 &&
            mouseY >= 145 &&
            mouseY <= 195
        ){
            seVolume -= 5;

            if(seVolume < 0){
                seVolume = 0;
            }

            updateSEVolume();
            return;
        }


        // 音量を上げる
        if(
            mouseX >= 470 &&
            mouseX <= 530 &&
            mouseY >= 145 &&
            mouseY <= 195
        ){
            seVolume += 5;

            if(seVolume > 100){
                seVolume = 100;
            }

            updateSEVolume();
            return;
        }

        // 戻る
        if(
            mouseX >= 320 &&
            mouseX <= 480 &&
            mouseY >= 485 &&
            mouseY <= 530
        ){
            playSound("startButton");

            scene = 0;
            return;
        }
    }

    // ====================
    // scene 7
    // メニュー
    // ====================

    if(scene === 7){

        // ====================
        // セーブ
        // ====================

        if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 160 &&
            mouseY <= 215
        ){
            playSound("startButton");
            scene = 8;
            slotHover = -1;
            return;
        }


        // ====================
        // ロード
        // ====================

        if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 240 &&
            mouseY <= 295
        ){
            playSound("startButton");
            // ロード
            loadFrom = 1;
            scene = 9;
            slotHover = -1;
            return;
        }


        // ====================
        // タイトルに戻る
        // ====================

        if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 320 &&
            mouseY <= 375
        ){
            playSound("startButton");
            scene = 0;
            return;
        }


        // ====================
        // ゲームに戻る
        // ====================

        if(
            mouseX >= 270 &&
            mouseX <= 530 &&
            mouseY >= 400 &&
            mouseY <= 455
        ){
            playSound("startButton");
            scene = 3;
            return;
        }

        return;
    }

    // ====================
    // scene 8
    // セーブスロット
    // ====================

    if(scene === 8){

        for(let i = 1; i <= 3; i++){

            const y = 140 + (i - 1) * 110;

            if(
                mouseX >= 180 &&
                mouseX <= 620 &&
                mouseY >= y &&
                mouseY <= y + 80
            ){
                playSound("startButton");

                saveGame(i);

                return;
            }
        }

        // 戻る
        if(
            mouseX >= 320 &&
            mouseX <= 480 &&
            mouseY >= 490 &&
            mouseY <= 535
        ){
            scene = 7;
            slotHover = -1;
            deleteHover = -1;
            return;
        }

        return;
    }


    // ====================
    // scene 9
    // ロードスロット
    // ====================

    if(scene === 9){

        for(let i = 1; i <= 3; i++){

            const y = 140 + (i - 1) * 110;

            // ====================
            // 削除ボタン
            // ====================

            if(
                mouseX >= 630 &&
                mouseX <= 720 &&
                mouseY >= y &&
                mouseY <= y + 80
            ){

                const data =
                    localStorage.getItem("mouSaveData" + i);

                // データがある場合だけ削除
                if(data !== null){

                    const result = confirm(
                        "スロット" + i + "のセーブデータを削除しますか？"
                    );

                    if(result){
                        localStorage.removeItem(
                            "mouSaveData" + i
                        );
                    }
                }

                return;
            }


            // ====================
            // ロード
            // ====================

            if(
                mouseX >= 180 &&
                mouseX <= 620 &&
                mouseY >= y &&
                mouseY <= y + 80
            ){

                const loaded = loadGame(i);

                if(loaded){
                    playSound("startButton");
                }

                return;
            }
        }


        // 戻る
        if(
            mouseX >= 320 &&
            mouseX <= 480 &&
            mouseY >= 490 &&
            mouseY <= 535
        ){

            if(loadFrom === 0){
                scene = 0;
            }
            else{
                scene = 7;
            }

            slotHover = -1;
            return;
        }
    }
});

function saveGame(slot){

    const saveData = {
        positionX,
        positionY,
        angle,
        item,
        haveBattery,
        needBattery,
        door,
        safeNumber,
        safeUnlocked,
        tvWatched,

        // セーブした日時
        savedAt: new Date().toLocaleString()
    };

    localStorage.setItem(
        "mouSaveData" + slot,
        JSON.stringify(saveData)
    );
}

function loadGame(slot){

    const data = localStorage.getItem(
        "mouSaveData" + slot
    );

    if(data === null){
        return false;
    }

    const saveData = JSON.parse(data);

    positionX = saveData.positionX;
    positionY = saveData.positionY;
    angle = saveData.angle;

    item = saveData.item;

    haveBattery = saveData.haveBattery;
    needBattery = saveData.needBattery;

    door = saveData.door;

    safeNumber = saveData.safeNumber;
    safeUnlocked = saveData.safeUnlocked;

    tvWatched = saveData.tvWatched;

    // 一時状態をリセット
    safeOpen = false;
    tvPlaying = false;
    tvMessageIndex = 0;

    openDoorCheck = false;
    resetCheck = false;

    ingameMessage = "";

    leftMessage = "";
    frontMessage = "";
    rightMessage = "";
    tempMessage = "";

    scene = 3;

    return true;
}

// ====================
// 開始
// ====================

//デバッグ用シーン
scene = 0;
angle = 1;
positionX = 3;
positionY = 1;
tvWatched = false;
item[0] = false;
item[1] = false;
item[2] = false;
item[3] = false;
gameLoop();
