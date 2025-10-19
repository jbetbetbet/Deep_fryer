/**
 * Sport TV Guide WebView JavaScript
 * 
 * Handles color picker initialization, sport selection with search,
 * form submission and iframe resizing for Sport TV Guide WebView configuration.
 * 
 * @package Cockpit
 * @subpackage WebView
 * @author Ian O'Neill
 * @version see version.json
 */

// Initialize components when document is ready
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
    try {
        // Initialize color pickers
        initializeColorPickers();

        // Initialize sport pickers with search
        initializeSportPickers();

        // Set up form submission handler
        initializeFormHandler();

        // Initialize preview iframe handling
        initializePreview();

        // Initialize iframe resizing functionality
        initializeIframeResizing();
    } catch (error) {
        console.error('Error during UI initialization:', error);
    }
}

/**
 * Initialize color pickers for background and borders
 */
function initializeColorPickers() {
    try {
        if (typeof $.fn.spectrum === 'function') {
            ['#stg_bg', '#stg_bgs'].forEach(function (elementId) {
                $(elementId).spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    showPalette: true,
                    showInitial: true,
                    palette: [
                        ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                        ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                        ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                        ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                        ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                        ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                        ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                        ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                    ]
                });
            });
        }
    } catch (error) {
        console.error('Error initializing color pickers:', error);
    }
}

/**
 * Initialize sport pickers with search functionality
 */
function initializeSportPickers() {
    try {
        ['#stg_sports', '#stg_fc'].forEach(function (elementId) {
            $(elementId).picker({
                search: true,
                searchPlaceholder: elementId === '#stg_sports' ? 'Search sports...' : 'Search channels...'
            });
        });
    } catch (error) {
        console.error('Error initializing sport pickers:', error);
    }
}

/**
 * Initialize form submission handler with AJAX
 */
function initializeFormHandler() {
    try {
        $("#post_sport_tv_guide").on("submit", function (e) {
            e.preventDefault();

            // Show loading indicator
            showLoadingIndicator(true);

            var formData = new FormData(this);
            formData.append('post_sport_tv_guide', '1');
            formData.append('csrf_token', getCsrfToken());

            $.ajax({
                type: "POST",
                url: "./includes/post_webview_sport_tv_guide.php",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    try {
                        // Try to parse response as JSON if available
                        const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;

                        if (jsonResponse && jsonResponse.success === false) {
                            showError(jsonResponse.message || 'Unknown error occurred');
                        } else {
                            refreshPreview();
                        }
                    } catch (e) {
                        // If not JSON or error parsing, just refresh preview
                        refreshPreview();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', error);
                    showError('Failed to update settings: ' + error);
                },
                complete: function () {
                    showLoadingIndicator(false);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up form handler:', error);
    }
}

/**
 * Initialize preview iframe and loading spinner
 */
function initializePreview() {
    try {
        const iframe = $('#webviewIframe');
        const spinner = $('#spinner');

        // Handle iframe load event
        if (iframe.length) {
            iframe.on('load', function () {
                spinner.hide();
                iframe.show();
                updateDimensionDisplay();
            });

            // Handle iframe error
            iframe.on('error', function () {
                spinner.hide();
                console.error('Failed to load preview');
            });
        }
    } catch (error) {
        console.error('Error initializing preview:', error);
    }
}

/**
 * Initialize iframe resizing functionality
 */
function initializeIframeResizing() {
    try {
        const iframe = document.getElementById('webviewIframe');
        const spinner = document.getElementById('spinner');
        const iframeWrapper = document.getElementById('iframeWrapper');
        const resizeHandle = document.getElementById('resizeHandle');
        const widthDisplay = document.getElementById('iframeWidth');
        const heightDisplay = document.getElementById('iframeHeight');
        const resolutionLabel = document.getElementById('resolutionLabel');
        const presetButtons = document.querySelectorAll('.resolution-presets button');

        if (!iframe || !iframeWrapper || !resizeHandle ||
            !widthDisplay || !heightDisplay || !resolutionLabel) {
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

        resizeHandle.addEventListener('mousedown', function (e) {
            isResizing = true;
            lastX = e.clientX;
            lastY = e.clientY;
            startWidth = iframeWrapper.offsetWidth;
            startHeight = iframeWrapper.offsetHeight;

            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isResizing) return;

            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;

            iframeWrapper.style.width = (startWidth + deltaX) + 'px';
            iframeWrapper.style.height = (startHeight + deltaY) + 'px';

            updateDimensionDisplay();
            resolutionLabel.textContent = 'Custom Size';
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

                resolutionLabel.textContent = this.textContent;
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
    try {
        const iframeWrapper = document.getElementById('iframeWrapper');
        const widthDisplay = document.getElementById('iframeWidth');
        const heightDisplay = document.getElementById('iframeHeight');

        if (iframeWrapper && widthDisplay && heightDisplay) {
            const width = iframeWrapper.clientWidth;
            const height = iframeWrapper.clientHeight;

            widthDisplay.textContent = Math.round(width);
            heightDisplay.textContent = Math.round(height);
        }
    } catch (error) {
        console.error('Error updating dimension display:', error);
    }
}

/**
 * Reload the iframe with a cache-busting parameter
 */
function reloadIframe() {
    try {
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
    } catch (error) {
        console.error('Error reloading iframe:', error);
    }
}

/**
 * Get CSRF token from the page
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val() || '';
}

/**
 * Refresh the preview iframe with current settings
 */
function refreshPreview() {
    try {
        const iframe = document.getElementById('webviewIframe');
        const spinner = document.getElementById('spinner');

        if (iframe && spinner) {
            spinner.style.display = 'block';
            iframe.style.display = 'none';

            // Reload iframe with a cache-busting parameter
            reloadIframe();
        } else {
            // If preview not available, fall back to page reload
            location.reload();
        }
    } catch (error) {
        console.error('Error refreshing preview:', error);
    }
}

/**
 * Show or hide loading indicator
 * 
 * @param {boolean} show - Whether to show or hide the indicator
 */
function showLoadingIndicator(show) {
    try {
        // Create loading indicator if it doesn't exist
        let $loader = $('.stg-ajax-loader');
        if (!$loader.length) {
            $loader = $('<div class="stg-ajax-loader">Updating Sport TV Guide settings...</div>')
                .css({
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    padding: '8px 15px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '4px',
                    zIndex: 9999,
                    display: 'none'
                })
                .appendTo('body');
        }

        show ? $loader.fadeIn(200) : $loader.fadeOut(200);
    } catch (error) {
        console.error('Error handling loading indicator:', error);
    }
}

/**
 * Show error message to the user
 * 
 * @param {string} message - The error message to display
 */
function showError(message) {
    try {
        // Create error notification if it doesn't exist
        let $error = $('.stg-error-notification');
        if (!$error.length) {
            $error = $('<div class="stg-error-notification"></div>')
                .css({
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    padding: '10px 15px',
                    background: '#d9534f',
                    color: 'white',
                    borderRadius: '4px',
                    zIndex: 9999,
                    display: 'none'
                })
                .appendTo('body');
        }

        $error.text(message).fadeIn(200).delay(5000).fadeOut(200);
    } catch (error) {
        console.error('Error showing error message:', error);
        // Fallback to alert for critical errors
        alert(message);
    }
}