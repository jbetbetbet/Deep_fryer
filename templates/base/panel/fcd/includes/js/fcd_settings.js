/**
 * FCD Box Settings JavaScript Functions
 * 
 * Handles theme management, app store, launchers, banners, and RSS feeds
 * for the FCD Box configuration interface.
 * 
 * @package Cockpit
 * @subpackage FCD
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
    
    // Handle tab parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam) {
        $('.nav-link[href="#' + tabParam + '"]').tab('show');
    }

    // Hide pre-text when tabs are clicked
    $('.nav-link').on('click', function () {
        $('#pre-text').hide();
    });

    // Theme form submission
    $("#post_themes").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_themes', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting theme:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Banner form submission
    $("#post_banners").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_banners', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting banners:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // App store form submission
    $("#post_appstore").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_appstore', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting app store:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Launcher form submission
    $("#post_launchers").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_launchers', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting launcher:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // RSS form submission
    $("#post_rss").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_rss', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting RSS:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Opens image viewer modal
 * @param {string} url The image URL to display
 */
function viewImage(url) {
    document.getElementById('modalImage').src = url;
    $('#imageModal').modal('show');
}

/**
 * Load theme data for editing
 */
function loadThemeData() {
    const themeId = $('#themeSelect').val();
    const themeNameInput = $('#theme_name');
    const elementsContainer = $('#themeElementsContainer');
    const deleteButton = $('#deleteThemeBtn');

    if (!themeId) {
        deleteButton.hide();
        elementsContainer.empty();
        themeNameInput.val('');
        return;
    }

    deleteButton.show();

    $.ajax({
        url: './includes/get_theme_data.php',
        type: 'GET',
        data: { id: themeId },
        dataType: 'json',
        beforeSend: function () {
            elementsContainer.html('<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading theme data...</div>');
        },
        success: function (response) {
            if (response.success) {
                themeNameInput.val(response.themeName);
                renderThemeElements(response.themeElements);
            } else {
                console.error('Error loading theme data:', response.error);
                elementsContainer.empty();
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading theme data:', error);
            elementsContainer.empty();
        }
    });
}

/**
 * Render theme elements in the container
 * @param {Array} themeElements Array of theme element objects
 */
function renderThemeElements(themeElements) {
    const container = $('#themeElementsContainer');
    container.empty();

    themeElements.forEach(function (element) {
        const elementHtml = createThemeElementHtml(element);
        container.append(elementHtml);
    });
}

/**
 * Create HTML for a theme element
 * @param {Object} element Theme element data
 * @returns {string} HTML string for the element
 */
function createThemeElementHtml(element) {
    return `
        <div class="col">
            <div class="card p-3 h-100 text-center">
                <label class="form-label fw-bold">${element.name}</label>
                <div class="image-preview mb-3" style="width: 100%; height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #dee2e6; border-radius: 0.375rem;">
                    <img src="${element.imageUrl || 'https://via.placeholder.com/150x150?text=No+Image'}" alt="${element.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <input type="hidden" name="element_name[]" value="${element.name}">
                <input type="url" name="element_url[]" value="${element.url}" class="form-control" placeholder="Enter URL" onchange="updateImagePreview(this)">
                <div class="card-arrow">
                    <div class="card-arrow-top-left"></div>
                    <div class="card-arrow-top-right"></div>
                    <div class="card-arrow-bottom-left"></div>
                    <div class="card-arrow-bottom-right"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Update image preview when URL changes
 * @param {HTMLElement} input The input element that changed
 */
function updateImagePreview(input) {
    const imageElement = $(input).siblings('.image-preview').find('img');
    const newUrl = input.value || 'https://via.placeholder.com/150x150?text=No+Image';
    imageElement.attr('src', newUrl);
}

/**
 * Delete theme after confirmation
 */
function deleteTheme() {
    const themeId = $('#themeSelect').val();

    if (!themeId) {
        alert("No theme selected.");
        return;
    }

    if (confirm("Are you sure you want to delete this theme? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: {
                delete_theme: 1,
                theme_id: themeId,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting theme:", error);
            }
        });
    }
}

/**
 * Deletes RSS entry after confirmation
 * @param {number} id The ID of the RSS entry to delete
 */
function deleteRss(id) {
    if (confirm("Are you sure you want to delete this RSS entry?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: {
                delete_rss: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.href = "./fcd_settings.php?tab=pills-rss";
            },
            error: function (xhr, status, error) {
                console.error("Error deleting RSS:", error);
            }
        });
    }
}

/**
 * Deletes app store entry after confirmation
 * @param {number} app_id The ID of the app to delete
 */
function deleteAppStore(app_id) {
    if (confirm("Are you sure you want to delete this app?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: {
                delete_appstore: 1,
                app_id: app_id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.href = "./fcd_settings.php?tab=pills-appstore";
            },
            error: function (xhr, status, error) {
                console.error("Error deleting app store:", error);
            }
        });
    }
}

/**
 * Disables app launcher after confirmation
 * @param {string} name The name of the launcher to disable
 */
function disableAppLauncher(name) {
    if (confirm("Are you sure you want to disable this launcher? This will set the launcher to its default use status.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: {
                disable_launcher: 1,
                name: name,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.href = "./fcd_settings.php?tab=pills-launchers";
            },
            error: function (xhr, status, error) {
                console.error("Error disabling launcher:", error);
            }
        });
    }
}

/**
 * Enables app launcher after confirmation
 * @param {string} name The name of the launcher to enable
 */
function enableAppLauncher(name) {
    if (confirm("Are you sure you want to enable this launcher? This will set the launcher to download/launch the set app.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_fcd_settings.php",
            data: {
                enable_launcher: 1,
                name: name,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.href = "./fcd_settings.php?tab=pills-launchers";
            },
            error: function (xhr, status, error) {
                console.error("Error enabling launcher:", error);
            }
        });
    }
}

/**
 * Populates RSS form with existing data for editing
 * @param {string} title The RSS title
 * @param {string} description The RSS description
 */
function editRss(title, description) {
    $("#rss_title").val(title);
    $("#rss_description").val(description);

    // Update button text to indicate editing mode
    $('#post_rss button[name="post_rss"]').text('Update RSS');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_rss").offset().top - 100
    }, 500);
}

/**
 * Populates app store form with existing data for editing
 * @param {string} description The app description
 * @param {string} icon The app icon URL
 * @param {string} id The app package ID
 * @param {string} name The app name
 * @param {string} url The app URL
 * @param {string} version The app version
 * @param {string} versioncode The app version code
 */
function editAppStore(description, icon, id, name, url, version, versioncode) {
    $("#appstore_description").val(description);
    $("#appstore_icon").val(icon);
    $("#appstore_id").val(id);
    $("#appstore_name").val(name);
    $("#appstore_url").val(url);
    $("#appstore_version").val(version);
    $("#appstore_versioncode").val(versioncode);

    // Update button text to indicate editing mode
    $('#post_appstore button[name="post_appstore"]').text('Update App');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_appstore").offset().top - 100
    }, 500);
}

/**
 * Populates launcher form with existing data for editing
 * @param {string} name The launcher name
 * @param {string} is_active The launcher status
 * @param {string} package The launcher package
 * @param {string} url The launcher URL
 * @param {string} version The launcher version
 * @param {string} versioncode The launcher version code
 */
function editAppLauncher(name, is_active, package, url, version, versioncode) {
    $("#launcher_name").val(name);
    $("#launcher_is_active").val(is_active);
    $("#launcher_package").val(package);
    $("#launcher_url").val(url);
    $("#launcher_version").val(version);
    $("#launcher_versioncode").val(versioncode);

    // Update button text to indicate editing mode
    $('#post_launchers button[name="post_launchers"]').text('Update Launcher');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_launchers").offset().top - 100
    }, 500);
}
