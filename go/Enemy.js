class Enemy{

	constructor(x, y, radius, color, strength, theta, angle, rSpeed=0, rRange=0, ismove=false, dx=0, dy=0, mSpeed=0){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.fill = color;
		this.theta = theta;
		this.angle = angle;
		this.deltaAngle = 0;
		this.strength = strength;
		/* for rotating*/
		this.rSpeed = rSpeed;	
		this.rRange = rRange;
		/* for moving */
		this.ismove = ismove;
		this.dx = dx;
		this.dy = dy;
		this.mSpeed = mSpeed;



		this.isCollision = false;
		this.isAttacked = false;

		this.life = 3;
	
		this.initPath();
	}

	initPath(){
		this.head = new Path2D();
		this.head.arc(this.x, this.y, 10, 0, Math.PI*2);
		this.head.closePath();

		this.path = new Path2D();
		this.path.moveTo(this.x, this.y);
		this.path.arc(this.x, this.y, this.radius, this.angle + this.deltaAngle, (this.angle + this.theta) + this.deltaAngle);
		this.path.closePath();
	}

	draw(ctx){

		// Draw center of arc
		ctx.fillStyle = "#353535";
		ctx.fill(this.head);

		// Check collision
		if(this.isCollision){
			ctx.fillStyle = "rgba(255,0,0,0.5)";
		}else if(this.isAttacked){
			ctx.fillStyle = "#C7CBD1";
		}else{
			ctx.fillStyle = this.fill;
		}

		
		
		ctx.fill(this.path);
	}

	update(delta){
		this.deltaAngle += this.rSpeed;
		if(this.rRange){
			if(this.deltaAngle >= this.rRange){
				this.rSpeed *= (-1);
			}
			if(this.deltaAngle <= 0){
				this.rSpeed *= (-1);
			}
		}

		if(this.ismove){
			this.moving();
		}

		if(this.isAttacked){
			this.timeElapsedFromAttack += delta;

			if(this.timeElapsedFromAttack >= 300){
				this.isAttacked = false;
			}
		}

		this.initPath();
	}

	/**
	* This function change this.isCollision value.
	* @param {boolean} check
	*/
	isCollide(check){
		this.isCollision = check;
	}

	/**
	* This function is excuted when enemy gets attack
	* @param {boolean} check
	*/
	beAttacked(){
		//console.log("beAttacked");
		this.isAttacked = true;
		this.life--;
		this.radius = this.radius*4/5

		this.timeElapsedFromAttack = 0;

	}

	moving(){
		this.x += this.dx*this.mSpeed;
		this.y += this.dy*this.mSpeed;
	}

	changeDirection(){
		this.dx *= -1;
		this.dy *= -1;
	}

	updateAngle(){

	}

	updateDirection(){

	}

}