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
		this.decideColor();

		this.initPath();
	}

	initPath(){
		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.height);
		this.path.closePath();
	}

	draw(ctx){
		ctx.fillStyle = this.fill;
		ctx.fill(this.path);
	}

	update(delta){
		this.initPath();
	}

	decideColor(){
		switch(this.type){
			case 1:
				this.fill = "#999999";
				break;
			case 2:
				this.fill = "#CA64EA";
				break;
			default:
				this.fill = "#000000";
		}
	}
}