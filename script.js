// Narrated pages (home, Ch. 1, Ch. 2): Play reveals the player and word-by-word subtitles,
// and when the audio ends the page shows its #follow-arrow screen, or moves on to data-next.
const narrationAudio = document.getElementById('intro_audio') || document.getElementById('audio');
if (narrationAudio) {
    narrationAudio.onended = function() {
        const followArrow = document.getElementById('follow-arrow');
        if (followArrow) {
            // Chapter pages: show the "follow the arrow" screen with its Next button
            document.getElementById('narration-player').style.display = 'none';
            document.getElementById('start-text').style.display = 'none';
            followArrow.style.display = 'block';
        } else if (narrationAudio.dataset.next) {
            window.location.href = narrationAudio.dataset.next;
        }
    };
    narrationAudio.addEventListener('play', subtitle_loop);
    narrationAudio.addEventListener('seeked', render_subtitles);
    narrationAudio.addEventListener('pause', render_subtitles);
}

// Seconds a finished sentence stays on screen before it clears
const SUBTITLE_HOLD = 1.5;
let subtitleIndex = -1;

function subtitle_loop() {
    render_subtitles();
    if (!narrationAudio.paused && !narrationAudio.ended) {
        requestAnimationFrame(subtitle_loop);
    }
}

// Fills the subtitle box with one sentence; every word is laid out but hidden until spoken
function fill_subtitle(box, sentence) {
    box.textContent = '';
    sentence.forEach(function(word, i) {
        // Counted numbers sit on their own line; a run of them shares one line
        if (i > 0 && Boolean(word.em) !== Boolean(sentence[i - 1].em)) {
            const lineBreak = document.createElement('div');
            lineBreak.className = 'line-break';
            box.appendChild(lineBreak);
        }
        const span = document.createElement('span');
        span.textContent = word.w;
        if (word.em) span.classList.add('em');
        box.appendChild(span);
    });
}

// Reserves the height of the tallest sentence so nothing below the subtitles moves
function size_subtitles() {
    const box = document.getElementById('subtitles');
    box.style.minHeight = '0';
    let tallest = 0;
    SUBTITLE_SENTENCES.forEach(function(sentence) {
        fill_subtitle(box, sentence);
        tallest = Math.max(tallest, box.getBoundingClientRect().height);
    });
    box.style.minHeight = Math.ceil(tallest) + 'px';
    subtitleIndex = -1;
    render_subtitles();
}

// Shows the sentence being spoken at the audio's current time, one word at a time
function render_subtitles() {
    const box = document.getElementById('subtitles');
    const t = narrationAudio.currentTime;
    let index = -1;
    SUBTITLE_SENTENCES.forEach(function(sentence, i) {
        if (t >= sentence[0].start) index = i;
    });
    if (narrationAudio.ended) index = -1;
    if (index >= 0) {
        const sentence = SUBTITLE_SENTENCES[index];
        if (t > sentence[sentence.length - 1].end + SUBTITLE_HOLD) index = -1;
    }
    if (index !== subtitleIndex) {
        subtitleIndex = index;
        box.textContent = '';
        if (index >= 0) fill_subtitle(box, SUBTITLE_SENTENCES[index]);
    }
    if (index >= 0) {
        const spans = box.querySelectorAll('span');
        SUBTITLE_SENTENCES[index].forEach(function(word, i) {
            spans[i].classList.toggle('shown', t >= word.start);
        });
    }
}

// The subtitle width depends on the screen, so re-measure when it changes (e.g. turning the phone)
window.addEventListener('resize', function() {
    const player = document.getElementById('narration-player');
    if (narrationAudio && player && player.style.display === 'flex') size_subtitles();
});

// Play/Begin button: hides the start screen (the element named in its data-hide) and starts the audio
function start_narration(automatic) {
    const playBtn = document.getElementById('play-btn');
    document.getElementById('container').classList.remove('pre-begin');
    playBtn.style.display = 'none';
    document.getElementById(playBtn.dataset.hide).style.display = 'none';
    document.getElementById('narration-player').style.display = 'flex';
    const attempt = narrationAudio.play();
    // A page that started by itself (?play) and is blocked from making sound brings the Play button back;
    // after a tap the player stays, so its own play control can be used
    if (attempt && automatic) attempt.catch(show_start_screen);
    document.fonts.ready.then(size_subtitles);
}

function show_start_screen() {
    const playBtn = document.getElementById('play-btn');
    document.documentElement.classList.remove('autoplay');
    document.getElementById('container').classList.add('pre-begin');
    playBtn.style.display = '';
    document.getElementById(playBtn.dataset.hide).style.display = '';
    document.getElementById('narration-player').style.display = 'none';
}

// Pages opened with ?play (the Play Ch. 2 button) start the audio without a second Play press
if (narrationAudio && document.getElementById('play-btn') && new URLSearchParams(window.location.search).has('play')) {
    start_narration(true);
}

function toggle_visibility(btnId, displayId) {
    var btn = document.getElementById(btnId);
    var display = document.getElementById(displayId);
    if (btn.id == "transcribe-btn") {
        if(display.style.display == 'block') {
            btn.value = "Show Audio Transcription";
            display.style.display = 'none';
        } else {
            btn.value = "Hide Audio Transcription";
            display.style.display = 'block';
        }
    } else if (btn.id == "access-btn") {
        if(display.style.display == 'block') {
            btn.value = "Show \u267F Instructions";
            display.style.display = 'none';
        } else {
            btn.value = "Hide \u267F Instructions";
            display.style.display = 'block';
        }
    }
}