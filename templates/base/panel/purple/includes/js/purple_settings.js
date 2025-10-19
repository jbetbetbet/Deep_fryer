/**
 * Purple Player Settings JavaScript
 * 
 * Handles form interactions, file uploads, and dynamic content management
 * for the Purple Player settings interface.
 * 
 * @package Cockpit
 * @subpackage Purple
 */

/**
 * Get the CSRF token from the page
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * View image in modal
 * 
 * @param {string} url - Image URL to display
 */
function viewImage(url) {
    if (!url) {
        console.error('No image URL provided');
        return;
    }

    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = url;
        modalImage.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
        };
        
        // Store current image URL for "Open in New Tab" function
        window.currentImageUrl = url;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    } else {
        console.error('Modal image element not found');
    }
}

/**
 * Open current modal image in new tab
 */
function openImageInNewTab() {
    if (window.currentImageUrl) {
        window.open(window.currentImageUrl, '_blank');
    }
}

/**
 * Delete background image
 * @param {number} imageId - The ID of the image to delete
 */
function deleteImage(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid image ID:', id);
        return;
    }

    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_settings.php",
            data: {
                delete_image: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
            }
        });
    }
}

/**
 * Delete plugin with confirmation
 * 
 * @param {number} id - Plugin ID to delete
 */
function deletePlugin(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid plugin ID:', id);
        return;
    }

    if (confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_settings.php",
            data: {
                delete_plugin: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./purple_settings.php?tab=pills-appstore";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting plugin:', status, error);
            }
        });
    }
}

/**
 * Delete private menu item with confirmation
 * 
 * @param {number} id - Private menu ID to delete
 */
function deletePrivatemenu(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid private menu ID:', id);
        return;
    }

    if (confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_settings.php",
            data: {
                delete_private_menu: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./purple_settings.php?tab=pills-appstore";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting private menu:', status, error);
            }
        });
    }
}

/**
 * Delete VPN configuration with confirmation
 * 
 * @param {number} id - VPN ID to delete
 */
function deleteVpn(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid VPN ID:', id);
        return;
    }

    if (confirm('Are you sure you want to delete this VPN config? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_settings.php",
            data: {
                delete_vpn: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./purple_settings.php?tab=pills-vpn";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting VPN:', status, error);
            }
        });
    }
}

/**
 * Delete announcement with confirmation
 * 
 * @param {number} id - Announcement ID to delete
 */
function deleteAnnouncement(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid announcement ID:', id);
        return;
    }

    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_settings.php",
            data: {
                delete_announcement: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./purple_settings.php?tab=pills-announcement";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting announcement:', status, error);
            }
        });
    }
}

/**
 * Delete maintenance message with confirmation
 * 
 * @param {number} id - Maintenance ID to delete
 */
function deleteMaintenance(id) {
    if (!id || isNaN(id)) {
        console.error('Invalid maintenance ID:', id);
        return;
    }

    if (confirm('Are you sure you want to delete this maintenance message? This action cannot be undone.')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_purple_settings.php",
            data: {
                delete_maintenance: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./purple_settings.php?tab=pills-announcement";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting maintenance:', status, error);
            }
        });
    }
}

/**
 * Edit maintenance form with provided values
 * 
 * @param {string} title - Maintenance title
 * @param {string} short_description - Maintenance description
 * @param {string} image - Maintenance image URL
 */
function editMaintenance(title, short_description, image) {
    $("#title_m").val(title);
    $("#short_description_m").val(short_description);
    $("#image_m").val(image);
    $("#title_m").focus();

    $('#post_maintenance button[name="post_maintenance"]').text('Update Maintenance');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#title_m").offset().top - 100
    }, 500);
}

/**
 * Edit announcement form with provided values
 * 
 * @param {string} title - Announcement title
 * @param {string} short_description - Announcement description
 * @param {string} image - Announcement image URL
 */
