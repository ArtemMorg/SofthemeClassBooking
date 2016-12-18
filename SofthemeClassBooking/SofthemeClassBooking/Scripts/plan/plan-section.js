var planSection;
var planSectionRoomId;
var planSectionAdditionalInfo;
var planSectionConnectionLine;
var planSectionConnectionLinePath;

var planSectionAvailableCssClass;
var planSectionShowConnectionLineCssClass;
var planSectionShowAdditionalInfoDom;
var planSectionLoadParameters;
var planSectionBusyCssClass;

var planSectionCurrentRoom;
var planSectionPivotClassRoom;

function planSectionInit(isUserAdmin, loadParameters) {

    planSectionLoadParameters = parseInt(loadParameters);

    if (typeof (getSelectedClassRoom) === "function") {
        planSectionCurrentRoom = getSelectedClassRoom();
        planSectionPivotClassRoom = planSectionCurrentRoom;
    }

    planSection = $('#plan-section');

    planSection.off();

    if (isUserAdmin === 'True') {
        $('.plan-room').css('cursor', 'pointer');
    }

    planSectionRoomId = '.plan-room';
    planSectionShowAdditionalInfoDom = $('.additional-info');
    planSectionAdditionalInfo = $('#classroom-additional-info');
    planSectionConnectionLine = $('#classroom-additional-info-line');
    planSectionConnectionLinePath = $('#classroom-path');

    planSectionAvailableCssClass = '-available';
    planSectionBusyCssClass = '-busy';
    planSectionShowConnectionLineCssClass = 'show plan-room-line-detail-';


    if (planSectionLoadParameters !== PlanSectionLoadParameters.HoverDisabled) {


        planSection.on('mouseover', planSectionRoomId, function () {

            var selectedClassRoom = $(this);
            var selectedClassRoomId = selectedClassRoom.attr('id');

            if (selectedClassRoom.hasClass(planSectionAvailableCssClass)) {

                planSectionShowAdditionalInfoDom.show();

                var url = ajaxUrl.PlanAdditionalUrl + '/' + selectedClassRoomId;

                loadSection(url, null, function (successResponse) {
                    planSectionAdditionalInfo.html(successResponse);
                    planSectionConnectionLine.attr('class', planSectionShowConnectionLineCssClass + selectedClassRoomId);

                }, function (errorResponse) {
                    planSectionAdditionalInfo.html(errorResponse);
                });

            }
        });

        planSection.on('mouseleave', planSectionRoomId, function () {
            planSectionAdditionalInfo.hide();
            planSectionConnectionLine.hide();
        });

    }

    planSection.on('click', planSectionRoomId, function () {

        var selectedRoom = $(this);
        var selectedRoomCssClass = selectedRoom.attr('class');
        var selectedRoomId = $(this).attr('id');

        if (planSectionLoadParameters === PlanSectionLoadParameters.EventRoomSelection) {
            debugger;
            $(`#${planSectionCurrentRoom}`).attr('class', `plan-room-${planSectionCurrentRoom}${planSectionAvailableCssClass} plan-room ${planSectionAvailableCssClass}`);
            $(`#${selectedRoomId}`).attr('class', `plan-room-${selectedRoomId}${planSectionBusyCssClass} plan-room ${planSectionBusyCssClass}`);

            planSectionCurrentRoom = selectedRoomId;

            if (planSectionPivotClassRoom !== planSectionCurrentRoom) {
                checkRoomIsBusy(selectedRoomId);
            }

        } else {

            if (isUserAdmin === 'True' ||
                (~selectedRoomCssClass.indexOf(planSectionAvailableCssClass) ||
                ~selectedRoomCssClass.indexOf(planSectionBusyCssClass))) {

                window.location.href = ajaxUrl.RoomPageUrl + '/' + selectedRoom.attr('id');

            };
        }


    });


}