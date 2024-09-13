const texts = document.querySelector(".texts");
const mic_btn = document.querySelector(".fa-microphone")
const ip_btn = document.querySelector(".fa-ellipsis")
const asl_btn = document.querySelector(".fa-hands-asl-interpreting")
const text_input = document.getElementById("english")
const output = document.getElementById('output');
const toggleSwitchASLGloss = document.getElementById('reviewASLGloss');
const toggleSwitchreviewVocab = document.getElementById('reviewVocab');

let json_app_vocabulary = {
    "apple": "A fruit",
    "banana": "A yellow fruit",
    "orange": "A citrus fruit",
    "grape": "A small round fruit",
    "watermelon": "A large fruit",
    "you": "data1",
    "student": "data2"
};

/*
// Fetch the JSON file with 300 key-value pairs
let json_app_vocabulary = {};
fetch('store/vocabulary.json')
    .then(response => response.json())
    .then(data => {
        json_app_vocabulary = data;
    })
    .catch(error => console.error('Error loading vocabulary data:', error));
*/


//Speech object
window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

//Click mic button to record
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
        //updateOutput();
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
        if (json_app_vocabulary.hasOwnProperty(word)) {
            //if (json_app_vocabulary.includes(word.toLowerCase())) {
            // Highlight the word if it's in the list
            span.classList.add('highlight');
        }
        span.textContent = word + ' '; // Add space after each word
        output.appendChild(span);
    });
}
// Event listener for input change
//english.addEventListener('change', updateOutput);

//click the AI_Translate button
asl_btn.addEventListener('click', async function () {
    mic_btn.classList.add('hidden');
    ip_btn.classList.remove('hidden');
    asl_btn.classList.add('hidden');
    try {
        // Send the sentence to the Node.js server
        const response = await fetch('https://ttstaslnode.onrender.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sentence: text_input.value })
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Failed to fetch ASL Gloss translation');
        }
        // Get the ASL Gloss from the response
        const result = await response.json();
        console.log(result);
        //#document.getElementById('output').textContent = `ASL Gloss: ${result.aslGloss}`;

    } catch (error) {
        console.error('Error:', error);
        //#document.getElementById('output').textContent = 'Error fetching the ASL Gloss translation.';
    }

})


//capture the state of the toggle button reviewVocab
toggleSwitchreviewVocab.addEventListener('change', function () {
    if (this.checked) {
        console.log('Toggle is ON');
    } else {
        console.log('Toggle is OFF');
    }
});

//capture the state of the toggle button ASL Gloss
toggleSwitchASLGloss.addEventListener('change', function () {
    if (this.checked) {
        console.log('Toggle is ON');
    } else {
        console.log('Toggle is OFF');
    }
});
