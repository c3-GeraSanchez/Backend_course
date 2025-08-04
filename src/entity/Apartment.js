function averageTemperatureMonth(endDate) {

    var average = Apartment.evalMetrics({
    ids: [this.id],
    expressions: ["AverageTemperature"],
    start: endDate,
    end: endDate,
    interval: "MONTH"
    });

    return average.result.get(this.id).AverageTemperature._data[0];;
}