function lifeSpanInYears(){
    var startTime, defectTime, lifespan;

    startTime = this.startDate;

    defectFilter = "status == 1 && lumens == 0 && parent.id == '" + 'SBMS_serialNo_' + this.id + "'";

    defectDatum = SmartBulbMeasurement.fetch({filter: defectFilter});

    defectTime = defectDatum.objs[0].start;

    lifespan = defectTime.millis - startTime.millis;

    lsYears = lifespan / (1000*60*60*24*365);

    return lsYears;
}


function averageTemperatureMonth(endDate) {

    var average = SmartBulb.evalMetrics({
    ids: [this.id],
    expressions: ["AverageTemperature"],
    start: endDate,
    end: endDate,
    interval: "MONTH"
    });

    return average.result.get(this.id).AverageTemperature._data[0];;
}

function averageLifeSpan() {
    // declare variables to use later
    var lightbulbs, sum, avg;

    // Fetch all bulbs
    lightbulbs = SmartBulb.fetch({ include: "id, startDate", limit: -1 }).objs;

    sum = 0;

    for (var i = 0; i < lightbulbs.length; i++) {
        sum += lightbulbs[i].lifeSpanInYears();
    }

    avg = sum / lightbulbs.length;
    
    return avg;
}








