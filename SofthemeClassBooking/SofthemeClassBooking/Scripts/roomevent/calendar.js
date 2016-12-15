var calendar = $('.roomevent-right-block');
var calendarTodayNavigaion = $('.roomevent-calendar-today');
var calendarTodayNavigationValue = $('#roomevent-calendar-today');

var dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
var monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var monthNamesAccusative = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

var date = new Date();

var dateFormats = {
    CShartDateTime : 0
}

var datePartsEnum = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    minutes: 4
}

var dateNow = {
    year: date.getFullYear(),
    month: (date.getMonth() + 1),
    day: date.getDate(),
    hour: date.getHours(),
    minutes: date.getMinutes()
};

var dateNowStartClock = setInterval(setDateNow, 1000 * 60);

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
    var CalendarCellIdParameters = {
        month: splittedLongId[0],
        day: splittedLongId[1],
        year: splittedLongId[2],
        hour: 0,
        minutes: 0
    }

    return CalendarCellIdParameters;
}

function getDayOfWeek(day) {
    var trueDay = day - 1;
    if (trueDay < 0) {
        trueDay = 6;
    }
    return trueDay;
}

function compareTime(time, timeTo) {
    var totalMinutes = time.hour * 60 + time.minutes;
    var totalMinutesTo = timeTo.hour * 60 + timeTo.minutes;

    if (totalMinutes > totalMinutesTo) {
        return 1;
    } else if (totalMinutes < totalMinutesTo) {
        return -1;
    } else {
        return 0;
    }
}

function compareDates(date, dateTo, ignoreDays, incudeTime) {

    var ignore = ignoreDays || false;
    var time = incudeTime || false;

    if (date.year > dateTo.year) {
        return 1;
    } else if (date.year < dateTo.year) {
        return -1;
    } else if (date.month > dateTo.month) {
        return 1;
    } else if (date.month < dateTo.month) {
        return -1;
    } else if (!ignore && (date.day > dateTo.day)) {
        return 1;
    } else if (!ignore && (date.day < dateTo.day)) {
        return -1;
    } else  if (time) {
        return compareTime(date, dateTo);
    } else {
        return 0;
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
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

function renderTimeMinutes(hours, minutes, asObject) {
    var renderHours = hours > 9 ? hours : '0' + hours;
    var renderMinutes = minutes > 9 ? minutes : '0' + minutes;

    if (asObject) {
        return { hour: renderHours, minutes: renderMinutes };
    }
    return renderHours + ':' + renderMinutes;
}


function getCurrentTime(returnObject) {
    var dateNow = new Date();
    if (returnObject == true) {
        return {
            hour: dateNow.getHours(),
            minutes: dateNow.getMinutes()
        };
    }
    return renderTimeMinutes(dateNow.getHours(), dateNow.getMinutes());
}

function convertToDateTime(dateTime) {
    return dateTime.day + '/' + dateTime.month + '/' + dateTime.year
            + " " + dateTime.hour + ':' + dateTime.minutes + ':00';
}

function convertToDateObject(dateTimeString, dateFormat) {

    var dateParts = dateTimeString.replace(/[:. ]/g, '-').split('-');

    if (dateFormat === dateFormats.CShartDateTime) {

        return {
            year: parseInt(dateParts[2]),
            month: parseInt(dateParts[1]),
            day: parseInt(dateParts[0]),
            hour: parseInt(dateParts[3]),
            minutes: parseInt(dateParts[4])
        };
    }

    return {
        year: parseInt(dateParts[datePartsEnum.year]),
        month: parseInt(dateParts[datePartsEnum.month]),
        day: parseInt(dateParts[datePartsEnum.day]),
        hour: parseInt(dateParts[datePartsEnum.hour]),
        minutes: parseInt(dateParts[datePartsEnum.minutes])
    };
}

function addValueToDate(targetDate, dateObject, add) {

    if (add == true) {

        targetDate.year += dateObject.year || 0;
        targetDate.month += dateObject.month || 0;
        targetDate.day += dateObject.day || 0;
        targetDate.hour += dateObject.hour || 0;
        targetDate.minutes += dateObject.minutes || 0;

        while (targetDate.month > 12) {
            targetDate.month -= 12;
            targetDate.year++;
        }

        var maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);

        while (targetDate.minutes >= 60) {
            targetDate.minutes -= 60;
            targetDate.hour++;
        }

        while (targetDate.hour >= 24) {
            targetDate.hour -= 24;
            targetDate.day++;
        }


        while (targetDate.day > maxDayCount) {
            targetDate.day -= maxDayCount;
            targetDate.month++;
            while (targetDate.month > 12) {
                targetDate.month -= 12;
                targetDate.year++;

            }
            maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);
        }

    } else {

        var maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);

        targetDate.year -= dateObject.year || 0;
        targetDate.month -= dateObject.month || 0;
        targetDate.day -= dateObject.day || 0;
        targetDate.hour -= dateObject.hour || 0;
        targetDate.minutes -= dateObject.minutes || 0;

        while (targetDate.month <= 0) {
            targetDate.month += 12;
            targetDate.year--;
        }

        while (targetDate.minutes < 0) {
            targetDate.minutes += 60;
            targetDate.hour--;
        }

        while (targetDate.hour < 0) {
            targetDate.hour += 24;
            targetDate.day--;
        }

        while (targetDate.day < 0) {
            targetDate.day += maxDayCount;
            targetDate.month--;

            while (targetDate.month < 0) {
                targetDate.month += 12;
                targetDate.year--;
            }

            maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);
        }
    }
}

function setDateNow() {
    var date = new Date();

    dateNow = {
        year: date.getFullYear(),
        month: (date.getMonth() + 1),
        day: date.getDate(),
        hour: date.getHours(),
        minutes: date.getMinutes()
    };

}