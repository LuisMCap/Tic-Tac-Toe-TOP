const Player = (move) => {
    setName = (player1Name, player2Name) => {
        this.playerNames = [player1Name, player2Name]
    };
    getPlayer1Name = () => {
        name = playerNames[0]
        return name.charAt(0).toUpperCase() + name.slice(1)
    };
    getPlayer2Name = () => {
        name = playerNames[1]
        return name.charAt(0).toUpperCase() + name.slice(1)
    };
    getMove = () => {
        return move
    };return {getMove, setName, getPlayer1Name, getPlayer2Name}}


const GameBoard = (() =>{
    let grid = [['box1','box2','box3'],
                ['box4','box5','box6'],
                ['box7','box8','box9']];

    let gameBoxes = document.querySelectorAll('.game-box');
    let count = 0;
    let boxesContent = []

    checkWinner = (box) => {
        let draw = 'Draw'
        for (j=0;j<3;j++){
            let lista = []
            for (i=0;i<3;i++) {
                updateGrid(i,j,box)
                lista.push(grid[i][j])
                if (lista.length == 3) {
                    let vertical = new Set(lista)
                    if (vertical.size == 1) {
                        setBoxesHTML()
                        return Array.from(vertical)[0]
                    }
                }
                 // CHECKS HORIZONAL WIN
                let horizontal = new Set(grid[i])
                if (horizontal.size  == 1) {
                    setBoxesHTML()
                    return Array.from(horizontal)[0]
                }
        
                // CHECKS DIAGONAL WIN
                if ((grid[0][0] == grid[1][1]) & (grid[2][2] == grid[1][1])) {
                    setBoxesHTML()
                    return grid[0][0]
                }
                else if ((grid[1][1] == grid[0][2])&(grid[1][1] == grid[2][0])) {
                    setBoxesHTML()
                    return grid[1][1]
                }
                if (count == 9) {
                    setBoxesHTML()
                    return draw
                }
                
            } 
        } 
     };

     updateGrid = (i,j,box) =>{
        if (grid[i][j] == box.id) {
            grid[i][j] = box.innerHTML
            count += 1}
     };

     setBoxesHTML = () => {
        gameBoxes.forEach(box =>{
            boxesContent.push(box.innerHTML)
         })
        console.log(boxesContent)
     }

     getBoxesHTML = () => {
         return boxesContent
     }

     getCount = () =>{
         return count
     }

    whoWon = () =>{
        gameBoxes.forEach(box => {
        box.addEventListener('click', e => {
            winner = checkWinner(box)
            if (winner) {
                return winner}
            })
        })
    };

    cleanBoard = () => {
        grid = [['box1','box2','box3'],
                ['box4','box5','box6'],
                ['box7','box8','box9']];
        count = 0
        boxesContent = []
    }
     
     return {checkWinner, whoWon, updateGrid, getCount, cleanBoard, getBoxesHTML}

    })()

const Game = (() =>{
    const xPlayer = Player('X');
    const oPlayer = Player('O');
    const gameBoxes = document.querySelectorAll('.game-box')
    const notValid = document.createElement('div')
    const informationCont = document.querySelector('.information-cont')
    const winnerText = document.querySelector('.winner')
    notValid.classList.add('not-allowed')
    notValid.innerHTML = 'Please select a legal move'

    game = () =>{
        IntroModal.closeModal(xPlayer)
        Modal.closeModal()
        gameBoxes.forEach(box => {
        box.addEventListener('click', e => {
            IntroModal.closeModal()
            playerMove(box)
            winner = GameBoard.checkWinner(box)
            if (winner) {
                showWinner(winner)
                // Player1HistoryCont.createSmallGrid()
                // Player1HistoryCont.setSmallGridMoves()
                Modal.openModal()}
            })
        })};

    showPlayerMove = (box,move) => {
        if (box.innerHTML == 'X' || box.innerHTML == 'O') {
            informationCont.append(notValid)}
        else {
            if (informationCont.contains(notValid)){
                informationCont.removeChild(notValid)
            }
            box.innerHTML = move
    }};

    playerMove = (box) => {
        if (GameBoard.getCount() % 2 == 0) {
            move = xPlayer.getMove()
        }
        else if (GameBoard.getCount() % 2 != 0) {
            move = oPlayer.getMove()
        }
        showPlayerMove(box,move)
    };

    resetGame = () => {
        GameBoard.cleanBoard()
        gameBoxes.forEach(box => {
            box.innerHTML = ''
        })
    };

    showWinner = (winner) => {
        winnerName = getWinnersName(winner)
        if (winnerName == 'DRAW!') {
            winnerText.innerHTML = winnerName
            return
        }
        winnerText.innerHTML = `${winnerName} WON!`
    };

    getWinnersName = (winner) => {
        if (winner == oPlayer.getMove()) {
            winnerName = oPlayer.getPlayer2Name()
            Player2HistoryCont.update()
        }
        else if (winner == 'Draw') {
            winnerName = 'DRAW!'
        }
        else if (winner == xPlayer.getMove()) {
            winnerName = xPlayer.getPlayer1Name()
            Player1HistoryCont.createSmallGrid()
            Player1HistoryCont.setSmallGridMoves()
            Player1HistoryCont.updateScore()
            Player1HistoryCont.resetList()
            Player1HistoryCont.cleanHistoryGrid()
        }
        return winnerName
    }

    return {game, resetGame}
})()