function editAnnouncement(title, short_description, image) {
    $("#title").val(title);
    $("#short_description").val(short_description);
    $("#image").val(image);
    $("#title").focus();

    $('#post_announcement button[name="post_announcement"]').text('Update Announcement');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#title").offset().top - 100
    }, 500);
}

/**
 * Edit VPN form with provided values
 * 
 * @param {string} vpn_country - VPN country
 * @param {string} vpn_city - VPN city
 * @param {string} vpn_file - VPN file content
 * @param {string} vpn_username - VPN username
 * @param {string} vpn_password - VPN password
 */
function editVpn(vpn_country, vpn_city, vpn_file, vpn_username, vpn_password) {
    $("#vpn_country").val(vpn_country);
    $("#vpn_country option[value='" + vpn_country + "']").prop("selected", true);
    $("#vpn_city").val(vpn_city);
    $("#vpn_file").val(vpn_file);
    $("#vpn_username").val(vpn_username);
    $("#vpn_password").val(vpn_password);
    $("#vpn_country").focus();

    $('#post_vpn button[name="post_vpn"]').text('Update VPN');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#vpn_country").offset().top - 100
    }, 500);
}

/**
 * Edit private menu form with provided values
 * 
 * @param {string} addtion_app_name - App name
 * @param {string} addtion_app_pkg - App package name
 * @param {string} addtion_app_url - App URL
 * @param {string} addtion_app_icon - App icon URL
 */
function editPrivatemenu(addtion_app_name, addtion_app_pkg, addtion_app_url, addtion_app_icon) {
    $("#addtion_app_name").val(addtion_app_name);
    $("#addtion_app_pkg").val(addtion_app_pkg);
    $("#addtion_app_url").val(addtion_app_url);
    $("#addtion_app_icon").val(addtion_app_icon);
    $("#addtion_app_name").focus();

    $('#post_privatemenu button[name="post_privatemenu"]').text('Update Private Menu');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#addtion_app_name").offset().top - 100
    }, 500);
}

/**
 * Edit plugin form with provided values
 * 
 * @param {string} name - Plugin name
 * @param {string} version - Plugin version
 * @param {string} playstore_url - Play Store URL
 * @param {string} apk_url - APK download URL
 * @param {string} pkg_name - Package name
 */
function editPlugin(name, version, playstore_url, apk_url, pkg_name) {
    $("#plugin_name").val(name);
    $("#plugin_version").val(version);
    $("#plugin_playstore_url").val(playstore_url);
    $("#plugin_apk_url").val(apk_url);
    $("#plugin_pkg_name").val(pkg_name);
    $("#plugin_name").focus();

    $('#post_plugin button[name="post_plugin"]').text('Update Plugin');

    // Scroll to the form smoothly
    $('html, body').animate({
        scrollTop: $("#plugin_name").offset().top - 100
    }, 500);
}

// Handle tab click to hide pre-text
const tabLinks = document.querySelectorAll(".nav-link");
const preText = document.getElementById("pre-text");

