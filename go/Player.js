class Player{

	constructor(x, y, width, height, color, speed, health){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fill = color;
		this.speed = speed;
		this.health = health;
		this.ogHealth = health;	//original health (not change)

		this.hide = false;
		this.attackReady = false;
		this.lineAngle = Math.PI/2;
		this.line = {
			sx: 0,	//start point
			sy: 0,
			ex: 0,
			ey: 0,	//end point
			length: 20
		}

		// health status bar
		this.healthBar = {};

		// Array to check Collision
		this.colDot = new Array();
		var tl = {x: this.x, y: this.y};
		var tr = {x: this.x + this.width, y: this.y};
		var bl = {x: this.x, y: this.y + this.height};
		var br = {x: this.x + this.width, y: this.y + this.height};
		this.colDot.push(tl, tr, bl, br);

		// TO build to box
		this.buildReady = false;
		this.idxI = 0, this.idxJ = 0; // player index I, J 

		this.initPath();
	}

	initPath(){
		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.height);
		this.path.closePath();
	}


	draw(ctx){
		if(!this.hide){
			ctx.fillStyle = this.fill;
			ctx.fill(this.path);
		}
		else {
			ctx.strokeStyle = this.fill;
			ctx.lineWidth = 2;
			ctx.stroke(this.path);
		}

		if(this.attackReady){
			this.attackLineDraw(ctx);
		}

		if(this.buildReady){
			this.boxShapeDraw(ctx);
		}

	}

	update(delta){
		this.initPath();
		this.updateColDot();

		if(this.attackReady){
			this.attackLineUpdate();
		}

		if(this.buildReady){
			this.boxShapeUpdate();
		}

	}

	updateColDot(){
		// tl, tr, bl, br
		this.colDot[0].x = this.x;
		this.colDot[0].y = this.y;

		this.colDot[1].x = this.x + this.width;
		this.colDot[1].y = this.y;
		
		this.colDot[2].x = this.x;
		this.colDot[2].y = this.y + this.height;
		
		this.colDot[3].x = this.x + this.width;
		this.colDot[3].y = this.y + this.height;
	}
	
	/**
	* Moving function
	*/
	moveLeft(delta){
		this.x -= delta*this.speed;
		this.updateColDot();
	}
	moveUp(delta){
		this.y -= delta*this.speed;	
		this.updateColDot();
	}
	moveRight(delta){
		this.x += delta*this.speed;	
		this.updateColDot();
	}
	moveDown(delta){
		this.y += delta*this.speed;	
		this.updateColDot();
	}

	/**
	* Store previous x, y coordinate
	*/
	storePreMove(x, y){
		// console.log("storePreMove");

		this.preX = x;
		this.preY = y;
		// console.log(this.preX,this.preY);
	}

	/**
	* Move the coordinate to previous one
	*/
	goToPre(){
		// console.log("goToPre");
		this.x = this.preX;
		this.y = this.preY;
		this.updateColDot();
	}

	/**
	 * This function makes to drop health.
	 * @param {number} amount Number to be dropped
	 */
	dropHealth(amount){
		this.health -= amount;
	}

	/**
	* Draw player's health stauts bar
	*/
	drawHealthBar(ctx, x, y, width, height, border){
		this.healthBar.height = height;

		var sbstroke = new Path2D();
		sbstroke.rect(x, y, width, height);
		sbstroke.closePath();
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = border;
		ctx.stroke(sbstroke);

		var stealthBar = new Path2D();
		stealthBar.rect(x + border, y + border, (width-border*2)/this.ogHealth*this.health, height - border*2);
		stealthBar.closePath();
		ctx.fillStyle = "#ff0000";
		ctx.fill(stealthBar);
	}

	setHide(arg){
		this.hide = arg;
	}

	//////////////////////////////
	//        Attack            //
	//////////////////////////////

	setAttackReady(){
		// console.log("Ready");
		if(!this.attackReady){
			this.attackLineInitPath();
			this.attackReady = true;
		}
	}

	makeBullet(){
		// console.log("Shoot");
		if(this.attackReady){
			this.attackReady = false;
			this.bspeed = 1;

			var tbullet = new Bullet(this.line.ex, this.line.ey, 4, (this.line.ex - this.line.sx)/this.line.length,
				(this.line.ey - this.line.sy)/this.line.length, this.bspeed);
			
			this.lineAngle = Math.PI/2;
			return tbullet;
		}
		
	}


	/****************************************/

	attackLineInitPath(){
		this.lPath = new Path2D();
		this.line.sx = this.x + this.width/2;
		this.line.sy = this.y + this.height/2;
		this.line.ex = this.line.sx + this.line.length * Math.cos(this.lineAngle);
		this.line.ey = this.line.sy + this.line.length * Math.sin(this.lineAngle);
		this.lPath.moveTo(this.line.sx, this.line.sy);
		this.lPath.lineTo(this.line.ex, this.line.ey);
		this.lPath.closePath();

	}

	attackLineUpdate(){
		this.lineAngle += 0.05;
		this.attackLineInitPath();
	}

	attackLineDraw(ctx){
		ctx.strokeStyle = "#BD3718";
		ctx.lineWidth = 2;
		ctx.stroke(this.lPath);
	}


	//////////////////////////////
	//          Box             //
	//////////////////////////////

	setBuildReady(){
		if(!this.buildReady){
			console.log("Build Ready");
			this.buildReady = true;

			// initialize the coordinate of the area which is involing player now
			this.idxI = CoorToIdx_I(this.x);
			this.idxJ = CoorToIdx_J(this.y);
			//console.log("i: "+this.idxI+", j: "+this.idxJ);
			this.boxShapeInitPath();
		}
	}

	/****************************************/

	boxShapeInitPath(){
		this.bspath = new Path2D();
		this.bspath.rect(this.idxI*tileW, hBarH + hBarB + this.idxJ*tileH, tileW, tileH);
		this.bspath.closePath();
	}

	boxShapeUpdate(){
		this.boxShapeInitPath();
	}

	/* Call the function when user press the directino key with 'b' */
	boxShapeUpdateXY(type){
		// 0: left, 1: up, 2: right, 3: down
		switch(type){
			case 0:
			this.idxI = CoorToIdx_I(this.x) - 1;
			this.idxJ = CoorToIdx_J(this.y);
			break;
			case 1:
			this.idxI = CoorToIdx_I(this.x);
			this.idxJ = CoorToIdx_J(this.y) - 1;
			break;
			case 2:
			this.idxI = CoorToIdx_I(this.x) + 1;
			this.idxJ = CoorToIdx_J(this.y);
			break;
			case 3:
			this.idxI = CoorToIdx_I(this.x);
			this.idxJ = CoorToIdx_J(this.y) + 1;
			break;
		}			

		this.boxShapeInitPath();
	}

	boxShapeDraw(ctx){
		ctx.fillStyle = "#ff000055";
		ctx.fill(this.bspath);
	}


	/**
	* Make the box in front of the heading direction
	*/
	makeBox(){
		if(this.buildReady){
			console.log('make box');

			this.buildReady = false;
			
			var boxIdx = (this.idxJ*mapW)+this.idxI
			// console.log(boxIdx);
			return boxIdx;
		}
	}

}