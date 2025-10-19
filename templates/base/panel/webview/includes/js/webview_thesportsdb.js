/**
 * TheSportsDB WebView JavaScript
 * 
 * Handles league picker initialization, form submissions,
 * and widget selection for TheSportsDB WebView configuration.
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
        // Initialize league picker with search
        initializeLeaguePicker();

        // Set up form submission handler
        initializeFormHandler();

        // Initialize widget change handler
        initializeWidgetSelector();

        // Initialize preview iframe handling
        initializePreview();

        // Initialize iframe resizing functionality
        initializeIframeResizing();
    } catch (error) {
        console.error('Error during UI initialization:', error);
    }
}

/**
 * Initialize league picker with search functionality
 */
function initializeLeaguePicker() {
    try {
        $('#tsdb_leagues').picker({
            search: true,
            searchPlaceholder: 'Search leagues...'
        });
    } catch (error) {
        console.error('Error initializing league picker:', error);
    }
}

/**
 * Initialize form submission handler
 */
function initializeFormHandler() {
    try {
        $("#post_thesportsdb").on("submit", function (e) {
            e.preventDefault();

            // Show loading indicator
            showLoadingIndicator(true);

            var formData = new FormData(this);
            formData.append('post_thesportsdb_leagues', '1');
            formData.append('csrf_token', getCsrfToken());

            $.ajax({
                type: "POST",
                url: "./includes/post_webview_thesportsdb.php",
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
 * Initialize widget selector
 */
function initializeWidgetSelector() {
    try {
        $('#widget').on('change', function () {
            // Show loading indicator
            showLoadingIndicator(true);

            $.ajax({
                type: 'post',
                url: './includes/post_webview_thesportsdb.php',
                data: {
                    post_thesportsdb: 1,
                    widget: $(this).val(),
                    csrf_token: getCsrfToken()
                },
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
                    showError('Failed to update widget: ' + error);
                },
                complete: function () {
                    showLoadingIndicator(false);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up widget selector:', error);
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
        let $loader = $('.tsdb-ajax-loader');
        if (!$loader.length) {
            $loader = $('<div class="tsdb-ajax-loader">Updating settings...</div>')
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
        let $error = $('.tsdb-error-notification');
        if (!$error.length) {
            $error = $('<div class="tsdb-error-notification"></div>')
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

        if (!iframe || !iframeWrapper || !resizeHandle) {
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