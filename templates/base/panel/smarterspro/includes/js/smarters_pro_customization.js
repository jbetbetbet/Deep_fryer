/**
 * Smarters Pro Customization JavaScript
 * 
 * Handles UI interactions for the Smarters Pro customization page,
 * including form submissions, file uploads, and picker initialization.
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
 * Remove uploaded file with confirmation
 * 
 * @param {string} fileType - The type of file to remove (e.g., 'logo', 'background')
 */
function removeUploadedFile(fileType) {
    if (confirm(`Are you sure you want to remove the ${fileType} file?`)) {
        $.ajax({
            type: 'POST',
            url: './includes/post_smarters_pro_customization.php',
            data: {
                remove_file: 1,
                file_type: fileType,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error removing file:', status, error);
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
     * Initialize sidebar leagues picker with search functionality
     */
    try {
        $('#sidebar_leagues').picker({ search: true });
    } catch (e) {
        console.error('Error initializing sidebar leagues picker:', e);
    }

    /**
     * File selection preview for image uploads
     * Shows preview of selected images before upload
     */
    $('input[type="file"]').on('change', function () {
        const fileInput = $(this);
        const previewId = fileInput.attr('data-preview');

        if (previewId && this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $(`#${previewId}`).attr('src', e.target.result);
            };

            reader.readAsDataURL(this.files[0]);
        }
    });

    /**
     * Form submission handling with loading state
     * Disables submit button and shows spinner during processing
     */
    $('#file-upload-form, #ajax-form').on('submit', function () {
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true);
        submitBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...');
        return true;
    });

    /**
     * Initialize color pickers if library is available
     */
    if (typeof $.fn.colorpicker !== 'undefined') {
        $('.colorpicker-input').colorpicker({
            format: 'hex',
            component: '.input-group-append'
        });
    }

    /**
     * Toggle sections to improve UI organization
     * Allows collapsing/expanding form sections
     */
    $('.section-toggle').on('click', function () {
        const target = $(this).data('target');
        $(`#${target}`).slideToggle(300);
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
    });

    /**
     * Handle file input reset functionality
     * Clears file input and resets preview image
     */
    $('.file-reset').on('click', function () {
        const targetInput = $(this).data('target');
        const previewId = $(this).data('preview');

        if (targetInput) {
            $(`#${targetInput}`).val('');
        }

        if (previewId) {
            $(`#${previewId}`).attr('src', './assets/img/placeholder.png');
        }
    });

    /**
     * Handle drag and drop file uploads
     */
    $('.file-drop-zone').on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass('drag-over');
    });

    $('.file-drop-zone').on('dragleave', function (e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
    });

    $('.file-drop-zone').on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('drag-over');

        const files = e.originalEvent.dataTransfer.files;
        const inputId = $(this).data('input');

        if (files.length > 0 && inputId) {
            $(`#${inputId}`)[0].files = files;
            $(`#${inputId}`).trigger('change');
        }
    });
});