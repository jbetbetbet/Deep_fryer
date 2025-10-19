/**
 * Weyd Settings JavaScript
 * 
 * Handles client-side functionality for Weyd settings management including
 * admin settings, device defaults, and service management.
 * 
 * @package Cockpit
 * @subpackage Weyd
 * @author Ian O'Neill
 * @version See version.json
 */

/**
 * Retrieves the CSRF token from the page
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Form submission handlers
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // Admin settings form submission
    $("#admin_settings").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('save_admin', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to save admin settings'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error saving admin settings:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });
                submitBtn.prop('disabled', false).text(originalText);

                if (xhr.status === 429) {
                    alert('Rate limit exceeded. Please wait before submitting again.');
                } else if (xhr.status >= 500) {
                    alert('Server error occurred. Please try again later.');
                } else {
                    alert('An error occurred saving admin settings. Please check your input and try again.');
                }
            }
        });
    });

    // Device defaults form submission
    $("#device_settings").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('save_device', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to save device settings'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error saving device settings:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });
                submitBtn.prop('disabled', false).text(originalText);

                if (xhr.status === 429) {
                    alert('Rate limit exceeded. Please wait before submitting again.');
                } else if (xhr.status >= 500) {
                    alert('Server error occurred. Please try again later.');
                } else {
                    alert('An error occurred saving device settings. Please check your input and try again.');
                }
            }
        });
    });

    // Advanced device settings form submission handler
    $('button[form="advanced_device_settings"]').on("click", function (e) {
        e.preventDefault();

        const actionType = $(this).attr('name');
        const submitBtn = $(this);
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        var formData = new FormData();
        formData.append('csrf_token', getCsrfToken());
        formData.append(actionType, '1');

        const advancedFields = [
            'filter_min_filesize', 'filter_hide_non_debrid', 'filter_hide_unsupported_direct_links',
            'resolve_sort_by1', 'resolve_sort_direction1', 'resolve_sort_by2', 'resolve_sort_direction2',
            'resolve_auto_select', 'resolve_max_link', 'resolve_search_alternate',
            'resolve_auto_select_delay', 'resolve_max_delay',
            'playback_exo_sw_codec', 'playback_exo_sw_prefer'
        ];

        const basicFields = ['scraper_url', 'filter_min_bitrate', 'filter_max_bitrate', 'filter_hide_phrases'];

        // Collect all field values
        [...advancedFields, ...basicFields].forEach(fieldName => {
            const field = $(`[name="${fieldName}"]`);
            if (field.length) {
                if (field.attr('type') === 'checkbox') {
                    formData.append(fieldName, field.is(':checked') ? '1' : '0');
                } else {
                    formData.append(fieldName, field.val() || '');
                }
            }
        });

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to save advanced device settings'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error saving advanced device settings:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    $("#post_token_service").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_token_service', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to save token service'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting token service:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // API service form submission
    $("#post_api_service").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_api_service', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to save API service'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting API service:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Edit token service form submission
    $("#edit_token_service").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('edit_token_service', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Updating...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to update token service'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating token service:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Edit API service form submission
    $("#edit_api_service").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('edit_api_service', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Updating...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to complete operation'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating API service:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a token service after confirmation
 * 
 * @param {number} serviceId The ID of the service to delete
 */
function deleteTokenService(serviceId) {
    if (confirm("Are you sure you want to delete this token service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: {
                delete_token_service: 1,
                service_id: serviceId,
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to delete token service'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error deleting token service:", error);
            }
        });
    }
}

/**
 * Deletes an API service after confirmation
 * 
 * @param {number} serviceId The ID of the service to delete
 */
function deleteApiService(serviceId) {
    if (confirm("Are you sure you want to delete this API service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: {
                delete_api_service: 1,
                service_id: serviceId,
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to complete operation'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error deleting API service:", error);
            }
        });
    }
}

/**
 * Makes a token service the default
 * 
 * @param {number} serviceId The ID of the service to make default
 */
function makeDefaultTokenService(serviceId) {
    if (confirm("Are you sure you want to make this the default token service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: {
                make_default_token_service: 1,
                service_id: serviceId,
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to complete operation'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error setting default token service:", error);
            }
        });
    }
}

/**
 * Makes an API service the default
 * 
 * @param {number} serviceId The ID of the service to make default
 */
