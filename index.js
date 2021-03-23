
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

let arrayOfPoints = [],
	numberOfPoints = 10,
	rnd = new Random(),
	matrixOfLinkLengthes = [];

for (let i = 0; i < numberOfPoints; i++) {
	arrayOfPoints.push(
		new Arc
			({
				color: 'black',
				lineWidth: 5,
				center: rnd.point({
					start: [100,100],
					end: [1100,500]
				}),
				radius: 5,
				angles: [0,2*PI]
			})
	);
}

let copyArray = [...arrayOfPoints];
let mostLeftX = 1200,
	mostLeftIndex = 0;
for (let i = 0; i < arrayOfPoints.length; i++) {
	if (arrayOfPoints[i].center[0] < mostLeftX) {
		mostLeftX = arrayOfPoints[i].center[0];
		mostLeftIndex = i;
	}
}

for (let i = 0; i < arrayOfPoints.length-1; i++) {

}

for (let i = 0; i < numberOfPoints; i++) {
	c.arc(arrayOfPoints[i]);
}