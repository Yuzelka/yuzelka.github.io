const tipsData = {

    0: { // ゲーム開始時
        title: "TIPS",
        text: [
            "デスクトップ上のアイコンをクリックすると、",
            "各アプリケーションを開くことができます。"
        ],

        trueTips: null,
        trueTipsProgress: null
    },

    1: { // DAY1終了後
        title: "TIPS",
        text: [
            "業務内容は毎日更新されます。",
            "Tasksに表示された項目を",
            "順番に処理してください。"
        ],

        trueTips: null,
        trueTipsProgress: null
    },

    2: { // DAY2終了後
        title: "TIPS",
        text: [
            "不要になったファイルは",
            "削除してください。",
            "",
            "削除したファイルは",
            "元に戻せない場合があります。"
        ],

        // 最初はノイズだけ
        trueTips: [
            "...."
        ],
        trueTipsProgress: 80,   //%で開始
        noiseDuration: 40,      // 最初のザッ
        trueTipsDuration: 100,   // 真TIPS
        returnNoiseDuration: 40, // 戻るザッ

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0,
        noiseBurst: 1.5,
        screenTear: 5,
        glitchInterval: 600,
    },

    3: { // DAY3終了後
        title: "TIPS",
        text: [
            "削除対象に指定されたファイルは、",
            "業務終了までに処理してください。",
            "",
            "不要なデータを残さないよう",
            "ご協力をお願いします。"
        ],

        trueTips: null,

        trueTipsProgress: 0,
        noiseDuration: 1400,     
        trueTipsDuration: 900,  
        returnNoiseDuration: 1400 
    },

    4: { // DAY4終了後  (TIPS文はgame_2.js内で定義)
        title: "TIPS",
        text: [
            
        ],

        trueTips: [
            
        ],

        trueTipsProgress: 80,
        noiseDuration: 40,      
        trueTipsDuration: 2000,   
        returnNoiseDuration: 40 ,

        noiseIntensity: 0.5,
        shakeIntensity: 8,
        sliceIntensity: 12,
        scanlineIntensity: 0.4,
        permanentOffsetX: 50,
        permanentOffsetY: 25,
        textCorruption: 0,
        blackoutChance: 0,
        noiseBurst: 4,
        screenTear: 35,
        glitchInterval: 250,
    },

    5: { // DAY5終了後
        title: "TIPS",
        text: [
            "過去の業務資料を確認する必要はありません。",
            "",
            "本日の業務に必要なファイルのみ",
            "参照してください。"
        ],

        trueTips: [
            "まだ",
            "残ってる"
        ],

        trueTipsProgress: 80,
        noiseDuration: 40,      // 最初のザッ：0.2秒
        trueTipsDuration: 200,   // 真TIPS：0.9秒
        returnNoiseDuration: 40, // 戻るザッ：0.2秒

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0,

        noiseBurst: 6,
        screenTear: 40,
        glitchInterval: 200,
    },

    6: { // DAY6終了後
        title: "TIPS",
        text: [
            "削除済みのファイルを",
            "復元する必要はありません。",
            "",
            "不要なデータは定期的に整理してください。"
        ],

        trueTips: [
            "復元して",
            "中を見て"
        ],

        trueTipsProgress: 80,
        noiseDuration: 40,      // 最初のザッ：0.2秒
        trueTipsDuration: 200,   // 真TIPS：0.9秒
        returnNoiseDuration: 40, // 戻るザッ：0.2秒

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0,

        noiseBurst: 6,
        screenTear: 42,
        glitchInterval: 200,
    },

    7: { // DAY7終了後
        title: "TIPS",
        text: [
            "一部の資料には",
            "機密情報が含まれています。",
            "",
            "削除指示がある場合は",
            "速やかに処理してください。"
        ],

        trueTips: [
            "会社は",
            "隠してる"
        ],

        trueTipsProgress: 48,
        noiseDuration: 200,      // 最初のザッ：0.2秒
        trueTipsDuration: 900,   // 真TIPS：0.9秒
        returnNoiseDuration: 200, // 戻るザッ：0.2秒

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0
    },

    8: { // DAY8終了後
        title: "TIPS",
        text: [
            "現在、一部画面に",
            "表示上の不具合が確認されています。",
            "",
            "不審なメッセージが表示された場合は",
            "無視してください。"
        ],

        trueTips: [
            "気づかれた",
            "",
            "時間がない"
        ],

        trueTipsProgress: 43,
        noiseDuration: 200,      // 最初のザッ：0.2秒
        trueTipsDuration: 900,   // 真TIPS：0.9秒
        returnNoiseDuration: 200, // 戻るザッ：0.2秒

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0
    },

    9: { // DAY9終了後
        title: "TIPS",
        text: [
            "明日の業務終了後、",
            "不要な業務データを一括削除します。",
            "",
            "削除対象のファイルを",
            "残さないようにしてください。"
        ],

        trueTips: [
            "明日",
            "全部消される"
        ],

        trueTipsProgress: 38,
        noiseDuration: 200,      // 最初のザッ：0.2秒
        trueTipsDuration: 900,   // 真TIPS：0.9秒
        returnNoiseDuration: 200, // 戻るザッ：0.2秒

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0
    },

    10: { // DAY10終了後
        title: "TIPS",
        text: [
            "すべての業務が完了しました。",
            "",
            "不要なデータを削除しています。",
            "しばらくお待ちください。"
        ],

        trueTips: [
            "待って",
            "",
            "まだ終わってない"
        ],

        trueTipsProgress: 99,
        noiseDuration: 200,      // 最初のザッ：0.2秒
        trueTipsDuration: 900,   // 真TIPS：0.9秒
        returnNoiseDuration: 200, // 戻るザッ：0.2秒

        noiseIntensity: 0.5,
        shakeIntensity: 5,
        sliceIntensity: 8,
        scanlineIntensity: 0.3,
        permanentOffsetX: 0,
        permanentOffsetY: 0,
        textCorruption: 0,
        blackoutChance: 0
    }
};