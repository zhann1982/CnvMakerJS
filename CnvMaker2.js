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

// Create polygon from points. setup colors and line width of edges
// "color" is for edges, "fillColor" is for filling inside of polygon
class Polygon {
    constructor(obj) {
        this.name = obj.name || 'polygon' + counter();
        this.path = obj.path;
        this.color = obj.color;
        this.fillColor = obj.fillColor;
        this.lineWidth = obj.lineWidth;
        this.lineCap = obj.lineCap || 'round';
        this.lineJoin = obj.lineJoin || 'miter';
    }
}
class CnvMaker2 {

    // Create and append canvas
    constructor (el,w,h) {

        // Creating canvas node
        this.canvasNode = document.createElement("canvas");
		this.ctx = this.canvasNode.getContext('2d');
		
		// Set canvas width and height
		this.canvasNode.width = w;
		this.canvasNode.height = h;
		
		// Append canvas node to DOM element
		if (el === document.body || el === 'body') {
			document.body.appendChild(this.canvasNode);
		} else {
			document.querySelector(el).appendChild(this.canvasNode);
		}

        // List of objects to draw
        this.polygons = [];
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
}

let points = [[100,100],[200,100],[200,200],[100,200]];
let poly1 = new Polygon({
    path: points,
    color: 'red',
    fillColor: 'lime',
    lineWidth: 3,
    lineCap: 'round',
    lineJoin: 'miter'
});

let c = new CnvMaker2('#root',1200,600);
c.polygon(poly1);