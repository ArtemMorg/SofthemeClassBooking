var eventPageDialogWindow;
var eventPageCurrentEvent = {};

var eventPageDateTimeBegin;
var eventPageDateTimeEnd;

var eventpageCorrectDateTime;

var eventPageDateTimeBegin = {
    year: dateNow.year,
    month: dateNow.month,
    day: dateNow.day,
    hour: dateNow.hour,
    minutes: dateNow.minutes
};

var eventPageDateTimeEnd = {
    year: dateNow.year,
    month: dateNow.month,
    day: dateNow.day,
    hour: dateNow.hour,
    minutes: dateNow.minutes
};

var eventPageStartDateTimeBegin;
var eventPageStartDateTimeEnd;

function setEventPageModel(id, userId, isAdmin, classRoomId) {
    eventPageCurrentEvent.id = id;
    eventPageCurrentEvent.userId = userId;
    eventPageCurrentEvent.isAdmin = isAdmin;
    eventPageCurrentEvent.classRoomId = classRoomId;
    eventPageCurrentEvent.beginingDate = "";
    eventPageCurrentEvent.endingDate = "";
}

var eventPageModes = {
    read: 0,
    edit: 1
}

var eventPageCurrentMode = eventPageModes.read;


function getSelectedClassRoom() {
    return eventPageCurrentEvent.classRoomId;
}

function checkRoomIsBusy(id) {

    var response;
    $('#Event_ClassRoomId').val(id);

    postData(
        ajaxUrl.IsRoomBusy,
        {
            ClassRoomId: id,
            BeginingDate: convertToDateTime(eventPageDateTimeBegin),
            EndingDate: convertToDateTime(eventPageDateTimeEnd),
            Id: eventPageCurrentEvent.id
        },
        function(successResponse) {

            if (successResponse.message !== false) {

                $('#eventedit-status').attr('class', 'error-section');
                $('.icon-place').html('<i id="status-icon-bad" class="fa fa-frown-o"></i>');
                $('#error-message').html(successResponse.message);

            } else {

                $('#eventedit-status').attr('class', 'error-section display-none');

            }

        },
        function (errorResponse) {
            console.log(errorResponse);
            eventPageDialogWindowError.dialogModel.BodyMessage = errorResponse;
            eventPageDialogWindowError.show();
        });

}


function setDateTime(eventDateTimeBegin, eventDateTimeEnd) {
    var eventpage = $('.eventpage');

    eventPageStartDateTimeBegin = copyDate(eventDateTimeBegin);
    eventPageStartDateTimeEnd = copyDate(eventDateTimeEnd);

    eventPageCurrentEvent.beginingDate = convertToDateTime(eventPageDateTimeBegin);
    eventPageCurrentEvent.endingDate = convertToDateTime(eventPageStartDateTimeEnd);

    setDateTimeObject(
       eventPageDateTimeBegin,
       eventPageDateTimeEnd,
       eventDateTimeBegin,
       eventDateTimeEnd,
       eventpage,
       {
           dateYearUp: $('#date-year-up'),
           dateYearDown: $('#date-year-up'),
           dateDayUp: $('#date-day-up'),
           dateDayDown: $('#date-day-down'),
           dateMonthUp: $('#date-month-up'),
           dateMonthDown: $('#date-month-down'),
           timebeginHoursUp: $('#timebegin-hours-up'),
           timebeginHoursDown: $('#timebegin-hours-down'),
           timebeginMinutesUp: $('#timebegin-minutes-up'),
           timebeginMinutesDown: $('#timebegin-minutes-down'),
           timeendHoursUp: $('#timeend-hours-up'),
           timeendHoursDown: $('#timeend-hours-down'),
           timeendMinutesUp: $('#timeend-minutes-up'),
           timeendMinutesDown: $('#timeend-minutes-down')
       },
       {
           yearValue: $('#date-year-value'),
           dayValue: $('#date-day-value'),
           monthValue: $('#date-month-value'),
           timeBeginHourValue: $('#timebegin-hours-value'),
           timeBeginMinutesValue: $('#timebegin-minutes-value'),
           timeEndHourValue: $('#timeend-hours-value'),
           timeEndMinutesValue: $('#timeend-minutes-value')
       },
       function () {
           errorIncorrectDateTime(true);
       },
       function () {
           $('#eventedit-status').attr('class', 'error-section');
           errorIncorrectDateTime(false);

       },
       renderDateTimeType.numertic
   );

}

function loadParticipants() {

    loadSection(
        ajaxUrl.ParticipantsUrl + "?eventId=" + eventPageCurrentEvent.id,
        null,
        function (successResponse) {
            $('.participant-section').html(successResponse);
        },
        function (errorResponse) {
            eventPageDialogWindowError.dialogModel.BodyMessage = errorResponse;
            eventPageDialogWindowError.show();
        });

}

