/**
 * This file contains all the required functioning for the loading images, audios and words using arrays
 * and global variables. It is also used for gameplay. The file contains pseudo-code where needed.
 *
 * Client-side code adapted from Lab 10 slides, authored by Terry Goldsmith.
 *
 * Author: Swaraj Shrestha- Handeling audio, image, local storage, checking for the correct answer and result modal.
 *         Raish Raj Joshi- Dragging/dropping functions, Documentation, deciding correct/incorrect ans,sizing, and client-side server functions.
 *         Suyog Chitrakar- Hiding images on hover, and client-side server functions
 *         Tania Terence- Fixing bear drop, sizing errors, and other related bugs
 *         Nicolas Sabbagha- Handeling paremeters with respect to the HTMl file, modify siowasi modal.
*/

// SERVER_URL removed to allow the game to run natively in the browser for portfolio deployment

//Global variables for the file.
let imageNo = 0; //stores the image number of correct answer
let element = ""; //name of the image (for checking correct answer)
let referenceNo = 0; //used to compare with imageNo to check correct answer
let currentWord = ""; //word being displayed in the current question
let previousValue = sessionStorage.getItem("previousValue") || null; //word displayed in the previous question and is stored to local(session) storage for comparison
let audioWord = ""; //word used to search through the possible sounds to play
const numWords = 9; //total number of vocab in the game

let incorrectAnswer = 0; //total number of incorrect answers
let correctAnswer = 0; //total number of correct answers
let totalAnswer = 0; //total number of questions the user answered

//Assigning numbers to name of images with respect to the way they appear in the grid
const answers = {
  aqq: 9,
  eliey: 8,
  kesalk: 7,
  kil: 6,
  ltu: 5,
  mijisi: 4,
  nin: 3,
  teluisi: 2,
  wiktm: 1,
};

/*
 Array of vocabs for the game. Also used to get the image and audio by adding file extension to the
 word when needed as seen in getWord() function.
*/
const words = [
  "aqq",
  "eliey",
  "kesalk",
  "kil",
  "ltu",
  "mijisi",
  "nin",
  "teluisi",
  "wiktm",
];

/**
 * The purpose of this function is to GET a JSON object.
 * Updated for portfolio to use sessionStorage instead of a live backend.
 */
function get() {
  // Retrieve saved scores from session storage, defaulting to 0 if none exist
  let returnedData = {
    cAnswer: parseInt(sessionStorage.getItem("correctAnswer")) || 0,
    inAnswer: parseInt(sessionStorage.getItem("incorrectAnswer")) || 0
  };
  
  getSuccessFn(returnedData);
}

/**
 * This function is used to check whether the answer is correct or not and display the success text or
 * incorrect text accordingly.
 */
function correctResponse() {
  if (referenceNo == imageNo) {
    displayStarOrSun(1);
    correctAnswer++;
  } else if (referenceNo != imageNo) {
    displayStarOrSun(2);
    incorrectAnswer++;
  }
}

/**
 * The purpose of this function is to POST a JSON object.
 * Updated for portfolio to save directly to the browser's sessionStorage.
 */
function post() {
  // Save the updated scores to session storage
  sessionStorage.setItem("correctAnswer", correctAnswer);
  sessionStorage.setItem("incorrectAnswer", incorrectAnswer);

  const objects = { cAnswer: correctAnswer, inAnswer: incorrectAnswer };
  postSuccessFn(objects);
}

/**
 * The purpose of this function is to log the JSON object.
 *
 * @param {object} returnedData contains the JSON object
 */
function postSuccessFn(returnedData) {
  console.log("Score saved successfully:", returnedData);
}

/**
 * The purpose of this function is to process the data received
 * and display the score.
 *
 * @param {object} returnedData contains the JSON object returned
 */
function getSuccessFn(returnedData) {
  correctAnswer = returnedData.cAnswer;
  incorrectAnswer = returnedData.inAnswer;

  // tally the total number of answers by adding the count for correct answers and incorrect answers
  totalAnswer = parseInt(correctAnswer) + parseInt(incorrectAnswer);

  showScore();
  console.log("Score loaded:", returnedData);
}

/**
 * This function takes a single parameter, err, which is an error object, and logs the error
 * responseText to the console.
 *
 * @param {object} err the error object returned by the server
 */
function errorFn(err) {
  console.log(err);
}

/**
 * Gets a random number from 0- total number of words (i.e. 9)
 *
 * @returns a random int from 0-numWords
 */
function getRandomInt() {
  return Math.floor(Math.random() * numWords);
}

/**
 * The purpose of this function is to get a word using the function "getRandomInt()" which is
 * stored in the variable, i.e currentWord. It is then used to get the audio and picture by adding
 * the file extension. The currentWord should not be the same as the word displayed in the previous
 * question.
 */
function getWord() {
  $("#bearImage").attr("draggable", true);
  let oldWord = sessionStorage.getItem("previousValue");
  //loop runs until the newly generated word is unique in comparison to the previous word
  do {
    currentWord = words[getRandomInt()];
  } while (currentWord === oldWord);
  previousValue = currentWord;
  sessionStorage.setItem("previousValue", previousValue);

  audioWord = currentWord + ".wav";
  let picture = currentWord + "Text.jpg";

  getWordImage(picture);
}

/**
 * This function is used to get the image of the answer.
 *
 * @param {picture} picture - image for given word in the question
 */
