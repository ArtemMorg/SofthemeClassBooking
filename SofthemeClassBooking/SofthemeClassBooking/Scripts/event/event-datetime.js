var checkFunctionInterval;

function changeDateTime(dateTimeTargetBegin, dateTimeBegin) {

    dateTimeTargetBegin.year = dateTimeBegin.year;
    dateTimeTargetBegin.month = dateTimeBegin.month;
    dateTimeTargetBegin.day = dateTimeBegin.day;
    dateTimeTargetBegin.hour = dateTimeBegin.hour;
    dateTimeTargetBegin.minutes = dateTimeBegin.minutes;
}

function setDateTimeObject(
    dateTimeTargetBegin,
    dateTimeTargetEnd,
    dateTimeBegin,
    dateTimeEnd,
    sectionDom,
    controlDateTimeDom,
    renderValuesDom,
    successDateCheckHandler,
    errorDateCheckHandler,
    renderType) {

    dateTimeTargetBegin.year = dateTimeBegin.year;
    dateTimeTargetBegin.month = dateTimeBegin.month;
    dateTimeTargetBegin.day = dateTimeBegin.day;
    dateTimeTargetBegin.hour = dateTimeBegin.hour;
    dateTimeTargetBegin.minutes = dateTimeBegin.minutes;

    dateTimeTargetEnd.year = dateTimeEnd.year;
    dateTimeTargetEnd.month = dateTimeEnd.month;
    dateTimeTargetEnd.day = dateTimeEnd.day;
    dateTimeTargetEnd.hour = dateTimeEnd.hour;
    dateTimeTargetEnd.minutes = dateTimeEnd.minutes;

    var renderNewEventDateTime;

    sectionDom.off();

    switch (renderType) {
        case renderDateTimeType.withMonthNames:
            renderNewEventDateTime = renderNewEventDateTimeMonthNames;
            break;

        case renderDateTimeType.numertic:
            renderNewEventDateTime = renderNewEventDateTimeNumeric;
            break;
    }

    if (controlDateTimeDom.dateYearUp != null) {

        sectionDom.on('click', `#${controlDateTimeDom.dateYearUp.attr('id')}`, function () {

            addValueToDate(dateTimeTargetBegin, { year: 1 }, true);
            checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);
            renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        });

        sectionDom.on('click', `#${controlDateTimeDom.dateYearDown.attr('id')}`, function () {

            addValueToDate(dateTimeTargetBegin, { year: 1 }, false);
            renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
            checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

        });

    }

    sectionDom.on('click', `#${controlDateTimeDom.dateDayUp.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { day: 1 }, true);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.dateDayDown.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { day: 1 }, false);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.dateMonthUp.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { month: 1 }, true);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.dateMonthDown.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { month: 1 }, false);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timebeginHoursUp.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { hour: 1 }, true);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timebeginHoursDown.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { hour: 1 }, false);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timebeginMinutesUp.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { minutes: 1 }, true);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timebeginMinutesDown.attr('id')}`, function () {

        addValueToDate(dateTimeTargetBegin, { minutes: 1 }, false);
        renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timeendHoursUp.attr('id')}`, function () {

        addValueToDate(dateTimeTargetEnd, { hour: 1 }, true);
        renderNewEventDateTimeEnd(dateTimeTargetEnd, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });


    sectionDom.on('click', `#${controlDateTimeDom.timeendHoursDown.attr('id')}`, function () {

        addValueToDate(dateTimeTargetEnd, { hour: 1 }, false);
        renderNewEventDateTimeEnd(dateTimeTargetEnd, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timeendMinutesUp.attr('id')}`, function () {

        addValueToDate(dateTimeTargetEnd, { minutes: 1 }, true);
        renderNewEventDateTimeEnd(dateTimeTargetEnd, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    sectionDom.on('click', `#${controlDateTimeDom.timeendMinutesDown.attr('id')}`, function () {

        addValueToDate(dateTimeTargetEnd, { minutes: 1 }, false);
        renderNewEventDateTimeEnd(dateTimeTargetEnd, renderValuesDom);
        checkDateTime(dateTimeTargetBegin, dateTimeTargetEnd, successDateCheckHandler, errorDateCheckHandler);

    });

    renderNewEventDateTime(dateTimeTargetBegin, renderValuesDom);
    renderNewEventDateTimeEnd(dateTimeTargetEnd, renderValuesDom);
}

function checkDateTime(datetime, datetimeTo, succesHandler, errorHandler) {

    var dateActualComparisonResult = compareDates(datetime, datetimeTo, false);
    var timeComparisonResult = compareTime({ hour: datetime.hour, minutes: (parseInt(datetime.minutes) + minumumAllowedMinutes) }, datetimeTo);

    if ((compareTime(datetime, dateNow) < 0) ||
        (timeComparisonResult > 0) ||
        (dateActualComparisonResult < 0)) {

        if (typeof (errorHandler) === "function") {
            errorHandler();
        }

    } else {

        if (typeof (succesHandler) === "function") {
            succesHandler();
        }

    }

}

function renderNewEventDateTimeMonthNames(dateTime, domValuesObject) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    domValuesObject.dayValue.html(dateTime.day);
    domValuesObject.monthValue.html(monthNamesAccusative[dateTime.month - 1]);
    domValuesObject.timeBeginHourValue.html(renderedTime.hour);
    domValuesObject.timeBeginMinutesValue.html(renderedTime.minutes);

}

function renderNewEventDateTimeNumeric(dateTime, domValuesObject) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    domValuesObject.dayValue.html(dateTime.day);
    domValuesObject.yearValue.html(dateTime.year);
    domValuesObject.monthValue.html(renderDate(dateTime.month));
    domValuesObject.timeBeginHourValue.html(renderedTime.hour);
    domValuesObject.timeBeginMinutesValue.html(renderedTime.minutes);

}

function renderNewEventDateTimeEnd(dateTime, domValuesObject) {

    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    domValuesObject.timeEndHourValue.html(renderedTime.hour);
    domValuesObject.timeEndMinutesValue.html(renderedTime.minutes);
}
