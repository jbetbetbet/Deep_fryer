/**
 * SparkleTV Services JavaScript
 * 
 * Handles the client-side functionality for the SparkleTV Services page,
 * including service management and settings.
 * 
 * @package Cockpit
 * @subpackage SparkleTV
 * @author Ian O'Neill
 * @version see version.json
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
 */
function editService(serviceName, serviceUrl) {
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);
    $("#name").focus();

    // Update button text
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
            url: "./includes/post_sparkle_tv_services.php",
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

// Initialize components when document is ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Initialize select picker for multiple league selection
    if ($('#sidebar_leagues').length) {
        $('#sidebar_leagues').picker({
            search: true,
            texts: {
                trigger: "Select leagues",
                search: "Search leagues...",
                noResult: "No leagues found"
            }
        });
    }

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
            url: "./includes/post_sparkle_tv_services.php",
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

    // API version change handler
    $('#api_version').on('change', function () {
        var version = $(this).val();

        $.ajax({
            type: 'POST',
            url: './includes/post_sparkle_tv_services.php',
            data: {
                post_api_version: 1,
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

        // Toggle visibility of version-specific fields
        if (version === 'rtx192') {
            $(".rtx192-field").show();
            $(".rtx195-field, .rtx195x-field, .rtx201-field, .ah201-field").hide();
        } else if (version === 'rtx195') {
            $(".rtx195-field").show();
            $(".rtx192-field, .rtx195x-field, .rtx201-field, .ah201-field").hide();
        } else if (version === 'rtx195x') {
            $(".rtx195x-field").show();
            $(".rtx192-field, .rtx195-field, .rtx201-field, .ah201-field").hide();
        } else if (version === 'rtx201') {
            $(".rtx201-field").show();
            $(".rtx192-field, .rtx195-field, .rtx195x-field, .ah201-field").hide();
        } else if (version === 'ah201') {
            $(".ah201-field").show();
            $(".rtx192-field, .rtx195-field, .rtx195x-field, .rtx201-field").hide();
        }
    });
});