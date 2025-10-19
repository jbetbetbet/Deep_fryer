/**
 * Purple Neu Services JavaScript
 * 
 * Handles client-side functionality for the Purple Neu Services management including
 * service and activation code actions, AJAX requests, and UI interactions.
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
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Initialize date picker
    $('#expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto'
    });

    // Handle login type dropdown change
    $('#login_type').on('change', function () {
        toggleLoginFields(this.value);
    });

    // Initialize form fields visibility based on default selection
    toggleLoginFields($('#login_type').val());

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
            url: "./includes/post_neu_services.php",
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

    // Activation code form submission
    $("#post_activecode").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_activecode', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_services.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting activation code:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Import form submission
    $("#importForm").on("submit", function (e) {
        e.preventDefault();

        // Validate required fields
        const serviceId = $('#import_service_id').val();
        const serviceUrl = $('#import_service_url').val();
        const username = $('#usernameInput').val();
        const password = $('#passwordInput').val();

        if (!serviceId || !serviceUrl) {
            alert('Please select a service first');
            return;
        }

        if (!username || !password) {
            alert('Username and password are required');
            return;
        }

        // Call the new import function
        importServiceData(serviceId, serviceUrl, username, password);
    });
});

/**
 * Toggle form fields based on login type selection
 * @param {string} loginType The selected login type (xc_login or active_code)
 */
function toggleLoginFields(loginType) {
    const codeField = $('#code').closest('.form-group');
    const keyField = $('#key').closest('.form-group');
    const usernameField = $('#username').closest('.form-group');
    const passwordField = $('#password').closest('.form-group');
    const expirationField = $('#expiration').closest('.form-group');

    if (loginType === 'active_code') {
        // Show Active Code fields
        codeField.show();
        keyField.show();
        // Show Username/Password fields
        usernameField.show();
        passwordField.show();
        expirationField.show();
    } else if (loginType === 'xc_login') {
        // Hide Active Code fields
        codeField.show();
        keyField.hide();
        // Hide Username/Password fields
        usernameField.hide();
        passwordField.hide();
        expirationField.hide();
        // Clear hidden fields
        $('#key').val('');
        $('#username').val('');
        $('#password').val('');
        $('#expiration').val('');
    }
}

/**
 * Opens import modal and sets service data
 * @param {number} serviceId The ID of the service to import
 * @param {string} serviceUrl The URL of the service to import
 */
function importService(serviceId, serviceUrl) {
    $('#import_service_id').val(serviceId);
    $('#import_service_url').val(serviceUrl);
    $('#importModal').modal('show');
}

/**
 * Deletes a service after confirmation
 * @param {number} id The ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_services.php",
            data: {
                delete_service: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            }
        });
    }
}

/**
 * Deletes an activation code after confirmation
 * @param {number} id The ID of the activation code to delete
 */
function deleteActivecode(id) {
    if (confirm("Are you sure you want to delete this activation code?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_services.php",
            data: {
                delete_activecode: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            }
        });
    }
}

/**
 * Populates the service form with existing data for editing
 * @param {string} name The service name
 * @param {string} url The service URL
 */
