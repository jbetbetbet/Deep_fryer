/**
 * TVSportGuide WebView JavaScript
 * 
 * Handles color picker initialization, form validation, and preview updates
 * for the TVSportGuide WebView configuration interface.
 * 
 * @package Cockpit
 * @subpackage WebView
 * @author Ian O'Neill
 * @version see version.json
 */

// Wait for the DOM to be fully loaded
$(function () {
    initializeUI();
    
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
});

/**
 * Initialize all UI components and event handlers
 */
function initializeUI() {
    // Initialize color pickers
    initializeColorPickers();

    // Set up form validation
    setupFormValidation();

    // Initialize live preview
    setupLivePreview();

    // Initialize iframe resizing functionality
    setupIframeResizing();
}

/**
 * Initialize color pickers for all color selection fields
 */
function initializeColorPickers() {
    try {
        // Common color palette for all pickers
        const colorPalette = [
            ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
        ];

        // Configure all color picker inputs - fix "boarder" typo to "border"
        ['#tvsg_boarder_color', '#tvsg_background_color', '#tvsg_text_color'].forEach(function (elementId) {
            $(elementId).spectrum({
                preferredFormat: "hex",
                showInput: true,
                showPalette: true,
                showAlpha: false,
                allowEmpty: false,
                palette: colorPalette,
                change: function (color) {
                    updatePreview();
                }
            });
        });

        // Initialize any other spectrum color pickers
        if (typeof $.fn.spectrum === 'function') {
            $(".spectrum-color").spectrum({
                type: "component",
                preferredFormat: "hex",
                showInput: true
            });
        }

        console.log('Color pickers initialized successfully');
    } catch (error) {
        console.error('Error initializing color pickers:', error);
    }
}

/**
 * Set up form validation
 */
function setupFormValidation() {
    try {
        // Get form element
        const form = document.querySelector('form');

        if (form) {
            form.addEventListener('submit', function (e) {
                // Get widget ID field
                const widgetIdField = document.getElementById('tvsg_widgetid');

                // Validate widget ID
                if (widgetIdField && widgetIdField.value.trim() === '') {
                    e.preventDefault();
                    alert('Please enter a widget ID');
                    widgetIdField.focus();
                    return false;
                }

                return true;
            });
        }
    } catch (error) {
        console.error('Error setting up form validation:', error);
    }
}

/**
 * Set up live preview functionality
 */
function setupLivePreview() {
    try {
        // Get all form inputs that should trigger preview updates
        const formInputs = document.querySelectorAll('#tvsg_site, #tvsg_widgetid, #tvsg_heading, #tvsg_autoscroll');

        // Add event listeners to form inputs
        formInputs.forEach(input => {
            input.addEventListener('change', updatePreview);
        });

        // Set up site link updates
        const siteSelect = document.getElementById('tvsg_site');
        if (siteSelect) {
            siteSelect.addEventListener('change', updateBaseSiteLink);
            // Initialize link on page load
            updateBaseSiteLink();
        }

        // Initial preview update
        updatePreview();
    } catch (error) {
        console.error('Error setting up live preview:', error);
    }
}

/**
 * Update the preview iframe with current settings
 */
