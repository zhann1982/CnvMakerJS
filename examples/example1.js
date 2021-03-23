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