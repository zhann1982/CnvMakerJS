// Canvas framework for simplest 2d drawings and animation

// Closure for creating counters
const closure = () => {
    let k = 1;
    return function(){
        return k++;
    }
}

// counter that gives us next natural number, starting from 0
let counterForName = closure();

// make rgba colors functionally available
let rgba = (r,g,b,op) => `rgba(${r}, ${g}, ${b}, ${op?op:1})` ;
// make hsla colors functionally available
let hsla = (h,s,l,op) => `hsla(${h}, ${s}, ${l}, ${op?op:1})` ;

// shortcut for logging
let log = console.log; 
let dir = console.dir;
let error = console.error;

// shortcuts for vanilla js
let $id = el => document.getElementById(el);
let $qu = el => document.querySelector(el);
let $quA = el => document.querySelectorAll(el);
let $bd = document.body;

// simplifying trig functions
let sin = x => Math.sin(x);
let cos = x => Math.cos(x);
let tan = x => Math.tan(x);
const PI =  Math.PI;
const Tau = 2*PI;

// simplifying square root
let sqrt = x => Math.sqrt(x);

// simplifying exponent and logarithm functions
let exp = x => Math.exp(x);
let ln = x => Math.log(x);

// absolute value |x|
let abs = x => Math.abs(x);

// simplifying minimum and maximum
let min = Math.min;
let max = Math.max;

// class for Styles. Notice: this class doesn't affect current styles of context
class Styles {
    constructor(obj) {
        this.color = obj.color;
        this.fillColor = obj.fillColor;
        this.lineWidth = obj.lineWidth;
        this.lineCap = obj.lineCap;  // "butt" , "round" , "square"
        this.lineJoin = obj.lineJoin; // "bevel" , "round" , "miter"
        this.shadowColor = obj.shadowColor;
        this.shadowBlur = obj.ShadowBlur;
        this.shadowOffsetX = obj.shadowOffsetX;
        this.shadowOffsetY = obj.shadowOffsetY;
    }
}

// Primitive with simplest properties
class Primitive extends Styles {
    constructor(obj) {
        super(obj);
        this.name = obj.name || 'primitive' + counterForName();
        this.pivot1 = obj.pivot1; // only array [a, b]
        this.pivot2 = obj.pivot2; // only array [a, b]
        this.start = obj.start;  // only array [a, b]
        this.end = obj.end;  // only array [a, b]
        this.ccw = obj.ccw;

        // special keys for motion
        this.linearSpeed = obj.linearSpeed || [0,0];   //  array with shift values [dx, dy]
        if (obj.angularSpeed) {
            this.angularSpeed = (this.ccw)?(obj.angularSpeed*-1):obj.angularSpeed;   // change of angle for rotation
        } else {
            this.angularSpeed = 0;
        }
        this.linearAcceleration = obj.linearAcceleration;    // change of linear speed
        this.angularAcceleration = obj.angularAcceleration;   // change of angular speed
    }

    getCopy () {
        return Object.assign({}, this);
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

// Create polygon from points. setup colors and line-width of edges
// "color" is for edges, "fillColor" is for filling inside of polygon
class Polygon extends Primitive{
    constructor(obj) {
        super(obj);
        this.path = obj.path;
        this.center = obj.center ?? this.getCenter();
        this.width = obj.width
        this.height = obj.height
    }

    // copy path to avoid reference errors
    copyPath () {
        let path = [];
        for (let i=0; i<this.path.length; i++) {
            path.push([
                this.path[i][0],
                this.path[i][1]
            ]);
        }
        return path;
    }

    // get geometrical center
    getCenter () {
        let cx = 0, cy = 0;
        for (let i = 0; i < this.path.length; i++) {
            cx += this.path[i][0];
            cy += this.path[i][1];
        }
        this.center = [cx/this.path.length, cy/this.path.length];
        return this.center;
    }

    // move one step according to linearSpeed
    move (obj = {}) {
        if (obj.linearSpeed) this.linearSpeed = obj.linearSpeed;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] += this.linearSpeed[0];
            this.path[i][1] += this.linearSpeed[1];
        }
        return this;
    }

