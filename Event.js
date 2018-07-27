class Event {
  constructor(event) {
    this.elementId = event.elementId;
    this.startDate = new Date(event.startDate);
    this.endDate = new Date(event.endDate);
    this.status = event.status;
    this.manager = event.personResponsibleName;
    this.displayText = event.displayText;
    this.typeId = event.typeId;
    this.typeName = event.typeName;
    this.locationName = event.locationName;
  }

  get id() {
    return this.elementId.replace(/-/g, '');
  }

  get title() {
    return this.displayText.slice(10);
  }

  get number() {
    return this.displayText.slice(0, 7);
  }
}

module.exports = Event;
