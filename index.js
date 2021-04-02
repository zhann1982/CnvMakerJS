let c = new CnvMaker('#root', 1200, 600);



let layout;

let chart = new Chart({
    layout : {
        startPoint : [100,100], 
        width : 500, 
        height : 400,
        borderColor : '#aaa', 
        borderWidth : 1,
        bgcolor : '#efefefaa', 
        chartType : 'bars', 
        barColor : 'red'
    },
    title: {
        text: 'Awesome Chart',
        color: 'red',
        font: '24px Arial'
    },
    yAxis: {
        label: 'Likes',
        min: 0,
        max: 1000
    }
});

c.chart(chart);