/**
 * Multi-Service Proxy JavaScript
 * 
 * Handles client-side functionality for the Multi-Service Proxy management including
 * form submissions, AJAX requests, and UI interactions.
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Opens the test modal and sets up form submission handler
 * @param {string} serviceName The name of the service
 * @param {string} serviceUrl The URL of the service
 */
function openTestModal(serviceName, serviceUrl) {
    // Set modal title
    $('#testModalLabel').text('Test Service: ' + serviceName);

    // Clear previous responses
    $('#responseOutput').val('');
    $('#usernameInput').val('');
    $('#passwordInput').val('');

    // Store service URL for testing
    $('#testModal').data('serviceUrl', serviceUrl);

    // Show the modal
    $('#testModal').modal('show');
}

/**
 * Tests the service with provided credentials
 */
function testService() {
    var serviceUrl = $('#testModal').data('serviceUrl');
    var username = $('#usernameInput').val();
    var password = $('#passwordInput').val();

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    // Clear previous response
    $('#responseOutput').val('Testing...');

    const baseUrl = `${serviceUrl}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const testUrl = `https://corsproxy.io/?url=${encodeURIComponent(baseUrl)}`;

    $.ajax({
        url: testUrl,
        method: 'GET',
        success: function (response) {
            $('#responseOutput').val(JSON.stringify(response, null, 2));
        },
        error: function (xhr, status, error) {
            $('#responseOutput').val('Request failed: ' + error);
            console.error("Error testing service:", error);
        }
    });
}

// Clean up modal when it's hidden
$('#testModal').on('hidden.bs.modal', function (e) {
    $('#responseOutput').val('');
    $('#usernameInput').val('');
    $('#passwordInput').val('');
    $(this).removeData('serviceUrl');
});

// Form submission handlers
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
            url: "./includes/post_multi_service_proxy.php",
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
 * @param {number} service_id The ID of the service to delete
 */
function deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_multi_service_proxy.php",
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
            }
        });
    }
}

/**
 * Populates the service form with existing service data for editing
 * @param {string} serviceName The name of the service
 * @param {string} serviceUrl The URL of the service
 */
function editService(serviceName, serviceUrl) {
    // Set form values
    $("#service_name").val(serviceName);
    $("#service_url").val(serviceUrl);

    // Update button text to indicate editing mode
    $('button[name="post_service"]').text('Update Service');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_service").offset().top - 100
    }, 500);
}