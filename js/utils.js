function createFullScreenCanvas(){
	//create the element
	var canvas = document.createElement("canvas");
	//make it fullscreen
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = "absolute";
	//add to the DOM
	document.body.appendChild(canvas);
	return canvas;
}