function getWordImage(picture) {
  let imgFile = "./images/" + picture;
  insertImage(imgFile);
  referenceNo = answers[currentWord];
}

/**
 * This function is used to get the audio for the word in the question and also play the audio after
 * clicking the volume button.
 *
 * @param {audio} audioWord - audio for correct answer
 */
function getAudio(audioWord) {
  let audio = "./audios/" + audioWord;
  let voice = new Audio(audio);
  voice.play();
}

/**
 * This function is used to display the score modal at the start of the program.
 */
function showScore() {
  getWord();
  clickScore();
  document.getElementById("scoreModal").style.display = "inline-block";
}

/**
 * The purpose of this function is to insert the images in the program.
 *
 * @param {picture} imgFile - the word image stored after it is generated randomly
 */
function insertImage(imgFile) {
  $("#newWord").html(
    "<div id='resultModal' class='col'></div>" +
      "<div id='sampleHide' class='col'><input class= 'btn btn-link' id='volume'  type='image' src='./images/vol.jpg' onclick='getAudio(audioWord)'>" +
      "<img id='textImage' src='" +
      imgFile +
      "' alt='questionText' draggable='false'>" +
      "<img id='addText' src='./images/kilText.jpg' alt='addText' hidden draggable='false' /></div>"
  );
  $("#scoreText").html("<div id= 'scoreModal' class ='col'></div>");
}

/**
 * This function is used to display the modal with clickable score.
 * Initially the score displayed is 0/0.
 * When the user starts answering the questions, the score is updated to 1/1, 1/2, etc.
 */
function clickScore() {
  $("#bearImage").attr("draggable", false);
  document.getElementById("sampleHide").style.display = "none";
  $("#scoreModal").html(
    "<div><span id='textScore'>click your score:</span><button id='score' class='scoreButton' alt='score' onclick='getWord()'>" +
      correctAnswer +
      "/" +
      totalAnswer +
      "</button></div>"
  );
}

/**
 * This function is used to display the modal with siowasi text after the user has answered the
 * question.
 */
function insertSiowasiModal() {
  document.getElementById("sampleHide").style.display = "none";
  $("#resultModal").html(
    "<button id = 'siButton' class = 'siowasiButton' alt='siowasi'onclick='refreshPage()'>si'owa'si?</button>"
  );
}

/**
 * This function is used to display the result modal after the question is answered.
 */
function show() {
  insertSiowasiModal();
  document.getElementById("resultModal").style.display = "inline-block";
}

/**
 * This function is used to reload the page to the start page.
*/
function refreshPage() {
  location.reload();
}

/**
 * The purpose of this function is to store the id of the element being
 * dragged in a common storage area, under the key "text".
 *
 * @param {Event} ev - is the event object loaded with "drag" event info
*/
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * The purpose of this function is to suspend the default behaviour so that instead the dragged element 
 * can potentially end up with a new position.
 *
 * @param {Event} ev - is the event object loaded with "dragover" event info
*/
function allowDrop(ev) {
  ev.preventDefault();

  document.getElementById(ev.target.id).style.opacity = 0.1;
  showAll(ev.target.id);
}

/**
 * This function is used to hide the images in the grid when the bear image is being dragged over it and
 * show the image when the bear image is no longer hovering over the image.
 *
 * @param {String} hideValue - name of image being hidden
 */
function showAll(hideValue) {
  words.forEach(function (element) {
    if (element != hideValue) {
      document.getElementById(element).style.opacity = 1;
    } else if (element == hideValue) {
      document.getElementById(hideValue).style.opacity = 0;
    }
  });
}

/**
 * The purpose of this function is: to allow a dropped element to acquire a new position; retrieve the
 * id of the dropped element using the key "text"; and to set the new position of the dropped
 * element; respectively. After the bear image is dropped, it will no longer be draggable.
 *
 * @param {Event} ev - is the event object loaded with "drop" event info
 */
function drop(ev) {
  let dropLocation = ev.target; //location of image where the bear is being dropprd (added by Raish)
  ev.preventDefault();

  let beingDragged = ev.dataTransfer.getData("text");

  ev.target.appendChild(document.getElementById(beingDragged));

  const droppedBear = ev.target.firstChild;
  dropLocation.parentNode.replaceChild(droppedBear, dropLocation);

  //doing this disables the user from dragging the bear even after the bear is dropped
  document.getElementById(beingDragged).draggable = false;

  searchAns(dropLocation.id);
  post();
}

/**
 * This method is used to assign the correct answer to imageNo.
 *
 * @param {String} targetID - name of the image
 */
function searchAns(targetID) {
  imageNo = answers[targetID];
  correctResponse();
}

/**
 * This function is used to display the stars and success text when bear image is dragged over the
 * correct image and the sunflower with some text for incorrect answer.
 *
 * 1 == when answer is correct
 * 2 == when answer is incorect
 *
 * @param {number} ans - value being passed after question is answered
 */
function displayStarOrSun(ans) {
  if (ans == 1) {
    // when the answer is correct
    [].forEach.call(
      document.querySelectorAll(".displayOnCorrect"),
      function (correctResponse) {
        correctResponse.hidden = false;
      }
    );
    show();
  } else if (ans == 2) {
    // when the answer is incorrect
    [].forEach.call(
      document.querySelectorAll(".displayOnIncorrect"),
      function (incorrectResponse) {
        incorrectResponse.hidden = false;
      }
    );
    show();
  }
}
