
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




// Testing classes

// creating pathes and objects
let points = [[100,100],[200,100],[200,200],[100,200]];

let poly1 = new Polygon(
    {
        path: points,
        color: 'red',
        fillColor: 'lime',
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'miter',
        shadowColor: '#444',
        shadowBlur: 20
    }
);

let rect1 = new Rectangle(
    {
        color: 'blue',
        fillColor: 'red',
        lineWidth: 3,
        lineCap: 'round',
        lineJoin: 'miter',
        width: 100,
        height: 230,
        corner: [50,420]
    }
);

// creating canvas in special div block
let c = new CnvMaker2(root,1200,600);

// drawing predefined objects
c.polygon(poly1);

c.arcXY(
    {
        start: [500,100],
        pivot1: [500,300],
        pivot2: [300,200],
        end: [200, 100],
        radius: 80,
        color: 'green'
    }
);

let text1 = new Text(
    {
        type: 'stroke',
        color: 'blue',
        fillColor: 'red',
        lineWidth: 2,
        text: 'Hello world',
        font: 'bold 2em Tahoma',
        start : [100,300]
    }
);

c.text(text1);
console.log(c.getTextWidth(text1));