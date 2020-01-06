class Enemy{

	constructor(x, y, radius, color, strength, theta, hAngle, rSpeed=0, rRange=0,
	ismove=false, mSpeed=0, ismissile=false){

		this.x = x;
		this.y = y;
		this.r = 10;
		this.radius = radius;
		this.fill = color;
		this.theta = theta;
		this.hAngle = hAngle;
		this.deltaAngle = 0;
		this.strength = strength;
		/* for rotating*/
		this.rSpeed = rSpeed;	
		this.rRange = rRange;
		/* for moving */
		this.ismove = ismove;

		this.magnitude = Math.sqrt(Math.pow(Math.cos(this.hAngle),2) + Math.pow(Math.sin(this.hAngle), 2));
		this.dx = Math.cos(this.hAngle)/this.magnitude;
		this.dy = Math.sin(this.hAngle)/this.magnitude;
		this.mSpeed = mSpeed;
		/*for missile*/
		this.ismissile = ismissile;
		this.isShooting = false;

		//Array to check Collision
		this.colDot = new Array();
		// left, right, top, bottom
		var left = {x: this.x - this.r, y: this.y};
		var right = {x: this.x + this.r, y: this.y};
		var top = {x: this.x, y: this.y - this.r};
		var bottom = {x: this.x, y: this.y + this.r};
		this.colDot.push(left, right, top, bottom);

		this.isCollision = false;
		this.isAttacked = false;

		this.life = 3;
	
		this.initPath();
	}

	initPath(){
		this.head = new Path2D();
		this.head.arc(this.x, this.y, this.r, 0, Math.PI*2);
		this.head.closePath();

		this.path = new Path2D();
		this.path.moveTo(this.x, this.y);
		this.path.arc(this.x, this.y, this.radius, (this.hAngle - this.theta/2) + this.deltaAngle, (this.hAngle + this.theta/2) + this.deltaAngle);
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
			if(this.deltaAngle >= (this.rRange - this.theta)/2){
				this.rSpeed *= (-1);
			}
			if(this.deltaAngle <= (this.theta - this.rRange)/2){
				this.rSpeed *= (-1);
			}
		}

		if(this.ismove){
			this.moving();
			this.updateColDot();
		}

		if(this.isAttacked){
			this.timeElapsedFromAttack += delta;

			if(this.timeElapsedFromAttack >= 300){
				this.isAttacked = false;
			}
		}

		if(this.isShooting){
			this.timeElapsedMissile += delta;

			if(this.timeElapsedMissile >= 3000){
				this.isShooting = false;
			}
		}
		this.initPath();
	}

	updateColDot(){
		// left, right, top, bottom
		this.colDot[0].x = this.x - this.r;
		this.colDot[0].y = this.y;

		this.colDot[1].x = this.x + this.r;
		this.colDot[1].y = this.y;
		
		this.colDot[2].x = this.x;
		this.colDot[2].y = this.y - this.r;
		
		this.colDot[3].x = this.x;
		this.colDot[3].y = this.y + this.r;

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
		// this.dx *= -1;
		// this.dy *= -1;
		// this.hAngle += Math.PI*5/6;
		this.hAngle += 0.1;

		this.magnitude = Math.sqrt(Math.pow(Math.cos(this.hAngle),2) + Math.pow(Math.sin(this.hAngle), 2));
		this.dx = Math.cos(this.hAngle)/this.magnitude;
		this.dy = Math.sin(this.hAngle)/this.magnitude;

	}

	//////////////////////////////
	//        Missile            //
	//////////////////////////////

	setShootMissile(heading){
		if(!this.isShooting){
			console.log('Shoot missle');
			this.isShooting = true;
			this.timeElapsedMissile = 0;
			var tdx = (heading.x - this.x)/Math.abs(heading.x - this.x);
			var tdy = (heading.y - this.y)/Math.abs(heading.y - this.y);
			var tmissile = new Missile(this.x, this.y, 7, tdx, tdy, 1.3, 10);
			return tmissile;
		}
	}



}