/**
 * Easy Player Settings JavaScript
 * 
 * Handles client-side functionality for the Easy Player Settings management including
 * form submissions, AJAX requests, and UI interactions.
 * 
 * @package Cockpit
 * @subpackage Easy
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
    
    // Settings form submission
    $("#post_settings").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_settings', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_easy_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting settings:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
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
            url: "./includes/post_easy_settings.php",
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
});

/**
 * Deletes an announcement after confirmation
 * @param {number} id The ID of the announcement to delete
 */
function deleteAnnouncement(id) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_easy_settings.php",
            data: {
                delete_announcement: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting announcement:", error);
            }
        });
    }
}

/**
 * Populates the announcement form with existing data for editing
 * @param {string} title The title of the announcement
 * @param {string} short_description The description of the announcement
 * @param {string} image The image URL of the announcement
 */
function editAnnouncement(title, short_description, image) {
    $("#title").val(title);
    $("#short_description").val(short_description);
    $("#image").val(image);

    // Update button text to indicate editing mode
    $('#post_announcement button[name="post_announcement"]').text('Update Announcement');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_announcement").offset().top - 100
    }, 500);
}