    // rotate one step according to angularSpeed
    rotate (obj = {}) {
        if (obj.angularSpeed) this.angularSpeed = obj.angularSpeed;
        this.rotationCenter = this.getCenter()
        for (let i = 0; i < this.path.length; i++) {
            let pointX = this.path[i][0] - this.rotationCenter[0], 
                pointY = this.path[i][1] - this.rotationCenter[1];
            this.path[i][0] = pointX*Math.cos(this.angularSpeed) - pointY*Math.sin(this.angularSpeed) + this.rotationCenter[0];
            this.path[i][1] = pointX*Math.sin(this.angularSpeed) + pointY*Math.cos(this.angularSpeed) + this.rotationCenter[1];
        }
        return this;
    }

    // Check if polygon is touching borders of canvas. Overflow allows to check border outside the canvas
    checkBorderTouch(canvas, overflow = 0) {
        if (!canvas) return this;
        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i][0]<1 - overflow && (this.path[i][0]+this.linearSpeed[0])<this.path[i][0]) this.linearSpeed[0] *= -1;
            if (this.path[i][0]>canvas.width-1 + overflow && (this.path[i][0]+this.linearSpeed[0])>this.path[i][0]) this.linearSpeed[0] *= -1;
            if (this.path[i][1]<1 - overflow && (this.path[i][1]+this.linearSpeed[1])<this.path[i][1]) this.linearSpeed[1] *= -1;
            if (this.path[i][1]>canvas.height-1 + overflow && (this.path[i][1]+this.linearSpeed[1])>this.path[i][1]) this.linearSpeed[1] *= -1;
        }
        return this;
    }

    scaleX (coeff) {
        if (!coeff) return this;
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] = (this.path[i][0] - center[0])*coeff + center[0];
        }
        return this;
    }

    scaleY (coeff) {
        if (!coeff) return this;
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][1] = (this.path[i][1] - center[1])*coeff + center[1];
        }
        return this;
    }

    scale (coeff1, coeff2 = coeff1) {
        if (!coeff1) return this;
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] = (this.path[i][0] - center[0])*coeff1 + center[0];
            this.path[i][1] = (this.path[i][1] - center[1])*coeff2 + center[1];
        }
        return this;
    }

    flipX () {
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] = (this.path[i][0] - center[0])*(-1) + center[0];
        }
        return this;
    }

    flipY () {
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][1] = (this.path[i][1] - center[1])*(-1) + center[1];
        }
        return this;
    }

    skewX (degree) {
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] = this.path[i][0] + (this.path[i][1] - center[1])*tan(-degree);
        }
        return this;
    }

    skewY (degree) {
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][1] = this.path[i][1] + (this.path[i][0] - center[0])*tan(-degree);
        }
        return this;
    }

    translateX (xShift) {
        if (!xShift) return this;
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] = (this.path[i][0] - center[0]) + xShift + center[0];
        }
        return this;
    }

    translateY (yShift) {
        if (!yShift) return this;
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][1] = (this.path[i][1] - center[1]) + yShift + center[1];
        }
        return this;
    }

    translate (xShift, yShift) {
        if (!xShift || !yShift) return this;
        let center = this.center;
        for (let i = 0; i < this.path.length; i++) {
            this.path[i][0] = (this.path[i][0] - center[0]) + xShift + center[0];
            this.path[i][1] = (this.path[i][1] - center[1]) + yShift + center[1];
        }
        return this;
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

// special class for creating random values
class Random {
    constructor(){}

    // get random element of given array
    element (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // get random natural number between Min and Max values
    natural (min,max) {
        return Math.ceil(min) + Math.round((max-min)*Math.random());
    }

    // get random real number between Min and Max values
    real (min,max) {
        return min + (max-min)*Math.random();
    }

    // get random angle value in radians between 0 and 2PI
    angle () {
        return this.real(0,2*Math.PI);
    }

    // get random color in RGBA with given opacity
    color (opacity) {
        let r = Math.round((255)*Math.random()),
		    g = Math.round((255)*Math.random()),
		    b = Math.round((255)*Math.random());
	return `rgba(${r}, ${g}, ${b}, ${opacity?opacity:1})`;
    }

    // get random vector [x,y] with length between Min and Max values, and random angle
    vector2D (minLength, maxLength) {
        let length = this.real(minLength,maxLength),
            angle = this.angle();
        return [length*Math.cos(angle), length*Math.sin(angle)];
    }

    // get random point within rectangle, where START is upperleft corner and the END is bottomright corner
    point ({start,end}) {
        return [Math.ceil(start[0]) + Math.round((end[0]-start[0])*Math.random()),
                Math.ceil(start[1]) + Math.round((end[1]-start[1])*Math.random())];
    }

    points ({start,end,number}) {
        let arr = [];
        for (let i = 0; i < number; i++) {
            arr.push([Math.ceil(start[0]) + Math.round((end[0]-start[0])*Math.random()),
                      Math.ceil(start[1]) + Math.round((end[1]-start[1])*Math.random())]);
        }
        return arr;
    }

    arrayOfRandomNumbers (obj) {
        let array = [];
        for (let i = 0; i < obj.length; i++) {
            array.push(obj.minValue + (obj.maxValue-obj.minValue)*Math.random());
        }
    }
}

// special class for creating different pathes
class pathGenerator {
    constructor() {}

    // get array of consecutive numbers between START value and END value
    consecutiveNumbers ({start,end,length}) {
        if (length>2) {
			let arr = [];
			arr.push(start);
			for (let i=0; i<length-2; i++){
				let next = start+(end-start)*(i+1)/(length-1);
				arr.push(next);
			}	
			arr.push(end);
			return arr;
		} else {
		    return undefined;
	    }
    }
    
    straightPath ({start,end,length}) {
        let arrayX = this.consecutiveNumbers({start: start[0],end: end[0],length}), 
            arrayY = this.consecutiveNumbers({start: start[1],end: end[1],length}),
            path = [];
        for (let i=0; i<length; i++) {
            path.push([arrayX[i], arrayY[i]]);
        }
        return path;
    }

    circularPath ({center, radius, phase, length}) {
        let vertices = this.consecutiveNumbers({start: 0, end: 2*PI, length: length+1});
        let path = [];
        for (let i=0; i<length; i++) {
            path.push( [ (center[0] + radius*cos(vertices[i] - phase - PI/2)) , (center[1] + radius*sin(vertices[i] - phase - PI/2)) ] );
        }
        return path;
    }

    rectangle ({center, width, height}) {
        return [
            [center[0] - width/2, center[1] - height/2],
            [center[0] + width/2, center[1] - height/2],
            [center[0] + width/2, center[1] + height/2],
            [center[0] - width/2, center[1] + height/2]
        ]
    }
}

// main class for manipulating canvas
class CnvMaker {

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
		} else if (el.constructor.name === 'String') {
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

    // save current context
    save () {
        this.ctx.save();
    }

    // restore current context
    restore () {
        this.ctx.restore();
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

    // methods for drawing 2D shapes
    // draw line from START point to END point
    line (obj) {
		this.ctx.strokeStyle = obj.color;
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.lineCap = obj.lineCap;
		this.ctx.beginPath();
		this.ctx.moveTo(...obj.start);
		this.ctx.lineTo(...obj.end);
		this.ctx.stroke();
	}

    // draw quadratic curve
	quadraticCurve (obj) {
		this.ctx.strokeStyle = obj.color;
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.lineCap = obj.lineCap;
		this.ctx.beginPath();
		this.ctx.moveTo(...obj.start);
		this.ctx.quadraticCurveTo(...obj.pivot1, ...obj.end);
		this.ctx.stroke();
	}
	
	// draw bezier curve
	bezierCurve (obj) {
		this.ctx.strokeStyle = obj.color;
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.lineCap = obj.lineCap;
		this.ctx.beginPath();
		this.ctx.moveTo(...obj.start);
		this.ctx.quadraticCurveTo(...obj.pivot1, ...obj.pivot2, ...obj.end);
		this.ctx.stroke();
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

    point (obj) {
        this.ctx.strokeStyle = obj.color;
        this.ctx.fillStyle = obj.fillColor
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.beginPath();
		this.ctx.arc(
            obj.center[0],
            obj.center[1],
            obj.radius,
            0,
            2*Math.PI
        );
        this.ctx.closePath();
		this.ctx.stroke();
        this.ctx.fill();
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

    // delete everything within borders of rectangle
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

    getTextWidth (text) {
        return this.ctx.measureText(text.text).width;
    }

    // special method for animating frames
    animation (func) {
        let frame = () => {
            func();
            window.requestAnimationFrame(frame);
        }
        frame();
    }

    // add blur effect to next drawings
    setBlur (number) {
        this.ctx.filter = `blur(${number}px)`;
    }

    // reset blur effect to 'none'
    clearBlur () {
        this.ctx.filter = `blur(0px)`;
    }

    setOpacity (value) {
        this.ctx.globalAlpha = value;
    }

    clearOpacity () {
        this.ctx.globalAlpha = 1.0;
    }

    globalCompositeOperation (valueString) {
        this.ctx.globalCompositeOperation = valueString;
        // possible values: source-over, source-in, source-out, source-atop,
        //                  destination-over, destination-in, destination-out, destination-atop,
        //                  lighter, copy, xor, multiply, screen, overlay, darken, lighten, color-dodge
        //                  color-burn, hard-light, soft-light, difference, exclusion, hue,
        //                  saturation, color, luminosity, 
    }

    shadowPath (obj) {
        this.setBlur(obj.shadowBlur);
        this.ctx.strokeStyle = obj.shadowColor;
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.lineJoin = obj.lineJoin;
        this.ctx.lineCap = obj.lineCap;
		this.ctx.beginPath();
		this.ctx.moveTo(obj.path[0][0] + obj.shadowOffsetX, obj.path[0][1] + obj.shadowOffsetY);
		for (let i=1; i<obj.path.length; i++) {
			this.ctx.lineTo(obj.path[i][0] + obj.shadowOffsetX, obj.path[i][1] + obj.shadowOffsetY);
		}
		this.ctx.stroke();
        this.clearBlur();
    }

    shadowPolygon (obj) {
        this.setBlur(obj.shadowBlur);
        this.ctx.strokeStyle = obj.shadowColor;
		this.ctx.lineWidth = obj.lineWidth;
		this.ctx.lineJoin = obj.lineJoin;
		this.ctx.beginPath();
		this.ctx.moveTo(obj.path[0][0] + obj.shadowOffsetX, obj.path[0][1] + obj.shadowOffsetY);
		for (let i=1; i<obj.path.length; i++) {
			this.ctx.lineTo(obj.path[i][0] + obj.shadowOffsetX, obj.path[i][1] + obj.shadowOffsetY);
		}
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fillStyle = obj.shadowColor;
		this.ctx.fill();
        this.clearBlur();
    }

    randomPoint () {
        return [Math.round(this.width*Math.random()),
                Math.round(this.height*Math.random())];
    }

    translateCanvas (dx,dy) {
        this.ctx.translate(dx,dy);
    }

    scaleCanvas (coeffX,coeffY) {
        this.ctx.scale(coeffX,coeffY);
    }

    originToCenter () {
        this.translateCanvas(this.width/2, this.height/2);
    }

    grid (obj) {
        this.gridStep = obj.gridStep;
        this.gridColor = obj.gridColor;
        
        for ( let i = -2*this.width; i < 2*this.width; i += obj.gridStep ) {
            this.line({
                color: obj.gridColor,
		        lineWidth: 1,
		        lineCap: 'round',
		        start: [i,-2*this.height],
		        end: [i,2*this.height]
            });
        }
        for ( let i = -2*this.height; i < 2*this.height; i += obj.gridStep ) {
            this.line({
                color: obj.gridColor,
		        lineWidth: 1,
		        lineCap: 'round',
		        start: [-2*this.width,i],
		        end: [2*this.width,i]
            });
        }
    }

    isPath (path) {
        if (path.constructor.name !== 'Array') return false;

        for (let i=0; i<path.length; i++) {

            if (path[i].constructor.name !== 'Array') return false;
            if (path[i].length !== 2) return false;

            if (path[i][0].constructor.name !== 'Number') return false;
            if (path[i][1].constructor.name !== 'Number') return false;
            
        }

        return true;
    }

    isEmptyPath (path) {
        if (path.constructor.name !== 'Array') return false;
        if (path.length !== 0) return false;
        return true;
    }

    chart (chart) {

        // setup layout
        this.rectangle({
            color: chart.layout.borderColor,
            fillColor: chart.layout.bgcolor,
            lineWidth: chart.layout.borderWidth,
            lineJoin: 'round',
            corner: chart.layout.startPoint,
            width: chart.layout.width,
            height: chart.layout.height
        });

        // draw title
        let start = [...chart.layout.startPoint],
            width = chart.layout.width,
            height = chart.layout.height;
        this.text({
            start: [ start[0] + width/2, start[1] + height/10 ],
            textAlign: 'center',
            color: chart.title.color,
            fillColor: chart.title.color,
            font: chart.title.font,
            text: chart.title.text,
            type: 'fill',
            maxWidth : width - 40,
            lineWidth: 1
        });

        // draw axis Y
        this.line({
            color: 'black',
            lineWidth: 1,
            lineCap: 'round',
            start: [start[0] + width/10, start[1] + height - width/10],
            end: [start[0] + width/10, start[1] +  width/10]
        });

        // draw axis X
        this.line({
            color: 'black',
            lineWidth: 1,
            lineCap: 'round',
            start: [start[0] + width/10, start[1] + height - width/10],
            end: [start[0] + width - width/10, start[1] + height - width/10]
        });

        // write labels
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.font = '14px Tahoma';

        this.ctx.save();
        this.ctx.translate(start[0] + width/10, start[1] +  width/10);
        this.ctx.textAlign = "center";
        this.ctx.fillText(chart.yAxis.label, 0, -width/100 - 4);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(start[0] + width - width/10, start[1] + height - width/10);
        this.ctx.textAlign = "center";
        this.ctx.fillText(chart.xAxis.label, 0, width/100 + 14);
        this.ctx.restore();

        // calculate needed data 
        let xAxisLength = width - 2*width/10,
            axisStart = [start[0] + width/10, start[1] + height - width/10],
            xAxisEnd = [start[0] + width - width/10, start[1] + height - width/10],
            yAxisLength = height - 2*width/10,
            yAxisEnd = [start[0] + width/10, start[1] +  width/10];


        if (chart.layout.chartType = 'bars') {
            // numeric values for bars
            let barGrid = new pathGenerator().consecutiveNumbers({start: axisStart[0]+xAxisLength/10, end: xAxisEnd[0]-xAxisLength/15, length: 7});
            let barXcenters = [];

            let barYmax = [start[0] + width/10, start[1] + width/10],
                barYmin = [start[0] + width/10, start[1] + height - width/10];

            let barYlength = barYmin[1] - barYmax[1];

            barYmax[1] += barYlength/10; 

            for (let i = 1; i < barGrid.length; i++) {
                barXcenters.push([
                    (barGrid[i] - barGrid[i-1])/2,
                    start[0] + width/10
                ]);

                this.disk({
                    color: 'black',
                    fillColor: 'black',
                    radius: 2,
                    lineWidth: 1,
                    center: [
                        barGrid[i-1] + (barGrid[i] - barGrid[i-1])/2,
                        start[1] + height - width/10
                    ]
                });

                this.text({
                    color: 'black',
                    fillColor: 'black',
                    text: chart.xAxis.data[i-1],
                    lineWidth: 1,
                    start: [
                        barGrid[i-1] + (barGrid[i] - barGrid[i-1])/2,
                        start[1] + height - width/10 + 4
                    ],
                    textAlign: 'center',
                    textBaseline: 'top'
                });
            }
            // min indicator dot
            this.disk({
                color: 'black',
                fillColor: 'black',
                radius: 2,
                lineWidth: 1,
                center: barYmin
            });
            // min indicator text
            this.text({
                color: 'black',
                fillColor: 'black',
                text: chart.yAxis.min,
                lineWidth: 1,
                start: [barYmin[0]-5, barYmin[1]],
                textAlign: 'end'
            });
            // max indicator dot
            this.disk({
                color: 'black',
                fillColor: 'black',
                radius: 2,
                lineWidth: 1,
                center: barYmax
            });
            // min indicator text
            this.text({
                color: 'black',
                fillColor: 'black',
                text: chart.yAxis.max,
                lineWidth: 1,
                start: [barYmax[0]-5, barYmax[1]],
                textAlign: 'end'
            });

            let barYdataLengthes = [];
            for (let i=0; i<chart.yAxis.data; i++) {
                barYdataLengthes.push( (barYlength/chart.yAxis.max)*chart.yAxis.min);
            }

            for (let i=0; i<chart.xAxis.data; i++) {

            }

        }
    }
}

class Calculus2D {
    constructor (obj) {
        this.matrix = obj.matrix;
        this.vector = obj.vector; // array with random length, all elements are numbers
        this.point = obj.point;
    }

    isPoint (point) {
        if (point.constructor.name !== 'Array') return false;
        if (point.length !== 2) return false;
        if (point[0].constructor.name !== 'Number' || point[1].constructor.name !== 'Number') return false;
        if (Number.isNaN(point[0]) || Number.isNaN(point[1])) return false;
        return true;
    }

    isVector (vector) {
        if (vector.constructor.name !== 'Array') return false;
        for (let i=0; i<vector.length; i++) {
            if (vector[i].constructor.name !== 'Number' || Number.isNaN(vector[i])) return false;
        }
        return true;
    }

    isMatrix (matrix) {

        if (matrix.constructor.name !== 'Array') return false;

        let rowLength = matrix[0].length;

        for (let i=0; i<matrix.length; i++) {

            if (matrix[i].constructor.name !== 'Array') return false;
            if (matrix[i].length !== rowLength) return false;

            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j].constructor.name !== 'Number') return false;
            }
        }

        return true;
    }

    isSquareMatrix (matrix) {
        if (!this.isMatrix(matrix)) return false;
        if (matrix.length !== matrix[0].length) return false;
        return true;
    }

    vectorLength (vector) {
        let length = 0;
        for (let i=0; i<vector.length; i++) {
            length += vector[i]**2;
        }
        return sqrt(length);
    }

    getUnitVector(vector) {
        let length = this.vectorLength(vector),
            unitVector = [];
        for (let i=0; i<vector.length; i++) {
            unitVector.push(vector[i]/length);
        }
        return unitVector;
    }

    zerosVector (numElements) {
        let vector = [];
        for (let j=0; j<numElements; j++) vector.push(0);
        return vector;
    }

    onesVector (numElements) {
        let vector = [];
        for (let j=0; j<numElements; j++) vector.push(1);
        return vector;
    }

    zerosMatrix (numRows, numCols = numRows) {
        let matrix = [];
        for (let i=0; i<numRows; i++) {
            let row = [];
            for (let j=0; j<numCols; j++) {
                row.push(0);
            }
            matrix.push(row);
        }
        return matrix;
    }

    onesMatrix (numRows, numCols = numRows) {
        let matrix = [];
        for (let i=0; i<numRows; i++) {
            let row = [];
            for (let j=0; j<numCols; j++) {
                row.push(1);
            }
            matrix.push(row);
        }
        return matrix;
    }
    
    identityMatrix (numRows, numCols = numRows) {
        let matrix = [];
        for (let i=0; i<numRows; i++) {
            let row = [];
            for (let j=0; j<numCols; j++) {
                if (i===j) {
                    row.push(1);
                } else {
                    row.push(0);
                }
                
            }
            matrix.push(row);
        }
        return matrix;
    }

    dotProduct (v1,v2) {
        if (v1.length !== v2.length) return undefined;
        let product = 0;
        for (let i=0; i<v1.length; i++) {
            product += v1[i] * v2[i];
        }
    }

    vectorProduct (v1,v2) {
        if (v1.length !==3 && v2.length !==3) return undefined;
        return [
            v1[1]*v2[2] - v1[2]*v2[1],
           -v1[0]*v2[2] + v1[2]*v2[0],
            v1[0]*v2[1] - v1[1]*v2[0]
        ]
    }
}

class Chart {
    constructor(obj) {
        this.layout = obj.layout;
        /* layout = {
            startPoint, width, height
            borderColor, borderWidth
            bgcolor, chartType, barColor
        } */
        this.title = obj.title;
        /* title = {
            text, color, placement, font
        } */
        this.xAxis = obj.xAxis;
        /* xAxis = {
            label, min, max, data
        } */
        this.yAxis = obj.yAxis;
        /* yAxis = {
            label, min, max, data
        } */
        this.infoPanel = obj.infoPanel;
    }
}

