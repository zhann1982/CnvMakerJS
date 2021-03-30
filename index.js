let c = new CnvMaker2('#root', 1200,600);

let p1 = new Polygon({
    color: 'transparent',
    linearSpeed: [2,1],
    fillColor: rgba(100,255,100),
    lineWidth: 3,
    path: new pathGenerator().circularPath({
        center: [100,100],
        radius: 50,
        phase: 0,
        length: 30
    })
});

let tails = [];
let tailNums = 40

for (let i=0; i<tailNums; i++) {
    
    tails.push(new Polygon({
        color: 'transparent',
        linearSpeed: [2,1],
        fillColor: rgba(100,255,100,0.002*(i)),
        lineWidth: 3,
        path: p1.copyPath()
    }));
    p1.move();
    p1.checkBorderTouch(c);
}

tails[tailNums-1].fillColor = 'green';
tails[tailNums-1].color = 'green';
tails[0].fillColor = 'transparent'

let frame = () => {
    c.fillCanvas('black');
    for (let i=0; i<tails.length; i++) {
        tails[i].move();
        c.polygon(tails[i]);
        tails[i].checkBorderTouch(c); 
    }
    
}

c.animation(frame)