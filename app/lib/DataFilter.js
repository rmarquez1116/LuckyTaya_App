function dataFilterByDate(data,dateField,dateFrom,dateTo) {
    var startDate = new Date(dateFrom);
    var endDate = new Date(dateTo);

    var results = data.filter(function (a) {
        var date = new Date(a[dateField])
        return  date >= startDate && date <= endDate;
    });
    return results
}

function dataFilterByCurrentMonth(currentDate,data,dateField) {
    var date = new Date(currentDate);
    var startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
   

    var results = data.filter(function (a) {
        var date = new Date(a[dateField])
        return  date >= startDate && date <= endDate;
    });
    return results
}
function formatDate  (date) {
	date = date.replaceAll('-', '').replace('T', '').replaceAll(':', '').split('.')[0]
    return date;
}

export {dataFilterByDate,dataFilterByCurrentMonth,formatDate}