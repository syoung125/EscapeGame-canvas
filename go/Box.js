class Box{
	/**
	* @parm {number} type 0: default, 1: wall(box), 2: finish block
	*/
	constructor(x, y, width, height, type){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.initPath();
	}

	initPath(){
		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.height);
		this.path.closePath();
	}

	draw(ctx){
		ctx.fillStyle = this.decideColor();
		ctx.fill(this.path);
	}

	update(delta){
		this.initPath();
	}

	decideColor(){
		switch(this.type){
			case 1:
				return "#999999";	// wall
			case 2:
				return "#CA64EA";	// finish line
			default:
				return "#000000";	// background
		}
	}

	setType(type){
		this.type = type;
	}
}