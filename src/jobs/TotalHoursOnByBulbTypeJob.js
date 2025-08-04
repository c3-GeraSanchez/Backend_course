/**
 * Process a batch of {@link SmartBulb}s and return the total hours the smart 
 * bulbs were on grouped by bulbtype.
 */
function map(batch, objs, job) {
    var intermediaryGroup = {};
    var bulbTypes = objs.pluck("bulbType").unique();
    var bulbs = objs.pluck("id");

    bulbTypes.each(function (bulbType) {
        var metricResults = SmartBulb.rollupMetrics({
            filter: Filter.eq('bulbType', bulbType).and().intersects('id', bulbs), 
            start: job.startDate, 
            end: job.endDate, 
            interval: job.interval, 
            rollupFunc: "SUM", 
            expressions: ["DurationOnInHours"]
        });
    
        var data = metricResults.get("DurationOnInHours").data().last();
        intermediaryGroup[bulbType] = data;
    });

    return intermediaryGroup;
}

/**
 * Persists the total amount of time on of a {@link SmartBulb} per type for a given time range
 */
function reduce(outKey, interValues, job) {
    var mfg = outKey;
    var total = interValues.sum();

    var totalHours = TotalHoursOnByBulbType.make({
        bulbType: mfg,
        start: job.startDate,
        end: job.endDate,
        totalHours: total
    });

    totalHours.create();

    return total;
}