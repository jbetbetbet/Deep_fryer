/**
 * Legazy Services JavaScript
 * 
 * Handles client-side functionality for the Legazy Services management including
 * form submissions, AJAX requests, and UI interactions.
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Form submission handlers
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Service form submission
    $("#post_service").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_service', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_legazy_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting service:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a service after confirmation
 * @param {number} service_id The ID of the service to delete
 */
function deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_legazy_services.php",
            data: {
                delete_service: 1,
                service_id: service_id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting service:", error);
            }
        });
    }
}

/**
 * Populates the service form with existing service data for editing
 * @param {string} serviceCode The service code
 * @param {string} serviceUrl The service URL
 * @param {string} message The service message
 * @param {string} backgroundUrl The background URL
 * @param {string} logoUrl The logo URL
 */
function editService(serviceCode, serviceUrl, message, backgroundUrl, logoUrl) {
    // Set form values
    $("#service_code").val(serviceCode);
    $("#service_url").val(serviceUrl);
    $("#message").val(message);
    $("#background_url").val(backgroundUrl);
    $("#logo_url").val(logoUrl);

    // Update button text to indicate editing mode
    $('button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}