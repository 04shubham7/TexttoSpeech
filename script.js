async function startRecognition() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = function (event) {
            chunks.push(event.data);
        };

        mediaRecorder.onstop = async function () {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const formData = new FormData();
            formData.append('file', audioBlob);

            const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=YOUR_API_KEY', {
                method: 'POST',
                body: JSON.stringify({
                    config: {
                        encoding: 'LINEAR16',
                        sampleRateHertz: 16000,
                        languageCode: 'en-US',
                    },
                    audio: {
                        uri: audioUrl,
                    },
                }),
            });

            const result = await response.json();
            document.getElementById('text').value = result.results[0].alternatives[0].transcript;
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    } catch (error) {
        console.error('Error occurred during recognition: ' + error);
        document.getElementById('text').value = 'Error occurred during recognition: ' + error;
    }
}

document.getElementById('startButton').addEventListener('click', startRecognition);
