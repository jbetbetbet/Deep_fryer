/**
 * LTQ2 Configuration JavaScript
 * 
 * Handles client-side functionality for the LTQ2 Configuration management including
 * form submissions, AJAX requests, and UI interactions.
 */

// Initialize Summernote editor
$('.summernote').summernote({
    toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
    ],
    height: 100
});

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
    
    // Banner form submission
    $("#post_ad_banners").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_ad_banners', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ltq2_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting banner:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // App form submission
    $("#post_app").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_app', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ltq2_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting app:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a banner ad after confirmation
 * @param {number} id The ID of the banner ad to delete
 */
function deleteAdBanner(id) {
    if (confirm("Are you sure you want to delete this banner notification?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ltq2_config.php",
            data: {
                delete_ad_banner: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting banner:", error);
            }
        });
    }
}

/**
 * Deletes an app after confirmation
 * @param {number} id The ID of the app to delete
 */
function deleteApp(id) {
    if (confirm("Are you sure you want to delete this app?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_ltq2_config.php",
            data: {
                delete_app: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting app:", error);
            }
        });
    }
}

/**
 * Populates the banner form with existing banner data for editing
 * @param {string} title The title of the banner
 * @param {string} description The description of the banner
 * @param {string} backdrop The backdrop URL of the banner
 * @param {string} reference The reference of the banner
 */
function editAdBanner(title, description, backdrop, reference) {
    // Set form values
    $("#title").val(title);
    $("#description").summernote('code', description);
    $("#backdrop").val(backdrop);
    $("#reference").val(reference);

    // Update button text to indicate editing mode
    $('button[name="post_ad_banners"]').text('Update Banner');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_ad_banners").offset().top - 100
    }, 500);
}

/**
 * Populates the app form with existing app data for editing
 * @param {string|object} data The app data (can be string or object)
 */
function editApp(data) {
    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    // Set form values
    $("#app_name").val(data.app_name);
    $("#app_id").val(data.app_id);
    $("#app_description").summernote('code', data.app_description);
    $("#app_banner").val(data.app_banner);
    $("#app_install_url").val(data.app_install_url);

    // Update button text to indicate editing mode
    $('button[name="post_app"]').text('Update App');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_app").offset().top - 100
    }, 500);
}
