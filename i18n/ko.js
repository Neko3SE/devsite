'use strict';

registerLocale('ko', {
  meta: { name: '한국어' },
  site: {
    documentTitle: 'AI 기반 비생산적 웹 기술 연구소', eyebrow: 'AI-DRIVEN NON-PRODUCTIVE WEB TECHNOLOGY LAB.', officialLabel: '공식 명칭', officialName: 'AI 기반 비생산적 웹 기술 연구소', tagline: '쓸데없는 일인데, 구현 밀도만큼은 운영급.', brandAlias: 'Muda Engineering Lab', languageLabel: '언어', bgmStart: '▶ BGM START', bgmStop: '■ BGM STOP',
    badges: ['🧪 연구 주제 10건', '🎮 방치 클리어 금지', '🔊 최대 출력 화음 사운드', '🎉 전체 클리어 팡파르', '📦 CSS·게임별 JS 분리'],
    aboutTitle: '이 연구소에 대하여',
    about: ['Muda Engineering Lab은 1980년대부터 2000년대까지 일부 일본 사무실에서 볼 수 있었던 비효율적인 업무 관행을 소재로 한 패러디 사이트입니다.', '종이 문서, 팩스, 한코 도장, 긴 회의, 복잡한 승인 절차 등 당시 일본 사무실에는 오늘날과 다른 여러 업무 방식이 있었습니다.', '이 사이트는 그런 관행을 의도적으로 과장하고 현대 웹 기술을 총동원해 쓸데없는 일을 게임으로 재현합니다.', '물론 모든 일본 기업이 이런 방식으로 일한 것은 아닙니다. 이 사이트는 역사 자료가 아니라 과거의 기업 문화를 유머로 돌아보는 허구의 풍자 작품입니다.', '당시 일본 기업 문화를 몰라도 괜찮습니다. 각 게임을 시작하기 전에 소재가 된 업무 문화를 간단히 설명합니다.'],
    back: '← 연구 목록으로', controlsPrefix: '조작: ', researchNo: 'RESEARCH No.{number}'
  },
  common: { cultureNote: '🧪 문화 연구 기록 No.{number}', parodyHeading: '이 게임의 풍자 포인트', beginResearch: '연구 시작', researchComplete: 'RESEARCH COMPLETE', researchCompleteJa: '연구 완료', researchSuccess: '연구 성공', researchFailed: 'RESEARCH FAILED', researchFailedJa: '연구 실패', promptLabel: '처음 AI에 요청한 내용', disclaimer: '이 프로그램은 AI와의 대화를 통해 제작되었습니다. 실행 중 외부 AI API를 사용하지 않습니다.', retry: '다시 연구하기', retryFail: '재도전' },
  game01: {
    title: '운영 환경 절대 누르지 마.exe', description: '8단계 경고를 무시한 뒤 긴급 롤백에 성공하라.', controls: '클릭 / 탭',
    culture: { heading: '당시의 기업 IT 문화', background: ['1980년대부터 2000년대까지 기업 IT 시스템은 오늘날만큼 개발·운영 환경이 자동화되지 않았습니다. 운영 환경 변경에는 큰 위험이 따랐고, 복구는 시스템을 잘 아는 엔지니어에게 의존하기도 했습니다.', '특히 담당자가 퇴근한 뒤나 주말 직전인 금요일 저녁에 운영 환경을 변경했다가 장애가 발생하면 복구할 사람이 없는 상황은 IT 엔지니어가 두려워하는 전형적인 사례였습니다.'], parody: ['경고, 늦은 시간, 담당자 부재, 미승인 변경 신청까지 모든 위험 신호를 무시하고 운영 환경에 돌진하는 엔지니어를 과장했습니다.', '배포에 성공해도 아직 안심해서는 안 됩니다.'], punchline: '진짜 연구는 그때부터 시작됩니다.' },
    playing: { doNotPress: '절대 누르지 마', warnings: ['운영 환경에 배포', '정말 누르시겠습니까?', '오늘은 금요일입니다', '현재 시각 17:48', '담당자는 퇴근했습니다', '모니터링 담당자도 퇴근했습니다', '변경 신청은 승인되지 않았습니다', '그래도 운영 환경에 배포'], warningHeadings: ['누르지 마', '그만둬', '정말?', '금요일이야', '퇴근해', '책임자 없음', '승인 안 됨'], toldNotTo: '※ 누르지 말라고 분명히 경고했습니다.', warningToast: '경고 {count}/8', passed: '확인 {count}/8 돌파', deploy: 'DEPLOY!!!', deploySuccess: 'DEPLOY SUCCESS', thought: '……성공한 줄 알았어?', monitoring: '모니터링 알림 9999+', emergencyRollback: '긴급 ROLLBACK {count}/6', rollback: 'ROLLBACK {count}/6', rollbackHelp: '6번 눌러서 되돌려라' },
    clear: '운영 환경 복구 완료. 원인은 “기세로 눌렀기 때문”이었습니다.', prompt: '누르지 말라고 할수록 더 누르고 싶어지는 운영 환경 배포 버튼을 만들어 줘. 마지막 롤백까지 게임으로 만들어 줘.'
  },
  game02: {
    title: '정시 퇴근 DEFENSE', description: '3개 레인을 오가며 상사와 알림을 12번 피하고 출구로 향하라.', controls: '↑ ↓ / 탭',
    culture: { heading: '당시의 기업 문화', background: ['1980년대부터 2000년대까지 많은 일본 기업에서는 장시간 근무가 드물지 않았습니다. 정해진 근무 시간이 끝나도 상사와 동료가 일하고 있으면 먼저 퇴근하기 어려운 직장도 있었습니다.', '겨우 집에 가려는 순간 상사가 “잠깐 시간 돼?” 또는 “5분만”이라고 부르면 새로운 일이나 회의가 시작되기도 했습니다.', '1990년대 이후 이메일과 인스턴트 메시지가 보급되면서 퇴근 직전까지 업무 연락이 오는 새로운 이유도 생겼습니다.'], parody: ['정시 퇴근을 막는 상사, 이메일, 리뷰 요청, 메시지 알림이 모두 장애물로 다가옵니다.', '12번 피하고 무사히 회사를 탈출하세요.'], punchline: '정시는 지켜야 하는 것입니다. 아마도요.' },
    playing: { hud: '회피 {dodges} / 12　HP {hp}', instruction: '↑ ↓ 또는 화면 위쪽 / 아래쪽을 탭해 레인 이동', obstacles: ['상사 “잠깐 시간 돼?”', '메시지 99+', '긴급 메일', '5분만 확인', '팀 모임 어때?', '리뷰 부탁해'], dodge: 'DODGE {count}/12' },
    clear: '정시 퇴근 성공! ……메시지는 아직도 오고 있습니다.', failure: '상사에게 붙잡혔습니다. “한 가지만 확인하자”가 시작됩니다.', prompt: '퇴근 시간이 되면 3개 레인에서 “잠깐 시간 돼?”를 피하고, 회피 성공 횟수로 클리어하는 게임을 만들어 줘. 방치해서는 클리어할 수 없어야 해.'
  },
  game03: {
    title: 'RINGI HANKO IMPACT', description: '빛나는 승인 칸 20개에 정해진 순서대로 도장을 찍어라.', controls: '드래그 / 클릭',
    culture: { heading: '일본의 RINGI·HANKO 승인 문화', background: ['Ringi(린기)는 제안서나 신청서를 관계자에게 돌려 승인을 받는 일본식 회람 제도입니다. Hanko(한코)는 승인 표시로 사용하는 인장입니다.'], parody: ['980엔(¥980)짜리 USB 케이블을 사기 위해 승인 도장 20개가 필요하다는 설정으로 일본 기업의 다단계 승인을 극단적으로 과장했습니다.', '노란 대상 칸에 한코를 찍어 20단계 승인을 완료하세요.'], punchline: 'HANKO COMBO로 평범한 승인 절차를 필살기로 만듭니다.' },
    playing: { documentTitle: '물품 구매 RINGI 품의서', request: '신청 내용: USB 케이블 ¥980', approval: '승인 {count} / 20', stampLabel: 'Hanko 승인 도장', stamp: '承', hint: '한코를 빛나는 승인 칸으로 드래그하거나 대상 칸을 클릭하세요.', names: ['주임', '과장', '부장', '본부장', '회계', '법무', '사내 IT', '감사', '총무', '구매', '보안', 'PMO', '품질보증', '사업부', '관리부', '인사', '임원', '수수께끼 부서', '관계 부서', '최종 승인'], wrongOrder: '승인 순서가 다릅니다', combo: 'HANKO COMBO ×{count}' },
    clear: '승인 완료: 이제 ¥980짜리 USB 케이블을 구매할 수 있습니다.', prompt: '거대한 Ringi 문서에 수많은 Hanko를 순서대로 찍기만 하는데도 필살기 같은 연출이 나오는 게임을 만들어 줘.'
  },
  game04: {
    title: '무한 장애 대응', description: 'SLA가 바닥나기 전에 장애 25건을 복구하라.', controls: '클릭 / 탭',
    culture: { heading: '기업 IT 장애 대응 문화', background: ['기업 IT 운영에는 장애 대응, SLA, 원인 불명, 재현 불가, 특정 담당자만 아는 시스템 등 여러 익숙한 문제가 있습니다.'], parody: ['미해결 장애가 늘어날수록 SLA가 더 빨리 떨어지는 고속 클릭 게임으로 과장했습니다. 25건을 복구하세요.'], punchline: '원인을 몰라도 장애는 기다려 주지 않습니다.' },
    playing: { hud: '복구 {done} / 25　SLA {sla}%', open: '미처리 {count} / 7', help: '빨간 장애를 클릭해 복구하세요. 5초의 초기 유예가 끝나면 미해결 장애 때문에 SLA가 녹아내립니다.', grace: '초기 대응 유예 {seconds}초　지금 장애를 클릭하세요!', incidents: ['DB 연결 오류', '아마 DNS 문제', '인증서 만료', '어제까지 됐는데', '내 환경에서는 되는데', '재현 안 됨', '원인: 불명'], recover: 'RECOVER {count}/25' },
    clear: '원인 확인: 원래 그런 사양입니다.', failure: 'SLA 0%. 장애 보고서 작성이 시작됩니다.', prompt: '장애를 고칠수록 새 장애가 늘어나고 미처리 건수에 따라 SLA가 줄어드는 두더지 잡기형 게임을 만들어 줘.'
  },
  game05: {
    title: '사양 변경 피하기', description: '사양 변경 20건을 피하고 3번 맞기 전에 릴리스하라.', controls: '← → / 탭',
    culture: { heading: '개발 현장의 사양 변경', background: ['개발 중에는 추가 요구, 사양 변경, 범위 확대가 계속 들어올 수 있습니다.'], parody: ['개발 도중 갑자기 추가되는 까다로운 요구를 떨어지는 장애물로 만들었습니다. 좌우로 이동해 20건을 피하세요.'], punchline: '사양은 릴리스 직전에 가장 잘 늘어납니다.' },
    playing: { hud: '회피 {dodges} / 20　HP {hp}', instruction: '← → 또는 화면 왼쪽 / 오른쪽을 탭', changes: ['문구 수정', '버튼 위치 변경', '모바일도 지원', '해외 전개도 고려', 'AI도 넣을 수 없나요?', 'DB도 바꾸고 싶어요', '일단 전부 재검토'], avoid: 'AVOID {count}/20' },
    clear: '릴리스 성공! ……다음 사양 변경이 도착했습니다.', failure: '사양 변경에 파묻혔습니다. SPRINT 2가 시작됩니다.', prompt: '사양 변경이 화면 전체에서 떨어지고 플레이어가 좌우로 피하는 게임을 만들어 줘. 성공적으로 피할 때마다 진행률이 올라가게 해.'
  },
  game06: {
    title: 'Excel 모눈종이 CRAFT', description: '설계도에 표시된 셀만 칠해 Excel 성을 완성하라.', controls: '클릭 / 탭',
    culture: { heading: '일본의 Excel 모눈종이 문화', background: ['일부 일본 기업에서는 Excel의 셀 너비와 높이를 세밀하게 조절해 서식, 설계도, 문서 레이아웃을 만드는 “Excel 모눈종이” 사용법이 있습니다.'], parody: ['설계도대로 Excel형 셀을 칠해 필요한 36개를 완성하는 크래프트 게임입니다. 5번 잘못 칠하면 리뷰로 되돌아갑니다.'], punchline: '셀 병합 없이 Excel 성을 완공하세요.' },
    playing: { hud: '정답 {ok} / {total}　오류 {wrong} / 5', heading: 'Excel 모눈종이 CRAFT: 설계도', hint: '테두리가 표시된 셀만 초록색으로 칠하세요. 5번 틀리면 리뷰로 되돌아갑니다.', cellLabel: '셀 {x},{y}', cell: 'CELL {count}/{total}' },
    clear: 'Excel 성 완공. 이제 셀 병합은 금지되었습니다.', failure: '설계도 이탈. Excel 전문가 리뷰로 되돌아갑니다.', prompt: 'Excel 모눈종이 설계도에 맞춰 셀을 칠해 성을 완성하는, 쓸데없이 게임 같은 도전을 만들어 줘.'
  },
  game07: {
    title: '진척도 100% 생성기', description: '반복되는 수정 요청을 이겨 내고 진척도를 100%까지 올려라.', controls: '연속 클릭 / 탭',
    culture: { heading: '진척률을 중시하는 업무 문화', background: ['일의 실제 성과보다 “진척률”이라는 숫자만 계속 늘어나는 상태가 있습니다.'], parody: ['버튼을 연속으로 눌러 진척도를 생성하는 장치로 재현했습니다. 약 4초마다 오는 리뷰 수정 요청을 이겨 내고 100%까지 올리세요.'], punchline: '진척도가 100%여도 실제 작업 결과가 존재한다는 보장은 없습니다.' },
    playing: { reviewIn: '수정 요청까지 {seconds}초', generate: '진척도 생성', combo: 'COMBO ×{count}', hint: '연속으로 눌러 진행하세요. 4초마다 수정 요청이 옵니다.', review: '수정 요청! -{loss}%' },
    clear: '진척도 100%. 실제 작업 결과는 확인되지 않았습니다.', prompt: '누르면 진척도가 올라가지만 리뷰 수정 요청이 오면 정기적으로 줄어드는 장치를 만들어 줘.'
  },
  game08: {
    title: '버그 추모 사찰', description: '도망치는 버그 15개를 편히 보내세요. 5개가 탈출하면 실패합니다.', controls: '클릭 / 탭',
    culture: { heading: '일본의 KUYŌ 문화', background: ['일본에는 역할을 다한 물건에 감사하고 존중하며 보내는 Kuyō(쿠요) 문화가 있습니다.', '사용한 바늘과 인형 등을 기리는 행사도 대표적인 예입니다.', '한편 소프트웨어 개발에서 버그는 프로그램의 결함을 뜻합니다.'], parody: ['Muda Engineering Lab에서는 불교 의식에 쓰이는 나무 타악기 Mokugyo(목탁)를 울리며 버그를 수정하는 대신 쿠요로 편히 보내기로 했습니다.', '도망치는 버그를 클릭해 15개를 보내세요.', '방치된 버그는 운영 환경으로 탈출합니다. 5개를 놓치면 연구 실패입니다.'], punchline: '모든 버그가 평안히 떠나기를.' },
    playing: { hud: '추모 {done} / 15　탈출 {escaped} / 5', output: 'MOKUGYO 출력 300%', production: '🚨 운영 환경', instruction: '도망치는 🐛 버그를 클릭해 편히 보내세요.', hint: '빨간 버그는 운영 환경으로 탈출 중입니다!', escaping: '🚨 운영 환경으로 탈출 중', memorialized: '편히 보냄 {done}/15', prevented: '탈출 저지! 편히 보냄 {done}/15', escapeStart: '🚨 운영 환경으로 탈출 시작!', escaped: '운영 환경 유출! 탈출 {escaped}/5' },
    clear: '모든 버그를 편히 보냈습니다. 새 버그 1건이 발견되었습니다.', failure: '버그 5개가 운영 환경으로 탈출했습니다. 추모보다 장애 대응이 먼저입니다.', prompt: '목탁인 Mokugyo로 소프트웨어 버그를 기리세요. 버그는 도망치며 놓칠 때마다 연구 실패에 가까워지는 게임을 만들어 줘.'
  },
  game09: {
    title: '회의 탈출 시뮬레이터', description: '“다른 의견 있습니까?” 구간에서 총 3번 퇴실하라.', controls: '타이밍 클릭 / 탭',
    culture: { heading: '당시의 기업 문화', background: ['1980년대부터 2000년대까지 일본 기업에서는 여러 관계자가 모여 정보를 공유하고 의사 결정을 조율하는 회의가 자주 열렸습니다.', '긴 회의가 끝날 무렵 진행자가 “다른 의견 있습니까?”라고 묻곤 했습니다.', '아무도 말하지 않으면 회의가 끝날 수 있습니다.', '하지만 누군가 “한 가지만 더”, “그 얘기와 관련해서”, “간단히 공유드리면”이라고 시작하면 새로운 논의가 이어지기도 합니다.'], parody: ['“다른 의견 있습니까?”가 표시되는 짧은 순간만이 탈출 기회입니다.', '타이밍을 맞춰 퇴실을 누르고 총 3번 성공하세요.'], punchline: '회의는 끝났다고 생각한 순간이 가장 위험합니다.' },
    playing: { hud: '탈출 성공 {count} / 3', inProgress: '회의 중...', roles: ['부장', 'PM', '개발', '당신'], leave: '퇴실', instruction: '“다른 의견 있습니까?”가 나올 때만 누르세요.', lines: ['그럼 다음 안건입니다', '한 가지만 더...', '그 얘기와 관련해서...', '간단히 공유드리면...'], chance: '다른 의견 있습니까?', toast: 'ESCAPE CHANCE {count}/3', notOver: '아직 끝나지 않았습니다' },
    clear: '회의 탈출 성공! “그럼 마치겠습니다”는 실제로 존재했습니다.', prompt: '“다른 의견 있습니까?”가 표시되는 짧은 순간에만 탈출할 수 있고 총 3번 성공해야 하는 회의 게임을 만들어 줘.'
  },
  game10: {
    title: '운영 서버 신사', description: '빛나는 구간에서 종을 7번 연속 울려 기원 콤보를 완성하라.', controls: '타이밍 클릭 / 탭',
    culture: { heading: '일본의 신사 문화', background: ['일본에서는 신사(神社)를 찾아 일, 시험, 안전, 건강, 행운 등을 기원하는 문화가 있습니다.', '일부 신사에서는 참배하기 전에 종을 울립니다. 오미쿠지 운세에서는 다이키치(大吉), 즉 최고의 길운 같은 결과가 나옵니다.', 'IT 엔지니어에게 운영 환경 배포는 테스트와 리뷰, 준비를 모두 마쳐도 긴장되는 순간입니다.'], parody: ['테스트가 끝났습니다. 리뷰도 끝났습니다.', '이제 운영 환경이 무사하기를 전력으로 기원할 뿐입니다.', '빛나는 성공 구간에서 종을 7번 연속 울리세요.'], punchline: '기술로 해결할 수 없는 마지막 1%는 기원에 맡깁니다.' },
    playing: { hud: '기원 COMBO {count} / 7', waiting: '기원 상태: 대기', lucky: '기원 상태: 길조', luckyZone: '빛나는 길조 구간에서 종을 울리세요', instruction: '빛나는 순간 종을 울리세요!', now: '지금!!!', ring: '🔔 종 울리기', combo: '기원 COMBO ×{count}', premature: '너무 이른 기원!' },
    clearTitle: '다이키치(大吉) — 최고의 길운', clear: '배포 성공 확률은 바뀌지 않았습니다.', clearPunchline: '하지만 마음은 한결 편해졌습니다.', prompt: '운영 환경에 배포하기 전에 신사에서 기원하기만 하되, 빛나는 구간에 맞춰 종을 울리는 타이밍 게임으로 만들어 줘.'
  }
});
