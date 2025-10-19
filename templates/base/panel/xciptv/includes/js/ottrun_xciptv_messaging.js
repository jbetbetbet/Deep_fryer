/**
 * XCIPTV Messaging JavaScript
 * 
 * Handles date pickers, form submission, message editing and deletion
 * for the XCIPTV messaging interface.
 * 
 * @package   Cockpit
 * @subpackage XCIPTV
 * @author    Ian O'Neill
 * @version   see version.json
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
 * Delete a user message
 * 
 * @param {number} id - The ID of the message to delete
 */
function deleteMessage(id) {
    if (confirm("Are you sure you want to delete this message?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_messaging.php",
            data: {
                delete_user_message: 1,
                id: id,
                csrf_token: getCsrfToken(),
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting message:', status, error);
            }
        });
    }
}

/**
 * Edit a user message - loads data into the form
 * 
 * @param {string} message - The message content
 * @param {string} userid - The user ID the message is for
 * @param {string} status - The status of the message
 * @param {string} expire - The expiration date
 */
function editMessage(message, userid, status, expire) {
    $("#message").val(message);
    $("#userid").val(userid);
    $("#select_status").val(status);
    $("#select_status option[value='" + status + "']").prop("selected", true);
    $("#datepicker").val(expire);
    $('#message').focus();

    // Update button text to indicate editing mode
    $('#post_user_message button[name="post_user_message"]').text('Update Message');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_user_message").offset().top - 100
    }, 500);
}

/**
 * Delete an announcement
 * 
 * @param {number} id - The ID of the announcement to delete
 */
function deleteAnnouncement(id) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_messaging.php",
            data: {
                delete_announcement: 1,
                id: id,
                csrf_token: getCsrfToken(),
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting announcement:', status, error);
            }
        });
    }
}

/**
 * Edit an announcement - loads data into the form
 * 
 * @param {string} title - The announcement title
 * @param {string} message - The announcement message
 * @param {string} expire - The expiration date
 * @param {string} status - The status of the announcement
 */
function editAnnouncement(title, message, expire, status) {
    $("#ann_title").val(title);
    $("#ann_message").val(message);
    $("#ann_expire").val(expire);
    $("#ann_status").val(status);
    $("#ann_status option[value='" + status + "']").prop("selected", true);
    $('#ann_title').focus();

    // Update button text to indicate editing mode
    $('#post_ann button[name="post_ann"]').text('Update Announcement');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_ann").offset().top - 100
    }, 500);
}

/**
 * Delete a maintenance notice
 * 
 * @param {number} id - The ID of the maintenance notice to delete
 */
function deleteMaintenance(id) {
    if (confirm("Are you sure you want to delete this maintenance notice?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_messaging.php",
            data: {
                delete_maintenance: 1,
                id: id,
                csrf_token: getCsrfToken(),
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting maintenance notice:', status, error);
            }
        });
    }
}

/**
 * Edit a maintenance notice - loads data into the form
 * 
 * @param {string} title - The maintenance title
 * @param {string} message - The maintenance message
 * @param {string} expire - The expiration date
 * @param {string} status - The status of the maintenance notice
 */
function editMaintenance(title, message, expire, status) {
    $("#mnt_title").val(title);
    $("#mnt_message").val(message);
    $("#mnt_expire").val(expire);
    $("#mnt_status").val(status);
    $("#mnt_status option[value='" + status + "']").prop("selected", true);
    $('#mnt_title').focus();

    // Update button text to indicate editing mode
    $('#post_mnt_message button[name="post_mnt_message"]').text('Update Maintenance');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#post_mnt_message").offset().top - 100
    }, 500);
}

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    /**
     * Initialize date pickers with proper configuration
     */
    ['#mnt_expire', '#ann_expire', '#datepicker'].forEach(function (elementId) {
        $(elementId).datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            orientation: 'bottom auto',
            clearBtn: true
        });
    });

    /**
     * Handle user message form submission
     */
    $("#post_user_message").on("submit", function (e) {
        e.preventDefault();

        const form = $(this);

        var formData = new FormData(this);
        formData.append('post_user_message', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_messaging.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting message:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Handle announcement form submission
     */
    $("#post_announcement").on("submit", function (e) {
        e.preventDefault();

        const form = $(this);

        var formData = new FormData(this);
        formData.append('post_announcement', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_messaging.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting announcement:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Handle maintenance form submission
     */
    $("#post_maintenance").on("submit", function (e) {
        e.preventDefault();

        const form = $(this);

        var formData = new FormData(this);
        formData.append('post_maintenance', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ottrun_xciptv_messaging.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting maintenance notice:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});
