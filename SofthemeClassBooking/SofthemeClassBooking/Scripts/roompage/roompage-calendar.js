var roompageDate;
var roompageTodayCell;
var roompageTodayLocalized;

var roompageTodayCellId;
var roompageIfWeekendFirst;
var roompageNowOffset = 0;

var roompageSliderId;
var horizontalSlider = '<div id="roompage-slider-static">' +
                       '<div class="hor-slider-left"></div><!----><div class="hor-slider-body"></div><!----><div class="hor-slider-right"></div>' +
                       '</div>';

var roompageEvents = {};

var dateNow = {
    year: date.getFullYear(),
    month: (date.getMonth() + 1),
    day: date.getDate(),
    hour: date.getHours(),
    minutes: date.getMinutes()
};

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

var dateNowStartClock = setInterval(setDateNow, oneMinute);


function roompageCalendarInit(localizeToday) {

    roompageTodayLocalized = localizeToday;
    roompageDate = copyDate(currentCalendarCell);
    renderRoomPageCalendar();

    roompageTodayCell = $('#roompage-calendar-today');

    roompageSliderId = "roompage-slider-static";
    activateRoomPageSlider();
}

function renderRoomPageCalendar(dateStart) {

    var roompageCalendarHeader = $('#roompage-calendar-header');
    var tdIsWeekend;

    var renderDatetime = typeof (dateStart) === "undefined"
        ? copyDate(currentCalendarCell)
        : copyDate(dateStart);

    roompageCalendarHeader.empty();

    $('#roompage-date').html(monthNames[renderDatetime.month - 1] + ', ' + renderDatetime.year);
    var dayOfWeek = getDayOfWeek(new Date(renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day).getDay());
    roompageIfWeekendFirst = dayOfWeek === weekendSaturday || dayOfWeek === weekendSunday;

    for (var currentDay = 0; currentDay < roompageMaxDayCalendarCount; currentDay++) {

        if (dayOfWeek === weekendSaturday || dayOfWeek === weekendSunday) {
            tdIsWeekend = currentDay;
            roompageCalendarHeader.append(
                `<td class="td-weekend"> <div class="dayName"> ${dayNames[dayOfWeek]} </div></td> `);

        } else {
            var tdClass = compareDates(renderDatetime, dateNow, false) === 0 ? tdClass = "td-today-up" : tdClass = "";
            roompageCalendarHeader.append(
                `<td class="${tdClass}"> <div class="dayName"> ${dayNames[dayOfWeek]} </div> <div class="dayValue"> ${renderDate(renderDatetime.day)}.${renderDate(renderDatetime.month)} </div></td> `);
        }

        addValueToDate(renderDatetime, { day: 1 }, true);
        dayOfWeek = getDayOfWeek(new Date(renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day).getDay());

    }

    $('#table-roompageCalendar').find('tr').slice(1).remove();

    for (var currentTime = defaultMinimumBookHour; currentTime <= defaultMaximumBookHour; currentTime++) {

        renderDatetime = typeof (dateStart) === "undefined"
        ? copyDate(currentCalendarCell)
        : copyDate(dateStart);

        var rowId = 'row-' + renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day + '-' + currentTime;
        $('#table-roompageCalendar > tbody:last').append(`<tr id="${rowId}" class="roompage-calendar-body"></tr>`);

        for (var currentTd = 0; currentTd < roompageMaxDayCalendarCount; currentTd++) {

            dayOfWeek = getDayOfWeek(new Date(renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day).getDay());
            var cellId = renderDatetime.year + '-' + renderDatetime.month + '-' + renderDatetime.day + '-' + currentTime;
            if (dayOfWeek === weekendSaturday || dayOfWeek === weekendSunday) {

                $(`#${rowId}`).append('<td class="td-weekend">&nbsp</td>');

            } else {
                var tdClass = "";

                if (currentTime === defaultMaximumBookHour) {
                    tdClass = compareDates(renderDatetime, dateNow, false) === 0 ? tdClass = "td-today-down" : tdClass = "";
                } else {
                    tdClass = compareDates(renderDatetime, dateNow, false) === 0 ? tdClass = "td-today" : tdClass = "";
                }

                if (currentTd % 2 === 0 && currentTime % 2 !== 0) {
                    $(`#${rowId}`).append(`<td id="${cellId}" class="${tdClass}"><div class="time">${renderTimeMinutes(currentTime, 0)}</div></td>`);
                } else if (currentTd % 2 !== 0 && currentTime % 2 === 0) {
                    $(`#${rowId}`).append(`<td id="${cellId}" class="${tdClass}"><div class="time">${renderTimeMinutes(currentTime, 0)}</div></td>`);
                }
                else {
                    $(`#${rowId}`).append(`<td id="${cellId}" class="${tdClass}">&nbsp</td>`);
                }

            }

            addValueToDate(renderDatetime, { day: 1 }, true);
        }
    }

    roomPageSliderInit();
    getEventsByClassRoomId();
}

