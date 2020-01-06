class Missile{
	constructor(x, y, r, dx, dy, speed, strength){
		this.x = x;
		this.y = y;
		this.r = r;
		this.dx = dx;
		this.dy = dy;
		this.speed = speed;
		this.strength = strength;
		this.timeElapsedMissile = 0;
	}

	initPath(){
		this.path = new Path2D();
		this.path.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		this.path.closePath();
	}

	update(delta, heading){	//hx, hy : heading X, Y

		// player가 방향 바뀔 때 마다
		this.dx = (heading.x - this.x)/Math.abs(heading.x - this.x);
		this.dy = (heading.y - this.y)/Math.abs(heading.y - this.y);

		this.x += this.dx*this.speed;
		this.y += this.dy*this.speed;

		this.timeElapsedMissile += delta;

		this.initPath();
	}

	draw(ctx){
		ctx.fillStyle = "#BD3718";
		ctx.fill(this.path);
	}

}