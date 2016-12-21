var profileSection;

var profileEventCountByUser;

var profileOldPassword;
var profileNewPassword;
var profileConfirmNewPassword;
var profileChangePasswordForm;
var profileSubmitChangePassword;

var profileIsprofileOldPasswordValid;
var profileIsNewPasswordValid;
var profileIsNewPasswordConfirmValid;

var profileButtonOkCssClass;
var profileButtonRefuseCssClass;

var profileUserName;
var profileEmail;
var profileChangeNameButton;
var profileIsUserNameValid;
var profileIsEmailValid;

var userEvents;

function profileSectionInit(url) {

    profileSection = $('.user-profile');

    profileEventCountByUser = $('#user-event-count');

    profileOldPassword = $('#oldPassword');
    profileNewPassword = $('#newPassword');
    profileConfirmNewPassword = $('#confirmNewPassword');
    profileChangePasswordForm = $('#Login');
    profileSubmitChangePassword = $('#mysubmit');

    profileButtonOkCssClass = 'button-OK';
    profileButtonRefuseCssClass = 'button-refuse';

    profileSection.off();

    $(document).off('keyup', `#${profileOldPassword.attr('id')}`);
    $(document).on('keyup', `#${profileOldPassword.attr('id')}`, function () {
        profileIsprofileOldPasswordValid = profileOldPassword.valid();
        checkFormCorrectness();
    });

    $(document).off('keyup', `#${profileNewPassword.attr('id')}`);
    $(document).on('keyup', `#${profileNewPassword.attr('id')}`, function () {
        profileIsNewPasswordValid = profileNewPassword.valid();
        checkFormCorrectness();
    });

    $(document).off('keyup', `#${profileConfirmNewPassword.attr('id')}`);
    $(document).on('keyup', `#${profileConfirmNewPassword.attr('id')}`, function () {
        profileIsNewPasswordConfirmValid = profileConfirmNewPassword.valid();
        checkFormCorrectness();
    });

    profileSection.on('click', `#${profileSubmitChangePassword.attr('id')}`, function (e) {
        e.preventDefault();

        if (profileChangePasswordForm.valid()) {
            profileChangePasswordForm.submit();
        }

    });

    profileSection.on('click', '#change', function (e) {
        e.preventDefault();

        $.ajax({
            url: url,
            method: 'POST',
            success: function (result) {
                $('#user-info').html(result);

                $("form").each(function () { $.data($(this)[0], 'validator', false); });
                $.validator.unobtrusive.parse("form");
            }
        });

    });
}


function checkFormCorrectness() {

    if (profileIsprofileOldPasswordValid &&
        profileIsNewPasswordValid &&
        profileIsNewPasswordConfirmValid) {

        profileSubmitChangePassword.addClass(profileButtonOkCssClass);
        profileSubmitChangePassword.removeClass(profileButtonRefuseCssClass);

    } else {
        profileSubmitChangePassword.addClass(profileButtonRefuseCssClass);
        profileSubmitChangePassword.removeClass(profileButtonOkCssClass);
    }

}

function checkFormChangeCorrectness() {

    if (profileIsUserNameValid && profileIsEmailValid) {

        profileChangeNameButton.addClass(profileButtonOkCssClass);
        profileChangeNameButton.removeClass(profileButtonRefuseCssClass);

    } else {
        profileChangeNameButton.addClass(profileButtonRefuseCssClass);
        profileChangeNameButton.removeClass(profileButtonOkCssClass);

    }
}


function profileSectionChangeEmailInit() {

    profileUserName = $("#UserName");
    profileEmail = $("#Email");
    profileChangeNameButton = $("#changeName");

    profileIsUserNameValid = profileUserName.valid();
    profileIsEmailValid = profileEmail.valid();
    checkFormChangeCorrectness();

    profileSection.on('keyup', `#${profileUserName.attr('id')}`, function () {
        profileIsUserNameValid = profileUserName.valid();
        console.log(profileUserName.val());
        checkFormChangeCorrectness();
    });

    profileSection.on('keyup', `#${profileEmail.attr('id')}`, function () {
        profileIsEmailValid = profileEmail.valid();
        checkFormChangeCorrectness();
    });
}

function getUserEvents() {

    postData(ajaxUrl.EventUsersUrl, '', function (events) {
            userEvents = JSON.parse(events);
            profileEventCountByUser.html(userEvents.length);
    })

}