function DialogWindow(dialogParameters) {
    var self = this;
    self.isShown = false;
    self.dialogModel = {
        BodyMessage: dialogParameters.bodyMessage,
        Title: dialogParameters.title,
        IsError: dialogParameters.isError || false
    },

    self.show = function () {

        if (self.dialogModel.IsError) {
            $(document).off('click', '#dialog-answer-ok');
            $(document).on('click', '#dialog-answer-ok', self.close);
        }
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
        $(document).off('click', '#dialog-answer-no');
        $(document).on('click', '#dialog-answer-no', handler);
    },

    self.setDialogAnswerYesHandler = function (handler) {
        $(document).off('click', '#dialog-answer-yes');
        $(document).on('click', '#dialog-answer-yes', handler);
    }

}

var eventPageDialogWindowError = new DialogWindow({
    title: 'Error',
    bodyMessage: "Error was ocured. Try again later.",
    isError: true
});