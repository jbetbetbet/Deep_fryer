/**
 * Smart STB+ Services JavaScript
 * 
 * Handles client-side functionality for the Smart STB+ Services management including
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
            url: "./includes/post_smartstb_services.php",
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
    if (confirm("Are you sure you want to delete this portal?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smartstb_services.php",
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
 * Populates the service form for adding to a specific slot
 * @param {number} service_id The slot ID to add to
 */
function addService(service_id) {
    // Clear form
    $("#service_name").val('');
    $("#service_url").val('');
    
    // Add hidden field for service ID
    if ($('#service_id_field').length === 0) {
        $("#post_service").append('<input type="hidden" id="service_id_field" name="service_id" value="">');
    }
    $('#service_id_field').val(service_id);

    $("#service_name").focus();
    $('button[name="post_service"]').text('Add Portal');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates the service form with existing service data for editing
 * @param {number} service_id The ID of the service
 * @param {string} serviceName The name of the service
 * @param {string} serviceUrl The URL of the service
 */
function editService(service_id, serviceName, serviceUrl) {
    // Set form values
    $("#service_name").val(serviceName);
    $("#service_url").val(serviceUrl);
    
    // Add hidden field for service ID
    if ($('#service_id_field').length === 0) {
        $("#post_service").append('<input type="hidden" id="service_id_field" name="service_id" value="">');
    }
    $('#service_id_field').val(service_id);

    $("#service_name").focus();

    // Update button text to indicate editing mode
    $('button[name="post_service"]').text('Update Portal');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Toggles the enabled status of a service
 * @param {number} service_id The ID of the service to toggle
 */
function toggleEnabled(service_id) {
    $.ajax({
        type: "POST",
        url: "./includes/post_smartstb_services.php",
        data: {
            toggle_enabled: 1,
            service_id: service_id,
            csrf_token: getCsrfToken()
        },
        success: function () {
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Error toggling service status:", error);
        }
    });
}

/**
 * Sets a service as the default portal
 * @param {number} service_id The ID of the service to set as default
 */
function setDefault(service_id) {
    if (confirm("Set this portal as the default?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smartstb_services.php",
            data: {
                set_default: 1,
                service_id: service_id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error setting default portal:", error);
            }
        });
    }
}