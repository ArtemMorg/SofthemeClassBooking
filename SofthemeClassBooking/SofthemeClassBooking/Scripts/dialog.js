function DialogWindow(dialogParameters) {
    var self = this;
    self.isShown = false;
    self.dialogModel = {
        BodyMessage: dialogParameters.bodyMessage,
        Title: dialogParameters.title
    },

    self.show = function () {
        if (!self.isShown) {
            postData(ajaxUrl.DialogWindowUrl, self.dialogModel, function (response) {
                $('#lock').show();
                $('#dialog-window-position').html(response);
            });
        }
    },

    self.close = function () {
        self.isShown = false;
        $('#lock').hide();
        $('#dialog-window-position').empty();
    },

    self.setDialogAnswerNoHandler = function (handler) {
        $(document).on('click', '#dialog-answer-no', handler);
    },

    self.setDialogAnswerYesHandler = function (handler) {
        $(document).on('click', '#dialog-answer-yes', handler);
    }

}
