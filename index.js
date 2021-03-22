
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

let narray = (x,y,n) => {
	if (typeof x == "number" && 
		typeof y == "number" && 
		typeof n == "number" && 
		n%1==0 &&
		n >= 2){

		if (n==2){
			return [x,y];
		} else {
			let dx = (y-x)/(n-1);
			let arr = [];
			arr.push(x);
			for (let i=0; i<n-2; i++){
				let xx = x+(y-x)*(i+1)/(n-1);
				arr.push(xx);
			}	
			arr.push(y);
			return arr;
		}
	} else {
		return undefined;
	}
}
let carray = (cx, cy, r, ph, n) => {
	let arr = narray(0, 2*PI, n+1);
	let res = [];
	for (let i=0; i<n; i++) {
		res.push( [ (cx + r*cos(arr[i] - ph - PI/2)) , (cy + r*sin(arr[i] - ph - PI/2)) ] );
	}
	return res;
}

c.polygon({
   color: 'red',
   fillColor: 'red',
   lineWidth: 3,
   path: carray(600,350, 100, 0, 5)
});

c.polygon({
	color: 'green',
	fillColor: 'green',
	lineWidth: 3,
	path: carray(300,350, 100, 0, 5)
});

c.point({
	center: [30,30],
	radius: 3
});

console.log(new pathGenerator().straightPath({start:[0,0],end:[400,300],length:10}));