// Let's draw and animate rotating cube
let c = new CnvMaker2('#root', 1200,600);

// First enter required data
// entering data of the top square of the cube


let createTop = ({center, width, height, angularSpeed, fillColor}) => {
    // creating corresponding object for top square
    return new Polygon({
        color: 'transparent',
        fillColor: fillColor,
        path: new pathGenerator().rectangle({center, width, height}),
        center: center,
        width: width,
        height: height,
        angularSpeed: angularSpeed
    });
}

let createTopsArray = (arr) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(createTop(arr[i]));
    }
    return result;
}

let topsArray = createTopsArray([
    {center: [200,200], width: 110, height: 110, angularSpeed: 0.02, fillColor: {r: 200, g: 250, b: 250}},
    {center: [400,200], width: 110, height: 110, angularSpeed: -0.022, fillColor: {r: 250, g: 200, b: 250}},
    {center: [600,200], width: 110, height: 110, angularSpeed: -0.03, fillColor: {r: 250, g: 250, b: 200}}
]);

// creating callback function for animating single frame
let frame = () => {

    // clear canvas for the next frame animation
    c.clearCanvas();
    
    let drawCube = (squareTopPolygon) => {
        // create the copy of top side of the cube
        // so that we can skew it vertically without changing initial top square, and use it in the animation
        let copyTopPolygon = [];
        for (let i = 0; i < squareTopPolygon.path.length; i++) {
            copyTopPolygon.push(
                [
                    squareTopPolygon.path[i][0],
                    (squareTopPolygon.path[i][1] - squareTopPolygon.center[1]) * 0.3 + squareTopPolygon.center[1]  // skewing in Y axis
                ]
            );
        }

        // get pathes of side squares
        // idea is in taking two points of top square and draw copies beneath by shifting to a value of height (height of top square)
        let sides = [  [], [], [] ,[]  ];
        for (let i = 0; i < sides.length; i++) {
            sides[i] = [
                copyTopPolygon[i],
                copyTopPolygon[(i+1)%4],
                [copyTopPolygon[(i+1)%4][0], copyTopPolygon[(i+1)%4][1] + squareTopPolygon.height],
                [copyTopPolygon[i][0], copyTopPolygon[i][1] + squareTopPolygon.height]
            ]
        }

        // draw shadow under the cube
        // actually it is shadow of top square
        c.shadowPolygon({
            shadowColor: '#888',
            shadowOffsetX: 1,
            shadowOffsetY: squareTopPolygon.height+20,
            shadowBlur: 20,
            lineWidth: 0,
            path: copyTopPolygon
        });

        // Find only sides that are visible. Two sides are visible
        // so we don't have to draw sides that are behind the cube
        // The idea is to find sum of Y coords of path and take two maximum values
        // First we get sum of Y coords of that two sides
        let sumYs = [0,0,0,0];
        for (let i = 0; i < sides.length; i++) {
            for (let j = 0; j < sides[i].length; j++) {
                sumYs[i] += sides[i][j][1];
            }
        }

        // than we get indices of that two maximum sumYs
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

        // draw visible sides of the cube
        for (let m of [m1,m2]) {
            c.polygon({
                color:  rgba(squareTopPolygon.fillColor.r,squareTopPolygon.fillColor.g,squareTopPolygon.fillColor.b),
                // colors of sides are chosen by the help of ternary operators in cascade
                fillColor: (m===0)?(rgba(squareTopPolygon.fillColor.r*8/10,squareTopPolygon.fillColor.g*8/10,squareTopPolygon.fillColor.b*8/10)) :
                                    ((m===1)?(rgba(squareTopPolygon.fillColor.r*7/10,squareTopPolygon.fillColor.g*7/10,squareTopPolygon.fillColor.b*7/10)):(
                                            (m===2)?(rgba(squareTopPolygon.fillColor.r*8/10,squareTopPolygon.fillColor.g*8/10,squareTopPolygon.fillColor.b*8/10)):
                                                    (rgba(squareTopPolygon.fillColor.r*9/10,squareTopPolygon.fillColor.g*9/10,squareTopPolygon.fillColor.b*9/10))
                                    )
                            ),
                lineWidth: 1,
                linJoin: 'round',
                // first visible side
                path: sides[m]
            });
        }

        // draw top of the cube
        c.polygon({
            color: 'transparent',
            fillColor: rgba(squareTopPolygon.fillColor.r,squareTopPolygon.fillColor.g,squareTopPolygon.fillColor.b),
            lineWidth: 1,
            linJoin: 'round',
            path: copyTopPolygon
        });
        
        // rotate original top square of the cube for next frame in the animation.
        squareTopPolygon.rotate({});
    }

    for (let i = 0; i < topsArray.length; i++) {
        drawCube(topsArray[i]);
    }

}

// start the animation
c.animation(frame);