function isUserTakePart(url, eventModelId) {

    postData(
        url,
        { eventId: eventModelId },
        function (successResponse) {
            if (successResponse.success) {
                if (successResponse.message) {
                    $('#event-new-email-take-part').attr('class', ' ');
                    $('#event-add-participant-form').attr('class', 'display-none');
                } else {
                    $('#event-add-participant-form').attr('class', 'div-wraper');
                    $('#event-new-email-take-part').attr('class', 'display-none');

                }
            }
        });
}

function errorIncorrectDateTime(dateValid) {
    eventpageCorrectDateTime = dateValid;
    if (!dateValid) {

        $('#eventedit-status').attr('class', 'error-section');
        $('.icon-place').html('<i id="status-icon-bad" class="fa fa-calendar-times-o"></i>');
        $('#error-message').html("Указана неверная дата и (или) время");
    } else {
        $('#eventedit-status').attr('class', 'error-section display-none');
    }

}

$(document).on('click', '#event-add-participant-submit', function () {

    var eventPageDateErrorMessage = $('#event-email-error-message');
    var eventPageDateEmail = $('#event-add-participant-email');

    if (!eventPageDateErrorMessage.hasClass('display-none')) {
        eventPageDateErrorMessage.addClass('display-none');
    }

    if (isValidEmailAddress(eventPageDateEmail.val())) {

        addParticipant(
            {
                EventId: eventPageCurrentEvent.id,
                Email: eventPageDateEmail.val()
            },
            {
                email: $('#event-add-participant-email'),
                submit: $('#event-add-participant-submit'),
                count: $('#event-participant-count'),
                callback: loadParticipants
            },
            false
        );
    } else {
        eventPageDateErrorMessage.removeClass('display-none');
    }

    loadParticipants();
});

function checkEventTitle() {
    if ($('#Event_Title').val().length < 1) {
        $('#event-title-error').show();
        return false;
    } else {
        $('#event-title-error').hide();
        return true;
    }
}

$(document).on('keyup', '#Event_Title', checkEventTitle);

$(document).on('click', '#save-cancel-event', function () {
    if (eventPageCurrentMode === eventPageModes.read) {
        eventPageDialogWindow.show();
    } else {
        //submit stuff
        $('#eventedit-status').attr('class', 'error-section display-none');

        if (checkEventTitle()) {

            if (eventpageCorrectDateTime) {

                $('#Event_BeginingDate').val(convertToDateTime(eventPageDateTimeBegin));
                $('#Event_EndingDate').val(convertToDateTime(eventPageDateTimeEnd));

                var eventModel = {
                    Title: $('#Event_Title').val(),
                    UserId: $('#Event_UserId').val(),
                    ClassRoomId: $('#Event_ClassRoomId').val(),
                    BeginingDate: $('#Event_BeginingDate').val(),
                    Description: $('#Event_Description').val(),
                    EndingDate: $('#Event_EndingDate').val(),
                    Id: eventPageCurrentEvent.id,
                    IsAuthorShown: $('#IsAuthorShown').is(":checked"),
                    IsPrivate: $('#IsPrivate').is(":checked"),
                    IsParticipantsAllowed: $('#IsParticipantsAllowed').is(":checked"),
                    Organizer: $('#Event_Organizer').val()
                };

                var pivotModel = {
                    BeginingDate: eventPageCurrentEvent.beginingDate,
                    EndingDate: eventPageCurrentEvent.endingDate,
                    ClassRoomId: eventPageCurrentEvent.classRoomId
                };
   
                postData(ajaxUrl.EventUpdateUrl,
                    {
                        eventModel: eventModel,
                        pivotModel: pivotModel
                    },
                    function (response) {

                        $('#eventedit-status').attr('class', 'error-section');

                        if (response.success) {

                            $('.icon-place').html('<i id="status-icon-bad" class="fa fa-calendar-check-o"></i>');

                            eventPageStartDateTimeBegin = copyDate(eventPageDateTimeBegin);
                            eventPageStartDateTimeEnd = copyDate(eventPageDateTimeEnd);

                            location.reload();

                        } else {
                            $('.icon-place').html('<i id="status-icon-bad" class="fa fa-frown-o"></i>');
                        }

                        $('#error-message').html(response.message);

                    },
                    function (responce) {
                        console.log(responce);
                        eventPageDialogWindowError.show();
                    });

            } else {
                errorIncorrectDateTime(eventpageCorrectDateTime);
            }
        }
    }
});


$(document).on('click', '.participant-remove', function () {

    var participantFormDom = $('#event-participant-count');
    var participant = $(this);
    var data = {
        id: participant.attr('id').split('-')[1]
    }

    if (data.id == eventPageCurrentEvent.userId || eventPageCurrentEvent.isAdmin) {

        postData(ajaxUrl.ParticipantRemoveUrl, data, function (successResponse) {
            if (successResponse.success) {
                participant.parent().remove();
                participantFormDom.html(parseInt(participantFormDom.html()) - 1);

                isUserTakePart(ajaxUrl.ParticipantExist, eventPageCurrentEvent.id);
                loadParticipants();
            }

        }, function (errorResponse) {
            eventPageDialogWindowError.dialogModel.BodyMessage = errorResponse;
            eventPageDialogWindowError.show();
        });

    }
});

