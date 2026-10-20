// ==================================================
// Canvas
// ==================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ==================================================
// シーン
// 0 : タイトル
// 1 : オープニング
// ==================================================
let scene = 0;

// ==================================================
// SE
// ==================================================

let seVolume = Number(
    localStorage.getItem("deleteSEVolume") ?? 50
);

seVolume = Math.max(0, Math.min(100, seVolume));

const sounds = {
    messageDisplay: new Audio("messageDisplay.mp3"),
    click: new Audio("click.mp3"),
    noise: new Audio("noise.mp3"),
    startButton : new Audio("startButton.mp3")

};
sounds.messageDisplay.loop = true;
sounds.messageDisplay.volume = 0.3;
sounds.noise.loop = true;
sounds.noise.volume = 0.3;

function startTextSound() {

    const sound = sounds.messageDisplay;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(() => {});
}

function stopTextSound() {

    const sound = sounds.messageDisplay;

    sound.pause();
    sound.currentTime = 0;
}


// 各SEの基準音量
const baseSEVolume = {};

for (const name in sounds){
    baseSEVolume[name] = sounds[name].volume;
}


// ==================================================
// SE音量変更
// ==================================================

function updateSEVolume(){

    const ratio = seVolume / 50;

    for (const name in sounds){
        sounds[name].volume = Math.min(baseSEVolume[name] * ratio,1);
    }
}
updateSEVolume();

// ==================================================
// SE再生
// ==================================================

