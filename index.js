let mat = new Calculus2D({
    point: [2,7]
});

let unit = mat.getUnitVector([2,4,3,1]);

console.log(mat.vectorLength(unit));