function editService(name, url) {
    $("#name").val(name);
    $("#url").val(url);

    // Update button text to indicate editing mode
    $('#post_service button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}

/**
 * Populates the activation code form with existing data for editing
 * @param {string} code The activation code
 * @param {string} key The device key
 * @param {string} username The username
 * @param {string} password The password
 * @param {number} serviceId The service ID
 * @param {string} expiry The expiration date
 */
function editActivecode(code, key, username, password, serviceId, expiry) {
    $("#code").val(code);
    $("#key").val(key);
    $("#username").val(username);
    $("#password").val(password);
    $("#service_id").val(serviceId);
    $("#expiration").val(expiry);

    // Set the appropriate login type based on what data we have
    if (code && key) {
        $('#login_type').val('active_code');
    } else if (username && password) {
        $('#login_type').val('xc_login');
    }

    $('#post_activecode button[name="post_activecode"]').text('Update Client Code');

    $('html, body').animate({
        scrollTop: $("#post_activecode").offset().top - 100
    }, 500);

    // Trigger the change event to show/hide appropriate fields
    $('#login_type').trigger('change');
}

/**
 * Import service data using client-side JavaScript
 * @param {number} serviceId The ID of the service to import
 * @param {string} serviceUrl The URL of the service to import
 * @param {string} username The username for authentication  
 * @param {string} password The password for authentication
 */
function importServiceData(serviceId, serviceUrl, username, password) {
    // Show loading indicator
    const modal = $('#importModal');
    const submitBtn = modal.find('button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.text('Importing...').prop('disabled', true);

    // Ensure URL ends with slash
    const baseUrl = serviceUrl.replace(/\/$/, '') + '/';

    // Initialize result object
    const serviceData = {
        live_categories: [],
        vod_categories: [],
        live_streams: [],
        vod_streams: [],
        series: []
    };

    // Track completed requests
    let completedRequests = 0;
    const totalRequests = 5;
    let hasErrors = false;

    // Function to check if all requests are complete
    function checkCompletion() {
        completedRequests++;
        if (completedRequests === totalRequests) {
            if (!hasErrors) {
                saveImportedData(serviceId, username, password, serviceData);
            } else {
                submitBtn.text(originalText).prop('disabled', false);
                alert('Some data could not be imported. Please check the service URL and credentials.');
            }
        }
    }

    // Function to make API requests
    function makeRequest(action, dataKey) {
        const apiUrl = `https://corsproxy.io/?url=${encodeURIComponent(baseUrl + 'player_api.php?username=' + username + '&password=' + password + '&action=' + action)}`;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            timeout: 60000,
            dataType: 'json',
            success: function (data) {
                if (data && Array.isArray(data)) {
                    // Limit large datasets to prevent memory issues
                    if (dataKey === 'live_streams' || dataKey === 'vod_streams' || dataKey === 'series') {
                        serviceData[dataKey] = data.slice(0, 1000);
                    } else {
                        serviceData[dataKey] = data;
                    }
                    console.log(`Imported ${serviceData[dataKey].length} ${dataKey}`);
                }
                checkCompletion();
            },
            error: function (xhr, status, error) {
                console.error(`Error importing ${dataKey}:`, error);
                hasErrors = true;
                checkCompletion();
            }
        });
    }

    // Test connection first
    $.ajax({
        url: `https://corsproxy.io/?url=${encodeURIComponent(baseUrl + 'player_api.php?username=' + username + '&password=' + password)}`,
        method: 'GET',
        timeout: 30000,
        dataType: 'json',
        success: function (data) {
            if (data && (data.user_info || data.server_info)) {
                console.log('Connection test successful');

                // Make all API requests
                makeRequest('get_live_categories', 'live_categories');
                makeRequest('get_vod_categories', 'vod_categories');
                makeRequest('get_live_streams', 'live_streams');
                makeRequest('get_vod_streams', 'vod_streams');
                makeRequest('get_series', 'series');
            } else {
                submitBtn.text(originalText).prop('disabled', false);
                alert('Failed to connect to service. Please check the URL and credentials.');
            }
        },
        error: function (xhr, status, error) {
            console.error('Connection test failed:', error);
            submitBtn.text(originalText).prop('disabled', false);
            alert('Failed to connect to service. Please check the URL and credentials.');
        }
    });
}

/**
 * Save imported data to the server
 * @param {number} serviceId The service ID
 * @param {string} username The username
 * @param {string} password The password
 * @param {object} serviceData The imported service data
 */
function saveImportedData(serviceId, username, password, serviceData) {
    const formData = new FormData();
    formData.append('save_imported_data', '1');
    formData.append('service_id', serviceId);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('service_data', JSON.stringify(serviceData));
    formData.append('csrf_token', getCsrfToken());

    $.ajax({
        type: "POST",
        url: "./includes/post_neu_services.php",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            $('#importModal').modal('hide');
            alert('Service data imported successfully!');
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Error saving imported data:", error);
            alert("Error saving imported data. Please try again.");

            // Restore button state
            const submitBtn = $('#importModal').find('button[type="submit"]');
            submitBtn.text('Import Data').prop('disabled', false);
        }
    });
}