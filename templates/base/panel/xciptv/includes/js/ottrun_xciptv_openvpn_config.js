/**
 * XCIPTV OpenVPN Configuration JavaScript
 * 
 * Handles client-side functionality for the OpenVPN configuration management including
 * form submissions, AJAX requests, and UI interactions.
 * 
 * @package   Cockpit
 * @subpackage XCIPTV
 * @author    Ian O'Neill
 * @version   see version.json
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Show or hide username/password fields based on authentication type
 */
function toggleAuthFields() {
    const authType = $('#auth_type').val();
    const usernameGroup = $('#vpn_username').closest('.form-group');
    const passwordGroup = $('#vpn_password').closest('.form-group');

    if (authType === 'noup' || authType === 'kp') {
        // Hide username and password fields
        usernameGroup.hide();
        passwordGroup.hide();

        // Clear the values when hidden
        $('#vpn_username').val('');
        $('#vpn_password').val('');
    } else {
        // Show username and password fields
        usernameGroup.show();
        passwordGroup.show();
    }
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
    
    // Initialize auth fields visibility on page load
    toggleAuthFields();

    // Handle auth type changes
    $('#auth_type').on('change', function () {
        toggleAuthFields();
    });

    // VPN form submission
    $("#post_ovpn").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_ovpn', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_openvpn_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting VPN config:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Sort form submission if present
    $("#post_ovpn_sort").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_ovpn_sort', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_openvpn_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error saving sort options:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a VPN configuration after confirmation
 * @param {number} vpn_id The ID of the VPN configuration to delete
 */
function deleteVpn(vpn_id) {
    if (confirm("Are you sure you want to delete this VPN configuration? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_openvpn_config.php",
            data: {
                delete_ovpn: 1,
                vpn_id: vpn_id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting VPN config:", error);
            }
        });
    }
}

/**
 * Populates the VPN form with existing configuration data for editing
 * @param {string} vpn_country The country code
 * @param {string} vpn_location The location/state
 * @param {string} vpn_config The config URL
 * @param {string} vpn_status The status
 * @param {string} auth_type The authentication type
 * @param {string} vpn_username The username
 * @param {string} vpn_password The password
 */
function editVpn(vpn_country, vpn_location, vpn_config, vpn_status, auth_type, vpn_username, vpn_password) {
    // Set form values
    $("#vpn_country").val(vpn_country);
    $("#vpn_state").val(vpn_location);
    $("#vpn_config").val(vpn_config);
    $("#vpn_status").val(vpn_status);
    $("#auth_type").val(auth_type);
    $("#vpn_username").val(vpn_username);
    $("#vpn_password").val(vpn_password);

    // Update auth fields visibility
    toggleAuthFields();

    // Update button text to indicate editing mode
    $('#post_ovpn button[name="post_ovpn"]').text('Update Config');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_ovpn").offset().top - 100
    }, 500);
}