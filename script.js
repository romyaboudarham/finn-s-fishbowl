let aud = document.getElementById('audio');
var arrow = document.getElementById("follow-arrow");
var ch = document.getElementById("chapter-div");
aud.onended = function() {
    ch.style.display = 'none';
    arrow.style.display = 'block';
};

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