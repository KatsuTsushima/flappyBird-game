kaboom();

const GRAVITY = 3200;
const WIDTH = width();
const HEIGHT = height();

const BACKGROUND_COLOR = Color.fromHex('#b6e5ea');
const PIPE_COLOR = Color.fromHex('#74c02e');

const PIPE_WIDTH = 64;
const PIPE_BORDER = 4;
const PIPE_OPEN = 240;
const PIPE_MIN_HEIGHT = 60; 

const JUMP_FORCE = 800;
const SPEED = 320;
const CEILING = -60;

loadSprite('bird', '/img/bird.png');

loadSound('hit', '/sounds/hit.mp3');
loadSound('jump', '/sounds/jump.mp3');
loadSound('score', '/sounds/score.mp3');

setGravity(GRAVITY);

setBackground(BACKGROUND_COLOR);

const startGame = () => {
	go("game");
}

scene("game", () => {
	let score = 0;

	const game = add([timer()]);

	const createBird = () => {
		const bird = game.add([
			sprite("bird"),
			pos(WIDTH / 4, 0),
			area(),
			body(),
		])

		return bird;
	}

	const bird = createBird();
	
	const jump = () => {
		bird.jump(JUMP_FORCE);
		play("jump");
	}

	onClick(jump);
	onKeyPress('space', jump);

	const createPipes = () => {
		const topPipeHeight = rand(PIPE_MIN_HEIGHT,
			HEIGHT - PIPE_MIN_HEIGHT - PIPE_OPEN
			);
		
		const bottomPipeHeight = HEIGHT - topPipeHeight - PIPE_OPEN;

		game.add([
			rect(PIPE_WIDTH, topPipeHeight),
			pos(WIDTH, 0),
			color(PIPE_COLOR),
			outline(PIPE_BORDER),
			area(),
			move(LEFT, SPEED),
			offscreen({ destroy: true}),
			"pipe",
		]);

		game.add([
			rect(PIPE_WIDTH, bottomPipeHeight),
			pos(WIDTH, topPipeHeight + PIPE_OPEN),
			color(PIPE_COLOR),
			outline(PIPE_BORDER),
			area(),
			move(LEFT, SPEED),
			offscreen({ destroy: true}),
			"pipe",
			{ passed: false },
		]);
	}

	game.loop(1, createPipes);
	bird.onUpdate(() => {
		const birdPosY = bird.pos.y;

		if (birdPosY > HEIGHT || birdPosY <= CEILING) {
			go("lose");
		}
	});

	bird.onCollide(()=>{
		play("hit");
		go("lose", score);
	})

	const createScoreLable = () => {
		const scroeLabel = game.add([
			text(score),
			anchor("center"),
			pos(WIDTH / 2, 80),
			scale(2),
			fixed(),
			z(100),
		]);
		return scroeLabel;
	}
	const scoreLabel = createScoreLable();

	const addScore = () => {
		score++;
		scoreLabel.text = score;

		play("score");
	}

	onUpdate("pipe", pipe => {
		if (bird.pos.x > pipe.pos.x + pipe.width && pipe.passed === false) {
			addScore();
			pipe.passed = true;
		}
	})
});

scene("lose", (score = 0) => {

	add([
		text("Набрано очков:" + score),
		pos(center()),
		scale(3),
		anchor("center"),
	]);

	onKeyPress('space', startGame);
	onClick(startGame); 
});

startGame();