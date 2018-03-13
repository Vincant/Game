
var game_js_app = function (element, options) {

  function GameJS() {
    //create Html elements
    var gameHolder = document.querySelector(element);
    gameHolder.classList.add('game-holder');

    var $this = this;

    $this.gameBox = document.createElement('div');
    $this.gameBox.classList.add('game-box');

    var gameStartBtn = document.createElement('button');
    gameStartBtn.id = 'startBtn';
    gameStartBtn.appendChild(document.createTextNode('Start/Stop'));

    var gameClearBtn = document.createElement('button');
    gameClearBtn.id = 'clearBtn';
    gameClearBtn.appendChild(document.createTextNode('Clear'));

    gameHolder.appendChild($this.gameBox);
    gameHolder.appendChild(gameStartBtn);
    gameHolder.appendChild(gameClearBtn);

  //create Variables
    $this.elems = [];
    $this.coloredTotal = 0;
    $this.oldColoredStr = '';
    $this.newColoredStr = '';
    $this.gameOn = null;
    $this.gameState = false;

  // set up settings, default or customs.
    $this.options = options;

    var defaultOptions = {
      cols: 30,
      rows: 30,
      elemWidth: 15,
      elemHeight: 15,
      timeInterval: 100
    };

    var settings = Object.assign({}, defaultOptions, options);

    $this.cols = settings.cols;
    $this.rows = settings.rows;
    $this.elemWidth = settings.elemWidth;
    $this.elemHeight = settings.elemHeight;
    $this.timeInterval = settings.timeInterval;

  // add events to buttons control
    $this.gameBox.addEventListener('click', function (event){
      var current = event.target;
      var cords = current.id.split('_');
      var y = cords[0];
      var x = cords[1];

      if(!current.classList.contains('colored')){
        current.classList.add('colored');
        $this.elems[y][x].colored = true;
        $this.coloredTotal ++;
      }
      else{
        current.classList.remove('colored');
        $this.elems[y][x].colored = false;
        $this.coloredTotal --;
      }
    });

    gameStartBtn.addEventListener('click', function(){
      if($this.coloredTotal !== 0 && $this.gameState === false){
        $this.startGame();
      }
      else{
        $this.stopGame();
      }
    });

    gameClearBtn.addEventListener('click', function (){
      $this.stopGame();
      $this.coloredTotal = 0;
      $this.elems = [];
      $this.createElems();
      $this.createGrid();
    });
  }

///////////////////////////////////////////////////////

  // initialisation game
  GameJS.prototype.gameInit = function() {
    var $this = this;
    $this.createBox();
    $this.createElems();
    $this.createGrid();
  };

  // start game
  GameJS.prototype.startGame = function(){
    var $this = this;
    var timeInterval = $this.timeInterval;
    $this.gameState = true;
    var newStep = function(){
      console.time('timeOneStep');
      $this.checkElems();
      $this.createGrid();
      console.timeEnd('timeOneStep');
    };
    $this.gameOn = setInterval(newStep, timeInterval);
  };

  // stop game
  GameJS.prototype.stopGame = function() {
    var $this = this;
    clearInterval($this.gameOn);
    $this.gameState = false;
  };

  // create html wrapper for elements
  GameJS.prototype.createBox = function() {
    var $this = this;
    var boxHeight = $this.elemHeight * $this.rows;
    var boxWidth = $this.elemWidth * $this.cols;
    $this.gameBox.style.height = boxHeight + 'px';
    $this.gameBox.style.width = boxWidth + 'px';
  };

  // create grid from html elements
  GameJS.prototype.createGrid = function() {
    var $this = this;
    var rows = $this.rows;
    var cols = $this.cols;
    var elemHeight = $this.elemHeight;
    var elemWidth = $this.elemWidth;
    var squares = '';
    var elems = $this.elems;

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var id = y+'_'+x;
        if(elems[y][x].colored === true){
          squares += '<span id="'+ id +'" class="colored" style="height: '+ elemHeight +'px; width: '+ elemWidth +'px;"></span>';
        }
        else{
          squares += '<span id="'+ id +'" style="height: '+ elemHeight +'px; width: '+ elemWidth +'px;"></span>';
        }
      }
    }
    $this.gameBox.innerHTML = squares;
  };

  // create arrey with object for each elements
  GameJS.prototype.createElems = function() {
    var $this = this;
    var rows = $this.rows;
    var cols = $this.cols;

    var Elem = {
      id: '',
      colored: false
    };

    var elems = $this.elems;

    for (var y = 0; y < rows; y++) {
      var arr = [];
      for (var x = 0; x < cols; x++) {
        var elem = Object.create(Elem);
        arr.push(elem);
      }
      elems.push(arr);
    }
  };

  // check each elements if he had prop. colored = true
  GameJS.prototype.checkElems  = function() {
    var $this = this;
    var rows = $this.rows;
    var cols = $this.cols;
    $this.coloredTotal = 0;
    $this.newColoredStr = '';

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {

        var elem = $this.elems[y][x];

        if(elem.colored === true){
          $this.coloredTotal ++;
          $this.newColoredStr += '1';
        }
        else{
          $this.newColoredStr += '0';
        }

        var elemNeighborsColored = $this.checkElemNeighbors(y, x);

        if(elemNeighborsColored === 3){
          elem.colored = true;
        }
        else if(elemNeighborsColored < 2 || elemNeighborsColored > 3){
          elem.colored = false;
        }
      }
    }
    if($this.newColoredStr === $this.oldColoredStr){
      alert('Game Over');
      $this.stopGame();
      $this.gameState = false;
    }
    $this.oldColoredStr = $this.newColoredStr;
  };

// check 8 neighbors for each elements if they had prop. colored = true
  GameJS.prototype.checkElemNeighbors = function(y, x) {
    var $this = this;
    var arrRows = $this.rows -1;
    var arrCols = $this.cols -1;
    var result = 0;

    function vector(x1, y1){
      var nY = y + y1;
      var nX = x + x1;

      if(nY < 0){
        nY = arrRows;
      }else if(nY > arrRows){
        nY = 0
      }
      if(nX < 0){
        nX = arrCols;
      }else if(nX > arrCols){
        nX = 0;
      }
      if ($this.elems[nY][nX].colored === true) {
        result += 1;
      }
    }
    vector(-1, -1);
    vector(-1, 0);
    vector(-1, 1);
    vector(0, 1);
    vector(1, 1);
    vector(1, 0);
    vector(1, -1);
    vector(0, -1);

    return result;
  };

  var game_js = new GameJS();
  game_js.gameInit();
};
  //////////////////////////////////////////////
//set custom options and initial new game

  var options = {
    cols: 25,
    rows: 25,
    elemWidth: 25,
    elemHeight: 25,
    timeInterval: 100
  };

  game_js_app('#game-js', options);