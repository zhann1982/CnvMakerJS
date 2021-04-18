let width = 500, height = 300, dom = '#root';


let c = new CnvMaker(dom,width,height);

let calc = new Calculus2D({});
let rnd = new Random();
let pth = new pathGenerator();

let diskRadius = 8, diskColor = 'lightgreen', diskCount = 25;
let disks = [];

for (let i=0; i<diskCount; i++) {
    disks.push(new Polygon({
        lineWidth: 1,
        color: diskColor,
        fillColor: diskColor,
        path: pth.circularPath({
            center: rnd.point({start: [10,10], end: [width-10, height-10]}),
            radius: diskRadius,
            phase: 0,
            length: 36
        }),
        radius: diskRadius,
        linearSpeed: rnd.vector2D(0.5,1.5)
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
            let distance = calc.distance2points(disks[i].center, disks[j].center);
            console.log(disks[i].radius + disks[j].radius);
            if (distance <= disks[i].radius + disks[j].radius) {
                normalUnit = calc.getUnitVector(calc.subtractVectors(disks[i].center, disks[j].center));
            }
        }
    }
}

c.animation(frame);