/**
 * Smarters Pro Feedback JavaScript
 * 
 * Handles UI interactions for the Smarters Pro feedback management page,
 * including DataTables initialization and AJAX operations for feedback and report management.
 * 
 * @package Cockpit
 * @subpackage SmartersPro
 * @author Ian O'Neill
 * @version see version.json
 */

/**
 * Get CSRF token from the form
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Delete feedback entry with confirmation
 * 
 * @param {number} id - The ID of the feedback entry to delete
 */
function deleteFeedback(id) {
    if (confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
        const row = $(`tr[data-feedback-id="${id}"]`);
        if (row.length) {
            row.addClass('table-active');
        }

        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_feedback.php",
            data: {
                delete_feedback: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting feedback:', status, error);
                if (row.length) {
                    row.removeClass('table-active');
                }
            }
        });
    }
}

/**
 * Delete report entry with confirmation
 * 
 * @param {number} id - The ID of the report entry to delete
 */
function deleteReport(id) {
    if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
        const row = $(`tr[data-report-id="${id}"]`);
        if (row.length) {
            row.addClass('table-active');
        }

        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_feedback.php",
            data: {
                delete_report: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting report:', status, error);
                if (row.length) {
                    row.removeClass('table-active');
                }
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
     * Initialize DataTable for feedback and reports
     */
    $('#datatableFandR').DataTable({
        dom: "<'row mb-3'<'col-sm-4'l><'col-sm-8 text-end'<'d-flex justify-content-end'fB>>>t<'d-flex align-items-center'<'me-auto'i><'mb-0'p>>",
        lengthMenu: [10, 20, 30, 40, 50],
        responsive: true,
        buttons: [
            {
                extend: 'csv',
                className: 'btn-sm btn-outline-theme',
                text: 'Export CSV'
            }
        ],
        language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoEmpty: "Showing 0 to 0 of 0 entries",
            infoFiltered: "(filtered from _MAX_ total entries)",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        }
    });
});