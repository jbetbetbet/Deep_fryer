/**
 * FCD Box Services JavaScript Functions
 * 
 * Handles client and service management for the FCD Box
 * configuration interface including adding, editing, and deleting operations.
 * 
 * @package Cockpit
 * @subpackage FCD
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
    // Initialize color picker

    $('#clientBackgroundColor').spectrum({
        preferredFormat: "hex",
        "showInput": true
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
            url: "./includes/post_fcd_services.php",
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
            url: "./includes/post_fcd_services.php",
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
            url: "./includes/post_fcd_services.php",
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
 * Deletes a client and all associated services after confirmation
 * @param {number} id The ID of the client to delete
 */
function deleteClient(id) {
    if (confirm("Are you sure you want to delete this Client Code, all services attached will also be removed?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_services.php",
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
 * Populates service form with existing data for editing
 * @param {string} client_id The client ID
 * @param {string} name The service name
 * @param {string} url The service URL
 */
function editService(client_id, name, url) {
    $("#serviceClient_id").val(client_id);
    $("#serviceName").val(name);
    $("#serviceUrl").val(url);

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates client form with existing data for editing
 * @param {string} name The client name
 * @param {string} code The client code
 * @param {string} currentTheme The current theme ID
 * @param {string} logo The logo URL
 * @param {string} backgroundColor The background color
 * @param {string} version The client version
 * @param {string} apk The APK URL
 * @param {string} host The host URL
 * @param {string} intro The intro video URL
 * @param {string} vpn_host The VPN host URL
 */
function editClient(name, code, currentTheme, logo, backgroundColor, version, apk, host, intro, vpn_host) {
    $("#clientName").val(name);
    $("#clientCode").val(code);
    $("#clientCurrentTheme").val(currentTheme);
    $("#clientLogo").val(logo);
    $("#clientBackgroundColor").spectrum("set", backgroundColor);
    $("#clientVersion").val(version);
    $("#clientApk").val(apk);
    $("#clientHost").val(host);
    $("#clientIntro").val(intro);
    $("#clientVpn").val(vpn_host);

    // Update button text to indicate editing mode
    $('#post_client button[name="post_client"]').text('Update Client');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_client").offset().top - 100
    }, 500);
}