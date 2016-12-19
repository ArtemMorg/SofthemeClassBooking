function roomEventInit(userAdmin, userCanEdit) {

    resetCurrentCalendarCell();
    renderCalendar(currentCalendarMonth);
    setDateHeader(currentCalendarCell);
    renderTime(shortRoomEventTable);
    renderRooms(shortRoomEventTable, null);
    setIsUserAdmin(userAdmin === 'True', userCanEdit === 'True');
}