// Canvas framework for simplest 2d drawings and animation

// Closure for creating counters
const closure = () => {
    let k = 1;
    return function(){
        return k++;
    }
}

// counter that gives us next natural number, starting from 0
let counter = closure();

// special function to give the geometrical center of a path
let center = path => {
    
}

// Primitive with siplest properties
class Primitive {
    constructor(obj) {
        this.name = obj.name || 'primitive' + counter();
        this.color = obj.color || 'black';
        this.fillColor = obj.fillColor || 'transparent';
        this.lineWidth = obj.lineWidth || 1;
        this.lineCap = obj.lineCap || 'round';
        this.lineJoin = obj.lineJoin || 'miter';
    }
}

// Create polygon from points. setup colors and line width of edges
// "color" is for edges, "fillColor" is for filling inside of polygon
class Polygon extends Primitive{
    constructor(obj) {
        super(obj);
        this.path = obj.path || [[0,0],[0,0]];
    }

    getCenter () {
        let cx = 0, cy = 0;
        for (let i = 0; i < this.path.length; i++) {
            cx += this.path[i][0];
            cy += this.path[i][1];
        }
        return [cx/this.path.length, cy/this.path.length];
    }
}

class Arc extends Primitive {
    constructor(obj) {
        super(obj);
        this.center = obj.center || [0,0];
        this.radius = obj.radius || 120;
        this.angles = obj.angles || [0, 2*Math.PI]; // radians only
        this.ccw = obj.ccw; // counterclockwise or not
    }
}

class Square extends Primitive {
    constructor(obj) {
        super(obj);
        this.corner = obj.corner || [10,10]; //upper left corner coords
        this.width = obj.width || 80;
        this.height = obj.width || 80;
    }

    getPath () {
        return [
            this.corner,
            [this.corner[0]+this.width, this.corner[1]],
            [this.corner[0]+this.width, this.corner[1]+this.height],
            [this.corner[0], this.corner[1]+this.height]
        ]
    }

    getCenter () {
        let cx = 0, cy = 0;
        let path = this.getPath();
        for (let i = 0; i < path.length; i++) {
            cx += path[i][0];
            cy += path[i][1];
        }
        return [cx/path.length, cy/path.length];
    }
}

class Rectangle extends Square {
    constructor(obj) {
        super(obj);
        this.height = obj.height || 50; 
    }
}

class Ellipse extends Arc {
    constructor(obj) {
        super(obj);
        this.radiusX = obj.radiusX || 120;
        this.radiusY = obj.radiusY || 80;
        this.rotation = obj.rotation || 0; // radians only
    }
}

class CnvMaker2 {

    // Create and append canvas
    constructor (el,w,h) {

        // Creating canvas node
        this.canvasNode = document.createElement("canvas");
		this.ctx = this.canvasNode.getContext('2d');
		
		// Set canvas width and height
		this.canvasNode.width = w || 300;
		this.canvasNode.height = h || 200;

        // Save canvas width and height
        this.width = w || 300;
		this.height = h || 200;
		
		// Append canvas node to DOM element
		if (el === document.body || el === 'body' || el instanceof HTMLBodyElement) {
			document.body.appendChild(this.canvasNode);
		} else if (el instanceof String) {
			document.querySelector(el).appendChild(this.canvasNode);
		} else if (el instanceof HTMLElement) {
            el.appendChild(this.canvasNode);
        } else {
            let rootDiv = document.createElement('div');
            rootDiv.setAttribute('id','root');
            rootDiv.appendChild(this.canvasNode);
            document.body.appendChild(rootDiv);
        }

        // List of objects to draw. Save objects here for further use
        this.objectsArray = [];
    }

    // Resize canvas node
    resize (w,h) {
        this.canvasNode.width = w;
		this.canvasNode.height = h;	
    }

    // Delete canvas node
    delete () {
		this.canvasNode.remove();
	}

    // Clear whole canvas
    clear () {
		this.ctx.clearRect(0,0,this.canvasNode.width,this.canvasNode.height);
	}

    // Fill whole canvas with color
    fill (col) {
		this.ctx.fillStyle = col;
		this.ctx.fillRect(0,0,this.canvasNode.width,this.canvasNode.height);
	}