function updatePreview() {
    try {
        // Get iframe and spinner elements
        const iframe = document.getElementById('webviewIframe');
        const spinner = document.getElementById('spinner');

        // Show spinner and hide iframe during loading
        if (spinner && iframe) {
            spinner.style.display = 'block';
            iframe.style.display = 'none';

            // Get current form values
            const site = document.getElementById('tvsg_site')?.value || '';
            const widgetId = document.getElementById('tvsg_widgetid')?.value || '';
            const heading = document.getElementById('tvsg_heading')?.value || '';
            const borderColor = document.getElementById('tvsg_boarder_color')?.value || '#000000';
            const backgroundColor = document.getElementById('tvsg_background_color')?.value || '#ffffff';
            const textColor = document.getElementById('tvsg_text_color')?.value || '#000000';
            const autoScroll = document.getElementById('tvsg_autoscroll')?.checked ? '1' : '0';

            // Build preview URL with parameters
            const previewUrl = `./../../api/webview/tvsportguide.php?site=${encodeURIComponent(site)}&widgetid=${encodeURIComponent(widgetId)}&heading=${encodeURIComponent(heading)}&border=${encodeURIComponent(borderColor.replace('#', ''))}&bg=${encodeURIComponent(backgroundColor.replace('#', ''))}&text=${encodeURIComponent(textColor.replace('#', ''))}&auto=${autoScroll}`;

            // Update iframe source
            iframe.src = previewUrl;

            // Handle iframe load event
            iframe.onload = function () {
                spinner.style.display = 'none';
                iframe.style.display = 'block';
                updateDimensionDisplay();
            };

            // Handle iframe error
            iframe.onerror = function () {
                spinner.style.display = 'none';
                console.error('Failed to load preview');
            };
        }
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

/**
 * Set up iframe resizing functionality
 */
function setupIframeResizing() {
    try {
        const iframe = document.getElementById('webviewIframe');
        const spinner = document.getElementById('spinner');
        const iframeWrapper = document.getElementById('iframeWrapper');
        const resizeHandle = document.getElementById('resizeHandle');
        const widthDisplay = document.getElementById('iframeWidth');
        const heightDisplay = document.getElementById('iframeHeight');
        const resolutionLabel = document.getElementById('resolutionLabel');
        const presetButtons = document.querySelectorAll('.resolution-presets button');

        if (!iframe || !iframeWrapper) {
            console.error('Required iframe elements not found');
            return;
        }

        // Initial size display
        updateDimensionDisplay();

        // Listen for resize events on the wrapper
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                updateDimensionDisplay();
            });

            resizeObserver.observe(iframeWrapper);
        }

        // Manual resize functionality
        let isResizing = false;
        let lastX, lastY, startWidth, startHeight;

        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', function (e) {
                isResizing = true;
                lastX = e.clientX;
                lastY = e.clientY;
                startWidth = iframeWrapper.offsetWidth;
                startHeight = iframeWrapper.offsetHeight;

                document.body.style.userSelect = 'none';
                e.preventDefault();
            });
        }

        document.addEventListener('mousemove', function (e) {
            if (!isResizing) return;

            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;

            iframeWrapper.style.width = (startWidth + deltaX) + 'px';
            iframeWrapper.style.height = (startHeight + deltaY) + 'px';

            updateDimensionDisplay();
            if (resolutionLabel) {
                resolutionLabel.textContent = 'Custom Size';
            }
        });

        document.addEventListener('mouseup', function () {
            if (isResizing) {
                isResizing = false;
                document.body.style.userSelect = '';

                // Reload iframe to ensure proper rendering at new size
                reloadIframe();
            }
        });

        // Handle preset buttons
        presetButtons.forEach(button => {
            button.addEventListener('click', function () {
                const width = this.dataset.width;
                const height = this.dataset.height;
                const isPercent = this.dataset.percent === 'true';

                if (isPercent) {
                    const containerWidth = iframeWrapper.parentElement.clientWidth;
                    iframeWrapper.style.width = containerWidth * (parseInt(width) / 100) + 'px';
                    iframeWrapper.style.height = (containerWidth * (parseInt(width) / 100) * (9 / 16)) + 'px';
                } else {
                    iframeWrapper.style.width = width + 'px';
                    iframeWrapper.style.height = height + 'px';
                }

                if (resolutionLabel) {
                    resolutionLabel.textContent = this.textContent;
                }
                updateDimensionDisplay();

                // Reload iframe to ensure proper rendering at new size
                reloadIframe();
            });
        });
    } catch (error) {
        console.error('Error setting up iframe resizing:', error);
    }
}

/**
 * Update the dimension display with current iframe wrapper dimensions
 */
function updateDimensionDisplay() {
    const iframeWrapper = document.getElementById('iframeWrapper');
    const widthDisplay = document.getElementById('iframeWidth');
    const heightDisplay = document.getElementById('iframeHeight');

    if (iframeWrapper && widthDisplay && heightDisplay) {
        const width = iframeWrapper.clientWidth;
        const height = iframeWrapper.clientHeight;

        widthDisplay.textContent = Math.round(width);
        heightDisplay.textContent = Math.round(height);
    }
}

/**
 * Reload the iframe with a cache-busting parameter
 */
function reloadIframe() {
    const iframe = document.getElementById('webviewIframe');
    const spinner = document.getElementById('spinner');

    if (iframe && spinner) {
        const currentSrc = iframe.src;
        spinner.style.display = 'flex';

        // Add a random parameter to force reload
        const timestamp = new Date().getTime();
        if (currentSrc.includes('?')) {
            iframe.src = currentSrc + '&_t=' + timestamp;
        } else {
            iframe.src = currentSrc + '?_t=' + timestamp;
        }
    }
}

/**
 * Update the base site link when site selection changes
 */
function updateBaseSiteLink() {
    try {
        const siteSelect = document.getElementById('tvsg_site');
        const baseSiteLink = document.getElementById('base_site_link');

        if (!siteSelect || !baseSiteLink || !window.tvsgBaseUrls) {
            return;
        }

        const selectedSite = siteSelect.value;

        if (tvsgBaseUrls[selectedSite]) {
            baseSiteLink.href = tvsgBaseUrls[selectedSite];
        } else {
            baseSiteLink.href = '#';
        }
    } catch (error) {
        console.error('Error updating base site link:', error);
    }
}