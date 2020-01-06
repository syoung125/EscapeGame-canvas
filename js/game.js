
//we expose the game variable to the global scope
//so we can access it from everywhere
var game;

var keysPressed = {};
var controls = {
	Left: "ArrowLeft",
	Up: "ArrowUp",
	Right: "ArrowRight",
	Down: "ArrowDown",
	Hide: "h",
	Box: "b",
	Space: " "
}

//healthBar info
var hBarH = 40, hBarB = 4; 	//height, border

//gameMap1 info
var tileW = 10, tileH = 10;
var mapW = 17, mapH = 12;


/**
* Executed when the DOM is fully loaded
*/
function init(){
	//variable that will hold all the variables for our game
	game = {
		canvas : undefined,
		ctx : undefined,
		lastTick : Date.now(),
		go : []
	}

	// Create canvas and get the context
	game.canvas = createFullScreenCanvas();
	game.ctx = game.canvas.getContext("2d");

	// Adjust map tile size
	tileW = game.canvas.width/mapW;
	tileH = (game.canvas.height - hBarH)/mapH;

	initGameObject();

	// Add listner
	document.addEventListener("keydown", function (keyEvent) {
		keysPressed[keyEvent.key] = true;
	});
	document.addEventListener("keyup", function (keyEvent) {
		keysPressed[keyEvent.key] = false;

		if(!keysPressed[controls.Space] && game.go.player.attackReady){
			var tbullet = game.go.player.makeBullet();
			game.go.bullet.push(tbullet);
		}

		if(!keysPressed[controls.Box] && game.go.player.buildReady){
			var boxIndex = game.go.player.makeBox();
			game.go.boxs[boxIndex].setType(1);
		}
	});	

	// document.addEventListener("keypress", function (keyEvent) {
	// 	if(keyEvent.key == 'b'){
	// 		console.log('make box');
	// 	}
	// });


	//start the loop
	window.requestAnimationFrame(loop);
}

function initGameObject(){
	// Create map (x, y -> index)
	game.go.boxs = new Array();
	for(var y = 0; y<mapH; y++){
		for(var x=0; x<mapW; x++){
			var tBox = new Box(x*tileW, hBarH + hBarB + y*tileH, tileW, tileH, gameMap1[(y*mapW)+x]);
			game.go.boxs.push(tBox);
		}
	}

	// Create game object
	game.go.player = new Player(120,150, 10, 10, "#ffff00", 300/1000, 500);
	
	game.go.enemy = new Array();
	// Fixed enemies
	game.go.enemy.push(new Enemy(IdxToCoor_X(3), IdxToCoor_Y(2), 100, "rgba(0,255,0,0.4)", 1, Math.PI*1/4, Math.PI*2/3));
	game.go.enemy.push(new Enemy(IdxToCoor_X(1), IdxToCoor_Y(4), 100, "rgba(0,255,0,0.4)", 1, Math.PI*1/4, Math.PI*1/6));
	// Rotating enemies
	game.go.enemy.push(new Enemy(IdxToCoor_X(8), IdxToCoor_Y(6), 300, "rgba(0,0,255,0.5)", 4, Math.PI*1/3, Math.PI*3/2, 0.005, 0, false, 0, true));
	game.go.enemy.push(new Enemy(IdxToCoor_X(3), IdxToCoor_Y(8), 150, "rgba(0,0,255,0.3)", 2, Math.PI*1/3, Math.PI*7/4, 0.02, Math.PI*3/4));
	game.go.enemy.push(new Enemy(IdxToCoor_X(8), IdxToCoor_Y(9), 150, "rgba(0,0,255,0.3)", 2, Math.PI*1/3, Math.PI*5/4, 0.03, Math.PI*4/3, false, 0, true));
	// Moving enemies
	game.go.enemy.push(new Enemy(IdxToCoor_X(2)-tileH*0.3, IdxToCoor_Y(10)-tileW*0.3, 100, "rgba(255,0,255,0.3)", 3, Math.PI*1/4, Math.PI/4, 0.02, Math.PI*2/3, true, 0.8));
	game.go.enemy.push(new Enemy(IdxToCoor_X(13)-tileH*0.3, IdxToCoor_Y(7)-tileW*0.3, 100, "rgba(255,0,255,0.3)", 3, Math.PI*1/3, Math.PI, 0.03, Math.PI*2/3, true, 0.8));
	game.go.enemy.push(new Enemy(IdxToCoor_X(15)-tileH*0.3, IdxToCoor_Y(2)-tileW*0.3, 100, "rgba(255,0,255,0.3)", 3, Math.PI*1/4, Math.PI/2, 0.03, Math.PI*1/2, true, 0.8));

	game.go.bullet = new Array();
	game.go.missile = new Array();

	keysPressed = new Array();
	game.lastTick = Date.now();
}