function playSound(name){

    const sound = sounds[name];

    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function startNoiseSound() {
    const sound = sounds.noise;

    if (!sound.paused) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function stopNoiseSound() {
    const sound = sounds.noise;

    sound.pause();
    sound.currentTime = 0;
}
// ==================================================
// 変数宣言
// ==================================================

const windows = {
    files: {
        title: "Files",
        x: 100,
        y: 80,
        width: 500,
        height: 350,
        minWidth: 300,
        minHeight: 280,
        isOpen: false,
        dragging: false,
        resizing: false,
        dragOffsetX: 0,
        dragOffsetY: 0
    },

    mail: {
        title: "Mail",
        x: 140,
        y: 100,
        width: 500,
        height: 350,
        minWidth: 300,
        minHeight: 200,
        isOpen: false,
        dragging: false,
        resizing: false,
        dragOffsetX: 0,
        dragOffsetY: 0
    },

    tasks: {
        title: "Task",
        x: 140,
        y: 140,
        width: 450,
        height: 300,
        minWidth: 300,
        minHeight: 200,
        isOpen: false,
        dragging: false,
        resizing: false,
        dragOffsetX: 0,
        dragOffsetY: 0
    },

    trash: {
        title: "Trash",
        x: 180,
        y: 120,
        width: 500,
        height: 350,
        minWidth: 300,
        minHeight: 280,
        isOpen: false,
        dragging: false,
        resizing: false,
        dragOffsetX: 0,
        dragOffsetY: 0
    },

    save: {
        title: "Save / Load",
        x: 180,
        y: 80,
        width: 500,
        height: 350,
        minWidth: 420,
        minHeight: 320,
        isOpen: false,
        dragging: false,
        resizing: false,
        dragOffsetX: 0,
        dragOffsetY: 0
    }
};

// タイトル画面
const titleNormal = new Image();
titleNormal.src = "title.png";

let titleHover = -1;
// -1 : 選択なし
//  0 : はじめから
//  1 : つづきから
//  2 : 設定

const desktopIcons = [
    { id: "files",   label: "Files",   x: 40,  y: 50 },
    { id: "mail",    label: "Mail",    x: 40,  y: 140 },
    { id: "tasks", label: "Task", x: 40,  y: 230 },
    { id: "trash", label: "Trash", x: 40,  y: 320 },
    { id: "save", label: "Save/Load", x: 130, y: 50 }
];

let windowOrder = [
    "files",
    "mail",
    "tasks",
    "trash",
    "save"
];

let draggingWindow = null;
let resizingWindow = null;

const documentState = {
    selectedDocument: null,
    scrollY: 0,
    printConfirm: false,
    deleteConfirm: false,
    restoreConfirm: false,
    openedFromTrash: false,
    deleteFromList: false
};

const trashDocuments = [];
// DAY9：TIPSの設定状態
let tipsFilterDisabled = false;

// DAY10の分岐
let day10ProtectedMode = false;

// DAY9終了後の選択肢
let day9TipsChoiceVisible = false;

// DAY9：80%でのノイズ演出
let day9NoiseStartTime = 0;
let day9NoiseActive = false;
let day9ScreenShifted = false;

// DAY9の共有ゴミ箱に出現するファイル
const tipsConfigFile = {
    id: "tips_config_09",
    subject: "tips_config.sys",
    read: false,
    body: [
        "[DISPLAY]",
        "tips_enabled = true",
        "message_filter = enabled"
    ],
    printed: false,
    shared: true
};
// =====================================
// 共有ゴミ箱のファイル
// =====================================

const sharedTrashDocuments = {
    6: [
        {
            id: "doc016",
            subject: "旧業務連絡_2025.pdf",
            read: false,
            body: documentBodies.doc016,
            printed: false,
            shared: true
        },
        {
            id: "doc017",
            subject: "データ移管記録.pdf",
            read: false,
            body: documentBodies.doc017,
            printed: false,
            shared: true
        },
        {
            id: "doc018",
            subject: "削除処理ログ.pdf",
            read: false,
            body: documentBodies.doc018,
            printed: false,
            shared: true
        }
    ],

    7: [
        {
            id: "doc020",
            subject: "外部提供承認記録.pdf",
            read: false,
            body: documentBodies.doc020,
            printed: false,
            shared: true
        },
        {
            id: "doc021",
            subject: "資料整理指示記録.pdf",
            read: false,
            body: documentBodies.doc021,
            printed: false,
            shared: true
        }
    ],

    8: [
        {
            id: "doc023",
            subject: "操作履歴_管理用.pdf",
            read: false,
            body: documentBodies.doc023,
            printed: false,
            shared: true
        }
    ]
};

// 指定DAYの共有ゴミ箱ファイルを追加
const restoredSharedFiles = new Set();

function addSharedTrashFiles(targetDay){

    const files = sharedTrashDocuments[targetDay] ?? [];

    for(const file of files){

        if(restoredSharedFiles.has(file.id)){
            continue;
        }

        if(!trashDocuments.some(doc => doc.id === file.id)){
            trashDocuments.push(file);
        }
    }
}

let mouseX = 0;
let mouseY = 0;

let mailScrollY = 0;

// スクロールバーをドラッグ中か
let mailScrollbarDragging = false;

// ドラッグ開始時の情報
let mailDragStartY = 0;
let mailDragStartScrollY = 0;

// PDFスクロールバー
let pdfScrollbarDragging = false;

let pdfDragStartY = 0;
let pdfDragStartScrollY = 0;

// メール本文スクロール
let mailBodyScrollY = 0;

let mailBodyScrollbarDragging = false;

let mailBodyDragStartY = 0;
let mailBodyDragStartScrollY = 0;

// Files一覧スクロール
let filesScrollY = 0;

let filesScrollbarDragging = false;

let filesDragStartY = 0;
let filesDragStartScrollY = 0;

// Trash一覧スクロール
let trashScrollY = 0;

let trashScrollbarDragging = false;

let trashDragStartY = 0;
let trashDragStartScrollY = 0;

let docRead_day4 = false;

let settingSliderDragging = false;
// ==================================================
// ゲーム状態
// ゲームごとに必要なものを追加
// ==================================================

const gameState = {
    day1: {
        initialized: false, //初回用フラグ
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day2: {
        initialized: false,
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day3: {
        initialized: false,
        tasks: {
            checkMail: false,
            deleteDocument: false
        }
    },

    day4: {
        initialized: false,
        tasks: {
            checkMail: false,
            deleteDocument: false
        }
    },

    day5: {
        initialized: false,
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day6: {
        initialized: false,
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day7: {
        initialized: false,
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day8: {
        initialized: false,
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day9: {
        initialized: false,
        tasks: {
            checkMail: false,
            printDocument: false
        }
    },

    day10: {
        initialized: false,
        tasks: {
            checkMail: false,
            printEvidence: false,
            deleteAllFiles: false
        }
    }
};

// ==================================================
// TIPS画面
// ==================================================

const tipsScreen = {
    active: false,
    number: 1,

    loading: false,
    progress: 0,

    lastTime: 0,

    glitch: false,
    trueTips: false,
    glitchDone: false
};

// ==================================================
// セーブデータ作成
// ==================================================

function saveGame(slot = 1) {

    // TIPS演出中は保存しない
    if (tipsScreen.active || scene !== 1) {
        alert("現在はセーブできません。");
        return false;
    }

    const saveData = {
        version: 2,

        day: day,
        gameState: JSON.parse(JSON.stringify(gameState)),

        // メールの内容と既読状態
        mailState: {
            inbox: JSON.parse(JSON.stringify(mailState.inbox)),
            sent: JSON.parse(JSON.stringify(mailState.sent)),
            folder: mailState.folder
        },

        // PDFの既読・印刷状態
        documents: Object.fromEntries(
            Object.entries(documents).map(([key, list]) => [
                key,
                list.map(doc => ({
                    id: doc.id,
                    read: doc.read,
                    printed: doc.printed
                }))
            ])
        ),

        // ゴミ箱内のファイルID
        trashIds: trashDocuments.map(doc => doc.id),

        // 共有ゴミ箱から復元したファイルID
        restoredSharedFiles: [...restoredSharedFiles],

        sharedTrashDocuments: Object.fromEntries(
            Object.entries(sharedTrashDocuments).map(([key, list]) => [
                key,
                list.map(doc => ({
                    id: doc.id,
                    read: doc.read,
                    printed: doc.printed
                }))
            ])
        ),

        tipsConfigFile: {
            read: tipsConfigFile.read,
            printed: tipsConfigFile.printed
        },

        // 分岐
        docRead_day4: docRead_day4,
        tipsFilterDisabled: tipsFilterDisabled,
        day10ProtectedMode: day10ProtectedMode,

        // ウィンドウ位置・サイズ
        windows: Object.fromEntries(
            Object.entries(windows).map(([id, win]) => [
                id,
                {
                    x: win.x,
                    y: win.y,
                    width: win.width,
                    height: win.height,
                    isOpen: win.isOpen
                }
            ])
        ),

        windowOrder: [...windowOrder],

        // スクロール
        scroll: {
            mail: mailScrollY,
            mailBody: mailBodyScrollY,
            files: filesScrollY,
            trash: trashScrollY
        },

        savedAt: new Date().toLocaleString("ja-JP")
    };

    try {
        localStorage.setItem(
            "gameSaveData" + slot,
            JSON.stringify(saveData)
        );

        return true;

    } catch (error) {
        console.error("セーブ失敗:", error);
        alert("セーブに失敗しました。");
        return false;
    }
}


// ==================================================
// セーブ情報の取得
// ==================================================

function getSaveInfo(slot = 1) {

    try {
        const data = localStorage.getItem(
            "gameSaveData" + slot
        );

        if (!data) return null;

        const save = JSON.parse(data);

        return {
            day: save.day ?? "?",
            savedAt: save.savedAt ?? "日時不明"
        };

    } catch (error) {
        return null;
    }
}


// ==================================================
// ロード
// ==================================================

function loadGame(slot = 1) {

    try {
        const data = localStorage.getItem(
            "gameSaveData" + slot
        );

        if (!data) return false;

        const save = JSON.parse(data);

        // 古い形式のセーブデータは読み込まない
        if (save.version !== 2) {
            alert("古い形式のセーブデータです。");
            return false;
        }

        // ゲームの初期化
        resetGame();

        day = save.day;

        // タスク進行状況
        for (const key of Object.keys(gameState)) {
            if (!save.gameState[key]) continue;

            gameState[key].initialized =
                save.gameState[key].initialized;

            Object.assign(
                gameState[key].tasks,
                save.gameState[key].tasks
            );
        }

        // =====================================
        // メールの復元
        // =====================================

        // 元のメールをIDで検索できるようにする
        const originalMails = Object.values(mails)
            .filter(Array.isArray)
            .flat();

        const mailMap = new Map(
            originalMails.map(mail => [mail.id, mail])
        );

        // まず元のメールの既読状態を初期化
        for (const mail of originalMails) {
            mail.read = false;
        }

        // セーブ時の既読状態を元のメールに反映
        for (const savedMail of save.mailState.inbox) {

            const original = mailMap.get(savedMail.id);

            if (original) {
                original.read = savedMail.read;
            }
        }

        // 受信箱を元のメールオブジェクトで復元
        mailState.inbox.splice(
            0,
            mailState.inbox.length,
            ...save.mailState.inbox
                .map(savedMail => mailMap.get(savedMail.id))
                .filter(Boolean)
        );

        // 送信箱を復元
        mailState.sent.splice(
            0,
            mailState.sent.length,
            ...save.mailState.sent
        );

        mailState.folder = save.mailState.folder;
        mailState.selectedMail = null;

        // PDFの状態
        for (const [key, list] of Object.entries(save.documents)) {

            const originalList = documents[key];
            if (!originalList) continue;

            for (const savedDoc of list) {

                const doc = originalList.find(
                    d => d.id === savedDoc.id
                );

                if (!doc) continue;

                doc.read = savedDoc.read;
                doc.printed = savedDoc.printed;
            }
        }

        // 共有ゴミ箱のファイル状態
        for (const [key, list] of Object.entries(
            save.sharedTrashDocuments
        )) {

            const originalList = sharedTrashDocuments[key];
            if (!originalList) continue;

            for (const savedDoc of list) {

                const doc = originalList.find(
                    d => d.id === savedDoc.id
                );

                if (!doc) continue;

                doc.read = savedDoc.read;
                doc.printed = savedDoc.printed;
            }
        }

        tipsConfigFile.read = save.tipsConfigFile.read;
        tipsConfigFile.printed = save.tipsConfigFile.printed;

        // 共有ゴミ箱の復元履歴
        restoredSharedFiles.clear();

        for (const id of save.restoredSharedFiles) {
            restoredSharedFiles.add(id);
        }

        // ゴミ箱の復元
        trashDocuments.length = 0;

        const allDocs = [
            ...Object.values(documents).flat(),
            ...Object.values(sharedTrashDocuments).flat(),
            tipsConfigFile
        ];

        for (const id of save.trashIds) {

            const doc = allDocs.find(d => d.id === id);

            if (doc && !trashDocuments.includes(doc)) {
                trashDocuments.push(doc);
            }
        }

        // 分岐
        docRead_day4 = save.docRead_day4;
        tipsFilterDisabled = save.tipsFilterDisabled;
        day10ProtectedMode = save.day10ProtectedMode;

        // ウィンドウ
        for (const [id, state] of Object.entries(save.windows)) {

            const win = windows[id];
            if (!win) continue;

            win.x = state.x;
            win.y = state.y;
            win.width = state.width;
            win.height = state.height;
            win.isOpen = state.isOpen;
        }

        windowOrder.splice(
            0,
            windowOrder.length,
            ...save.windowOrder
        );

        // ロード直後はSave画面を閉じる
        windows.save.isOpen = false;

        // スクロール
        mailScrollY = save.scroll.mail;
        mailBodyScrollY = save.scroll.mailBody;
        filesScrollY = save.scroll.files;
        trashScrollY = save.scroll.trash;

        // 操作中のダイアログは閉じる
        documentState.selectedDocument = null;
        documentState.printConfirm = false;
        documentState.deleteConfirm = false;
        documentState.restoreConfirm = false;

        // 演出中の状態は解除
        tipsScreen.active = false;
        day9TipsChoiceVisible = false;
        day9NoiseActive = false;

        stopTextSound();
        stopNoiseSound();

        scene = 1;

        return true;

    } catch (error) {
        console.error("ロード失敗:", error);
        alert("ロードに失敗しました。");
        return false;
    }
}
// ==================================================
// セーブデータがあるか
// ==================================================

function hasSaveData(slot = 1){

    return (
        localStorage.getItem(
            "gameSaveData" + slot
        ) !== null
    );

}

// ==================================================
// セーブデータ削除
// ==================================================

function deleteSave(slot = 1){

    localStorage.removeItem(
        "gameSaveData" + slot
    );

}

// ==================================================
// 待機
// ==================================================

function wait(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


function drawStoryTextBox(lines, visibleChars, showNext = false) {

    const boxX = 35;
    const boxY = canvas.height - 255;
    const boxW = canvas.width - 70;
    const boxH = 220;

    // テキストボックスの背景
    ctx.fillStyle = "rgba(10, 15, 25, 0.92)";
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // 枠線
    ctx.strokeStyle = "#aaaaaa";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // 文字
    ctx.fillStyle = "#eeeeee";
    ctx.font = "18px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let remainingChars = Math.floor(visibleChars);

    const startX = boxX + 30;
    const startY = boxY + 25;
    const lineHeight = 29;

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];

        const visibleLine = line.slice(
            0,
            Math.max(0, remainingChars)
        );

        ctx.fillText(
            visibleLine,
            startX,
            startY + i * lineHeight
        );

        remainingChars -= line.length;
    }

    // 次へ進める表示
    if (showNext) {

        ctx.fillStyle = "#bbbbbb";
        ctx.font = "14px monospace";
        ctx.textAlign = "right";

        ctx.fillText(
            "▼",
            boxX + boxW - 25,
            boxY + boxH - 30
        );
    }
}
// ==================================================
// シーン0　オープニング
// ==================================================

function drawTitle() {

    if (!titleNormal.complete || !titleNormal.naturalWidth) return;

    // 背景画像
    ctx.drawImage(
        titleNormal,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // ボタンの位置（画像768×512を基準）
    const buttons = [
        { x: 255, y: 225, w: 261, h: 47 },
        { x: 255, y: 283, w: 261, h: 46 },
        { x: 255, y: 340, w: 261, h: 47 }
    ];

    // カーソルが乗っているボタンをハイライト
    if (titleHover !== -1) {

        const b = buttons[titleHover];

        const scaleX = canvas.width / 768;
        const scaleY = canvas.height / 512;

        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

        ctx.fillRect(
            b.x * scaleX,
            b.y * scaleY,
            b.w * scaleX,
            b.h * scaleY
        );
    }
}

// ==================================================
// オープニング
// ==================================================

const openingPages = [
    [
        "今日からある企業の資料管理業務を担当することになった。",
        "",
        "仕事内容は簡単だ。"
    ],
    [
        "指示された資料を確認し、",
        "必要な処理を行う。",
        "",
        "ただ、それだけの仕事だった。"
    ],
    [
        "簡単な割にやたら給料が高い。",
        "ウキウキで応募したら、幸運なことに採用してもらった。"
    ],
    [
        "早速業務に取り掛かるとしよう。"
    ]
];

const openingState = {
    active: false,
    page: 0,
    visibleChars: 0,
    lastTime: 0,
    speed: 45
};

// オープニング開始
function startOpening() {

    openingState.active = true;
    openingState.page = 0;
    openingState.visibleChars = 0;
    openingState.lastTime = performance.now();
    startTextSound();

    scene = 5;
    gameloop();
}

// オープニング描画
function drawOpening() {

    if (!openingState.active) return;

    const now = performance.now();
    const delta = now - openingState.lastTime;
    openingState.lastTime = now;

    const lines = openingPages[openingState.page];
    const maxChars = lines.join("").length;

    openingState.visibleChars = Math.min(
        maxChars,
        openingState.visibleChars + delta / openingState.speed
    );

    if (openingState.visibleChars >= maxChars) {
        stopTextSound();
    }

    // 背景
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // テキストボックス
    drawStoryTextBox(
        lines,
        openingState.visibleChars,
        openingState.visibleChars >= maxChars
    );

    requestAnimationFrame(gameloop);
}

// オープニングのクリック処理
function handleOpeningClick() {

    if (!openingState.active) return;

    const lines = openingPages[openingState.page];
    const maxChars = lines.join("").length;

    // 表示途中なら全文表示
    if (openingState.visibleChars < maxChars) {

        openingState.visibleChars = maxChars;
        stopTextSound();
        return;
    }

    // 次のページ
    if (openingState.page < openingPages.length - 1) {

        openingState.page++;
        openingState.visibleChars = 0;
        openingState.lastTime = performance.now();

        startTextSound();

    } else {

        // DAY1へ
        stopTextSound();

        openingState.active = false;
        day = 1;
        scene = 1;

        gameloop();
    }
}

// ==================================================
// シーン1　ゲーム画面
// ==================================================
let day = 1;

function drawGame(){

    if (tipsScreen.active) {

        updateTips();

        // ノイズ演出中だけ再生
        if (tipsScreen.active &&
            (tipsScreen.glitch || day9NoiseActive)) {

            startNoiseSound();

        } else {
            stopNoiseSound();
        }

        if (tipsScreen.active) {
            drawTipsScreen();
            requestAnimationFrame(gameloop);
        }

        return;
    }

// TIPS終了後はノイズ音を停止
stopNoiseSound();

    // =========================
    // DAYごとの処理
    // =========================

    switch(day){
        case 1:  day1();  break;
        case 2:  day2();  break;
        case 3:  day3();  break;
        case 4:  day4();  break;
        case 5:  day5();  break;
        case 6:  day6();  break;
        case 7:  day7();  break;
        case 8:  day8();  break;
        case 9:  day9();  break;
        case 10:  day10();  break;
    }


    // デスクトップ描画
    ctx.fillStyle = "#0f1720";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawDesktopIcons();

    for(const id of windowOrder){
        const win = windows[id];
        if(win.isOpen){
            drawWindow(id,win);
        }
    }

    if(documentState.printConfirm){
        drawPrintConfirm();
    }

    if(documentState.deleteConfirm){
        drawDeleteConfirm();
    }

    if(documentState.restoreConfirm){
        drawRestoreConfirm();
    }
}

function drawSaveWindow(win) {

    const x = win.x;
    const y = win.y;
    const w = win.width;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";

    ctx.fillText(
        "セーブ / ロードするスロットを選択",
        x + 20,
        y + 60
    );

    for (let slot = 1; slot <= 3; slot++) {

        const rowY = y + 95 + (slot - 1) * 75;
        const info = getSaveInfo(slot);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 20, rowY, w - 40, 65);

        ctx.fillStyle = "#222";
        ctx.font = "bold 15px monospace";
        ctx.fillText(
            "SLOT " + slot,
            x + 30,
            rowY + 20
        );

        ctx.font = "12px monospace";
        ctx.fillText(
            info
                ? `DAY ${info.day}  ${info.savedAt}`
                : "EMPTY",
            x + 30,
            rowY + 44
        );

        // SAVE
        ctx.fillStyle = "#40566b";
        ctx.fillRect(x + w - 255, rowY + 13, 65, 38);

        // LOAD
        ctx.fillStyle = info ? "#40566b" : "#999999";
        ctx.fillRect(x + w - 180, rowY + 13, 65, 38);

        // DELETE
        ctx.fillStyle = info ? "#7f1d1d" : "#999999";
        ctx.fillRect(x + w - 105, rowY + 13, 75, 38);

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";

        ctx.fillText("SAVE", x + w - 222.5, rowY + 32);
        ctx.fillText("LOAD", x + w - 147.5, rowY + 32);
        ctx.fillText("DELETE", x + w - 67.5, rowY + 32);

        ctx.textAlign = "left";
    }
}

function drawWindow(id, win){

    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;

    // =========================
    // ウィンドウ本体
    // =========================

    ctx.fillStyle = "#e7e7e7";
    ctx.fillRect(x, y, w, h);

    // =========================
    // タイトルバー
    // =========================

    ctx.fillStyle = "#283746";
    ctx.fillRect(x, y, w, 35);

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText(win.title, x + 10, y + 17);

    // =========================
    // 閉じるボタン
    // =========================

    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + w - 35, y, 35, 35);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("×", x + w - 17, y + 17);

    // =========================
    // リサイズ部分
    // =========================

    ctx.fillStyle = "#888";
    ctx.fillRect(x + w - 15, y + h - 15, 15, 15);


    // =========================
    // ウィンドウごとの内容
    // =========================

    switch(id){
        case "files":
            drawFilesWindow(win);
            break;
        case "mail":
            drawMailWindow(win);
            break;
        case "tasks":
            drawTaskWindow(win);
            break;
        case "trash":
            drawTrashWindow(win);
            break;
        case "save":
            drawSaveWindow(win);
            break;
    }
}

function drawFilesWindow(win){

    // Filesからファイルを開いている場合
    if(
        documentState.selectedDocument !== null &&
        !documentState.openedFromTrash &&
        !(documentState.deleteConfirm && documentState.deleteFromList)
    ){
        drawDocumentDetail(win);
        return;
    }

    // ファイル一覧
    drawFiles(win);
}

function drawFiles(win){

    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";


    // =========================
    // 現在のDAYまでのファイル
    // =========================

    let documentList = [];

    for(let i = 1; i <= day; i++){

        const dayDocuments =
            documents["day" + i];

        if(dayDocuments){

            for(const doc of dayDocuments){

                if(!trashDocuments.includes(doc)){
                    documentList.push(doc);
                }
            }
        }
    }


    // =========================
    // ファイル一覧表示領域
    // =========================

    const listX = x + 20;
    const listY = y + 60;
    const listW = w - 40;
    const listH = h - 75;


    // ファイル全体の高さ
    const contentHeight =
        documentList.length * 55;


    const maxScroll =
        Math.max(
            0,
            contentHeight - listH
        );


    // スクロール位置を範囲内にする
    filesScrollY =
        Math.max(
            0,
            Math.min(
                filesScrollY,
                maxScroll
            )
        );


    // =========================
    // はみ出した部分を非表示
    // =========================

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        listX,
        listY,
        listW,
        listH
    );

    ctx.clip();


    // =========================
    // ファイル描画
    // =========================

    let fileY = listY - filesScrollY;

    for(const doc of documentList){

        // ファイル背景
        ctx.fillStyle = doc.read
            ? "#d0d0d0"
            : "#ffffff";

        ctx.fillRect(
            listX,
            fileY,
            listW,
            45
        );


        // PDFマーク
        ctx.fillStyle = "#8b1e1e";

        ctx.fillRect(
            listX + 10,
            fileY + 7,
            30,
            30
        );


        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";

        ctx.fillText(
            "PDF",
            listX + 15,
            fileY + 17
        );


        // ファイル名
        ctx.fillStyle = "#222";

        ctx.font = doc.read
            ? "14px monospace"
            : "bold 14px monospace";


        ctx.fillText(
            doc.subject,
            listX + 55,
            fileY + 15
        );

        // =========================
        // 一覧の削除ボタン
        // =========================

        const deleteX = listX + listW - 80;
        const deleteY = fileY + 7;

        ctx.fillStyle = "#cccccc";
        ctx.fillRect(deleteX, deleteY, 65, 30);

        ctx.fillStyle = "#222";
        ctx.font = "13px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            "削除",
            deleteX + 32.5,
            deleteY + 15
        );

        ctx.textAlign = "left";
        ctx.textBaseline = "top";


        fileY += 55;
    }


    ctx.restore();


    // =========================
    // スクロールバー
    // =========================

    if(
        contentHeight > listH &&
        listH > 0
    ){

        // バーの高さ
        let barHeight =
            listH *
            (listH / contentHeight);


        barHeight =
            Math.min(
                listH,
                Math.max(
                    30,
                    barHeight
                )
            );


        // 現在位置
        const scrollRatio =
            maxScroll > 0
            ? filesScrollY / maxScroll
            : 0;


        const barY =
            listY +
            scrollRatio *
            (listH - barHeight);


        // バー背景
        ctx.fillStyle = "#dddddd";

        ctx.fillRect(
            listX + listW - 10,
            listY,
            10,
            listH
        );


        // バー本体
        ctx.fillStyle = "#888888";

        ctx.fillRect(
            listX + listW - 10,
            barY,
            10,
            barHeight
        );


        // ドラッグ判定用
        win.filesScrollbar = {

            x: listX + listW - 10,
            y: barY,

            w: 10,
            h: barHeight,

            listY: listY,
            listH: listH,

            maxScroll: maxScroll
        };

    }else{

        win.filesScrollbar = null;
    }
}

function drawTrashWindow(win){

    // =========================================
    // ファイルを開いている場合
    // =========================================

    if(
        documentState.selectedDocument !== null &&
        documentState.openedFromTrash
    ){
        drawTrashDocumentDetail(win);
        return;
    }


    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";


    // =========================================
    // 一覧表示領域
    // =========================================

    const listX = x + 20;
    const listY = y + 60;
    const listW = w - 40;
    const listH = h - 75;


    // =========================================
    // ゴミ箱が空
    // =========================================

    if(trashDocuments.length === 0){

        trashScrollY = 0;
        win.trashScrollbar = null;

        ctx.fillStyle = "#777";
        ctx.font = "14px monospace";

        ctx.fillText(
            "ゴミ箱は空です",
            listX + 5,
            listY + 5
        );

        return;
    }


    // =========================================
    // スクロール範囲
    // =========================================

    const contentHeight =
        trashDocuments.length * 55;

    const maxScroll =
        Math.max(
            0,
            contentHeight - listH
        );

    trashScrollY =
        Math.max(
            0,
            Math.min(
                trashScrollY,
                maxScroll
            )
        );


    // =========================================
    // 一覧領域からはみ出さないようにする
    // =========================================

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        listX,
        listY,
        listW,
        listH
    );

    ctx.clip();


    // =========================================
    // ファイル一覧
    // =========================================

    let fileY =
        listY - trashScrollY;

    for(const doc of trashDocuments){

        // ファイル背景
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            listX,
            fileY,
            listW,
            45
        );


        // PDFマーク
        ctx.fillStyle = "#8b1e1e";

        ctx.fillRect(
            listX + 10,
            fileY + 7,
            30,
            30
        );


        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";

        ctx.fillText(
            "PDF",
            listX + 15,
            fileY + 17
        );


        // ファイル名
        ctx.fillStyle = "#222";
        ctx.font = "14px monospace";

        ctx.fillText(
            doc.subject,
            listX + 55,
            fileY + 15
        );


        fileY += 55;
    }


    ctx.restore();


    // =========================================
    // スクロールバー
    // =========================================

    if(
        contentHeight > listH &&
        listH > 0
    ){

        let barHeight =
            listH *
            (listH / contentHeight);

        barHeight =
            Math.min(
                listH,
                Math.max(
                    30,
                    barHeight
                )
            );


        const scrollRatio =
            maxScroll > 0
            ? trashScrollY / maxScroll
            : 0;


        const barY =
            listY +
            scrollRatio *
            (listH - barHeight);


        // バー背景
        ctx.fillStyle = "#dddddd";

        ctx.fillRect(
            listX + listW - 10,
            listY,
            10,
            listH
        );


        // バー本体
        ctx.fillStyle = "#888888";

        ctx.fillRect(
            listX + listW - 10,
            barY,
            10,
            barHeight
        );


        // ドラッグ判定用
        win.trashScrollbar = {

            x: listX + listW - 10,
            y: barY,

            w: 10,
            h: barHeight,

            listY: listY,
            listH: listH,

            maxScroll: maxScroll
        };

    }
    else{
        win.trashScrollbar = null;
    }
}

function drawTrashDocumentDetail(win){

    // DAY9：TIPS設定画面
    if (documentState.selectedDocument?.id === "tips_config_09") {

        const x = win.x;
        const y = win.y;

        ctx.fillStyle = "#cccccc";
        ctx.fillRect(x + 20, y + 50, 80, 30);

        ctx.fillStyle = "#222";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        ctx.font = "14px monospace";
        ctx.fillText("← 戻る", x + 30, y + 58);

        ctx.font = "bold 17px monospace";
        ctx.fillText("tips_config.sys", x + 25, y + 110);

        ctx.font = "14px monospace";
        ctx.fillText("[DISPLAY]", x + 25, y + 160);
        ctx.fillText("tips_enabled = true", x + 25, y + 195);

        ctx.fillText(
            "message_filter = " +
            (tipsFilterDisabled ? "disabled" : "enabled"),
            x + 25,
            y + 230
        );

        // 切り替えボタン
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(x + 25, y + 270, 270, 36);

        ctx.fillStyle = "#222";
        ctx.fillText(
            "フィルターを" +
            (tipsFilterDisabled ? "有効" : "無効") +
            "にする",
            x + 35,
            y + 280
        );

        return;
    }

    const doc = documentState.selectedDocument;
    if(doc === null) return;

    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;


    // ==================================================
    // 戻るボタン
    // ==================================================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        x + 20,
        y + 50,
        80,
        30
    );

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "← 戻る",
        x + 60,
        y + 65
    );


    // ==================================================
    // 復元ボタン
    // ==================================================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        x + 110,
        y + 50,
        80,
        30
    );

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "復元",
        x + 150,
        y + 65
    );


    // ==================================================
    // PDF表示領域
    // ==================================================

    const pdfX = x + 20;
    const pdfY = y + 95;
    const pdfW = w - 40;
    const pdfH = h - 115;

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        pdfX,
        pdfY,
        pdfW,
        pdfH
    );


    // ==================================================
    // PDF領域からはみ出さないようにする
    // ==================================================

    ctx.save();

    ctx.beginPath();
    ctx.rect(
        pdfX,
        pdfY,
        pdfW,
        pdfH
    );
    ctx.clip();


    // 左揃えに戻す
    ctx.textAlign = "left";
    ctx.textBaseline = "top";


    // ==================================================
    // スクロール
    // ==================================================

    const scrollY = documentState.scrollY;


    // ファイル名
    ctx.fillStyle = "#222";
    ctx.font = "bold 17px monospace";

    ctx.fillText(
        doc.subject,
        pdfX + 15,
        pdfY + 20 - scrollY
    );


    // ==================================================
    // 本文
    // ==================================================

    ctx.font = "13px monospace";

    let bodyY =
        pdfY + 60 - scrollY;

    for(const line of doc.body){

        ctx.fillText(
            line,
            pdfX + 20,
            bodyY
        );

        bodyY += 22;
    }


    ctx.restore();


    // ==================================================
    // スクロールバー
    // ==================================================

    const contentHeight =
        60 +
        doc.body.length * 22 +
        20;

    const maxScroll =
        Math.max(
            0,
            contentHeight - pdfH
        );

    documentState.scrollY =
        Math.max(
            0,
            Math.min(
                documentState.scrollY,
                maxScroll
            )
        );


    if(
        contentHeight > pdfH &&
        pdfH > 0
    ){

        let barHeight =
            pdfH *
            (pdfH / contentHeight);

        barHeight =
            Math.min(
                pdfH,
                Math.max(
                    30,
                    barHeight
                )
            );


        const scrollRatio =
            maxScroll > 0
            ? documentState.scrollY / maxScroll
            : 0;


        const barY =
            pdfY +
            scrollRatio *
            (pdfH - barHeight);


        // バー背景
        ctx.fillStyle = "#dddddd";

        ctx.fillRect(
            pdfX + pdfW - 10,
            pdfY,
            10,
            pdfH
        );


        // バー本体
        ctx.fillStyle = "#888888";

        ctx.fillRect(
            pdfX + pdfW - 10,
            barY,
            10,
            barHeight
        );


        // ドラッグ用
        win.pdfScrollbar = {

            x: pdfX + pdfW - 10,
            y: barY,

            w: 10,
            h: barHeight,

            pdfY: pdfY,
            pdfH: pdfH,

            maxScroll: maxScroll
        };

    }
    else{

        win.pdfScrollbar = null;
    }
}

