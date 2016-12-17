function roomEventInit() {
    resetCurrentCalendarCell();
    renderCalendar(currentCalendarMonth);
    setDateHeader(currentCalendarCell);
    renderTime(shortRoomEventTable);
    renderRooms(shortRoomEventTable, null);

}