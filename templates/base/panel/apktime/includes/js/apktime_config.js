/**
 * APKTime Configuration JavaScript
 * 
 * Handles client-side functionality for the APKTime Configuration page,
 * including modal management, CRUD operations for categories and apps,
 * and Summernote rich text editor integration.
 * 
 * @package Cockpit
 * @subpackage APKTime
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
    // Initialize Summernote rich text editor
    $('.summernote').summernote({
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
        ],
        height: 150
    });

    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Category form submission
    $("#post_category").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_category', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_apktime_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting category:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Add App form submission
    $("#addAppForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('addApp', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_apktime_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                $('#addAppModal').modal('hide');
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error adding app:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Edit App form submission
    $("#editAppForm").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('editApp', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_apktime_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                $('#editAppModal').modal('hide');
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error updating app:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Modal close button handlers
    $('#addAppModal #closeModalBtn, #editAppModal #closeModalBtn').on('click', function () {
        $(this).closest('.modal').modal('hide');
    });

    // Add App modal trigger - Updated to use data-bs-target for Bootstrap 5
    $('[data-bs-target="#addAppModal"]').click(function () {
        $('#addAppModal').modal('show');
    });

    // Reset add app form when modal is hidden
    $('#addAppModal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        // Reset Summernote content
        $(this).find('.summernote').summernote('code', '');
    });

    // Edit app button click handler
    $('.edit-app-btn').on('click', function () {
        const $this = $(this);
        const data = $this.data();

        $('#editAppId').val(data.id);
        $('#editAppCat').val(data.cat);
        $('#editAppName').val(data.name);
        $('#editAppSource').val(data.source);
        $('#editAppImge').val(data.imge);
        $('#editAppDesc').summernote('code', data.desc);
        $('#editAppVers').val(data.vers);
        $('#editAppVidz').val(data.vidz);

        $('#editAppModal').modal('show');
    });
});

/**
 * Deletes a category after confirmation
 * @param {number} id The ID of the category to delete
 */
function deleteCategory(id) {
    if (confirm("Are you sure you want to delete this category? All apps in this category will be deleted as well.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_apktime_config.php",
            data: {
                delete_category: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting category:", error);
            }
        });
    }
}

/**
 * Populates the category form with existing category data for editing
 * @param {string} category The category name
 * @param {string} pin The category PIN
 */
function editCategory(category, pin) {
    $("#category").val(category);
    $("#pin").val(pin);

    // Update button text to indicate editing mode
    $('#post_category button[name="post_category"]').text('Update Category');

    // Scroll to the form
    $('html, body').animate({
        scrollTop: $("#post_category").offset().top - 100
    }, 500);
}

/**
 * Deletes an app after confirmation
 * @param {number} id The ID of the app to delete
 */
function deleteApp(id) {
    if (confirm("Are you sure you want to delete this app?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_apktime_config.php",
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