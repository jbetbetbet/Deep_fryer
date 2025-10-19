/**
 * FlixVision Services JavaScript
 * 
 * Handles client-side functionality for the FlixVision Services management including
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
    // Initialize date picker
    $('#client_expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto'
    });

    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

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
            url: "./includes/post_flixvision_services.php",
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
            url: "./includes/post_flixvision_services.php",
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
});

/**
 * Deletes a service after confirmation
 * @param {number} id The ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_flixvision_services.php",
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
            url: "./includes/post_flixvision_services.php",
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
            url: "./includes/post_flixvision_services.php",
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
            url: "./includes/post_flixvision_services.php",
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
 * Populates the client form with existing data for editing
 * @param {string} username The client username
 * @param {string} password The client password
 * @param {string} expirey The client expiration date
 */
function editClient(username, password, expirey) {
    // Set form values
    $("#client_username").val(username);
    $("#client_password").val(password);
    $("#client_expiration").val(expirey);

    // Update button text to indicate editing mode
    $('#post_client button[name="post_client"]').text('Update Client');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
    }, 500);
}

/**
 * Populates the service form with existing data for editing
 * @param {string} name The service name
 * @param {string} url The service URL
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