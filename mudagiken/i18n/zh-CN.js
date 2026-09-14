'use strict';

registerLocale('zh-CN', {
  meta: { name: '简体中文' },
  site: {
    documentTitle: 'AI驱动型非生产性Web技术研究所', eyebrow: 'AI-DRIVEN NON-PRODUCTIVE WEB TECHNOLOGY LAB.', officialLabel: '正式名称', officialName: 'AI驱动型非生产性Web技术研究所', tagline: '事情很无聊，实现密度却是生产级。', brandAlias: 'Muda Engineering Lab', languageLabel: '语言', bgmStart: '▶ BGM START', bgmStop: '■ BGM STOP',
    badges: ['🧪 研究主题10项', '🎮 禁止挂机通关', '🔊 最大输出・和弦音效', '🎉 全部通关时播放号角', '📦 CSS与各游戏JS分离'],
    aboutTitle: '关于本研究所',
    about: ['Muda Engineering Lab是一个讽刺网站，题材来自20世纪80年代至21世纪初部分日本办公室中曾出现的低效工作习惯。', '纸质文件、传真、Hanko印章、漫长会议和复杂的审批流程，都是当时许多办公室日常的一部分。', '本网站刻意夸张这些习惯，并全力运用现代Web技术，把“无用的工作”重现为游戏。', '当然，并非所有日本企业都以这种方式工作。本网站不是历史资料，而是一部以幽默方式回顾昔日企业文化的虚构讽刺作品。', '即使不了解当时的日本企业文化也没关系。每个游戏开始前，都会简要介绍启发该游戏的工作文化。'],
    back: '← 返回研究列表', controlsPrefix: '操作：', researchNo: 'RESEARCH No.{number}'
  },
  common: { cultureNote: '🧪 文化研究记录 No.{number}', parodyHeading: '这个游戏的讽刺重点', beginResearch: '开始研究', researchComplete: 'RESEARCH COMPLETE', researchCompleteJa: '研究完成', researchSuccess: '研究成功', researchFailed: 'RESEARCH FAILED', researchFailedJa: '研究失败', promptLabel: '最初向AI提出的要求', disclaimer: '本程序通过与AI对话制作，运行时不使用外部AI API。', retry: '再次研究', retryFail: '重新挑战' },
  game01: {
    title: '生产环境 绝对别按.exe', description: '无视8重警告，最后完成紧急ROLLBACK。', controls: '点击 / 轻触',
    culture: { heading: '当时的企业IT文化', background: ['20世纪80年代至21世纪初，企业IT系统的开发和运维环境不像今天这样高度自动化。变更生产环境风险很大，恢复工作往往依赖熟悉系统的工程师。', '尤其在负责人下班后，或周末前的周五傍晚变更生产环境，一旦发生故障却无人能够恢复，是IT工程师典型的噩梦场景。'], parody: ['警告、时间、负责人不在、变更申请尚未批准……这个游戏夸张重现无视所有危险信号、直接冲向生产环境的工程师。', '即使部署成功，也不能过早放心。'], punchline: '真正的研究从这里才开始。' },
    playing: { doNotPress: '绝对别按', warnings: ['部署到生产环境', '确定要按吗？', '今天是星期五', '现在时间 17:48', '负责人已经下班', '监控人员也已经下班', '变更申请尚未批准', '仍然部署到生产环境'], warningHeadings: ['别按', '算了吧', '真的吗？', '今天周五', '下班吧', '无负责人', '尚未批准'], toldNotTo: '※ 已经明确告诉你别按。', warningToast: '警告 {count}/8', passed: '突破确认 {count}/8', deploy: 'DEPLOY!!!', deploySuccess: 'DEPLOY SUCCESS', thought: '……你以为成功了？', monitoring: '监控警报 9999+', emergencyRollback: '紧急 ROLLBACK {count}/6', rollback: 'ROLLBACK {count}/6', rollbackHelp: '按6次恢复变更' },
    clear: '生产环境已恢复。原因是“一时冲动”。', prompt: '制作一个越被警告别按、越让人想按的生产环境部署按钮。最后连ROLLBACK也要做成游戏。'
  },
  game02: {
    title: '准点下班 DEFENSE', description: '在3条路线间移动，躲避领导和通知12次后逃出办公室。', controls: '↑ ↓ / 轻触',
    culture: { heading: '当时的企业文化', background: ['20世纪80年代至21世纪初，许多日本企业中长时间工作并不少见。即使已经下班，当领导和同事仍在工作时，有些职场也会让人觉得难以先离开。', '正准备回家时，领导可能突然问“有空吗？”或说“只要五分钟”，接着便开始新的工作或会议。', '20世纪90年代以后，电子邮件和即时消息逐渐普及，也增加了下班前仍会收到工作联系的新理由。'], parody: ['阻止准点下班的领导、邮件、评审请求和消息通知，全都变成迎面而来的障碍物。', '躲避12次，安全逃出办公室。'], punchline: '下班时间是要遵守的。大概吧。' },
    playing: { hud: '躲避 {dodges} / 12　HP {hp}', instruction: '按 ↑ ↓ 或轻触画面上方 / 下方切换路线', obstacles: ['领导：“有空吗？”', '消息 99+', '紧急邮件', '只确认5分钟', '参加交流会吗？', '麻烦帮忙评审'], dodge: 'DODGE {count}/12' },
    clear: '准点下班成功！……消息还在不断传来。', failure: '被领导拦住了。“只确认一件事”现在开始。', prompt: '下班时间一到，就在3条路线中躲避“有空吗？”。以成功躲避次数通关，而且不能挂机通关。'
  },
  game03: {
    title: 'RINGI HANKO IMPACT', description: '按顺序在20个发光的审批栏盖章。', controls: '拖动 / 点击',
    culture: { heading: '日本的RINGI与HANKO审批文化', background: ['Ringi（禀议）是把提案或申请文件传阅给相关人员以获得批准的日本制度。Hanko是用于表示批准的印章。'], parody: ['本游戏以购买980日元（¥980）的USB数据线也需要20个审批章，极度夸张日本企业的多级审批制度。', '在黄色目标栏盖上Hanko，完成20次审批。'], punchline: 'HANKO COMBO把日常审批流程变成必杀技。' },
    playing: { documentTitle: '物品采购 RINGI 申请书', request: '申请内容：USB数据线 ¥980', approval: '审批 {count} / 20', stampLabel: 'Hanko审批印章', stamp: '承', hint: '把Hanko拖到发光的审批栏，或直接点击目标栏盖章。', names: ['主管', '科长', '部门经理', '总部负责人', '财务', '法务', '信息系统', '审计', '行政总务', '采购', '信息安全', 'PMO', '质量保证', '事业部', '管理部', '人力资源', '高管', '神秘部门', '相关部门', '最终审批'], wrongOrder: '审批顺序错误', combo: 'HANKO COMBO ×{count}' },
    clear: '审批完成：现在终于可以买¥980的USB数据线。', prompt: '制作一个只需依次在巨大禀议书上盖满Hanko，却有如必杀技般华丽演出的游戏。'
  },
  game04: {
    title: '无限故障响应', description: '在SLA耗尽前恢复25起故障。', controls: '点击 / 轻触',
    culture: { heading: '企业IT故障响应文化', background: ['企业IT运维中常见故障响应、SLA、原因不明、无法复现，以及只有特定人员了解系统等问题。'], parody: ['本游戏把这些情况夸张成高速点击游戏；未解决的故障越多，SLA下降得越快。请恢复25起故障。'], punchline: '即使找不到原因，故障也不会等人。' },
    playing: { hud: '已恢复 {done} / 25　SLA {sla}%', open: '未处理 {count} / 7', help: '点击红色故障进行恢复。最初5秒宽限结束后，未解决故障会使SLA快速下降。', grace: '初始响应宽限 {seconds}秒　现在就处理故障！', incidents: ['DB连接错误', '大概是DNS', '证书已过期', '昨天还能用', '在我的环境能运行', '无法复现', '原因：未知'], recover: 'RECOVER {count}/25' },
    clear: '原因确认：原本就是这样设计的。', failure: 'SLA 0%。故障报告开始编写。', prompt: '制作一个打地鼠式故障处理游戏：修复故障会产生更多故障，而未处理数量会降低SLA。'
  },
  game05: {
    title: '需求变更躲避游戏', description: '左右移动躲避20项需求变更，在被击中3次前发布。', controls: '← → / 轻触',
    culture: { heading: '开发过程中的需求变更', background: ['开发过程中，追加要求、需求变更和范围扩大可能会不断出现。'], parody: ['我们把开发途中突然追加的棘手要求变成掉落物。左右移动并躲避20项要求。'], punchline: '需求总是在发布前增长得最快。' },
    playing: { hud: '躲避 {dodges} / 20　HP {hp}', instruction: '按 ← → 或轻触画面左侧 / 右侧', changes: ['修改文案', '更改按钮位置', '也要支持手机', '考虑海外市场', '也能加上AI吗？', '还想换掉DB', '先全部重新评估'], avoid: 'AVOID {count}/20' },
    clear: '发布成功！……下一项需求变更已经送达。', failure: '被需求变更淹没了。SPRINT 2现在开始。', prompt: '让需求变更从整个画面落下，玩家左右移动躲避。每次成功躲避都会提高进度。'
  },
  game06: {
    title: 'Excel 方格纸 CRAFT', description: '只涂设计图指定的单元格，完成Excel城堡。', controls: '点击 / 轻触',
    culture: { heading: '日本的Excel方格纸文化', background: ['部分日本企业会细微调整Excel单元格的宽度和高度，像方格纸一样用来制作表单、设计图和文档版式。'], parody: ['按照设计图为Excel风格的单元格上色，完成指定的36格。涂错5次就会退回评审。'], punchline: '请在不合并单元格的情况下完成Excel城堡。' },
    playing: { hud: '正确 {ok} / {total}　涂错 {wrong} / 5', heading: 'Excel 方格纸 CRAFT：设计图', hint: '只把有标示边框的单元格涂成绿色。涂错5次就会退回。', cellLabel: '单元格 {x},{y}', cell: 'CELL {count}/{total}' },
    clear: 'Excel城堡竣工。现在禁止合并单元格。', failure: '偏离设计图。退回Excel专家评审。', prompt: '制作一个过度游戏化的挑战：按照Excel方格纸设计图给单元格上色，建造一座城堡。'
  },
  game07: {
    title: '进度100%生成器', description: '抵抗反复的修改要求，把进度推到100%。', controls: '连续点击',
    culture: { heading: '重视进度百分比的工作文化', background: ['有时比起实际工作成果，只有名为“进度百分比”的数字持续增加。'], parody: ['我们把它重现为连续点击按钮来生成进度的装置。抵抗大约每4秒一次的评审退回修改，把进度推到100%。'], punchline: '即使进度达到100%，也不保证真的存在工作成果。' },
    playing: { reviewIn: '距退回修改还有 {seconds}秒', generate: '生成进度', combo: 'COMBO ×{count}', hint: '连续点击以提高进度。每4秒会要求修改。', review: '要求修改！-{loss}%' },
    clear: '进度100%。未发现实际工作成果。', prompt: '制作一个点击就会前进，但定期因评审要求修改而降低进度的装置。'
  },
  game08: {
    title: 'Bug供养寺', description: '供养15只逃跑的Bug。逃走5只就失败。', controls: '点击 / 轻触',
    culture: { heading: '日本的供养文化', background: ['日本有一种名为Kuyō（供养）的文化，对完成使命的物品表示感谢，并以敬意送别。', '针供养和人偶供养等仪式，是向使用过的物品致谢后送别的代表例子。', '另一方面，在软件开发中，Bug是指程序中的缺陷。'], parody: ['因此Muda Engineering Lab决定不修复Bug，而是敲响佛教仪式使用的木制打击法器木鱼（Mokugyo），为它们举行供养。', '点击逃跑的Bug，送15只安息。', '被放置的Bug会逃往生产环境。逃走5只就会研究失败。'], punchline: '愿每个Bug都能安息。' },
    playing: { hud: '供养 {done} / 15　逃脱 {escaped} / 5', output: '木鱼输出 300%', production: '🚨 生产环境', instruction: '点击逃跑的🐛 Bug，送它们安息。', hint: '红色Bug正在逃往生产环境！', escaping: '🚨 正逃往生产环境', memorialized: '安息 {done}/15', prevented: '阻止逃脱！安息 {done}/15', escapeStart: '🚨 开始逃往生产环境！', escaped: '流入生产环境！逃脱 {escaped}/5' },
    clear: '所有Bug都已安息。另检测到1个新Bug。', failure: '5只Bug逃进生产环境。现在必须先响应故障，再谈供养。', prompt: '使用木鱼（Mokugyo）供养软件Bug。Bug会四处逃跑，每逃走一只就更接近研究失败。'
  },
  game09: {
    title: '会议逃脱模拟器', description: '在“还有其他事项吗？”的时机总共离开3次。', controls: '时机点击',
    culture: { heading: '当时的企业文化', background: ['20世纪80年代至21世纪初，日本企业经常通过多人会议共享信息并协调决策。', '漫长会议快结束时，主持人可能会问：“还有其他事项吗？”', '如果没有人发言，会议或许终于可以结束。', '但只要有人说“再补充一点”“关于这件事”或“简单同步一下”，新的讨论便可能开始。'], parody: ['“还有其他事项吗？”出现的短暂瞬间，就是逃脱机会。', '看准时机按下“离开”，总共成功3次。'], punchline: '会议看似结束的瞬间最危险。' },
    playing: { hud: '逃脱成功 {count} / 3', inProgress: '会议进行中……', roles: ['部门经理', 'PM', '开发', '你'], leave: '离开', instruction: '只有出现“还有其他事项吗？”时才能按。', lines: ['接下来是下一项议题', '再补充一点……', '关于这件事……', '简单同步一下……'], chance: '还有其他事项吗？', toast: 'ESCAPE CHANCE {count}/3', notOver: '还没结束' },
    clear: '成功逃离会议！“那就散会”真的存在。', prompt: '制作一个只有在短暂出现“还有其他事项吗？”时才能离开，而且必须成功3次的会议游戏。'
  },
  game10: {
    title: '生产服务器神社', description: '在发光区摇铃并连续成功7次，完成祈愿COMBO。', controls: '时机点击',
    culture: { heading: '日本的神社文化', background: ['日本有前往神道神社，为工作、考试、安全、健康和好运祈愿的文化。', '有些神社会在参拜前摇铃。御神签（Omikuji）可能出现“大吉（Daikichi）”等运势。', '对IT工程师而言，即使完成所有测试、评审和准备，部署生产环境仍然是紧张的时刻。'], parody: ['测试完成了。评审也完成了。', '现在只剩全力祈求生产环境平安无事。', '在发光的成功区摇铃，连续成功7次。'], punchline: '技术无法处理的最后1%，现在交给祈愿。' },
    playing: { hud: '祈愿 COMBO {count} / 7', waiting: '祈愿状态：等待中', lucky: '祈愿状态：吉兆', luckyZone: '在发光的吉兆区摇铃', instruction: '发光时立刻摇铃！', now: '就是现在！！！', ring: '🔔 摇铃', combo: '祈愿 COMBO ×{count}', premature: '祈愿太早了！' },
    clearTitle: '大吉（Daikichi）', clear: '部署成功率没有改变。', clearPunchline: '但心里踏实多了。', prompt: '在部署生产环境前，只在神社祈愿；并把配合发光时机摇铃做成一个时机游戏。'
  }
});