// Add click listeners to hide pre-text when tab links are clicked
if (preText) {
    tabLinks.forEach((link) => {
        link.addEventListener("click", () => {
            preText.style.display = "none";
        });
    });
}

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    /**
     * Initialize color pickers if library is available
     */
    if (typeof $.fn.spectrum !== 'undefined') {
        const colorPickerIds = ['#theme_color_1', '#theme_color_2', '#theme_color_3'];

        colorPickerIds.forEach(function (elementId) {
            $(elementId).spectrum({
                preferredFormat: "hex",
                showInput: true,
                allowEmpty: false,
                showButtons: false,
                clickoutFiresChange: true
            });
        });
    }

    /**
     * Process URL parameters to show the correct tab
     */
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam) {
        const tabElement = document.querySelector('#navs a[href="#' + tabParam + '"]');
        if (tabElement) {
            $(tabElement).tab('show');
        }
    }

    /**
     * Initialize video preview functionality
     */
    const video = document.getElementById('introVideo');
    const source = document.getElementById('videoSource');

    if (video && source) {
        // Add cache busting parameter to video source
        source.src = source.src + "?t=" + new Date().getTime();
        video.load();
    }

    /**
     * File upload handling
     */
    $('#fileupload').on('change', function () {
        const fileInput = $(this);
        const previewId = fileInput.attr('data-preview');

        if (previewId && this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                $(`#${previewId}`).attr('src', e.target.result);
            };

            reader.readAsDataURL(this.files[0]);
        }
    });

    /**
     * Keyboard shortcuts for common actions
     */
    $(document).on('keydown', function (e) {
        // Ctrl+S to save current form
        if (e.ctrlKey && e.which === 83) {
            e.preventDefault();
            const activeForm = $('form:visible').first();
            if (activeForm.length) {
                activeForm.submit();
            }
        }

        // Escape to close modals
        if (e.which === 27) {
            $('.modal').modal('hide');
        }
    });

    /**
     * Initialize Imgur file upload functionality (matching WebViews slideshow exactly)
     */
    function initImgurUpload() {
        'use strict';

        // Your Imgur Client ID - Use the same one from WebViews slideshow
        const IMGUR_CLIENT_ID = 'a9566ceed47ed5b'; // Replace with your actual Client ID

        // Simple file upload handling without complex plugins
        $('#fileupload input[type="file"]').on('change', function () {
            const files = this.files;
            const filesContainer = $('#fileupload .files');

            // Clear previous files
            filesContainer.empty();

            // Add each file to the queue
            Array.from(files).forEach((file, index) => {
                const row = $(`
                    <tr>
                        <td>${file.name}</td>
                        <td>
                            <div class="progress">
                                <div class="progress-bar" style="width: 0%"></div>
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary upload-single" data-index="${index}">Upload</button>
                        </td>
                    </tr>
                `);
                filesContainer.append(row);
            });
        });

        // Handle individual file uploads
        $(document).on('click', '.upload-single', function () {
            const index = $(this).data('index');
            const fileInput = $('#fileupload input[type="file"]')[0];
            const file = fileInput.files[index];
            const row = $(this).closest('tr');
            const progressBar = row.find('.progress-bar');
            const button = $(this);

            if (!file) return;

            button.prop('disabled', true).text('Uploading...');

            // Create form data for Imgur
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', 'file');

            // Upload to Imgur using fetch (no CORS issues)
            fetch('https://api.imgur.com/3/upload', {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID 7bab65ad1d79aa1'
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data && data.data.link) {
                        progressBar.css('width', '100%').addClass('bg-success');

                        // Save to database
                        return fetch('./includes/post_purple_settings.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: new URLSearchParams({
                                'post_images': 'true',
                                'fileUrl': data.data.link,
                                'csrf_token': getCsrfToken()
                            })
                        });
                    } else {
                        throw new Error('Imgur upload failed: ' + (data.data ? data.data.error : 'Unknown error'));
                    }
                })
                .then(response => {
                    if (response.ok) {
                        button.text('Complete').removeClass('btn-primary').addClass('btn-success');

                        // Refresh page after short delay
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        throw new Error('Database save failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    progressBar.addClass('bg-danger');
                    button.text('Failed').removeClass('btn-primary').addClass('btn-danger');
                    alert('Upload failed: ' + error.message);
                })
                .finally(() => {
                    button.prop('disabled', false);
                });
        });

        // Handle global start upload button
        $('#fileupload .start').on('click', function () {
            $('#fileupload .upload-single').each(function () {
                if (!$(this).prop('disabled')) {
                    $(this).click();
                }
            });
        });

        // Handle global cancel button
        $('#fileupload .cancel').on('click', function () {
            $('#fileupload .files').empty();
            $('#fileupload input[type="file"]').val('');
        });
    }

    /**
     * Initialize Imgur upload functionality
     */
    initImgurUpload();
});