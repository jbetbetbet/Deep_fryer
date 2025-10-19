/**
 * Slideshow WebView JavaScript
 * 
 * Handles image uploads to Imgur, slideshow interval settings,
 * image viewing, and deletion for the Slideshow WebView configuration.
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
        // Initialize slider for interval control
        initializeSlider();

        // Initialize file upload functionality
        initializeFileUpload();

        // Check Imgur API status
        checkImgurApiStatus();

        // Initialize iframe handling
        initializeIframeHandling();

        // Initialize enhanced image preview
        initializeImagePreview();
    } catch (error) {
        console.error('Error during UI initialization:', error);
    }
}

/**
 * Initialize slider control for interval
 */
function initializeSlider() {
    try {
        $('#interval').bootstrapSlider({
            formatter: function (value) {
                return value < 1000 ? value + 'ms' : (value / 1000).toFixed(1) + 's';
            }
        }).on('slideStop', function (slideEvent) {
            updateInterval(slideEvent.value);
        });
    } catch (error) {
        console.error('Error initializing slider:', error);
    }
}

/**
 * Update interval setting via AJAX
 * 
 * @param {number} value - The interval value in milliseconds
 */
function updateInterval(value) {
    try {
        showLoadingIndicator(true);

        $.ajax({
            url: './includes/post_webview_slideshow.php',
            type: 'POST',
            data: {
                post_slideshow: 1,
                interval: value,
                csrf_token: getCsrfToken()
            },
            success: function (response) {
                try {
                    const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
                    if (jsonResponse && jsonResponse.success === false) {
                        showError(jsonResponse.message || 'Failed to update interval');
                    }
                } catch (e) {
                    // If response is not JSON, assume success
                }
            },
            error: function (xhr, status, error) {
                showError('Failed to update interval: ' + error);
            },
            complete: function () {
                showLoadingIndicator(false);
            }
        });
    } catch (error) {
        console.error('Error updating interval:', error);
        showLoadingIndicator(false);
    }
}

/**
 * Initialize file upload functionality
 */
function initializeFileUpload() {
    try {
        var totalFiles = 0;
        var uploadedFiles = 0;
        var spinner = $('#upload-spinner');
        var errorMsg = $('#error-msg');

        $('#fileupload').fileupload({
            previewMaxHeight: 80,
            previewMaxWidth: 120,
            url: 'https://api.imgur.com/3/image',
            type: 'POST',
            headers: {
                Authorization: 'Client-ID 7bab65ad1d79aa1'
            },
            dataType: 'json',
            singleFileUploads: true,
            autoUpload: true,
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
            maxFileSize: 999000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|a?png|tiff|webp)$/i,
            add: function (e, data) {
                spinner.show();

                let file = data.files[0];

                // Normalize file extensions (.jpeg -> .jpg)
                if (file.name.toLowerCase().endsWith('.jpeg')) {
                    let newFileName = file.name.replace(/\.jpeg$/i, '.jpg');
                    file = new File([file], newFileName, { type: file.type });
                    data.files[0] = file;
                }

                data.formData = {
                    image: file,
                    csrf_token: getCsrfToken()
                };

                data.submit();
            },
            done: function (e, data) {
                try {
                    var fileUrl = data.result.data.link;

                    // Normalize URLs (.jpeg -> .jpg)
                    if (fileUrl.endsWith('.jpeg')) {
                        fileUrl = fileUrl.replace(/\.jpeg$/, '.jpg');
                    }

                    $.ajax({
                        url: './includes/post_webview_slideshow.php',
                        type: 'POST',
                        data: {
                            post_images: 1,
                            fileUrl: fileUrl,
                            csrf_token: getCsrfToken()
                        },
                        success: function (response) {
                            try {
                                const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;

                                if (jsonResponse && jsonResponse.success === false) {
                                    showError(jsonResponse.message || 'Failed to save image');
                                } else {
                                    uploadedFiles++;
                                    if (uploadedFiles === totalFiles) {
                                        refreshPage();
                                    }
                                }
                            } catch (e) {
                                // If response is not JSON, assume success
                                uploadedFiles++;
                                if (uploadedFiles === totalFiles) {
                                    refreshPage();
                                }
                            }
                        },
                        error: function (xhr, status, error) {
                            showError('Failed to save image: ' + error);
                        }
                    });
                } catch (error) {
                    showError('Error processing upload: ' + error.message);
                }
                spinner.hide();
            },
            fail: function (e, data) {
                errorMsg.html('<div class="alert alert-danger">Upload failed: ' + (data.errorThrown || 'Unknown error') + '</div>');
                spinner.hide();
            }
        });

        $('#fileupload').on('fileuploadadd', function (e, data) {
            totalFiles++;
        });

        $('#fileupload').on('fileuploadchange', function (e, data) {
            $('#fileupload .empty-row').hide();
        });

        $('#fileupload').on('fileuploadfail', function (e, data) {
            if (data.errorThrown === 'abort') {
                if ($('#fileupload .files tr').not('.empty-row').length == 1) {
                    $('#fileupload .empty-row').show();
                }
            }
        });
    } catch (error) {
        console.error('Error initializing file upload:', error);
    }
}

