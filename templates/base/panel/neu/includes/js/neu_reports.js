/**
 * Purple Neu Reports JavaScript
 * 
 * Handles client-side functionality for the Purple Neu Reports management including
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
            url: "./includes/post_neu_reports.php",
            data: {
                delete_item: 1,
                delete_id: id,
                delete_type: 'report',
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

/**
 * Deletes a request after confirmation
 * @param {number} id The ID of the request to delete
 */
function deleteRequest(id) {
    if (confirm("Are you sure you want to delete this user request?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                delete_item: 1,
                delete_id: id,
                delete_type: 'request',
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting request:", error);
            }
        });
    }
}

/**
 * Denies a user request after confirmation
 * @param {number} id The ID of the request to deny
 */
function denyRequest(id) {
    if (confirm("Are you sure you want to deny this user request?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                update_status: 1,
                request_id: id,
                status_action: 'deny',
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error denying request:", error);
            }
        });
    }
}

/**
 * Approves a user request
 * @param {number} id The ID of the request to approve
 */
function approveRequest(id) {
    if (confirm("Are you sure you want to approve this user request?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                update_status: 1,
                request_id: id,
                status_action: 'approve',
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error approving request:", error);
            }
        });
    }
}

/**
 * Legacy function for deleting reports (maintained for backward compatibility)
 * @param {number} id The ID of the report to delete
 */
function deleteLegacyReport(id) {
    if (confirm("Are you sure you want to delete this report?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                delete_report: 1,
                id: id,
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

/**
 * Legacy function for deleting requests (maintained for backward compatibility)
 * @param {number} id The ID of the request to delete
 */
function deleteLegacyRequest(id) {
    if (confirm("Are you sure you want to delete this user request?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                delete_request: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting request:", error);
            }
        });
    }
}

/**
 * Legacy function for denying requests (maintained for backward compatibility)
 * @param {number} id The ID of the request to deny
 */
function denyLegacyRequest(id) {
    if (confirm("Are you sure you want to deny this user request?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                deny_request: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error denying request:", error);
            }
        });
    }
}

/**
 * Legacy function for approving requests (maintained for backward compatibility)
 * @param {number} id The ID of the request to approve
 */
function approveLegacyRequest(id) {
    if (confirm("Are you sure you want to approve this user request?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_neu_reports.php",
            data: {
                approve_request: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error approving request:", error);
            }
        });
    }
}