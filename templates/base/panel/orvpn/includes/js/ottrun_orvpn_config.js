/**
 * ORVPN Configuration JavaScript
 * 
 * Handles client-side functionality for the ORVPN Configuration management including
 * form submissions, AJAX requests, and UI interactions.
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Form submission handlers
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    $('#vpn_config').on('blur', function() {
        var url = $(this).val();
        if (url && !url.match(/\.(ovpn|conf)$/i)) {
            alert('Warning: OpenVPN config URL should typically end with .ovpn or .conf extension');
        }
    });

    // OpenVPN configuration form submission
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
            url: "./includes/post_ottrun_orvpn_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error submitting OpenVPN config:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Sorting form submission
    $("#post_ovpn_sort").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_ovpn_sort', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');
        
        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_orvpn_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error updating sort settings:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    $('#auth_type').on('change', function() {
        var authType = $(this).val();
        var usernameField = $('#vpn_username').closest('.form-group');
        var passwordField = $('#vpn_password').closest('.form-group');
        
        if (authType === 'noup') {
            // Hide username and password fields for "no username/password" option
            usernameField.hide();
            passwordField.hide();
            $('#vpn_username').val('');
            $('#vpn_password').val('');
        } else {
            // Show username and password fields
            usernameField.show();
            passwordField.show();
        }
    });
    
    // Trigger change event on page load to set initial state
    $('#auth_type').trigger('change');
});

/**
 * Deletes a VPN configuration after confirmation
 * @param {number} id The ID of the VPN config to delete
 */
function deleteVpn(id) {
    if (confirm("Are you sure you want to delete this OpenVPN config?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_orvpn_config.php",
            data: {
                delete_ovpn: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error deleting VPN config:", error);
            }
        });
    }
}

/**
 * Populates the VPN form with existing configuration data for editing
 * @param {string} vpn_country The country code
 * @param {string} vpn_state The state/province
 * @param {string} vpn_config The OpenVPN config URL
 * @param {string} vpn_status The VPN status
 * @param {string} auth_type The authentication type
 * @param {string} vpn_username The embedded username
 * @param {string} vpn_password The embedded password
 */
function editVpn(vpn_country, vpn_state, vpn_config, vpn_status, auth_type, vpn_username, vpn_password) {
    // Set form values
    $("#vpn_country").val(vpn_country);
    $("#vpn_country option[value='" + vpn_country + "']").prop("selected", true);
    $("#vpn_state").val(vpn_state);
    $("#vpn_config").val(vpn_config);
    $("#vpn_status").val(vpn_status);
    $("#auth_type").val(auth_type);
    $("#vpn_username").val(vpn_username);
    $("#vpn_password").val(vpn_password);

    if (auth_type === 'noup' || auth_type === 'kp') {
        $('#vpn_username').closest('.form-group').hide();
        $('#vpn_password').closest('.form-group').hide();
    }
    
    // Update button text to indicate editing mode
    $('#post_ovpn button[name="post_ovpn"]').text('Update Config');
    
    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_ovpn").offset().top - 100
    }, 500);
}