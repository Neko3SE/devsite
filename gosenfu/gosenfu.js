(() => {
  "use strict";

  const sourceElement = document.getElementById("gosenfu-video-source");
  if (!sourceElement) return;

  const video = sourceElement.closest("video");
  const source = sourceElement.dataset.base64Src;
  const mime = sourceElement.dataset.base64Mime || "video/mp4";
  fetch(source)
    .then(response => {
      if (!response.ok) throw new Error(`Base64 video load failed: ${response.status}`);
      return response.text();
    })
    .then(base64 => {
      sourceElement.src = `data:${mime};base64,${base64.trim()}`;
      video?.load();
    })
    .catch(error => {
      console.error(error);
    });
})();

   (() => {
    const copyButton = document.getElementById("copy-prompt");
    const promptText = document.getElementById("prompt-text");
    const langJa = document.getElementById("lang-ja");
    const langEn = document.getElementById("lang-en");
    const promptJa = promptText.textContent;
    const promptEn = `# Objective

Create an educational MP4 video showing the C-major ascending scale “Do Re Mi Fa Sol La Ti Do” on a treble-clef staff, with each displayed note synchronized precisely with its corresponding sound.

# Most Important Requirements

Do not rely on an image-generation AI to guess note positions.
Draw the staff, notes, labels, and highlight effects using exact programmatic coordinates.
The displayed pitch and the pitch actually played must always match.

# Staff Notation

- White background
- Five black horizontal staff lines
- Treble clef
- C major
- Eight notes arranged from left to right
- One-octave ascending scale: Do Re Mi Fa Sol La Ti Do
- Show the corresponding solfège label below each note
- Use a simple, highly legible educational design

# Exact Note Positions

Use middle C (C4) through C5, one octave above.

1. Do = C4 — on the ledger line below the staff
2. Re = D4 — in the space below the first line
3. Mi = E4 — on the first line
4. Fa = F4 — in the first space
5. Sol = G4 — on the second line
6. La = A4 — in the second space
7. Ti = B4 — on the third (middle) line
8. Do = C5 — in the third space

From C4 to C5, the notes must rise continuously by alternating between lines and spaces.
Take special care not to place La, Ti, and the final Do one step too low.

# Sound Pitches

Use equal temperament with A4 = 440 Hz.

- Do C4 = 261.63 Hz
- Re D4 = 293.66 Hz
- Mi E4 = 329.63 Hz
- Fa F4 = 349.23 Hz
- Sol G4 = 392.00 Hz
- La A4 = 440.00 Hz
- Ti B4 = 493.88 Hz
- Do C5 = 523.25 Hz

Use a natural piano-like tone.

# Video Presentation

Play the notes in this order:

Do → Re → Mi → Fa → Sol → La → Ti → Do

- Approximately 0.7 seconds per note
- Highlight the corresponding note exactly when its sound begins
- Synchronize the note display and audio precisely
- Make the currently sounding note immediately recognizable
- Use a subtle highlight such as a ring around the notehead so the staff remains readable
- Highlight the solfège label as appropriate
- Hold the final frame for approximately 1 second after the final Do

# Audio

Do not use a simple beep.
Use a natural piano-like timbre.
If no external instrument sample is available, synthesize a piano-like sound using a fundamental frequency, harmonics, attack, and decay.
Set the volume appropriately to avoid clipping.

# Output Specifications

- MP4 format
- Video: H.264
- Audio: AAC
- 30 fps
- Compatible with common PCs, Android devices, and iPhones
- Total duration: approximately 6.6 seconds
- Output the final result as a downloadable MP4 file

# Quality Check

Before finalizing, verify all of the following:

- The notes are C4, D4, E4, F4, G4, A4, B4, C5 in that order
- The scale rises continuously by one staff step at a time
- A4 is in the second space
- B4 is on the third (middle) line
- The final C5 is in the third space
- Each displayed note matches the pitch being played
- Audio and highlight timing are synchronized
- The solfège labels display correctly without character corruption

If any condition is not met, correct it before exporting the MP4.`;

    const translations = {
     ja: {
      htmlLang:"ja", title:"五線譜ドレミclip | Neko3SE LAB | 五線譜の音符と音階吹鳴を完全同期", pageTitle:"五線譜ドレミclip",
      lead:"五線譜の音符と音階吹鳴を完全同期♪",
      about:"五線譜の音符表示と音階の吹鳴を同期させた、Neko3SE LABの音楽実験コンテンツです。",
      promptIntro:"この動画を生成する際に利用できる、生成AIへのプロンプト例です。",
      promptSummary:"生成AIへのプロンプト例を見る", copy:"プロンプトをコピー", copied:"コピーしました ✓", copyFailed:"コピーできませんでした",
      note:"※生成AIや実行環境によって、結果や利用できる機能は異なります。", back:"← Neko3SE LAB に戻る",
      fallback:"お使いのブラウザは動画再生に対応していません。", prompt:promptJa
     },
     en: {
      htmlLang:"en", title:"五線譜ドレミclip | Neko3SE LAB | 五線譜の音符と音階吹鳴を完全同期", pageTitle:"Staff Do-Re-Mi Clip",
      lead:"Staff notation and scale tones, perfectly synchronized♪",
      about:"A Neko3SE LAB music experiment that synchronizes notes on a staff with the corresponding scale tones.",
      promptIntro:"Here is an example prompt that can be used with generative AI to create this video.",
      promptSummary:"View the generative AI prompt example", copy:"Copy prompt", copied:"Copied ✓", copyFailed:"Could not copy",
      note:"Results and available features may vary depending on the generative AI and execution environment.", back:"← Back to Neko3SE LAB",
      fallback:"Your browser does not support video playback.", prompt:promptEn
     }
    };
    let currentLang="ja";
    let copyResetTimer=null;

    function applyLanguage(lang) {
     const t=translations[lang];
     currentLang=lang;
     document.documentElement.lang=t.htmlLang;
     document.title=t.title;
     document.getElementById("page-title").textContent=t.pageTitle;
     document.getElementById("page-lead").textContent=t.lead;
     document.getElementById("about-text").textContent=t.about;
     document.getElementById("prompt-intro").textContent=t.promptIntro;
     document.getElementById("prompt-summary").textContent=t.promptSummary;
     document.getElementById("prompt-note").textContent=t.note;
     document.getElementById("video-fallback").textContent=t.fallback;
     promptText.textContent=t.prompt;
     copyButton.textContent=t.copy;
     langJa.classList.toggle("is-active",lang==="ja");
     langEn.classList.toggle("is-active",lang==="en");
     langJa.setAttribute("aria-pressed",String(lang==="ja"));
     langEn.setAttribute("aria-pressed",String(lang==="en"));
     if(copyResetTimer){clearTimeout(copyResetTimer);copyResetTimer=null;}
    }

    async function copyPrompt() {
     const t=translations[currentLang];
     try {
      if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(promptText.textContent);}
      else {
       const textarea=document.createElement("textarea");
       textarea.value=promptText.textContent; textarea.setAttribute("readonly","");
       textarea.style.position="fixed"; textarea.style.opacity="0"; document.body.appendChild(textarea);
       textarea.select(); document.execCommand("copy"); textarea.remove();
      }
      copyButton.textContent=t.copied;
     } catch(error) { copyButton.textContent=t.copyFailed; }
     copyResetTimer=window.setTimeout(()=>{copyButton.textContent=translations[currentLang].copy;copyResetTimer=null;},1800);
    }
    langJa.addEventListener("click",()=>applyLanguage("ja"));
    langEn.addEventListener("click",()=>applyLanguage("en"));
    copyButton.addEventListener("click",copyPrompt);
    applyLanguage("ja");
   })();
