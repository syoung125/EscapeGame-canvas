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
		this.lineAngle = 0;
		this.line = {
			sx: 0,	//start point
			sy: 0,
			ex: 0,
			ey: 0,	//end point
			length: 20
		}

		// health status bar
		this.healthBar = {};

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

	}

	update(delta){
		this.initPath();

		if(this.attackReady){
			this.attackLineUpdate();
		}

	}
	
	/**
	* Moving function
	*/
	moveLeft(delta){
		this.x -= delta*this.speed;
	}
	moveUp(delta){
		this.y -= delta*this.speed;	
	}
	moveRight(delta){
		this.x += delta*this.speed;	
	}
	moveDown(delta){
		this.y += delta*this.speed;	
	}

	/**
	* Store previous x, y coordinate
	*/
	storePreMove(x, y){
		this.preX = x;
		this.preY = y;
	}

	/**
	* Move the coordinate to previous one
	*/
	goToPre(){
		this.x = this.preX;
		this.y = this.preY;
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

	//////////////////////////////
	//        Attack            //
	//////////////////////////////

	setAttackReady(){
		// console.log("Ready");
		this.attackLineInitPath();
		this.attackReady = true;
	}

	makeBullet(){
		// console.log("Shoot");
		this.attackReady = false;
		this.bspeed = 1;

		var tbullet = new Bullet(this.line.ex, this.line.ey, 4, (this.line.ex - this.line.sx)/this.line.length,
			(this.line.ey - this.line.sy)/this.line.length, this.bspeed);
		
		this.lineAngle = 0;
		return tbullet;
	}


	//////////////////////////////////

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

}