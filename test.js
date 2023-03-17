// Define the text to be converted to speech
const text = "anastasis = pedo";

// Create a new SpeechSynthesisUtterance object with the text to be spoken
const utterance = new SpeechSynthesisUtterance(text);

// Set the voice to be used for the speech
utterance.voice = speechSynthesis.getVoices()[0];

// Create a new SpeechSynthesis object and add the utterance to its queue
const synth = window.speechSynthesis;
synth.speak(utterance);

// When the speech is finished, create a new Audio object and save the MP3 file
utterance.onend = function() {
  const blob = new Blob([text], {type: 'text/plain'});
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function() {
    const base64data = reader.result;
    const audio = new Audio();
    audio.src = base64data;
    audio.controls = true;
    document.body.appendChild(audio);
  };
};
