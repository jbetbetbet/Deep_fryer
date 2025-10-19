/**
 * Smarters Pro Banners JavaScript
 * 
 * Handles UI interactions for the Smarters Pro banners management page,
 * including image uploads, announcements, advertisements, and message management.
 * 
 * @package Cockpit
 * @subpackage SmartersPro
 * @author Ian O'Neill
 * @version see version.json
 */

/**
 * Get CSRF token from the form
 * 
 * @returns {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Display image in modal viewer
 * 
 * @param {string} url - The URL of the image to display
 */
function viewImage(url) {
    document.getElementById('modalImage').src = url;
    $('#imageModal').modal('show');
}

/**
 * Delete image with confirmation
 * 
 * @param {number} id - The ID of the image to delete
 */
function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
        $.ajax({
            url: './includes/post_smarters_pro_banners.php',
            type: 'POST',
            data: {
                delete_image: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting image:', status, error);
            }
        });
    }
}

/**
 * Delete announcement with confirmation
 * 
 * @param {number} id - The ID of the announcement to delete
 */
function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
        $.ajax({
            url: './includes/post_smarters_pro_banners.php',
            type: 'POST',
            data: {
                delete_announcement: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting announcement:', status, error);
            }
        });
    }
}

/**
 * Delete message/advertisement with confirmation
 * 
 * @param {number} id - The ID of the message to delete
 */
function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this advertisement? This action cannot be undone.')) {
        $.ajax({
            url: './includes/post_smarters_pro_banners.php',
            type: 'POST',
            data: {
                delete_message: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error deleting message:', status, error);
            }
        });
    }
}

// Initialize on document ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    var totalFiles = 0;
    var uploadedFiles = 0;
    var spinner = $('#upload-spinner');
    var errorMsg = $('#error-msg');

    /**
     * Form submission handler for announcements
     */
    $("#post_announcement").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_announcement', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button during request
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_banners.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting announcement:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Form submission handler for text messages
     */
    $("#post_message").on("submit", function (e) {
        e.preventDefault();
        var formData = new FormData(this);
        formData.append('post_message', '1');
        formData.append('csrf_token', getCsrfToken());

        // Disable submit button during request
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Saving...');

        $.ajax({
            type: "POST",
            url: "./includes/post_smarters_pro_banners.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error('Error submitting message:', status, error);
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });

    /**
     * Initialize jQuery FileUpload plugin for image uploads
     */
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
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        add: function (e, data) {
            spinner.show();

            let file = data.files[0];

            // Convert .jpeg to .jpg for consistency
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
            var fileUrl = data.result.data.link;

            // Ensure .jpg extension consistency
            if (fileUrl.endsWith('.jpeg')) {
                fileUrl = fileUrl.replace(/\.jpeg$/, '.jpg');
            }

            // Save uploaded image URL to database
            $.ajax({
                url: './includes/post_smarters_pro_banners.php',
                type: 'POST',
                data: {
                    post_images: 1,
                    fileUrl: fileUrl,
                    csrf_token: getCsrfToken()
                },
                success: function () {
                    uploadedFiles++;
                    if (uploadedFiles === totalFiles) {
                        location.reload();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error saving image:', status, error);
                    spinner.hide();
                }
            });
            spinner.hide();
        },
        fail: function (e, data) {
            errorMsg.html('Upload failed: ' + data.errorThrown).removeClass('d-none');
            console.error('Upload failed:', data.errorThrown);
            spinner.hide();
        }
    });

    /**
     * FileUpload event handlers
     */
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

    /**
     * Check Imgur API availability
     */
    $.ajax({
        url: 'https://api.imgur.com/3/image/0r65LVT',
        type: 'GET',
        headers: {
            'Authorization': 'Client-ID 7bab65ad1d79aa1'
        },
        success: function (response) {
            console.log('Imgur API is available:', response);
        },
        error: function () {
            var alert = '<div class="alert alert-danger m-b-0 m-t-15">Imgur API server currently unavailable - ' + new Date() + '</div>';
            errorMsg.removeClass('d-none').html(alert);
            console.error('Imgur API server unavailable - image uploads will not work');
        }
    });
});