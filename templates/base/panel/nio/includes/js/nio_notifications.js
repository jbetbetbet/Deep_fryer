/**
 * NiO Player Notifications JavaScript
 * 
 * Handles client-side functionality for the NiO Player Notifications management including
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

    // Announcement form submission
    $("#post_announcement").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_announcement', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_nio_notifications.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting announcement:", error);
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
            url: "./includes/post_nio_notifications.php",
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
 * Deletes an announcement after confirmation
 * @param {number} id The ID of the announcement to delete
 */
function deleteAnnouncement(id) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_nio_notifications.php",
            data: {
                delete_item: 1,
                delete_id: id,
                delete_type: 'announcement',
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
            url: "./includes/post_nio_notifications.php",
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
function editNotification(title, message) {
    $("#title_n").val(title);
    $("#message").val(message);

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
 * @param {string} image The image URL
 */
function editAnnouncement(title, description, image) {
    $("#title").val(title);
    $("#description").val(description);
    $("#image").val(image);

    // Update button text to indicate editing mode
    $('#post_announcement button[name="post_announcement"]').text('Update Announcement');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_announcement").offset().top - 100
    }, 500);
}