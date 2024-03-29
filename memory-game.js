"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const gameBoard = document.getElementById("game");
let startButton = document.createElement('button');
let scoreBoard = document.createElement('span');

const colors = shuffle(COLORS);

var gameInfo; //a timer for updating score

let flippedCards = 0;
let score = 0;
let matched = 0;


startButton.innerText = 'START';
gameBoard.appendChild(startButton);
createGame();





/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  for (let color of colors) {
    const card = document.createElement('div');
    card.classList.add('card', color);
    gameBoard.appendChild(card);
  }

  gameBoard.addEventListener('click', pickCard);
}

/** Flip a card face-up. */

function flipCard(card) {
    flippedCards++;
    score++;
    card.classList.replace('card','selected');
    card.style.backgroundColor = card.classList[1];
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.replace('selected', 'card')
  card.style.backgroundColor = 'white';
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {

  if (!evt.target.classList.contains('selected') && !evt.target.classList.contains('match') &&  flippedCards < 2) {
    flipCard(evt.target);
  }

  if ( flippedCards === 2) {
    let cSelect = document.querySelectorAll('.selected');

    if (cSelect[0].classList[1] === cSelect[1].classList[1]) {
      cSelect.forEach(card => card.classList.replace('selected','match'));
      flippedCards = 0;
      matched += 2;
        if (matched === colors.length) {
          winGame();
        }
    } else {
      gameBoard.removeEventListener('click', pickCard);
      setTimeout(function() {
        cSelect.forEach(card => unFlipCard(card));
         flippedCards = 0
        gameBoard.addEventListener('click', pickCard)
      }, FOUND_MATCH_WAIT_MSECS);
    }
  }
}

function pickCard(e) {
  if (e.target.classList.contains('card')) {
    handleCardClick(e);
  }
}

function createGame() {
  startButton.addEventListener('click', function() {
    let cards = document.querySelectorAll('.match');
    for (let card of cards) {
      card.remove();
    }
    score = 0;
    createScore();
    createCards(colors);
    startButton.remove();
  });
}

function createScore () {
  let body = document.querySelector('body');
  scoreBoard.innerText = 'Score: ' + score;
  body.insertBefore(scoreBoard,gameBoard);
  gameInfo = setInterval(function () {
    scoreBoard.innerText = 'Score: ' + score;
  }, 500);
}

function winGame() {
  clearInterval(gameInfo);
  matched = 0;
  if (score < JSON.parse(localStorage.getItem('bestScore'))
      || JSON.parse(localStorage.getItem('bestScore')) === null) {
    localStorage.setItem('bestScore', JSON.stringify(score));
  }
  scoreBoard.innerText = "You Win! Score: " + score + " Your best score: " + localStorage.getItem('bestScore');
  startButton.innerText = "RESTART"
  gameBoard.appendChild(startButton);
}
