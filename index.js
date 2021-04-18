let width = 500, height = 300, dom = '#root';


let c = new CnvMaker(dom,width,height);

let diskRadius = 4, diskColor = 'lightgreen', diskCount = 200;
let disks = [];

for (let i=0; i<diskCount; i++) {
    disks.push(new Polygon({
        lineWidth: 1,
        color: diskColor,
        fillColor: diskColor,
        path: new pathGenerator().circularPath({
            center: new Random().point({start: [10,10], end: [width-10, height-10]}),
            radius: diskRadius,
            phase: 0,
            length: 36
        }),
        linearSpeed: new Random().vector2D(0.5,1.5)
    }));
}

let frame = () => {

    c.fillCanvas('black');

    for (let i = 0; i < diskCount; i++) {
        c.polygon(disks[i]);
        disks[i].move();
        disks[i].checkBorderTouch(c);
    }

    for (let i = 0; i < diskCount-1; i++) {
        for (let j = i+1; j < diskCount; j++) {
            let distance = new Calculus2D().distance2points(disks[i].center, disks[j].center);
            if (distance <= disks[i].radius + disks[j].radius) {
                
            }
        }
    }
}

c.animation(frame);