function drawTaskWindow(win){
    switch(day){
        case 1:
            drawDay1Tasks(win);
            break;
        case 2:
            drawDay2Tasks(win);
            break;
        case 3:
            drawDay3Tasks(win);
            break;
        case 4:
            drawDay4Tasks(win);
            break;
        case 5:
            drawDay5Tasks(win);
            break;
        case 6:
            drawDay6Tasks(win);
            break;
        case 7:
            drawDay7Tasks(win);
            break;
        case 8:
            drawDay8Tasks(win);
            break;
        case 9:
            drawDay9Tasks(win);
            break;
        case 10:
            drawDay10Tasks(win);
            break;
    }
}

function drawWrappedText(text, x, y, maxWidth, lineHeight = 25) {
    let line = "";

    for (const char of text) {
        if (ctx.measureText(line + char).width > maxWidth && line) {
            ctx.fillText(line, x, y);
            y += lineHeight;
            line = "";
        }
        line += char;
    }

    if (line) {
        ctx.fillText(line, x, y);
    }

    return y + lineHeight;
}

function drawMailWindow(win){

    // メールを選択している場合
    if(mailState.selectedMail !== null){
        drawMailDetail(win);
        return;
    }

    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // =========================
    // 受信・送信ボタン
    // =========================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(x + 20, y + 50, 100, 35);
    ctx.fillRect(x + 130, y + 50, 100, 35);

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";

    ctx.fillText("受信", x + 32, y + 60);
    ctx.fillText("送信", x + 142, y + 60);


    // =========================
    // メール一覧
    // =========================

    const mailList =
        mailState.folder === "inbox"
        ? mailState.inbox
        : mailState.sent;


    // =========================
    // メール表示領域
    // =========================

    const listX = x + 20;
    const listY = y + 110;
    const listW = w - 40;
    const listH = h - 125;

    const contentHeight = mailList.length * 50;

    const maxScroll = Math.max(
        0,
        contentHeight - listH
    );

    // スクロール量を範囲内にする
    mailScrollY = Math.max(
        0,
        Math.min(mailScrollY, maxScroll)
    );


    // =========================
    // はみ出したメールを非表示
    // =========================

    ctx.save();

    ctx.beginPath();
    ctx.rect(
        listX,
        listY,
        listW,
        listH
    );
    ctx.clip();


    // スクロールを反映
    let mailY = listY - mailScrollY;

    for(const mail of mailList){

        ctx.fillStyle = "#ffffff";

        if(mail.read){
            ctx.fillStyle = "#c0c0c0";
        }

        ctx.fillRect(
            listX,
            mailY,
            listW,
            40
        );


        // 件名
        ctx.fillStyle = "#222";

        ctx.font = mail.read
            ? "14px monospace"
            : "bold 14px monospace";

        ctx.textAlign = "left";

        ctx.fillText(
            mail.subject,
            listX + 10,
            mailY + 12
        );


        // 時間
        ctx.font = "13px monospace";
        ctx.textAlign = "right";

        ctx.fillText(
            mail.time,
            listX + listW - 10,
            mailY + 12
        );


        mailY += 50;
    }

    ctx.restore();


    // =========================
    // スクロールバー
    // =========================

    if(contentHeight > listH && listH > 0){

        // バーの高さ
        let barHeight =
            listH * (listH / contentHeight);

        barHeight = Math.min(
            listH,
            Math.max(30, barHeight)
        );


        // バーの位置
        const scrollRatio =
            maxScroll > 0
            ? mailScrollY / maxScroll
            : 0;

        const barY =
            listY +
            scrollRatio * (listH - barHeight);


        // 背景
        ctx.fillStyle = "#dddddd";

        ctx.fillRect(
            listX + listW - 10,
            listY,
            10,
            listH
        );


        // バー本体
        ctx.fillStyle = "#888888";

        ctx.fillRect(
            listX + listW - 10,
            barY,
            10,
            barHeight
        );


        // ドラッグ判定用に保存
        win.mailScrollbar = {
            x: listX + listW - 10,
            y: barY,
            w: 10,
            h: barHeight,

            listY: listY,
            listH: listH,

            maxScroll: maxScroll
        };

    }else{

        win.mailScrollbar = null;
    }


    ctx.textAlign = "left";
}

function drawMailDetail(win){

    const mail = mailState.selectedMail;
    if(mail === null) return;

    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";


    // =========================
    // 戻るボタン
    // =========================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(x + 20, y + 50, 80, 30);

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";
    ctx.fillText("← 戻る", x + 30, y + 58);


    // =========================
    // タイトル
    // =========================

    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "#222";

    ctx.fillText(
        mail.subject,
        x + 25,
        y + 105
    );


    // =========================
    // 送り主
    // =========================

    ctx.font = "13px monospace";

    ctx.fillText(
        "From: " + mail.sender,
        x + 25,
        y + 140
    );


    // =========================
    // 時間
    // =========================

    ctx.textAlign = "right";

    ctx.fillText(
        mail.time,
        x + w - 25,
        y + 140
    );


    // =========================
    // 区切り線
    // =========================

    ctx.strokeStyle = "#999";
    ctx.beginPath();

    ctx.moveTo(
        x + 25,
        y + 170
    );

    ctx.lineTo(
        x + w - 25,
        y + 170
    );

    ctx.stroke();


    // =========================
    // 本文表示領域
    // =========================

    const bodyX = x + 25;
    const bodyY = y + 185;
    const bodyW = w - 50;
    const bodyH = h - 200;


    // =========================
    // 本文全体の高さ
    // =========================

    const contentHeight =
        mail.body.length * 25 + 20;

    const maxScroll =
        Math.max(
            0,
            contentHeight - bodyH
        );


    // スクロール位置を範囲内にする
    mailBodyScrollY = Math.max(
        0,
        Math.min(
            mailBodyScrollY,
            maxScroll
        )
    );


    // =========================
    // 本文をはみ出させない
    // =========================

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        bodyX,
        bodyY,
        bodyW,
        bodyH
    );

    ctx.clip();


    // =========================
    // 本文
    // =========================

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let textY =
        bodyY + 10 - mailBodyScrollY;


    for(const line of mail.body){

        ctx.fillText(
            line,
            bodyX + 5,
            textY
        );

        textY += 25;
    }


    ctx.restore();


    // =========================
    // スクロールバー
    // =========================

    if(
        contentHeight > bodyH &&
        bodyH > 0
    ){

        // バーの高さ
        let barHeight =
            bodyH *
            (bodyH / contentHeight);

        barHeight = Math.min(
            bodyH,
            Math.max(
                30,
                barHeight
            )
        );


        // 現在位置
        const scrollRatio =
            maxScroll > 0
            ? mailBodyScrollY / maxScroll
            : 0;


        const barY =
            bodyY +
            scrollRatio *
            (bodyH - barHeight);


        // バー背景
        ctx.fillStyle = "#dddddd";

        ctx.fillRect(
            bodyX + bodyW - 10,
            bodyY,
            10,
            bodyH
        );


        // バー本体
        ctx.fillStyle = "#888888";

        ctx.fillRect(
            bodyX + bodyW - 10,
            barY,
            10,
            barHeight
        );


        // ドラッグ用情報
        win.mailBodyScrollbar = {

            x: bodyX + bodyW - 10,
            y: barY,

            w: 10,
            h: barHeight,

            bodyY: bodyY,
            bodyH: bodyH,

            maxScroll: maxScroll
        };

    }else{

        win.mailBodyScrollbar = null;
    }
}

function drawDocumentDetail(win){

    const doc = documentState.selectedDocument;
    if(doc === null) return;

    const x = win.x;
    const y = win.y;
    const w = win.width;
    const h = win.height;


    // ==================================================
    // 戻るボタン
    // ==================================================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        x + 20,
        y + 50,
        80,
        30
    );

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "← 戻る",
        x + 60,
        y + 65
    );


    // ==================================================
    // 印刷ボタン
    // ==================================================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        x + 110,
        y + 50,
        80,
        30
    );

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "印刷",
        x + 150,
        y + 65
    );


    // ==================================================
    // 削除ボタン
    // ==================================================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        x + 200,
        y + 50,
        80,
        30
    );

    ctx.fillStyle = "#222";
    ctx.font = "14px monospace";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "削除",
        x + 240,
        y + 65
    );


    // ==================================================
    // PDF表示領域
    // ==================================================

    const pdfX = x + 20;
    const pdfY = y + 95;
    const pdfW = w - 40;
    const pdfH = h - 115;

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        pdfX,
        pdfY,
        pdfW,
        pdfH
    );


    // ==================================================
    // PDF領域からはみ出さないようにする
    // ==================================================

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        pdfX,
        pdfY,
        pdfW,
        pdfH
    );

    ctx.clip();


    // ==================================================
    // PDF内の文字設定
    // ==================================================

    // ボタンでcenter/middleに変更したので
    // PDFでは左上基準に戻す

    ctx.textAlign = "left";
    ctx.textBaseline = "top";


    // ==================================================
    // スクロールを反映
    // ==================================================

    const scrollY = documentState.scrollY;


    // ==================================================
    // ファイル名
    // ==================================================

    ctx.fillStyle = "#222";
    ctx.font = "bold 17px monospace";

    ctx.fillText(
        doc.subject,
        pdfX + 15,
        pdfY + 20 - scrollY
    );


    // ==================================================
    // 本文
    // ==================================================

    ctx.font = "13px monospace";

    let bodyY =
        pdfY + 60 - scrollY;

    for(const line of doc.body){

        ctx.fillText(
            line,
            pdfX + 20,
            bodyY
        );

        bodyY += 22;
    }


    // clip解除
    ctx.restore();


    // ==================================================
    // スクロールバー
    // ==================================================

    const contentHeight =
        60 +
        doc.body.length * 22 +
        20;


    // 現在のウィンドウサイズでの最大スクロール量

    const maxScroll =
        Math.max(
            0,
            contentHeight - pdfH
        );


    // スクロール位置が範囲外にならないようにする

    documentState.scrollY =
        Math.max(
            0,
            Math.min(
                documentState.scrollY,
                maxScroll
            )
        );


    // ==================================================
    // スクロールバーが必要な場合
    // ==================================================

    if(
        contentHeight > pdfH &&
        pdfH > 0
    ){

        // =========================
        // バーの高さ
        // =========================

        let barHeight =
            pdfH *
            (pdfH / contentHeight);

        barHeight =
            Math.min(
                pdfH,
                Math.max(
                    30,
                    barHeight
                )
            );


        // =========================
        // バーの位置
        // =========================

        const scrollRatio =
            maxScroll > 0
            ? documentState.scrollY / maxScroll
            : 0;


        const barY =
            pdfY +
            scrollRatio *
            (pdfH - barHeight);


        // =========================
        // バー背景
        // =========================

        ctx.fillStyle = "#dddddd";

        ctx.fillRect(
            pdfX + pdfW - 10,
            pdfY,
            10,
            pdfH
        );


        // =========================
        // バー本体
        // =========================

        ctx.fillStyle = "#888888";

        ctx.fillRect(
            pdfX + pdfW - 10,
            barY,
            10,
            barHeight
        );


        // =========================
        // ドラッグ判定用に保存
        // =========================

        win.pdfScrollbar = {

            x: pdfX + pdfW - 10,
            y: barY,

            w: 10,
            h: barHeight,

            pdfY: pdfY,
            pdfH: pdfH,

            maxScroll: maxScroll
        };

    }
    else{

        win.pdfScrollbar = null;
    }
}

function drawPrintConfirm(){

    const doc = documentState.selectedDocument;

    if(doc === null) return;

    // =========================
    // 画面を少し暗くする
    // =========================

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =========================
    // 確認ウィンドウ
    // =========================

    const boxW = 440;
    const boxH = 180;

    const boxX = (canvas.width - boxW) / 2;
    const boxY = (canvas.height - boxH) / 2;

    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(
        boxX,
        boxY,
        boxW,
        boxH
    );

    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        boxX,
        boxY,
        boxW,
        boxH
    );


    // =========================
    // メッセージ
    // =========================

    ctx.fillStyle = "#222";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        `「${doc.subject}」を印刷しますか？`,
        canvas.width / 2,
        boxY + 60
    );


    // =========================
    // はい
    // =========================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        boxX + 80,
        boxY + 110,
        100,
        40
    );

    ctx.fillStyle = "#222";
    ctx.fillText(
        "はい",
        boxX + 130,
        boxY + 130
    );


    // =========================
    // いいえ
    // =========================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        boxX + 260,
        boxY + 110,
        100,
        40
    );

    ctx.fillStyle = "#222";
    ctx.fillText(
        "いいえ",
        boxX + 310,
        boxY + 130
    );


    // クリック判定用
    documentState.printYesButton = {
        x: boxX + 80,
        y: boxY + 110,
        w: 100,
        h: 40
    };

    documentState.printNoButton = {
        x: boxX + 260,
        y: boxY + 110,
        w: 100,
        h: 40
    };
}

function drawDeleteConfirm(){

    const doc = documentState.selectedDocument;

    if(doc === null) return;

    // =========================
    // 画面を少し暗くする
    // =========================

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =========================
    // 確認ウィンドウ
    // =========================

    const boxW = 440;
    const boxH = 180;

    const boxX = (canvas.width - boxW) / 2;
    const boxY = (canvas.height - boxH) / 2;

    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(
        boxX,
        boxY,
        boxW,
        boxH
    );

    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        boxX,
        boxY,
        boxW,
        boxH
    );


    // =========================
    // メッセージ
    // =========================

    ctx.fillStyle = "#222";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        `「${doc.subject}」をゴミ箱に移動しますか？`,
        canvas.width / 2,
        boxY + 60
    );


    // =========================
    // はい
    // =========================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        boxX + 80,
        boxY + 110,
        100,
        40
    );

    ctx.fillStyle = "#222";
    ctx.fillText(
        "はい",
        boxX + 130,
        boxY + 130
    );


    // =========================
    // いいえ
    // =========================

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(
        boxX + 260,
        boxY + 110,
        100,
        40
    );

    ctx.fillStyle = "#222";
    ctx.fillText(
        "いいえ",
        boxX + 310,
        boxY + 130
    );


    // クリック判定用
    documentState.DeleteYesButton = {
        x: boxX + 80,
        y: boxY + 110,
        w: 100,
        h: 40
    };

    documentState.DeleteNoButton = {
        x: boxX + 260,
        y: boxY + 110,
        w: 100,
        h: 40
    };
}

