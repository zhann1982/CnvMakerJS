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

// class for Styles. Notice: this class doesn't affect current styles of context
class Styles {
    constructor(obj) {
        this.color = obj.color || 'black';
        this.fillColor = obj.fillColor || 'transparent';
        this.lineWidth = obj.lineWidth || 1;
        this.lineCap = obj.lineCap || 'round';  // "butt" , "round" , "square"
        this.lineJoin = obj.lineJoin || 'miter'; // "bevel" , "round" , "miter"
        this.shadowColor = obj.shadowColor;
        this.shadowBlur = obj.ShadowBlur;
        this.shadowOffsetX = obj.shadowOffsetX;
        this.shadowOffsetY = obj.shadowOffsetY;
    }
}

// Primitive with siplest properties
class Primitive extends Styles {
    constructor(obj) {
        super(obj);
        this.name = obj.name || 'primitive' + counter();
        this.pivot1 = obj.pivot1; // only array [a, b]
        this.pivot2 = obj.pivot2; // only array [a, b]
        this.start = obj.start;  // only array [a, b]
        this.end = obj.end;  // only array [a, b]
    }
}

// Primitive for text
class Text extends Primitive {
    constructor(obj) {
        // use this.start to put starting point of the text
        super(obj);
        this.font = obj.font;  // default : "10px sans-serif" // same as css fonts
        this.maxWidth = obj.maxWidth; //max width of a text line
        this.text = obj.text;
        this.textAlign = obj.textAlign; // start, end, left, right, center
        this.textBaseline = obj.textBaseline; // top, hanging, middle, alphabetic, ideographic, bottom
        this.direction = obj.direction; // ltr, rtl, inherit
        this.type = obj.type; // stroke or fill
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

// special class for bezier and quadratic curves
class Curve extends Primitive {
    constructor(obj) {
        super(obj);
        this.start = obj.center;
        this.end = obj.radius;
        this.pivot1 = obj.pivot1;
        this.pivot2 = obj.pivot2;
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

    // change or get canvas width
    get canvasWidth() {
        return this.width;
    }
    set canvasWidth(newValue) {
        this.canvasNode.width = newValue;
        this.width = newValue;
    }

    // change or get canvas height
    get canvasHeight() {
        return this.height;
    }
    set canvasHeight(newValue) {
        this.canvasNode.height = newValue;
        this.height = newValue;
    }

    // Resize canvas node
    resizeCanvas (w,h) {
        this.canvasNode.width = w;
		this.canvasNode.height = h;
        this.width = w;
		this.height = h;	
    }

    // Delete canvas node
    deleteCanvas () {
		this.canvasNode.remove();
	}

    // Clear whole canvas
    clearCanvas () {
		this.ctx.clearRect(0,0,this.canvasNode.width,this.canvasNode.height);
	}

    // Fill whole canvas with color
    fillCanvas (col) {
		this.ctx.fillStyle = col;
		this.ctx.fillRect(0,0,this.canvasNode.width,this.canvasNode.height);
	}

    // Simplify basic methods of canvas
    // color of lines/edges
    get strokeStyle () {
        return this.ctx.strokeStyle;
    }
    set strokeStyle (arg) {
        this.ctx.strokeStyle = (arg.constructor.name === 'Object')? arg.color : arg;
        // Here we have to check if argument is an object or a value
    }
    // color for filling
    get fillStyle () {
        return this.ctx.fillStyle;
    }
    set fillStyle (arg) {
        this.ctx.fillStyle = (arg.constructor.name === 'Object')? arg.fillColor : arg;
        // Here we have to check if argument is an object or a value
    }
    // line/edge width
    get lineWidth () {
        return this.ctx.lineWidth;
    }
    set lineWidth (arg) {
        this.ctx.lineWidth = (arg.constructor.name === 'Object')? arg.lineWidth : arg;
        // Here we have to check if argument is an object or a value
    }
    // line/edge cap : "butt" , "round" , "square"
    get lineCap () {
        return this.ctx.lineCap;
    }
    set lineCap (arg) {
        this.ctx.lineCap = (arg.constructor.name === 'Object')? arg.lineCap : arg;
        // Here we have to check if argument is an object or a value
    }
    // line/edge join : "bevel" , "round" , "miter";
    get lineJoin () {
        return this.ctx.lineJoin;
    }
    set lineJoin (arg) {
        this.ctx.lineJoin = (arg.constructor.name === 'Object')? arg.lineJoin : arg;
        // Here we have to check if argument is an object or a value
    }
    // fill with color which was defined with fillStyle method
    fill () {
        this.ctx.fill();
    }
    // begin/start new path
    beginPath () {
        this.ctx.beginPath();
    }
    // close/end new path
    closePath () {
        this.ctx.closePath();
    }
    // move to the starting point of new stroke/line
    moveTo (arr) {
        this.ctx.moveTo(...arr); // only array with 2 values allowed here. example [2, 6]
    }
    // move to the next point of stroke/line
    lineTo (arr) {
        this.ctx.lineTo(...arr); // only array with 2 values allowed here. example [2, 6]
    }
    // draw the line/edge
    stroke () {
        this.ctx.stroke();
    }
    //
    arcTo (obj) {
        this.ctx.arcTo(...obj.pivot1, ...obj.pivot2, obj.radius);
    }

    // draw path through points/vertices
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

    // draw polygon and fill it with color. Also edges have different color
    polygon (polygon) {
        this.ctx.strokeStyle = polygon.color;
		this.ctx.lineWidth = polygon.lineWidth;
		this.ctx.lineJoin = polygon.lineJoin;
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

    // draw arc according to center and angles
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

    // draw arc according to start point and two pivot points. It is like quadratic curve, but the curve is pure circle's section
    arcXY (obj) {
        this.ctx.strokeStyle = obj.color;
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.lineJoin = obj.lineJoin;
        this.ctx.lineCap = obj.lineCap;
		this.ctx.beginPath();
		this.moveTo(obj.start);
        this.arcTo(obj);
        this.lineTo(obj.end);
		//this.ctx.closePath();
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

    clearRect(rectangle) {
        this.ctx.clearRect(...rectangle.corner, rectangle.width, rectangle.height);
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

    // write text with fillText
    text (text) {
        this.ctx.strokeStyle = text.color;
        this.ctx.fillStyle = text.fillColor;
        this.ctx.lineWidth = text.lineWidth;
        this.ctx.font = text.font;
        this.ctx.maxWidth = text.maxWidth;
        this.ctx.textAlign = text.textAlign;
        this.ctx.textBaseline = text.textBaseline;
        this.ctx.direction = text.direction;
        this.ctx.type = text.type;
        if (text.type === 'stroke') {
            this.ctx.strokeText(text.text, ...text.start);
        } else {
            this.ctx.fillText(text.text, ...text.start);
        }
    }

    getTextWidth(text) {
        return this.ctx.measureText(text.text).width;
    }
}