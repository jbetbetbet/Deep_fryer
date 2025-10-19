/**
 * Q Deluxe Reports JavaScript
 * 
 * Handles client-side functionality for the Q Deluxe Reports management including
 * report and request actions, AJAX requests, and UI interactions.
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
    
});

/**
 * Deletes a report after confirmation
 * @param {number} id The ID of the report to delete
 */
function deleteReport(id) {
    if (confirm("Are you sure you want to delete this report?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_reports.php",
            data: {
                delete_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting report:", error);
            }
        });
    }
}