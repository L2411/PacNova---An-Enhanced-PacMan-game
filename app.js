document.addEventListener("DOMContentLoaded", () => {
    const scoreDisplay = document.getElementById("score")
    const width = 28
    let score = 0
    scoreDisplay.textContent = score;

    const grid = document.querySelector(".grid")

    // Prevent arrow keys from scrolling the page while playing
    window.addEventListener("keydown", (evt) => {
        const keysThatMove = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        if (keysThatMove.includes(evt.key)) {
            evt.preventDefault();
        }
    }, { passive: false });

    // helper to add facing class
    function setPacmanDirection(dir) {
      squares.forEach(sq => { sq && sq.classList.remove("dir-left","dir-right","dir-up","dir-down") })
      const el = squares[pacmanCurrentIndex];
      if (!el) return;
      el.classList.add(`dir-${dir}`);
    }

    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    // 0 - pac-dots
    // 1 - wall
    // 2 - ghost-lair
    // 3 - power-pellet
    // 4 - empty

    const squares = [];

    // create board
    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement("div")
            square.id = i
            grid.appendChild(square)
            squares.push(square)

            if (layout[i] === 0) {
                squares[i].classList.add("pac-dot")
            } else if (layout[i] === 1) {
                squares[i].classList.add("wall")
            } else if (layout[i] === 2) {
                squares[i].classList.add("ghost-lair")
            } else if (layout[i] === 3) {
                squares[i].classList.add("power-pellet");
                // small stagger so pellets pop-in slightly
                setTimeout(() => squares[i].classList.add("bounce"), i * 6);
            }
        }
    }
    createBoard()

    // create characters
    let pacmanCurrentIndex = 490
    squares[pacmanCurrentIndex].classList.add("pac-man")

    // move pacman
    function movePacman(e) {
        squares[pacmanCurrentIndex].classList.remove("pac-man")
        switch (e.key) {
            case "ArrowLeft":
                if (
                    pacmanCurrentIndex % width !== 0 &&
                    !squares[pacmanCurrentIndex - 1].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")
                ) {
                    pacmanCurrentIndex -= 1
                }
                if ((pacmanCurrentIndex - 1) === 363) {
                    pacmanCurrentIndex = 391
                }
                setPacmanDirection("left");
                break
            case "ArrowUp":
                if (
                    pacmanCurrentIndex - width >= 0 &&
                    !squares[pacmanCurrentIndex - width].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")
                ) {
                    pacmanCurrentIndex -= width
                }
                setPacmanDirection("up");
                break
            case "ArrowRight":
                if (
                    pacmanCurrentIndex % width < width - 1 &&
                    !squares[pacmanCurrentIndex + 1].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")
                ) {
                    pacmanCurrentIndex += 1
                }
                if ((pacmanCurrentIndex + 1) === 392) {
                    pacmanCurrentIndex = 364
                }
                setPacmanDirection("right");
                break
            case "ArrowDown":
                if (
                    pacmanCurrentIndex + width < width * width &&
                    !squares[pacmanCurrentIndex + width].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")
                ) {
                    pacmanCurrentIndex += width
                }
                setPacmanDirection("down");
                break
        }
        squares[pacmanCurrentIndex].classList.add("pac-man")
        pacDotEaten()
        powerPelletEaten()
        checkForGameOver()
        checkForWin()
    }
    document.addEventListener("keyup", movePacman)

    // pac-dot eaten
    function pacDotEaten() {
        if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
            score++
            scoreDisplay.innerHTML = score
            squares[pacmanCurrentIndex].classList.remove("pac-dot")
        }
    }

    // power pellet eaten
    function powerPelletEaten() {
        if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
            score += 10
            scoreDisplay.innerHTML = score
            ghosts.forEach(ghost => ghost.isScared = true)
            setTimeout(unScareGhosts, 10000)
            squares[pacmanCurrentIndex].classList.remove("power-pellet")
        }
    }

    // unscare ghosts
    function unScareGhosts() {
        ghosts.forEach(ghost => ghost.isScared = false)
    }

    // Ghost constructor
    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className
            this.startIndex = startIndex
            this.speed = speed
            this.currentIndex = startIndex
            this.isScared = false
            this.timerId = NaN
        }
    }

    // ghosts
    const ghosts = [
        new Ghost("blinky", 348, 250),
        new Ghost("pinky", 376, 400),
        new Ghost("inky", 351, 300),
        new Ghost("clyde", 379, 500),
    ]

    // draw ghosts with eyes
    ghosts.forEach(ghost => {
        const cell = squares[ghost.currentIndex];
        if (!cell) return;
        cell.classList.add(ghost.className, "ghost");
        if (!cell.querySelector(".eye")) {
            const eye1 = document.createElement("span");
            eye1.className = "eye";
            const pupil1 = document.createElement("span");
            pupil1.className = "pupil";
            eye1.appendChild(pupil1);
            const eye2 = eye1.cloneNode(true);
            cell.appendChild(eye1);
            cell.appendChild(eye2);
        }
    });

    // move ghosts
    ghosts.forEach(ghost => moveGhost(ghost))

    function moveGhost(ghost) {
        const directions = [-1, 1, width, -width]
        let direction = directions[Math.floor(Math.random() * directions.length)]

        ghost.timerId = setInterval(function () {
            const targetIndex = ghost.currentIndex + direction;
            const targetCell = squares[targetIndex];

            if (
                targetCell &&
                !targetCell.classList.contains("ghost") &&
                !targetCell.classList.contains("wall")
            ) {
                const prevCell = squares[ghost.currentIndex];
                if (prevCell) {
                    prevCell.classList.remove(ghost.className, "ghost", "scared-ghost");
                    prevCell.querySelectorAll('.eye').forEach(n => n.remove());
                }

                ghost.currentIndex += direction;

                const newCell = squares[ghost.currentIndex];
                if (newCell) {
                    newCell.classList.add(ghost.className, "ghost");
                    if (!newCell.querySelector('.eye')) {
                        const eye1 = document.createElement("span");
                        eye1.className = "eye";
                        const pupil1 = document.createElement("span");
                        pupil1.className = "pupil";
                        eye1.appendChild(pupil1);
                        const eye2 = eye1.cloneNode(true);
                        newCell.appendChild(eye1);
                        newCell.appendChild(eye2);
                    }
                }
            } else {
                direction = directions[Math.floor(Math.random() * directions.length)]
            }

            if (ghost.isScared) {
                const scaredCell = squares[ghost.currentIndex];
                if (scaredCell) scaredCell.classList.add("scared-ghost")
            }

            if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man")) {
                const eatenCell = squares[ghost.currentIndex];
                if (eatenCell) {
                    eatenCell.classList.remove(ghost.className, "ghost", "scared-ghost");
                    eatenCell.querySelectorAll('.eye').forEach(n => n.remove());
                }

                ghost.isScared = false
                ghost.currentIndex = ghost.startIndex

                score += 100
                scoreDisplay.innerHTML = score

                const startCell = squares[ghost.currentIndex];
                if (startCell) {
                    startCell.classList.add(ghost.className, "ghost");
                    if (!startCell.querySelector('.eye')) {
                        const eye1 = document.createElement("span");
                        eye1.className = "eye";
                        const pupil1 = document.createElement("span");
                        pupil1.className = "pupil";
                        eye1.appendChild(pupil1);
                        const eye2 = eye1.cloneNode(true);
                        startCell.appendChild(eye1);
                        startCell.appendChild(eye2);
                    }
                }
            }

            checkForGameOver()
        }, ghost.speed)
    }

    // check for game over
    function checkForGameOver() {
        if (
            squares[pacmanCurrentIndex].classList.contains("ghost") &&
            !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener("keyup", movePacman)
            setTimeout(function () {
                alert("Game Over")
            }, 500)
        }
    }

    // check for win
    function checkForWin() {
        // winning threshold (originally 274)
        if (score >= 274) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener("keyup", movePacman)
            setTimeout(function () {
                alert("You have WON!")
            }, 500)
        }
    }

    // simple Start / Pause / Restart controls
    const startBtn = document.getElementById("start");
    const pauseBtn = document.getElementById("pause");
    const restartBtn = document.getElementById("restart");

    startBtn.addEventListener("click", () => {
        // re-enable key controls if removed
        document.addEventListener("keyup", movePacman)
        // start ghost movement if they were stopped (if timerId NaN, relaunch)
        ghosts.forEach(ghost => {
            if (isNaN(ghost.timerId)) moveGhost(ghost)
        })
    });

    pauseBtn.addEventListener("click", () => {
        // pause ghosts and disable keys
        ghosts.forEach(ghost => {
            clearInterval(ghost.timerId);
            ghost.timerId = NaN;
        });
        document.removeEventListener("keyup", movePacman)
    });

    restartBtn.addEventListener("click", () => {
        // reload page for a clean restart (simple and reliable)
        location.reload();
    });
});
