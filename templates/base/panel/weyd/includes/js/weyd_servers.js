/**
 * Weyd Xtream Servers JavaScript
 * 
 * Handles client-side functionality for Xtream server management.
 * 
 * @package Cockpit
 * @subpackage Weyd
 * @author Ian O'Neill
 * @version See version.json
 */

// Cache for CSRF token to avoid repeated DOM queries
let cachedCsrfToken = null;

/**
 * Retrieves the CSRF token from the page with caching
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    if (!cachedCsrfToken) {
        cachedCsrfToken = $('input[name="csrf_token"]').val() || $('meta[name="csrf-token"]').attr('content') || '';
    }
    return cachedCsrfToken;
}

/**
 * Debounce function to limit the rate of function execution
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // Server form submission
    $("#post_xtream_server").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);

        // Determine if editing or adding
        var serverId = $('#server_id').val();
        var isEdit = serverId && serverId !== '';

        formData.append(isEdit ? 'edit_xtream_server' : 'post_xtream_server', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text(isEdit ? 'Updating...' : 'Adding...');

        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_servers.php",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (response) {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error saving server:", error);
                alert("Error saving server. Please try again.");
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
});

/**
 * Edits a server - populates the form with existing data
 * 
 * @param {number} serverId The ID of the server to edit
 * @param {string} serverName The name of the server
 * @param {string} serverDns The DNS/URL of the server
 */
function editXtreamServer(serverId, serverName, serverDns) {
    if (!$('#server_id').length) {
        $('#post_xtream_server').append('<input type="hidden" id="server_id" name="server_id" value="">');
    }
    $('#server_id').val(serverId);
    $('#server_name').val(serverName);
    $('#server_dns').val(serverDns);

    $('#post_xtream_server button[type="submit"]').text('Update Service');
}

/**
 * Resets the form for adding a new server
 */
function resetServerForm() {
    $('#server_id').val('');
    $('#server_name').val('');
    $('#server_dns').val('');

    $('#post_xtream_server button[type="submit"]').text('Add Service');
}

/**
 * Deletes a server after confirmation
 * 
 * @param {number} serverId The ID of the server to delete
 */
function deleteXtreamServer(serverId) {
    if (confirm("Are you sure you want to delete this Xtream server? This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_weyd_servers.php",
            data: {
                delete_xtream_server: 1,
                server_id: serverId,
                csrf_token: getCsrfToken()
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting server:", error);
                alert("Error deleting server. Please try again.");
            }
        });
    }
}

// Reset form when modal is hidden
$('#addServerModal').on('hidden.bs.modal', function () {
    resetServerForm();
});