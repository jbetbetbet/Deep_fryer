/**
 * StreamBox Services JavaScript
 * 
 * Handles the client-side functionality for the StreamBox Services page,
 * including service management, blacklist handling, and form interactions.
 * 
 * @package Cockpit
 * @subpackage StreamBox
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
 * @param {string} serviceName - Name of the service
 * @param {string} serviceUrl - URL of the service
 * @param {string} type - Type of the service
 */
function editService(serviceName, serviceUrl, type) {
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);
    $("#type").val(type);
    $("#name").focus();

    //update button text
    $("#post_service button[type='submit']").text("Update Service");

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Deletes a service after confirmation
 * 
 * @param {number} service_id - ID of the service to delete
 */
function deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_streambox_services.php",
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
                alert("Error deleting service. Please try again.");
            }
        });
    }
}

/**
 * Deletes a blacklist entry after confirmation
 * 
 * @param {number} id - ID of the blacklist entry to delete
 */
function deleteBlacklist(id) {
    if (confirm("Are you sure you want to remove this from the blacklist?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_streambox_services.php",
            data: {
                delete_blacklist: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting blacklist entry:", error);
                alert("Error removing entry from blacklist. Please try again.");
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
    
    // Initialize bootstrap tables if present
    if ($.fn.bootstrapTable) {
        $('[data-toggle="table"]').bootstrapTable();
    }

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
            url: "./includes/post_streambox_services.php",
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

    // Blacklist form submission handler
    $("#post_blacklist").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_blacklist', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_streambox_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error adding blacklist entry:", error);
                alert("Error adding to blacklist. Please check your input and try again.");
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});