$(document).on('click', '#change-cancel', function () {
    if (eventPageCurrentMode === eventPageModes.read) {

        eventpageLoadToSelectRoom();
        eventpageLoadToSelectRoom();

        eventPageCurrentMode = eventPageModes.edit;

        errorIncorrectDateTime(compareDates({
            year: 2000 + parseInt(eventPageStartDateTimeBegin.year),
            month: eventPageStartDateTimeBegin.month,
            day: eventPageStartDateTimeBegin.day,
            hour: eventPageStartDateTimeBegin.hour,
            minutes: eventPageStartDateTimeBegin.minutes
        }, dateNow, false, true) > 0);

        $('.title').addClass('display-none');
        $('.title-edit').removeClass('display-none');

        $('.author').addClass('display-none');
        $('.author-edit').removeClass('display-none');

        $('.description').addClass('display-none');
        $('.description-edit').removeClass('display-none');

        $('.participant-add').addClass('display-none');
        $('.participants-edit').removeClass('display-none');

        $('.participant-list').addClass('participant-list-edit');

        $('.date-edit').removeClass('invisible');

        $('#plan-section').addClass("plan-section-event-edit");

        $('.plan-stage').html('Выберете аудиторию на этаже 10');

        $('.button-edit').addClass('display-none');
        $('.button-edit-cancel').removeClass('display-none');
        $('.button-cancel-event').addClass('display-none');
        $('.button-save-event').removeClass('display-none');

    } else {

        eventPageCurrentMode = eventPageModes.read;

        errorIncorrectDateTime(true);

        $('.title-edit').addClass('display-none');
        $('.title').removeClass('display-none');

        $('.author-edit').addClass('display-none');
        $('.author').removeClass('display-none');

        $('.description-edit').addClass('display-none');
        $('.description').removeClass('display-none');

        $('.participants-edit').addClass('display-none');
        $('.participant-add').removeClass('display-none');

        $('.participant-list').removeClass('participant-list-edit');

        $('.date-edit').addClass('invisible');

        $('#plan-section').removeClass("plan-section-event-edit");

        $('.plan-stage').html('Этаж 10');

        $('.button-edit-cancel').addClass('display-none');
        $('.button-edit').removeClass('display-none');
        $('.button-save-event').addClass('display-none');
        $('.button-cancel-event').removeClass('display-none');

        renderNewEventStartDateTimeBegin(eventPageStartDateTimeBegin);
        renderNewEventStartDateTimeEnd(eventPageStartDateTimeEnd);

        eventpageLoadSelectedClassRoom();
    }
});


function renderNewEventStartDateTimeBegin(dateTime) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    $('#date-day-value').html(dateTime.day);
    $('#date-year-value').html(dateTime.year);
    $('#date-month-value').html(renderDate(dateTime.month));
    $('#timebegin-hours-value').html(renderedTime.hour);
    $('#timebegin-minutes-value').html(renderedTime.minutes);

}

function renderNewEventStartDateTimeEnd(dateTime) {

    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);
    $('#timeend-hours-value').html(renderedTime.hour);
    $('#timeend-minutes-value').html(renderedTime.minutes);
}

function cancelEvent() {
    eventPageDialogWindow.close();

    var form = $('#event-cancel-token');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var data = {
        __RequestVerificationToken: token,
        id: eventPageCurrentEvent.id
    };

    postData(ajaxUrl.EventCancelUrl, data, function () {

        window.location.href = ajaxUrl.HomeUrl;
    }, function () {
        eventPageDialogWindowError.show();
    });
}

function cancelCancelEvent() {
    eventPageDialogWindow.close();
}

function eventpageLoadToSelectRoom() {

    $('#plan-loading').show();

    postData(ajaxUrl.PlanSectionUrl,
        {
            id: eventPageCurrentEvent.classRoomId,
            loadParameters: PlanSectionLoadParameters.EventRoomSelection
        },
        function (result) {
            $('#plan-section').html(result);
            $('#plan-loading').hide();
        });

}

function eventpageLoadSelectedClassRoom() {
    $('#plan-loading').show();

    postData(ajaxUrl.PlanSectionUrl,
        {
            id: eventPageCurrentEvent.classRoomId,
            loadParameters: PlanSectionLoadParameters.SelectedRoom
        },
        function (result) {
            $('#plan-section').html(result);
            $('#classroom-path').addClass(`plan-room-path-${eventPageCurrentEvent.classRoomId}`);
            $('#eventpage-room-name').html($('#eventpage-selected-room').val());
            $('#plan-loading').hide();
        });
}