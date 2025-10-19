/**
 * TMDB WebView JavaScript
 * 
 * Handles color picker initialization, slider controls, 
 * checkbox toggles, and AJAX updates for the TMDB WebView
 * configuration interface.
 * 
 * @package Cockpit
 * @subpackage WebView
 * @author Ian O'Neill
 * @version see version.json
 */

// Initialize components when document is ready
$(function () {
    // Initialize components
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
        // Initialize preview iframe handling
        initializePreview();

        // Initialize color picker
        initializeColorPicker();

        // Initialize slider control
        initializeSlider();

        // Initialize checkbox controls
        initializeCheckboxes();

        // Initialize iframe resizing functionality
        initializeIframeResizing();

        // Add input validation for interval
        setupIntervalValidation();
    } catch (error) {
        console.error('Error during UI initialization:', error);
    }
}

/**
 * Initialize preview iframe and loading spinner
 */
function initializePreview() {
    try {
        const iframe = document.getElementById('webviewIframe');
        const spinner = document.getElementById('spinner');

        if (iframe && spinner) {
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
        console.error('Error initializing preview:', error);
    }
}

/**
 * Initialize color picker for border color
 */
function initializeColorPicker() {
    try {
        if (typeof $.fn.spectrum === 'function') {
            $('#borderColor').spectrum({
                preferredFormat: "hex",
                showInput: true,
                showPalette: true,
                showAlpha: true,
                allowEmpty: false,
                palette: [
                    ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                    ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                    ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                    ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                    ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                    ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                    ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                    ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                ],
                change: function (color) {
                    sendAjaxUpdate({
                        post_borderColor: 1,
                        borderColor: color.toString()
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error initializing color picker:', error);
    }
}

/**
 * Initialize slider control for interval setting
 */
function initializeSlider() {
    try {
        // Look for the interval element first
        const $interval = $('#interval');
        if ($interval.length === 0) {
            console.warn('Interval element not found');
            return;
        }

        // First, try using the proper bootstrapSlider namespace
        if (typeof $.fn.bootstrapSlider === 'function') {
            $interval.bootstrapSlider({
                formatter: function (value) {
                    return value + ' ms';
                }
            });

            // Use slideStop event which fires when user releases the slider
            $interval.on('slideStop', function (slideEvt) {
                console.log('Slider value changed to:', slideEvt.value);
                sendAjaxUpdate({
                    post_interval: 1,
                    interval: slideEvt.value
                });
            });

            console.log('Bootstrapslider initialized successfully');
        }
        // Then try the standard slider namespace as fallback
        else if (typeof $.fn.slider === 'function') {
            console.warn('Using fallback slider instead of bootstrapSlider');
            $interval.slider({
                formatter: function (value) {
                    return value + ' ms';
                }
            });

            $interval.on('slideStop', function (slideEvt) {
                const intervalValue = slideEvt.value;
                console.log('Fallback slider value changed to:', intervalValue);
                sendAjaxUpdate({
                    post_interval: 1,
                    interval: intervalValue
                });
            });
        }
        // Neither method is available
        else {
            console.error('Neither bootstrapSlider nor slider function is available');

            // Convert to standard input if possible
            if ($interval.is('input')) {
                $interval.attr('type', 'number')
                    .attr('min', '1000')
                    .attr('step', '500')
                    .removeClass('slider')
                    .addClass('form-control')
                    .on('change', function () {
                        sendAjaxUpdate({
                            post_interval: 1,
                            interval: $(this).val()
                        });
                    });
            }
        }
    } catch (error) {
        console.error('Error initializing slider:', error);
    }
}

/**
 * Initialize checkbox controls for display options
 */
function initializeCheckboxes() {
    try {
        const checkboxes = {
            '#hideTitle': 'post_hideTitle',
            '#hideSubtitle': 'post_hideSubtitle',
            '#hideRating': 'post_hideRating',
            '#hideCard': 'post_hideCard',
            '#hideLogo': 'post_hideLogo',
            '#hideInfo': 'post_hideInfo',
            '#hidePoster': 'post_hidePoster',
            '#hideActors': 'post_hideActors',
            '#hideNav': 'post_hideNav',
        };

        for (let checkboxId in checkboxes) {
            handleCheckboxChange(checkboxId, checkboxes[checkboxId]);
        }
    } catch (error) {
        console.error('Error initializing checkboxes:', error);
    }
}

/**
 * Set up change handler for a specific checkbox
 * 
 * @param {string} checkboxId - The checkbox selector ID
 * @param {string} postKey - The POST parameter key to send
 */
function handleCheckboxChange(checkboxId, postKey) {
    $(checkboxId).on('change', function () {
        const value = this.checked ? 'enabled' : 'disabled';

        // Create post data object
        const postData = {};
        postData[postKey] = 1;
        postData[checkboxId.replace('#', '')] = value;

        sendAjaxUpdate(postData);
    });
}

/**
 * Send an AJAX update to the server
 * 
 * @param {Object} data - The data to send
 */
function sendAjaxUpdate(data) {
    try {
        // Add CSRF token to data
        data.csrf_token = getCsrfToken();

        // Show loading indicator
        showLoadingIndicator(true);

        $.ajax({
            type: 'post',
            url: './includes/post_webview_tmdb.php',
            data: data,
            // Don't specify dataType to let jQuery auto-detect
            success: function (response) {
                try {
                    // Try to parse as JSON if it's a string
                    let jsonData = response;
                    if (typeof response === 'string') {
                        // Check if it's actually JSON
                        if (response.trim().startsWith('{') || response.trim().startsWith('[')) {
                            jsonData = JSON.parse(response);
                        } else {
                            // Not JSON, but we'll treat it as success unless it contains error text
                            console.log('Response is not JSON:', response.substring(0, 100));
                            if (response.toLowerCase().includes('error') ||
                                response.toLowerCase().includes('exception') ||
                                response.toLowerCase().includes('fatal')) {
                                throw new Error('Server returned error text');
                            }
                            refreshPreview();
                            return;
                        }
                    }

                    // Handle JSON response
                    if (jsonData && jsonData.success === false) {
                        showError(jsonData.message || 'Update failed');
                    } else {
                        // Success - refresh preview
                        refreshPreview();
                    }
                } catch (e) {
                    console.warn('Error parsing response:', e);
                    // Despite parse error, we'll refresh the preview if status was 200
                    refreshPreview();
                }
            },
            error: function (xhr, status, error) {
                let errorMessage = error;

                // Improved error diagnosis
                if (status === 'parsererror') {
                    errorMessage = 'Invalid JSON response from server';
                    console.error('Parse error. Raw response:', xhr.responseText);

                    // If the response contains HTML (often a PHP error), extract it
                    if (xhr.responseText && xhr.responseText.includes('<')) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = xhr.responseText;
                        const errorText = tempDiv.textContent || tempDiv.innerText || xhr.responseText;
                        errorMessage = 'Server error: ' + errorText.substring(0, 100) + '...';
                    }
                }

                console.error('AJAX Error:', status, {
                    error: error,
                    status: xhr.status,
                    statusText: xhr.statusText
                });

                showError('Failed to update settings: ' + errorMessage);
            },
            complete: function () {
                showLoadingIndicator(false);
            }
        });
    } catch (error) {
        console.error('Error sending AJAX update:', error);
        showLoadingIndicator(false);
        showError('Error sending request: ' + error.message);
    }
}

/**
 * Refresh the preview iframe
 */
function refreshPreview() {
    reloadIframe();
}

/**
 * Get the CSRF token from the page
 * 
 * @returns {string} The CSRF token
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val() || '';
}

/**
 * Show or hide loading indicator
 * 
 * @param {boolean} show - Whether to show or hide the indicator
 */
function showLoadingIndicator(show) {
    // Create loading indicator if it doesn't exist
    let $loader = $('.tmdb-ajax-loader');
    if (!$loader.length) {
        $loader = $('<div class="tmdb-ajax-loader">Updating settings...</div>')
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
}

/**
 * Show error message to the user
 * 
 * @param {string} message - The error message to display
 */
function showError(message) {
    // Create error notification if it doesn't exist
    let $error = $('.tmdb-error-notification');
    if (!$error.length) {
        $error = $('<div class="tmdb-error-notification"></div>')
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
}

/**
 * Set up validation for interval input field
 */
function setupIntervalValidation() {
    try {
        const intervalInput = document.querySelector('input[name="interval"]');
        if (intervalInput) {
            intervalInput.addEventListener('input', function (e) {
                // Remove any non-numeric characters
                this.value = this.value.replace(/[^0-9]/g, '');

                // Ensure the value is at least 1000
                if (this.value === '' || parseInt(this.value) < 1000) {
                    this.value = 1000;
                }
            });
        }
    } catch (error) {
        console.error('Error setting up interval validation:', error);
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