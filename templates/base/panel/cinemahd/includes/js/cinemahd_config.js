/**
 * CinemaHD Configuration JavaScript
 * 
 * Handles the client-side functionality for the CinemaHD Configuration page,
 * including TMDB API keys, debrid providers, and application settings.
 * 
 * @package Cockpit
 * @subpackage CinemaHD
 */

/**
 * Get the CSRF token from the page
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Delete a TMDB API key after confirmation
 * 
 * @param {number} id - ID of the API key to delete
 */
function deleteKey(id) {
    if (confirm("Are you sure you want to delete this TMDB API key? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_config.php",
            data: {
                delete_api_key: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting API key:', status, error);
            }
        });
    }
}

/**
 * Delete a debrid provider after confirmation
 * 
 * @param {number} id - ID of the provider to delete
 */
function deleteProvider(id) {
    if (confirm("Are you sure you want to delete this debrid provider? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_config.php",
            data: {
                delete_provider: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting provider:', status, error);
            }
        });
    }
}

/**
 * Populate the provider form with existing provider data for editing
 * 
 * @param {string} provider - The provider name
 * @param {string} apikey - The provider API key
 */
function editProvider(provider, apikey) {
    $("#provider").val(provider);
    $("#apikey").val(apikey);
    $("#provider").focus();

    // Update button text to indicate editing mode
    $('#post_provider button[name="post_provider"]').text('Update Provider');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_provider").offset().top - 100
    }, 500);
}

// Initialize on document ready
$(function () {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    /**
     * TMDB API key form submission handler
     */
    $("#post_api_key").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('post_api_key', '1');
        formData.append('csrf_token', getCsrfToken());

        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting API key:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Debrid provider form submission handler
     */
    $("#post_provider").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('post_provider', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting provider:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Settings form submission handler
     */
    $("#post_settings").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('post_settings', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting settings:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});