$(document).off('click', '#roompage-calendar-today');
$(document).on('click', '#roompage-calendar-today', function () {

    roompageDate = copyDate(currentCalendarCell);
    renderRoomPageCalendar();
    roompageTodayCell.html(`${roompageTodayLocalized}`);

    roompageNowOffset = 0;
    roompageTodayCell.css('left', roompageNowOffset);

});

$(document).off('click', '#roompage-before-day');
$(document).on('click', '#roompage-before-day', function() {

    addValueToDate(roompageDate, { day: 1 }, false);
    renderRoomPageCalendar(roompageDate);

    roompageNowOffset += roompageIfWeekendFirst ? roompageWeekendWidthPx : timeCellWidth;
    checkIfToday();
});

$(document).off('click', '#roompage-next-day');
$(document).on('click', '#roompage-next-day', function () {

    addValueToDate(roompageDate, { day: 1 }, true);
    roompageNowOffset -= roompageIfWeekendFirst ? roompageWeekendWidthPx : timeCellWidth;

    checkIfToday();
    renderRoomPageCalendar(roompageDate);

});

function checkIfToday() {

    var dateRight = copyDate(roompageDate);
    addValueToDate(dateRight, { day: roompageMaxDayCalendarCount }, true);

    if (compareDates(roompageDate, dateNow, false) > 0) {

        roompageTodayCell.html(`<i class="fa fa fa-long-arrow-left"></i> ${roompageTodayLocalized}`);

    } else if (compareDates(dateRight, dateNow, false) <= 0) {

        roompageTodayCell.html(`${roompageTodayLocalized}<i class="fa fa fa-long-arrow-right"></i>`);
    } else {

        roompageTodayCell.html(`${roompageTodayLocalized}`);
        roompageTodayCell.css('left', roompageNowOffset);
    }

}


function roomPageSliderInit() {
    var cellTdTodayId = dateNow.year + '-' + dateNow.month + '-' + dateNow.day + '-' + defaultMinimumBookHour;
    $(`#${cellTdTodayId}`).append(horizontalSlider);
    renderRoomPageSlider()
}

function renderRoomPageSlider() {
    
    if (dateNow.hour < defaultMinimumBookHour || dateNow.hour > defaultMaximumBookHour) {
        $(`#${roompageSliderId}`).hide();
        return;
    }

    $(`#${roompageSliderId}`).show();

    var sliderOffset = ((dateNow.hour - defaultMinimumBookHour) * 60 + dateNow.minutes)
                        * minutesPerPixelVertical + roompageCalendarCellBorderWidth;

    $(`#${roompageSliderId}`).css('top', sliderOffset);

}

function activateRoomPageSlider() {
    var sliderTime = setInterval(renderRoomPageSlider, sliderTimeInterval);
    renderRoomPageSlider();
}

function getEventsByClassRoomId() {
    
    var dateRight = copyDate(roompageDate);
    addValueToDate(dateRight, { day: roompageMaxDayCalendarCount }, true);

    var data = {
        id: currentClassRoom.id,
        dateEventsFrom: convertToDateTime({
            year: roompageDate.year,
            month: roompageDate.month,
            day: roompageDate.day,
            hour: 0,
            minutes: 0
    }),
        dateEventsTo: convertToDateTime(dateRight)
    }

    postData(ajaxUrl.EventByClassRoomUrl,data, function(events) {
            renderRoomPageEvents(JSON.parse(events));
        },
    function (errorResponse) {
        eventPageDialogWindowError.BodyMessage = '.' + errorResponse.message;
        eventPageDialogWindowError.show();
    });

}

