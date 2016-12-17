var planLoadingDiv = $('#plan-loading');
var mapLoadingDiv = $('#map-loading');
var roomEventLoadingDiv = $('#roomevent-loading');
var planSection = $('#plan-section');

var compareToDate = {};
var eventNewDateTimeBegin = {};

var defaultAjaxDataType = 'json';

var dateCorrect = true;
var checkFunctionInterval;
var minumumAllowedMinutes = 20;

var classRooms;
var eventWasAdded;

var ajaxUrl = {};

var roomeventEventsByUser = false;
var currentUserId;

function setCurrentUserId(id) {
    currentUserId = id;
}

function setEngineUrl(url) {

    ajaxUrl = {
        HomeUrl: url.HomeUrl,
        HomeMapLinkUrl: url.HomeMapLinkUrl,
        FeedbackSendUrl: url.FeedbackSendUrl,
        ParticipantRemoveUrl: url.ParticipantRemoveUrl,
        RoomIdNameUrl: url.RoomIdNameUrl,
        RoomPageUrl: url.RoomPageUrl,
        RoomEventSectionUrl: url.RoomEventSectionUrl,
        RoomEditUrl: url.RoomEditUrl,
        RoomChangeStatusUrl: url.RoomChangeStatusUrl,
        PlanSectionUrl: url.PlanSectionUrl,
        PlanAdditionalUrl: url.PlanAdditionalUrl,
        MapSectionUrl: url.MapSectionUrl,
        EventUsersUrl: url.EventUsersUrl,
        EventCreateUrl: url.EventCreateUrl,
        EventCancelUrl: url.EventCancelUrl,
        EventUpdateUrl: url.EventUpdateUrl,
        EventsBriefUrl: url.EventsBriefUrl,
        EventUrl: url.EventUrl,
        EventInfoVerbose: url.EventInfoVerbose,
        ParticipantAddUrl: url.ParticipantAddUrl,
        DialogWindowUrl: url.DialogWindowUrl
    };

  
}

function getClassRooms() {
    return loadSection(ajaxUrl.RoomIdNameUrl);
}

function getEventsBrief() {
    return loadSection(ajaxUrl.EventsBriefUrl);
}

function getEventsBriefByUser() {
    return loadSection(ajaxUrl.EventUsersUrl);
}

function getEventInfoVerbose(eventId) {
    return loadSection(ajaxUrl.EventInfoVerbose + '/' + eventId);
}

function renderSection(url, domElement, domLoadingElement, finallyFunction) {
    loadSection(url, function() {

        domLoadingElement.show();

    }, function (successResponse) {

        domElement.html(successResponse);
        domLoadingElement.hide();

        if (typeof (finallyFunction) === "function") {
            finallyFunction();
        }

    }, function(errorResponse) {

        domElement.html(errorResponse.message);
        domLoadingElement.hide();
    });
}

function submitNewEvent() {

    $('#room-busy').attr('class', 'status-message display-none');
    debugger;
    if ($('#Title').val().length >= 1) {

        $('.error-message').hide();

        if (dateCorrect) {
            
            $('#BeginingDate').val(convertToDateTime(eventNewDateTimeBegin));
            $('#EndingDate').val(convertToDateTime(compareToDate));

            $.ajax({
                url: ajaxUrl.EventCreateUrl,
                method: 'POST',
                data: $('#new-event-form').serialize(),
                dataType: 'json',

                onBegin: function () {
                    alert(1);
                },

                error: function (response) {
                    console.log(response);
                    $('#room-busy').attr('class', 'status-message display-none');
                    $('.icon-place').html('<i id="status-icon-bad" class="fa fa-frown-o"></i>');
                    $('#error-mesage').html("Случилась ошибка при выполнении запроса");
                },

                success: function (response) {
                    $('#room-busy').attr('class', 'status-message display-inline-block');

                    if (response.success) {
                        $('.icon-place').html('<i id="status-icon-bad" class="fa fa-calendar-check-o"></i>');
                    } else {
                        $('.icon-place').html('<i id="status-icon-bad" class="fa fa-frown-o"></i>');
                    }

                    $('#error-mesage').html(response.message);
                    eventWasAdded = true;

                    document.getElementById("new-event-form").reset();

                }

            });

            //postData('/Event/Create', eventNew).done(function() {
            //    alert('done submit!');
            //});

        }

    } else {
        $('#event-title-error').show();
        return;
    }
}

