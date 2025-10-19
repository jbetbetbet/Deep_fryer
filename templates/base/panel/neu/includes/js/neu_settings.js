/**
 * Purple Neu Settings JavaScript
 * 
 * Handles client-side functionality for the Purple Neu Settings management including
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
    
    // Initialize pickers with search functionality
    ['#live_categories', '#live_streams', '#vod_categories', '#vod_streams', '#series', '#live_channel_id', '#movies_id', '#shows_id', '#top_picks_ids', '#top_picks_ids', '#country_groups_categories'].forEach(function (elementId) {
        $(elementId).picker({ search: true });
    });

    // Appearance form submission
    $("#post_appearance").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_appearance', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting appearance:", error);
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
            url: "./includes/post_neu_settings.php",
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

    // Home group channels form submission
    $("#post_homegroupchannels").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_homegroupchannels', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting home group channels:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Top picks form submission
    $("#post_toppicks").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_toppicks', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting top picks:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Country groups form submission
    $("#post_countrygroups").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_countrygroups', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting country groups:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Deletes a top pick after confirmation
 * @param {number} id The ID of the top pick to delete
 */
function deleteToppicks(id) {
    if (confirm("Are you sure you want to delete this top pick group?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
            data: {
                delete_toppicks: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting top pick:", error);
            }
        });
    }
}

/**
 * Deletes a country group after confirmation
 * @param {number} id The ID of the country group to delete
 */
function deleteCountrygroups(id) {
    if (confirm("Are you sure you want to delete this country group?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
            data: {
                delete_countrygroups: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting country group:", error);
            }
        });
    }
}

/**
 * Deletes an announcement after confirmation
 * @param {number} id The ID of the announcement to delete
 */
function deleteAnnouncement(id) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_settings.php",
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
 * Populates the top picks form with existing data for editing
 * @param {string} type The type of top pick
 * @param {string} title The title of the top pick
 * @param {string} ids The IDs associated with the top pick
 */
function editToppicks(type, title, ids) {
    $("#top_picks_type").val(type);
    $("#top_picks_title").val(title);
    $("#top_picks_ids").val(ids);

    // Update button text to indicate editing mode
    $('#post_toppicks button[name="post_toppicks"]').text('Update Top Pick');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_toppicks").offset().top - 100
    }, 500);
}

/**
 * Populates the country groups form with existing data for editing
 * @param {string} name The name of the country group
 * @param {string} code The country code
 * @param {string} image The image URL
 * @param {string} aliases The aliases
 * @param {string} ids The category IDs
 */
function editCountrygroups(name, code, image, aliases, ids) {
    $("#country_groups_name").val(name);
    $("#country_groups_code").val(code);
    $("#country_groups_image").val(image);
    $("#country_groups_aliases").val(aliases);
    $("#country_groups_categories").val(ids);

    // Update button text to indicate editing mode
    $('#post_countrygroups button[name="post_countrygroups"]').text('Update Country Group');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_countrygroups").offset().top - 100
    }, 500);
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