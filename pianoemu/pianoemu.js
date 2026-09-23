(() => {
  'use strict';

  const WHITE_NOTES = [
    ['C4','ド4'],['D4','レ4'],['E4','ミ4'],['F4','ファ4'],['G4','ソ4'],['A4','ラ4'],['B4','シ4'],
    ['C5','ド5'],['D5','レ5'],['E5','ミ5'],['F5','ファ5'],['G5','ソ5'],['A5','ラ5'],['B5','シ5'],['C6','ド6']
  ];
  const BLACK_NOTES = [
    {note:'C#4', after:0},{note:'D#4', after:1},{note:'F#4', after:3},{note:'G#4', after:4},{note:'A#4', after:5},
    {note:'C#5', after:7},{note:'D#5', after:8},{note:'F#5', after:10},{note:'G#5', after:11},{note:'A#5', after:12}
  ];
  const CODE_TO_KANA = {
    C:'ド', 'C#':'ド#', D:'レ', 'D#':'レ#', E:'ミ', F:'ファ', 'F#':'ファ#',
    G:'ソ', 'G#':'ソ#', A:'ラ', 'A#':'ラ#', B:'シ'
  };
  const KANA_TO_CODE = {
    'ド':'C','ド#':'C#','レ':'D','レ#':'D#','ミ':'E','ファ':'F','ファ#':'F#',
    'ソ':'G','ソ#':'G#','ラ':'A','ラ#':'A#','シ':'B'
  };
  const texts = {
    ja:{
      subtitle:'ブラウザで奏でるピアノ',
      tagline:'鍵盤でも、テキストでも。音を自由に奏でよう。',
      description:'2オクターブの鍵盤をクリックして演奏したり、音階をテキスト入力して自動演奏できるブラウザピアノです。カタカナとコード、どちらの入力にも対応しています。R は休符として使用できます。',
      exampleKana:'入力例：ド4 レ4 ミ4 ファ4 ソ4', exampleCode:'入力例：C4 D4 E4 F4 G4', exampleRest:'休符：R',
      rotateTitle:'🎹 ピアノは横向きで♪', rotateText:'スマートフォンを横向きにすると、2オクターブの鍵盤を演奏できます。',
      keyboardTitle:'PIANO KEYBOARD', currentNoteLabel:'現在の音', frequencyLabel:'周波数', positionLabel:'再生位置', stateLabel:'状態',
      ready:'準備完了', playing:'再生中', completed:'再生完了', stopped:'停止', manual:'演奏中', rest:'休符',
      sequenceLabel:'音階入力', outputFormatLabel:'鍵盤からの出力形式', kana:'カタカナ', code:'コード',
      play:'▶ 再生', stop:'■ 停止', deleteNote:'⌫ 一音削除', clear:'× 全消去',
      bpmLabel:'BPM', volumeLabel:'音量',
      empty:'音階を入力してください。', invalid:'認識できない音階があります：', range:'鍵盤範囲外の音があります：'
    },
    en:{
      subtitle:'Piano in Your Browser',
      tagline:'Play with the keyboard or with text. Make music your way.',
      description:'Play a two-octave piano directly in your browser. You can play the keyboard manually or enter note names such as C4 D4 E4 F4 G4 for automatic playback. R represents a rest.',
      exampleKana:'Japanese note input is also supported.', exampleCode:'Example: C4 D4 E4 F4 G4', exampleRest:'Rest: R',
      rotateTitle:'🎹 Turn your phone sideways♪', rotateText:'Rotate your phone to landscape mode to play the two-octave keyboard.',
      keyboardTitle:'PIANO KEYBOARD', currentNoteLabel:'Current note', frequencyLabel:'Frequency', positionLabel:'Position', stateLabel:'Status',
      ready:'Ready', playing:'Playing', completed:'Playback complete', stopped:'Stopped', manual:'Playing', rest:'Rest',
      sequenceLabel:'Note sequence', outputFormatLabel:'Keyboard output format', kana:'Katakana', code:'Code',
      play:'▶ Play', stop:'■ Stop', deleteNote:'⌫ Delete Note', clear:'× Clear',
      bpmLabel:'BPM', volumeLabel:'Volume',
      empty:'Enter a note sequence.', invalid:'Unrecognized note:', range:'Note outside keyboard range:'
    }
  };

  const keyboard = document.getElementById('keyboard');
  const whiteKeys = document.getElementById('whiteKeys');
  const sequence = document.getElementById('sequence');
  const currentNoteEl = document.getElementById('currentNote');
  const frequencyEl = document.getElementById('frequency');
  const positionEl = document.getElementById('position');
  const playStateEl = document.getElementById('playState');
  const messageEl = document.getElementById('message');
  const bpmEl = document.getElementById('bpm');
  const volumeEl = document.getElementById('volume');
  const volumeValue = document.getElementById('volumeValue');
  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const clearBtn = document.getElementById('clearBtn');
  const formatKana = document.getElementById('formatKana');
  const formatCode = document.getElementById('formatCode');

  let lang = 'ja';
  let outputFormat = 'code';
  let audioCtx = null;
  let masterGain = null;
  let playbackTimer = null;
  let isPlaying = false;
  let activePlaybackNote = null;
  const activeManual = new Map();
  const voices = [];

  function buildKeyboard(){
    WHITE_NOTES.forEach(([code,kana])=>{
      const key = document.createElement('button');
      key.type = 'button';
      key.className = 'key white';
      key.dataset.note = code;
      key.setAttribute('aria-label', code);
      key.innerHTML = `<span class="key-label"><span class="kana">${kana.replace(/\d/g,'')}</span>${code}</span>`;
      whiteKeys.appendChild(key);
    });
    BLACK_NOTES.forEach(({note,after})=>{
      const key = document.createElement('button');
      key.type = 'button';
      key.className = 'black-key';
      key.dataset.note = note;
      key.setAttribute('aria-label', note);
      key.style.left = `${((after + 1) / 15) * 100}%`;
      key.innerHTML = `<span class="black-label">${note}</span>`;
      keyboard.appendChild(key);
    });
  }

  function setLanguage(next){
    lang = next;
    document.documentElement.lang = next;
    document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active', b.dataset.lang===next));
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.dataset.i18n;
      if(texts[next][k] !== undefined) el.textContent = texts[next][k];
    });
    if(!isPlaying && playStateEl.dataset.stateKey){
      playStateEl.textContent = texts[lang][playStateEl.dataset.stateKey];
    }
  }

  function setState(key){
    playStateEl.dataset.stateKey = key;
    playStateEl.textContent = texts[lang][key] || key;
  }

  function noteToMidi(note){
    const m = note.match(/^([A-G])(#?)(\d)$/);
    if(!m) return null;
    const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]] + (m[2] ? 1 : 0);
    return (Number(m[3]) + 1) * 12 + base;
  }

  function frequency(note){
    const midi = noteToMidi(note);
    return 440 * Math.pow(2,(midi-69)/12);
  }

  function kanaFromCode(note){
    if(note==='R') return 'R';
    const m = note.match(/^([A-G]#?)(\d)$/);
    return m ? `${CODE_TO_KANA[m[1]]}${m[2]}` : note;
  }

  function normalizeToken(raw){
    const t = raw.trim();
    if(!t) return null;
    if(t.toUpperCase()==='R') return 'R';
    const upper = t.toUpperCase();
    if(/^[A-G]#?[0-9]$/.test(upper)) return upper;
    const m = t.match(/^(ド#?|レ#?|ミ|ファ#?|ソ#?|ラ#?|シ)(\d)$/);
    if(m) return `${KANA_TO_CODE[m[1]]}${m[2]}`;
    return null;
  }

  function parseSequence(){
    const rawTokens = sequence.value.trim().split(/[\s　]+/).filter(Boolean);
    if(!rawTokens.length) return {error:texts[lang].empty};
    const out = [];
    for(const raw of rawTokens){
      const n = normalizeToken(raw);
      if(!n) return {error:`${texts[lang].invalid} ${raw}`};
      if(n !== 'R'){
        const midi = noteToMidi(n);
        if(midi < noteToMidi('C4') || midi > noteToMidi('C6')){
          return {error:`${texts[lang].range} ${raw}`};
        }
      }
      out.push(n);
    }
    return {notes:out};
  }

  function ensureAudio(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = Number(volumeEl.value)/100;
      masterGain.connect(audioCtx.destination);
    }
    if(audioCtx.state === 'suspended') audioCtx.resume();
  }

  function trimVoices(){
    while(voices.length > 16){
      const v = voices.shift();
      if(v && v.stop) v.stop(true);
    }
  }

  function createVoice(note, autoReleaseMs=null){
    ensureAudio();
    const now = audioCtx.currentTime;
    const f = frequency(note);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.75, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.38);
    gain.connect(masterGain);

    const harmonics = [
      {ratio:1, amp:1},
      {ratio:2, amp:.36},
      {ratio:3, amp:.19},
      {ratio:4, amp:.11}
    ];
    const oscs = [];
    harmonics.forEach(h=>{
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f*h.ratio;
      g.gain.value = h.amp;
      o.connect(g); g.connect(gain); o.start(now); oscs.push(o);
    });
    let stopped = false;
    const voice = {
      stop(immediate=false){
        if(stopped) return;
        stopped = true;
        const t = audioCtx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(Math.max(gain.gain.value,0.0001),t);
        gain.gain.exponentialRampToValueAtTime(0.0001,t+(immediate?0.05:0.48));
        oscs.forEach(o=>o.stop(t+(immediate?0.07:0.52)));
      }
    };
    voices.push(voice); trimVoices();
    if(autoReleaseMs !== null) setTimeout(()=>voice.stop(false), Math.max(40,autoReleaseMs));
    return voice;
  }

  function keyFor(note){
    return keyboard.querySelector(`[data-note="${CSS.escape(note)}"]`);
  }

  function setKeyActive(note,on){
    const k = keyFor(note);
    if(k) k.classList.toggle('active',on);
  }

  function updateCurrent(note){
    if(note === 'R'){
      currentNoteEl.textContent = `R (${texts[lang].rest})`;
      frequencyEl.textContent = '—';
      return;
    }
    currentNoteEl.textContent = `${kanaFromCode(note)} / ${note}`;
    frequencyEl.textContent = `${frequency(note).toFixed(2)} Hz`;
  }

  function appendManualNote(note){
    if(isPlaying) return;
    const token = outputFormat === 'kana' ? kanaFromCode(note) : note;
    sequence.value = sequence.value.trim() ? `${sequence.value.trim()} ${token}` : token;
  }

  function manualDown(note, pointerId){
    if(activeManual.has(pointerId)) return;
    ensureAudio();
    const voice = createVoice(note);
    activeManual.set(pointerId,{note,voice});
    setKeyActive(note,true);
    updateCurrent(note);
    setState('manual');
    appendManualNote(note);
  }

  function manualUp(pointerId){
    const item = activeManual.get(pointerId);
    if(!item) return;
    item.voice.stop(false);
    setKeyActive(item.note,false);
    activeManual.delete(pointerId);
    if(!isPlaying) setState('ready');
  }

  keyboard.addEventListener('pointerdown',e=>{
    const key = e.target.closest('[data-note]');
    if(!key) return;
    e.preventDefault();
    key.setPointerCapture?.(e.pointerId);
    manualDown(key.dataset.note,e.pointerId);
  });
  keyboard.addEventListener('pointerup',e=>manualUp(e.pointerId));
  keyboard.addEventListener('pointercancel',e=>manualUp(e.pointerId));
  keyboard.addEventListener('lostpointercapture',e=>manualUp(e.pointerId));

  function stopPlayback(resetPosition=true){
    if(playbackTimer){ clearTimeout(playbackTimer); playbackTimer = null; }
    if(activePlaybackNote){ setKeyActive(activePlaybackNote,false); activePlaybackNote = null; }
    isPlaying = false;
    sequence.readOnly = false;
    if(resetPosition) positionEl.textContent = '0 / 0';
    setState('stopped');
  }

  function playSequence(){
    stopPlayback(false);
    messageEl.textContent = '';
    const parsed = parseSequence();
    if(parsed.error){ messageEl.textContent = parsed.error; setState('ready'); return; }
    ensureAudio();
    const bpm = Math.max(40,Math.min(240,Number(bpmEl.value)||120));
    bpmEl.value = bpm;
    const beat = 60000 / bpm;
    const notes = parsed.notes;
    isPlaying = true;
    sequence.readOnly = true;
    setState('playing');
    let i = 0;

    const step = ()=>{
      if(!isPlaying) return;
      if(activePlaybackNote){ setKeyActive(activePlaybackNote,false); activePlaybackNote = null; }
      if(i >= notes.length){
        isPlaying = false;
        sequence.readOnly = false;
        positionEl.textContent = `0 / ${notes.length}`;
        setState('completed');
        return;
      }
      const note = notes[i];
      positionEl.textContent = `${i+1} / ${notes.length}`;
      updateCurrent(note);
      if(note !== 'R'){
        activePlaybackNote = note;
        setKeyActive(note,true);
        createVoice(note, Math.max(100, beat*0.72));
      }
      i++;
      playbackTimer = setTimeout(step, beat);
    };
    step();
  }

  playBtn.addEventListener('click',playSequence);
  stopBtn.addEventListener('click',()=>stopPlayback(true));
  deleteBtn.addEventListener('click',()=>{
    if(isPlaying) return;
    const arr = sequence.value.trim().split(/[\s　]+/).filter(Boolean);
    arr.pop();
    sequence.value = arr.join(' ');
    messageEl.textContent = '';
  });
  clearBtn.addEventListener('click',()=>{
    if(isPlaying) stopPlayback(true);
    sequence.value = '';
    currentNoteEl.textContent = '—';
    frequencyEl.textContent = '—';
    positionEl.textContent = '0 / 0';
    messageEl.textContent = '';
    setState('ready');
  });

  formatKana.addEventListener('click',()=>{
    outputFormat='kana'; formatKana.classList.add('active'); formatCode.classList.remove('active');
  });
  formatCode.addEventListener('click',()=>{
    outputFormat='code'; formatCode.classList.add('active'); formatKana.classList.remove('active');
  });

  volumeEl.addEventListener('input',()=>{
    volumeValue.textContent = `${volumeEl.value}%`;
    if(masterGain && audioCtx){
      masterGain.gain.setTargetAtTime(Number(volumeEl.value)/100,audioCtx.currentTime,.02);
    }
  });

  bpmEl.addEventListener('change',()=>{
    bpmEl.value = Math.max(40,Math.min(240,Number(bpmEl.value)||120));
  });

  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));

  buildKeyboard();
  setLanguage('ja');
  volumeValue.textContent = `${volumeEl.value}%`;
})();
