var eventModalCreateNewDateTimeTargetBegin = {
    year: dateNow.year,
    month: dateNow.month,
    day: dateNow.day,
    hour: dateNow.hour,
    minutes: dateNow.minutes
};

var eventModalCreateNewDateTimeTargetEnd = {
    year: dateNow.year,
    month: dateNow.month,
    day: dateNow.day,
    hour: dateNow.hour,
    minutes: dateNow.minutes
};

var eventmodalCreateNewCorrectDateTime = true;

var checkFunctionInterval;

function checkCurrentTimeInterval(cancel) {

    if (cancel) {
        clearInterval(checkFunctionInterval);
    } else {
  
        checkFunctionInterval = setInterval(function () {

            eventmodalCreateNewCorrectDateTime =
                checkDateTime(
                eventModalCreateNewDateTimeTargetBegin,
                eventModalCreateNewDateTimeTargetEnd,
                function () {
                    eventmodalCreateNewCorrectDateTime = true;
                    $('#event-date-error').hide();
                },
                function () {
                    eventmodalCreateNewCorrectDateTime = false;
                    $('#event-date-error').show();
                }
                );

        }, defaultOneMinute);
    }

}

function eventmodalCreateNewInit() {

    var eventmodalPosition = $('#event-modal-position');
    var eventmodalCreateNew = $('.event-new');

    var eventmodalCreateNewClose = $('#event-new-close');
    var eventmodalCreateNewSubmit = $('#event-new-submit');

    var eventmodalCreateNewTitleError = $('#event-title-error');
    var eventmodalCreateNewDateError = $('#event-date-error');

    var eventmodalCreteNewForm = $('#new-event-form');
    var eventmodalCreateNewFormTitle = $('#event-new-title');

    var dateNowPastOnHour = copyDate(dateNow);
    addValueToDate(dateNowPastOnHour, { hour: defaultNewEventEndHourOffset }, true);

    var dateNowStartCreate = copyDate(dateNow);
    addValueToDate(dateNowStartCreate, { minutes: defaultNewEventStartMinutesOffset }, true);

    fillClassRoomSelectList($('#event-new-classroom-list'));
    console.log(`#${eventmodalCreateNewClose.attr('id')}`);

    eventmodalPosition.off('click', `#${eventmodalCreateNewSubmit.attr('id')}`);
    eventmodalPosition.off('click', `#${eventmodalCreateNewClose.attr('id')}`);
    eventmodalPosition.off();

    eventmodalPosition.on('click', `#${eventmodalCreateNewClose.attr('id')}`, function () {
        checkCurrentTimeInterval(true);

        if (typeof(renderRooms) === "function") {
            renderRooms(currentMode);
        }

        $('#event-modal-position').empty();
        $('#lock').hide();

    });

    setDateTimeObject(
       eventModalCreateNewDateTimeTargetBegin,
       eventModalCreateNewDateTimeTargetEnd,
       dateNowStartCreate,
       dateNowPastOnHour,
       eventmodalCreateNew,
       {
           dateDayUp: $('#date-day-up-create'),
           dateDayDown: $('#date-day-down-create'),
           dateMonthUp: $('#date-month-up-create'),
           dateMonthDown: $('#date-month-down-create'),
           timebeginHoursUp: $('#timebegin-hours-up-create'),
           timebeginHoursDown: $('#timebegin-hours-down-create'),
           timebeginMinutesUp: $('#timebegin-minutes-up-create'),
           timebeginMinutesDown: $('#timebegin-minutes-down-create'),
           timeendHoursUp: $('#timeend-hours-up-create'),
           timeendHoursDown: $('#timeend-hours-down-create'),
           timeendMinutesUp: $('#timeend-minutes-up-create'),
           timeendMinutesDown: $('#timeend-minutes-down-create')
       },
       {
           dayValue: $('#date-day-value-create'),
           monthValue: $('#date-month-value-create'),
           timeBeginHourValue: $('#timebegin-hours-value-create'),
           timeBeginMinutesValue: $('#timebegin-minutes-value-create'),
           timeEndHourValue: $('#timeend-hours-value-create'),
           timeEndMinutesValue: $('#timeend-minutes-value-create')
       },
       function () {
           eventmodalCreateNewCorrectDateTime = true;
           eventmodalCreateNewDateError.hide();
       },
       function () {
           eventmodalCreateNewCorrectDateTime = false;
           eventmodalCreateNewDateError.show();

       },
       renderDateTimeType.withMonthNames
   );

    eventmodalPosition.on('keyup', `#${eventmodalCreateNewFormTitle.attr('id')}`, function () {

        if (eventmodalCreateNewFormTitle.val().length < 1) {
            eventmodalCreateNewSubmit.attr('class', 'save');
            eventmodalCreateNewTitleError.show();
        } else {
            eventmodalCreateNewSubmit.attr('class', 'save-ready');
            eventmodalCreateNewTitleError.hide();
        }

    });

    eventmodalPosition.on('click', '#IsAuthorShown-new', function() {
        if ($("#IsAuthorShown-new").is(':checked')) {
            $('#event-new-organizer').attr('disabled', true);
        } else {
            $('#event-new-organizer').attr('disabled', false);
        }
    });

    eventmodalPosition.on('click', `#${eventmodalCreateNewSubmit.attr('id')}`, function () {

        var eventmodalCreateNewErrorMessages = $('.error-mesage');
        var eventmodalCreateNewErrorMessage = $('#error-mesage');
        var eventmodalCreateNewStatusSection = $('#event-new-status-section');

        var eventmodalCreateNewFormBeginingDate = $('#event-new-beginingDate');
        var eventmodalCreateNewFormEndingDate = $('#event-new-endingDate');
        var eventmodalCreateNewIconPlace = $('.icon-place');

        eventmodalCreateNewStatusSection.attr('class', 'status-message display-none');

        if (eventmodalCreateNewFormTitle.val().length >= 1) {


            checkDateTime(eventModalCreateNewDateTimeTargetBegin, eventModalCreateNewDateTimeTargetEnd);
            eventmodalCreateNewErrorMessages.hide();

            if (eventmodalCreateNewCorrectDateTime) {

                eventmodalCreateNewFormBeginingDate.val(convertToDateTime(eventModalCreateNewDateTimeTargetBegin));
                eventmodalCreateNewFormEndingDate.val(convertToDateTime(eventModalCreateNewDateTimeTargetEnd));

                postFormData(
                    ajaxUrl.EventCreateUrl,
                    eventmodalCreteNewForm,
                    defaultAjaxDataType,
                    function (successResponse) {
                
                        eventmodalCreateNewStatusSection.attr('class', 'status-message display-inline-block');

                        if (successResponse.success) {
                            eventmodalCreateNewIconPlace.html('<i id="status-icon-bad" class="fa fa-calendar-check-o"></i>');
                            document.getElementById(`${eventmodalCreteNewForm.attr('id')}`).reset();
                        } else {
                            eventmodalCreateNewIconPlace.html('<i id="status-icon-bad" class="fa fa-frown-o"></i>');
                        }

                        eventmodalCreateNewErrorMessage.html(successResponse.message);

                    }, function (errorResponse) {
                        eventPageDialogWindowError.BodyMessage += `#${errorResponse.message}`;
                        eventPageDialogWindowError.show();
                    });
            }

        } else {
            eventmodalCreateNewTitleError.show();
            return;
        }

        checkCurrentTimeInterval();
    });

}

