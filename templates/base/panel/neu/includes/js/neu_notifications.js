/**
 * Purple Neu Notifications JavaScript
 * 
 * Handles client-side functionality for the Purple Neu Notifications management including
 * form submissions, AJAX requests, and UI interactions.
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
    $('#expiry_date').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto'
    });

    // Update log form submission
    $("#post_update_log").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_update_log', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_notifications.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting update log:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Notification form submission
    $("#post_notification").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_notification', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_notifications.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting notification:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes an update log after confirmation
 * @param {number} id The ID of the update log to delete
 */
function deleteUpdateLog(id) {
    if (confirm("Are you sure you want to delete this update log?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_notifications.php",
            data: {
                delete_item: 1,
                delete_id: id,
                delete_type: 'update_log',
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting update log:", error);
            }
        });
    }
}

/**
 * Deletes a notification after confirmation
 * @param {number} id The ID of the notification to delete
 */
function deleteNotification(id) {
    if (confirm("Are you sure you want to delete this notification?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_notifications.php",
            data: {
                delete_item: 1,
                delete_id: id,
                delete_type: 'notification',
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting notification:", error);
            }
        });
    }
}

/**
 * Populates the notification form with existing data for editing
 * @param {string} title The notification title
 * @param {string} message The notification message
 * @param {number} show_in_popup The popup display type (1 for popup, 0 for toast)
 * @param {string} expiry_date The expiration date
 */
function editNotification(title, message, show_in_popup, expiry_date) {
    $("#title_n").val(title);
    $("#message").val(message);
    $("#expiry_date").val(expiry_date);
    $("#show_in_popup").val(show_in_popup ? 'popup' : 'toast');

    // Update button text to indicate editing mode
    $('#post_notification button[name="post_notification"]').text('Update Notification');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_notification").offset().top - 100
    }, 500);
}

/**
 * Populates the update log form with existing data for editing
 * @param {string} title The update title
 * @param {string} description The update description
 * @param {string} version_name The version name
 * @param {number} version_code The version code
 */
function editUpdateLog(title, description, version_name, version_code) {
    $("#title").val(title);
    $("#description").val(description);
    $("#version_name").val(version_name);
    $("#version_code").val(version_code);

    // Update button text to indicate editing mode
    $('#post_update_log button[name="post_update_log"]').text('Update Change Log');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_update_log").offset().top - 100
    }, 500);
}

/**
 * Legacy function for deleting update logs (maintained for backward compatibility)
 * @param {number} id The ID of the update log to delete
 */
function deleteLegacyUpdateLog(id) {
    if (confirm("Are you sure you want to delete this update log?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_notifications.php",
            data: {
                delete_update_log: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting update log:", error);
            }
        });
    }
}

/**
 * Legacy function for deleting notifications (maintained for backward compatibility)
 * @param {number} id The ID of the notification to delete
 */
function deleteLegacyNotification(id) {
    if (confirm("Are you sure you want to delete this notification?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_notifications.php",
            data: {
                delete_notification: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting notification:", error);
            }
        });
    }
}