/**
 * StreamBox Feedback JavaScript
 * 
 * Handles the client-side functionality for the StreamBox Feedback page,
 * including DataTable initialization and report management.
 * 
 * @package Cockpit
 * @subpackage StreamBox
 */

// Global utility functions
/**
 * Retrieves the CSRF token from the page
 * 
 * @return {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Deletes a report after confirmation
 * 
 * @param {number} report_id - ID of the report to delete
 */
function deleteReport(report_id) {
    if (confirm("Are you sure you want to delete this report?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_streambox_feedback.php",
            data: {
                delete_report: 1,
                report_id: report_id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting report:", error);
                alert("Error deleting report. Please try again.");
            }
        });
    }
}

// Initialize components when document is ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Initialize DataTable for feedback and reports
    $('#datatableFandR').DataTable({
        dom: "<'row mb-3'<'col-sm-4'l><'col-sm-8 text-end'<'d-flex justify-content-end'fB>>>t<'d-flex align-items-center'<'me-auto'i><'mb-0'p>>",
        lengthMenu: [10, 20, 30, 40, 50],
        responsive: true,
        buttons: [
            {
                extend: 'csv',
                className: 'btn-sm btn-outline-theme',
            },
            {
                extend: 'excel',
                className: 'btn-sm btn-outline-theme',
            },
            {
                extend: 'pdf',
                className: 'btn-sm btn-outline-theme',
            }
        ]
    });

    // Add quick filter functionality
    $("#filter-input").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#datatableFandR tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});