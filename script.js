const texts = document.querySelector(".texts");

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement("p");

recognition.addEventListener("result", (e) => {
    texts.appendChild(p);
    const text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

    p.innerText = text;
    if (e.results[0].isFinal) {
        if (text.includes("translate")) {
            p = document.createElement("p");
            p.classList.add("replay");
            p.innerText = "Calling the AI";
            texts.appendChild(p);
        }
        p = document.createElement("p");
    }
});

recognition.addEventListener("end", () => {
    recognition.start();
});

recognition.start();
