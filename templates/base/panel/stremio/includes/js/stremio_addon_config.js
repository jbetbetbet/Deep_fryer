/**
 * Stremio Addon Configuration JavaScript
 * 
 * Handles client-side functionality for Stremio addon management.
 * 
 * @package Cockpit
 * @subpackage Stremio
 * @author Ian O'Neill
 * @version See version.json
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Initialize page functionality on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // Initialize drag and drop functionality
    initializeDragAndDrop();

    // Provider form submission
    $("#post_provider").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_provider', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_stremio_addon_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting provider:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Modal close button handlers
    $('#addAddonModal #closeModalBtn, #editAddonModal #closeModalBtn').on('click', function () {
        $(this).closest('.modal').modal('hide');
    });

    // Add addon modal trigger
    $('[data-bs-target="#addAddonModal"]').click(function () {
        $('#addAddonModal').modal('show');
    });

    // Reset form when modal is closed
    $('#addAddonModal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    });

    // Edit addon button handler
    $('.edit-addon-btn').on('click', function () {
        const $this = $(this);
        const data = $this.data();

        // Populate form fields with addon data
        $('#editAddonId').val(data.id);
        $('#editAddonName').val(data.name);
        $('#editAddonLogo').val(data.logo);
        $('#editAddonDescription').val(data.description);
        $('#editAddonManifest').val(data.manifest);
        $('#editAddonStatus').val(data.status);

        $('#editAddonModal').modal('show');
    });
});

/**
 * Initialize drag and drop functionality for addon reordering
 */
function initializeDragAndDrop() {
    const container = document.getElementById('addons-container');
    if (!container) return;

    let draggedElement = null;
    let draggedOverElement = null;

    // Add dragstart event to all addon items
    container.addEventListener('dragstart', function (e) {
        if (e.target.closest('.addon-item')) {
            draggedElement = e.target.closest('.addon-item');
            draggedElement.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', draggedElement.innerHTML);
        }
    });

    // Add dragend event
    container.addEventListener('dragend', function (e) {
        if (draggedElement) {
            draggedElement.style.opacity = '1';
            draggedElement = null;
        }
        // Remove all drag-over classes
        $('.addon-item').removeClass('drag-over');
    });

    // Add dragover event
    container.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.addon-item[style*="opacity: 0.5"]');

        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    });

    // Add drop event
    container.addEventListener('drop', function (e) {
        e.preventDefault();
        if (draggedElement) {
            updateAddonOrder();
        }
    });

    // Make addon items draggable
    $('.addon-item').each(function () {
        $(this).attr('draggable', true);

        // Add visual feedback for drag handles
        $(this).find('.drag-handle').on('mouseenter', function () {
            $(this).closest('.addon-item').addClass('drag-ready');
        }).on('mouseleave', function () {
            $(this).closest('.addon-item').removeClass('drag-ready');
        });
    });
}

/**
 * Get the element that should come after the dragged element
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.addon-item:not([style*="opacity: 0.5"])')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Update addon order in database after drag and drop
 */
function updateAddonOrder() {
    const addonIds = [];
    $('#addons-container .addon-item').each(function () {
        addonIds.push($(this).data('addon-id'));
    });

    // Show loading indicator
    const container = $('#addons-container');
    container.addClass('updating-order');

    $.ajax({
        type: "POST",
        url: "./includes/post_stremio_addon_config.php",
        data: {
            updateAddonOrder: 1,
            addonOrder: addonIds,
            csrf_token: getCsrfToken()
        },
        success: function (response) {
            container.removeClass('updating-order');

            // Show success message
            showToast('Addon order updated successfully', 'success');
        },
        error: function (xhr, status, error) {
            container.removeClass('updating-order');
            console.error("Error updating addon order:", error);

            // Show error message and reload to restore original order
            showToast('Error updating addon order. Page will reload.', 'error');
            setTimeout(() => location.reload(), 2000);
        }
    });
}

/**
 * Show toast notification
 */
function showToast(message, type) {
    const toastHtml = `
        <div class="toast fade show mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
            <div class="toast-header">
                <i class="fas ${type === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger'} me-2"></i>
                <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    $('.toasts-container').append(toastHtml);
    const toast = new bootstrap.Toast($('.toasts-container .toast').last()[0]);
    toast.show();
}

/**
 * Deletes a provider after confirmation
 * @param {number} id The ID of the provider to delete
 */
function deleteProvider(id) {
    if (confirm("Are you sure you want to delete this provider?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_stremio_addon_config.php",
            data: {
                delete_provider: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting provider:", error);
            }
        });
    }
}

/**
 * Disables an addon after confirmation
 * @param {number} id The ID of the addon to disable
 */
function disableAddon(id) {
    if (confirm("Are you sure you want to disable this addon?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_stremio_addon_config.php",
            data: {
                disableAddon: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error disabling addon:", error);
            }
        });
    }
}

/**
 * Deletes an addon after confirmation
 * @param {number} id The ID of the addon to delete
 */
function deleteAddon(id) {
    if (confirm("Are you sure you want to delete this addon?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_stremio_addon_config.php",
            data: {
                deleteAddon: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting addon:", error);
            }
        });
    }
}

/**
 * Enables an addon after confirmation
 * @param {number} id The ID of the addon to enable
 */
function enableAddon(id) {
    if (confirm("Are you sure you want to re-enable this addon?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_stremio_addon_config.php",
            data: {
                enableAddon: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error enabling addon:", error);
            }
        });
    }
}

/**
 * Populates the provider form with existing provider data for editing
 * @param {string} provider The provider name
 * @param {string} apikey The API key for the provider
 */
function editProvider(provider, apikey) {
    $("#provider").val(provider);
    $("#apikey").val(apikey);
    $("#provider").focus();

    $("#post_provider button[type='submit']").text("Update Provider");

    $('html, body').animate({
        scrollTop: $("#post_provider").offset().top
    }, 500);
}