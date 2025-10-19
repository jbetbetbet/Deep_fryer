/**
 * FrameView WebView JavaScript
 * 
 * Handles layout selection, URL updates, and configuration
 * for the FrameView WebView interface.
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
        // Initialize layout selector
        initializeLayoutSelector();

        // Initialize URL input handlers
        initializeUrlHandlers();

        // Initialize preview iframe handling
        initializePreview();

        // Initialize iframe resizing functionality
        initializeIframeResizing();
    } catch (error) {
        console.error('Error during UI initialization:', error);
    }
}

/**
 * Initialize layout selector with AJAX update
 */
function initializeLayoutSelector() {
    try {
        $('#layout').on('change', function () {
            showLoadingIndicator(true);

            $.ajax({
                type: 'post',
                url: './includes/post_webview_frameview.php',
                data: {
                    post_frameview_layout: 1,
                    layout: $(this).val(),
                    csrf_token: getCsrfToken()
                },
                success: function (response) {
                    try {
                        // Try to parse response as JSON if available
                        const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;

                        if (jsonResponse && jsonResponse.success === false) {
                            showError(jsonResponse.message || 'Unknown error occurred');
                            showLoadingIndicator(false);
                        } else {
                            refreshPage();
                        }
                    } catch (e) {
                        // If not JSON or error parsing, just refresh page
                        refreshPage();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', error);
                    showError('Failed to update layout: ' + error);
                    showLoadingIndicator(false);
                }
            });
        });
    } catch (error) {
        console.error('Error initializing layout selector:', error);
    }
}

/**
 * Initialize URL input handlers for each frame
 */
function initializeUrlHandlers() {
    try {
        // URL input validation and update
        $('.frame-url-input').each(function () {
            const input = $(this);
            const frameId = input.data('frame-id');

            // Add blur event for auto-update
            input.on('blur', function () {
                updateFrameUrl(frameId, input.val());
            });

            // Add key press event for Enter key
            input.on('keypress', function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    updateFrameUrl(frameId, input.val());
                }
            });
        });

        // Frame update buttons
        $('.update-frame-btn').on('click', function () {
            const frameId = $(this).data('frame-id');
            const url = $('#url_' + frameId).val();
            updateFrameUrl(frameId, url);
        });
    } catch (error) {
        console.error('Error initializing URL handlers:', error);
    }
}

/**
 * Update a frame's URL via AJAX
 * 
 * @param {string|number} frameId - ID of the frame to update
 * @param {string} url - URL to set for the frame
 */
function updateFrameUrl(frameId, url) {
    try {
        // Basic URL validation
        if (url && !url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
            $('#url_' + frameId).val(url);
        }

        showLoadingIndicator(true);

        $.ajax({
            type: 'post',
            url: './includes/post_webview_frameview.php',
            data: {
                post_frameview_url: 1,
                frame_id: frameId,
                url: url,
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                try {
                    // Try to parse response as JSON if available
                    const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;

                    if (jsonResponse && jsonResponse.success === false) {
                        showError(jsonResponse.message || 'Failed to update URL');
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
                showError('Failed to update URL: ' + error);
            },
            complete: function () {
                showLoadingIndicator(false);
            }
        });
    } catch (error) {
        console.error('Error updating frame URL:', error);
        showLoadingIndicator(false);
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
                showError('Failed to load preview content');
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
        const iframeWrapper = document.querySelector('.iframe-wrapper');
        const resizeHandle = document.querySelector('.resize-handle');
        const widthDisplay = document.getElementById('iframeWidth');
        const heightDisplay = document.getElementById('iframeHeight');
        const resolutionLabel = document.querySelector('.resolution-label');
        const presetButtons = document.querySelectorAll('.resolution-presets button');

        if (!iframe || !spinner || !iframeWrapper || !resizeHandle ||
            !widthDisplay || !heightDisplay || !resolutionLabel) {
            console.error('Required iframe elements not found');
            return;
        }

        // Initial size display
        updateDimensionDisplay();

        // Handle iframe load events
        iframe.onload = function () {
            spinner.style.display = 'none';
            iframe.style.display = 'block';
            updateDimensionDisplay();
        };

        iframe.onerror = function () {
            spinner.style.display = 'none';
            console.error('Failed to load the iframe content');
            showError('Failed to load preview content');
        };

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
                refreshPreview();
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
                refreshPreview();
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
        const iframeWrapper = document.querySelector('.iframe-wrapper');
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
            const timestamp = new Date().getTime();
            const currentSrc = iframe.src;
            const newSrc = currentSrc.includes('?')
                ? `${currentSrc}&_=${timestamp}`
                : `${currentSrc}?_=${timestamp}`;

            iframe.src = newSrc;
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
        let $loader = $('.frameview-ajax-loader');
        if (!$loader.length) {
            $loader = $('<div class="frameview-ajax-loader">Updating settings...</div>')
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
        let $error = $('.frameview-error-notification');
        if (!$error.length) {
            $error = $('<div class="frameview-error-notification"></div>')
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
 * Get CSRF token from the page
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val() || '';
}

/**
 * Refresh the page with a delay
 */
function refreshPage() {
    try {
        showLoadingIndicator(true);
        setTimeout(function () {
            location.reload();
        }, 500);
    } catch (error) {
        console.error('Error refreshing page:', error);
    }
}