    // draw path through points
    path (polygon) {
		this.ctx.strokeStyle = polygon.color;
		this.ctx.lineWidth = polygon.lineWidth;
		this.ctx.lineCap = polygon.lineCap;
		this.ctx.lineJoin = polygon.lineJoin;
		this.ctx.beginPath();
		this.ctx.moveTo(polygon.path[0][0],polygon.path[0][1]);
		for (let i=1; i<polygon.path.length; i++) {
			this.ctx.lineTo(polygon.path[i][0],polygon.path[i][1]);
		}
		this.ctx.stroke();
	}

    polygon (polygon) {
        this.ctx.strokeStyle = polygon.color;
		this.ctx.lineWidth = polygon.lineWidth;
		this.ctx.lineJoin = polygon.lineJoin; // miter(default), bevel, round
		this.ctx.beginPath();
		this.ctx.moveTo(polygon.path[0][0],polygon.path[0][1]);
		for (let i=1; i<polygon.path.length; i++) {
			this.ctx.lineTo(polygon.path[i][0],polygon.path[i][1]);
		}
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fillStyle = polygon.fillColor;
		this.ctx.fill();
    }

    arc (arc) {
		this.ctx.strokeStyle = arc.color;
		this.ctx.lineWidth = arc.lineWidth;
        this.ctx.lineJoin = arc.lineJoin;
		this.ctx.lineCap = arc.lineCap;
		this.ctx.beginPath();
		this.ctx.arc(
            arc.center[0],
            arc.center[1],
            arc.radius,
            arc.angles[0],
            arc.angles[1],
            arc.ccw
        );
		this.ctx.stroke();
	}

    segment (arc) {
        this.ctx.strokeStyle = arc.color;
		this.ctx.lineWidth = arc.lineWidth;
        this.ctx.lineJoin = arc.lineJoin;
		this.ctx.lineCap = arc.lineCap;
		this.ctx.beginPath();
		this.ctx.arc(
            arc.center[0],
            arc.center[1],
            arc.radius,
            arc.angles[0],
            arc.angles[1],
            arc.ccw
        );
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fillStyle = arc.fillColor;
		this.ctx.fill();
    }

    sector (arc) {
        this.ctx.strokeStyle = arc.color;
		this.ctx.lineWidth = arc.lineWidth;
        this.ctx.lineJoin = arc.lineJoin;
		this.ctx.lineCap = arc.lineCap;
		this.ctx.beginPath();
		this.ctx.arc(
            arc.center[0],
            arc.center[1],
            arc.radius,
            arc.angles[0],
            arc.angles[1],
            arc.ccw
        );
        this.ctx.lineTo(arc.center[0],arc.center[1]);
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fillStyle = arc.fillColor;
		this.ctx.fill();
    }

    circle (circle) {
        this.ctx.strokeStyle = circle.color;
		this.ctx.lineWidth = circle.lineWidth;
		this.ctx.beginPath();
		this.ctx.arc(
            circle.center[0],
            circle.center[1],
            circle.radius,
            0,
            2*Math.PI
        );
		this.ctx.stroke();
    }

    disk (disk) {
        this.ctx.strokeStyle = disk.color;
		this.ctx.lineWidth = disk.lineWidth;
        this.ctx.lineJoin = disk.lineJoin;
		this.ctx.lineCap = disk.lineCap;
		this.ctx.beginPath();
		this.ctx.arc(
            disk.center[0],
            disk.center[1],
            disk.radius,
            0,
            2*Math.PI
        );
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fillStyle = disk.fillColor;
		this.ctx.fill();
    }

    square (square) {
        this.ctx.strokeStyle = square.color;
		this.ctx.lineWidth = square.lineWidth;
		this.ctx.lineJoin = square.lineJoin; // miter(default), bevel, round
		this.ctx.beginPath();
		this.ctx.moveTo(square.corner[0], square.corner[1]);
		this.ctx.lineTo(square.corner[0]+square.width, square.corner[1]);

		this.ctx.lineTo(square.corner[0]+square.width, square.corner[1]+square.width);
		this.ctx.lineTo(square.corner[0], square.corner[1]+square.width);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fillStyle = square.fillColor;
		this.ctx.fill();
    }

    rectangle (rectangle) {
        this.ctx.strokeStyle = rectangle.color;
		this.ctx.lineWidth = rectangle.lineWidth;
		this.ctx.lineJoin = rectangle.lineJoin; // miter(default), bevel, round
		this.ctx.beginPath();
		this.ctx.moveTo(rectangle.corner[0], rectangle.corner[1]);
		this.ctx.lineTo(rectangle.corner[0]+rectangle.width, rectangle.corner[1]);

		this.ctx.lineTo(rectangle.corner[0]+rectangle.width, rectangle.corner[1]+rectangle.height);
		this.ctx.lineTo(rectangle.corner[0], rectangle.corner[1]+rectangle.height);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fillStyle = rectangle.fillColor;
		this.ctx.fill();
    }

