async function generateTTS() {
    const text = document.getElementById('ttsText').value;
    if (!text) return alert('Please enter text!');

    try {
        const res = await fetch('/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await res.json();
        const audio = document.getElementById('ttsAudio');
        audio.src = data.audioPath;
        audio.play();
    } catch (err) {
        console.error(err);
        alert('Error generating audio');
    }
}
