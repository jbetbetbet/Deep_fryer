/**
 * Smarters Pro Services JavaScript
 * 
 * Handles UI interactions for the Smarters Pro services management page,
 * including form submissions, toggle controls, and AJAX operations.
 * 
 * @package Cockpit
 * @subpackage SmartersPro
 * @author Ian O'Neill
 * @version see version.json
 */

/**
 * Get the CSRF token from the page
 * 
 * @returns {string} The CSRF token
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Initialize date pickers and form handlers when document is ready
 */
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
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
            url: "./includes/post_smarters_pro_services.php",
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

    // Handle all toggle switches with a common function
    const toggleHandlers = {
        'secret_code': 'post_secret_code',
        'windows_api': 'post_windows_api',
        'atbash_cipher': 'post_atbash_cipher',
        'alternate_aes': 'post_alternate_aes',
        'maintenancemode': 'post_maintenancemode',
        'welcomestatus': 'post_welcomestatus'
    };

    $.each(toggleHandlers, function (toggleId, postParam) {
        $('#' + toggleId).on('change', function () {
            const isChecked = $(this).prop('checked');

            // Special cases for value formatting
            let value;
            if (toggleId === 'maintenancemode' || toggleId === 'welcomestatus') {
                value = isChecked ? 'on' : 'off';
            } else {
                value = isChecked ? 'enabled' : 'disabled';
            }

            const data = {
                csrf_token: getCsrfToken()
            };
            data[postParam] = 1;
            data[toggleId] = value;

            $.ajax({
                type: 'POST',
                url: './includes/post_smarters_pro_services.php',
                data: data,
                success: function () {
                    location.reload();
                },
                error: function (xhr, status, error) {
                    console.error('Error updating setting:', status, error);
                }
            });
        });
    });
});

/**
 * Delete a service with confirmation
 * 
 * @param {number} service_id - The ID of the service to delete
 */
function deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_services.php",
            data: {
                delete_service: 1,
                service_id: service_id,
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
 * Populate the edit form with service data
 * 
 * @param {string} serviceName - The name of the service
 * @param {string} serviceUrl - The URL of the service
 */
function editService(serviceName, serviceUrl) {
    $("#name").val(serviceName);
    $("#url").val(serviceUrl);

    $("#name").focus();

    $("#post_service button[type='submit']").text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}