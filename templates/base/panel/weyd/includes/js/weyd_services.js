/**
 * Weyd Users & Devices JavaScript
 * 
 * Handles client-side functionality for Weyd user and device management.
 * 
 * @package Cockpit
 * @subpackage Weyd
 * @author Ian O'Neill
 * @version See version.json
 */

// Cache for CSRF token to avoid repeated DOM queries
let cachedCsrfToken = null;

/**
 * Retrieves the CSRF token from the page with caching
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    if (!cachedCsrfToken) {
        cachedCsrfToken = $('input[name="csrf_token"]').val();
    }
    return cachedCsrfToken;
}

/**
 * Debounce function to limit the rate of function execution
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form submission handlers
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // Initialize datepicker with consistent formatting
    $('#expiration').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto',
        clearBtn: true
    });

    // User form submission
    $("#post_user").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_user', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
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
                        alert('Error: ' + (response.message || 'Failed to save user'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting user:", {
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
                    alert('An error occurred. Please check your input and try again.');
                }
            }
        });
    });

    $("#post_device").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_device', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
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
                        alert('Error: ' + (response.message || 'Failed to save device'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting device:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    $("#edit_user").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('edit_user', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Updating...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
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
                        // Reset form back to add mode before reloading
                        resetUserForm();
                        location.reload();
                    } else {
                        console.error('Server returned error:', response);
                        alert('Error: ' + (response.message || 'Failed to update user'));
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                    submitBtn.prop('disabled', false).text(originalText);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating user:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a user after confirmation
 * 
 * @param {number} userId The ID of the user to delete
 */
function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user? This will also delete all associated devices and data.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                delete_user: 1,
                user_id: userId,
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
                        alert('Error: ' + (response.message || 'Failed to delete user'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error deleting user:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText,
                    error: error
                });
                alert('Network error occurred while deleting user. Please try again.');
            }
        });
    }
}

/**
 * Deletes a device after confirmation
 * 
 * @param {number} deviceId The ID of the device to delete
 */
function deleteDevice(deviceId) {
    if (confirm("Are you sure you want to delete this device?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                delete_device: 1,
                device_id: deviceId,
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
                        alert('Error: ' + (response.message || 'Failed to delete device'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error deleting device:", error);
            }
        });
    }
}

/**
 * Locks a device after confirmation
 * 
 * @param {number} deviceId The ID of the device to lock
 */
function lockDevice(deviceId) {
    if (confirm("Are you sure you want to lock this device?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                lock_device: 1,
                device_id: deviceId,
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
                        alert('Error: ' + (response.message || 'Failed to lock device'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error locking device:", error);
            }
        });
    }
}

/**
 * Unlocks a device after confirmation
 * 
 * @param {number} deviceId The ID of the device to unlock
 */
function unlockDevice(deviceId) {
    if (confirm("Are you sure you want to unlock this device?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                unlock_device: 1,
                device_id: deviceId,
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
                        alert('Error: ' + (response.message || 'Failed to unlock device'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error unlocking device:", error);
            }
        });
    }
}

/**
 * Populates the user form with existing user data for editing
 * 
 * @param {number} userId The ID of the user
 * @param {string} username The username of the user
 * @param {string} nickname The nickname of the user
 * @param {number} deviceLimit The device limit for the user
 * @param {string} expiration The expiration date of the user
 */
function editUser(userId, username, nickname, deviceLimit, expiration) {
    // Populate form fields
    $('#user_id').val(userId);
    $('#username').val(username);
    $('#nickname').val(nickname);
    $('#device_limit').val(deviceLimit);
    $('#expiration').val(expiration);
    
    $('#password').val('');
    
    // Update form behavior for editing
    $('#post_user').attr('id', 'edit_user');
    $('#edit_user button[type="submit"]').text('Update User');
    $('#edit_user').closest('.card-body').find('h5.card-title').text('Edit User');
    $('#cancel_edit').show();
    
    // Scroll to form
    $('html, body').animate({
        scrollTop: $('#edit_user').offset().top - 100
    }, 500);
}

/**
 * Resets the user form back to "Add User" mode
 */
function resetUserForm() {
    $('#user_id').val('');
    $('#username, #nickname, #password, #expiration').val('');
    $('#device_limit').val(1);
    
    // Restore password requirement
    $('#password').attr('placeholder', 'Enter password').attr('required', 'required');
    
    // Reset form behavior
    $('#edit_user').attr('id', 'post_user');
    $('#post_user button[type="submit"]').text('Save User');
    $('#post_user').closest('.card-body').find('h5.card-title').text('Add User');
    $('#cancel_edit').hide();
}

/**
 * Populates the device form with existing device data for editing
 * 
 * @param {number} deviceId The ID of the device
 * @param {string} deviceName The name of the device
 */
function editDevice(deviceId, deviceName) {
    const newName = prompt('Edit device name:', deviceName);
    if (newName && newName !== deviceName) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                edit_device: 1,
                device_id: deviceId,
                device_name: newName,
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
                        alert('Error: ' + (response.message || 'Failed to update device'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating device:", error);
            }
        });
    }
}

/**
 * Shows devices for a specific user
 * 
 * @param {number} userId The ID of the user
 */
function viewDevices(userId) {
    $('html, body').animate({
        scrollTop: $("[data-user-id='" + userId + "']").offset().top - 100
    }, 500);
}

/**
 * Refreshes a user's Trakt token
 * 
 * @param {number} userId The ID of the user
 */
function refreshTraktToken(userId) {
    if (confirm("Are you sure you want to refresh this user's Trakt token?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                refresh_trakt_token: 1,
                user_id: userId,
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
                        alert('Error: ' + (response.message || 'Failed to refresh Trakt token'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error refreshing Trakt token:", error);
            }
        });
    }
}

/**
 * Revokes a user's Trakt token
 * 
 * @param {number} tokenId The ID of the token
 */
function revokeTraktToken(tokenId) {
    if (confirm("Are you sure you want to revoke this Trakt token? The user will need to re-authenticate.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_services.php",
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: {
                revoke_trakt_token: 1,
                token_id: tokenId,
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
                        alert('Error: ' + (response.message || 'Failed to revoke Trakt token'));
                    }
                } catch (e) {
                    console.error('Error parsing server response:', e, response);
                    alert('Server response error. Please try again.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error revoking Trakt token:", error);
            }
        });
    }
}

/**
 * Configure Trakt OAuth for a user
 * 
 * @param {number} userId The ID of the user
 * @param {string} username The username for display
 */
function configureTrakt(userId, username) {
    WeydOAuth.startOAuth('Trakt', null, userId, `Trakt-${username}`);
}