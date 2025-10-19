/**
 * StreamBox Settings JavaScript
 * 
 * Handles the client-side functionality for the StreamBox Settings page,
 * including form interactions, image uploads, and various settings management operations.
 * 
 * @package Cockpit
 * @subpackage StreamBox
 */

// Global utility functions
/**
 * Retrieves the CSRF token from the page
 * 
 * @return {string} The CSRF token value
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

/**
 * Shows an image in the modal viewer
 * 
 * @param {string} url - URL of the image to view
 */
function viewImage(url) {
    document.getElementById('modalImage').src = url;
    $('#imageModal').modal('show');
}

/**
 * Deletes an image after confirmation
 * 
 * @param {number} id - ID of the image to delete
 */
function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        $.ajax({
            url: './includes/post_streambox_settings.php',
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
                console.error("Error deleting image:", error);
                alert("Error deleting image. Please try again.");
            }
        });
    }
}

/**
 * Deletes a notification after confirmation
 * 
 * @param {number} id - ID of the notification to delete
 */
function deleteNotification(id) {
    if (confirm("Are you sure you want to delete this notification?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_streambox_settings.php",
            data: {
                delete_notification: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.href = "./streambox_settings.php?tab=pills-notification";
            },
            error: function (xhr, status, error) {
                console.error("Error deleting notification:", error);
                alert("Error deleting notification. Please try again.");
            }
        });
    }
}

/**
 * Deletes a custom advertisement after confirmation
 * 
 * @param {number} id - ID of the advertisement to delete
 */
function deleteAdvertisement(id) {
    if (confirm("Are you sure you want to delete this ad?")) {
        $.ajax({
            type: "POST",
            url: "./includes/post_streambox_settings.php",
            data: {
                delete_custom_adz: 1,
                id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                location.href = "./streambox_settings.php?tab=pills-custom-ads";
            },
            error: function (xhr, status, error) {
                console.error("Error deleting advertisement:", error);
                alert("Error deleting advertisement. Please try again.");
            }
        });
    }
}

/**
 * Prefills the notification form with data for editing
 * 
 * @param {string} notification_title - Notification title
 * @param {string} notification_msg - Notification message
 * @param {string} notification_description - Notification description
 */
function editNotification(notification_title, notification_msg, notification_description) {
    $("#notification_title").val(notification_title);
    $("#notification_msg").val(notification_msg);
    $("#notification_description").val(notification_description);
    $("#notification_title").focus();
    $("#post_notification button[type='submit']").text("Update Notification");
}

/**
 * Prefills the advertisement form with data for editing
 * 
 * @param {string} adz_type - Advertisement type
 * @param {string} adz_title - Advertisement title
 * @param {string} adz_image - Advertisement image URL
 * @param {string} adz_redirect_type - Advertisement redirect type
 * @param {string} adz_redirect_url - Advertisement redirect URL
 */
function editAdvertisement(adz_type, adz_title, adz_image, adz_redirect_type, adz_redirect_url) {
    $("#adz_type").val(adz_type);
    $("#adz_title").val(adz_title);
    $("#adz_image").val(adz_image);
    $("#adz_redirect_type").val(adz_redirect_type);
    $("#adz_redirect_url").val(adz_redirect_url);
    $("#adz_type").focus();
    $("#post_custom_adz button[type='submit']").text("Update Advertisement");
}

// Initialize components when document is ready
$(function () {
    // Initialize toasts with auto-hide
    $('.toast').each(function() {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });
    
    // Initialize Summernote rich text editor
    $('.summernote').summernote({
        height: 300,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });

    // Initialize clipboard functionality
    var clipboard = new ClipboardJS("[data-toggle='clipboard']");

    clipboard.on("success", function (e) {
        $(e.trigger).tooltip({
            title: "Copied",
            placement: "top"
        });
        $(e.trigger).tooltip("show");
        setTimeout(function () {
            $(e.trigger).tooltip("dispose");
        }, 500);
    });

    // File upload variables and functionality
    var totalFiles = 0;
    var uploadedFiles = 0;
    var spinner = $('#upload-spinner');
    var errorMsg = $('#error-msg');

    // Initialize file upload component
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

        // Handle file addition
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

        // Handle successful upload
        done: function (e, data) {
            var fileUrl = data.result.data.link;

            // Convert .jpeg URLs to .jpg for consistency
            if (fileUrl.endsWith('.jpeg')) {
                fileUrl = fileUrl.replace(/\.jpeg$/, '.jpg');
            }

            // Save image to database
            $.ajax({
                url: './includes/post_streambox_settings.php',
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
                    errorMsg.html('Failed to save image: ' + error).removeClass('d-none');
                }
            });
            spinner.hide();
        },

        // Handle upload failure
        fail: function (e, data) {
            errorMsg.html('Upload failed: ' + data.errorThrown).removeClass('d-none');
            spinner.hide();
        }
    });

    // Track file upload counts
    $('#fileupload').on('fileuploadadd', function (e, data) {
        totalFiles++;
    });

    // Hide empty row when files are added
    $('#fileupload').on('fileuploadchange', function (e, data) {
        $('#fileupload .empty-row').hide();
    });

    // Show empty row when files are removed
    $('#fileupload').on('fileuploadfail', function (e, data) {
        if (data.errorThrown === 'abort') {
            if ($('#fileupload .files tr').not('.empty-row').length == 1) {
                $('#fileupload .empty-row').show();
            }
        }
    });

    // Check Imgur API status
    $.ajax({
        url: 'https://api.imgur.com/3/image/0r65LVT',
        type: 'GET',
        headers: {
            'Authorization': 'Client-ID 7bab65ad1d79aa1'
        },
        success: function (response) {
            console.log('Imgur API is available');
        },
        error: function () {
            var alert = '<div class="alert alert-danger m-b-0 m-t-15">Imgur API server currently unavailable - ' + new Date() + '</div>';
            errorMsg.removeClass('d-none').html(alert);
        }
    });

    // Tab navigation functionality
    const tabLinks = document.querySelectorAll(".nav-link");
    const preText = document.getElementById("pre-text");

    tabLinks.forEach((link) => {
        link.addEventListener("click", () => {
            // Commented out: preText.style.display = "none";
        });
    });

    // Handle URL tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const navsParam = urlParams.get('tab');

    if (navsParam) {
        $('#navs a[href="#' + navsParam + '"]').tab('show');
        tabLinks.forEach((link) => {
            link.addEventListener("click", () => {
                // Commented out: preText.style.display = "none";
            });
        });
    }
});