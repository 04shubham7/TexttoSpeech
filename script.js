var i = 0;

function speechToTextConversion() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    var recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    var diagnostic = document.getElementById('text');

    document.getElementById("playButton").onclick = function () {
        if (i == 0) {
            document.getElementById("playButton").style.display = "none";
            document.getElementById("recordButton").style.display = "inline";
            recognition.start();
            i = 1;
        }
        else {
            document.getElementById("playButton").style.display = "inline";
            document.getElementById("recordButton").style.display = "none";
            recognition.stop();
            i = 0;
        }
    }

    recognition.onstart = function() {
        console.log('Speech recognition service has started');
    };

    recognition.onresult = function (event) {
        var last = event.results.length - 1;
        var convertedText = event.results[last][0].transcript;
        diagnostic.value = convertedText;
        console.log('Confidence: ' + event.results[0][0].confidence);
    };

    recognition.onnomatch = function (event) {
        diagnostic.value = 'I did not recognise that.';
    };

    recognition.onerror = function (event) {
        diagnostic.value = 'Error occurred in recognition: ' + event.error;
        console.error('Error occurred in recognition: ' + event.error);
    };

    recognition.onspeechend = function() {
        recognition.stop();
        console.log('Speech recognition service disconnected');
        document.getElementById("playButton").style.display = "inline";
        document.getElementById("recordButton").style.display = "none";
        i = 0;
    };
};

window.onload = speechToTextConversion;
