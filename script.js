
    var Elem = {
        // y: '',
        // x: '',
        id: '',
        colored: false
    }
///////////////////////////////////////////////////////////////


    var wrapper = document.querySelector('.wrapper');

    var box = document.createElement('div');
        box.id = 'box';
        wrapper.appendChild(box);

    var startBtn = document.createElement('button');
        startBtn.id = 'startBtn';
        startBtn.appendChild(document.createTextNode('Start/Stop'));
        wrapper.appendChild(startBtn);

    var clearBtn = document.createElement('button');
        clearBtn.id = 'clearBtn';
        clearBtn.appendChild(document.createTextNode('Clear'));
        wrapper.appendChild(clearBtn);

    var setting = {
        cols: 50,
        rows: 50,
        elemWidth: 10,
        elemHeight: 10
    }

    function createBox(setting) {
        var boxHeight = setting.elemHeight * setting.rows;
        var boxWidth = setting.elemWidth * setting.cols;
        box.style.height = boxHeight + 'px';
        box.style.width = boxWidth + 'px';
    }
    createBox(setting);


//////////////////////////////////////////////////////////

    var rows = setting.rows;
	var cols = setting.cols;
	var arrRows = rows -1;
	var arrCols = cols -1;

    function elemNeighbors(y, x, elemNbs) {
        function vector(Y, X){
            var nY = y + Y;
            var nX = x + X;

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
            elemNbs.push(nY+'_'+nX);
        }
        vector(-1, -1);
        vector(-1, 0);
        vector(-1, 1);
        vector(0, 1);
        vector(1, 1);
        vector(1, 0);
        vector(1, -1);
        vector(0, -1);
    }

    var elems = [];

    function createElems() {
        for (var y = 0; y < rows; y++) {
            var arr = [];
            for (var x = 0; x < cols; x++) {
                var elem = Object.create(Elem);
                arr.push(elem);
                var elemNbs = elem.neighbors = [];
                elemNeighbors(y, x, elemNbs);
            }
            elems.push(arr);
        }
    }
    createElems();

    function paintGrid() {
        var squares = '';
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                var id = y+'_'+x;
                if(elems[y][x].colored == true){
                    squares += '<span id="'+ id +'" class="colored"></span>';
                }
                else{
                    squares += '<span id="'+ id +'"></span>';
                }
            }
        }
        box.innerHTML = squares;
    }
    paintGrid();

    function setupElems() {
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                var elem = elems[y][x];
                var elemNbs = elem.neighbors;
                var result = 0;
                for (var k = 0; k < 8; k++){
                    elemNbs[k].split('_');
                    var cords = elemNbs[k].split('_');
                    var y1 = cords[0];
                    var x1 = cords[1];
                    var elemNb = elems[y1][x1];
                    if(elemNb.colored == true){
                        result += 1;
                    }
                }
				if(result == 3){
					elem.colored = true
				}
				else if(result < 2 || result > 3){
					elem.colored = false
				}
            }
        }
    }

    box.addEventListener('click', function (event){
        var current = event.target;
        var cords = current.id.split('_');
        var y = cords[0];
        var x = cords[1];
        var elem = elems[y][x];

        if(!current.classList.contains('colored')){
            current.classList.add('colored');
            elem.colored = true;
        }
        else{
            current.classList.remove('colored');
            elem.colored = false;
        }
    });

    clearBtn.addEventListener('click', function (){
        if(!box.classList.contains('start')){   // GRID re-setUp if game is stopped
            elems = [];
            createElems();
            paintGrid();
        }
    });

    startBtn.addEventListener('click', function (){
        box.classList.toggle('start');
        function timeout() {
            setTimeout(function () {
                setupElems();
                paintGrid();
                if(box.classList.contains('start')){
                    timeout();
                }
            }, 100);
        }
        timeout();
    });