/**
* The game loop
*/
function loop(timestamp) {
	//delta from last execution of loop in ms
	var now = Date.now();
	var delta = now - game.lastTick;

	//console.log(delta);
	handleInput(delta);
	update(delta);
	render();


	game.lastTick = now;
	// Request to do this again ASAP
	window.requestAnimationFrame(loop);
}


/**
* update everything
*/
function update(delta){

	// Check the collision between enemies and player.
	for(var i = 0; i < game.go.enemy.length; i++){
		if(!game.go.player.hide && check4Collision(game.go.enemy[i].path, game.go.player)){
			game.go.enemy[i].isCollide(true);
			game.go.player.dropHealth(game.go.enemy[i].strength);
			if(game.go.enemy[i].ismissile && !game.go.enemy[i].isShooting){
				var tmissile = game.go.enemy[i].setShootMissile(game.go.player);
				game.go.missile.push(tmissile);
			}
		}else{
			game.go.enemy[i].isCollide(false);
		}

		if(game.go.enemy[i].ismove && is4HitWall(game.go.enemy[i])){
			// console.log("aaaaaaaaaa");
			game.go.enemy[i].changeDirection();
		}

		// Kill enemy
		if(game.go.enemy[i].life <= 0){
			game.go.enemy.splice(i, 1);
		}

		game.go.enemy[i].update(delta);
	}

	for(var i = 0; i < game.go.boxs.length; i++){

		// Check the collision between wall(box) and player.
		if(game.go.boxs[i].type == 1 && check4Collision(game.go.boxs[i].path, game.go.player)){
			game.go.player.goToPre();
		}
			
		// Win : when you reach to the goal
		if(game.go.boxs[i].type == 2 && check4Collision(game.go.boxs[i].path, game.go.player)){
			 gameOver(1);
			 return;
		}
	}

	// Update player
	game.go.player.update(delta);
	
	// Update bullet
	for(var i = 0; i<game.go.bullet.length; i++){
		game.go.bullet[i].update();
		// Get rid of the bullfet, When it hits the enemy or wall
		if(isHitEnemy(game.go.bullet[i]) || isHitWall(game.go.bullet[i].x, game.go.bullet[i].y)){
			game.go.bullet.splice(i, 1);
		}
	}

	// console.log(game.go.missile);
	for(var i = 0; i<game.go.missile.length; i++){
		game.go.missile[i].update(delta, game.go.player);

		// Get rid of the missile when hit the player or timeElapsedMissile
		if(game.ctx.isPointInPath(game.go.missile[i].path, game.go.player.x, game.go.player.y)){
			game.go.player.dropHealth(game.go.missile[i].strength);
			game.go.missile.splice(i, 1);
		}else if(game.go.missile[i].timeElapsedMissile >= 5000){
			game.go.missile.splice(i, 1);
		}
	}


	// Lose : When your health is over
	if(game.go.player.health <= 0){
		gameOver(0);
		return;
	} 
}


/**
* Draw everything
*/
function render(){

	//Cleaning canvas
	game.ctx.fillStyle = "#ffffff";
	game.ctx.fillRect(0,0, game.canvas.width, game.canvas.height);
	
	// draw the health bar
	game.go.player.drawHealthBar(game.ctx, 0, 0, game.canvas.width, hBarH, hBarB);
	
	// draw the map
	drawMap();
	
	// draw the game objects
	game.go.player.draw(game.ctx);

	for(var i=0;i<game.go.enemy.length;i++){
		game.go.enemy[i].draw(game.ctx);
	}

	for(var i = 0; i<game.go.bullet.length; i++){
		game.go.bullet[i].draw(game.ctx);
	}

	for(var i = 0; i<game.go.missile.length; i++){
		game.go.missile[i].draw(game.ctx);
	}


}

