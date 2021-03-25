
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

    let copyTopPolygon = [];

    for (let i = 0; i < squareTopPolygon.path.length; i++) {
        copyTopPolygon.push(
            [
                squareTopPolygon.path[i][0],
                (squareTopPolygon.path[i][1] - 200) * 0.3 + 200
            ]
        );
    }

    let sides = [  [], [], [] ,[]  ];

    for (let i = 0; i < sides.length; i++) {
        sides[i] = [
            copyTopPolygon[i],
            copyTopPolygon[(i+1)%4],
            [copyTopPolygon[(i+1)%4][0], copyTopPolygon[(i+1)%4][1] + 160],
            [copyTopPolygon[i][0], copyTopPolygon[i][1] + 160]
        ]
    }

    c.shadowPolygon({
        shadowColor: '#888',
        shadowOffsetX: 1,
        shadowOffsetY: 180,
        shadowBlur: 20,
        lineWidth: 0,
        path: copyTopPolygon
    });

    // Find only sides that are visible. Two sides are visible
    // The idea is to find sum of Y coords of path and take two minimum values
    let sumYs = [0,0,0,0];
    for (let i = 0; i < sides.length; i++) {
        for (let j = 0; j < sides[i].length; j++) {
            sumYs[i] += sides[i][j][1];
        }
    }

    // Get indices of two minimum sumYs
    let m1 = 0, m2 = 1;
    for (let i = 2; i < sumYs.length; i++) {
        if (sumYs[m1]>=sumYs[m2]) {
            if (sumYs[m1]<sumYs[i] || sumYs[m2]<sumYs[i]) {
                m2 = i;
            }
        } else if (sumYs[m1]<sumYs[m2]) {
            if (sumYs[i]>sumYs[m1] || sumYs[i]>sumYs[m2]) {
                m1 = i;
            }
        }
    }

    console.log(m1,m2);
    // sides
    c.polygon({
        color:  rgba(200,200,255),
        fillColor: rgba(200,150,255),
        lineWidth: 1,
        linJoin: 'round',
        path: sides[m1]
    });
    c.polygon({
        color:  rgba(200,200,255),
        fillColor: rgba(200,100,255),
        lineWidth: 1,
        linJoin: 'round',
        path: sides[m2]
    });

    log(sumYs[m1])

    // top
    c.polygon({
        color: 'transparent',
        fillColor: rgba(200,200,255),
        lineWidth: 1,
        linJoin: 'round',
        path: copyTopPolygon
    });
    
    squareTopPolygon.rotate({angularSpeed: 0.01});

}

c.animation(frame)