var roomeventPopupVerboseFormId = "verbose-add-participant-form";
var roomeventPopupVerboseSubmitId = "verbose-add-participant-submit";
var roomeventPopupVerboseEmailId = "verbose-add-participant-email";
var roomeventPopupVerboseCountId = "verbose-participant-count";

var roomeventPopupVerboseErrorMessageId = "verbose-email-error-message";

var roomeventDialogWindow;

var roomeventPoputCrudModeEdit;
var roomeventPoputCrudForm;
var roomeventPopupCrudSection;

var roomeventCreateNewCorrectDateTime = true;
var roomeventPopupCrudCurrentEvent = {};
var roomeventPopupCrudClassRoomListBox;
var roomeventPopupCrudClassRoomDom;

var roomeventPopupCrudClassRooms = {};

var roomeventPopupModalId;

var roomeventPopupCrudSelectedClassRoomFromList = {
    id: 0,
    name: ''
};

var roomeventModalCreateNewDateTimeBegin = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minutes: 0
};

var roomeventModalSelectedClassRoom;

var roomeventModalCreateNewDateTimeEnd = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minutes: 0
};

/* 

CRUD Section

*/


function setEventModalModel(id, userId, isAdmin, classRoomId, beginingDate, endingDate) {
   
    roomeventPopupCrudCurrentEvent.id = id;
    roomeventPopupCrudCurrentEvent.userId = userId;
    roomeventPopupCrudCurrentEvent.isAdmin = isAdmin;
    roomeventPopupCrudCurrentEvent.classRoomId = classRoomId;
    roomeventPopupCrudCurrentEvent.beginingDate = beginingDate;
    roomeventPopupCrudCurrentEvent.endingDate = endingDate;
}

function roomeventPoputCrudInit(mode) {

    roomeventPopupCrudClassRoomListBox = $('#event-edit-room-dropdown-elements');
    roomeventPopupCrudClassRoomDom = $('#event-modal-classRoomId');

    roomeventPopupCrudClassRoomDom.val(getRoomeventModalSelectedClassRoom());
    fillClassRoomList();


    roomeventPopupCrudSection = $('#event-modal-crud-section');
    roomeventPoputCrudForm = $('event-modal-form');

    roomeventPopupCrudSection.off();

    roomeventPoputCrudModeEdit = mode === 'True';

    $(document).off('keyup', '#event-modal-title');
    $(document).on('keyup', '#event-modal-title', checkEventTitle);

    $(document).off('click', '#event-modal-form-close');
    $(document).on('click', '#event-modal-form-close', function () {
        $(`#popups-${singleRoomeventPopupId}`).remove();
        renderRooms(currentMode);
    });

    $(document).off('click', '#event-edit-room-dropdown');
    $(document).on('click', '#event-edit-room-dropdown', listDropDown);
    
    setDateTimeObject(
       roomeventModalCreateNewDateTimeBegin,
       roomeventModalCreateNewDateTimeEnd,
       roomeventPoputCrudModeEdit?  roomeventPopupCrudCurrentEvent.beginingDate : roomeventModalCreateNewDateTimeTargetBegin,
       roomeventPoputCrudModeEdit ? roomeventPopupCrudCurrentEvent.endingDate : roomeventModalCreateNewDateTimeTargetEnd,
       roomeventPopupCrudSection,
       {
           dateDayUp: $('#date-day-up-modal'),
           dateDayDown: $('#date-day-down-modal'),
           dateMonthUp: $('#date-month-up-modal'),
           dateMonthDown: $('#date-month-down-modal'),
           timebeginHoursUp: $('#timebegin-hours-up-modal'),
           timebeginHoursDown: $('#timebegin-hours-down-modal'),
           timebeginMinutesUp: $('#timebegin-minutes-up-modal'),
           timebeginMinutesDown: $('#timebegin-minutes-down-modal'),
           timeendHoursUp: $('#timeend-hours-up-modal'),
           timeendHoursDown: $('#timeend-hours-down-modal'),
           timeendMinutesUp: $('#timeend-minutes-up-modal'),
           timeendMinutesDown: $('#timeend-minutes-down-modal')
       },
       {
           dayValue: $('#date-day-value-modal'),
           monthValue: $('#date-month-value-modal'),
           timeBeginHourValue: $('#timebegin-hours-value-modal'),
           timeBeginMinutesValue: $('#timebegin-minutes-value-modal'),
           timeEndHourValue: $('#timeend-hours-value-modal'),
           timeEndMinutesValue: $('#timeend-minutes-value-modal')
       },
       function () {
           errorIncorrectDateTime(true);
       },
       function () {
           $('#eventedit-status').attr('class', 'error-section');
           errorIncorrectDateTime(false);

       },
       renderDateTimeType.withMonthNames
   );

}

