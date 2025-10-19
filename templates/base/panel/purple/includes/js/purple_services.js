/**
 * Purple Player Services JavaScript
 * 
 * Handles form interactions and CRUD operations for Purple Player services management
 * including adding, updating, and deleting service configurations.
 * 
 * @package Cockpit
 * @subpackage Purple
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
 * @param {string} serviceName - The service name
 * @param {string} serviceUrl - The service URL
 */
function editService(serviceName, serviceUrl) {
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);
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
 * @param {number} serviceId - ID of the service to delete
 */
function deleteService(serviceId) {
    if (!serviceId || isNaN(serviceId)) {
        console.error('Invalid service ID:', serviceId);
        return;
    }

    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_services.php",
            data: {
                delete_service: 1,
                service_id: serviceId,
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

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
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
            url: "./includes/post_purple_services.php",
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
     * Keyboard shortcuts for common actions
     */
    $(document).on('keydown', function (e) {
        // Ctrl+S to save current form
        if (e.ctrlKey && e.which === 83) {
            e.preventDefault();
            const activeForm = $('form:visible').first();
            if (activeForm.length) {
                activeForm.submit();
            }
        }

        // Escape to clear forms
        if (e.which === 27) {
            $('form').each(function () {
                this.reset();
            });
        }
    });
});