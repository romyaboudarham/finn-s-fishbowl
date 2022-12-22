function showDiv() {
 }

 function toggle_visibility(btnId, displayId) {
    var btn = document.getElementById(btnId);
    var display = document.getElementById(displayId);
    if(display.style.display == 'block') {
        btn.value = "Show Audio Transcription";
        display.style.display = 'none';
    } else {
        btn.value = "Hide Audio Transcription";
        display.style.display = 'block';
    }
}