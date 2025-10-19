/**
 * IPVanish Configuration JavaScript
 * 
 * Handles client-side functionality for the IPVanish Configuration management including
 * form submissions, AJAX requests, and UI interactions.
 */

// Initialize datepicker for expiration field
$('#expiration').datepicker({
    autoclose: true
});

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Form submission handlers
$(function () {
    $('#expiration').datepicker({
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
    
    // Account form submission
    $("#post_account").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_account', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ipvanish_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting account:", error);
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
            url: "./includes/post_ipvanish_config.php",
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
            url: "./includes/post_ipvanish_config.php",
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
 * Deletes an account after confirmation
 * @param {number} id The ID of the account to delete
 */
function deleteAccount(id) {
    if (confirm("Are you sure you want to delete this account?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ipvanish_config.php",
            data: {
                delete_account: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting account:", error);
            }
        });
    }
}

/**
 * Deletes a service after confirmation
 * @param {number} id The ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ipvanish_config.php",
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
            url: "./includes/post_ipvanish_config.php",
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
            url: "./includes/post_ipvanish_config.php",
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
            url: "./includes/post_ipvanish_config.php",
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
 * Populates the account form with existing account data for editing
 * @param {string} username The account username
 * @param {string} password The account password
 */
function editAccount(username, password) {
    // Set form values
    $("#username").val(username);
    $("#password").val(password);

    // Update button text to indicate editing mode
    $('button[name="post_account"]').text('Update Account');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_account").offset().top - 100
    }, 500);
}

/**
 * Populates the service form with existing service data for editing
 * @param {string} name The service name
 * @param {string} url The service URL
 */
function editService(name, url) {
    // Set form values
    $("#name").val(name);
    $("#url").val(url);

    // Update button text to indicate editing mode
    $('button[name="post_service"]').text('Update Service');

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
 */
function editClient(username, password, expirey) {
    // Set form values
    $("#client_username").val(username);
    $("#client_password").val(password);
    $("#expiration").val(expirey);

    // Update button text to indicate editing mode
    $('button[name="post_client"]').text('Update Client');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
    }, 500);
}