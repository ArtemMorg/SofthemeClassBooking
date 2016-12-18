var roomeventPopupVerboseFormId = "verbose-add-participant-form";
var roomeventPopupVerboseSubmitId = "verbose-add-participant-submit";
var roomeventPopupVerboseEmailId = "verbose-add-participant-email";
var roomeventPopupVerboseCountId = "verbose-participant-count";

var roomeventPopupVerboseErrorMessageId = "verbose-email-error-message";

var roomeventPoputCrudMode;
var roomeventPoputCrudForm;
var roomeventPopupCrudSection;

var roomeventCreateNewCorrectDateTime;

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


function roomeventPoputCrudInit(mode) {

    roomeventPopupCrudSection = $('#event-modal-crud-section');
    roomeventPoputCrudForm = $('event-modal-form');

    roomeventPopupCrudSection.off();

    roomeventPoputCrudMode = mode === 'True';

    console.log(this);


    $(roomeventPopupCrudSection).on('click', '#event-modal-form-close', function () {
        roomeventPopupCrudSection.remove();
    });

    console.log(roomeventModalCreateNewDateTimeTargetEnd);

    setDateTimeObject(
       roomeventModalCreateNewDateTimeBegin,
       roomeventModalCreateNewDateTimeEnd,
       roomeventModalCreateNewDateTimeTargetBegin,
       roomeventModalCreateNewDateTimeTargetEnd,
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

function errorIncorrectDateTime(dateValid) {
    roomeventCreateNewCorrectDateTime = dateValid;
    if (!dateValid) {

        $('#eventedit-status').attr('class', 'error-section');
        $('.icon-place').html('<i id="status-icon-bad" class="fa fa-calendar-times-o"></i>');
        $('#error-message').html("Указана неверная дата и (или) время");
    } else {
        $('#eventedit-status').attr('class', 'error-section display-none');
    }

}

/*

Event block exists section

*/



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



var listed = false;
$(document).on('click', '#event-edit-room-dropdown', function () {
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
});