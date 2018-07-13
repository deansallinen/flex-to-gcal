class Event {
    constructor(elementId, startDate, endDate, status, manager, displayText, typeId, typeName, locationName) {
        this.elementId = elementId;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.status = status;
        this.manager = manager;
        this.displayText = displayText;
        this.typeId = typeId;
        this.typeName = typeName;
        this.locationName = locationName;
    }

    get id() {
        this.elementId.replace(/-/g, '');
    }

    get title() {
        return this.displayText.slice(10);
    }
    get number() {
        return this.displayText.slice(0, 7);
    }
}

module.exports = Event