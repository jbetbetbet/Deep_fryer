/**
 * Smarters Pro OpenVPN Configuration JavaScript
 * 
 * Handles VPN configuration deletion, account management and form interactions
 * for the Smarters Pro OpenVPN configuration interface.
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
 * Delete a VPN configuration
 * 
 * @param {number} id - The ID of the VPN configuration to delete
 */
function deleteVpn(id) {
    if (confirm("Are you sure you want to delete this VPN config?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_openvpn_config.php",
            data: {
                delete_ovpn: 1,
                vpn_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting VPN config:', status, error);
            }
        });
    }
}

/**
 * Delete a VPN account credential
 * 
 * @param {number} id - The ID of the account credentials to delete
 */
function deleteAccount(id) {
    if (confirm("Are you sure you want to delete this account?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_openvpn_config.php",
            data: {
                delete_credentials: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting account credentials:', status, error);
            }
        });
    }
}

/**
 * Edit an account - loads credentials into the form
 * 
 * @param {string} username - The username to populate
 * @param {string} password - The password to populate
 */
function editAccount(username, password) {
    $('#username').val(username);
    $('#password').val(password);
    $('#username').focus();

    //change form text 
    $("#post_credentials button[type='submit']").text("Update Login");
}

// Initialize form handling when document is ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Handle VPN configuration form submission if present
    $("#post_ovpn").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_ovpn', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_openvpn_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting VPN form:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Handle credentials form submission if present
    $("#post_credentials").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_credentials', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_openvpn_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting credentials form:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});