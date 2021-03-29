let c = new CnvMaker2('#root', 1200,600);

let p1 = new Polygon({
    color: 'red',
    fillColor: 'green',
    lineWidth: 3,
    path: [[100,100],[300,100],[300,300],[100,300]]
})

c.polygon(p1.translate(300,100));