/**
* Handle keyboard input
*/
function handleInput(delta) {

	game.go.player.storePreMove(game.go.player.x, game.go.player.y);

	// Move player (Left, Up, Right, Down)
	// ** Only when hide key dosen't be pressed
	if(!game.go.player.hide && !game.go.player.buildReady){

		if(keysPressed[controls.Left]){
			game.go.player.moveLeft(delta);
		}
		if(keysPressed[controls.Up]){
			game.go.player.moveUp(delta);
		}
		if(keysPressed[controls.Right]){
			game.go.player.moveRight(delta);
		}
		if(keysPressed[controls.Down]){
			game.go.player.moveDown(delta);
		}

	}

	if(game.go.player.buildReady){
		if(keysPressed[controls.Left]){
			game.go.player.boxShapeUpdateXY(0);
		}
		else if(keysPressed[controls.Up]){
			game.go.player.boxShapeUpdateXY(1);
		}
		else if(keysPressed[controls.Right]){
			game.go.player.boxShapeUpdateXY(2);
		}
		else if(keysPressed[controls.Down]){
			game.go.player.boxShapeUpdateXY(3);
		}
	}

	// Player press 'h'
	if(keysPressed[controls.Hide]){
		game.go.player.setHide(true);	
	}else{
		game.go.player.setHide(false);	
	}

	// Player press 'Space'
	if(keysPressed[controls.Space]){
		game.go.player.setAttackReady();
	}

	// Player press 'b'
	if(keysPressed[controls.Box]){
		game.go.player.setBuildReady();
	}

}


/**
* Draw game map
*/
function drawMap() {
	for(var i = 0; i < game.go.boxs.length; i++){
		game.go.boxs[i].draw(game.ctx);
	}
}


/**
* calculate index to coordinate
*/
function IdxToCoor_X(i) {
	var x = i*tileW;
	return x;
}

function IdxToCoor_Y(j) {
	var y = j*tileH + hBarH + hBarB;
	return y;
}

/**
* calculate coordinate to index
*/
function CoorToIdx_I(x){
	var i = Math.floor(x/tileW);	//floor : round down
	return i;
}

function CoorToIdx_J(y){
	var j = Math.floor((y - hBarH - hBarB)/tileH);
	return j;
}

/**
* After game finish
* @parm {number} isWin 0: Lose, 1: Win
*/
function gameOver(isWin) {
	if(isWin == 0){
		alert("GameOver");
	}else if(isWin == 1){
		alert("You Win");
	}

	initGameObject();

	// var txt;
	// var r = confirm("Continue?");
	// if (r == true) {
	// 	console.log("Yes");
	// 	initGameObject();
	// } else {
	// 	console.log("No");
	// }

}

function check4Collision(path, go) {
	//check 4 points of player (4 edges which called colDot array)
	for(var i = 0; i < go.colDot.length; i++){
		if(game.ctx.isPointInPath(path, go.colDot[i].x, go.colDot[i].y)){
			return true;
		}
	}
	return false;
}


/**
* Check the condition of removing bullet
*/
function isHitWall(x, y){
	for(var i = 0; i < game.go.boxs.length; i++){
		if(game.go.boxs[i].type == 1 
			&& game.ctx.isPointInPath(game.go.boxs[i].path, x, y)){
			return true;
		}
	}
	return false;
}

function is4HitWall(go){
	var x, y, width, height;

	width = height = 2*go.r;
	for(var i = 0; i < game.go.boxs.length; i++){
		if(game.go.boxs[i].type == 1 
			&& check4Collision(game.go.boxs[i].path, go)){
			return true;
		}
	}
	return false;
}

function isHitEnemy(point){
	for(var i = 0; i < game.go.enemy.length; i++){
		if(game.ctx.isPointInPath(game.go.enemy[i].head, point.x, point.y)){
			game.go.enemy[i].beAttacked();
			return true;
		}
	}
	return false;
}
