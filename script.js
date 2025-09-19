const saveButton = document.getElementById("savebtn");
const cardarea = document.getElementById("cardarea");

//Get cards saved from local storage
let flashcard = JSON.parse(localStorage.getItem("flashcard")) || [];

//save card 
saveButton.addEventListener("click", () => {
  const questions = document.querySelectorAll(".question1");
  const answers = document.querySelectorAll(".answer1");
  
  const cards = [];
  //Retrieve the array
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i].value.trim();
    const a = answers[i].value.trim();
    // If one is empty, alert
    if (!q || !a) {
      alert("Please fill in both question and answer");
      return;
    }
   //Add as a single card to the array
    cards.push({ question: q, answer: a });

    //Clear the input field
    questions[i].value="";
    answers[i].value="";
  }

    // When the input field is empty, an alert
  if (cards.length === 0) {
    alert("There are no cards to save");
    return;
  }
  
  //Add the card to the flashcard array and save to storage 
  flashcard.push(...cards);

  localStorage.setItem("flashcard", JSON.stringify(flashcard));
  playcard = [...flashcard];  
  shuffle(playcard);          // shuffle cards 
  showCard();                 // reflect on the screen 
  checkCount();               // count update 
  
cardarea.innerHTML="";
// Display newly added cards immediately on the screen
  let text = "";
  flashcard.forEach(card => {
    text += `
      <div class="card">
        <p class="question">Q: ${card.question}</p>
        <button class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });
  cardarea.innerHTML = text;
});


// Display saved cards on page load
let loadText = "";
flashcard.forEach(card => {
  loadText += `
    <div class="card">
      <p class="question">Q: ${card.question}</p>
      <button class="delete-btn">
       <i class="fa-solid fa-trash"></i>
      </button>


    </div>
  `;
});
cardarea.innerHTML = loadText;

// delete cards when click delete button 
document.addEventListener("click", function(event) {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;
  const cardHTML = btn.parentElement;
  const questionText = cardHTML.querySelector(".question").textContent.replace("Q: ", "");

    // Remove cards deleted from the flashcard array
    flashcard =flashcard.filter (card => card.question !== questionText);
    playcard = playcard.filter(card => card.question !==questionText);

    // update local storage and delete the card from the card area screen
    localStorage.setItem("flashcard", JSON.stringify(flashcard));
    cardarea.removeChild(cardHTML);
      checkCount();               // count update 
      showCard();                 //reflect on the screen 

  });


// play screen 
const playFlash = document.getElementById("playflash");
const nextBtn = document.getElementById("nextbtn");
const answerBtn = document.getElementById("answerbtn");

//play array 
let playcard =[...flashcard]
shuffle(playcard); 

//shuffle the play array (Fisher-Yates shuffle)
function shuffle(array) {
    for(let i = (array.length - 1); i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



// show question on the play screen 
function showCard() {
  if (flashcard.length === 0) {
    playFlash.textContent = "please add cards";
    return;
  }
  const card = playcard[0]; 

   playFlash.innerHTML = "";
  
   //Display saved questions alongside Q
  const playCards = document.createElement("p");
  playCards.innerHTML = `<span class="Q">Q:</span>${card.question}`;

  //Adjusting font size based on question length 
let fontSize;
if (card.question.length <= 20) {
  fontSize = '30px';

} else if (card.question.length <= 30) {
  fontSize = '26px';
} else if (card.question.length <= 60) {
  fontSize = '22px';
} else {
  fontSize = '16px';
}
playCards.style.fontSize = fontSize;


// checkbox and message for check 
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  const help = document.createElement("p");
  help.classList.add("help")
  help.textContent = "";          

  // checkbox click event 
  checkbox.addEventListener("click", function(){
    if (this.checked){
      help.textContent ="Memorized";
      setTimeout(() => {
        help.remove();
      }, 2000); // remove the message after two second
    }
  });
  playFlash.appendChild(playCards)
  playFlash.appendChild(checkbox);
  playFlash.appendChild(help);
  //Save when the check changes
  checkbox.checked = card.checked; 
  checkbox.addEventListener("click", function() {
    card.checked = this.checked;
    localStorage.setItem("flashcard", JSON.stringify(flashcard));
    checkCount();
    
  });
 

}

// count checked and unchecked cards 
function checkCount(){
let checkedCards = flashcard.filter(card => card.checked); // checked cards 
let checkedCount = checkedCards.length; // obtain the number 
let uncheckedCount = flashcard.length - checkedCount; // number of unchecked cards

// Calculate memorized percentage and display percentage 
const percent = checkedCount > 0? Math.round((checkedCount/ flashcard.length) * 100) :0;
const cardCount = document.getElementById("cardCount");
// display number of checked and unchecked cards
cardCount.innerHTML = `
<div id="count-card">
  <div id= "count-icon">
  <i class="fa-solid fa-circle-check"></i>
  <p class= "number">${checkedCount}</p>
  </div>
  <div id = "count-icon2">
  <i class="fa-solid fa-circle-xmark"></i> 
  <p class = "number">${uncheckedCount}</p>
  </div>
</div>
  <div id ="percent" >
  <p class = "memory"> Memorized:</p>
  <p class ="percentage"> ${percent}%</p>
  </div>

`;    
}
// next question button
nextBtn.addEventListener("click", () => {
  if (playcard.length === 0) return;

  playcard.push(playcard.shift()); 
  showCard(); 
});

let answerORquestion =false;
// show answer or go back question 
answerBtn.addEventListener("click", () => {
  if (playcard.length === 0) return;

  const card = playcard[0]; 
  if (!answerORquestion) {
    answerORquestion = true;

    const answerP = document.createElement("p");
    answerP.innerHTML = `<span class="Q">A:</span>${card.answer}`; 

    //Adjusting font size based on answer length 
    let fontSizeAnswer;
    if (card.answer.length <= 20) {
      fontSizeAnswer = '30px';
    } else if (card.answer.length <= 30) {
      fontSizeAnswer = '26px';
    } else if (card.answer.length <= 60) {
      fontSizeAnswer = '22px';
    } else fontSizeAnswer = '16px';
    answerP.style.fontSize = fontSizeAnswer;

    playFlash.innerHTML = "";      
    playFlash.appendChild(answerP); // show answer 
  } else {
    answerORquestion = false;
    showCard(); // show question 
  }
});


showCard();
checkCount();

//keyboard controls
document.addEventListener('keydown', function(event){
  //if it is in focus, do nothing.
  const focusTag = document.activeElement.tagName.toLowerCase();
  if (focusTag === 'input') return;
  if (focusTag === 'textarea') return;

  if (event.key === "ArrowRight")
  {nextBtn.click();}
  if (event.key === "Enter") {
    answerBtn.click();
  }
  if (event.key === " "){
    answerBtn.click();
  }
})