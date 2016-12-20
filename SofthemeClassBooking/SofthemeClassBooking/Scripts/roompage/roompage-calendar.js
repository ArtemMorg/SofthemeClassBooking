var roompageDate;

function roompageCalendarInit() {
    roompageDate = copyDate(currentCalendarCell);
    renderRoomPageCalendar();

}

function renderRoomPageCalendar(dateStart) {

    var roompageCalendarHeader = $('#roompage-calendar-header');
    var tdIsWeekend;
    var tdIndex = 0;

    var renderDatetime = typeof (dateStart) === "undefined"
        ? copyDate(currentCalendarCell)
        : copyDate(dateStart);

    roompageCalendarHeader.empty();

    $('#roompage-date').html(monthNames[renderDatetime.month - 1] + ', ' + renderDatetime.year);

    for (var currentDay = 0; currentDay < roompageMaxDayCalendarCount; currentDay++) {

        var dayOfWeek = getDayOfWeek(new Date(renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day).getDay());

        if (dayOfWeek === weekendSaturday || dayOfWeek === weekendSunday) {
            tdIsWeekend = currentDay;
            roompageCalendarHeader.append(
                `<td class="td-weekend"> <div class="dayName"> ${dayNames[dayOfWeek]} </div></td> `);

        } else {
            roompageCalendarHeader.append(
                `<td> <div class="dayName"> ${dayNames[dayOfWeek]} </div> <div class="dayValue"> ${renderDate(renderDatetime.day)}.${renderDatetime.month} </div></td> `);
        }

        //for (var currentHour = 0; currentHour < roompageMaxHour; currentHour++) {
        //    var cellId = roompageDate.year + '-' + roompageDate.month + '-' + roompageDate.day + '-' + roompageDate.hour + '-' + currentRoomId;
        //}
        addValueToDate(renderDatetime, { day: 1 }, true);


    }

    var currentTime = defaultMinimumBookHour;

    $('.roompage-calendar-body').each(function(i, obj) {
        var row = $(this);
        row.empty();

        renderDatetime = typeof (dateStart) === "undefined"
        ? copyDate(currentCalendarCell)
        : copyDate(dateStart);

        for (var currentTd = 0; currentTd < roompageMaxDayCalendarCount; currentTd++) {

            var cellId = renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day + '-' + currentTime;


            if ((currentTd === tdIsWeekend - 1) || (currentTd === tdIsWeekend)) {

                row.append('<td class="td-weekend">&nbsp</td>');

            } else {

                if (currentTd % 2 === 0 && currentTime % 2 !== 0) {
                    row.append(`<td id="${cellId}" class=""><div class="time">${renderTimeMinutes(currentTime, 0)}</div></td>`);
                    
                }
                else if (currentTd % 2 !== 0 && currentTime % 2 === 0) {
                    row.append(`<td id="${cellId}" class=""><div class="time">${renderTimeMinutes(currentTime, 0)}</div></td>`);
                }
                else {
                    row.append(`<td id="${cellId}" class=""><div class="time">${renderTimeMinutes(currentTime, 0)}</div></td>`);
                }


            }

            addValueToDate(renderDatetime, { day: 1 }, true);
        }

        currentTime++;


    });

}

$(document).off('click', '#roompage-before-day');
$(document).on('click', '#roompage-before-day', function() {

    addValueToDate(roompageDate, { day: 1 }, false);
    console.log(roompageDate);
    renderRoomPageCalendar(roompageDate);

});

$(document).off('click', '#roompage-next-day');
$(document).on('click', '#roompage-next-day', function () {

    addValueToDate(roompageDate, { day: 1 }, true);
    renderRoomPageCalendar(roompageDate);

});



$(document).off('click', '#roompage-now');
$(document).on('click', '#roompage-now', function() {

    roompageCalendarInit();

})