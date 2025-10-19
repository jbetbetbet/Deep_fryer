/**
 * XXLinked WebView Script
 * 
 * This script handles the loading, resizing, and interaction of an iframe
 * 
 * @package Cockpit
 * @subpackage WebView
 * @author Ian O'Neill
 * @version see version.json
 */

/**
 * Handle iframe loading, display and resizing
 */
$(function () {
    
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    const iframe = document.getElementById('webviewIframe');
    const spinner = document.getElementById('spinner');
    const iframeWrapper = document.getElementById('iframeWrapper');
    const resizeHandle = document.getElementById('resizeHandle');
    const widthDisplay = document.getElementById('iframeWidth');
    const heightDisplay = document.getElementById('iframeHeight');
    const resolutionLabel = document.getElementById('resolutionLabel');
    const presetButtons = document.querySelectorAll('.resolution-presets button');
    const pageInput = document.getElementById('xxl_page');

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
        alert('Failed to load the iframe content.');
    };

    // Update preview when page name changes
    if (pageInput) {
        pageInput.addEventListener('change', function () {
            updatePreview();
        });
    }

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
        }
    });

    // Function to update dimension display
    function updateDimensionDisplay() {
        const width = iframeWrapper.clientWidth;
        const height = iframeWrapper.clientHeight;

        widthDisplay.textContent = Math.round(width);
        heightDisplay.textContent = Math.round(height);
    }

    // Function to update preview
    function updatePreview() {
        spinner.style.display = 'flex';
        iframe.style.display = 'none';

        const page = pageInput.value;

        // Add a timestamp to force reload and prevent caching
        const timestamp = new Date().getTime();
        iframe.src = `./../../api/webview/xxlinked.php?page=${encodeURIComponent(page)}&_t=${timestamp}`;
    }

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

        });
    });
});