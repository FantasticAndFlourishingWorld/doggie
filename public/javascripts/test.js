var Random = Mock.Random;
Random.ip();
Random.protocol();

var data = Mock.mock({
    'pcaps|50-100': [{
        'ip|+1': '@ip',
        'protocol': '@protocol'
    }]
})

renderPcaps(data.pcaps);
