/**
 * Mega Players Languages JavaScript
 * 
 * Handles client-side functionality for the Mega Players language management including
 * inline editing of language strings and dynamic table loading.
 * 
 * @package Cockpit
 * @subpackage Megas
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Handles the construction of editable fields
 */
var handleEditableFieldConstruct = function () {
    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.inputclass = 'form-control input-sm';
    $.fn.editable.defaults.ajaxOptions = { type: "POST" };
    $.fn.editable.defaults.params = function (params) {
        params['edit_lang'] = 1;
        params['csrf_token'] = getCsrfToken();
        return params;
    };

    // Initialize editable fields for each language string
    if (typeof editableIds !== 'undefined' && editableIds.length > 0) {
        editableIds.forEach(function (id) {
            $('#' + id).editable({
                url: './includes/post_mega_languages.php',
                type: 'text',
                pk: function () {
                    return $(this).data('pk');
                },
                name: function () {
                    return $(this).data('name');
                },
                csrf_token: getCsrfToken(),
                success: function (response, newValue) {
                    // Handle successful edit
                    console.log('Language string updated successfully');
                },
                error: function (xhr, status, error) {
                    console.error('Error updating language string:', error);
                    return 'Error updating language string. Please try again.';
                }
            });
        });
    }
};

/**
 * Form editable module
 */
var FormEditable = function () {
    "use strict";
    return {
        init: function () {
            handleEditableFieldConstruct();
        }
    };
}();

// Initialize when document is ready
$(function () {
    FormEditable.init();

    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Language selector change handler
    $("#lang_select").on("change", function () {
        var language = $(this).val();

        // Show loading state
        $("#table-content").html('<tr><td colspan="3" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading language data...</td></tr>');

        $.ajax({
            url: "./includes/get_mega_languages.php",
            type: "POST",
            data: {
                "language-select": language,
                "csrf_token": getCsrfToken()
            },
            success: function (data) {
                $("#table-content").html(data);
                FormEditable.init();
            },
            error: function (xhr, status, error) {
                console.error("AJAX request failed:", error);
                $("#table-content").html('<tr><td colspan="3" class="text-center text-danger">Error loading language data. Please try again.</td></tr>');
            }
        });
    });

    // Initialize tooltips if present
    $('[data-bs-toggle="tooltip"]').tooltip();
});
