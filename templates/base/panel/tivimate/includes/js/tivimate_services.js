/**
 * TiviMate Services JavaScript
 * 
 * Handles UI interactions for the TiviMate services management panel.
 * 
 * @package Cockpit
 * @subpackage TiviMate
 * @author Ian O'Neill
 * @version See version.json
 */

/**
 * Retrieves the CSRF token from the page
 * 
 * @return {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Initialize event handlers when document is ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Service form submission handler
    $("#post_service").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_service', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_tivimate_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Service submission error:", error);
                alert("Error saving service. Please check your inputs and try again.");
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Sport webview selector change handler
    $('#sport').on('change', function () {
        $.ajax({
            type: 'post',
            url: './includes/post_tivimate_services.php',
            data: {
                post_sport: 1,
                sport: $(this).val(),
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Sport setting update error:", error);
            }
        });
    });

    // API version selector change handler
    $('#api_version').on('change', function () {
        $.ajax({
            type: 'post',
            url: './includes/post_tivimate_services.php',
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

    // Form validation enhancement
    $("#url").on("blur", function () {
        var input = $(this);
        var url = input.val().trim();

        // Add http:// prefix if missing
        if (url && url.indexOf("://") === -1) {
            input.val("http://" + url);
        }
    });
});

/**
 * Deletes a service after confirmation
 * 
 * @param {number} service_id - ID of the service to delete
 */
function deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_tivimate_services.php",
            data: {
                delete_service: 1,
                service_id: service_id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Service deletion error:", error);
            }
        });
    }
}

/**
 * Populates the form with service data for editing
 * 
 * @param {string} serviceName - Name of the service
 * @param {string} serviceUrl - URL of the service
 * @param {string} serviceCode - Service code (optional)
 */
function editService(serviceName, serviceUrl, serviceCode) {
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);
    if (serviceCode) {
        $("#code").val(serviceCode);
    } else {
        $("#code").val(0);
    }
    $("name").focus();

    $("#post_service button[type='submit']").text("Update Service");

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}