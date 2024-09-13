const texts = document.querySelector(".texts");
const mic_btn = document.querySelector(".fa-microphone")
const ip_btn = document.querySelector(".fa-ellipsis")
const asl_btn = document.querySelector(".fa-hands-asl-interpreting")
const text_input = document.getElementById("english")
const output = document.getElementById('output');

let json_app_vocabulary = {};
// Fetch the JSON file with 300 key-value pairs
fetch('vocabulary.json')
    .then(response => response.json())
    .then(data => {
        json_app_vocabulary = data;
    })
    .catch(error => console.error('Error loading vocabulary data:', error));

//Speech object
window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;


mic_btn.addEventListener("click", function () {
    mic_btn.classList.add('hidden');
    ip_btn.classList.remove('hidden');
    recognition.start();
})

recognition.addEventListener("result", (e) => {
    const input_text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
    if (e.results[0].isFinal) {
        text_input.value = input_text;
        updateOutput();
    }
});


recognition.addEventListener("end", () => {
    recognition.stop();
    ip_btn.classList.add('hidden');
    asl_btn.classList.remove('hidden');
});


// Function to process the text and highlight specific words
function updateOutput() {
    const text = text_input.value;
    const words = text.split(' '); // Split the text into words

    // Clear previous output
    output.innerHTML = '';

    // Process each word
    words.forEach(word => {
        const span = document.createElement('span');
        if (json_app_vocabulary.includes(word.toLowerCase())) {
            // Highlight the word if it's in the list
            span.classList.add('highlight');
        }
        span.textContent = word + ' '; // Add space after each word
        output.appendChild(span);
    });
}
// Event listener for input change
english.addEventListener('change', updateOutput);
