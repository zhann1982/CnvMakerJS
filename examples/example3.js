
let c = new CnvMaker2('#root', 1200, 600);

let arrayOfPoints = [],
	numberOfPoints = 10,
	rnd = new Random();

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

let mostLeftX = 1200,
	mostLeftIndex = 0,
	forbiddenIndices = [];

for (let i = 0; i < arrayOfPoints.length; i++) {
	if (arrayOfPoints[i].center[0] < mostLeftX) {
		mostLeftX = arrayOfPoints[i].center[0];
		mostLeftIndex = i;
	}
}

forbiddenIndices.push(mostLeftIndex);

for (let k = 0; k < arrayOfPoints.length-1; k++) {
    
	let minLength = Infinity,
	nextIndex = 0;

	for (let i = 0; i < arrayOfPoints.length; i++) {
		if (forbiddenIndices.indexOf(i) === -1) {
			let length = sqrt(
								(arrayOfPoints[i].center[0] - arrayOfPoints[mostLeftIndex].center[0])**2 
								+ (arrayOfPoints[i].center[1] - arrayOfPoints[mostLeftIndex].center[1])**2
							);
			if (length < minLength) {
				minLength = length;
				nextIndex = i;
			}
		}
	}

	c.line({
		color : 'red',
		lineWidth : 2,
		lineCap : 'round',
		start : arrayOfPoints[mostLeftIndex].center,
		end : arrayOfPoints[nextIndex].center
	});

	mostLeftIndex = nextIndex;
	forbiddenIndices.push(nextIndex);
}

for (let i = 0; i < numberOfPoints; i++) c.arc(arrayOfPoints[i]);
