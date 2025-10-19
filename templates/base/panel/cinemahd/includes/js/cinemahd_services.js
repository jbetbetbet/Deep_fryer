/**
 * CinemaHD Services JavaScript
 * 
 * Handles the client-side functionality for the CinemaHD Services & Clients page,
 * including modal management and CRUD operations for services and clients.
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
 * Delete a service after confirmation
 * 
 * @param {number} id - ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_services.php",
            data: {
                delete_service: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting service:', status, error);
            }
        });
    }
}

/**
 * Delete a client after confirmation
 * 
 * @param {number} id - ID of the client to delete
 */
function deleteClient(id) {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_services.php",
            data: {
                delete_client: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting client:', status, error);
            }
        });
    }
}

/**
 * Ban a client after confirmation
 * 
 * @param {number} id - ID of the client to ban
 */
function banClient(id) {
    if (confirm("Are you sure you want to ban this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_services.php",
            data: {
                ban_client: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error banning client:', status, error);
            }
        });
    }
}

/**
 * Unban a client after confirmation
 * 
 * @param {number} id - ID of the client to unban
 */
function unbanClient(id) {
    if (confirm("Are you sure you want to unban this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_services.php",
            data: {
                unban_client: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error unbanning client:', status, error);
            }
        });
    }
}

/**
 * Populate the service form with existing service data for editing
 * 
 * @param {string} name - The service name
 * @param {string} url - The service URL
 */
function editService(name, url) {
    $("#name").val(name);
    $("#url").val(url);
    $("#name").focus();

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populate the client form with existing client data for editing
 * 
 * @param {string} username - The client username
 * @param {string} password - The client password
 * @param {string} expirey - The client expiry date
 */
function editClient(username, password, expirey) {
    $("#username").val(username);
    $("#password").val(password);
    $("#expiration").val(expirey);
    $("#username").focus();

    // Update button text to indicate editing mode
    $('#post_client button[name="post_client"]').text('Update Client');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
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
    
    // Initialize datepicker
    $('#expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto'
    });

    /**
     * Service form submission handler
     */
    $("#post_service").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('post_service', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting service:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Client form submission handler
     */
    $("#post_client").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('post_client', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_cinemahd_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting client:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});