$(document).off('click', '#event-modal-submit');
$(document).on('click', '#event-modal-submit', function(e) {

    e.preventDefault();

    if (!checkEventTitle()) {
        return;
    }

    if (compareDates(roomeventModalCreateNewDateTimeBegin, dateNow, false, true) < 0) {
        errorIncorrectDateTime(false);
        return;
    }

    var eventmodalCreateNewIconPlace = $('#event-modal-icon');
    var eventmodalCreteNewForm = $('#event-modal-form');
    var eventmodalCreateNewStatusSection = $('#event-modal-status-section');
    var eventmodalCreateNewErrorMessage = $('#error-mesage-modal');

    if (roomeventPoputCrudModeEdit) {

        var eventModel = {
            Title: $('#event-modal-title').val(),
            UserId: $('#event-modal-userid').val(),
            ClassRoomId: $('#event-modal-classRoomId').val(),
            BeginingDate: convertToDateTime(roomeventModalCreateNewDateTimeBegin),
            Description: $('#event-modal-description').val(),
            EndingDate: convertToDateTime(roomeventModalCreateNewDateTimeEnd),
            Id: roomeventPopupCrudCurrentEvent.id,
            IsAuthorShown: $('#IsAuthorShown-modal').is(":checked"),
            IsPrivate: $('#IsPrivate-modal').is(":checked"),
            IsParticipantsAllowed: $('#IsParticipantsAllowed-modal').is(":checked"),
            Organizer: $('#event-modal-organizer').val()
        };


        var pivotModel = {
            BeginingDate: convertToDateTime(roomeventPopupCrudCurrentEvent.beginingDate),
            EndingDate: convertToDateTime(roomeventPopupCrudCurrentEvent.endingDate),
            ClassRoomId: roomeventPopupCrudCurrentEvent.classRoomId
        };
        console.log(eventmodalCreteNewForm.serialize());

        postData(ajaxUrl.EventUpdateUrl,
            {
                eventModel: eventModel,
                pivotModel: pivotModel
            },
            function (successResponse) {

                eventmodalCreateNewStatusSection.attr('class', 'status-message display-inline-block');

                if (successResponse.success) {
                    eventmodalCreateNewIconPlace.html('<i id="status-icon-bad" class="fa fa-calendar-check-o"></i>');
                    document.getElementById(`${eventmodalCreteNewForm.attr('id')}`).reset();
                } else {
                    eventmodalCreateNewIconPlace.html('<i id="status-icon-bad" class="fa fa-frown-o"></i>');
                }

                eventmodalCreateNewErrorMessage.html(successResponse.message);
            },
            function(errorResponse) {
                console.log(errorResponse);
            });

    } else {

        $('#event-modal-beginingDate').val(convertToDateTime(roomeventModalCreateNewDateTimeBegin));
        $('#event-modal-endingDate').val(convertToDateTime(roomeventModalCreateNewDateTimeEnd));

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
                    console.log(errorResponse);
                });
    }

});


function errorIncorrectDateTime(dateValid) {
    roomeventCreateNewCorrectDateTime = dateValid;
    if (!dateValid) {

        $('#event-modal-status-section').attr('class', '');
        $('#event-modal-icon').html('<i id="status-icon-bad" class="fa fa-calendar-times-o"></i>');
        $('#error-mesage-modal').html("Указана неверная дата и (или) время");
    } else {
        $('#event-modal-status-section').attr('class', 'display-none');
    }

}

function isUserTakePart(url, eventModelId) {

    postData(
        url,
        { eventId: eventModelId },
        function (successResponse) {
            if (successResponse.success) {
      
                if (successResponse.message) {
                    
                    $('#event-modal-email-take-part').attr('class', ' ');
                    $('#verbose-add-participant-form').attr('class', 'display-none');
                } else {
                    $('#verbose-add-participant-form').attr('class', '');
                    $('#event-modal-email-take-part').attr('class', 'display-none');

                }
            }
        });
}


function checkEventTitle() {
    if ($('#event-modal-title').val().length < 1) {
        $('#event-modal-title-error').show();
        return false;
    } else {
        $('#event-modal-title-error').hide();
        return true;
    }
}


function fillClassRoomList() {

    getClassRooms().done(function (rooms) {
        roomeventPopupCrudClassRooms = JSON.parse(rooms);
        var divList = '';
        for (var i = 0; i < roomeventPopupCrudClassRooms.length; i++) {
            divList += ' <div class="event-edit-room-dropdown-variant" id="room-option-' +
                roomeventPopupCrudClassRooms[i].Id + '">' +
                roomeventPopupCrudClassRooms[i].Name + '</div>';
        }

        roomeventPopupCrudClassRoomListBox.html(divList);
        selectClassRoomInList();

    });

}

function selectClassRoomInList(id) {

    roomeventPopupCrudSelectedClassRoomFromList.id = id || getRoomeventModalSelectedClassRoom();
    roomeventPopupCrudClassRoomDom.val(roomeventPopupCrudSelectedClassRoomFromList.id);
    roomeventPopupCrudSelectedClassRoomFromList.name = $(`#room-option-${roomeventPopupCrudSelectedClassRoomFromList.id}`).html();
    $('#event-modal-selected-room').html(roomeventPopupCrudSelectedClassRoomFromList.name);

}

