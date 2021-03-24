
let c = new CnvMaker2('#root', 1200,600);

// First animate rotating square

let center = [200,200],
    width = height = 160,
    squareTop = new pathGenerator().rectangle({center, width, height});

let squareTopPolygon = new Polygon({
    color: 'transparent',
    fillColor: rgba(200,200,255),
    path: squareTop
});

let frame = () => {
    c.clearCanvas();

    for (let i = 0; i < squareTopPolygon.path.length; i++) {
        squareTopPolygon.path[i][1] = (squareTopPolygon.path[i][1] - 200) * 0.3 + 200;
    }

    c.shadowPolygon({
        shadowColor: '#888',
        shadowOffsetX: 1,
        shadowOffsetY: 180,
        shadowBlur: 20,
        lineWidth: 0,
        path: squareTopPolygon.path
    });

    c.polygon({
        color: 'transparent',
        fillColor: rgba(200,200,255),
        path: squareTopPolygon.path
    });

    for (let i = 0; i < squareTopPolygon.path.length; i++) {
        squareTopPolygon.path[i][1] = (squareTopPolygon.path[i][1] - 200) / 0.3 + 200;
    }
    
    squareTopPolygon.rotate({angularSpeed: 0.02});

}

c.animation(frame)