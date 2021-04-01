let c = new CnvMaker2('#root', 1200,600);

let createTail = () => {
    let speed = [Math.ceil(-3) + Math.round((3-(-3)))*Math.random(),
        Math.ceil(-3) + Math.round((3-(-3)))*Math.random()];
    let r = 100 + Math.round(Math.random()*155),
        g = 100 + Math.round(Math.random()*155),
        b = 100 + Math.round(Math.random()*155);

    let p1 = new Polygon({
    color: 'transparent',
    linearSpeed: [...speed],
    fillColor: rgba(r,g,b),
    lineWidth: 1,
    path: new pathGenerator().circularPath({
    center: new Random().point({start:[200,200],end:[1000,400]}),
    radius: 10,
    phase: 0,
    length: 30
    })
    });

    let tails = [];
    let tailNums = 20

    for (let i=0; i<tailNums; i++) {

    tails.push(new Polygon({
    color: 'transparent',
    linearSpeed: [...speed],
    fillColor: rgba(r,g,b,0.004*(i)),
    lineWidth: 3,
    path: p1.copyPath()
    }));
    p1.move();
    p1.checkBorderTouch(c);
    }

    tails[tailNums-1].fillColor = rgba(r,g,b);
    tails[tailNums-1].color = 'transparent';
    tails[0].fillColor = 'transparent';

    return tails;
}

let objects = [];
for (let i=0; i<40; i++) {
    objects.push(createTail());
}

let frame = () => {
    c.fillCanvas('black');

    for (let j=0; j<objects.length; j++) {
        let tails = objects[j];
        for (let i=0; i<tails.length; i++) {
            tails[i].move();
            c.polygon(tails[i]);
            tails[i].checkBorderTouch(c); 
        }
    }
    
    
}

c.animation(frame);