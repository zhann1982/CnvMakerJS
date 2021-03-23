
let c = new CnvMaker2('#root', 1200, 600);

let arrayOfPoints = [],
	numberOfPoints = 10,
	rnd = new Random(),
	matrixOfLinkLengthes = [];

// create points randomly distributed on canvas
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

// get array with information on minimum lengthes and corresponding indices
for (let i = 0; i < numberOfPoints-1; i++) {
	let row = [], 
		minimum = Infinity,
		isMinimum = [];
	for (let j = i+1; j < numberOfPoints; j++) {
		let length = sqrt(
							(arrayOfPoints[i].center[0] - arrayOfPoints[j].center[0])**2 
							+ (arrayOfPoints[i].center[1] - arrayOfPoints[j].center[1])**2
						 );
		if (length < minimum) {
			minimum = length;
			isMinimum = [i,j];
		}
		row.push({
			from: i,
			to: j,
			length: length
		})
	}
	matrixOfLinkLengthes.push({
		row: row,
		minimumIndex: isMinimum
	});
}

let countLines = 0;

// draw lines and their labels
for (let k = 0; k < matrixOfLinkLengthes.length; k++) {
	countLines++;
	let i1 = matrixOfLinkLengthes[k].minimumIndex[0],
		j1 = matrixOfLinkLengthes[k].minimumIndex[1];
	c.line({
		color : 'red',
		lineWidth : 2,
		lineCap : 'round',
		start : arrayOfPoints[i1].center,
		end : arrayOfPoints[j1].center
	});
	c.text({
		text: `${countLines}`,
		font: '18px Tahoma',
		color: 'black',
		fillColor: 'black',
		type: 'fill',
		start: [
					(arrayOfPoints[i1].center[0] + arrayOfPoints[j1].center[0])/2,
					(arrayOfPoints[i1].center[1] + arrayOfPoints[j1].center[1])/2 - 10
				]	
	});
}

// draw points
for (let i = 0; i < numberOfPoints; i++) {
	c.arc(arrayOfPoints[i]);
}