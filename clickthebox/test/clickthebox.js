var score = 0;

// initialize the game.
function onGameStart(){
    document.getElementById("start-game").style.display = "none";
    document.getElementById("time-left").style.display = "block";
    document.getElementById("game-box").style.display = "block";
    document.getElementById("score").style.display = "block";
} 

// get the score
function getScore() {
   return score;
}

// add score to the player
function addScore(point) {
  score += point;
  document.getElementById("score").innerHTML = "Score: " + getScore();
}