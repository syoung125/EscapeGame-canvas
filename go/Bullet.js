class Bullet {
	constructor(x, y, r, dx, dy, speed){
		this.x = x;
		this.y = y;
		this.r = r;
		this.dx = dx;
		this.dy = dy;
		this.speed = speed;
	}

	initPath(){
		this.path = new Path2D();
		this.path.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		this.path.closePath();
	}

	update(){
		this.x += this.dx*this.speed;
		this.y += this.dy*this.speed;
		this.initPath();
	}

	draw(ctx){
		ctx.fillStyle = "#BD3718";
		ctx.fill(this.path);
	}
}