/**
 * Check Imgur API status
 */
function checkImgurApiStatus() {
    try {
        var errorMsg = $('#error-msg');

        $.ajax({
            url: 'https://api.imgur.com/3/image/0r65LVT',
            type: 'GET',
            headers: {
                'Authorization': 'Client-ID 7bab65ad1d79aa1'
            },
            success: function (response) {
                console.log('Imgur API is up');
            },
            error: function (xhr, status, error) {
                var alert = '<div class="alert alert-danger m-b-0 m-t-15">Imgur API server currently unavailable - ' +
                    new Date().toLocaleString() + '</div>';
                errorMsg.removeClass('d-none').html(alert);
            }
        });
    } catch (error) {
        console.error('Error checking Imgur API status:', error);
    }
}

/**
 * Initialize iframe handling and resizing
 */
function initializeIframeHandling() {
    try {
        const iframe = document.getElementById('webviewIframe');
        const spinner = document.getElementById('spinner');
        const iframeWrapper = document.getElementById('iframeWrapper');
        const resizeHandle = document.getElementById('resizeHandle');
        const widthDisplay = document.getElementById('iframeWidth');
        const heightDisplay = document.getElementById('iframeHeight');
        const resolutionLabel = document.getElementById('resolutionLabel');
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
            showError('Failed to load preview');
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

        // Set default resolution label
        setTimeout(updateDimensionDisplay, 500);
    } catch (error) {
        console.error('Error initializing iframe handling:', error);
    }
}

/**
 * Initialize enhanced image preview functionality
 */
function initializeImagePreview() {
    try {
        // Define improved viewImage function globally
        window.viewImage = function (url) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            const modalLoadSpinner = document.getElementById('modalLoadSpinner');
            const modalError = document.getElementById('modalError');
            const openOriginal = document.getElementById('openOriginal');

            if (!modal || !modalImage || !modalLoadSpinner || !modalError || !openOriginal) {
                console.error('Required modal elements not found');
                return;
            }

            // Bootstrap Modal instance
            const bootstrapModal = new bootstrap.Modal(modal);

            // Reset modal state
            modalImage.style.display = 'none';
            modalLoadSpinner.style.display = 'flex';
            modalError.style.display = 'none';

            // Handle both relative and absolute URLs
            let resolvedUrl = url;
            if (!url.startsWith('http') && !url.startsWith('data:')) {
                const baseUrl = window.location.origin + window.location.pathname.split('/panel/')[0];
                resolvedUrl = baseUrl + (url.startsWith('/') ? '' : '/') + url;
            }

            // Set open original link
            openOriginal.href = resolvedUrl;

            // Show modal
            bootstrapModal.show();

            // Create a new image to preload and check if it loads correctly
            const preloadImage = new Image();

            preloadImage.onload = function () {
                modalLoadSpinner.style.display = 'none';
                modalImage.src = resolvedUrl;
                modalImage.style.display = 'block';
            };

            preloadImage.onerror = function () {
                modalLoadSpinner.style.display = 'none';
                modalError.style.display = 'block';
                console.error('Failed to load image:', resolvedUrl);
            };

            // Start loading
            preloadImage.src = resolvedUrl;
        };
    } catch (error) {
        console.error('Error initializing image preview:', error);
    }
}

/**
 * Delete image after confirmation
 * 
 * @param {number} id - ID of the image to delete
 */
function deleteImage(id) {
    try {
        if (confirm('Are you sure you want to delete this image?')) {
            showLoadingIndicator(true);

            $.ajax({
                url: './includes/post_webview_slideshow.php',
                type: 'POST',
                data: {
                    delete_image: 1,
                    id: id,
                    csrf_token: getCsrfToken()
                },
                success: function (response) {
                    try {
                        const jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;

                        if (jsonResponse && jsonResponse.success === false) {
                            showError(jsonResponse.message || 'Failed to delete image');
                        } else {
                            refreshPage();
                        }
                    } catch (e) {
                        // If response is not JSON, assume success
                        refreshPage();
                    }
                },
                error: function (xhr, status, error) {
                    showError('Failed to delete image: ' + error);
                    showLoadingIndicator(false);
                }
            });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        showLoadingIndicator(false);
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
 * Show or hide loading indicator
 * 
 * @param {boolean} show - Whether to show or hide the indicator
 */
function showLoadingIndicator(show) {
    try {
        // Create loading indicator if it doesn't exist
        let $loader = $('.slideshow-ajax-loader');
        if (!$loader.length) {
            $loader = $('<div class="slideshow-ajax-loader">Updating settings...</div>')
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
        let $error = $('.slideshow-error-notification');
        if (!$error.length) {
            $error = $('<div class="slideshow-error-notification"></div>')
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