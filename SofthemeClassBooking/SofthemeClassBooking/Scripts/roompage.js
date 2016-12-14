$(document).on('click','#plan-room-edit-submit', function(e) {
    e.preventDefault();
    $.ajax({
        url: ajaxUrl.RoomEditUrl,
        method: 'POST',
        data: $('#roomChange').serialize(),
        dataType: 'json',
        success: function (result) {
            var isLocked = '@Model.IsLocked';
            if (isLocked !== 'True') {
                loadAdditionalInfo(false);
            }
        }
    });
});

function showModal(isShown) {
    if (isShown == true) {
        $("#modal-room-close").css('display', 'block');
        $('#lock').css('display', 'block');
    } else {
        $("#modal-room-close").css('display', 'none');
        $('#lock').css('display', 'none');
    }
};

$('#no').click(function() {
    $('#modal-room-close').css('display', 'none');
    $('#shit').css('display', 'none');
});


$('#plan-room-edit-change').click(function() {
    loadAdditionalInfo(true);
});

$('#plan-room-edit-close').click(function () {
    showModal(true);
});

$('#modal-answer-no').click(function () {
    showModal(false);
});

