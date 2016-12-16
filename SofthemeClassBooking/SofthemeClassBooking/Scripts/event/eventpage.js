var eventPageDialogWindow;
var eventPageCurrentEvent;
var eventPageDateCorrect = true;

var eventPageDateTimeBegin = {};
var eventPageDateTimeEnd = {};

var eventPageStartDateTimeBegin = {};
var eventPageStartDateTimeEnd = {};

function EventPageModel(id) {
    var self = this;
    self.id = id;
}

var eventPageModes = {
    read: 0,
    edit: 1
}

var eventPageCurrentMode = eventPageModes.read;


function addDayToEvent() {
    addValueToDate(eventPageDateTimeBegin, { day: 1 }, true);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function subDayToEvent() {
    addValueToDate(eventPageDateTimeBegin, { day: 1 }, false);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function addMonthToEvent() {

    addValueToDate(eventPageDateTimeBegin, { month: 1 }, true);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function subMonthToEvent() {
    addValueToDate(eventPageDateTimeBegin, { month: 1 }, false);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function addYearToEvent() {

    addValueToDate(eventPageDateTimeBegin, { year: 1 }, true);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function subYearToEvent() {
    addValueToDate(eventPageDateTimeBegin, { year: 1 }, false);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function addHourToEventBegin() {
    addValueToDate(eventPageDateTimeBegin, { hour: 1 }, true);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function subHourToEventBegin() {
    addValueToDate(eventPageDateTimeBegin, { hour: 1 }, false);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function addMinutesToEventBegin() {
    addValueToDate(eventPageDateTimeBegin, { minutes: 1 }, true);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function subMinutesToEventBegin() {
    addValueToDate(eventPageDateTimeBegin, { minutes: 1 }, false);
    renderNewEventDateTime(eventPageDateTimeBegin);
}

function addHourToEventEnd() {
    addValueToDate(eventPageDateTimeEnd, { hour: 1 }, true);
    renderNewEventDateTimeEnd(eventPageDateTimeEnd);
}

function subHourToEventEnd() {
    addValueToDate(eventPageDateTimeEnd, { hour: 1 }, false);
    renderNewEventDateTimeEnd(eventPageDateTimeEnd);
}

function addMinutesToEventEnd() {
    addValueToDate(eventPageDateTimeEnd, { minutes: 1 }, true);
    renderNewEventDateTimeEnd(eventPageDateTimeEnd);
}

function subMinutesToEventEnd() {
    addValueToDate(eventPageDateTimeEnd, { minutes: 1 }, false);
    renderNewEventDateTimeEnd(eventPageDateTimeEnd);
}


function renderNewEventDateTime(dateTime) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    $('#date-day-value').html(dateTime.day);
    $('#date-month-value').html(renderDate(dateTime.month));
    $('#date-year-value').html(String(dateTime.year).slice(-2));
    $('#timebegin-hours-value').html(renderedTime.hour);
    $('#timebegin-minutes-value').html(renderedTime.minutes);


}

function renderNewEventDateTimeEnd(dateTime) {
    var renderedTime = renderTimeMinutes(dateTime.hour, dateTime.minutes, true);

    $('#timeend-hours-value').html(renderedTime.hour);
    $('#timeend-minutes-value').html(renderedTime.minutes);
}


function setDateTime(eventDateTimeBegin, eventDateTimeEnd) {

    eventPageDateTimeBegin = {
        year: eventDateTimeBegin.year,
        month: eventDateTimeBegin.month,
        day: eventDateTimeBegin.day,
        hour: eventDateTimeBegin.hour,
        minutes: eventDateTimeBegin.minutes
    };

    eventPageStartDateTimeBegin = copyDate(eventPageDateTimeBegin);

    eventPageDateTimeEnd = {
        year: eventDateTimeEnd.year,
        month: eventDateTimeEnd.month,
        day: eventDateTimeEnd.day,
        hour: eventDateTimeEnd.hour,
        minutes: eventDateTimeEnd.minutes
    }

    eventPageStartDateTimeEnd = copyDate(eventPageDateTimeEnd);

    $('.eventpage').off();

    $('.eventpage').on('click', '#date-day-up', addDayToEvent);
    $('.eventpage').on('click', '#date-day-down', subDayToEvent);

    $('.eventpage').on('click', '#date-month-up', addMonthToEvent);
    $('.eventpage').on('click', '#date-month-down', subMonthToEvent);

    $('.eventpage').on('click', '#date-year-up', addYearToEvent);
    $('.eventpage').on('click', '#date-year-down', subYearToEvent);

    $('.eventpage').on('click', '#timebegin-hours-up', addHourToEventBegin);
    $('.eventpage').on('click', '#timebegin-hours-down', subHourToEventBegin);

    $('.eventpage').on('click', '#timebegin-minutes-up', addMinutesToEventBegin);
    $('.eventpage').on('click', '#timebegin-minutes-down', subMinutesToEventBegin);

    $('.eventpage').on('click', '#timeend-hours-up', addHourToEventEnd);
    $('.eventpage').on('click', '#timeend-hours-down', subHourToEventEnd);

    $('.eventpage').on('click', '#timeend-minutes-up', addMinutesToEventEnd);
    $('.eventpage').on('click', '#timeend-minutes-down', subMinutesToEventEnd);

    renderNewEventDateTime(eventPageDateTimeBegin);
    renderNewEventDateTimeEnd(eventPageDateTimeEnd);
}

/**
 *         public string Title { get; set; }
        public string UserId { get; set; }

        public int ClassRoomId { get; set; }

        public DateTime BeginingDate { get; set; }

        public string Description { get; set; }

        public DateTime EndingDate { get; set; }

        public int Id { get; set; }

        public bool IsAuthorShown { get; set; }

        public bool IsPrivate { get; set; }

        public bool IsParticipantsAllowed { get; set; }

        public string Organizer { get; set; }
 */


$(document).on('click', '#save-cancel-event', function () {
    if (eventPageCurrentMode === eventPageModes.read) {
        eventPageDialogWindow.show();
    } else {
        //submit stuff
        $('#eventedit-status').attr('class', 'error-section display-none');

        if ($('#Event_Title').val().length >= 1) {
           
            if (eventPageDateCorrect) {

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
                }

                postData(ajaxUrl.EventUpdateUrl,eventModel,
                    function(response) {
                        debugger;
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
                    function() {
                        eventPageDialogWindowError.show();
                    });

            } else {
                alert(2);
            }
        } else {
            alert(1);
        }
    }
});


$(document).on('click', '.participant-remove', function () {
    var participant = $(this);
    var data = {
        id: participant.attr('id').split('-')[1]
    }

    postData(ajaxUrl.ParticipantRemoveUrl, data, function (response) {
        if (response.success) {
            participant.remove();
        }

    }, function (response) {
        debugger;
        eventPageDialogWindowError.dialogModel.BodyMessage = response;
        eventPageDialogWindowError.show();
    });
});

$(document).on('click', '#change-cancel', function () {
    if (eventPageCurrentMode === eventPageModes.read) {

        eventPageCurrentMode = eventPageModes.edit;

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

        renderNewEventDateTime(eventPageStartDateTimeBegin);
        renderNewEventDateTimeEnd(eventPageStartDateTimeEnd);
    }
});

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
