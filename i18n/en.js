'use strict';

registerLocale('en', {
  meta: { name: 'English' },
  site: {
    documentTitle: 'AI-Driven Institute for Non-Productive Web Technology',
    eyebrow: 'AI-DRIVEN NON-PRODUCTIVE WEB TECHNOLOGY LAB.',
    officialLabel: 'OFFICIAL INSTITUTE NAME',
    officialName: 'AI-Driven Institute for Non-Productive Web Technology',
    tagline: 'Production-grade engineering for gloriously pointless ideas.',
    brandAlias: 'Muda Engineering Lab',
    languageLabel: 'Language',
    bgmStart: '▶ BGM START',
    bgmStop: '■ BGM STOP',
    badges: [
      '🧪 10 RESEARCH PROJECTS',
      '🎮 NO IDLE CLEARS',
      '🔊 MAXIMUM-OUTPUT CHORDS',
      '🎉 FULL-CLEAR FANFARE',
      '📦 SPLIT CSS & GAME JS'
    ],
    aboutTitle: 'About This Lab',
    about: [
      'Muda Engineering Lab is a parody site inspired by inefficient workplace practices found in many Japanese offices from the 1980s through the 2000s.',
      'Paper documents, fax machines, hanko seals, long meetings, and complicated approval processes were once common parts of office life.',
      'This site deliberately exaggerates those practices and recreates them as games using modern web technology — putting far too much engineering effort into wonderfully pointless work.',
      'Of course, not every Japanese company worked this way. This is not a historical documentary, but a fictional satire that looks back on old workplace culture with humor.',
      "No knowledge of Japanese corporate culture is required. Before each game begins, you'll get a short explanation of the workplace habit that inspired it."
    ],
    back: '← RESEARCH LIST',
    controlsPrefix: '',
    researchNo: 'RESEARCH No.{number}'
  },
  common: {
    cultureNote: '🧪 CULTURAL RESEARCH NOTE No.{number}',
    parodyHeading: 'WHAT THIS GAME PARODIES',
    beginResearch: 'BEGIN RESEARCH',
    researchComplete: 'RESEARCH COMPLETE',
    researchCompleteJa: 'RESEARCH COMPLETE',
    researchSuccess: 'RESEARCH COMPLETE',
    researchFailed: 'RESEARCH FAILED',
    researchFailedJa: 'RESEARCH FAILED',
    promptLabel: 'THE ORIGINAL REQUEST TO AI',
    disclaimer: 'This program was created through conversations with AI. No external AI API is used while it runs.',
    retry: 'RESEARCH AGAIN',
    retryFail: 'TRY AGAIN'
  },
  game01: {
    title: 'PRODUCTION — DO NOT PRESS.exe',
    description: 'Ignore all 8 warnings, then survive with an emergency rollback.',
    controls: 'CLICK / TAP',
    culture: {
      heading: 'THE OLD IT WORKPLACE',
      background: [
        'From the 1980s through the 2000s, corporate IT systems were far less automated than they are today. Production changes could be risky, and recovery often depended heavily on the engineers who knew the system.',
        'Making a production change late on a Friday — just as everyone responsible was about to leave for the weekend — became a classic nightmare scenario for IT engineers.'
      ],
      parody: [
        "The warnings are everywhere. It's Friday. It's late. The responsible engineer has gone home. The change request isn't even approved.",
        "Naturally, you're going to deploy anyway.",
        "And if the deployment succeeds, don't celebrate yet."
      ],
      punchline: 'The real experiment begins after that.'
    },
    playing: {
      doNotPress: 'DO NOT PRESS',
      warnings: ['DEPLOY TO PRODUCTION', 'Are you sure?', "It's Friday.", "It's 5:48 PM.", 'The responsible engineer has gone home.', 'The monitoring engineer has gone home too.', "The change request hasn't been approved.", 'DEPLOY ANYWAY'],
      warningHeadings: ["DON'T.", 'BAD IDEA.', 'SERIOUSLY?', "IT'S FRIDAY.", 'GO HOME.', "NOBODY'S IN CHARGE.", 'NOT APPROVED.'],
      toldNotTo: '※ You were specifically told not to press it.',
      warningToast: 'WARNING {count}/8',
      passed: 'CONFIRMATION {count}/8 BYPASSED',
      deploy: 'DEPLOY!!!',
      deploySuccess: 'DEPLOY SUCCESS',
      thought: '...OR SO YOU THOUGHT.',
      monitoring: 'MONITORING ALERT 9999+',
      emergencyRollback: 'EMERGENCY ROLLBACK {count}/6',
      rollback: 'ROLLBACK {count}/6',
      rollbackHelp: 'HIT IT 6 TIMES TO ROLL BACK'
    },
    clear: 'Production restored. Root cause: "We just went for it."',
    prompt: 'Create a production deploy button that becomes more tempting every time the user is told not to press it. Turn the final rollback into part of the game.'
  },
  game02: {
    title: 'ON-TIME ESCAPE DEFENSE',
    description: 'Switch between 3 lanes and dodge 12 after-hours obstacles.',
    controls: '↑ ↓ / TAP',
    culture: {
      heading: 'THE OLD OFFICE HABIT',
      background: [
        'From the 1980s through the 2000s, long working hours were common in many Japanese workplaces. Even when official working hours were over, employees could sometimes feel uncomfortable leaving while their managers and coworkers were still at their desks.',
        'And just when you were ready to go home, a manager might appear with the dreaded words: "Got a minute?"',
        'Five minutes could, of course, become much longer.',
        'From the 1990s onward, email and instant messaging added new ways for work to follow employees right up to the moment they tried to leave.'
      ],
      parody: [
        'Managers, urgent emails, review requests, and message notifications are now incoming obstacles.',
        'Dodge 12 of them and escape the office.'
      ],
      punchline: 'Leaving on time is the objective. Probably.'
    },
    playing: {
      hud: 'DODGED {dodges} / 12　HP {hp}',
      instruction: '↑ ↓ OR TAP THE UPPER / LOWER LANE',
      obstacles: ['BOSS: "Got a minute?"', '99+ MESSAGES', 'URGENT EMAIL', '"Just a 5-minute check."', '"Coming to the team dinner?"', '"Can you review this?"'],
      dodge: 'DODGE {count}/12'
    },
    clear: 'ESCAPED ON TIME! ...The messages are still coming.',
    failure: 'The boss caught you. “Just one quick thing...” has begun.',
    prompt: 'At quitting time, dodge “Got a minute?” across three lanes. Clear the game by successfully avoiding enough obstacles; idling must not work.'
  },
  game03: {
    title: 'RINGI HANKO IMPACT',
    description: 'Stamp 20 glowing approval boxes in the correct order.',
    controls: 'DRAG / CLICK',
    culture: {
      heading: 'THE RINGI AND HANKO APPROVAL SYSTEM',
      background: ['Ringi is a system in which a proposal or request is circulated among stakeholders for approval. A hanko is a seal used as an approval stamp.'],
      parody: [
        'This game wildly exaggerates multi-stage approval by requiring 20 stamps to purchase a 980-yen USB cable.',
        'Stamp each yellow target and complete all 20 approvals.'
      ],
      punchline: 'HANKO COMBO turns routine approval into a special move.'
    },
    playing: {
      documentTitle: 'RINGI PURCHASE REQUEST',
      request: 'REQUEST: USB CABLE — ¥980',
      approval: 'APPROVALS {count} / 20',
      stampLabel: 'Hanko approval stamp',
      stamp: '承',
      hint: 'Drag the hanko to the glowing box, or click the target box to stamp it.',
      names: ['SUPERVISOR', 'SECTION MGR', 'DEPT MGR', 'DIVISION MGR', 'FINANCE', 'LEGAL', 'CORP IT', 'AUDIT', 'GENERAL AFFAIRS', 'PURCHASING', 'SECURITY', 'PMO', 'QA', 'BUSINESS UNIT', 'ADMIN', 'HR', 'EXECUTIVE', 'MYSTERY DEPT', 'RELATED DEPT', 'FINAL APPROVAL'],
      wrongOrder: 'WRONG APPROVAL ORDER',
      combo: 'HANKO COMBO ×{count}'
    },
    clear: 'APPROVED: You may now purchase the ¥980 USB cable.',
    prompt: 'Create a game where the player does nothing but stamp a huge ringi approval form in order, with effects worthy of a special attack.'
  },
  game04: {
    title: 'INFINITE INCIDENT RESPONSE',
    description: 'Recover 25 incidents before the SLA runs out.',
    controls: 'CLICK / TAP',
    culture: {
      heading: 'THE CORPORATE IT INCIDENT',
      background: ['Corporate IT operations are full of familiar problems: incidents, SLAs, unknown causes, failures that cannot be reproduced, and systems understood by only one person.'],
      parody: ['This game exaggerates them as a high-speed clicker where unresolved incidents melt the SLA faster. Recover 25 incidents to finish the experiment.'],
      punchline: 'The incidents will not wait for a root cause.'
    },
    playing: {
      hud: 'RECOVERED {done} / 25　SLA {sla}%',
      open: 'OPEN {count} / 7',
      help: 'Click the red incidents to recover them. After a 5-second grace period, unresolved incidents melt the SLA.',
      grace: 'INITIAL RESPONSE: {seconds}s　HIT THE INCIDENTS NOW!',
      incidents: ['DB CONNECTION ERROR', "IT'S PROBABLY DNS", 'CERTIFICATE EXPIRED', 'IT WORKED YESTERDAY', 'WORKS ON MY MACHINE', 'CANNOT REPRODUCE', 'CAUSE: UNKNOWN'],
      recover: 'RECOVER {count}/25'
    },
    clear: 'Root cause identified: the specification.',
    failure: 'SLA 0%. Incident report preparation has begun.',
    prompt: 'Create a whack-a-mole incident game where fixing incidents creates more incidents and unresolved items reduce the SLA.'
  },
  game05: {
    title: 'SCOPE CHANGE DODGER',
    description: 'Dodge 20 scope changes before taking 3 hits, then release.',
    controls: '← → / TAP',
    culture: {
      heading: 'MID-DEVELOPMENT SCOPE CHANGES',
      background: ['New requests, specification changes, and scope expansion can keep arriving while development is already underway.'],
      parody: ['Sudden, inconvenient requests become falling obstacles. Move left and right and dodge 20 of them.'],
      punchline: 'Requirements grow fastest just before release.'
    },
    playing: {
      hud: 'DODGED {dodges} / 20　HP {hp}',
      instruction: '← → OR TAP THE LEFT / RIGHT SIDE',
      changes: ['TWEAK THE WORDING', 'MOVE THE BUTTON', 'ADD MOBILE SUPPORT', 'PLAN FOR GLOBAL LAUNCH', 'CAN WE ADD AI?', 'CHANGE THE DATABASE TOO', 'RETHINK EVERYTHING'],
      avoid: 'AVOID {count}/20'
    },
    clear: 'RELEASE SUCCESSFUL! ...The next scope change has arrived.',
    failure: 'Buried under scope changes. SPRINT 2 is now beginning.',
    prompt: 'Make scope changes fall across the full screen while the player moves left and right to dodge them. Progress rises with each successful dodge.'
  },
  game06: {
    title: 'EXCEL GRID-PAPER CRAFT',
    description: 'Color only the blueprint cells and complete the Excel castle.',
    controls: 'CLICK / TAP',
    culture: {
      heading: 'THE JAPANESE EXCEL GRID-PAPER HABIT',
      background: ['Some Japanese offices use Excel not for calculations, but as “grid paper”: cells are carefully resized to create forms, blueprints, and document layouts.'],
      parody: ['Color the Excel-style cells according to the blueprint and complete all 36 required cells. Five incorrect cells send the work back for review.'],
      punchline: 'Complete the Excel castle without merging cells.'
    },
    playing: {
      hud: 'CORRECT {ok} / {total}　WRONG {wrong} / 5',
      heading: 'EXCEL GRID-PAPER CRAFT: BLUEPRINT',
      hint: 'Turn only the outlined cells green. Five incorrect cells trigger a review.',
      cellLabel: 'Cell {x},{y}',
      cell: 'CELL {count}/{total}'
    },
    clear: 'Excel castle complete. Cell merging has been prohibited.',
    failure: 'Blueprint deviation detected. Returned for review by an Excel expert.',
    prompt: 'Make a ridiculously game-like challenge where the player colors cells according to an Excel grid-paper blueprint to build a castle.'
  },
  game07: {
    title: '100% PROGRESS GENERATOR',
    description: 'Push progress to 100% despite repeated review returns.',
    controls: 'RAPID CLICK / TAP',
    culture: {
      heading: 'THE PROGRESS-PERCENTAGE HABIT',
      background: ['Sometimes the progress percentage keeps rising even when the substance of the work is difficult to find.'],
      parody: ['This device generates progress through rapid clicking. Reach 100% despite changes being requested about every four seconds.'],
      punchline: 'A 100% progress figure does not guarantee that any work exists.'
    },
    playing: {
      reviewIn: 'CHANGES REQUESTED IN {seconds}s',
      generate: 'GENERATE PROGRESS',
      combo: 'COMBO ×{count}',
      hint: 'Click rapidly to advance. Changes are requested every 4 seconds.',
      review: 'CHANGES REQUESTED! -{loss}%'
    },
    clear: 'PROGRESS: 100%. No evidence of actual work was found.',
    prompt: 'Create a progress button that moves forward when clicked but periodically loses progress when changes are requested.'
  },
  game08: {
    title: 'BUG MEMORIAL TEMPLE',
    description: 'Lay 15 bugs to rest. Let 5 escape and you fail.',
    controls: 'CLICK / TAP',
    culture: {
      heading: 'THE JAPANESE TRADITION',
      background: [
        'In Japan, kuyō is a tradition of honoring and memorializing things that have reached the end of their useful life.',
        'Ceremonies exist for objects such as old needles and dolls, expressing gratitude before they are laid to rest.',
        'In software development, of course, a "bug" means a defect in a program.'
      ],
      parody: [
        'At Muda Engineering Lab, we have decided not to fix our software bugs.',
        'We will give them a proper memorial instead.',
        'Click the escaping bugs and lay 15 of them to rest.',
        'Let five escape into production, and the experiment fails.'
      ],
      punchline: 'May every bug rest in peace.'
    },
    playing: {
      hud: 'MEMORIALIZED {done} / 15　ESCAPED {escaped} / 5',
      output: 'MOKUGYO OUTPUT 300%',
      production: '🚨 PRODUCTION',
      instruction: 'Click the 🐛 bugs and send them peacefully onward.',
      hint: 'Red bugs are escaping to production!',
      escaping: '🚨 ESCAPING TO PRODUCTION',
      memorialized: 'REST IN PEACE {done}/15',
      prevented: 'ESCAPE PREVENTED! REST IN PEACE {done}/15',
      escapeStart: '🚨 ESCAPING TO PRODUCTION!',
      escaped: 'PRODUCTION ESCAPE! {escaped}/5'
    },
    clear: 'All bugs have been laid to rest. One new bug has been detected.',
    failure: 'Five bugs escaped into production. Incident response now takes priority over memorial services.',
    prompt: 'Memorialize software bugs with a mokugyo. The bugs run away, and every escape brings the experiment closer to failure.'
  },
  game09: {
    title: 'MEETING ESCAPE SIMULATOR',
    description: 'Escape during the "Anything else?" window 3 times.',
    controls: 'TIMING CLICK / TAP',
    culture: {
      heading: 'THE OLD OFFICE HABIT',
      background: [
        'From the 1980s through the 2000s, meetings were a common way for Japanese companies to share information and coordinate decisions among many participants.',
        'Near the end of a long meeting, the chair might ask:',
        '"Anything else?"',
        'If nobody answers, the meeting may finally end.',
        'But then someone says:',
        '"Just one more thing..." “Actually, related to that...” “Just a quick update...”',
        'And the meeting continues.'
      ],
      parody: [
        'The moment you see "Anything else?" is your escape window.',
        'Hit LEAVE at exactly the right time. Escape three times to complete the experiment.'
      ],
      punchline: 'A meeting is most dangerous when it looks finished.'
    },
    playing: {
      hud: 'ESCAPES {count} / 3',
      inProgress: 'MEETING IN PROGRESS...',
      roles: ['DEPARTMENT MANAGER', 'PM', 'DEVELOPER', 'YOU'],
      leave: 'LEAVE',
      instruction: 'Press only when you see "Anything else?"',
      lines: ['NEXT ITEM...', 'JUST ONE MORE THING...', 'ACTUALLY, RELATED TO THAT...', 'JUST A QUICK UPDATE...'],
      chance: 'ANYTHING ELSE?',
      toast: 'ESCAPE CHANCE {count}/3',
      notOver: 'NOT OVER YET'
    },
    clear: 'MEETING ESCAPE SUCCESSFUL! “Okay, let’s wrap up.” was actually real.',
    prompt: 'Create a meeting game where the player can escape only during the brief “Anything else?” window and must succeed three times.'
  },
  game10: {
    title: 'PRODUCTION SERVER SHRINE',
    description: 'Ring the bell in the glowing zone 7 times in a row.',
    controls: 'TIMING CLICK / TAP',
    culture: {
      heading: 'THE JAPANESE TRADITION',
      background: [
        'In Japan, people visit Shinto shrines to pray for things such as success, safety, health, and good fortune.',
        'At some shrines, visitors ring a bell before praying. Omikuji fortune slips may also give results such as Daikichi — Great Blessing.',
        'For IT engineers, a production deployment can still feel stressful even after all the testing, reviews, and preparation are complete.'
      ],
      parody: [
        'Testing is done. Reviews are done.',
        'Now all that remains is to pray that production survives.',
        'Ring the bell inside the success zone seven times in a row.'
      ],
      punchline: 'The final 1% of reliability will now be handled by prayer.'
    },
    playing: {
      hud: 'PRAYER COMBO {count} / 7',
      waiting: 'PRAYER STATUS: WAITING',
      lucky: 'PRAYER STATUS: LUCKY',
      luckyZone: 'RING THE BELL IN THE LUCKY ZONE',
      instruction: 'RING THE BELL WHEN IT GLOWS!',
      now: 'NOW!!!',
      ring: '🔔 RING THE BELL',
      combo: 'PRAYER COMBO ×{count}',
      premature: 'PREMATURE PRAYER!'
    },
    clearTitle: 'DAIKICHI — GREAT BLESSING',
    clear: 'Deployment success probability remains unchanged.',
    clearPunchline: 'But you feel much better now.',
    prompt: 'Before deploying to production, do nothing but pray at a shrine. Turn ringing the bell in the glowing zone into a timing game.'
  }
});
