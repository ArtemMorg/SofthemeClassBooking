var planSection;
var planSectionRoomId;
var planSectionAdditionalInfo;
var planSectionConnectionLine;
var planSectionConnectionLinePath;

var planSectionAvailableCssClass;
var planSectionShowConnectionLineCssClass;
var planSectionShowAdditionalInfoDom;

function planSectionInit() {

    planSection = $('#plan-section');

    planSection.off();

    planSectionRoomId = '.plan-room';
    planSectionShowAdditionalInfoDom = $('.additional-info');
    planSectionAdditionalInfo = $('#classroom-additional-info');
    planSectionConnectionLine = $('#classroom-additional-info-line');
    planSectionConnectionLinePath = $('#classroom-path');

    planSectionAvailableCssClass = '-available';
    planSectionShowConnectionLineCssClass = 'show plan-room-line-detail-';

    planSection.on('mouseover', planSectionRoomId, function () {

        var selectedClassRoom = $(this);
        var selectedClassRoomId = selectedClassRoom.attr('id');

        if (selectedClassRoom.hasClass(planSectionAvailableCssClass)) {

            console.log

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

    planSection.on('click', planSectionRoomId, function () {
        window.location.href = ajaxUrl.RoomPageUrl + '/' + $(this).attr('id');
    });

}