function drawRestoreConfirm(){

    const doc = documentState.selectedDocument;

    if(doc === null) return;


    // =========================
    // 画面を少し暗くする
    // =========================

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =========================
    // 確認ウィンドウ
    // =========================

    const boxW = 440;
    const boxH = 180;

    const boxX =
        (canvas.width - boxW) / 2;

    const boxY =
        (canvas.height - boxH) / 2;


    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        boxX,
        boxY,
        boxW,
        boxH
    );


    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        boxX,
        boxY,
        boxW,
        boxH
    );


    // =========================
    // メッセージ
    // =========================

    ctx.fillStyle = "#222";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        `「${doc.subject}」を復元しますか？`,
        canvas.width / 2,
        boxY + 60
    );


    // =========================
    // はい
    // =========================

    ctx.fillStyle = "#cccccc";

    ctx.fillRect(
        boxX + 80,
        boxY + 110,
        100,
        40
    );

    ctx.fillStyle = "#222";

    ctx.fillText(
        "はい",
        boxX + 130,
        boxY + 130
    );


    // =========================
    // いいえ
    // =========================

    ctx.fillStyle = "#cccccc";

    ctx.fillRect(
        boxX + 260,
        boxY + 110,
        100,
        40
    );

    ctx.fillStyle = "#222";

    ctx.fillText(
        "いいえ",
        boxX + 310,
        boxY + 130
    );


    // =========================
    // クリック判定用
    // =========================

    documentState.restoreYesButton = {
        x: boxX + 80,
        y: boxY + 110,
        w: 100,
        h: 40
    };

    documentState.restoreNoButton = {
        x: boxX + 260,
        y: boxY + 110,
        w: 100,
        h: 40
    };
}

function startTips(day){

    tipsScreen.active = true;
    tipsScreen.loading = true;
    tipsScreen.progress = 0;

    tipsScreen.glitch = false;
    tipsScreen.trueTips = false;
    tipsScreen.glitchDone = false;

    tipsScreen.number = day;
    if (day === 9) {
        day9TipsChoiceVisible = false;
        day9NoiseStartTime = 0;
        day9NoiseActive = false;
        day9ScreenShifted = false;
    }

    tipsScreen.lastBurstTime = undefined;
    tipsScreen.burstEndTime = 0;

    if(day == 4){

        if(docRead_day4){ //見た

            tipsData[4].text = [
                "あなたの業務は常に監視されています。",
                "中身を見ないよう指示されたファイルは、",
                "絶対に開かずに削除してください。",
            ];

            tipsData[4].trueTips = [
                "消さ　　で",
                "中　は会　　　　の証　"
            ];
        }
        else{            //見てない

            tipsData[4].text = [
                "ご協力ありがとうございます。",
                "中身を見ないよう指示されたファイルは、",
                "今後も開くことなく削除してください。"
            ];

            tipsData[4].trueTips = [
                "消さ　　で",
                "中　は会　　　　　証　"
            ];
        }

    }

    // 時間計測をリセット
    tipsScreen.lastTime = performance.now();

    gameloop();
}

function updateTips(){

    if(!tipsScreen.active) return;

    const now = performance.now();
    const data = tipsData[tipsScreen.number];

    // ========================================
    // DAY9：80%でノイズ → 画面ずれ
    // ========================================

    if (tipsScreen.number === 9 && tipsFilterDisabled) {

        // ノイズ開始後
        if (day9NoiseActive) {

            tipsScreen.progress = 80;

            // 1.2秒間ノイズを表示
            if (now - day9NoiseStartTime >= 1200) {

                day9NoiseActive = false;
                day9ScreenShifted = true;
                day9TipsChoiceVisible = true;
            }

            return;
        }

        // 画面ずれ後は80%で停止
        if (day9ScreenShifted) {
            tipsScreen.progress = 80;
            return;
        }

        // 80%に到達した瞬間
        if (tipsScreen.progress >= 80) {

            tipsScreen.progress = 80;
            day9NoiseActive = true;
            day9NoiseStartTime = now;

            return;
        }
    }


    // ========================================
    // 真のTIPS乱入
    // ========================================

    if(
        data.trueTips !== null &&
        data.trueTipsProgress !== null &&
        tipsScreen.progress >= data.trueTipsProgress &&
        !tipsScreen.glitchDone
    ){
        tipsScreen.glitchDone = true;
        tipsScreen.glitch = true;

        // 最初のノイズ
        setTimeout(() => {

            tipsScreen.glitch = false;

            // 空ならノイズだけ
            if(data.trueTips.length === 0){
                return;
            }

            tipsScreen.trueTips = true;

            // 真TIPSを表示
            setTimeout(() => {

                // 戻る直前にもう一度ノイズ
                tipsScreen.glitch = true;

                // ノイズ後、通常TIPSへ戻る
                setTimeout(() => {

                    tipsScreen.trueTips = false;
                    tipsScreen.glitch = false;

                }, data.returnNoiseDuration);

            }, data.trueTipsDuration);

        }, data.noiseDuration);
    }


    // ========================================
    // ローディング進行
    // ========================================

    if(now - tipsScreen.lastTime >= 50){

        if(tipsScreen.progress < 50){
            tipsScreen.progress += 1.2;
        }
        else if(tipsScreen.progress < 80){
            tipsScreen.progress += 0.6;
        }
        else if(tipsScreen.progress < 95){
            tipsScreen.progress += 0.3;
        }
        else{
            tipsScreen.progress += 0.1;
        }

        tipsScreen.lastTime = now;

        if(tipsScreen.progress >= 100){
            tipsScreen.progress = 100;
            finishTips();
            return;
        }
    }
}

function drawTipsScreen(){

    const data = tipsData[tipsScreen.number];
    const glitch = tipsScreen.glitch;

    const offsetX = tipsScreen.trueTips
        ? (data.permanentOffsetX ?? 0)
        : 0;

    const offsetY = tipsScreen.trueTips
        ? (data.permanentOffsetY ?? 0)
        : 0;

    ctx.save();

    // ========================================
    // 背景
    // ========================================

    // DAY9：ノイズ後は画面全体を右下にずらす
    if (tipsScreen.number === 9 && day9ScreenShifted) {
        const shakeX = (Math.random() - 0.5) * 140;
        const shakeY = (Math.random() - 0.5) * 90;

        ctx.translate(shakeX, shakeY);
    }

    ctx.fillStyle = "#101820";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ========================================
    // 画面の固定ずれ・揺れ
    // ========================================

    ctx.translate(offsetX, offsetY);

    if(glitch){

        const shake = data.shakeIntensity ?? 0;

        ctx.translate(
            (Math.random() * 2 - 1) * shake,
            (Math.random() * 2 - 1) * shake
        );
    }

    // ========================================
    // TIPS番号
    // ========================================

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.font = "bold 28px monospace";
    ctx.fillText(data.title, canvas.width / 2, 100);

    // ========================================
    // 本文
    // ========================================

    ctx.font = "17px monospace";

    const displayText = tipsScreen.trueTips
        ? data.trueTips
        : data.text;

    let textY = 190;

    for(const line of displayText){

        const corruption = glitch
            ? (data.textCorruption ?? 0)
            : 0;

        const output = corruptTipsText(line, corruption);

        ctx.fillText(output, canvas.width / 2, textY);

        textY += 32;
    }

    // ========================================
    // LOADING
    // ========================================

    ctx.font = "14px monospace";
    ctx.fillText("LOADING...", canvas.width / 2, 450);

    // ========================================
    // ローディングバー
    // ========================================

    const barX = 200;
    const barY = 490;
    const barW = 400;
    const barH = 15;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        barX,
        barY,
        barW * (tipsScreen.progress / 100),
        barH
    );

    ctx.font = "13px monospace";
    ctx.fillText(
        Math.floor(tipsScreen.progress) + "%",
        canvas.width / 2,
        barY + 30
    );

    ctx.restore();

    // ========================================
    // ノイズの強弱を時間で制御
    // ========================================

    const now = performance.now();

    if(tipsScreen.lastBurstTime === undefined){
        tipsScreen.lastBurstTime = now;
        tipsScreen.burstEndTime = 0;
    }

    const interval = data.glitchInterval ?? 700;

    // ノイズ中、または真TIPS表示中
    const noiseActive = glitch || tipsScreen.trueTips;

    if(noiseActive){

        // 一定間隔で強烈なノイズを発生
        if(now - tipsScreen.lastBurstTime >= interval){

            tipsScreen.lastBurstTime = now;

            // 80〜180msだけ激しいノイズ
            tipsScreen.burstEndTime =
                now + 80 + Math.random() * 100;
        }
    }

    const burst = noiseActive &&
        now < tipsScreen.burstEndTime;

    // ========================================
    // 横ずれ・画面の裂け
    // ========================================

    if(glitch){

        if((data.sliceIntensity ?? 0) > 0){
            drawGlitch(data.sliceIntensity);
        }
    }

    // 激しいノイズの瞬間だけ画面を裂く
    if(burst && (data.screenTear ?? 0) > 0){
        drawScreenTear(data.screenTear);
    }

    // ========================================
    // 砂嵐
    // ========================================

    if(noiseActive){

        const baseNoise = data.noiseIntensity ?? 0;

        const intensity = burst
            ? baseNoise * (data.noiseBurst ?? 1)
            : baseNoise;

        drawNoise(glitch, intensity);
    }

    // ========================================
    // ブラックアウト
    // ========================================

    // ========================================
    // DAY9：80%到達時の激しいノイズ
    // ========================================
    if (tipsScreen.number === 9 && day9NoiseActive) {

        ctx.save();

        // 砂嵐
        drawNoise(true, 0.9);

        // 画面の裂け
        drawScreenTear(30);

        // ランダムな横線
        for (let i = 0; i < 45; i++) {

            ctx.fillStyle = Math.random() > 0.5
                ? "rgba(255,255,255,0.45)"
                : "rgba(0,0,0,0.65)";

            ctx.fillRect(
                Math.random() * -50,
                Math.random() * canvas.height,
                canvas.width + 100,
                Math.random() * 15 + 2
            );
        }

        ctx.restore();
    }

    if(glitch && Math.random() < (data.blackoutChance ?? 0)){

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ========================================
    // DAY9：ずれた画面に隠しメッセージ
    // ========================================
    if (tipsScreen.number === 9 && day9ScreenShifted) {

        ctx.save();

        // 背景と文字をまとめてずらす
        ctx.translate(80, 45);

        ctx.fillStyle = "#101820";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";

        ctx.font = "bold 24px monospace";
        ctx.fillText("TIPS 09", 400, 100);

        ctx.font = "17px monospace";

        [
            "やっと届いた。",
            "明日、すべての記録が消される。",
            "データは残せない。",
            "でも..."
        ].forEach((line, i) => {
            ctx.fillText(line, 400, 170 + i * 35);
        });

        ctx.font = "14px monospace";
        ctx.fillText("80% - PAUSED", 400, 390);

        ctx.fillStyle = "#cccccc";
        ctx.fillRect(150, 440, 220, 45);
        ctx.fillRect(430, 440, 220, 45);

        ctx.fillStyle = "#222";
        ctx.fillText("通常起動", 260, 462);
        ctx.fillText("保護モード", 540, 462);

        ctx.restore();
    }
}

function finishTips() {

    stopNoiseSound();

    tipsScreen.active = false;
    tipsScreen.loading = false;

    // DAY10はエンディングへ
    if (day === 10) {
        startEnding();
        return;
    }

    // DAY1～9は従来どおり
    day++;

    for (const id in windows) {
        windows[id].isOpen = false;
    }

    mailState.selectedMail = null;
    documentState.selectedDocument = null;

    gameloop();
}

