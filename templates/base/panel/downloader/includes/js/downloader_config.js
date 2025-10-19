/**
 * Downloader Configuration JavaScript
 * 
 * Handles the client-side functionality for the Downloader Configuration page,
 * including modal management and CRUD operations for apps and imports.
 * 
 * @package Cockpit
 * @subpackage Downloader
 */

/**
 * Get the CSRF token from the page
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Delete an app after confirmation
 * 
 * @param {number} id - ID of the app to delete
 */
function deleteApp(id) {
    if (confirm("Are you sure you want to delete this app? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_downloader_config.php",
            data: {
                delete_app: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting app:', status, error);
            }
        });
    }
}

/**
 * Populate the app form with existing app data for editing
 * 
 * @param {string} code - The app code
 * @param {string} name - The app name
 * @param {string} image - The app image URL
 * @param {string} url - The app download URL
 * @param {number} id - The app ID
 */
function editApp(code, name, image, url, id) {
    $("#editAppId").val(id);
    $("#editAppCode").val(code);
    $("#editAppName").val(name);
    $("#editAppImage").val(image);
    $("#editAppUrl").val(url);

    // Update modal title to indicate editing mode
    $('#editAppModalLabel').text('Edit App - ' + name);

    // Show the modal
    $('#editAppModal').modal('show');
}

// Initialize on document ready
$(function () {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    /**
     * App form submission handler
     */
    $("#addAppForm").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_downloader_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                $('#addAppModal').modal('hide');
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error adding app:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Edit app form submission handler
     */
    $("#editAppForm").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_downloader_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                $('#editAppModal').modal('hide');
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error updating app:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Import app form submission handler
     */
    $("#importAppForm").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_downloader_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                $('#importAppModal').modal('hide');
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error importing app:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Edit app button click handler
     */
    $(document).on('click', '.edit-app-btn', function () {
        const $this = $(this);
        const data = $this.data();

        $('#editAppId').val(data.id);
        $('#editAppCode').val(data.code);
        $('#editAppName').val(data.name);
        $('#editAppImage').val(data.image);
        $('#editAppUrl').val(data.url);

        // Update modal title
        $('#editAppModalLabel').text('Edit App - ' + data.name);

        $('#editAppModal').modal('show');
    });

    /**
     * Modal reset handlers
     */
    $('#addAppModal').on('hidden.bs.modal', function () {
        $(this).find('form')[0].reset();
        $(this).find('button[type="submit"]').prop('disabled', false).text('Add App');
    });

    $('#editAppModal').on('hidden.bs.modal', function () {
        $(this).find('form')[0].reset();
        $(this).find('button[type="submit"]').prop('disabled', false).text('Save changes');
        $('#editAppModalLabel').text('Edit App');
    });

    $('#importAppModal').on('hidden.bs.modal', function () {
        $(this).find('form')[0].reset();
        $(this).find('button[type="submit"]').prop('disabled', false).text('Import');
    });

    /**
     * Auto-focus first input when modals open
     */
    $('.modal').on('shown.bs.modal', function () {
        $(this).find('input:not([type="hidden"]):first').focus();
    });
});
