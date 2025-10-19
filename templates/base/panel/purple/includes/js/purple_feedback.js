/**
 * Purple Player Feedback JavaScript
 * 
 * Handles DataTable initialization and CRUD operations for Purple Player feedback
 * and report management including viewing and deleting feedback entries.
 * 
 * @package Cockpit
 * @subpackage Purple
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
 * Delete report with confirmation
 * 
 * @param {number} id - Report ID to delete
 */
function deleteReport(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid report ID:', id);
        return;
    }

    if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_feedback.php",
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
            }
        });
    }
}

/**
 * Delete feedback with confirmation
 * 
 * @param {number} id - Feedback ID to delete
 */
function deleteFeedback(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid feedback ID:', id);
        return;
    }

    if (confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_feedback.php",
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
            }
        });
    }
}

/**
 * View feedback/report details in modal
 * 
 * @param {string} content - Content to display
 * @param {string} type - Type of content (feedback/report)
 */
function viewDetails(content, type) {
    if (!content) {
        console.error('No content to display');
        return;
    }

    const modalTitle = type === 'report' ? 'Report Details' : 'Feedback Details';

    // Create or update modal
    let modal = $('#detailsModal');
    if (!modal.length) {
        const modalHtml = `
            <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="detailsModalLabel">${modalTitle}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="modalContent"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modalHtml);
        modal = $('#detailsModal');
    } else {
        modal.find('.modal-title').text(modalTitle);
    }

    // Set content and show modal
    modal.find('#modalContent').html(content);
    modal.modal('show');
}

/**
 * Mark feedback as read/unread
 * 
 * @param {number} id - Feedback ID
 * @param {boolean} isRead - Mark as read (true) or unread (false)
 */
function markAsRead(id, isRead = true) {
    if (!id || isNaN(id)) {
        console.error('Invalid feedback ID:', id);
        return;
    }

    $.ajax({
        type: "POST",
        url: "./includes/post_purple_feedback.php",
        data: {
            mark_read: 1,
            id: id,
            is_read: isRead ? 1 : 0,
            csrf_token: getCsrfToken()
        },
        success: function () {
            // Update the UI without full reload
            const row = $(`[data-id="${id}"]`).closest('tr');
            if (isRead) {
                row.removeClass('table-warning').addClass('table-light');
            } else {
                row.removeClass('table-light').addClass('table-warning');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error updating read status:', status, error);
        }
    });
}

/**
 * Export feedback data
 * 
 * @param {string} format - Export format (csv, excel)
 */
function exportFeedback(format = 'csv') {
    const table = $('#datatableFandR').DataTable();

    if (format === 'csv') {
        table.button('.buttons-csv').trigger();
    } else if (format === 'excel') {
        table.button('.buttons-excel').trigger();
    }
}

/**
 * Filter feedback by type
 * 
 * @param {string} type - Filter type (all, reports, feedback)
 */
function filterByType(type) {
    const table = $('#datatableFandR').DataTable();

    if (type === 'all') {
        table.search('').draw();
    } else {
        table.search(type).draw();
    }
}

/**
 * Clear all filters
 */
function clearFilters() {
    const table = $('#datatableFandR').DataTable();
    table.search('').columns().search('').draw();
}

/**
 * Refresh feedback table
 */
function refreshTable() {
    location.reload();
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
    if ($('#datatableFandR').length) {
        $('#datatableFandR').DataTable({
            dom: "<'row mb-3'<'col-sm-4'l><'col-sm-8 text-end'<'d-flex justify-content-end'fB>>>t<'d-flex align-items-center'<'me-auto'i><'mb-0'p>>",
            lengthMenu: [10, 20, 30, 40, 50],
            responsive: true,
            buttons: [
                {
                    extend: 'csv',
                    className: 'btn-sm btn-outline-theme',
                    text: 'Export CSV'
                },
                {
                    extend: 'excel',
                    className: 'btn-sm btn-outline-theme',
                    text: 'Export Excel'
                }
            ],
            order: [[0, 'desc']],
            pageLength: 20,
            language: {
                search: "Search feedback:",
                lengthMenu: "Show _MENU_ entries per page",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoEmpty: "No feedback entries found",
                infoFiltered: "(filtered from _MAX_ total entries)",
                emptyTable: "No feedback or reports available",
                zeroRecords: "No matching feedback found"
            }
        });
    }

    /**
     * Handle delete buttons with event delegation
     */
    $(document).on('click', '.delete-report-btn', function (e) {
        e.preventDefault();
        const reportId = $(this).data('id');
        if (reportId) {
            deleteReport(reportId);
        }
    });

    $(document).on('click', '.delete-feedback-btn', function (e) {
        e.preventDefault();
        const feedbackId = $(this).data('id');
        if (feedbackId) {
            deleteFeedback(feedbackId);
        }
    });

    /**
     * Handle view details buttons
     */
    $(document).on('click', '.view-details-btn', function (e) {
        e.preventDefault();
        const content = $(this).data('content');
        const type = $(this).data('type');
        viewDetails(content, type);
    });

    /**
     * Keyboard shortcuts for common actions
     */
    $(document).on('keydown', function (e) {
        // Escape to close modals
        if (e.which === 27) {
            $('.modal').modal('hide');
        }

        // Ctrl+R to refresh table
        if (e.ctrlKey && e.which === 82) {
            e.preventDefault();
            refreshTable();
        }
    });
});