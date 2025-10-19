/**
 * iMPlayer TV Services JavaScript
 * 
 * Handles client-side functionality for the iMPlayer TV Services management including
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
    
    // App form submission
    $("#post_app").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_app', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_implayer_tv_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting app:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
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
            url: "./includes/post_implayer_tv_services.php",
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
            url: "./includes/post_implayer_tv_services.php",
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

    // XOR encoding checkbox handler
    $('#xor_encoding').on('change', function () {
        var isChecked = $(this).prop('checked');
        $.ajax({
            type: 'POST',
            url: './includes/post_implayer_tv_services.php',
            data: {
                post_settings: 1,
                xor_encoding: isChecked ? 'enabled' : 'disabled',
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error updating XOR encoding:", error);
            }
        });
    });

    // RSA/AES encoding checkbox handler
    $('#rsa_aes_encoding').on('change', function () {
        var isChecked = $(this).prop('checked');
        $.ajax({
            type: 'POST',
            url: './includes/post_implayer_tv_services.php',
            data: {
                post_settings: 1,
                rsa_aes_encoding: isChecked ? 'enabled' : 'disabled',
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error updating RSA/AES encoding:", error);
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
            url: "./includes/post_implayer_tv_services.php",
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
 * Deletes an app after confirmation
 * @param {number} id The ID of the app to delete
 */
function deleteApp(id) {
    if (confirm("Are you sure you want to delete this app?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_implayer_tv_services.php",
            data: {
                delete_app: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting app:", error);
            }
        });
    }
}

/**
 * Populates the service form with existing service data for editing
 * @param {string} serviceName The service name
 * @param {string} serviceUrl The service URL
 */
function editService(serviceName, serviceUrl) {
    // Set form values
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);

    // Update button text to indicate editing mode
    $('button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates the app form with existing app data for editing
 * @param {string} name The app name
 * @param {string} package_name The app package name
 */
function editApp(name, package_name) {
    // Set form values
    $("#app_name").val(name);
    $("#app_package_name").val(package_name);

    // Update button text to indicate editing mode
    $('button[name="post_app"]').text('Update App');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_app").offset().top - 100
    }, 500);
}
