/**
 * SmartTube Services JavaScript
 * 
 * Handles the client-side functionality for the SmartTube Services page,
 * including service/client management and settings.
 * 
 * @package Cockpit
 * @subpackage SmartTube
 */

// Global utility functions
/**
 * Retrieves the CSRF token from the page
 * 
 * @return {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Edits a service by populating the form with existing data
 * 
 * @param {string} name - Name of the service
 * @param {string} url - URL of the service
 */
function editService(name, url) {
    $("#name").val(name);
    $("#url").val(url);

    // Focus on the name field for better UX
    $("#name").focus();

    // Update button text
    $("#post_service button[type='submit']").text("Update Service");
}

/**
 * Deletes a service after confirmation
 * 
 * @param {number} id - ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarttube_services.php",
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
                alert("Error deleting service. Please try again.");
            }
        });
    }
}

/**
 * Edits a client by populating the form with existing data
 * 
 * @param {string} username - Client username
 * @param {string} password - Client password
 * @param {string} expirey - Expiration date
 */
function editClient(username, password, expirey) {
    $("#username").val(username);
    $("#password").val(password);
    $("#expiration").val(expirey);

    // Focus on the username field for better UX
    $("#username").focus();

    // Update button text
    $("#post_client button[type='submit']").text("Update Client");
}

/**
 * Deletes a client after confirmation
 * 
 * @param {number} id - ID of the client to delete
 */
function deleteClient(id) {
    if (confirm("Are you sure you want to delete this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarttube_services.php",
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
                alert("Error deleting client. Please try again.");
            }
        });
    }
}

/**
 * Bans a client after confirmation
 * 
 * @param {number} id - ID of the client to ban
 */
function banClient(id) {
    if (confirm("Are you sure you want to ban this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarttube_services.php",
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
                alert("Error banning client. Please try again.");
            }
        });
    }
}

/**
 * Unbans a client after confirmation
 * 
 * @param {number} id - ID of the client to unban
 */
function unbanClient(id) {
    if (confirm("Are you sure you want to unban this client?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarttube_services.php",
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
                alert("Error unbanning client. Please try again.");
            }
        });
    }
}

// Initialize components when document is ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Initialize datepicker with improved configuration
    $('#expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto',
        clearBtn: true
    });

    // Initialize bootstrap tables if present
    $('[data-toggle="table"]').bootstrapTable();

    // Service form submission handler
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
            url: "./includes/post_smarttube_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error saving service:", error);
                alert("Error saving service. Please check your inputs and try again.");
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Client form submission handler
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
            url: "./includes/post_smarttube_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error saving client:", error);
                alert("Error saving client. Please check your inputs and try again.");
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // API version change handler
    $('#api_version').on('change', function () {
        var version = $(this).val();

        $.ajax({
            type: 'POST',
            url: './includes/post_smarttube_services.php',
            data: {
                post_settings: 1,
                api_version: version,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error changing API version:", error);
                alert("Error changing API version. Please try again.");
            }
        });
    });
});