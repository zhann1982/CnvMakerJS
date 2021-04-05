let c = new CnvMaker('#root', 1200, 600);



let layout;

let chart = new Chart({
    layout : {
        startPoint : [100,100], 
        width : 400, 
        height : 400,
        borderColor : '#aaa', 
        borderWidth : 1,
        bgcolor : '#efefefaa', 
        chartType : 'bars', 
        barColor : 'green',
        barLabels: true
    },
    title: {
        text: 'Squares of Numbers',
        color: 'blue',
        font: '24px Arial'
    },
    yAxis: {
        label: 'Squares',
        min: 0,
        max: 50,
        //data: [150,215,355,420,645,891]
    },
    xAxis: {
        label: 'Natural Numbers',
        //data: ['Jan','Feb','Mar','Apr','May','Jun']
    },
    input : [
        [1,1],[2,4],[3,9],[4,16],[5,25],[6,36],[7,49]
    ]
});

c.chart(chart);