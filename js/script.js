(function() {

var gameContainer = document.querySelector('.container');
var humanPlayer = {
  name: 'Arif',
  symbol: '<i class="fa fa-times"></i>'
};
var aiPlayer = {
  name: 'Computer',
  symbol: '<i class="fa fa-circle-o"></i>'
};
var currentPlayer = humanPlayer;
var winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var againstComputer = true;

var gameData = [];
for(var i = 0; i < 9; i++) gameData[i] = {checked: false};


function renderScreen() {
  var html = '';
  gameData.forEach(function(item, index) {
    if(index === 0) 
      html += '<div class="row clearfix">';
    else if(index === 3 || index === 6)
      html += '</div><div class="row clearfix">';
    // <i class="fa fa-times"></i>
    var symbol = item.checked ? item.player.symbol : '';
    html += '<div class="cell"><div class="cell-inner" data-index="'+index+'">'+symbol+'</div></div>';

    if(index === 9)
      html += '</div>';
  });
  html += "</div>";
  gameContainer.innerHTML = html;
}

renderScreen();

function changePlayer() {
  if(currentPlayer === humanPlayer)
    currentPlayer = aiPlayer;
  else
    currentPlayer = humanPlayer;
}

function winning(gameData, player) {
  return winningCombinations.some(function(combinations) {
    return combinations.every(function(item) {
      return gameData[item].checked && gameData[item].player === player;
    });
  });
}

gameContainer.addEventListener('click', function(e) {
  var cell = e.target;
  if(cell.matches('.cell-inner')) {
    var index = cell.getAttribute('data-index');
    if(!gameData[index].checked) {
      gameData[index].checked = true;
      gameData[index].player = currentPlayer;
      renderScreen();
      if(winning(gameData, currentPlayer)) {
        alert(currentPlayer.name + ' won!');
        return false;
      }
      changePlayer();
      if(againstComputer) {
        computerPay();
      }
    }
  }
});

function computerPay() {
  var spot = bestSpot();
  gameData[spot].checked = true;
  gameData[spot].player = currentPlayer;
  renderScreen();
  if(winning(gameData, currentPlayer)) {
    alert(currentPlayer.name + ' won!');
  }
  changePlayer();
}

function bestSpot() {
  return minimax(gameData, currentPlayer).index;
}

function emptySpot() {
  return gameData.reduce(function(acc, cur, index) {
    if(!cur.checked) acc.push(index);
    return acc;
  }, []);
}

function minimax(newGameData, player) {
  var availableSpot = emptySpot();
  if(winning(newGameData, aiPlayer)) {
    return {score: 10};
  } else if(winning(newGameData, humanPlayer)) {
    return {score: -10};
  } else if(availableSpot.length === 0) {
    return {score: 0};
  }

  var moves = [];
  for(var i = 0; i < availableSpot.length; i++) {
    var move = {};
    move.index = availableSpot[i];
    var data = newGameData[availableSpot[i]];
    newGameData[availableSpot[i]] = {checked: true, player: player};
    if(player === aiPlayer) {
      var result = minimax(newGameData, humanPlayer);
      move.score = result.score;
      move.user = humanPlayer;
    } else {
      var result = minimax(newGameData, aiPlayer);
      move.score = result.score;
      move.user = aiPlayer;
    }
    newGameData[availableSpot[i]] = data;
    moves.push(move);
  }

  var bestMove;
  if(player === aiPlayer) {
    var bestScore = -1000;
    for(var i = 0; i < moves.length; i++) {
      if(moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 1000;
    for(var i = 0; i < moves.length; i++) {
      if(moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

})();