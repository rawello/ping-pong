const btnEasy = document.getElementById('easy');
const btnMed = document.getElementById('medium');
const btnHard = document.getElementById('hard');


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


let pauseState = true;
let compSpeed = 1.75;
let ballSpeed = 5.0;
let ballState = 1;
let touchCount = 1;
let rndPause = 0;
let prevPoints = [0, 0];

let player = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: 5,
    score: 0,
    name: ""
};

let computer = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    speed: compSpeed,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '45px Arial';
    ctx.fillText(text, x, y);
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawRect(player.x, player.y, player.width, player.height, 'white');
    drawRect(computer.x, computer.y, computer.width, computer.height, 'white');
    drawCircle(ball.x, ball.y, ball.radius, 'white');
    drawText(player.name, 150, 50, 'white');
    drawText("GigaChat", 500, 50, 'white');
    drawText(player.score, canvas.width / 4, 100, 'white');
    drawText(computer.score, (3 * canvas.width) / 4, 100, 'white');
}

function renderBeforeStart() {
    drawText("Нажмите чтобы продолжить", 125, 300, 'white');
}

function renderPause() {
    console.log(prevPoints, player.score, computer.score)
    if (prevPoints == [player.score, computer.score]) {
        drawText("Вылет!", 335, 300, 'white');
    } else {
        drawText("Очко!", 335, 300, 'white');
    }
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall() {
    rndPause = 1;
    pauseState = true;
    setTimeout(() => {
        if (player.score == 11) {
            alert("Победа");
            setEasy();
            computer.score = player.score = 0;
            let win = document.createElement("H1");
            win.id = "afterwin";
            win.textContent = player.name + " победил GigaChat со счетом " + player.score + " vs " + computer.score;
            document.body.appendChild(win);
        }
        else if (computer.score == 11) {
            alert("Поражение");
            setEasy();
            computer.score = player.score = 0;
            let win = document.createElement("H1");
            win.id = "afterwin";
            win.textContent = "GigaChat победил " + player.name + " со счетом " + computer.score + " vs " + player.score;
            document.body.appendChild(win);
        }

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;

        switch (ballState) {
            case 1:
                ball.speed = 5.0 * 0.75;
                break
            case 2:
                ball.speed = 12.5 * 0.75;
                break;
            case 3:
                ball.speed = 18.5 * 0.75;
                break;
            default:
                ball.speed = 5.0;
                break;
        }

        ball.velocityX = -ball.velocityX;
        ball.velocityY = 3;
        pauseState = false;
        rndPause = 0;
    }, 600);
}

function computerMovement() {
    let center = computer.y + computer.height / 2;

    if (center < ball.y - 35) {
        computer.y += computer.speed;
    } else if (center > ball.y + 35) {
        computer.y -= computer.speed;
    }
}

let i = 0;
function game() {
    btnEasy.addEventListener('click', function () {
        setEasy();
    })

    btnMed.addEventListener('click', function () {
        setMedium();
    })

    btnHard.addEventListener('click', function () {
        setHard();
    })

    render();
    if (!rndPause) {
        renderBeforeStart();
    } else {
        renderPause();
    }
    if (!pauseState) {
        update();
        render();
    }
    for (; i == 0; i++) {
        player.name = prompt("Введите имя: ").replace(/\s+/g, "")
        if (player.name.length < 3) {
            i--;
            alert("Длина имени не менее 3 символов.")
        }
    }
}

function setEasy() {
    computer.speed = 1.75;
    ball.speed = 5.0;
    ballState = 1;
}

function setMedium() {
    computer.speed = 5.75;
    ball.speed = 12.5;
    ballState = 2;
}

function setHard() {
    computer.speed = 15.0;
    ball.speed = 18;
    ballState = 3;
}

function update() {
    prevPoints = [player.score, computer.score];

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    computerMovement();

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    let playerPaddle = (ball.x - ball.radius < player.x + player.width) &&
        (player.y < ball.y + ball.radius && player.y + player.height > ball.y - ball.radius);

    let computerPaddle = (ball.x + ball.radius > computer.x) &&
        (computer.y < ball.y + ball.radius && computer.y + computer.height > ball.y - ball.radius);

    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }

    if (ball.y + ball.radius < 0 || ball.y - ball.radius > canvas.height) {
        resetBall();
    }

    if (playerPaddle) {
        ball.speed += touchCount * 0.0025;
        let collisionPoint = (ball.y - (player.y + player.height / 2));
        collisionPoint = collisionPoint / (player.height / 2);

        let angle = (collisionPoint * Math.PI) / 4;

        ball.velocityX = ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        ball.speed += 0.0025;
        computer.speed += 0.005;
        touchCount++;
    } else if (computerPaddle) {
        ball.speed += touchCount * 0.025;
        let collisionPoint = (ball.y - (computer.y + computer.height / 2));
        collisionPoint = collisionPoint / (computer.height / 2);

        let angle = (collisionPoint * Math.PI) / 4;

        ball.velocityX = -ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        ball.speed += 0.0025;
        touchCount++;
    }
}

canvas.addEventListener('mousemove', function (e) {
    let rect = canvas.getBoundingClientRect();
    player.y = e.clientY - rect.top - player.height / 2;
});


canvas.addEventListener('click', function () {
    pauseState = !pauseState;
})

setInterval(game, 1000 / 60);
