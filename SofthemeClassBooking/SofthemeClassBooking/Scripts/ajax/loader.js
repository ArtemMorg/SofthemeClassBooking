/*

THIS IS BEST:

function getName(personid) {
    var dynamicData = {};
    dynamicData["id"] = personID;
    return $.ajax({
      url: "getName.php",
      type: "get",
      data: dynamicData
    });
  }

  getName("2342342").done(function(data) {
    // Updates the UI based the ajax result
    $(".person-name").text(data.name); 
  });


*/

function loadSection(url, beforeSendHandler, successHandler, errorHandler) {
    var result = {};

    return $.ajax({
        url: url,
        method: 'GET',
        cache: false,
        data: result,
        beforeSend: beforeSendHandler,
        error: errorHandler,

        success: function (result) {
            if (typeof (successHandler) === "function") {
                successHandler(result);
            }

        }
    });

}

function postFormData(url, form, datatype, successHandler, errorHandler) {

    $.ajax({
        url: url,
        method: 'POST',
        data: form.serialize(),
        dataType: datatype || 'json',

        success: function (response) {
            successHandler(response);
        },
        error: function(response) {
            errorHandler(response);
        }
    });

}

function postData(url, data, successHandler, errorHandler) {
    debugger;
    $.ajax({
        url: url,
        method: 'POST',
        data: data,

        success: successHandler,
        error: errorHandler
    });

}


var beforeSendHandler = function (dom) {
    dom.show();
}

var errorHandler = function () {
    alert('Произошла ошибка при загрузке плана этажа. Попробуйте позже');
}