function drawNoise(showScanlines = true, intensity = null){

    const data = tipsData[tipsScreen.number];

    const noise = Math.max(
        0,
        intensity ?? data.noiseIntensity ?? 0
    );

    const scan = Math.max(0, data.scanlineIntensity ?? 0);

    ctx.save();

    // ========================================
    // 砂嵐：横線
    // ========================================

    for(let i = 0; i < 250 * noise; i++){

        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const w = Math.random() * canvas.width;
        const h = Math.random() * 1.5 + 0.5;

        const alpha = Math.min(
            1,
            Math.random() * 0.35 * noise
        );

        ctx.fillStyle = Math.random() < 0.65
            ? `rgba(255,255,255,${alpha})`
            : `rgba(0,0,0,${alpha})`;

        ctx.fillRect(x, y, w, h);
    }

    // ========================================
    // 砂嵐：点ノイズ
    // ========================================

    for(let i = 0; i < 700 * noise; i++){

        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.35 * noise)})`;

        ctx.fillRect(x, y, 2, 1);
    }

    // ========================================
    // 走査線
    // ========================================

    for(let i = 0; i < 100 * scan; i++){

        const y = Math.random() * canvas.height;

        const alpha = Math.min(
            1,
            Math.random() * 0.18 * scan
        );

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;

        ctx.fillRect(0, y, canvas.width, 0.5);
    }

    // 強い走査線
    if(scan > 0 && Math.random() < Math.min(1, 0.3 * scan)){

        const y = Math.random() * canvas.height;

        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillRect(0, y, canvas.width, 2);
    }

    ctx.restore();
}

function drawGlitch(intensity = 15){

    ctx.save();

    for(let i = 0; i < 10; i++){

        const y = Math.random() * canvas.height;
        const sliceHeight = Math.random() * 15 + 5;

        const offset = (Math.random() * 2 - 1) * intensity;

        ctx.drawImage(
            canvas,
            0, y, canvas.width, sliceHeight,
            offset, y, canvas.width, sliceHeight
        );
    }

    ctx.restore();
}

function drawScreenTear(intensity = 30){

    ctx.save();

    // 画面の一部をランダムに大きく横へずらす
    const tearCount = Math.floor(2 + intensity / 15);

    // 描画元を固定して、ずれを重ねる
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;

    const snapCtx = snapshot.getContext("2d");
    snapCtx.drawImage(canvas, 0, 0);

    for(let i = 0; i < tearCount; i++){

        // 裂ける位置
        const y = Math.random() * canvas.height;

        // 裂ける帯の高さ
        const height = Math.random() * 35 + 8;

        // 横方向のずれ
        const offset =
            (Math.random() * 2 - 1) * intensity * 3;

        // 元の帯を暗く塗る
        ctx.fillStyle = "#05080c";
        ctx.fillRect(0, y, canvas.width, height);

        // 横方向にずらして描画
        ctx.drawImage(
            snapshot,
            0, y, canvas.width, height,
            offset, y, canvas.width, height
        );

        // 裂け目に細い白線
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(
            0,
            y,
            canvas.width,
            1
        );
    }

    ctx.restore();
}

function corruptTipsText(text, intensity = 0){

    const chars = "▓▒░■□#@$%&!?01";
    let result = "";

    for(const char of text){

        if(char !== " " && Math.random() < intensity){

            const index = Math.floor(
                Math.random() * chars.length
            );

            result += chars[index];
        }
        else{
            result += char;
        }
    }

    return result;
}

function drawEndDayButton(win, day){

    const buttonX = win.x + 40;
    const buttonY = win.y + (day === 10 ? 240 : 190);
    const buttonW = 220;
    const buttonH = 40;

    // ==============================
    // マウスがボタンの上にあるか
    // ==============================
    const isHover =
        mouseX >= buttonX &&
        mouseX <= buttonX + buttonW &&
        mouseY >= buttonY &&
        mouseY <= buttonY + buttonH;


    // ==============================
    // ボタン背景
    // ==============================
    if(isHover){
        ctx.fillStyle = "#bbbbbb";
    }else{
        ctx.fillStyle = "#dddddd";
    }

    ctx.fillRect(
        buttonX,
        buttonY,
        buttonW,
        buttonH
    );


    // ==============================
    // 枠
    // ==============================
    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 1;

    ctx.strokeRect(
        buttonX,
        buttonY,
        buttonW,
        buttonH
    );


    // ==============================
    // 文字
    // ==============================
    ctx.fillStyle = "#222";
    ctx.font = "15px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "本日の業務を終了する",
        buttonX + buttonW / 2,
        buttonY + buttonH / 2
    );


    // ==============================
    // クリック判定用に保存
    // ==============================
    win.endDayButton = {
        x: buttonX,
        y: buttonY,
        w: buttonW,
        h: buttonH,
        day: day
    };
}

// =====================================
// DAY 1
// =====================================
function drawDay1Files(win){

    const x = win.x;
    const y = win.y;
    const w = win.width;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let fileY = y + 60;

    for(const doc of documents.day1){
        // ファイル背景
        ctx.fillStyle = "#ffffff";

        if(doc.read){
            ctx.fillStyle = "#d0d0d0";
        }
        ctx.fillRect(x + 20,fileY,w - 40,45);

        // PDFマーク
        ctx.fillStyle = "#8b1e1e";
        ctx.fillRect(x + 30,fileY + 7,30,30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";
        ctx.fillText("PDF", x + 35, fileY + 17);

        // ファイル名
        ctx.fillStyle = "#222";

        ctx.font = doc.read
            ? "14px monospace"
            : "bold 14px monospace";

        ctx.fillText(doc.subject, x + 75, fileY + 15);
        fileY += 55;
    }
}

function drawDay1Tasks(win){ 
    const tasks = gameState.day1.tasks; 
 
    const x = win.x; 
    const y = win.y; 

    ctx.fillStyle = "#222"; 
    ctx.textAlign = "left"; 
    ctx.textBaseline = "top"; 
 
    // ==============================
    // task 確認
    // ==============================
    let temp_checkmail = true; 

    for(let mail of mails.day1){ 
        temp_checkmail = temp_checkmail && mail.read; 
    } 

    tasks.checkMail = temp_checkmail; 


    const meetingDoc = documents.day1.find(
        doc => doc.id === "doc001"
    );

    if(meetingDoc && meetingDoc.printed){
        tasks.printDocument = true;
    }
 
    // ==============================
    // タスク表示
    // ==============================
    ctx.font = "bold 20px monospace"; 
    ctx.fillText(
        "DAY 1",
        x + 25,
        y + 60
    ); 

    ctx.font = "15px monospace"; 

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") +
        " 今日のメールを確認する",
        x + 40,
        y + 110
    ); 

    ctx.fillText(
        (tasks.printDocument ? "☑" : "□") +
        " 会議資料を印刷する",
        x + 40,
        y + 140
    );

    // ==============================
    // 全タスク完了
    // ==============================
    const allCompleted = tasks.checkMail && tasks.printDocument;

    if(allCompleted){
        drawEndDayButton(win, 1);
    }else{
        win.endDayButton = null;
    }
}

// =====================================
// DAY 2
// =====================================
function drawDay2Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay2Tasks(win){
    const tasks = gameState.day2.tasks;

    const x = win.x;
    const y = win.y;
    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let temp_checkmail = true; 

    for(let mail of mails.day1){ 
        temp_checkmail = temp_checkmail && mail.read; 
    } 

    const meetingDoc = documents.day2.find(
        doc => doc.id === "doc003"
    );

    tasks.checkMail = temp_checkmail; 

    if(meetingDoc && meetingDoc.printed){
        tasks.printDocument = true;
    }

    tasks.checkMail = tasks.checkMail && tasks.printDocument;

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 2",x + 25,y + 60);
    ctx.font = "15px monospace";
    drawWrappedText(
        (tasks.checkMail ? "☑" : "□") +
        " 今日のメールを確認し、メール内のタスクを完了させる",
        x + 40,
        y + 110,
        win.width - 80
    );

    const allCompleted = tasks.checkMail;

    if(allCompleted){
        drawEndDayButton(win, 2);
    }else{
        win.endDayButton = null;
    }
}


// =====================================
// DAY 3
// =====================================
function drawDay3Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay3Tasks(win){
    const tasks = gameState.day3.tasks;

    const x = win.x;
    const y = win.y;
    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 3",x + 25,y + 60);
    ctx.font = "15px monospace";

    const doc005 = documents.day3.find(doc => doc.id === "doc005");
    const doc006 = documents.day3.find(doc => doc.id === "doc006");
    const doc007 = documents.day3.find(doc => doc.id === "doc007");
    const doc008 = documents.day3.find(doc => doc.id === "doc008");
    const doc009 = documents.day3.find(doc => doc.id === "doc009");

    if(
        trashDocuments.includes(doc005) &&
        !trashDocuments.includes(doc006) &&
        !trashDocuments.includes(doc007) &&
        trashDocuments.includes(doc008) &&
        trashDocuments.includes(doc009)
    ){
        tasks.deleteDocument = true;
    }

    let temp_checkmail = true; 

    for(let mail of mails.day3){ 
        temp_checkmail = temp_checkmail && mail.read; 
    } 

    tasks.checkMail = temp_checkmail;

    ctx.fillText((tasks.checkMail ? "☑" : "□") + " 今日のメールを確認する",x + 40,y + 110);
    ctx.fillText((tasks.deleteDocument ? "☑" : "□") + " 不要なファイルを削除する", x + 40, y + 140);

    const allCompleted = tasks.checkMail && tasks.deleteDocument;

    if(allCompleted){
        drawEndDayButton(win, 3);
    }else{
        win.endDayButton = null;
    }
}


// =====================================
// DAY 4
// =====================================
function drawDay4Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay4Tasks(win){
    const tasks = gameState.day4.tasks;

    const x = win.x;
    const y = win.y;
    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const doc010 = documents.day4.find(doc => doc.id === "doc010");
    const doc011 = documents.day4.find(doc => doc.id === "doc011");

    if(doc010.read || doc011.read){
        docRead_day4 = true;
    }

    if(
        trashDocuments.includes(doc010) &&
        trashDocuments.includes(doc011)
    ){
        tasks.deleteDocument = true;
    }

    let temp_checkmail = true; 

    for(let mail of mails.day4){ 
        temp_checkmail = temp_checkmail && mail.read; 
    } 

    tasks.checkMail = temp_checkmail;

    const allCompleted = tasks.deleteDocument && tasks.checkMail;

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 4",x + 25,y + 60);
    ctx.font = "15px monospace";
    drawWrappedText(
        (allCompleted ? "☑" : "□") +
        " 今日のメールを確認し、メール内のタスクを完了させる",
        x + 40,
        y + 110,
        win.width - 80
    );

    if(allCompleted){
        drawEndDayButton(win, 4);
    }else{
        win.endDayButton = null;
    }
}


// =====================================
// DAY 5
// =====================================
function drawDay5Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay5Tasks(win){

    const tasks = gameState.day5.tasks;

    const doc013 = documents.day5.find(doc => doc.id === "doc013");
    const doc014 = documents.day5.find(doc => doc.id === "doc014");

    tasks.checkMail = mails.day5.every(mail => mail.read);
    tasks.printDocument = !!doc013?.printed;

    const checkedDocument = !!doc014?.read;

    const allCompleted =
        tasks.checkMail &&
        tasks.printDocument &&
        checkedDocument;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 5", win.x + 25, win.y + 60);

    ctx.font = "15px monospace";

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") + " 今日のメールを確認する",
        win.x + 40, win.y + 110
    );

    ctx.fillText(
        (tasks.printDocument ? "☑" : "□") + " システム利用状況報告書を印刷する",
        win.x + 40, win.y + 140
    );

    ctx.fillText(
        (checkedDocument ? "☑" : "□") + " 業務引継ぎ記録を確認する",
        win.x + 40, win.y + 170
    );

    if(allCompleted){
        drawEndDayButton(win, 5);
    }else{
        win.endDayButton = null;
    }
}

// =====================================
// DAY 6
// =====================================
function drawDay6Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}
function drawDay6Tasks(win){

    const tasks = gameState.day6.tasks;

    const doc015 = documents.day6.find(doc => doc.id === "doc015");

    tasks.checkMail = mails.day6.every(mail => mail.read);
    tasks.printDocument = !!doc015?.printed;

    const allCompleted =
        tasks.checkMail &&
        tasks.printDocument;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 6", win.x + 25, win.y + 60);

    ctx.font = "15px monospace";

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") + " 今日のメールを確認する",
        win.x + 40, win.y + 110
    );

    ctx.fillText(
        (tasks.printDocument ? "☑" : "□") + " 社内設備利用報告書を印刷する",
        win.x + 40, win.y + 140
    );

    if(allCompleted){
        drawEndDayButton(win, 6);
    }else{
        win.endDayButton = null;
    }
}


// =====================================
// DAY 7
// =====================================
function drawDay7Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay7Tasks(win){

    const tasks = gameState.day7.tasks;

    const doc019 = documents.day7.find(doc => doc.id === "doc019");

    tasks.checkMail = mails.day7.every(mail => mail.read);
    tasks.printDocument = !!doc019?.printed;

    const allCompleted =
        tasks.checkMail &&
        tasks.printDocument;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 7", win.x + 25, win.y + 60);

    ctx.font = "15px monospace";

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") + " 今日のメールを確認する",
        win.x + 40, win.y + 110
    );

    ctx.fillText(
        (tasks.printDocument ? "☑" : "□") + " 情報管理点検報告書を印刷する",
        win.x + 40, win.y + 140
    );

    if(allCompleted){
        drawEndDayButton(win, 7);
    }else{
        win.endDayButton = null;
    }
}


// =====================================
// DAY 8
// =====================================
function drawDay8Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay8Tasks(win){

    const tasks = gameState.day8.tasks;

    const doc022 = documents.day8.find(doc => doc.id === "doc022");

    tasks.checkMail = mails.day8.every(mail => mail.read);
    tasks.printDocument = !!doc022?.printed;

    const allCompleted =
        tasks.checkMail &&
        tasks.printDocument;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 8", win.x + 25, win.y + 60);

    ctx.font = "15px monospace";

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") + " 今日のメールを確認する",
        win.x + 40, win.y + 110
    );

    ctx.fillText(
        (tasks.printDocument ? "☑" : "□") + " システム点検報告書を印刷する",
        win.x + 40, win.y + 140
    );

    if(allCompleted){
        drawEndDayButton(win, 8);
    }else{
        win.endDayButton = null;
    }
}


// =====================================
// DAY 9
// =====================================
function drawDay9Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay9Tasks(win) {

    const tasks = gameState.day9.tasks;

    // メールをすべて読んだか
    tasks.checkMail =
        mails.day9?.length > 0 &&
        mails.day9.every(m => m.read);

    // 報告書を印刷したか
    const report = documents.day9?.find(
        d => d.id === "doc024"
    );

    tasks.printDocument = !!report?.printed;

    const done =
        tasks.checkMail &&
        tasks.printDocument;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 9", win.x + 25, win.y + 60);

    ctx.font = "15px monospace";

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") +
        " 今日のメールを確認する",
        win.x + 40,
        win.y + 110
    );

    ctx.fillText(
        (tasks.printDocument ? "☑" : "□") +
        " システム更新報告書を印刷する",
        win.x + 40,
        win.y + 140
    );

    if (done) {
        drawEndDayButton(win, 9);
    } else {
        win.endDayButton = null;
    }
}


// =====================================
// DAY 10
// =====================================
function drawDay10Files(win){
    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

}

function drawDay10Tasks(win) {

    const tasks = gameState.day10.tasks;

    // メール確認
    tasks.checkMail =
        (mails.day10?.length ?? 0) > 0 &&
        mails.day10.every(mail => mail.read);

    // 現在Filesに残っているファイル
    const allDocuments = [];

    for (let i = 1; i <= 10; i++) {
        allDocuments.push(
            ...(documents["day" + i] ?? [])
        );
    }

    const remainingFiles = allDocuments.filter(
        doc => !trashDocuments.some(
            trashDoc => trashDoc.id === doc.id
        )
    );

    tasks.deleteAllFiles = remainingFiles.length === 0;

    // 証拠：外部提供承認記録.pdf
    const evidence = sharedTrashDocuments[7].find(
        doc => doc.id === "doc020"
    );

    tasks.printEvidence = !!evidence?.printed;

    const done =
        tasks.checkMail &&
        tasks.deleteAllFiles &&
        (
            !day10ProtectedMode ||
            tasks.printEvidence
        );

    const x = win.x;
    const y = win.y;

    ctx.fillStyle = "#222";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 20px monospace";
    ctx.fillText("DAY 10", x + 25, y + 60);

    ctx.font = "15px monospace";

    ctx.fillText(
        (tasks.checkMail ? "☑" : "□") +
        " 今日のメールを確認する",
        x + 40, y + 110
    );

    ctx.fillText(
        (tasks.deleteAllFiles ? "☑" : "□") +
        " Files内の全ファイルを削除する",
        x + 40, y + 140
    );

    ctx.font = "13px monospace";
    ctx.fillStyle = "#666";

    ctx.fillText(
        "残り " + remainingFiles.length + " 件",
        x + 55, y + 170
    );

    if (day10ProtectedMode) {
        ctx.fillStyle = "#b91c1c";

        ctx.fillText(
            (tasks.printEvidence ? "☑" : "□") +
            " 証拠を印刷する",
            x + 40, y + 200
        );
    }

    // 業務終了ボタン
    if (done) {
        drawEndDayButton(win, 10);
    } else {
        win.endDayButton = null;
    }
}


function drawDesktopIcons(){

    for(const icon of desktopIcons){

        // アイコン本体
        ctx.fillStyle = "#d9dde3";
        ctx.fillRect(icon.x, icon.y, 55, 55);

        // 簡単なマーク
        ctx.fillStyle = "#283746";
        ctx.font = "24px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            icon.label.charAt(0),
            icon.x + 27,
            icon.y + 27
        );

        // 名前
        ctx.fillStyle = "white";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
            icon.label,
            icon.x + 27,
            icon.y + 70
        );
    }
}

function bringWindowToFront(id){

    // 現在の位置を探す
    const index = windowOrder.indexOf(id);

    if(index === -1) return;

    // 一度配列から削除
    windowOrder.splice(index, 1);

    // 一番最後に追加 = 最前面
    windowOrder.push(id);
}

function day1(){
    const state = gameState.day1;
    if(!state.initialized){
        state.initialized = true;
        addDailyMails(1);
    }
}
function day2(){
    const state = gameState.day2;
    if(!state.initialized){
        state.initialized = true;
        addDailyMails(2);
    }
}
function day3(){
    const state = gameState.day3;
    if(!state.initialized){
        state.initialized = true;
        addDailyMails(3);
    }
}
function day4(){
    const state = gameState.day4;
    if(!state.initialized){
        state.initialized = true;
        addDailyMails(4);
    }
}
function day5(){
    const state = gameState.day5;
    if(!state.initialized){
        state.initialized = true;
        addDailyMails(5);
    }
}
function day6(){
    const state = gameState.day6;

    if(!state.initialized){
        state.initialized = true;
        addDailyMails(6);
    }

    addSharedTrashFiles(6);
}

function day7(){
    const state = gameState.day7;

    if(!state.initialized){
        state.initialized = true;
        addDailyMails(7);
    }

    addSharedTrashFiles(6);
    addSharedTrashFiles(7);
}

function day8(){
    const state = gameState.day8;

    if(!state.initialized){
        state.initialized = true;
        addDailyMails(8);
    }

    addSharedTrashFiles(6);
    addSharedTrashFiles(7);
    addSharedTrashFiles(8);
}
function day9() {
    const state = gameState.day9;

    if (!state.initialized) {
        state.initialized = true;
        addDailyMails(9);
    }

    // 以前の日の共有ゴミ箱ファイル
    addSharedTrashFiles(6);
    addSharedTrashFiles(7);
    addSharedTrashFiles(8);

    // DAY9のTIPS設定ファイル
    if (!trashDocuments.some(doc => doc.id === tipsConfigFile.id)) {
        trashDocuments.push(tipsConfigFile);
    }
}
function day10(){
    const state = gameState.day10;
    if(!state.initialized){
        state.initialized = true;
        addDailyMails(10);
    }
}


// ==================================================
// シーン2　エンディング
// ==================================================

const endingState = {
    active: false,
    type: "normal",
    page: 0,
    visibleChars: 0,
    lastTime: 0,
    speed: 45
};

// =====================================
// ENDの文章
// =====================================

const endingPages = {

    // 通常END
    normal: [
        [
            "すべてのファイルが削除されました。",
            "",
            "旧システムの初期化が完了しました。",
            "削除されたデータは復元できません。"
        ],
        [
            "顧客情報の外部提供に関する記録。",
            "管理部門による削除指示の記録。",
            "過去の担当者の操作履歴。",
            "",
            "そのすべてが失われました。"
        ],
        [
            "あなたは最後まで、",
            "与えられた業務を遂行しました。",
            "",
            "会社の不正を知る者は、",
            "もう誰もいません。"
        ],
        [
            "本日の業務は以上です。",
            "",
            "ご協力ありがとうございました。"
        ]
    ],

    // 保護END
    protected: [
        [
            "すべてのファイルが削除されました。",
            "",
            "旧システムの初期化が完了しました。",
            "削除されたデータは復元できません。"
        ],
        [
            "顧客情報の外部提供に関する記録。",
            "管理部門による削除指示の記録。",
            "過去の担当者の操作履歴。",
            "",
            "そのすべてが失われました。"
        ],
        [
            "しかし、たった一つだけ、",
            "消されなかったものがあります。",
            "",
            "印刷された「外部提供承認記録.pdf」。"
        ],
        [
            "その記録には、",
            "顧客情報12,500件が",
            "正式な承認を得ないまま",
            "外部企業に提供された事実が",
            "記されていました。"
        ],
        [
            "さらに、管理部門は",
            "不正を隠蔽するため、",
            "関連資料の削除を指示していました。",
            "",
            "あなたが毎日行っていた業務は、",
            "その証拠を消す作業だったのです。"
        ],
        [
            "あなたは印刷した記録を",
            "会社の外へ持ち出しました。",
            "",
            "そして、その証拠をもとに",
            "顧客情報の不正提供と、",
            "組織的な隠蔽の事実を",
            "明るみに出しました。"
        ],
        [
            "会社が消そうとした真実は、",
            "最後まで消えることはありませんでした。"
        ]
    ]
};


// ==================================================
// 新しいゲームを始めるための初期化
// ==================================================

function resetGame() {

    // DAY・シーン
    day = 1;
    scene = 0;

    // DAY1～DAY10の進行状況
    for (const state of Object.values(gameState)) {

        state.initialized = false;

        for (const task in state.tasks) {
            state.tasks[task] = false;
        }
    }

    // メールを初期化
    mailState.inbox.length = 0;
    mailState.sent.length = 0;
    mailState.folder = "inbox";
    mailState.selectedMail = null;

    // メールの既読状態を初期化
    for (const dayMails of Object.values(mails)) {
        if (!Array.isArray(dayMails)) continue;

        for (const mail of dayMails) {
            mail.read = false;
        }
    }

    // PDFの状態を初期化
    for (const dayDocuments of Object.values(documents)) {
        if (!Array.isArray(dayDocuments)) continue;

        for (const doc of dayDocuments) {
            doc.read = false;
            doc.printed = false;
        }
    }

    // ゴミ箱
    trashDocuments.length = 0;
    restoredSharedFiles.clear();

    // 共有ゴミ箱のファイル状態
    for (const dayDocuments of Object.values(sharedTrashDocuments)) {
        for (const doc of dayDocuments) {
            doc.read = false;
            doc.printed = false;
        }
    }

    tipsConfigFile.read = false;
    tipsConfigFile.printed = false;

    // PDF表示状態
    documentState.selectedDocument = null;
    documentState.scrollY = 0;
    documentState.printConfirm = false;
    documentState.deleteConfirm = false;
    documentState.restoreConfirm = false;
    documentState.openedFromTrash = false;
    documentState.deleteFromList = false;

    // ウィンドウを閉じる
    for (const win of Object.values(windows)) {
        win.isOpen = false;
        win.dragging = false;
        win.resizing = false;
    }

    windowOrder.splice(
        0,
        windowOrder.length,
        "files", "mail", "tasks", "trash" , "save"
    );

    draggingWindow = null;
    resizingWindow = null;

    // スクロール位置
    mailScrollY = 0;
    mailBodyScrollY = 0;
    filesScrollY = 0;
    trashScrollY = 0;

    mailScrollbarDragging = false;
    mailBodyScrollbarDragging = false;
    pdfScrollbarDragging = false;
    filesScrollbarDragging = false;
    trashScrollbarDragging = false;

    // DAY4の分岐
    docRead_day4 = false;

    // DAY9・DAY10の分岐
    tipsFilterDisabled = false;
    day10ProtectedMode = false;
    day9TipsChoiceVisible = false;
    day9NoiseStartTime = 0;
    day9NoiseActive = false;
    day9ScreenShifted = false;

    // TIPS
    tipsScreen.active = false;
    tipsScreen.number = 1;
    tipsScreen.loading = false;
    tipsScreen.progress = 0;
    tipsScreen.lastTime = 0;
    tipsScreen.glitch = false;
    tipsScreen.trueTips = false;
    tipsScreen.glitchDone = false;
    tipsScreen.lastBurstTime = undefined;
    tipsScreen.burstEndTime = 0;

    // エンディング
    endingState.active = false;
    endingState.type = "normal";
    endingState.page = 0;
    endingState.visibleChars = 0;

    // タイトル
    titleHover = -1;

    // 音声を停止
    stopTextSound();
    stopNoiseSound();
}

// =====================================
// END開始
// =====================================

function startEnding() {

    endingState.active = true;

    endingState.type =
        day10ProtectedMode
            ? "protected"
            : "normal";

    endingState.page = 0;
    endingState.visibleChars = 0;
    endingState.lastTime = performance.now();
    startTextSound();

    tipsScreen.active = false;
    tipsScreen.loading = false;

    for (const id in windows) {
        windows[id].isOpen = false;
    }

    mailState.selectedMail = null;

    documentState.selectedDocument = null;
    documentState.printConfirm = false;
    documentState.deleteConfirm = false;
    documentState.restoreConfirm = false;

    scene = 2;

    gameloop();
}

// =====================================
// 現在のページの全文字数
// =====================================

function getEndingPageLength() {

    const pages = endingPages[endingState.type];
    const lines = pages[endingState.page];

    return lines.join("").length;
}

// =====================================
// 文字表示の更新
// =====================================

function updateEnding() {

    if (!endingState.active) return;

    const now = performance.now();
    const delta = now - endingState.lastTime;

    endingState.lastTime = now;

    const maxChars = getEndingPageLength();

    endingState.visibleChars = Math.min(
        maxChars,
        endingState.visibleChars + delta / endingState.speed
    );

    if (endingState.visibleChars >= maxChars) {
        stopTextSound();
    }
}

// =====================================
// END画面描画
// =====================================

function drawEnding() {

    if (!endingState.active) return;

    updateEnding();

    const pages = endingPages[endingState.type];
    const lines = pages[endingState.page];

    // 背景
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ページ番号
    ctx.fillStyle = "#888888";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.font = "13px monospace";

    ctx.fillText(
        `${endingState.page + 1} / ${pages.length}`,
        canvas.width - 40,
        30
    );

    const pageComplete =
        endingState.visibleChars >= getEndingPageLength();

    // 下部のテキストボックス
    drawStoryTextBox(
        lines,
        endingState.visibleChars,
        pageComplete && endingState.page < pages.length - 1
    );

    // 最終ページの終了表示
    if (pageComplete && endingState.page === pages.length - 1) {

        ctx.textAlign = "center";
        ctx.fillStyle = "#eeeeee";
        ctx.font = "bold 28px monospace";

        ctx.fillText(
            endingState.type === "protected"
                ? "END 02 - PRESERVED"
                : "END 01 - DELETE",
            canvas.width / 2,
            150
        );

        ctx.font = "16px monospace";

        ctx.fillText(
            "THE END",
            canvas.width / 2,
            200
        );
    }

    requestAnimationFrame(gameloop);
}

// =====================================
// END画面クリック
// =====================================

function handleEndingClick() {

    if (!endingState.active) return;

    const maxChars = getEndingPageLength();

    // 文章の表示途中なら、クリックで全文表示
    if (endingState.visibleChars < maxChars) {

        endingState.visibleChars = maxChars;
        stopTextSound();
        return;
    }

    const pages = endingPages[endingState.type];

    // 次のページへ
    if (endingState.page < pages.length - 1) {

        endingState.page++;
        endingState.visibleChars = 0;
        endingState.lastTime = performance.now();

        startTextSound();
        return;
    }

    // 最終ページの全文表示後にクリック → タイトルへ
    stopTextSound();
    stopNoiseSound();

    endingState.active = false;
    endingState.page = 0;
    endingState.visibleChars = 0;

    titleHover = -1;
    scene = 0;

    gameloop();
}



// ==================================================
// シーン3　設定
// ==================================================
// ==================================================
// 設定画面
// ==================================================

function getSettingLayout() {
    const w = canvas.width;
    const h = canvas.height;

    const panelW = Math.min(540, w - 40);
    const panelH = Math.min(460, h - 40);
    const panelX = (w - panelW) / 2;
    const panelY = (h - panelH) / 2;

    return {
        panelX, panelY, panelW, panelH,

        sliderX: panelX + 65,
        sliderY: panelY + 135,
        sliderW: panelW - 130,

        testX: panelX + (panelW - 150) / 2,
        testY: panelY + 175,
        testW: 150,
        testH: 38,

        backX: panelX + (panelW - 110) / 2,
        backY: panelY + panelH - 55,
        backW: 110,
        backH: 38
    };
}

function getLoadScreenLayout() {
    const w = Math.min(540, canvas.width - 40);
    const h = Math.min(420, canvas.height - 40);

    return {
        x: (canvas.width - w) / 2,
        y: (canvas.height - h) / 2,
        w, h
    };
}

function drawLoadScreen() {

    const s = getLoadScreenLayout();

    ctx.fillStyle = "#0f1720";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#202b38";
    ctx.fillRect(s.x, s.y, s.w, s.h);

    ctx.strokeStyle = "#718096";
    ctx.lineWidth = 2;
    ctx.strokeRect(s.x, s.y, s.w, s.h);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px monospace";
    ctx.fillText("LOAD GAME", canvas.width / 2, s.y + 42);

    for (let slot = 1; slot <= 3; slot++) {

        const rowY = s.y + 85 + (slot - 1) * 82;
        const info = getSaveInfo(slot);

        ctx.fillStyle = "#304052";
        ctx.fillRect(s.x + 25, rowY, s.w - 50, 68);

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px monospace";
        ctx.fillText("SLOT " + slot, s.x + 40, rowY + 22);

        ctx.font = "13px monospace";
        ctx.fillText(
            info ? `DAY ${info.day}  ${info.savedAt}` : "EMPTY",
            s.x + 40,
            rowY + 46
        );

        // ロードボタン
        ctx.fillStyle = info ? "#54718c" : "#666666";
        ctx.fillRect(s.x + s.w - 125, rowY + 15, 90, 38);

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px monospace";
        ctx.fillText(
            "LOAD",
            s.x + s.w - 80,
            rowY + 34
        );
    }

    // 戻る
    ctx.fillStyle = "#40566b";
    ctx.fillRect(canvas.width / 2 - 65, s.y + s.h - 54, 130, 36);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "15px monospace";
    ctx.fillText("戻る", canvas.width / 2, s.y + s.h - 36);
}

function drawSettings() {

    const s = getSettingLayout();
    const cx = canvas.width / 2;

    // 背景
    ctx.fillStyle = "#0f1720";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // パネル
    ctx.fillStyle = "#202b38";
    ctx.fillRect(s.panelX, s.panelY, s.panelW, s.panelH);

    ctx.strokeStyle = "#718096";
    ctx.lineWidth = 2;
    ctx.strokeRect(s.panelX, s.panelY, s.panelW, s.panelH);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";

    // タイトル
    ctx.font = "bold 28px monospace";
    ctx.fillText("SETTINGS", cx, s.panelY + 40);

    // SE音量
    ctx.font = "18px monospace";
    ctx.fillText(
        "SE VOLUME : " + Math.round(seVolume),
        cx,
        s.panelY + 90
    );

    // スライダー背景
    ctx.fillStyle = "#596575";
    ctx.fillRect(
        s.sliderX,
        s.sliderY - 4,
        s.sliderW,
        8
    );

    // 音量バー
    ctx.fillStyle = "#7db8e8";
    ctx.fillRect(
        s.sliderX,
        s.sliderY - 4,
        s.sliderW * seVolume / 100,
        8
    );

    // つまみ
    const knobX = s.sliderX + s.sliderW * seVolume / 100;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(knobX - 8, s.sliderY - 15, 16, 30);

    // テスト再生ボタン
    ctx.fillStyle = "#40566b";
    ctx.fillRect(s.testX, s.testY, s.testW, s.testH);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px monospace";
    ctx.fillText(
        "テスト再生",
        s.testX + s.testW / 2,
        s.testY + s.testH / 2
    );

    // 区切り線
    ctx.strokeStyle = "#718096";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s.panelX + 45, s.panelY + 235);
    ctx.lineTo(s.panelX + s.panelW - 45, s.panelY + 235);
    ctx.stroke();

    // CREDIT
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.fillText("CREDIT", cx, s.panelY + 265);

    ctx.font = "bold 23px monospace";
    ctx.fillText("Yuzelka", cx, s.panelY + 300);

    ctx.font = "17px monospace";
    ctx.fillText("X : @yuzelka", cx, s.panelY + 333);

    ctx.font = "15px monospace";
    ctx.fillText(
        "感想やフォローをいただけると嬉しいです！",
        cx,
        s.panelY + 363
    );

    // 戻るボタン
    ctx.fillStyle = "#40566b";
    ctx.fillRect(s.backX, s.backY, s.backW, s.backH);

    ctx.fillStyle = "#ffffff";
    ctx.font = "17px monospace";
    ctx.fillText(
        "戻る",
        s.backX + s.backW / 2,
        s.backY + s.backH / 2
    );
}

function setSettingVolume(x) {

    const s = getSettingLayout();

    const ratio = Math.max(
        0,
        Math.min(1, (x - s.sliderX) / s.sliderW)
    );

    seVolume = Math.round(ratio * 100);

    updateSEVolume();

    localStorage.setItem("deleteSEVolume", String(seVolume));

    gameloop();
}
// ==================================================
// シーン4　セーブ画面
// ==================================================

// ==================================================
// シーン5
// ==================================================



// ==================================================
// マウス関連
// ==================================================

canvas.addEventListener("mousemove", function(event){

    if (scene === 3) {

        if (settingSliderDragging) {

            const rect = canvas.getBoundingClientRect();

            const x = (event.clientX - rect.left)
                * canvas.width / rect.width;

            setSettingVolume(x);
        }

        return;
    }
    // タイトル画面
    if (scene === 0) {

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) * 768 / rect.width;
        const y = (event.clientY - rect.top) * 512 / rect.height;

        titleHover = -1;

        if (x >= 255 && x <= 516 && y >= 225 && y <= 272) {
            titleHover = 0;
        }
        else if (x >= 255 && x <= 516 && y >= 283 && y <= 329) {
            titleHover = 1;
        }
        else if (x >= 255 && x <= 516 && y >= 340 && y <= 387) {
            titleHover = 2;
        }

        gameloop();
        return;
    }

    if(scene !== 1) return;

    const rect = canvas.getBoundingClientRect();

    mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    mouseY = (event.clientY - rect.top) * canvas.height / rect.height;


    // =========================
    // ウィンドウ移動
    // =========================

    if(draggingWindow !== null){

        const win = windows[draggingWindow];

        win.x = mouseX - win.dragOffsetX;
        win.y = mouseY - win.dragOffsetY;

        // Canvas内に収める
        win.x = Math.max(0,Math.min(win.x, canvas.width - win.width));
        win.y = Math.max(0,Math.min(win.y, canvas.height - win.height));

        gameloop();
    }


    // =========================
    // ウィンドウサイズ変更
    // =========================

    if(resizingWindow !== null){

        const win = windows[resizingWindow];

        win.width = mouseX - win.x;
        win.height = mouseY - win.y;

        // 最小サイズ
        win.width = Math.max(win.minWidth,win.width);
        win.height = Math.max(win.minHeight,win.height);
        // Canvas外にはみ出さない
        win.width = Math.min(win.width,canvas.width - win.x);
        win.height = Math.min(win.height,canvas.height - win.y);

        gameloop();
    }

    // =========================
    // メールスクロールバー移動
    // =========================

    if(mailScrollbarDragging){

        const win = windows.mail;
        const bar = win.mailScrollbar;

        if(bar){

            // マウスが何px動いたか
            const deltaY =
                mouseY - mailDragStartY;

            // スクロールバーが動ける距離
            const barMoveHeight =
                bar.listH - bar.h;

            if(barMoveHeight > 0){

                // バーの移動量を
                // メールのスクロール量に変換
                mailScrollY =
                    mailDragStartScrollY +
                    deltaY *
                    (bar.maxScroll / barMoveHeight);

                // 上下限
                mailScrollY = Math.max(
                    0,
                    Math.min(
                        mailScrollY,
                        bar.maxScroll
                    )
                );

                gameloop();
            }
        }
    }

    // =========================
    // Files一覧スクロールバー移動
    // =========================

    if(filesScrollbarDragging){

        const win = windows.files;
        const bar = win.filesScrollbar;

        if(bar){

            // マウスが何px動いたか
            const deltaY =
                mouseY - filesDragStartY;


            // バーが動ける距離
            const barMoveHeight =
                bar.listH - bar.h;


            if(barMoveHeight > 0){

                filesScrollY =
                    filesDragStartScrollY +
                    deltaY *
                    (
                        bar.maxScroll /
                        barMoveHeight
                    );


                // 上下限
                filesScrollY =
                    Math.max(
                        0,
                        Math.min(
                            filesScrollY,
                            bar.maxScroll
                        )
                    );


                gameloop();
            }
        }
    }

    // ==================================================
    // Trash スクロールバードラッグ
    // ==================================================

    if(trashScrollbarDragging){

        const win = windows.trash;
        const bar = win.trashScrollbar;

        if(bar){

            // マウスがどれだけ動いたか
            const deltaY =
                mouseY - trashDragStartY;


            // スクロールバーが動ける距離
            const movableHeight =
                bar.listH - bar.h;


            if(movableHeight > 0){

                // バーの移動量を
                // 実際のスクロール量に変換
                const scrollDelta =
                    deltaY *
                    (bar.maxScroll / movableHeight);


                trashScrollY =
                    trashDragStartScrollY +
                    scrollDelta;


                // 範囲外に行かないようにする
                trashScrollY =
                    Math.max(
                        0,
                        Math.min(
                            trashScrollY,
                            bar.maxScroll
                        )
                    );
            }


            gameloop();
        }

        return;
    }

    // =========================
    // メール本文スクロールバー移動
    // =========================

    if(mailBodyScrollbarDragging){

        const win = windows.mail;
        const bar = win.mailBodyScrollbar;

        if(bar){

            // マウス移動量
            const deltaY =
                mouseY - mailBodyDragStartY;


            // バーが動ける距離
            const barMoveHeight =
                bar.bodyH - bar.h;


            if(barMoveHeight > 0){

                mailBodyScrollY =
                    mailBodyDragStartScrollY +
                    deltaY *
                    (
                        bar.maxScroll /
                        barMoveHeight
                    );


                // 上下限
                mailBodyScrollY =
                    Math.max(
                        0,
                        Math.min(
                            mailBodyScrollY,
                            bar.maxScroll
                        )
                    );


                gameloop();
            }
        }
    }

    // =========================
    // PDFスクロールバー移動
    // Files / Trash 共通
    // =========================

    if(pdfScrollbarDragging){

        let win;

        // Trashから開いている
        if(documentState.openedFromTrash){
            win = windows.trash;
        }
        // Filesから開いている
        else{
            win = windows.files;
        }


        const bar = win.pdfScrollbar;

        if(bar){

            // マウスを何px動かしたか
            const deltaY =
                mouseY - pdfDragStartY;


            // スクロールバーが動ける距離
            const barMoveHeight =
                bar.pdfH - bar.h;


            if(barMoveHeight > 0){

                // バーの移動量を
                // PDF本文のスクロール量に変換
                documentState.scrollY =
                    pdfDragStartScrollY +
                    deltaY *
                    (
                        bar.maxScroll /
                        barMoveHeight
                    );


                // 上下限
                documentState.scrollY =
                    Math.max(
                        0,
                        Math.min(
                            documentState.scrollY,
                            bar.maxScroll
                        )
                    );


                gameloop();
            }
        }
    }
});


canvas.addEventListener("mousedown", function(event){

    if (scene === 3) {

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * canvas.width / rect.width;
        const y = (event.clientY - rect.top) * canvas.height / rect.height;

        const s = getSettingLayout();

        if (
            x >= s.sliderX - 10 &&
            x <= s.sliderX + s.sliderW + 10 &&
            y >= s.sliderY - 25 &&
            y <= s.sliderY + 25
        ) {
            settingSliderDragging = true;
            setSettingVolume(x);
        }

        return;
    }

    if(scene !== 1) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY = (event.clientY - rect.top) * canvas.height / rect.height;

    // =========================
    // 開いているウィンドウを調べる
    // =========================
    const ids = [...windowOrder];

    // 後に描画されたウィンドウから判定
    for(let i = ids.length - 1; i >= 0; i--){

        const id = ids[i];
        const win = windows[id];

        if(!win.isOpen) continue;

        const x = win.x;
        const y = win.y;
        const w = win.width;
        const h = win.height;

        // =========================
        // ウィンドウの範囲外なら無視
        // =========================
        if(
            mouseX < x || mouseX > x + w ||
            mouseY < y || mouseY > y + h
        ){
            continue;
        }

        bringWindowToFront(id);
        gameloop();

        // =========================
        // メールスクロールバー
        // =========================

        if(
            id === "mail" &&
            mailState.selectedMail === null &&
            win.mailScrollbar
        ){

            const bar = win.mailScrollbar;

            if(
                mouseX >= bar.x &&
                mouseX <= bar.x + bar.w &&
                mouseY >= bar.y &&
                mouseY <= bar.y + bar.h
            ){

                mailScrollbarDragging = true;

                mailDragStartY = mouseY;
                mailDragStartScrollY = mailScrollY;

                return;
            }
        }

        // =========================
        // メール本文スクロールバー
        // =========================

        if(
            id === "mail" &&
            mailState.selectedMail !== null &&
            win.mailBodyScrollbar
        ){

            const bar = win.mailBodyScrollbar;

            if(
                mouseX >= bar.x &&
                mouseX <= bar.x + bar.w &&
                mouseY >= bar.y &&
                mouseY <= bar.y + bar.h
            ){

                mailBodyScrollbarDragging = true;

                mailBodyDragStartY = mouseY;
                mailBodyDragStartScrollY =
                    mailBodyScrollY;

                return;
            }
        }

        // =========================
        // PDFスクロールバー
        // Files / Trash 共通
        // =========================

        if (
            (id === "files" || id === "trash") &&
            documentState.selectedDocument !== null &&
            (
                (id === "files" && !documentState.openedFromTrash) ||
                (id === "trash" && documentState.openedFromTrash)
            ) &&
            win.pdfScrollbar
        ){

            const bar = win.pdfScrollbar;

            if(
                mouseX >= bar.x &&
                mouseX <= bar.x + bar.w &&
                mouseY >= bar.y &&
                mouseY <= bar.y + bar.h
            ){

                pdfScrollbarDragging = true;

                pdfDragStartY = mouseY;
                pdfDragStartScrollY = documentState.scrollY;

                return;
            }
        }

        // =========================
        // Files一覧スクロールバー
        // =========================

        if(
            id === "files" &&
            (
                documentState.selectedDocument === null ||
                documentState.openedFromTrash
            ) &&
            win.filesScrollbar
        ){

            const bar = win.filesScrollbar;

            if(
                mouseX >= bar.x &&
                mouseX <= bar.x + bar.w &&
                mouseY >= bar.y &&
                mouseY <= bar.y + bar.h
            ){

                filesScrollbarDragging = true;

                filesDragStartY = mouseY;
                filesDragStartScrollY =
                    filesScrollY;

                return;
            }
        }

        // =========================
        // Trash一覧スクロールバー
        // =========================

        if(
            id === "trash" &&
            documentState.openedFromTrash === false &&
            win.trashScrollbar
        ){

            const bar = win.trashScrollbar;

            if(
                mouseX >= bar.x &&
                mouseX <= bar.x + bar.w &&
                mouseY >= bar.y &&
                mouseY <= bar.y + bar.h
            ){

                trashScrollbarDragging = true;

                trashDragStartY = mouseY;
                trashDragStartScrollY = trashScrollY;

                return;
            }
        }

        // =========================
        // 業務終了ボタン
        // =========================
        if(id === "tasks" && win.endDayButton){

            const btn = win.endDayButton;

            if(
                mouseX >= btn.x &&
                mouseX <= btn.x + btn.w &&
                mouseY >= btn.y &&
                mouseY <= btn.y + btn.h
            ){
                if (btn.day === 10) {
                    startEnding();
                } else {
                    startTips(btn.day);
                }
                return;
            }
        }


        // =========================
        // 閉じるボタン
        // =========================
        if(
            mouseX >= x + w - 35 &&
            mouseX <= x + w &&
            mouseY >= y &&
            mouseY <= y + 35
        ){
            win.isOpen = false;
            gameloop();
            return;
        }


        // =========================
        // 右下リサイズ
        // =========================
        if(
            mouseX >= x + w - 20 &&
            mouseX <= x + w &&
            mouseY >= y + h - 20 &&
            mouseY <= y + h
        ){
            resizingWindow = id;
            win.resizing = true;

            return;
        }


        // =========================
        // タイトルバーをドラッグ
        // =========================
        if(mouseY >= y && mouseY <= y + 35){
            draggingWindow = id;
            win.dragging = true;

            win.dragOffsetX = mouseX - x;
            win.dragOffsetY = mouseY - y;

            return;
        }

        return;
    }
});

canvas.addEventListener("mouseup", function(){
    settingSliderDragging = false;

    // =========================
    // ドラッグ終了
    // =========================

    if(draggingWindow !== null){
        windows[draggingWindow].dragging = false;
        draggingWindow = null;
    }


    // =========================
    // リサイズ終了
    // =========================

    if(resizingWindow !== null){
        windows[resizingWindow].resizing = false;
        resizingWindow = null;
    }

    // =========================
    // メールスクロール終了
    // =========================

    mailScrollbarDragging = false;
    pdfScrollbarDragging = false;
    mailBodyScrollbarDragging = false;
    filesScrollbarDragging = false;
    trashScrollbarDragging = false;
});
window.addEventListener("mouseup", function() {
    settingSliderDragging = false;
});
// ==================================================
// キー押下
// ==================================================

document.addEventListener("keydown", function(event){

})

// ==================================================
// クリック処理
// ==================================================

function getTopWindowAt(mouseX, mouseY){

    // windowOrderの後ろほど前面
    for(let i = windowOrder.length - 1; i >= 0; i--){

        const id = windowOrder[i];
        const win = windows[id];

        if(!win.isOpen) continue;

        if(
            mouseX >= win.x &&
            mouseX <= win.x + win.width &&
            mouseY >= win.y &&
            mouseY <= win.y + win.height
        ){
            return id;
        }
    }

    return null;
}

// ==================================================
// クリック処理
// ==================================================

canvas.addEventListener("click", function(event){
    // =====================================
    // タイトルからのロード画面
    // =====================================
    if (scene === 4) {

        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * canvas.width / rect.width;
        const y = (event.clientY - rect.top) * canvas.height / rect.height;

        const s = getLoadScreenLayout();

        // 戻る
        if (
            x >= canvas.width / 2 - 65 &&
            x <= canvas.width / 2 + 65 &&
            y >= s.y + s.h - 54 &&
            y <= s.y + s.h - 18
        ) {
            scene = 0;
            titleHover = -1;
            gameloop();
            return;
        }

        // 各スロット
        for (let slot = 1; slot <= 3; slot++) {

            const rowY = s.y + 85 + (slot - 1) * 82;

            if (
                x >= s.x + s.w - 125 &&
                x <= s.x + s.w - 35 &&
                y >= rowY + 15 &&
                y <= rowY + 53
            ) {
                if (!hasSaveData(slot)) return;

                if (!confirm(`SLOT ${slot} をロードしますか？`)) {
                    return;
                }

                if (loadGame(slot)) {
                    scene = 1;
                    gameloop();
                }

                return;
            }
        }

        return;
    }

    // 設定画面のクリック
    if (scene === 3) {

        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left)
            * canvas.width / rect.width;

        const y = (event.clientY - rect.top)
            * canvas.height / rect.height;

        const s = getSettingLayout();

        // スライダー
        if (
            x >= s.sliderX - 10 &&
            x <= s.sliderX + s.sliderW + 10 &&
            y >= s.sliderY - 25 &&
            y <= s.sliderY + 25
        ) {
            setSettingVolume(x);
            return;
        }

        // テスト再生
        if (
            x >= s.testX && x <= s.testX + s.testW &&
            y >= s.testY && y <= s.testY + s.testH
        ) {
            playSound("click");
            return;
        }

        // 戻る
        if (
            x >= s.backX && x <= s.backX + s.backW &&
            y >= s.backY && y <= s.backY + s.backH
        ) {
            scene = 0;
            titleHover = -1;
            gameloop();
            return;
        }

        return;
    }

    if (scene === 5) {
        handleOpeningClick();
        return;
    }

    // タイトル画面
    if (scene === 0) {

        const rect = canvas.getBoundingClientRect();

        const mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
        const mouseY = (event.clientY - rect.top) * canvas.height / rect.height;

        const x = mouseX * 768 / canvas.width;
        const y = mouseY * 512 / canvas.height;

        // はじめから
        if (x >= 255 && x <= 516 && y >= 225 && y <= 272) {
            playSound("startButton");
            resetGame();
            startOpening();
            return;
        }

        // つづきから
        if (x >= 255 && x <= 516 && y >= 283 && y <= 329) {
            playSound("startButton");
            scene = 4;
            gameloop();
            return;
        }

        // 設定
        if (x >= 255 && x <= 516 && y >= 340 && y <= 387) {
            playSound("startButton");
            scene = 3;
            gameloop();
            return;
        }

        return;
    }
    // エンディング中のクリック
    if (scene === 2) {
        handleEndingClick();
        return;
    }

    if(scene !== 1) return;

    if (!tipsScreen.active) {
        playSound("click");
    }

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) * canvas.width / rect.width;

    const mouseY =
        (event.clientY - rect.top) * canvas.height / rect.height;


    // SYS画面の操作を先に処理する
    if (
        documentState.selectedDocument?.id === "tips_config_09" &&
        documentState.openedFromTrash &&
        windows.trash.isOpen
    ) {
        const win = windows.trash;

        const insideTrash =
            mouseX >= win.x &&
            mouseX <= win.x + win.width &&
            mouseY >= win.y &&
            mouseY <= win.y + win.height;

        // Trashが最前面で、クリック位置がTrash内の場合だけ処理
        if (
            insideTrash &&
            windowOrder[windowOrder.length - 1] === "trash"
        ) {

            // 戻る
            if (
                mouseX >= win.x + 20 &&
                mouseX <= win.x + 100 &&
                mouseY >= win.y + 50 &&
                mouseY <= win.y + 80
            ) {
                documentState.selectedDocument = null;
                documentState.openedFromTrash = false;
                documentState.scrollY = 0;

                gameloop();
                return;
            }

            // フィルター切り替え
            if (
                mouseX >= win.x + 25 &&
                mouseX <= win.x + 295 &&
                mouseY >= win.y + 270 &&
                mouseY <= win.y + 306
            ) {
                tipsFilterDisabled = !tipsFilterDisabled;

                gameloop();
                return;
            }

            // SYS内の余白をクリックしても設定は変えない
            return;
        }
    }
        
    
    // DAY9：TIPSの起動方法選択
    if (tipsScreen.active && day9TipsChoiceVisible) {

        if (mouseY >= 485 && mouseY <= 530) {

            if (mouseX >= 230 && mouseX <= 450) {
                day10ProtectedMode = false;
            }
            else if (mouseX >= 510 && mouseX <= 730) {
                day10ProtectedMode = true;
            }
            else {
                return;
            }

            day9TipsChoiceVisible = false;
            finishTips();
        }

        return;
    }

    // ==================================================
    // 印刷確認ウィンドウ
    // ==================================================

    if(documentState.printConfirm){

        const yes = documentState.printYesButton;
        const no  = documentState.printNoButton;


        // =========================
        // 「はい」
        // =========================

        if(
            yes &&
            mouseX >= yes.x &&
            mouseX <= yes.x + yes.w &&
            mouseY >= yes.y &&
            mouseY <= yes.y + yes.h
        ){

            const doc = documentState.selectedDocument;

            if(doc){
                doc.printed = true;
            }

            documentState.printConfirm = false;

            gameloop();
            return;
        }


        // =========================
        // 「いいえ」
        // =========================

        if(
            no &&
            mouseX >= no.x &&
            mouseX <= no.x + no.w &&
            mouseY >= no.y &&
            mouseY <= no.y + no.h
        ){

            documentState.printConfirm = false;

            gameloop();
            return;
        }
        return;
    }

    // ==================================================
    // 削除確認ウィンドウ
    // ==================================================

    if(documentState.deleteConfirm){

        const yes = documentState.DeleteYesButton;
        const no  = documentState.DeleteNoButton;

        // =========================
        // 「はい」
        // =========================

        if(
            yes &&
            mouseX >= yes.x &&
            mouseX <= yes.x + yes.w &&
            mouseY >= yes.y &&
            mouseY <= yes.y + yes.h
        ){
            const doc = documentState.selectedDocument;

            if(doc && !trashDocuments.includes(doc)){
                trashDocuments.push(doc);
            }

            documentState.selectedDocument = null;
            documentState.scrollY = 0;
            documentState.openedFromTrash = false;

            documentState.deleteConfirm = false;
            documentState.deleteFromList = false;

            gameloop();
            return;
        }

        // =========================
        // 「いいえ」
        // =========================

        if(
            no &&
            mouseX >= no.x &&
            mouseX <= no.x + no.w &&
            mouseY >= no.y &&
            mouseY <= no.y + no.h
        ){
            // 一覧から削除しようとした場合だけ
            // 選択中のPDFを解除する
            if(documentState.deleteFromList){
                documentState.selectedDocument = null;
            }

            documentState.deleteConfirm = false;
            documentState.deleteFromList = false;

            gameloop();
            return;
        }

        return;
    }

    // ==================================================
    // 復元確認ウィンドウ
    // ==================================================

    if(documentState.restoreConfirm){

        const yes =
            documentState.restoreYesButton;

        const no =
            documentState.restoreNoButton;


        // =========================
        // 「はい」
        // =========================

        if(
            yes &&
            mouseX >= yes.x &&
            mouseX <= yes.x + yes.w &&
            mouseY >= yes.y &&
            mouseY <= yes.y + yes.h
        ){

            const doc =
                documentState.selectedDocument;

            const index =
                trashDocuments.indexOf(doc);


            if (index !== -1) {

                trashDocuments.splice(index, 1);

                if (doc.shared) {

                    restoredSharedFiles.add(doc.id);

                    // 復元した共有ファイルをFilesに追加
                    if (!documents.day10) {
                        documents.day10 = [];
                    }

                    if (!documents.day10.some(
                        file => file.id === doc.id
                    )) {
                        documents.day10.push(doc);
                    }
                }
            }


            documentState.restoreConfirm = false;

            documentState.selectedDocument = null;
            documentState.openedFromTrash = false;
            documentState.scrollY = 0;

            gameloop();
            return;
        }


        // =========================
        // 「いいえ」
        // =========================

        if(
            no &&
            mouseX >= no.x &&
            mouseX <= no.x + no.w &&
            mouseY >= no.y &&
            mouseY <= no.y + no.h
        ){

            documentState.restoreConfirm = false;

            gameloop();
            return;
        }


        // 確認画面の外を押しても何もしない
        return;
    }

    const topWindow = getTopWindowAt(mouseX, mouseY);

    // =====================================
    // Save / Load ウィンドウ
    // =====================================
    if (topWindow === "save") {

        const win = windows.save;
        const x = win.x;
        const y = win.y;
        const w = win.width;

        for (let slot = 1; slot <= 3; slot++) {

            const rowY = y + 95 + (slot - 1) * 75;

            if (
                mouseY < rowY + 13 ||
                mouseY > rowY + 51
            ) continue;

            // SAVE
            if (
                mouseX >= x + w - 255 &&
                mouseX <= x + w - 190
            ) {
                if (
                    hasSaveData(slot) &&
                    !confirm(`SLOT ${slot} を上書きしますか？`)
                ) return;

                if (saveGame(slot)) gameloop();
                return;
            }

            // LOAD
            if (
                mouseX >= x + w - 180 &&
                mouseX <= x + w - 115
            ) {
                if (!hasSaveData(slot)) return;

                if (!confirm(`SLOT ${slot} をロードしますか？`)) {
                    return;
                }

                if (loadGame(slot)) gameloop();
                return;
            }

            // DELETE
            if (
                mouseX >= x + w - 105 &&
                mouseX <= x + w - 30
            ) {
                if (!hasSaveData(slot)) return;

                if (!confirm(
                    `SLOT ${slot} のセーブデータを削除しますか？\nこの操作は取り消せません。`
                )) return;

                deleteSave(slot);
                gameloop();
                return;
            }
        }

        return;
    }

    // ==================================================
    // Mail
    // ==================================================

    const mailWin = windows.mail;

    if(
        mailWin.isOpen &&
        topWindow === "mail"
    ){

        const x = mailWin.x;
        const y = mailWin.y;
        const w = mailWin.width;


        // ==============================================
        // メール本文を開いている
        // ==============================================

        if(mailState.selectedMail !== null){

            // -------------------------
            // 戻るボタン
            // -------------------------

            if(
                mouseX >= x + 20 &&
                mouseX <= x + 100 &&
                mouseY >= y + 50 &&
                mouseY <= y + 80
            ){

                mailState.selectedMail = null;

                gameloop();
                return;
            }

        }


        // ==============================================
        // メール一覧
        // ==============================================

        else{
            const mailList =
                mailState.folder === "inbox"
                    ? mailState.inbox
                    : mailState.sent;


            let mailY = y + 110 - mailScrollY;

            for(const mail of mailList){

                if(
                    mouseX >= x + 20 &&
                    mouseX <= x + w - 20 &&
                    mouseY >= y + 110 &&
                    mouseY <= y + mailWin.height - 15 &&
                    mouseY >= mailY &&
                    mouseY <= mailY + 40
                ){
                    mailState.selectedMail = mail;
                    mail.read = true;
                    mailBodyScrollY = 0;
                    gameloop();
                    return;
                }

                mailY += 50;
            }
        }
        return;
    }



    // ==================================================
    // Files
    // ==================================================

    const filesWin = windows.files;

    if(
        filesWin.isOpen &&
        topWindow === "files"
    ){

        const x = filesWin.x;
        const y = filesWin.y;
        const w = filesWin.width;


        // ==============================================
        // PDFを開いている
        // ==============================================

        if(documentState.selectedDocument !== null && !documentState.openedFromTrash){
            if(
                mouseX >= x + 20 &&
                mouseX <= x + 100 &&
                mouseY >= y + 50 &&
                mouseY <= y + 80
            ){

                documentState.selectedDocument = null;
                documentState.scrollY = 0;

                gameloop();
                return;
            }

            if(
                mouseX >= x + 110 &&
                mouseX <= x + 190 &&
                mouseY >= y + 50 &&
                mouseY <= y + 80
            ){
                documentState.printConfirm = true;
                gameloop();
                return;
            }

            // =========================
            // 削除ボタン
            // =========================

            if(
                mouseX >= x + 200 &&
                mouseX <= x + 280 &&
                mouseY >= y + 50 &&
                mouseY <= y + 80
            ){
                documentState.deleteConfirm = true;
                documentState.deleteFromList = false;

                gameloop();
                return;
            }
        }


        // ==============================================
        // PDF一覧
        // ==============================================

        else{
            let documentList = [];

            for(let i = 1; i <= day; i++){

                const dayDocuments = documents["day" + i];

                if(dayDocuments){

                    for(const doc of dayDocuments){

                        if(!trashDocuments.includes(doc)){
                            documentList.push(doc);
                        }
                    }
                }
            }

            let fileY = y + 60 - filesScrollY;

            for(const doc of documentList){

                // =========================
                // 削除ボタンのクリック判定
                // =========================

                const deleteX = x + w - 100;
                const deleteY = fileY + 7;

                if(
                    mouseX >= deleteX &&
                    mouseX <= deleteX + 65 &&
                    mouseY >= deleteY &&
                    mouseY <= deleteY + 30 &&

                    mouseY >= y + 60 &&
                    mouseY <= y + filesWin.height - 15
                ){
                    documentState.selectedDocument = doc;
                    documentState.openedFromTrash = false;
                    documentState.deleteFromList = true;
                    documentState.deleteConfirm = true;

                    gameloop();
                    return;
                }

                // =========================
                // ファイルを開くクリック判定
                // =========================

                if(
                    mouseX >= x + 20 &&
                    mouseX <= x + w - 30 &&

                    mouseY >= y + 60 &&
                    mouseY <= y + filesWin.height - 15 &&

                    mouseY >= fileY &&
                    mouseY <= fileY + 45
                ){
                    documentState.selectedDocument = doc;
                    documentState.openedFromTrash = false;
                    documentState.scrollY = 0;

                    doc.read = true;

                    gameloop();
                    return;
                }

                fileY += 55;
            }
        }
        return;
    }

    // ==================================================
    // Trash
    // ==================================================

    if(topWindow === "trash"){

        const trashWin = windows.trash;

        const x = trashWin.x;
        const y = trashWin.y;


        // =========================================
        // ファイルを開いている場合
        // =========================================

        if(
            documentState.selectedDocument !== null &&
            documentState.openedFromTrash
        ){
            // -------------------------
            // 戻るボタン
            // -------------------------

            if(
                mouseX >= x + 20 &&
                mouseX <= x + 100 &&
                mouseY >= y + 50 &&
                mouseY <= y + 80
            ){

                documentState.selectedDocument = null;
                documentState.openedFromTrash = false;
                documentState.scrollY = 0;

                gameloop();
                return;
            }


            // -------------------------
            // 復元ボタン
            // -------------------------

            if(
                mouseX >= x + 110 &&
                mouseX <= x + 190 &&
                mouseY >= y + 50 &&
                mouseY <= y + 80
            ){
                documentState.restoreConfirm = true;
                gameloop();
                return;
            }

            return;
        }


        // =========================================
        // Trashのファイル一覧
        // =========================================

        let fileY = y + 60 - trashScrollY;

        for(const doc of trashDocuments){

            if(
                mouseX >= x + 20 &&
                mouseX <= x + trashWin.width - 30 &&

                mouseY >= y + 60 &&
                mouseY <= y + trashWin.height - 15 &&

                mouseY >= fileY &&
                mouseY <= fileY + 45
            ){

                documentState.selectedDocument = doc;
                documentState.openedFromTrash = true;
                documentState.scrollY = 0;

                gameloop();
                return;
            }

            fileY += 55;
        }
    }



    // ==================================================
    // デスクトップアイコン
    // ==================================================
    if(topWindow !== null){
        return;
    }


    for(const icon of desktopIcons){

        if(
            mouseX >= icon.x &&
            mouseX <= icon.x + 55 &&
            mouseY >= icon.y &&
            mouseY <= icon.y + 75
        ){

            const win = windows[icon.id];

            if(win){
                win.isOpen = true;
                bringWindowToFront(icon.id);
                gameloop();
                return;
            }
        }
    }
});


canvas.addEventListener("wheel", function(event){

    if(scene !== 1) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY = (event.clientY - rect.top) * canvas.height / rect.height;

    // ==========================================
    // マウス位置で一番手前のウィンドウを取得
    // ==========================================

    const topWindow = getTopWindowAt(mouseX, mouseY);

    if(topWindow === null) return;

    // ==========================================
    // Mail
    // ==========================================

    if(topWindow === "mail"){

        const win = windows.mail;

        // メール本文を開いている場合は
        // 一覧スクロールをしない
        // ==========================================
        // メール本文
        // ==========================================

        if(mailState.selectedMail !== null){

            const mail = mailState.selectedMail;
            const bodyX = win.x + 25;
            const bodyY = win.y + 185;
            const bodyW = win.width - 50;
            const bodyH = win.height - 200;

            // 本文領域にマウスがあるか
            if(
                mouseX < bodyX ||
                mouseX > bodyX + bodyW ||
                mouseY < bodyY ||
                mouseY > bodyY + bodyH
            ){
                return;
            }

            const contentHeight = mail.body.length * 25 + 20;
            const maxScroll = Math.max(0, contentHeight - bodyH);

            mailBodyScrollY +=
                event.deltaY > 0
                ? 15
                : -15;


            mailBodyScrollY = Math.max(0,Math.min(mailBodyScrollY, maxScroll));
            event.preventDefault();
            gameloop();
            return;
        }

        // メール一覧表示領域
        const listX = win.x + 20;
        const listY = win.y + 110;
        const listW = win.width - 40;
        const listH = win.height - 125;


        // 一覧部分の上にマウスがあるか
        if(
            mouseX < listX ||
            mouseX > listX + listW ||
            mouseY < listY ||
            mouseY > listY + listH
        ){
            return;
        }


        const mailList =
            mailState.folder === "inbox"
            ? mailState.inbox
            : mailState.sent;


        const contentHeight = mailList.length * 50;

        const maxScroll = Math.max(0, contentHeight - listH);

        // ホイール
        mailScrollY += event.deltaY > 0 ? 15 : -15;

        // 上下限
        mailScrollY = Math.max(0, Math.min(mailScrollY, maxScroll ));

        event.preventDefault();
        gameloop();
        return;
    }

    // ==========================================
    // Files
    // ==========================================

    if(topWindow === "files"){

        const win = windows.files;


        // ======================================
        // PDFを開いている場合
        // ======================================

        if(documentState.selectedDocument !== null && !documentState.openedFromTrash){
            const pdfX = win.x + 20;
            const pdfY = win.y + 95;
            const pdfW = win.width - 40;
            const pdfH = win.height - 115;


            // PDF領域にマウスがあるか
            if(
                mouseX < pdfX ||
                mouseX > pdfX + pdfW ||
                mouseY < pdfY ||
                mouseY > pdfY + pdfH
            ){
                return;
            }


            const doc =
                documentState.selectedDocument;


            const contentHeight =
                60 +
                doc.body.length * 22 +
                20;


            const maxScroll =
                Math.max(
                    0,
                    contentHeight - pdfH
                );


            documentState.scrollY +=
                event.deltaY > 0
                ? 15
                : -15;


            documentState.scrollY =
                Math.max(
                    0,
                    Math.min(
                        documentState.scrollY,
                        maxScroll
                    )
                );


            event.preventDefault();

            gameloop();

            return;
        }


        // ======================================
        // Files一覧の場合
        // ======================================

        const listX = win.x + 20;
        const listY = win.y + 60;
        const listW = win.width - 40;
        const listH = win.height - 75;


        // 一覧領域にマウスがあるか
        if(
            mouseX < listX ||
            mouseX > listX + listW ||
            mouseY < listY ||
            mouseY > listY + listH
        ){
            return;
        }


        // 現在のDAYまでのファイル
        let documentList = [];

        for(let i = 1; i <= day; i++){

            const dayDocuments =
                documents["day" + i];

            if(dayDocuments){
                documentList.push(
                    ...dayDocuments
                );
            }
        }


        const contentHeight =
            documentList.length * 55;


        const maxScroll =
            Math.max(
                0,
                contentHeight - listH
            );


        filesScrollY +=
            event.deltaY > 0
            ? 15
            : -15;


        filesScrollY =
            Math.max(
                0,
                Math.min(
                    filesScrollY,
                    maxScroll
                )
            );


        event.preventDefault();

        gameloop();

        return;
    }

    // ==========================================
    // Trash
    // ==========================================

    if(topWindow === "trash"){

        const win = windows.trash;

        // SYSファイル表示中はPDFスクロールを行わない
        if (
            documentState.selectedDocument?.id === "tips_config_09" &&
            documentState.openedFromTrash
        ) {
            event.preventDefault();
            return;
        }


        // TrashからPDFを開いている場合
        if(
            documentState.selectedDocument !== null &&
            documentState.openedFromTrash
        ){

            const pdfX = win.x + 20;
            const pdfY = win.y + 95;
            const pdfW = win.width - 40;
            const pdfH = win.height - 115;


            if(
                mouseX < pdfX ||
                mouseX > pdfX + pdfW ||
                mouseY < pdfY ||
                mouseY > pdfY + pdfH
            ){
                return;
            }


            const doc =
                documentState.selectedDocument;

            const contentHeight =
                60 +
                doc.body.length * 22 +
                20;

            const maxScroll =
                Math.max(
                    0,
                    contentHeight - pdfH
                );


            documentState.scrollY +=
                event.deltaY > 0
                ? 15
                : -15;


            documentState.scrollY =
                Math.max(
                    0,
                    Math.min(
                        documentState.scrollY,
                        maxScroll
                    )
                );


            event.preventDefault();

            gameloop();
            return;
        }


        // ======================================
        // Trash一覧
        // ======================================

        const listX = win.x + 20;
        const listY = win.y + 60;
        const listW = win.width - 40;
        const listH = win.height - 75;


        if(
            mouseX < listX ||
            mouseX > listX + listW ||
            mouseY < listY ||
            mouseY > listY + listH
        ){
            return;
        }


        const contentHeight =
            trashDocuments.length * 55;

        const maxScroll =
            Math.max(
                0,
                contentHeight - listH
            );


        trashScrollY +=
            event.deltaY > 0
            ? 15
            : -15;


        trashScrollY =
            Math.max(
                0,
                Math.min(
                    trashScrollY,
                    maxScroll
                )
            );


        event.preventDefault();

        gameloop();
        return;
    }

}, { passive: false });

// ==================================================
// ゲームスタート用
// ==================================================
function gameloop(){
    switch(scene){
        case 0: //タイトル
            drawTitle();
            break;
        case 1: //ゲーム
            drawGame();
            break;
        case 2: //エンディング
            drawEnding();
            break;
        case 3: //設定
            drawSettings();
            break;
        case 4: //セーブ画面
            drawLoadScreen();
            break;
        case 5: //オープニング
            drawOpening();
            break;
        default:
            break;
    }
}

// ==================================================
// ゲームスタート
// ==================================================
scene = 0;
day = 1;
gameloop();