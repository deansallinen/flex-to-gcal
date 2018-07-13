const {
    getFlexCal
} = require("./getFlex");
const Event = require('./Event')

const printData = async () => {
    const flexCal = await getFlexCal(new Date(), new Date());
    const test = flexCal.map(each => new Event(
        each.elementId,
        each.startDate,
        each.endDate,
        each.status,
        each.personResponsibleName,
        each.displayText,
        each.typeId,
        each.typeName,
        each.locationName))
    console.log(test)
}

printData();