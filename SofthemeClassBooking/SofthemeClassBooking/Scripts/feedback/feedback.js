var feedbackIsEmailValid;
var feedbackIsFirstNameValid;
var feedbackIsLastNameValid;
var feedbackIsMessageValid;

var feedbackSection = $('#feedback-section');
var feedbackSubmitButton = $('#submit');
var feedbackForm = $('#feedback-form');
var feedbackStatusMessage = $('#result-message');

var feedbackFirstName = $('#firstName');
var feedbackLastName = $('#lastName');
var feedbackEmail = $('#email');
var feedbackMessage = $('#message');

var feedbackButtonOkCssClass = 'feedback-form-button-submit-ok';
var feedbackButtonRegularCssClass = 'feedback-form-button-submit';
var feedbackErrorMessage;

feedbackSection.on('keyup', `#${feedbackFirstName.attr('id')}`, function () {
    feedbackIsFirstNameValid = feedbackFirstName.valid();
    checkFormCorrectness();
});

feedbackSection.on('keyup', `#${feedbackLastName.attr('id')}`, function () {
    feedbackIsLastNameValid = feedbackLastName.valid();
    checkFormCorrectness();
});

feedbackSection.on('keyup', `#${feedbackEmail.attr('id')}`, function () {
    feedbackIsEmailValid = feedbackEmail.valid();
    checkFormCorrectness();
});

feedbackSection.on('keyup', `#${feedbackMessage.attr('id')}`, function () {
    feedbackIsMessageValid = feedbackMessage.valid();
    checkFormCorrectness();
});

feedbackSection.on('click', `#${feedbackSubmitButton.attr('id')}`, function (e) {
    e.preventDefault();
    if (feedbackForm.valid()) {
        postFormData(ajaxUrl.FeedbackSendUrl, feedbackForm, defaultAjaxDataType, function (successResponse) {

            feedbackStatusMessage.html(successResponse.message);
            feedbackForm.trigger('reset');
            feedbackSubmitButton.toggleClass(`${feedbackButtonOkCssClass} ${feedbackButtonRegularCssClass}`);

        }, function() {
            feedbackStatusMessage.html(feedbackErrorMessage);
        });
    }
});


function checkFormCorrectness() {

    if (feedbackIsEmailValid &&
        feedbackIsFirstNameValid &&
        feedbackIsLastNameValid &&
        feedbackIsMessageValid) {

        feedbackSubmitButton.addClass(feedbackButtonOkCssClass);
        feedbackSubmitButton.removeClass(feedbackButtonRegularCssClass);

    } else {
        feedbackSubmitButton.addClass(feedbackButtonRegularCssClass);
        feedbackSubmitButton.removeClass(feedbackButtonOkCssClass);
    }
}