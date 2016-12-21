var compareToDate = {};
var eventNewDateTimeBegin = {};
var defaultAjaxDataType = 'json';
var dateCorrect = true;
var checkFunctionInterval;
var minumumAllowedMinutes = 20;

var defaultDateTimeFormat = "yy-MM-dd-HH-mm";
var defaultYearAddToShor = 2000;
var defaultOneMinute = 1000 * 60;
var defaultNewEventEndHourOffset = 1;
var defaultNewEventStartMinutesOffset = 5;

//Shared id for all popups - only 1 at a time
var singleRoomeventPopupId = 777;

var defaultMaximumBookHour = 19;
var defaultMaximumBookMinutes = 0;
var defaultMinimumBookHour = 9;
var defaultMinimumBookMinutes = 0;
var defaultMaximumDurationMinutes = 180;
var defaultHourLeftOffsetEventLoading = 12;
var defaultHourRightOffsetEventLoading = 12;

var fisrtTimeCellWidth = 102;
var timeCellWidth = 122;
var minutePerPixel = (timeCellWidth / 60);
var minutesPerPixelVertical = 48 / 60;

var shortRoomEventTable = 5;
var longRoomEventTable = 8;
var sliderTimeInterval = 1000 * 60;
var maxRowCalendarSize = 5;

var roompageCalendarCellBorderWidth = 2;
var roompageWeekendWidthPx = 40;
var maxCellCalendarSize = 7;
var minumumAllowedTimeToBook = 20 * minutePerPixel;
var timeOffset = 0;
var eventAddBlockCorrection = 2;
var shortBlockMinimumTime = 40;
var eventBlockType = { short: 0, long: 1 };
var roompageMaxDayCalendarCount = 9;
var roompageMaxRowCount = 12;

var roompageMaxHour = 19;
var milisecondsPerDay = 1000 * 60 * 60 * 24;

var renderDateTimeType = {
    withMonthNames: 0,
    numertic: 1
};

var RoomEventPopupCrudMode = {
    create: 0,
    edit: 1
}

var PlanSectionLoadParameters = {
    Normal: 0,
    SelectedRoom: 1,
    EventRoomSelection: 2,
    HoverDisabled: 3
}

var classRooms;
var eventWasAdded;

var ajaxUrl = {};

var roomeventEventsByUser = false;
var currentUserId;

function setCurrentUserId(id) {
    currentUserId = id;
}

$(document).off('click', '#add-event');
$(document).on('click', '#add-event', function () {

    loadSection(ajaxUrl.EventCreateUrl).done(function (result) {
        $('#event-modal-position').html(result);
        $('#lock').show();
    });

});

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
        RoomEventPopupViewUrl: url.RoomEventPopupViewUrl,
        RoomChangeStatusUrl: url.RoomChangeStatusUrl,
        PlanSectionUrl: url.PlanSectionUrl,
        PlanAdditionalUrl: url.PlanAdditionalUrl,
        MapSectionUrl: url.MapSectionUrl,
        EventUsersUrl: url.EventUsersUrl,
        IsRoomBusy: url.IsRoomBusy,
        EventCreateUrl: url.EventCreateUrl,
        EventCancelUrl: url.EventCancelUrl,
        EventUpdateUrl: url.EventUpdateUrl,
        EventsBriefUrl: url.EventsBriefUrl,
        EventByClassRoomUrl: url.EventByClassRoomUrl,
        EventUrl: url.EventUrl,
        EventInfoVerbose: url.EventInfoVerbose,
        ParticipantAddUrl: url.ParticipantAddUrl,
        ParticipantsUrl: url.ParticipantsUrl,
        ParticipantExist: url.ParticipantExist,
        DialogWindowUrl: url.DialogWindowUrl,
        UserEmailUrl: url.UserEmailUrl
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

function getEventInfoVerbose(eventId,eventPrivate) {
    return loadSection(ajaxUrl.EventInfoVerbose + '?id=' + eventId + '&isPrivate=' + eventPrivate);
}

function renderSection(url, domElement, domLoadingElement, finallyFunction) {
    loadSection(url, function () {

        domLoadingElement.show();

    }, function (successResponse) {

        domElement.html(successResponse);
        domLoadingElement.hide();

        if (typeof (finallyFunction) === "function") {
            finallyFunction();
        }

    }, function (errorResponse) {
        eventPageDialogWindowError.BodyMessage += `#${errorResponse.message}`;
        eventPageDialogWindowError.show();
        domLoadingElement.hide();
    });
}

$(document).off('click', '.fa-link');
$(document).on('click', '.fa-link', function () {
    window.location = ajaxUrl.EventUrl + '/' + $(this).attr('id').split('-')[1];
});


function addParticipant(participantForm, participantFormDom, isForm) {

    var data = isForm ? participantForm.serialize() : participantForm;
    postData(
        ajaxUrl.ParticipantAddUrl,
        data,
        function (successResponse) {

            participantFormDom.email.val('').attr({
                placeholder: successResponse.message,
                disabled: true
            });

            participantFormDom.submit.attr('disabled', true);

            if (successResponse.success) {
                participantFormDom.count.html(parseInt(participantFormDom.count.html()) + 1);
            }

            if (typeof (participantFormDom.callback) === "function") {
                participantFormDom.callback();
            }

        },
        function (errorResponse) {
            eventPageDialogWindowError.BodyMessage += `#${errorResponse.message}`;
            eventPageDialogWindowError.show();
        });
}

function fillClassRoomSelectList(selectDom) {

    getClassRooms().done(function (rooms) {
        classRooms = JSON.parse(rooms);
        var optionList = '';
        for (var i = 0; i < classRooms.length; i++) {
            optionList += '<option value="' + classRooms[i].Id + '">' + classRooms[i].Name + '</option>';
        }

        selectDom.html(optionList);
    });
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};