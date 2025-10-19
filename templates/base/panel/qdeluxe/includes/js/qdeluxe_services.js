/**
 * Q Deluxe Services JavaScript Functions
 * 
 * Handles client and service management for the Q Deluxe
 * configuration interface including adding, editing, and deleting operations.
 * 
 * @package Cockpit
 * @subpackage Q Deluxe
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

    // Initialize toasts with auto-hide
    $('.toast').each(function () {
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
            url: "./includes/post_qdeluxe_services.php",
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
});

/**
 * Deletes a service after confirmation
 * @param {number} id The ID of the service to delete
 */
function deleteService(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_services.php",
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
 * Populates service form with existing data for editing
 * @param {string} client_id The client ID
 * @param {string} name The service name
 * @param {string} url The service URL
 */
function editService(client_id, name, url) {
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
 * Opens import modal and sets service data
 * @param {number} serviceId The ID of the service to import
 * @param {string} serviceUrl The URL of the service to import
 */
function importService(serviceId, serviceUrl) {
    $('#import_service_id').val(serviceId);
    $('#import_service_url').val(serviceUrl);
    var modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

/**
 * Import form submission handler
 */
$("#importForm").on("submit", function (e) {
    e.preventDefault();

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

    importServiceData(serviceId, serviceUrl, username, password);
});

/**
 * Import service data using client-side JavaScript
 * @param {number} serviceId The ID of the service to import
 * @param {string} serviceUrl The URL of the service to import
 * @param {string} username The username for authentication  
 * @param {string} password The password for authentication
 */
function importServiceData(serviceId, serviceUrl, username, password) {
    const modal = $('#importModal');
    const submitBtn = modal.find('button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.text('Importing...').prop('disabled', true);

    const baseUrl = serviceUrl.replace(/\/$/, '') + '/';
    const serviceData = {
        live_categories: [],
        vod_categories: [],
        live_streams: [],
        vod_streams: [],
        series: [],
        epg: "" // Add epg field
    };

    let completedRequests = 0;
    const totalRequests = 6; // Now 6 requests (add EPG)
    let hasErrors = false;

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

    function makeRequest(action, dataKey) {
        const apiUrl = `https://corsproxy.io/?url=${encodeURIComponent(baseUrl + 'player_api.php?username=' + username + '&password=' + password + '&action=' + action)}`;
        $.ajax({
            url: apiUrl,
            method: 'GET',
            timeout: 60000,
            dataType: 'json',
            success: function (data) {
                if (data && Array.isArray(data)) {
                    if (dataKey === 'live_streams' || dataKey === 'vod_streams' || dataKey === 'series') {
                        serviceData[dataKey] = data.slice(0, 1000);
                    } else {
                        serviceData[dataKey] = data;
                    }
                }
                checkCompletion();
            },
            error: function () {
                hasErrors = true;
                checkCompletion();
            }
        });
    }

    function makeXmlRequest() {
        const apiUrl = `https://corsproxy.io/?url=${encodeURIComponent(baseUrl + 'xmltv.php?username=' + username + '&password=' + password)}`;
        $.ajax({
            url: apiUrl,
            method: 'GET',
            timeout: 240000,
            dataType: 'text',
            success: function (data) {
                serviceData.epg = data;
                checkCompletion();
            },
            error: function () {
                hasErrors = true;
                checkCompletion();
            }
        });
    }

    $.ajax({
        url: `https://corsproxy.io/?url=${encodeURIComponent(baseUrl + 'player_api.php?username=' + username + '&password=' + password)}`,
        method: 'GET',
        timeout: 30000,
        dataType: 'json',
        success: function (data) {
            if (data && (data.user_info || data.server_info)) {
                makeRequest('get_live_categories', 'live_categories');
                makeRequest('get_vod_categories', 'vod_categories');
                makeRequest('get_live_streams', 'live_streams');
                makeRequest('get_vod_streams', 'vod_streams');
                makeRequest('get_series', 'series');
                makeXmlRequest(); // Add this line to fetch EPG XML
            } else {
                submitBtn.text(originalText).prop('disabled', false);
                alert('Failed to connect to service. Please check the URL and credentials.');
            }
        },
        error: function () {
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
        url: "./includes/post_qdeluxe_services.php",
        data: formData,
        processData: false,
        contentType: false,
        success: function () {
            $('#importModal').modal('hide');
            alert('Service data imported successfully!');
            location.reload();
        },
        error: function () {
            alert("Error saving imported data. Please try again.");
            const submitBtn = $('#importModal').find('button[type="submit"]');
            submitBtn.text('Import Data').prop('disabled', false);
        }
    });
}