function bindValuesToObject() {
    return {
        Title: $('#event-title-error').val(),
        UserId: $('#user-id').val(),
        ClassRoomId: $('#event-room-select').val(),
        Organizer: $('#event-organizer').val(),
        BeginingDate: convertToDateTime(eventNewDateTimeBegin),
        EndingDate: convertToDateTime(compareToDate),
        Description: $('#event-description').val(),
        IsPublic: $('#checkboxOneInput').is(':checked'),
        IsAuthorShown: $('#event-show-author').is(':checked'),
        IsParticipantsAllowed: $('#event-register-all').is(':checked')
    }
}


function checkDateTime() {

    var dateActualComparisonResult = compareDates(eventNewDateTimeBegin, dateNow, false, true);
    var timeComparisonResult = compareTime({ hour: eventNewDateTimeBegin.hour, minutes: (eventNewDateTimeBegin.minutes + minumumAllowedMinutes) }, compareToDate);

    if ((timeComparisonResult) > 0 || (dateActualComparisonResult < 0)) {
        $("#event-date-error").show();
        dateCorrect = false;
    } else {
        $("#event-date-error").hide();
        dateCorrect = true;
    }

}

function renderNewEventDateTime(dateTime) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    $('#date-day-value').html(dateTime.day);
    $('#date-month-value').html(monthNamesAccusative[dateTime.month - 1]);
    $('#timebegin-hours-value').html(renderedTime.hour);
    $('#timebegin-minutes-value').html(renderedTime.minutes);

    checkDateTime();
}

function renderNewEventDateTimeEnd(dateTime) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    $('#timeend-hours-value').html(renderedTime.hour);
    $('#timeend-minutes-value').html(renderedTime.minutes);

}

function addDayToEvent() {
    addValueToDate(eventNewDateTimeBegin, { day: 1 }, true);
    renderNewEventDateTime(eventNewDateTimeBegin);
}

function subDayToEvent() {
    addValueToDate(eventNewDateTimeBegin, { day: 1 }, false);
    renderNewEventDateTime(eventNewDateTimeBegin);
}

function addMonthToEvent() {

    addValueToDate(eventNewDateTimeBegin, { month: 1 }, true);
    renderNewEventDateTime(eventNewDateTimeBegin);
}

function subMonthToEvent() {
    addValueToDate(eventNewDateTimeBegin, { month: 1 }, false);
    renderNewEventDateTime(eventNewDateTimeBegin);
}

function addHourToEventBegin() {

    addValueToDate(eventNewDateTimeBegin, { hour: 1 }, true);
    renderNewEventDateTime(eventNewDateTimeBegin);
    checkDateTime();

}

function subHourToEventBegin() {
    addValueToDate(eventNewDateTimeBegin, { hour: 1 }, false);
    renderNewEventDateTime(eventNewDateTimeBegin);
    checkDateTime();
}

function addMinutesToEventBegin() {

    addValueToDate(eventNewDateTimeBegin, { minutes: 1 }, true);
    renderNewEventDateTime(eventNewDateTimeBegin);
    checkDateTime();
}

function subMinutesToEventBegin() {

    addValueToDate(eventNewDateTimeBegin, { minutes: 1 }, false);
    renderNewEventDateTime(eventNewDateTimeBegin);
    checkDateTime();
}

function addHourToEventEnd() {
    addValueToDate(compareToDate, { hour: 1 }, true);
    renderNewEventDateTimeEnd(compareToDate);
    checkDateTime();

}

function subHourToEventEnd() {
    addValueToDate(compareToDate, { hour: 1 }, false);
    renderNewEventDateTimeEnd(compareToDate);
    checkDateTime();
}

