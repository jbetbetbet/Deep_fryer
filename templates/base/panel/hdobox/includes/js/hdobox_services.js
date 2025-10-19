/**
 * HDO BOX Services JavaScript
 * 
 * Handles client-side functionality for the HDO BOX Services management including
 * service and client actions, form submissions, AJAX requests, and UI interactions.
 * 
 * @package Cockpit
 * @subpackage HDOBOX
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
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // Initialize date picker for client expiration
    $('#client_expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto'
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
            url: "./includes/post_hdobox_services.php",
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
            url: "./includes/post_hdobox_services.php",
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

    // API version selector change handler
    $('#api_version').on('change', function () {
        $.ajax({
            type: 'post',
            url: './includes/post_hdobox_services.php',
            data: {
                post_api_version: 1,
                api_version: $(this).val(),
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("API version update error:", error);
            }
        });
    });
});

// Handle API version change
$(function () {
    // Initialize based on current API version
    toggleMacAddressFields();

    // Listen for API version changes
    $('#api_version').on('change', function () {
        toggleMacAddressFields();
    });
});

function toggleMacAddressFields() {
    const apiVersion = $('#api_version').val();
    const macFields = $('.mac-address-field');
    const macColumns = $('.mac-address-column');

    if (apiVersion === 'amdi7plus') {
        macFields.show();
        macColumns.show();
        $('#client_mac_address').attr('required', true);
    } else {
        macFields.hide();
        macColumns.hide();
        $('#client_mac_address').attr('required', false);
        $('#client_mac_address').val(''); // Clear the field
    }
}

// Auto-format MAC address as user types
$(document).on('input', '#client_mac_address', function () {
    let value = $(this).val().replace(/[^0-9A-Fa-f]/g, '');
    let formatted = '';

    for (let i = 0; i < value.length && i < 12; i++) {
        if (i > 0 && i % 2 === 0) {
            formatted += ':';
        }
        formatted += value[i];
    }

    $(this).val(formatted.toUpperCase());
});

/**
 * Deletes a service after confirmation
 * @param {number} id The ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_hdobox_services.php",
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
 * Deletes a client after confirmation
 * @param {number} id The ID of the client to delete
 */
function deleteClient(id) {
    if (confirm("Are you sure you want to delete this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_hdobox_services.php",
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
            url: "./includes/post_hdobox_services.php",
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
            url: "./includes/post_hdobox_services.php",
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
 * Populates the service form with existing service data for editing
 * @param {string} name The name of the service
 * @param {string} url The URL of the service
 */
function editService(name, url) {
    // Set form values
    $("#service_name").val(name);
    $("#service_url").val(url);

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates the client form with existing client data for editing
 * @param {string} username The client username
 * @param {string} password The client password
 * @param {string} expirey The client expiration date
 * @param {string} macAddress The client MAC address
 */
function editClient(username, password, expiry, macAddress = '') {
    $('#client_username').val(username);
    $('#client_password').val(password);
    $('#client_expiration').val(expiry);
    $('#client_mac_address').val(macAddress);

    // Scroll to form
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
    }, 500);
}