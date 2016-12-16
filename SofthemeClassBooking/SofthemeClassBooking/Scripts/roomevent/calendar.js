var calendar = $('.roomevent-right-block');
var calendarTodayNavigaion = $('.roomevent-calendar-today');
var calendarTodayNavigationValue = $('#roomevent-calendar-today');

var currentCalendarMonth = dateNow.month;
var currentCalendarYear = dateNow.year;

var currentCalendarCell = {
    year: dateNow.year,
    month: dateNow.month,
    day: dateNow.day,
    hour: dateNow.hour,
    minutes: dateNow.minutes
};

var currentMonthRender = $('#current-month');

function renderCalendar(month) {

    var calendarBody = $('#calendar-body');
    var dayOutOfSelectedCalendarMonth = false;
    var dayNumberToFillIntoCalendar = 1;

    var selectedCalendarMonth = month || dateNow.month;

    var maxRowCalendarSize = 5;
    var maxCellCalendarSize = 7;

    var firstDayOfWeekInMonth = getDayOfWeek(new Date(currentCalendarYear + '-' + selectedCalendarMonth + '-01').getDay());
    var maxDayCount = getDaysInMonth(selectedCalendarMonth, currentCalendarYear);
    var maxDayCountLastMonth = getDaysInMonth(selectedCalendarMonth - 1, currentCalendarYear) - firstDayOfWeekInMonth + 1;

    var currentMonth = selectedCalendarMonth;
    var currentYear = currentCalendarYear;

    $('#current-month').html(monthNames[selectedCalendarMonth - 1] + ', ' + currentCalendarYear).trigger('changeCalendarNavigation');
    calendarBody.empty();


    calendarBody.append('<div id="day-names"></div>');

    for (var dayNumberToFillIntoCalendarName = 0; dayNumberToFillIntoCalendarName < 7; dayNumberToFillIntoCalendarName++) {
        $('#day-names').append('<div class="roomevent-calendar-cell-daynames ">' + dayNames[dayNumberToFillIntoCalendarName] + '</div>');
    }

    for (var row = 0; row < maxRowCalendarSize; row++) {

        calendarBody.append('<div id="calendar-cell-row-' + row + '"></div>');
        var currentRow = $('#calendar-cell-row-' + row);

        var pastMonth = (selectedCalendarMonth - 1) > 0 ? (selectedCalendarMonth - 1) : 12;
        var pastYear = (selectedCalendarMonth - 1) > 0 ? currentCalendarYear : (currentCalendarYear - 1);

        for (var b = 0; b < firstDayOfWeekInMonth; b++) {
            currentRow.append('<div id="' + pastMonth + '-' + maxDayCountLastMonth + '-' + pastYear + '" class="roomevent-calendar-cell roomevent-cell-outdate">' + maxDayCountLastMonth++ + '</div>');
        }

        for (var cell = firstDayOfWeekInMonth; cell < maxCellCalendarSize; cell++) {

            var calendarCellId = currentMonth + '-' + dayNumberToFillIntoCalendar + '-' + currentYear;

            if (!dayOutOfSelectedCalendarMonth) {

                currentRow.append('<div id="' + calendarCellId + '" class="roomevent-calendar-cell ">' + dayNumberToFillIntoCalendar + '</div>');

            } else {
                currentRow.append('<div id="' + calendarCellId + '" class="roomevent-calendar-cell roomevent-cell-outdate">' + dayNumberToFillIntoCalendar + '</div>');
            }

            dayNumberToFillIntoCalendar++;
            if (dayNumberToFillIntoCalendar > maxDayCount) {
                dayNumberToFillIntoCalendar = 1;
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
                dayOutOfSelectedCalendarMonth = true;
            }
        }

        $('#' + dateNow.month + '-' + dateNow.day + '-' + dateNow.year).css('font-weight', 'bold').css('color', '#000000');
        $('#' + currentCalendarCell.month + '-' + currentCalendarCell.day + '-' + currentCalendarCell.year).attr('class', 'roomevent-calendar-cell roomevent-calendar-cell-today');

        firstDayOfWeekInMonth = 0;
    }
}

function resetCurrentCalendarCell() {
    currentCalendarCell = {
        year: dateNow.year,
        month: dateNow.month,
        day: dateNow.day,
        hour: dateNow.hour,
        minutes: dateNow.minutes
    };

    setDateHeader(currentCalendarCell);
}

function parseIdFromCalendarSell(longId) {

    var splittedLongId = longId.split('-');
    return {
        month: splittedLongId[0],
        day: splittedLongId[1],
        year: splittedLongId[2],
        hour: 0,
        minutes: 0
    }
}

//Click events

$(document).on('click', '#roomevent-calendar-today', function () {
    currentCalendarMonth = dateNow.month;
    currentCalendarYear = dateNow.year;

    resetCurrentCalendarCell();
    renderCalendar(currentCalendarMonth);
    renderTime(currentMode);
    renderRooms(currentMode);
    renterStaticSliderTime();
});

$(document).on('click', '#calendar-month-left', function () {
    currentCalendarMonth--;
    if (currentCalendarMonth < 1) {
        currentCalendarMonth = 12;
        currentCalendarYear--;
    }
    renderCalendar(currentCalendarMonth);
});

$(document).on('click', '#calendar-month-right', function () {

    currentCalendarMonth++;
    if (currentCalendarMonth > 12) {
        currentCalendarMonth = 1;
        currentCalendarYear++;
    }
    renderCalendar(currentCalendarMonth);

});

currentMonthRender.bind('changeCalendarNavigation', function () {

    var dateComparisonResult = compareDates({ year: currentCalendarYear, month: currentCalendarMonth }, dateNow, true);

    if (dateComparisonResult == 0) {
        calendarTodayNavigaion.css('text-align', 'center');
        calendarTodayNavigationValue.html('Сегодня');
    } else if (dateComparisonResult < 0) {
        calendarTodayNavigaion.css('text-align', 'right');
        calendarTodayNavigationValue.html('Сегодня <i class="fa fa-long-arrow-right" aria-hidden="true"></i>')
    } else {
        calendarTodayNavigaion.css('text-align', 'left');
        calendarTodayNavigationValue.html('<i class="fa fa-long-arrow-left" aria-hidden="true"></i> Сегодня')
    }

});

$(document).on('click', '.roomevent-calendar-cell', function () {

    var selectedCalendarCell = $(this);
    var currentLongId = '#' + currentCalendarCell.month + '-' + currentCalendarCell.day + '-' + currentCalendarCell.year;
    $(currentLongId).removeClass('roomevent-calendar-cell-today');
    selectedCalendarCell.addClass('roomevent-calendar-cell-today');

    var nextLongId = selectedCalendarCell.attr('id');
    currentCalendarCell = parseIdFromCalendarSell(nextLongId);

    setDateHeader(currentCalendarCell);

    if (currentCalendarMonth != currentCalendarCell.month) {

        currentCalendarMonth = currentCalendarCell.month;
        currentCalendarYear = currentCalendarCell.year;
        renderCalendar(currentCalendarMonth);
    }

    if (currentCalendarCell.day != dateNow.day) {
        renderTime(currentMode, { hour: 0, minutes: 0 });
        renderRooms(currentMode, { hour: 0, minutes: 0 });
        $('.slider-time').html(renderTimeMinutes(0, 0));
    } else {
        renderTime(currentMode);
        renderRooms(currentMode);
    }
    renterStaticSliderTime();
});