function makeDefaultApiService(serviceId) {
    if (confirm("Are you sure you want to make this the default API service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_settings.php",
            data: {
                make_default_api_service: 1,
                service_id: serviceId,
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                try {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    if (response && (response.success || response.status === 'success')) {
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to complete operation'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error setting default API service:", error);
            }
        });
    }
}

/**
 * Populates the token service form with existing data for editing
 * 
 * @param {number} serviceId The ID of the service
 * @param {string} name The name of the service
 * @param {string} type The type of the service
 */
function editTokenService(serviceId, name, type) {
    if ($('#token_service_id').length === 0) {
        $('#post_token_service').append('<input type="hidden" id="token_service_id" name="service_id" value="">');
    }

    $('#token_service_id').val(serviceId);
    $('#token_name').val(name);
    $('#token_type').val(type);

    $('#post_token_service').attr('id', 'edit_token_service');
    $('#edit_token_service button[type="submit"]').text('Update Service');
    $('#cancel_token_btn').show();

    $('html, body').animate({
        scrollTop: $('#edit_token_service').offset().top - 100
    }, 500);
}

/**
 * Populates the API service form with existing data for editing
 * 
 * @param {number} serviceId The ID of the service
 * @param {string} name The name of the service
 * @param {string} type The type of the service
 * @param {string} apiKey The API key (masked)
 */
function editApiService(serviceId, name, type, apiKey) {
    $('#api_service_id').val(serviceId);
    $('#api_name').val(name);
    $('#api_type').val(type);
    $('#api_key').val(apiKey);
    $('#api_key').removeAttr('required');
    $('#api_key').attr('placeholder', 'Leave empty to keep current API key');

    $('#post_api_service').attr('id', 'edit_api_service');
    $('#edit_api_service button[type="submit"]').text('Update Service');
    $('#cancel_api_btn').show();

    $('html, body').animate({
        scrollTop: $('#edit_api_service').offset().top - 100
    }, 500);
}

/**
 * Resets the token service form back to add mode
 */
function resetTokenServiceForm() {
    $('#edit_token_service').attr('id', 'post_token_service');
    $('#post_token_service button[type="submit"]').text('Add Debrid Service');
    $('#token_service_id').remove();
    $('#token_name').val('');
    $('#token_type').val('Premiumize');
    $('#cancel_token_btn').hide();
}

/**
 * Resets the API service form back to add mode
 */
function resetApiServiceForm() {
    $('#edit_api_service').attr('id', 'post_api_service');
    $('#post_api_service button[type="submit"]').text('Add API Service');
    $('#api_service_id').val('');
    $('#api_name').val('');
    $('#api_type').val('EasyDebrid');
    $('#api_key').val('').attr('required', true).attr('placeholder', 'Enter API key');
    $('#cancel_api_btn').hide();
}

/**
 * Shows a toast notification
 * @param {string} message The message to display
 * @param {string} type The type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
    const toastHtml = `
        <div class="toast fade show mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
            <div class="toast-header">
                <i class="${type === 'success' ? 'fas fa-check-circle text-success' : (type === 'error' ? 'fas fa-exclamation-circle text-danger' : 'fas fa-info-circle text-info')} me-2"></i>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    // Add to toasts container
    const container = $('.toasts-container');
    if (container.length) {
        container.append(toastHtml);
        const newToast = new bootstrap.Toast(container.find('.toast').last()[0]);
        newToast.show();
    }
}

/**
 * Configure OAuth token service
 * 
 * @param {number} serviceId The ID of the service to configure
 */
function configureTokenService(serviceId) {
    $.ajax({
        type: "POST",
        url: "./includes/post_weyd_settings.php",
        data: {
            get_token_service: 1,
            service_id: serviceId,
            csrf_token: getCsrfToken()
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const service = response.service;
                WeydOAuth.startOAuth(service.type, null, null, service.name);
            } else {
                console.error("Error getting service details:", response.message);
                alert("Error: " + (response.message || "Could not retrieve service details"));
            }
        },
        error: function (xhr, status, error) {
            console.error("Error configuring token service:", error);
            alert("Error configuring service: " + error);
        }
    });
}

/**
 * Initialize timezone dropdown with current system timezone
 */
$(function () {
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneSelect = $('#timezone');

    if (timezoneSelect.val() === '' && systemTimezone) {
        timezoneSelect.val(systemTimezone);
    }
});