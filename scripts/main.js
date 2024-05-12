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

//defining the base URL for the server
const SERVER_URL = "http://ugdev.cs.smu.ca:3056";

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
 * The purpose of this function is to GET a JSON object from the
 * server at the relative endpoint /myGet.
 *
 * Author: Terry Goldsmith - Wrote initial function
 *         Suyog Chitrakar - Adapted function for the project
 */
function get() {
  // attempt to GET a JSON object from endpoint http://ugdev.cs.smu.ca:3056/myGet
  // if (the middleware for this endpoint ran without error)
  //   call getSuccessFn
  // else
  //   call errorFn
  $.get(SERVER_URL + "/myGet", getSuccessFn).fail(errorFn);
}

/**
 * This function is used to check whether the answer is correct or not and display the success text or
 * incorrect text accordingly.
 *
 * Author: Swaraj Shrestha- Wrote initial function
 *         Raish Raj Joshi- funcition displayStarOrSun() with parameters, increments
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
 * The purpose of this function is to POST a JSON object to the
 * server at the relative endpoint /myPost.
 *
 * Adapted from @Terry_Goldsmith's code for Lab10.
 *
 * Author: Suyog Chitrakar - Wrote initial function
 *         Raish Raj Joshi - Updated objects
 */
function post() {
  // define the object to be posted
  const objects = { cAnswer: correctAnswer, inAnswer: incorrectAnswer };

  // attempt to POST obj to endpoint http://ugdev.cs.smu.ca:3056/myPost
  // if (the middleware for this endpoint ran without error)
  //   call postSuccessFn
  // else
  //   call errorFn
  $.post(SERVER_URL + "/myPost", objects, postSuccessFn).fail(errorFn);
}

/**
 * The purpose of this function is to log the JSON object received
 * from the server.
 *
 * Adapted from @Terry_Goldsmith's code for Lab10.
 *
 * Author: Suyog Chitrakar - Wrote initial function
 *
 * @param {object} returnedData contains the JSON object returned by the server
 */
function postSuccessFn(returnedData) {
  console.log(returnedData);
}

/**
 * The purpose of this function is to log the JSON object received
 * from the server.
 *
 * Author: Raish Raj Joshi- Wrote initial function
 *
 * @param {object} returnedData contains the JSON object returned by the server
 */
function getSuccessFn(returnedData) {
  correctAnswer = returnedData.cAnswer;
  incorrectAnswer = returnedData.inAnswer;

  // tally the total number of answers by adding the count for correct answers and incorrect answers
  totalAnswer = parseInt(correctAnswer) + parseInt(incorrectAnswer);

  showScore();
  console.log(returnedData);
}
/**
 * This function takes a single parameter, err, which is an error object, and logs the error
 * responseText to the console.
 *
 * Adapted from @Terry_Goldsmith's code for Lab10.
 *
 * Author: Suyog Chitrakar - Wrote initial function
 *
 * @param {object} err the error object returned by the server
 */
function errorFn(err) {
  console.log(err.responseText);
}

/**
 * Gets a random number from 0- total number of words (i.e. 9)
 *
 * Brought from: mikmaqGame.js by Sarah Derby
 * Author: Swaraj Shrestha- Wrote initial function
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
 *
 * Author: Swaraj Shrestha- Wrote initial function
 *         Raish Raj Joshi- set draggable for bear
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
 * Author: Swaraj Shrestha- Wrote initial function
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
 * Author: Swaraj Shrestha- Wrote initial function
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
 *
 * Author: Raish Raj Joshi- Wrote initial function
 *         Suyog Chitrakar- Added getWord() function
 */
function showScore() {
  getWord();
  clickScore();
  document.getElementById("scoreModal").style.display = "inline-block";
}

/**
 * The purpose of this function is to insert the images in the program.
 *
 * Author: Swaraj Shrestha- Wrote initial function
 *         Raish Raj Joshi- Added score modal
 *         Nicolas Sabbagha - Updated code
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
 *
 * Author: Suyog Chitrakar - Wrote initial function
 *         Raish Raj Joshi - Edited function to display value of variables, disable draggable for bear
 *         Nicolas Sabbagha - Updated code
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
 *
 * Author: Swaraj Shrestha- Wrote initial function
 *         Nicolas Sabbagha- Modified siowasi image to text
 */
function insertSiowasiModal() {
  document.getElementById("sampleHide").style.display = "none";
  $("#resultModal").html(
    "<button id = 'siButton' class = 'siowasiButton' alt='siowasi'onclick='refreshPage()'>si'owa'si?</button>"
  );
}

/**
 * This function is used to display the result modal after the question is answered.
 *
 * Author: Swaraj Shrestha- Wrote initial function
 */
function show() {
  insertSiowasiModal();
  document.getElementById("resultModal").style.display = "inline-block";
}

/**
 * This function is used to reload the page to the start page.
 *
 * Author: Swaraj Shrestha- Wrote initial function
 *
*/
function refreshPage() {
  location.reload();
}

/**
 * The purpose of this function is to store the id of the element being
 * dragged in a common storage area, under the key "text".
 *
 * This function runs as soon as an element has begun to be dragged.
 *
 * Author: Raish Raj Joshi- Wrote the initial function
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
 * This function runs when a dragged element is over a potential target.
 *
 * Author: Raish Raj Joshi- Wrote the initial function, Added parameters required and preventDefault()
 *         Suyog Chitrakar- Hiding images on hover
 *         Nicolas Sabbagha - Modified the parameters for the function
 *         Swaraj Shrestha- added the showAll()
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
 * Author: Swaraj Shrestha- Wrote initial function
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
 * Author: Raish Raj Joshi- Wrote initial function, set draggable to false after drop, post()
 *         Swaraj Shrestha- added the searchAns()
 *         Tania Terence- fixed bear image not appearing when dropped.
 *
 * @param {Event} - is the event object loaded with "drop" event info
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
 * Author: Swaraj Shrestha- Wrote initial function
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
 * Author: Raish Raj Joshi- Wrote initial function
 *
 * @param {number} ans - value being passed after question is answered
 */
function displayStarOrSun(ans) {
  if (ans == 1) {
    // when the answer is correct
    [].forEach.call(
      document.querySelectorAll(".displayOnCorrect"),
      /**
       * This is local function that unhides the content for correct answer; displays stars and
       * success text.
       *
       * Author: Raish Raj Joshi- Wrote the initial function
       *
       * parameter: correctResponse- images/ texts to be unhidden
       */
      function (correctResponse) {
        correctResponse.hidden = false;
      }
    );
    show();
  } else if (ans == 2) {
    // when the answer is incorrect
    [].forEach.call(
      document.querySelectorAll(".displayOnIncorrect"),
      /**
       * This is a local function that unhides the content for incorrect answer; displays sunflower
       * and oops text.
       *
       * Author Raish Raj Joshi- Wrote the initial function
       *
       * parameter: incorrectResponse- images/ texts to be unhidden
       */
      function (incorrectResponse) {
        incorrectResponse.hidden = false;
      }
    );
    show();
  }
}