    ellipse (ellipse) {
        this.ctx.strokeStyle = ellipse.color;
		this.ctx.lineWidth = ellipse.lineWidth;
		this.ctx.beginPath();
		this.ctx.ellipse(
            ellipse.center[0],
            ellipse.center[1],
            ellipse.radiusX,
            ellipse.radiusY,
            ellipse.rotation,
            0,
            2*Math.PI,
        );
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fillStyle = ellipse.fillColor;
		this.ctx.fill();
    }

    ellipseSegment (ellipse) {
        this.ctx.strokeStyle = ellipse.color;
		this.ctx.lineWidth = ellipse.lineWidth;
		this.ctx.beginPath();
		this.ctx.ellipse(
            ellipse.center[0],
            ellipse.center[1],
            ellipse.radiusX,
            ellipse.radiusY,
            ellipse.rotation,
            ellipse.angles[0],
            ellipse.angles[1],
            ellipse.ccw,
        );
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fillStyle = ellipse.fillColor;
		this.ctx.fill();
    }

    ellipseSector (ellipse) {
        this.ctx.strokeStyle = ellipse.color;
		this.ctx.lineWidth = ellipse.lineWidth;
		this.ctx.beginPath();
		this.ctx.ellipse(
            ellipse.center[0],
            ellipse.center[1],
            ellipse.radiusX,
            ellipse.radiusY,
            ellipse.rotation,
            ellipse.angles[0],
            ellipse.angles[1],
            ellipse.ccw,
        );
        this.ctx.lineTo(ellipse.center[0], ellipse.center[1]);
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fillStyle = ellipse.fillColor;
		this.ctx.fill();
    }
}


// Testing classes

// creating pathes and objects
let points = [[100,100],[200,100],[200,200],[100,200]];
let poly1 = new Polygon({
    path: points,
    color: 'red',
    fillColor: 'lime',
    lineWidth: 3,
    lineCap: 'round',
    lineJoin: 'miter'
});
let arc1 = new Arc({
    name: 'arc1',
    color: 'blue',
    fillColor: 'yellow',
    lineWidth: 6,
    lineJoin: 'round',
    center: [200,300],
    radius: 300,
    angles: [0,0.7]
});
let rect1 = new Rectangle({
    color: 'blue',
    fillColor: 'red',
    lineWidth: 3,
    lineCap: 'round',
    lineJoin: 'miter',
    width: 100,
    height: 230,
    corner: [50,420]
});

// creating canvas in special div block
let c = new CnvMaker2(root,1200,600);

// drawing predefined objects
c.polygon(poly1);
c.rectangle(rect1);

// drawing objects while declaring them
c.sector({
    color: 'red',
    fillColor: 'magenta',
    lineWidth: 3,
    lineJoin: 'miter',
    center: [300,400],
    radius: 100,
    angles: [0,1.7]
});

c.circle({
    color: 'red',
    lineWidth: 3,
    center: [500,100],
    radius: 100
});

c.disk({
    color: 'black',
    fillColor: '#000b', // hex color with alpha opacity
    lineWidth: 3,
    center: [500,300],
    radius: 70
});

c.rectangle({
    color: 'pink',
    fillColor: 'aquamarine', // hex color with alpha opacity
    lineWidth: 3,
    corner: [50,250],
    width: 200,
    height: 150
});

c.square({
    color: 'gray',
    fillColor: 'brown', // hex color with alpha opacity
    lineWidth: 2,
    corner: [250,450],
    width: 100
});

c.ellipse({
    color: 'red',
    fillColor: 'green',
    lineWidth: 3,
    center: [300,100],
    radiusX: 150,
    radiusY: 100,
    rotation: 0
});

c.ellipseSegment({
    color: 'red',
    fillColor: 'lightgreen',
    lineWidth: 3,
    center: [300,100],
    radiusX: 150,
    radiusY: 100,
    rotation: 0,
    angles: [0,2]
});

c.ellipseSector({
    color: 'black',
    fillColor: 'purple',
    lineWidth: 3,
    center: [300,100],
    radiusX: 150,
    radiusY: 100,
    rotation: 0,
    angles: [2,3]
});