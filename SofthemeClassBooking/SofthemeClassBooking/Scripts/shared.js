var compareToDate = {};
var eventNewDateTimeBegin = {};

var defaultAjaxDataType = 'json';

var dateCorrect = true;
var checkFunctionInterval;
var minumumAllowedMinutes = 20;

var defaultDateTimeFormat = "yy-MM-dd-HH-mm";

var defaultOneMinute = 1000 * 60;
var defaultNewEventEndHourOffset = 1;
var defaultNewEventStartMinutesOffset = 5;

//Shared id for all popups - only 1 at a time
var singleRoomeventPopupId = 777;

var renderDateTimeType = {
    withMonthNames: 0,
    numertic: 1
}

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
        EventUrl: url.EventUrl,
        EventInfoVerbose: url.EventInfoVerbose,
        ParticipantAddUrl: url.ParticipantAddUrl,
        ParticipantsUrl: url.ParticipantsUrl,
        ParticipantExist: url.ParticipantExist,
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
    loadSection(url, function () {

        domLoadingElement.show();

    }, function (successResponse) {

        domElement.html(successResponse);
        domLoadingElement.hide();

        if (typeof (finallyFunction) === "function") {
            finallyFunction();
        }

    }, function (errorResponse) {
        console.log(errorResponse);
        domElement.html(errorResponse.message);
        domLoadingElement.hide();
    });
}


$(document).on('click', '.fa-link', function () {
    window.location = ajaxUrl.EventUrl + "/Index/" + $(this).attr('id').split('-')[1];
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
        function (message) {
            console.log(message);
        });
}

$(document).on('click', '#add-participant-submit', function () {
    if ($('#add-participant-email').val().length >= 1) {
        debugger;
        postFormData(ajaxUrl.ParticipantAddUrl, $('#add-participant-form'), 'json', addParticipantSubmitCallback, function (message) {
            console.log(message);
        });
    }

});

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