/**
 * XCIPTV Customization JavaScript
 * 
 * Handles tab navigation, URL parameter processing, and
 * interface elements for the XCIPTV customization interface.
 * 
 * @package   Cockpit
 * @subpackage XCIPTV
 * @author    Ian O'Neill
 * @version   see version.json
 */

// Handle tab click to hide pre-text
const tabLinks = document.querySelectorAll(".tab-content .nav-link");
const preText = document.getElementById("pre-text");

// Add click listeners to hide pre-text when tab links are clicked
if (preText) {
    tabLinks.forEach((link) => {
        link.addEventListener("click", () => {
            preText.style.display = "none";
        });
    });
}

/**
 * Initialize tabs and navigation based on URL parameters
 */
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Process URL parameters to show the correct tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const navsParam = urlParams.get('navs');

    // Activate main tab if specified in URL
    if (tabParam) {
        $('#tabs a[href="#' + tabParam + '"]').tab('show');
    }

    // Activate nested tab if specified in URL
    if (navsParam) {
        $('#navs a[href="#' + navsParam + '"]').tab('show');
    }
});