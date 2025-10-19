/**
 * IBO Solutions Services JavaScript
 * 
 * Handles client-side functionality for the IBO Solutions services management including
 * form submissions, AJAX requests, and UI interactions.
 * 
 * @package Cockpit
 * @subpackage IBOSolutions
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
            url: "./includes/post_ibosol_services.php",
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

    // Client form submission
    $("#post_client").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_client', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting client:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Active code form submission
    $("#post_active_code").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_active_code', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting active code:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // MAC address formatting
    $(document).on('keyup change', '#mac_address', function () {
        makeMacAddressFormat(this);
    });

    /**
     * Format MAC address input with colons
     * @param {HTMLElement} targetElement Input element to format
     */
    function makeMacAddressFormat(targetElement) {
        var macLength = $(targetElement).data('mac-length');

        if (!macLength || isNaN(macLength)) {
            macLength = 12;
        }

        var origin_value = $(targetElement).val().replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
        var formatted_value = '';
        for (var i = 0; i < origin_value.length; i++) {
            if (i > 0 && i % 2 === 0) {
                formatted_value += ':';
            }
            formatted_value += origin_value[i];
            if (formatted_value.length >= (macLength + (macLength / 2 - 1))) {
                break;
            }
        }
        $(targetElement).val(formatted_value);
    }
});

/**
 * Deletes a service after confirmation
 * @param {number} service_id The ID of the service to delete
 */
function deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?\n\n" +
        "Warning: Deleting a service will remove all users tied to this service. " +
        "It is encouraged to change the service of the users before removing the service from the panel.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
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
 * Deletes a client after confirmation
 * @param {number} id The ID of the client to delete
 */
function deleteClient(id) {
    if (confirm("Are you sure you want to delete this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: {
                delete_client: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting client:", error);
            }
        });
    }
}

/**
 * Bans a client after confirmation
 * @param {number} id The ID of the client to ban
 */
function banClient(id) {
    if (confirm("Are you sure you want to ban this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: {
                ban_client: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error banning client:", error);
            }
        });
    }
}

/**
 * Unbans a client after confirmation
 * @param {number} id The ID of the client to unban
 */
function unbanClient(id) {
    if (confirm("Are you sure you want to unban this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: {
                unban_client: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error unbanning client:", error);
            }
        });
    }
}

/**
 * Deletes an active code after confirmation
 * @param {number} id The ID of the active code to delete
 */
function deleteActiveCode(id) {
    if (confirm("Are you sure you want to delete this active code?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: {
                delete_active_code: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting active code:", error);
            }
        });
    }
}

/**
 * Deactivates an active code after confirmation
 * @param {number} id The ID of the active code to deactivate
 */
function deactivateActiveCode(id) {
    if (confirm("Are you sure you want to deactivate this active code?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: {
                deactivate_active_code: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deactivating active code:", error);
            }
        });
    }
}

/**
 * Activates an active code after confirmation
 * @param {number} id The ID of the active code to activate
 */
function activateActiveCode(id) {
    if (confirm("Are you sure you want to activate this active code?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_services.php",
            data: {
                activate_active_code: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error activating active code:", error);
            }
        });
    }
}

/**
 * Populates the active code form with existing data for editing
 * @param {string} code The activation code
 * @param {number} service_id The service ID
 * @param {string} username The username
 * @param {string} password The password
 * @param {string} status The status
 */
function editActiveCode(code, service_id, username, password, status) {
    $("#ac_code").val(code);
    $("#ac_service_id").val(service_id);
    $("#ac_username").val(username);
    $("#ac_password").val(password);
    $("#ac_status").val(status);

    // Update button text to indicate editing mode
    $('#post_active_code button[name="post_active_code"]').text('Update Active Code');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_active_code").offset().top - 100
    }, 500);
}

/**
 * Populates the service form with existing data for editing
 * @param {string} serviceName The name of the service
 * @param {string} serviceUrl The URL of the service
 */
function editService(serviceName, serviceUrl) {
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates the client form with existing data for editing
 * @param {string} mac_address The MAC address
 * @param {string} device_key The device key
 * @param {number} service_id The service ID
 * @param {string} username The username
 * @param {string} password The password
 * @param {string} parent_control The parental control setting
 * @param {string} status The status
 */
function editClient(mac_address, device_key, service_id, username, password, parent_control, status) {
    $("#mac_address").val(mac_address);
    $("#device_key").val(device_key);
    $("#service_id").val(service_id);
    $("#username").val(username);
    $("#password").val(password);
    $("#parent_control").val(parent_control);
    $("#status").val(status);

    // Update button text to indicate editing mode
    $('#post_client button[name="post_client"]').text('Update Client');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
    }, 500);
}