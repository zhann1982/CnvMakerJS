
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

// c.grid({
// 	gridStep: 50,
// 	gridColor: '#ddd'
// });

let figs = new pathGenerator();
let p1 = figs.circularPath({
	center: [210,210],
	radius: 90,
	phase: PI/4,
	length: 6
});

c.polygon({
   color: 'transparent',
   fillColor: 'red',
   lineWidth: 3,
   path: p1
});

c.polygon({
	color: 'transparent',
	fillColor: 'green',
	lineWidth: 3,
	path: new pathGenerator().circularPath({
		center: [310,310],
		radius: 120,
		phase: PI/4,
		length: 3
	})
});

c.point({
	center: [30,30],
	radius: 3
});
