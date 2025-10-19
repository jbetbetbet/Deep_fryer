/**
 * NiO Player Services JavaScript
 * 
 * Handles client-side functionality for the NiO Player Services management including
 * service and activation code actions, AJAX requests, and UI interactions.
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

    // Handle login type dropdown change
    $('#login_type').on('change', function () {
        toggleLoginFields(this.value);
    });

    // Initialize form fields visibility based on default selection
    toggleLoginFields($('#login_type').val());

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
            url: "./includes/post_nio_services.php",
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

    // Activation code form submission
    $("#post_activecode").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_activecode', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_nio_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting activation code:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Import form submission
    $("#importForm").on("submit", function (e) {
        e.preventDefault();

        // Validate required fields
        const serviceId = $('#import_service_id').val();
        const serviceUrl = $('#import_service_url').val();
        const username = $('#usernameInput').val();
        const password = $('#passwordInput').val();

        if (!serviceId || !serviceUrl) {
            alert('Please select a service first');
            return;
        }

        if (!username || !password) {
            alert('Username and password are required');
            return;
        }

        // Call the new import function
        importServiceData(serviceId, serviceUrl, username, password);
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
            url: "./includes/post_nio_services.php",
            data: {
                delete_service: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            }
        });
    }
}

/**
 * Deletes an activation code after confirmation
 * @param {number} id The ID of the activation code to delete
 */
function deleteActivecode(id) {
    if (confirm("Are you sure you want to delete this activation code?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_nio_services.php",
            data: {
                delete_activecode: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            }
        });
    }
}

/**
 * Populates the service form with existing data for editing
 * @param {string} name The service name
 * @param {string} url The service URL
 */
function editService(name, url) {
    $("#name").val(name);
    $("#url").val(url);

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates the activation code form with existing data for editing
 * @param {string} code The activation code
 * @param {string} key The device key
 * @param {string} username The username
 * @param {string} password The password
 * @param {number} serviceId The service ID
 * @param {string} expiry The expiration date
 */
function editActivecode(code, username, password, serviceId) {
    $("#code").val(code);
    $("#username").val(username);
    $("#password").val(password);
    $("#service_id").val(serviceId);

    $('#post_activecode button[name="post_activecode"]').text('Update Client Code');

    $('html, body').animate({
        scrollTop: $("#post_activecode").offset().top - 100
    }, 500);
}