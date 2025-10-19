/**
 * S9H Store Services JavaScript
 * 
 * Handles the client-side functionality for the S9H Store Services & Clients page,
 * including form submissions and CRUD operations for services and clients.
 * 
 * @package Cockpit
 * @subpackage S9HStore
 * @author Ian O'Neill
 * @version See version.json
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
 * Populate the service form with existing service data for editing
 * 
 * @param {string} name - The service name
 * @param {string} url - The service URL
 */
function editService(name, url) {
    $("#name").val(name);
    $("#url").val(url);
    $("#name").focus();

    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Delete a service after confirmation
 * 
 * @param {number} id - ID of the service to delete
 */
function deleteService(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid service ID:', id);
        return;
    }

    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_services.php",
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
 * Populate the client form with existing client data for editing
 * 
 * @param {string} username - The client username
 * @param {string} password - The client password
 * @param {string} expiry - The client expiration date
 */
function editClient(username, password, expiry) {
    $("#username").val(username);
    $("#password").val(password);
    $("#expiration").val(expiry);
    $("#username").focus();

    $('#post_client button[name="post_client"]').text('Update Client');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
    }, 500);
}

/**
 * Delete a client after confirmation
 * 
 * @param {number} id - ID of the client to delete
 */
function deleteClient(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid client ID:', id);
        return;
    }

    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_services.php",
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
    if (!id || isNaN(id)) {
        console.error('Invalid client ID:', id);
        return;
    }

    if (confirm("Are you sure you want to ban this client? They will not be able to access the service.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_services.php",
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
    if (!id || isNaN(id)) {
        console.error('Invalid client ID:', id);
        return;
    }

    if (confirm("Are you sure you want to unban this client? They will regain access to the service.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_services.php",
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

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    /**
     * Initialize datepicker with proper configuration
     */
    $('#expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto',
        clearBtn: true
    });

    /**
     * Service form submission handler
     */
    $("#post_service").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('post_service', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_services.php",
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

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_services.php",
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