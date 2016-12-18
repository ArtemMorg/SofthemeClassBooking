function roomEventInit(isUserCanEdit) {

    resetCurrentCalendarCell();
    renderCalendar(currentCalendarMonth);
    setDateHeader(currentCalendarCell);
    renderTime(shortRoomEventTable);
    renderRooms(shortRoomEventTable, null);
    setIsUserCanEdit(isUserCanEdit === 'True');
}