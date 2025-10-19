/**
 * S9H Store Configuration JavaScript
 * 
 * Handles the client-side functionality for the S9H Store Configuration page,
 * including modal management and CRUD operations for apps and categories.
 * 
 * @package Cockpit
 * @subpackage S9HStore
 * @author Ian O'Neill
 * @version See version.json
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
    if (!id || isNaN(id)) {
        console.error('Invalid app ID:', id);
        return;
    }

    if (confirm("Are you sure you want to delete this app? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_config.php",
            data: {
                deleteApp: 1,
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

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    /**
     * Modal event handlers for app management
     */
    $('#addAppModal #closeModalBtn, #editAppModal #closeModalBtn').on('click', function () {
        $(this).closest('.modal').modal('hide');
    });

    $('[data-target="#addAppModal"]').on('click', function () {
        $('#addAppModal').modal('show');
    });

    /**
     * Reset forms when modals are closed
     */
    $('#addAppModal').on('hidden.bs.modal', function () {
        const form = $(this).find('form');
        form[0].reset();
    });

    $('#editAppModal').on('hidden.bs.modal', function () {
        const form = $(this).find('form');
        form[0].reset();
    });

    /**
     * Edit app button click handler using event delegation
     */
    $(document).on('click', '.edit-app-btn', function () {
        const $this = $(this);
        const data = $this.data();

        // Populate edit modal fields
        $('#editAppId').val(data.id);
        $('#editAppName').val(data.name);
        $('#editAppYear').val(data.year);
        $('#editAppImge').val(data.imge);
        $('#editAppUrl').val(data.url);

        // Set checkbox states
        $('#editAppComingSoon').prop('checked', data.comingsoon == "1" || data.comingsoon === true);
        $('#editAppUpdated').prop('checked', data.updated == "1" || data.updated === true);

        // Show modal
        $('#editAppModal').modal('show');
    });

    /**
     * Add app form submission handler
     */
    $("#addAppForm").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('addApp', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_config.php",
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
        formData.append('editApp', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button to prevent double submission
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_s9hstore_config.php",
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
});