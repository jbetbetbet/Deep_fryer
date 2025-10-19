/**
 * Easy Player Services JavaScript
 * 
 * Handles client-side functionality for the Easy Player Services management including
 * form submissions, AJAX requests, and UI interactions.
 * 
 * @package Cockpit
 * @subpackage Easy
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Form submission handlers and initialization
$(function () {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

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
            url: "./includes/post_easy_services.php",
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

    // Code form submission
    $("#post_code").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_code', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_easy_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting code:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a service after confirmation
 * @param {number} id The ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_easy_services.php",
            data: {
                delete_service: 1,
                id: id,
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
 * Deletes a code after confirmation
 * @param {number} id The ID of the code to delete
 */
function deleteCode(id) {
    if (confirm("Are you sure you want to delete this code? Doing so will also delete services using this code.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_easy_services.php",
            data: {
                delete_code: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting code:", error);
            }
        });
    }
}

/**
 * Populates the service form with existing data for editing
 * @param {string|number} code The code ID of the service
 * @param {string} url The URL of the service
 * @param {string} name The name of the service
 */
function editService(code, url, name) {
    $("#code").val(code || 'no');
    $("#url").val(url);
    $("#name").val(name);

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}