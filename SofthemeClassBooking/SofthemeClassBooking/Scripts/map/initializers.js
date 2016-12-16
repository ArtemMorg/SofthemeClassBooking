// Run javascript after DOM is initialized

$(document).ready(function () {

    loadSection(ajaxUrl.HomeMapLinkUrl, null, function (successResponse) {

            $('#map-section').mapit({
                latitude: 50.4290312,
                longitude: 30.5181806,
                zoom: 17,
                type: 'ROADMAP',
                scrollwheel: false,

                marker: {
                    latitude: 50.4290312,
                    longitude: 30.5181987,
                    icon: "/Content/images/marker_red.png",
                    title: 'Softheme',
                    open: false,
                    center: true
                },
                address: successResponse,

                styles: 'GRAYSCALE'
            });

        }, function(errorResponse) {
        $('#map-section').html(errorResponse.message);
    }, true);
        



    });



