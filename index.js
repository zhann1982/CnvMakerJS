
// let c = new CnvMaker();

// let ww = 1200, hh = 600;
// c.init('#root', ww, hh);

// //// c.path(darray(50,50,250,250,6),'blue',5);

// //// c.path(carray(300,150,40,0,5),'green',5);

// //// c.poly(carray(500,150,40,1,7),'red','transparent',7);


// let path = carray(200,100,40,0,7);

// let dx = -1, // x-axis speed (pixel per frame)
//     dy = 2, // y-axis speed (pixel per frame)
//     dt = 0.01; // angular speed (radians per frame)
// let frame = () => {

//     c.cls(); // clear screen
//     c.poly(path,'red','yellow',5);
//     path = [...rotC(path,dt)];
//     path = [...transl(path,dx,dy)];

//     let bb = borders(path,ww,hh,dx,dy);
//     if (bb[0]==1) {dx *= -1; dt *= -1;}
//     if (bb[1]==1) {dy *= -1; dt *= -1;}

//     window.requestAnimFrame(frame);
// }

// frame();



let c = new CnvMaker2('#root', 1200, 600);

// c.globalCompositeOperation('xor');
c.setOpacity(0.3);

let arrayOfPathes = [],
	numberOfPathes = 200,
	rnd = new Random();

for (let i = 0; i < numberOfPathes; i++) {
	arrayOfPathes.push(
		new Polygon
			({
				color: 'transparent',
				fillColor:  rnd.color(),
				lineWidth: 1,
				path: new pathGenerator().circularPath ({
					center: rnd.point({
						start: [0,0], 
						end: [c.width, c.height]
					}), 
					radius: rnd.natural(28,68), 
					phase: rnd.real(0,PI/2), 
					length: 60
				}),
				angularSpeed: 0.005*rnd.natural(2,10),
				ccw: true,
				// rotationCenter: [100,100],
				linearSpeed: rnd.point({
					start: [-3,-3], 
					end: [3, 3]
				})
			})
	);
}

let frame = () => {
	c.clearCanvas();
	for (let i = 0; i < numberOfPathes; i++) {
		if (arrayOfPathes[i].linearSpeed[0] === 0 || arrayOfPathes[i].linearSpeed[1] === 0) {
			arrayOfPathes[i].linearSpeed = rnd.point({
				start: [-3,-3], 
				end: [3, 3]
			})
		}
		c.polygon(arrayOfPathes[i]);
		arrayOfPathes[i].rotate();
		arrayOfPathes[i].move();
		arrayOfPathes[i].checkBorderTouch(c, 100);
	}
}

c.animation(frame);