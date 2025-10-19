/**
 * FlixVision Configuration JavaScript
 * 
 * Handles client-side functionality for the FlixVision Configuration management including
 * form submissions, AJAX requests, and UI interactions.
 * 
 * @package Cockpit
 * @subpackage FlixVision
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
    
    // Settings form submission
    $("#post_settings").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_settings', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_flixvision_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting settings:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Provider form submission
    $("#post_provider").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_provider', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_flixvision_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting provider:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a provider after confirmation
 * @param {number} id The ID of the provider to delete
 */
function deleteProvider(id) {
    if (confirm("Are you sure you want to delete this provider?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_flixvision_config.php",
            data: {
                delete_provider: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting provider:", error);
            }
        });
    }
}

/**
 * Populates the provider form with existing data for editing
 * @param {string} provider The provider name
 * @param {string} apikey The API key
 */
function editProvider(provider, apikey) {
    // Set form values
    $("#provider").val(provider);
    $("#apikey").val(apikey);

    // Update button text to indicate editing mode
    $('#post_provider button[name="post_provider"]').text('Update Provider');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_provider").offset().top - 100
    }, 500);
}