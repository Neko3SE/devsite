'use strict';

registerLocale('zh-Hant', {
  meta: { name: '繁體中文' },
  site: {
    documentTitle: 'AI 驅動型非生產性 Web 技術研究所', eyebrow: 'AI-DRIVEN NON-PRODUCTIVE WEB TECHNOLOGY LAB.', officialLabel: '正式名稱', officialName: 'AI 驅動型非生產性 Web 技術研究所', tagline: '事情很無聊，實作密度卻是正式環境等級。', brandAlias: 'Muda Engineering Lab', languageLabel: '語言', bgmStart: '▶ BGM START', bgmStop: '■ BGM STOP',
    badges: ['🧪 研究主題 10 項', '🎮 不可放置過關', '🔊 最大輸出・和弦音效', '🎉 全部過關時播放號角', '📦 CSS 與各遊戲 JS 分離'],
    aboutTitle: '關於本研究所',
    about: ['Muda Engineering Lab 是一個諷刺網站，題材取自 1980 年代至 2000 年代部分日本辦公室中曾出現的低效率工作習慣。', '紙本文件、傳真、Hanko 印章、漫長會議與複雜的核准流程，都是當時許多辦公室日常的一部分。', '本網站刻意誇張這些習慣，並全力運用現代 Web 技術，把「無用的工作」重現為遊戲。', '當然，並非所有日本企業都以這種方式工作。本網站不是歷史資料，而是一部以幽默回顧昔日企業文化的虛構諷刺作品。', '即使不熟悉當時的日本企業文化也沒問題。每個遊戲開始前，都會簡短介紹啟發該遊戲的工作文化。'],
    back: '← 返回研究一覽', controlsPrefix: '操作：', researchNo: 'RESEARCH No.{number}'
  },
  common: { cultureNote: '🧪 文化研究記錄 No.{number}', parodyHeading: '這個遊戲的諷刺重點', beginResearch: '開始研究', researchComplete: 'RESEARCH COMPLETE', researchCompleteJa: '研究完成', researchSuccess: '研究成功', researchFailed: 'RESEARCH FAILED', researchFailedJa: '研究失敗', promptLabel: '最初向 AI 提出的要求', disclaimer: '本程式透過與 AI 對話製作，執行時不使用外部 AI API。', retry: '再次研究', retryFail: '重新挑戰' },
  game01: {
    title: '正式環境 絕對不要按.exe', description: '無視 8 道警告，最後完成緊急 ROLLBACK。', controls: '點擊 / 輕觸',
    culture: { heading: '當時的企業 IT 文化', background: ['1980 年代至 2000 年代，企業 IT 系統的開發與維運環境不像今天這般自動化。變更正式環境具有很大風險，復原工作往往依賴熟悉系統的工程師。', '尤其在負責人下班後，或週末前的星期五傍晚變更正式環境，一旦發生事故卻沒有人能復原，是 IT 工程師典型的惡夢情境。'], parody: ['警告、時間、負責人不在、變更申請尚未核准……這個遊戲誇張重現無視所有危險訊號、直接衝向正式環境的工程師。', '即使部署成功，也不能太早放心。'], punchline: '真正的研究從這裡才開始。' },
    playing: { doNotPress: '絕對不要按', warnings: ['部署至正式環境', '確定要按嗎？', '今天是星期五', '現在時間 17:48', '負責人已下班', '監控人員也已下班', '變更申請尚未核准', '仍要部署至正式環境'], warningHeadings: ['不要按', '放棄吧', '真的嗎？', '今天星期五', '下班吧', '無負責人', '尚未核准'], toldNotTo: '※ 已經明確告訴你不要按。', warningToast: '警告 {count}/8', passed: '突破確認 {count}/8', deploy: 'DEPLOY!!!', deploySuccess: 'DEPLOY SUCCESS', thought: '……你以為成功了？', monitoring: '監控警報 9999+', emergencyRollback: '緊急 ROLLBACK {count}/6', rollback: 'ROLLBACK {count}/6', rollbackHelp: '按 6 次復原變更' },
    clear: '正式環境已恢復。原因是「一時衝動」。', prompt: '製作一個越被警告不要按、越讓人想按的正式環境部署按鈕。最後連 ROLLBACK 也要做成遊戲。'
  },
  game02: {
    title: '準時下班 DEFENSE', description: '在 3 條路線間移動，閃避主管與通知 12 次後逃出辦公室。', controls: '↑ ↓ / 輕觸',
    culture: { heading: '當時的企業文化', background: ['1980 年代至 2000 年代，許多日本企業長時間工作並不罕見。即使已到下班時間，當主管與同事仍在工作時，有些職場也會讓人感到難以先離開。', '正準備回家時，主管可能突然問「有空一下嗎？」或說「只要五分鐘」，接著便開始新的工作或會議。', '1990 年代以後，電子郵件與即時訊息逐漸普及，也增加了下班前仍會收到工作聯絡的新理由。'], parody: ['阻止準時下班的主管、郵件、審查要求與訊息通知，全都化為迎面而來的障礙物。', '閃避 12 次，平安逃出辦公室。'], punchline: '下班時間是要遵守的。大概吧。' },
    playing: { hud: '閃避 {dodges} / 12　HP {hp}', instruction: '按 ↑ ↓ 或輕觸畫面上方 / 下方切換路線', obstacles: ['主管：「有空一下嗎？」', '訊息 99+', '緊急郵件', '只確認 5 分鐘', '參加交流會嗎？', '麻煩幫忙審查'], dodge: 'DODGE {count}/12' },
    clear: '準時下班成功！……訊息還在繼續傳來。', failure: '被主管攔住了。「只確認一件事」現在開始。', prompt: '下班時間一到，就在 3 條路線中閃避「有空一下嗎？」。以成功閃避次數過關，而且不可放置過關。'
  },
  game03: {
    title: 'RINGI HANKO IMPACT', description: '依照順序在 20 個發光的核准欄蓋章。', controls: '拖曳 / 點擊',
    culture: { heading: '日本的稟議與 HANKO 核准文化', background: ['稟議（Ringi）是把提案或申請文件傳閱給相關人員以取得核准的日本制度。Hanko 是用來表示核准的印章。'], parody: ['本遊戲以購買 980 日圓（¥980）的 USB 纜線也需要 20 個核准章，極端誇張日本企業的多階段核准制度。', '在黃色目標欄蓋上 Hanko，完成 20 次核准。'], punchline: 'HANKO COMBO 將日常核准程序變成必殺技。' },
    playing: { documentTitle: '物品採購稟議書', request: '申請內容：USB 纜線 ¥980', approval: '核准 {count} / 20', stampLabel: 'Hanko 核准印章', stamp: '承', hint: '把 Hanko 拖到發光的核准欄，或直接點擊目標欄蓋章。', names: ['主任', '課長', '部門主管', '總部主管', '會計', '法務', '資訊系統', '稽核', '總務', '採購', '資訊安全', 'PMO', '品質保證', '事業部', '管理部', '人力資源', '高階主管', '神祕部門', '相關部門', '最終核准'], wrongOrder: '核准順序錯誤', combo: 'HANKO COMBO ×{count}' },
    clear: '核准完成：現在終於可以購買 ¥980 的 USB 纜線。', prompt: '製作一個只需依序在巨大稟議書上蓋滿 Hanko，卻有如必殺技般華麗演出的遊戲。'
  },
  game04: {
    title: '無限系統事故應變', description: '在 SLA 耗盡前復原 25 起系統事故。', controls: '點擊 / 輕觸',
    culture: { heading: '企業 IT 的系統事故應變文化', background: ['企業 IT 維運中常見系統事故、SLA、原因不明、無法重現，以及只有特定人員瞭解系統等問題。'], parody: ['本遊戲把這些情況誇張成高速點擊遊戲；未解決的事故越多，SLA 下降得越快。請復原 25 起事故。'], punchline: '即使找不到原因，系統事故也不會等人。' },
    playing: { hud: '已復原 {done} / 25　SLA {sla}%', open: '未處理 {count} / 7', help: '點擊紅色事故進行復原。最初 5 秒寬限結束後，未解決事故會使 SLA 快速下降。', grace: '初始應變寬限 {seconds} 秒　現在就處理事故！', incidents: ['DB 連線錯誤', '大概是 DNS', '憑證已過期', '昨天還能用', '我的環境可以用', '無法重現', '原因：不明'], recover: 'RECOVER {count}/25' },
    clear: '原因確認：原本就是這個規格。', failure: 'SLA 0%。事故報告書開始製作。', prompt: '製作一個打地鼠式事故處理遊戲：修復事故會產生更多事故，而未處理數量會降低 SLA。'
  },
  game05: {
    title: '規格變更閃避遊戲', description: '左右移動閃避 20 項規格變更，在被擊中 3 次前發布。', controls: '← → / 輕觸',
    culture: { heading: '開發現場的規格變更', background: ['開發過程中，追加要求、規格變更與範圍擴大可能會不斷出現。'], parody: ['我們把開發途中突然追加的棘手要求變成掉落物。左右移動並閃避 20 項要求。'], punchline: '規格總是在發布前長得最快。' },
    playing: { hud: '閃避 {dodges} / 20　HP {hp}', instruction: '按 ← → 或輕觸畫面左側 / 右側', changes: ['修改文字', '變更按鈕位置', '也要支援手機', '考慮海外市場', '不能也加上 AI 嗎？', 'DB 也想換掉', '先全部重新檢討'], avoid: 'AVOID {count}/20' },
    clear: '發布成功！……下一項規格變更已送達。', failure: '被規格變更淹沒了。SPRINT 2 現在開始。', prompt: '讓規格變更從整個畫面落下，玩家左右移動閃避。每次成功閃避都會提高進度。'
  },
  game06: {
    title: 'Excel 方格紙 CRAFT', description: '只塗上設計圖指定的儲存格，完成 Excel 城堡。', controls: '點擊 / 輕觸',
    culture: { heading: '日本的 Excel 方格紙文化', background: ['部分日本企業會細微調整 Excel 儲存格的寬度與高度，像方格紙一樣用來製作表單、設計圖及文件版面。'], parody: ['按照設計圖為 Excel 風格的儲存格上色，完成指定的 36 格。塗錯 5 次就會退回審查。'], punchline: '請在不合併儲存格的情況下完成 Excel 城堡。' },
    playing: { hud: '正確 {ok} / {total}　塗錯 {wrong} / 5', heading: 'Excel 方格紙 CRAFT：設計圖', hint: '只把有標示外框的儲存格塗成綠色。塗錯 5 次就會退回。', cellLabel: '儲存格 {x},{y}', cell: 'CELL {count}/{total}' },
    clear: 'Excel 城堡竣工。現在禁止合併儲存格。', failure: '偏離設計圖。退回 Excel 專家審查。', prompt: '製作一個過度遊戲化的挑戰：依照 Excel 方格紙設計圖為儲存格上色，建造一座城堡。'
  },
  game07: {
    title: '進度 100% 生成器', description: '抵抗反覆的修改要求，把進度推到 100%。', controls: '連續點擊',
    culture: { heading: '重視進度百分比的工作文化', background: ['有時候，比起實際工作成果，只有名為「進度百分比」的數字持續增加。'], parody: ['我們把它重現為連續點擊按鈕來產生進度的裝置。抵抗約每 4 秒一次的審查退回修改，把進度推到 100%。'], punchline: '即使進度達到 100%，也不保證真的存在工作成果。' },
    playing: { reviewIn: '距離退回修改還有 {seconds} 秒', generate: '產生進度', combo: 'COMBO ×{count}', hint: '連續點擊以增加進度。每 4 秒會要求修改。', review: '要求修改！-{loss}%' },
    clear: '進度 100%。未確認到實際工作成果。', prompt: '製作一個點擊就會前進，但定期因審查要求修改而降低進度的裝置。'
  },
  game08: {
    title: 'Bug 供養寺', description: '供養 15 隻逃跑的 Bug。逃走 5 隻就失敗。', controls: '點擊 / 輕觸',
    culture: { heading: '日本的供養文化', background: ['日本有一種名為 Kuyō（供養）的文化，對完成使命的物品表達感謝，並以敬意送別。', '針供養及人偶供養等儀式，是向使用過的物品致謝後送別的代表例子。', '另一方面，在軟體開發中，Bug 是指程式中的缺陷。'], parody: ['因此 Muda Engineering Lab 決定不修正 Bug，而是敲響佛教儀式使用的木製打擊法器木魚（Mokugyo），為它們舉行供養。', '點擊逃跑的 Bug，送 15 隻安息。', '被放置的 Bug 會逃往正式環境。逃走 5 隻就會研究失敗。'], punchline: '願每個 Bug 都能安息。' },
    playing: { hud: '供養 {done} / 15　逃脫 {escaped} / 5', output: '木魚輸出 300%', production: '🚨 正式環境', instruction: '點擊逃跑的 🐛 Bug，送它們安息。', hint: '紅色 Bug 正在逃往正式環境！', escaping: '🚨 正逃往正式環境', memorialized: '安息 {done}/15', prevented: '阻止逃脫！安息 {done}/15', escapeStart: '🚨 開始逃往正式環境！', escaped: '流入正式環境！逃脫 {escaped}/5' },
    clear: '所有 Bug 都已安息。另偵測到 1 個新 Bug。', failure: '5 隻 Bug 逃進正式環境。現在必須先處理事故，再談供養。', prompt: '使用木魚（Mokugyo）供養軟體 Bug。Bug 會四處逃跑，每逃走一隻就更接近研究失敗。'
  },
  game09: {
    title: '會議脫逃模擬器', description: '在「還有其他事項嗎？」的時機總共離席 3 次。', controls: '時機點擊',
    culture: { heading: '當時的企業文化', background: ['1980 年代至 2000 年代，日本企業經常透過多人會議分享資訊並協調決策。', '漫長會議快結束時，主持人可能會問：「還有其他事項嗎？」', '如果沒有人發言，會議或許終於可以結束。', '但只要有人說「再補充一點」、「關於這件事」或「快速分享一下」，新的討論便可能開始。'], parody: ['「還有其他事項嗎？」出現的短暫瞬間，就是脫逃機會。', '看準時機按下「離席」，總共成功 3 次。'], punchline: '會議看似結束的瞬間最危險。' },
    playing: { hud: '脫逃成功 {count} / 3', inProgress: '會議進行中……', roles: ['部門主管', 'PM', '開發', '你'], leave: '離席', instruction: '只有出現「還有其他事項嗎？」時才能按。', lines: ['接下來是下一項議題', '再補充一點……', '關於這件事……', '快速分享一下……'], chance: '還有其他事項嗎？', toast: 'ESCAPE CHANCE {count}/3', notOver: '還沒結束' },
    clear: '成功逃離會議！「那就散會」真的存在。', prompt: '製作一個只有在短暫出現「還有其他事項嗎？」時才能離席，而且必須成功 3 次的會議遊戲。'
  },
  game10: {
    title: '正式環境伺服器神社', description: '在發光區鳴鈴 7 次連續成功，完成祈願 COMBO。', controls: '時機點擊',
    culture: { heading: '日本的神社文化', background: ['日本有前往神道神社，為工作、考試、安全、健康與好運祈願的文化。', '有些神社會在參拜前鳴鈴。御神籤（Omikuji）可能出現「大吉（Daikichi）」等運勢。', '對 IT 工程師而言，即使完成所有測試、審查與準備，部署正式環境仍然是緊張的時刻。'], parody: ['測試完成了。審查也完成了。', '現在只剩全力祈求正式環境平安無事。', '在發光的成功區鳴鈴，連續成功 7 次。'], punchline: '技術無法處理的最後 1%，現在交給祈願。' },
    playing: { hud: '祈願 COMBO {count} / 7', waiting: '祈願狀態：等待中', lucky: '祈願狀態：吉兆', luckyZone: '在發光的吉兆區鳴鈴', instruction: '發光時立刻鳴鈴！', now: '就是現在！！！', ring: '🔔 鳴鈴', combo: '祈願 COMBO ×{count}', premature: '祈願太早了！' },
    clearTitle: '大吉（Daikichi）', clear: '部署成功率沒有改變。', clearPunchline: '但心情已經安定下來。', prompt: '在部署正式環境前，只在神社祈願；並把配合發光時機鳴鈴做成一個時機遊戲。'
  }
});
