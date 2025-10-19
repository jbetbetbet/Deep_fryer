/**
 * Flix IPTV Settings JavaScript
 * Handles form submissions, AJAX requests, and UI interactions for settings, themes, and averts.
 * @package Cockpit
 * @subpackage Flix IPTV
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

$(function () {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize toasts with auto-hide
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // App Settings form submission
    $("#post_app_settings").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_app_settings', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_flixiptv_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Error saving settings: " + error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Theme form submission
    $("#post_theme").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_theme', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_flixiptv_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Error saving theme: " + error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // avert form submission
    $("#post_avert").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_avert', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_flixiptv_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Error saving avert: " + error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a theme after confirmation
 * @param {number} id The ID of the theme to delete
 */
function deleteTheme(id) {
    if (confirm('Are you sure you want to delete this theme?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_flixiptv_settings.php",
            data: {
                delete_theme: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Error deleting theme: " + error);
            }
        });
    }
}

/**
 * Deletes an avert after confirmation
 * @param {number} id The ID of the avert to delete
 */
function deleteavert(id) {
    if (confirm('Are you sure you want to delete this avert?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_flixiptv_settings.php",
            data: {
                delete_avert: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Error deleting avert: " + error);
            }
        });
    }
}

/**
 * Populates the theme form for editing
 * @param {number} id The theme ID
 * @param {string} name The theme name
 * @param {string} url The theme image URL
 */
function editTheme(name, url) {
    $('#theme_name').val(name);
    $('#theme_url').val(url);
    $('#theme_submit_btn').text('Update Theme');
    $('html, body').animate({ scrollTop: $("#post_theme").offset().top - 100 }, 500);
}

/**
 * Populates the avert form for editing
 * @param {number} id The avert ID
 * @param {string} title The avert title
 * @param {string} description The avert description
 * @param {string} url The avert image URL
 */
function editavert(title, description, url) {
    $('#avert_title').val(title);
    $('#avert_description').val(description);
    $('#avert_url').val(url);
    $('#avert_submit_btn').text('Update avert');
    $('html, body').animate({ scrollTop: $("#post_avert").offset().top - 100 }, 500);
}