function addMinutesToEventEnd() {
    addValueToDate(compareToDate, { minutes: 1 }, true);
    renderNewEventDateTimeEnd(compareToDate);
    checkDateTime();
}

function subMinutesToEventEnd() {
    addValueToDate(compareToDate, { minutes: 1 }, false);
    renderNewEventDateTimeEnd(compareToDate);
    checkDateTime();
}


function checkCurrentTimeInterval(cancel) {

    if (cancel) {
        clearInterval(checkFunctionInterval);
    } else {
        checkFunctionInterval = setInterval(checkDateTime, 60 * 1000);
    }

}


function dateTimeArrowControl() {
    eventWasAdded = false;
    loadSection(ajaxUrl.EventCreateUrl).done(function (result) {
        $('#event-modal-position').html(result);
        $('#lock').show();

        eventNewDateTimeBegin = {
            year: dateNow.year,
            month: dateNow.month,
            day: dateNow.day,
            hour: dateNow.hour,
            minutes: (dateNow.minutes + 1)
        };

        compareToDate = {
            year: dateNow.year,
            month: dateNow.month,
            day: dateNow.day,
            hour: (dateNow.hour + 1),
            minutes: dateNow.minutes
        }

        $('#submit-section').off();

        $('#submit-section').on('click', '#event-new-submit', submitNewEvent);

        renderNewEventDateTime(eventNewDateTimeBegin);
        renderNewEventDateTimeEnd(compareToDate);

        $('.event-when').off();

        $('.event-when').on('click', '#date-day-up', addDayToEvent);
        $('.event-when').on('click', '#date-day-down', subDayToEvent);

        $('.event-when').on('click', '#date-month-up', addMonthToEvent);
        $('.event-when').on('click', '#date-month-down', subMonthToEvent);

        $('.event-when').on('click', '#timebegin-hours-up', addHourToEventBegin);
        $('.event-when').on('click', '#timebegin-hours-down', subHourToEventBegin);

        $('.event-when').on('click', '#timebegin-minutes-up', addMinutesToEventBegin);
        $('.event-when').on('click', '#timebegin-minutes-down', subMinutesToEventBegin);

        $('.event-when').on('click', '#timeend-hours-up', addHourToEventEnd);
        $('.event-when').on('click', '#timeend-hours-down', subHourToEventEnd);

        $('.event-when').on('click', '#timeend-minutes-up', addMinutesToEventEnd);
        $('.event-when').on('click', '#timeend-minutes-down', subMinutesToEventEnd);


        checkCurrentTimeInterval();
        fillClassRoomSelectList();
    });
}

$(document).on('click', '#add-event', dateTimeArrowControl);


$(document).on('click', '#event-new-close', function () {
    checkCurrentTimeInterval(true);
    if (eventWasAdded) {
        renderRooms(currentMode);
    }
    $('#event-modal-position').empty();
    $('#lock').hide();
});



$(document).on('click', '.fa-link', function () {
    window.location = ajaxUrl.EventUrl + "/Index/" + $(this).attr('id').split('-')[1];
});

function addParticipantSubmitCallback(result) {

    $('#add-participant-email').val('').attr({
        placeholder: result.message,
        disabled: true
    });

    $('#add-participant-submit').attr('disabled', true);

    if (result.success) {
        $('#participant-count').html(parseInt($('#participant-count').html()) + 1);
    }
}

$(document).on('click', '#add-participant-submit', function () {
    if ($('#add-participant-email').val().length >= 1) {
        postFormData(ajaxUrl.ParticipantAddUrl, $('#add-participant-form'), 'json', addParticipantSubmitCallback, function (message) {
            console.log(message);
        });
    }

});



function fillClassRoomSelectList() {

    getClassRooms().done(function (rooms) {
        classRooms = JSON.parse(rooms);
        var optionList = '';
        for (var i = 0; i < classRooms.length; i++) {
            optionList += '<option value="' + classRooms[i].Id + '">' + classRooms[i].Name + '</option>';
        }

        $('#ClassRoomId').html(optionList);
    });
}