$(document).off('click', '.event-edit-room-dropdown-variant');
$(document).on('click', '.event-edit-room-dropdown-variant', function () {
    selectClassRoomInList($(this).attr('id').split('-')[2]);
});

var listed = false;
function listDropDown() {
    if (!listed) {
        $('#event-edit-room-dropdown').addClass('event-edit-room-dropdown-list');
        $('#event-edit-room-dropdown').removeClass('event-edit-room-dropdown-selected');
        $('#event-edit-room-selected').addClass('event-edit-room-dropdown-variant-selected');
        $('.event-edit-room-dropdown-variant').css('display', 'inline-block');

        listed = true;
    } else {
        $('#event-edit-room-dropdown').removeClass('event-edit-room-dropdown-list');
        $('#event-edit-room-dropdown').addClass('event-edit-room-dropdown-selected');
        $('#event-edit-room-selected').removeClass('event-edit-room-dropdown-variant-selected');
        $('.event-edit-room-dropdown-variant').css('display', 'none');
        listed = false;
    }
}


/*

Event block exists section

*/


$(document).off('click', `#${roomeventPopupVerboseSubmitId}`);
$(document).on('click',
        `#${roomeventPopupVerboseSubmitId}`,
        function() {

            if (! $(`#${roomeventPopupVerboseErrorMessageId}`).hasClass('display-none')) {
                $(`#${roomeventPopupVerboseErrorMessageId}`).addClass('display-none');
            }

            if (isValidEmailAddress($(`#${roomeventPopupVerboseEmailId}`).val())) {

                addParticipant(
                    $(`#${roomeventPopupVerboseFormId}`),
                    {
                        email: $(`#${roomeventPopupVerboseEmailId}`),
                        submit: $(`#${roomeventPopupVerboseSubmitId}`),
                        count: $(`#${roomeventPopupVerboseCountId}`)
                    },
                    true
                );

            } else {
                $(`#${roomeventPopupVerboseErrorMessageId}`).removeClass('display-none');
            }

        });


function roomeventPopupVerboseInit(datetime, datetimeEnd, popupId) {

    roomeventPopupModalId = popupId;
    isUserTakePart(ajaxUrl.ParticipantExist, popupId);

    var dayOfWeek = getDayOfWeek(new Date(datetime.year + '-' + datetime.month + '-' + datetime.day).getDay());
    $('#event-verbose-date').html(dayNames[dayOfWeek] + ',' + datetime.day + " " + monthNamesAccusative[datetime.month-1]);

    var timeBegin = renderTimeMinutes(datetime.hour, datetime.minutes);
    var timeEnd = renderTimeMinutes(datetimeEnd.hour, datetimeEnd.minutes);
    $('#event-verbose-time').html(timeBegin + '-' + timeEnd);

}

$(document).off('click', '#event-modal-close');
$(document).on('click', '#event-modal-close', function() {
    $(`#popups-${singleRoomeventPopupId}`).remove();
});

$(document).off('click', '.event-button-cancel');
$(document).on('click','.event-button-cancel', function() {
    roomeventDialogWindow.show();
});

$(document).off('click', '.event-button-change');
$(document).on('click', '.event-button-change', function (e) {

    $(`#popups-${singleRoomeventPopupId}`).remove();
    $('.event-position').remove();

    $('body').append(roomeventPopupDom);
    $(`#${roomeventPoputId}`).css({
        'left': (e.pageX / 2),
        'top': e.pageY
    });

    loadSection(
        ajaxUrl.RoomEventPopupViewUrl + "?eventId=" + roomeventPopupModalId,
        null,
        function (successResponse) {

            $(`#${roomeventPoputId}`).html(successResponse);

        },
        function (errorResponse) {
            console.log(errorResponse);
        });

});

function cancelEvent() {
    roomeventDialogWindow.close();

    var form = $('#event-cancel-token');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    var data = {
        __RequestVerificationToken: token,
        id: roomeventPopupModalId
    };

    postData(ajaxUrl.EventCancelUrl, data, function () {

        $(`#popups-${singleRoomeventPopupId}`).remove();
        $(`#eventblock-${roomeventPopupModalId}`).remove();

    }, function () {
        roomeventDialogWindow.show();
    });
}

function cancelCancelEvent() {
    roomeventDialogWindow.close();
}

/*

roomeventPopupInfoInit

*/

function roomeventPopupInfoInit(datetime, datetimeEnd, popupId) {
    
    roomeventPopupModalId = popupId;

    var dayOfWeek = getDayOfWeek(new Date(datetime.year + '-' + datetime.month + '-' + datetime.day).getDay());
    $('#event-info-date').html(dayNames[dayOfWeek] + ',' + datetime.day + " " + monthNamesAccusative[datetime.month - 1]);

    var timeBegin = renderTimeMinutes(datetime.hour, datetime.minutes);
    var timeEnd = renderTimeMinutes(datetimeEnd.hour, datetimeEnd.minutes);
    $('#event-info-time').html(timeBegin + '-' + timeEnd);

}