function renderRoomPageEvents(events) {

    for (var currentEvent = 0; currentEvent < events.length; currentEvent++) {
        var dateBegin = convertToDateObject(events[currentEvent].BeginingDate);
        var dateEnd = convertToDateObject(events[currentEvent].EndingDate);

        var startCellId = dateBegin.year + '-' + dateBegin.month + '-' + dateBegin.day + '-' + defaultMinimumBookHour;

        var topOffset = ((dateBegin.hour - defaultMinimumBookHour) * 60 + dateBegin.minutes) * minutesPerPixelVertical;

        var duration = (getDurationInMinutes(dateEnd.hour, dateEnd.minutes) -
            getDurationInMinutes(dateBegin.hour, dateBegin.minutes)) * minutesPerPixelVertical;
       
        var eventBlock = {
            id: 'eventblock-' + events[currentEvent].Id,
            top: topOffset,
            width: timeCellWidth,
            height: duration,
            classRoomId: events[currentEvent].ClassRoomId,
            timeStart: renderTimeMinutes(dateBegin.hour, dateBegin.minutes),
            timeEnd: renderTimeMinutes(dateEnd.hour, dateEnd.minutes),
            title: events[currentEvent].Title,
            description: events[currentEvent].Description,
            blockType: duration < shortBlockMinimumTime ? eventBlockType.short : eventBlockType.long,
            isPrivate: events[currentEvent].IsPrivate
        };


        renderRoomPageEventBlock(eventBlock, $('#' + startCellId));
    }
}


function renderRoomPageEventBlock(eventBlock, roomEventCellId) {

    var eventBlockRenderIcon = "";
    var descriptionPart = "";
    var eventBlockRender;

    if (eventBlock.isPrivate) {

        eventBlockRenderIcon = '<i class="fa fa-lock fa-3x"></i>';
        if (eventBlock.blockType === eventBlockType.short) {
            eventBlockRender = '<div id="' + eventBlock.id + `" class="eventblock-lock short-time-roompage eventblock-block" data-classroom-id="${eventBlock.classRoomId}" data-private="true" data-eventblock-type="${eventBlockType.short}">`;
        } else {
            eventBlockRender = '<div id="' + eventBlock.id + `" class="eventblock-lock long-time eventblock-block roompage-event-lock" data-classroom-id="${eventBlock.classRoomId}" data-private="true" data-eventblock-type="${eventBlockType.long}">`;
        }

    } else {
        if (eventBlock.blockType === eventBlockType.short) {
            eventBlockRender = '<div id="' + eventBlock.id + `" class="eventblock-exist short-time-roompage eventblock-block" data-classroom-id="${eventBlock.classRoomId}" data-private="false" data-eventblock-type="${eventBlockType.short}">`;
        } else {
            eventBlockRender = '<div id="' + eventBlock.id + `" class="eventblock-exist long-time eventblock-block" data-classroom-id="${eventBlock.classRoomId}"  data-private="false" data-eventblock-type="${eventBlockType.long}">`;
            descriptionPart = '<div class="eventblock-description">';

            if (eventBlock.description == null || eventBlock.description.length <= 0) {
                descriptionPart += '<div class="text">&nbsp</div>' + '<div class="text">' + eventBlock.title + '</div></div>';
            } else {
                descriptionPart += '<div class="text">' + eventBlock.title + '</div>' + '<div class="text">' + eventBlock.description + '</div></div>';
            }

        }

    }

    eventBlockRender += '<div class="eventblock-time">' +
                  '<div class="text">' + eventBlock.timeStart + '</div>' +
                  '<div class="text"> - </div>' +
                  '<div class="text">' + eventBlock.timeEnd + '</div></div>' + descriptionPart +
                  eventBlockRenderIcon + '</div>';

    roomEventCellId.append(eventBlockRender);
    $('#' + eventBlock.id).css({
        'height': eventBlock.height,
        'width': eventBlock.width,
        'top': eventBlock.top,
        'border': 'none'
    });

}