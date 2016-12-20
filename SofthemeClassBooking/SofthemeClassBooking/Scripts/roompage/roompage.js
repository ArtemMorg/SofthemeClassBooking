var currentClassRoom;
var isUserAdmin;
var classRoomDialogWindow;

function ClassRoom(id, isLocked) {

    var self = this;
    self.id = id;
    self.isLocked = isLocked;
}

function closeClassRoom() {
    postData(ajaxUrl.RoomChangeStatusUrl, { 'Id': currentClassRoom.id, 'ClassRoomStatus': 1 }, function () {
        location.reload();
    });
}

function cancelCloseClassRoom() {
    classRoomDialogWindow.close();
}


$(document).on('click', '#plan-room-edit-open', function () {

    postData(ajaxUrl.RoomChangeStatusUrl, { 'Id': currentClassRoom.id, 'ClassRoomStatus': 0 }, function () {
        location.reload();
    });

});

function loadRoomPagePlanSection() {

    postData(
        ajaxUrl.PlanSectionUrl,
        {
            id: 0,
            loadParameters: PlanSectionLoadParameters.HoverDisabled
        },
        function(result) {

            $('#plan-loading').hide();
            $('#plan-section').html(result);

            console.log($('#classroom-path').attr('id'));
            $('#classroom-path').addClass(`plan-room-path-${currentClassRoom.id}}`);
            $(`#${currentClassRoom.id}`).addClass(`plan-room-${currentClassRoom.id}-busy`);
            $(`#${currentClassRoom.id}`).removeClass(`plan-room-${currentClassRoom.id}-available`);

            if (currentClassRoom.isLocked !== 'True') {
                loadAdditionalInfo(false);
            }
        }, function(errorResponse) {
            eventPageDialogWindowError.BodyMessage += `#${errorResponse.message}`;
            eventPageDialogWindowError.show();
        });

}

function loadAdditionalInfo(change) {
    var urlTarget;
    var showClass;

    if (change === true) {
        $(`#plan-room-showname-${currentClassRoom.id}`).hide();
        urlTarget = ajaxUrl.PlanAdditionalUrl + "?id=" + currentClassRoom.id + "&edit=" + 'true';
        showClass = 'plan-show-additional-info-detail';
    } else {
        urlTarget = ajaxUrl.PlanAdditionalUrl + "/" + currentClassRoom.id;
        showClass = 'plan-show-additional-info-short';
        $(`#plan-room-showname-${currentClassRoom.id}.Id`).show();
    }

    loadSection(urlTarget, null, function (result) {

        $('#classroom-additional-info').html(result);
        $('#classroom-additional-info').attr('class', showClass);
        $('#classroom-additional-info-line').attr('class', 'plan-room-line-detail-' + currentClassRoom.id);
        $('#classroom-additional-info-line').show();

    }, function (errorResult) {
        eventPageDialogWindowError.BodyMessage += `#${errorResponse.message}`;
        eventPageDialogWindowError.show();
    });
}

$(document).on('click', '#plan-room-edit-cancel', function () {
    $('#classroom-additional-info').empty();
    $('#classroom-additional-info-line').attr('class', '');
    if (currentClassRoom.isLocked !== 'True') {
        loadAdditionalInfo(false);
    }
});

$(document).on('click', '.plan-room', function () {
    var roomId = $(this).attr('id');

    if ($(this).hasClass('-available') || isUserAdmin == 'True') {
        window.location.href = roomId;
    }
});

$(document).on('click', '#plan-room-edit-change', function () {
    loadAdditionalInfo(true);
});

$(document).on('click', '#plan-room-edit-close', function () {
    classRoomDialogWindow.show();
});


$(document).on('click', '#plan-room-edit-submit', function (e) {
    e.preventDefault();

    postFormData(ajaxUrl.RoomEditUrl, $('#roomChange'), 'json',
        function (result) {
        if (currentClassRoom.isLocked !== 'True') {
            loadAdditionalInfo(false);
        }
    }, function(errorResponse) {
        eventPageDialogWindowError.BodyMessage += `#${errorResponse.message}`;
        eventPageDialogWindowError.show();
    });
});