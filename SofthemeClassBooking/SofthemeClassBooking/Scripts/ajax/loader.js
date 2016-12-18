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

function loadSection(url, beforeSendHandler, successHandler, errorHandler, isCache) {
    var response = {};

    return $.ajax({
        url: url,
        method: 'GET',
        cache: isCache || false,
        data: response,
        beforeSend: beforeSendHandler,
        error: function (errorResponse) {
            if (typeof (errorHandler) === "function") {
                errorHandler(errorResponse);
            }
        },

        success: function (successResponse) {
            if (typeof (successHandler) === "function") {
                successHandler(successResponse);
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

    $.ajax({
        url: url,
        method: 'POST',
        data: data,

        success: successHandler,
        error: errorHandler
    });

}