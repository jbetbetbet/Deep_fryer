/**
 * IBO Solutions Configuration JavaScript
 * 
 * Handles client-side functionality for the IBO Solutions configuration management including
 * API version changes, form submissions, and clipboard functionality.
 * 
 * @package Cockpit
 * @subpackage IBOSolutions
 */

/**
 * Gets the CSRF token from the page
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// Form submission and event handlers
$(function () {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize select picker for multiple league selection
    if ($('#leagues_csv').length) {
        $('#leagues_csv').picker({
            search: true,
            texts: {
                trigger: "Select leagues",
                search: "Search leagues...",
                noResult: "No leagues found"
            }
        });
    }

    // Initialize toasts with auto-hide
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // API version change handler
    $("#api_version").on("change", function () {
        var selectedVersion = $(this).val();
        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_config.php",
            data: {
                post_api_version: 1,
                api_version: selectedVersion,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error updating API version:", error);
            }
        });
    });

    // Configuration form submission
    $("#post_settings").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_settings', '1');
        formData.append('csrf_token', getCsrfToken());

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_ibosol_config.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error submitting configuration:", error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    // Clipboard functionality
    const clipboard = new ClipboardJS("[data-toggle='clipboard']");
    clipboard.on("success", function (e) {
        var $trigger = $(e.trigger);
        $trigger.tooltip({ title: "Copied", placement: "top" }).tooltip("show");
        setTimeout(function () {
            $trigger.tooltip("dispose");
        }, 500);
    });

    clipboard.on("error", function (e) {
        console.error("Clipboard copy failed:", e);
    });

    // Theme selection handlers for dynamic form showing/hiding
    $("#andyhax39theme").on("change", function () {
        toggleLayoutSixFields();
    });

    // RTX39 theme selection handler
    $("#rtx39theme").on("change", function () {
        toggleRtx39Fields();
    });

    // Initialize on page load
    toggleLayoutSixFields();
    toggleRtx39Fields();

    /**
     * Toggle Layout #6 specific fields based on theme selection
     */
    function toggleLayoutSixFields() {
        var selectedTheme = $("#andyhax39theme").val();
        var layoutFields = $(".layout-six-fields");

        if (selectedTheme === "6") {
            layoutFields.show();
        } else {
            layoutFields.hide();
        }
    }

    /**
     * Toggle RTX39 specific fields based on theme selection
     */
    function toggleRtx39Fields() {
        var selectedTheme = $("#rtx39theme").val();
        var frameAdsField = $("#frame_ads").closest('.col-lg-6');
        var autoAdsField = $("#auto_ads").closest('.col-lg-6');

        // Extract theme number from theme_X format
        var themeNumber = parseInt(selectedTheme.replace('theme_', ''));

        // Hide Background Layout (frame_ads) unless theme is 16 or 17 (theme_15 or theme_16)
        if (themeNumber === 15 || themeNumber === 16) {
            frameAdsField.show();
        } else {
            frameAdsField.hide();
        }

        // Hide TMDB Layout (auto_ads) if theme is 10-12 (theme_9, theme_10, theme_11)
        if (themeNumber >= 9 && themeNumber <= 11) {
            autoAdsField.hide();
        } else {
            autoAdsField.show();
        }
    }
});
