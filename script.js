// JavaScript to handle opening and closing the modal




let charIndex, word, currentMessage, startTime, inAccuracyCount, elapsedTime;
const content = document.getElementById("content");

let currentWord = document.getElementById("current-word");

function handleBackspace(event) {
  const key = event.key;
  if (key === "Backspace" || key === "Delete") {
    content.childNodes[charIndex].className = "";
    if (charIndex > 0) charIndex--;
    content.childNodes[charIndex].className = "highlight";
  }
}

function handleInput() {
  console.log(content.childNodes);
  // const current = words[charIndex];
  const typedValue = currentWord.value;
  console.log(currentMessage[charIndex]);
  console.log(currentMessage.length);
  console.log(typedValue);
  console.log(charIndex);

  if (charIndex === currentMessage.length - 1) {
    content.innerHTML = "";
    currentWord.value = "";

    elapsedTime = (new Date().getTime() - startTime) / 60000;
    var wpm = currentMessage.length / 5 / elapsedTime;
    const result = `<p style="background-color:green; border-radius: 5px;">You finished with speed of ${wpm.toFixed()} words per minute </p>`;
    console.log(result);
    content.innerHTML = result;
    charIndex = 0;
    
    // currentWord.removeEventListener('keydown',handleBackspace);
    // currentWord.removeEventListener('input',handleInput);
  } else if (typedValue != currentMessage[charIndex]) {
    inAccuracyCount++;
    content.childNodes[charIndex].className = "error";
    currentWord.value = "";
    charIndex++;
  } else if (typedValue === currentMessage[charIndex]) {
    content.childNodes[charIndex].className = "done";
    currentWord.value = "";
    charIndex++;

    content.childNodes[charIndex].className = "highlight";
  }
}

function myFunction() {
  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/quotes/",
    headers: { "X-Api-Key": "hgLdefTld20KuS/1sYoL6w==Kvdoxvt71AoQWKz1" },
    contentType: "application/json",
    cache: false,
    success: function (result) {
      console.log("new call begin");

      charIndex = 0;
      inAccuracyCount = 0;

      console.log(result);
      currentMessage = result[0].quote;
      // console.log(currentMessage);
      // var words = [];
      console.log(currentMessage);
      var words = currentMessage.split(" ");
      console.log(words);

      const spanWords = words.map(function (word) {
        const spanCharacters = word.split("").map(function (char) {
          return `<span>${char}</span>`;
        });
        return spanCharacters.join("");
      });

      console.log(spanWords.join(""));
      content.innerHTML = spanWords.join(" ");

      console.log(content.childNodes);

      for (const wordElement of content.childNodes) {
        wordElement.className = "";
      }
      content.childNodes[0].className = "highlight";
      console.log(content.childNodes);
      message.innerText = "";
      currentWord.value = "";

      startTime = new Date().getTime();
      // document.addEventListener('keydown',()=>{startTime =  new Date().getTime();
      //   console.log(startTime);} );

      currentWord.addEventListener("keydown", handleBackspace);

      currentWord.addEventListener("input", handleInput);

      // error: function ajaxError(jqXHR) {
      //     console.error('Error: ', jqXHR.responseText);
      // }
    },

    // complete: function(){
    //   currentWord.removeEventListener('keydown',handleBackspace);
    //   currentWord.removeEventListener('input',handleInput);
    // }
  });
}

document.getElementById("start").addEventListener("click", myFunction);
