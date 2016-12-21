function roomEventInit(userCanEdit) {

    resetCurrentCalendarCell();
    renderCalendar(currentCalendarMonth);
    setDateHeader(currentCalendarCell);
    renderTime(shortRoomEventTable);
    renderRooms(shortRoomEventTable, null);
    setIsUserAdmin(userCanEdit === 'True');
}