const Modal= (() => {
    const modal = document.querySelector('.modal-bg')
    const newGameBtn = document.querySelector('.btn')
    openModal = () =>{
        modal.classList.add('modal-active')
    };
    closeModal = () => {
        newGameBtn.addEventListener('click',e =>{
            modal.classList.remove('modal-active')
            Game.resetGame()
        })
    }
    return {openModal, closeModal}
})()

const IntroModal = (() => {
    const modal = document.querySelector('.intro-modal-bg')
    const submitBtn = document.querySelector('.submit-btn')
    const player1Input = document.getElementById('player1-name')
    const player2Input = document.getElementById('player2-name')
    closeModal =(xPlayer) => {
        submitBtn.addEventListener('click',e => {
            e.preventDefault()
            xPlayer.setName(player1Input.value, player2Input.value)
            Player1HistoryCont.setName(player1Input.value)
            Player2HistoryCont.setName(player2Input.value)
            modal.classList.remove('intro-modal-bg-active')
        })
    };

    return {closeModal}
})()

const Player1HistoryCont = (() => {
    const historyCont = document.getElementById('player1-grid')
    const playerName = document.getElementById('player1-hist-name')
    const playerScore = document.getElementById('player1-score')
    let gameSquares = []
    let score = 0
    createSmallGrid = () => {
        let gameGrid = document.createElement('div')
        gameGrid.classList.add('game-small')
        historyCont.prepend(gameGrid)
        for (i=1;i<10;i++) {
            let gameSquare = document.createElement('div')
            gameSquare.classList.add('small-box')
            gameSquare.id = `small-box${i}`
            gameGrid.append(gameSquare)
            gameSquares.push(gameSquare)
        }
    };
    setSmallGridMoves = () => {
        moves = GameBoard.getBoxesHTML()
        for (i=0;i<9;i++) {
            gameSquares[i].innerHTML = moves[i]
        }resetList()
    }

    setName = (inputVale) => {
        playerName.innerHTML = inputVale
    }

    resetList = () => {
        gameSquares = []
    }

    updateScore = () => {
        score +=1
        playerScore.innerHTML = score
    }

    cleanHistoryGrid = () => {
        if (historyCont.childElementCount >= 7) {
            historyCont.removeChild(historyCont.lastElementChild)
        }
    } 

    return {createSmallGrid, setSmallGridMoves, setName, updateScore, resetList, cleanHistoryGrid}
})()


const Player2HistoryCont = (() => {
    const historyCont = document.getElementById('player2-grid')
    const playerName = document.getElementById('player2-hist-name')
    const playerScore = document.getElementById('player2-score')
    let gameSquares = []
    let score = 0
    createSmallGrid = () => {
        let gameGrid = document.createElement('div')
        gameGrid.classList.add('game-small')
        historyCont.prepend(gameGrid)
        for (i=1;i<10;i++) {
            let gameSquare = document.createElement('div')
            gameSquare.classList.add('small-box')
            gameSquare.id = `small-box${i}`
            gameGrid.append(gameSquare)
            gameSquares.push(gameSquare)
        }
    };
    setSmallGridMoves = () => {
        moves = GameBoard.getBoxesHTML()
        for (i=0;i<9;i++) {
            gameSquares[i].innerHTML = moves[i]
        }resetList()
    }

    setName = (inputVale) => {
        playerName.innerHTML = inputVale
    }

    resetList = () => {
        gameSquares = []
    }

    updateScore = () => {
        score +=1
        playerScore.innerHTML = score
    }

    update = () => {
        createSmallGrid()
        setSmallGridMoves()
        updateScore()
        cleanHistoryGrid()
    }

    cleanHistoryGrid = () => {
        if (historyCont.childElementCount >= 7) {
            historyCont.removeChild(historyCont.lastElementChild)
        }
    } 

    return {createSmallGrid, setSmallGridMoves, setName, updateScore, update}
})()

Game.game()