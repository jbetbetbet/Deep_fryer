/**
 * XCIPTV Command Center JavaScript
 * Handles device selection, command sending, and real-time updates for the XCIPTV command center interface.
 * @package   Cockpit
 * @subpackage XCIPTV
 * @author    Ian O'Neill
 * @version   see version.json
 */

// Global variables
let selectedDevice = null;
const refreshInterval = 30000; // 30 seconds

/**
 * Get the CSRF token from the page
 * @returns {string} The CSRF token
 */
function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

$(() => {
    $('.toast').each(function () {
        const toast = new bootstrap.Toast(this);
        toast.show();
    });
    $('#refreshBtn').on('click', refreshData);
    $(document).on('click', '.select-device', function () {
        const username = $(this).data('username');
        const cid = $(this).data('cid');
        const uid = $(this).data('uid');
        const appname = $(this).data('appname');
        selectDevice(username, cid, uid, appname);
    });
    setInterval(refreshData, refreshInterval);
    setTimeout(refreshData, 1000);
});

/**
 * Show a toast notification for command responses
 * @param {string} message - The message to display
 * @param {string} type - Toast type: success, danger, warning, info
 * @param {number} duration - Auto-hide delay in milliseconds
 */
function showToast(message, type = 'info', duration = 5000) {
    const timestamp = new Date().toLocaleTimeString();
    const iconMap = {
        success: 'fas fa-check-circle text-success',
        danger: 'fas fa-exclamation-circle text-danger',
        warning: 'fas fa-exclamation-triangle text-warning',
        info: 'fas fa-info-circle text-info',
    };
    const icon = iconMap[type] || iconMap['info'];
    const toastHtml = `
    <div class="toast fade show mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="${duration}">
        <div class="toast-header">
            <i class="${icon} me-2"></i>
            <strong class="me-auto">Command Center</strong>
            <small class="text-muted">${timestamp}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    </div>`;
    const container = document.getElementById('dynamicToastsContainer');
    container.insertAdjacentHTML('beforeend', toastHtml);
    const newToast = container.lastElementChild;
    const bsToast = new bootstrap.Toast(newToast);
    bsToast.show();
    newToast.addEventListener('hidden.bs.toast', () => newToast.remove());
}

/**
 * Select a device for control operations
 * @param {string} username - The username of the device
 * @param {string} cid - The connection ID of the device
 * @param {string} uid - The unique ID of the device
 * @param {string} appname - The app name of the device
 * @param {string} ip - The IP address of the device
 */
function selectDevice(username, cid, uid, appname, ip) {
    selectedDevice = { username, cid, uid, appname: appname || 'XCIPTV', ip: ip || 'unknown' };

    $('.select-device').removeClass('btn-theme').addClass('btn-outline-theme');
    $(`.select-device[data-username="${username}"][data-cid="${cid}"][data-uid="${uid}"]`).removeClass('btn-outline-theme').addClass('btn-theme');
    $('#selectedUserBadge').removeClass('bg-secondary').addClass('bg-primary').text(`Selected: ${username}`);
    $('#deviceControls .btn').each(function () {
        const command = $(this).attr('onclick');
        if (command.includes('getappinfo') /*|| command.includes('showMessageModal')*/) {
            // Leave "Get Info" and "Send Message" disabled
            $(this).prop('disabled', true);
        } else {
            $(this).prop('disabled', false);
        }
    });

    // Show a toast notification
    showToast(`Device "${username}" selected and ready for commands`, 'success', 3000);
}

/**
 * Send command to selected device with toast feedback
 */
function sendCommand(command) {
    if (!selectedDevice) {
        showToast('Please select a device first', 'warning');
        return;
    }

    const loadingToast = showToast(`Sending '${command}' command to ${selectedDevice.username}...`, 'info', 10000);

    const buttonSelector = `button[onclick="sendCommand('${command}')"]`;
    const button = document.querySelector(buttonSelector);
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;

    $.ajax({
        type: "POST",
        url: "./includes/post_ottrun_xciptv_command_center.php",
        dataType: 'json',
        data: {
            action: 'send_command',
            command: command,
            target_user: selectedDevice.username,
            target_cid: selectedDevice.cid,
            target_uid: selectedDevice.uid,
            appname: selectedDevice.appname,
            csrf_token: getCsrfToken()
        },
        success: function (response) {
            if (response && response.success) {
                showToast(`Command '${command}' sent successfully to ${selectedDevice.username}`, 'success');
            } else {
                if (response && response.error && response.error.includes('no_matching_subscribers')) {
                    showToast(`Command '${command}' failed: Unable to connect with device.`, 'danger');
                } else {
                    showToast(`Failed to send command: ${response.error || 'Unknown error'}`, 'danger');
                }
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', xhr.responseText);
            showToast(`Network error while sending command '${command}': ${error}`, 'danger');
        },
        complete: function () {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

/**
 * Send message to selected device with toast feedback
 */
function sendMessage() {
    if (!selectedDevice) {
        showToast('Please select a device first', 'warning');
        return;
    }

    const message = prompt(`Enter message for ${selectedDevice.username}:`);
    if (!message || message.trim() === '') {
        return;
    }

    showToast(`Sending message to ${selectedDevice.username}...`, 'info', 5000);

    $.ajax({
        type: "POST",
        url: "./includes/post_ottrun_xciptv_command_center.php",
        dataType: 'json',
        data: {
            action: 'send_message',
            message: message.trim(),
            target_user: selectedDevice.username,
            target_cid: selectedDevice.cid,
            target_uid: selectedDevice.uid,
            appname: selectedDevice.appname,
            csrf_token: getCsrfToken()
        },
        success: function (response) {
            if (response && response.success) {
                showToast(`Message sent successfully to ${selectedDevice.username}`, 'success');
            } else {
                showToast(`Failed to send message: ${response.error || 'Unknown error'}`, 'danger');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', xhr.responseText);
            showToast(`Network error while sending message: ${error}`, 'danger');
        }
    });
}

/**
 * Show a modal for sending a message to the selected device
 */
function showMessageModal() {
    if (!selectedDevice) {
        showToast('Please select a device first', 'warning');
        return;
    }
    $('#modalDeviceName').text(selectedDevice.username);
    $('#messageText').val('');
    $('#messageModal').modal('show');
}

$(document).on('submit', '#sendMessageForm', function (e) {
    e.preventDefault();
    if (!selectedDevice) {
        showToast('Please select a device first', 'warning');
        return;
    }
    const message = $('#messageText').val().trim();
    if (!message) {
        showToast('Please enter a message.', 'warning');
        return;
    }
    $('#sendMessageForm button[type="submit"]').prop('disabled', true);
    showToast(`Sending message to ${selectedDevice.username}...`, 'info', 5000);

    $.ajax({
        type: "POST",
        url: "./includes/post_ottrun_xciptv_command_center.php",
        dataType: 'json',
        data: {
            action: 'send_message',
            message: message,
            target_user: selectedDevice.username,
            target_cid: selectedDevice.cid,
            target_uid: selectedDevice.uid,
            appname: selectedDevice.appname,
            csrf_token: getCsrfToken()
        },
        success: function (response) {
            if (response && response.success) {
                showToast(`Message sent successfully to ${selectedDevice.username}`, 'success');
                $('#messageModal').modal('hide');
            } else {
                showToast(`Failed to send message: ${response.error || 'Unknown error'}`, 'danger');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', xhr.responseText);
            showToast(`Network error while sending message: ${error}`, 'danger');
        },
        complete: function () {
            $('#sendMessageForm button[type="submit"]').prop('disabled', false);
        }
    });
});

/**
 * Show a modal for sending an announcement to all users
 */
function showAnnouncementModal() {
    // No device selection required for announcements to all users
    $('#announcementText').val('');
    $('#annExpire').val('');
    $('#annInterval').val('5');
    $('#annDisappear').val('2');
    $('#annStatus').val('ACTIVE');
    $('#announcementModal').modal('show');
}

$(document).on('submit', '#sendAnnouncementForm', function (e) {
    e.preventDefault();

    const announcement = $('#announcementText').val().trim();
    if (!announcement) {
        showToast('Please enter an announcement.', 'warning');
        return;
    }
    const ann_expire = $('#annExpire').val().trim();
    const ann_interval = $('#annInterval').val().trim();
    const ann_disappear = $('#annDisappear').val().trim();
    const ann_status = $('#annStatus').val();

    $('#sendAnnouncementForm button[type="submit"]').prop('disabled', true);
    showToast(`Sending announcement to all users...`, 'info', 5000);

    // Build JSON payload for the app
    const payload = {
        ann_announcement: announcement,
        ann_status: ann_status,
        ann_expire: ann_expire,
        ann_interal: ann_interval,
        ann_disappear: ann_disappear
    };

    $.ajax({
        type: "POST",
        url: "./includes/post_ottrun_xciptv_command_center.php",
        dataType: 'json',
        data: {
            action: 'send_announcement',
            announcement: JSON.stringify(payload),
            target_cid: selectedDevice.cid,
            target_uid: selectedDevice.uid,
            appname: selectedDevice.appname,
            csrf_token: getCsrfToken()
        },
        success: function (response) {
            if (response && response.success) {
                showToast(`Announcement sent successfully to all users`, 'success');
                $('#announcementModal').modal('hide');
            } else {
                showToast(`Failed to send announcement: ${response.error || 'Unknown error'}`, 'danger');
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', xhr.responseText);
            showToast(`Network error while sending announcement: ${error}`, 'danger');
        },
        complete: function () {
            $('#sendAnnouncementForm button[type="submit"]').prop('disabled', false);
        }
    });
});

/**
 * Refresh connected devices with toast feedback
 */
function refreshData() {
    console.log('Refreshing device data...');
    $.get('?ajax=refresh_users')
        .done((data) => {
            console.log('AJAX Response:', data);

            // Update statistics
            if (data.success && data.stats) {
                updateStatistics(data.stats);
            }

            // Update connected devices table
            if (data.success && data.users && data.users.length > 0) {
                const html = data.users.map((user) => {
                    const statusClass = getStatusClass(user.status);
                    return `
            <tr>
                <td>${user.username}</td>
                <td>${user.appname}</td>
                <td>${user.ver}</td>
                <td>${user.model}</td>
                <td><span class="badge bg-${statusClass}">${user.status}</span></td>
                <td>${user.time}</td>
                <td>
                    <button class="btn btn-sm btn-outline-theme select-device" data-username="${user.username}" data-cid="${user.cid}" data-uid="${user.uid}" data-appname="${user.appname}">
                        <i class="fas fa-hand-pointer"></i> Select
                    </button>
                </td>
            </tr>`;
                }).join('');
                $('#connectedDevicesTable tbody').html(html);
            } else {
                $('#connectedDevicesTable tbody').html('<tr><td colspan="8" class="text-center text-muted">No devices currently connected</td></tr>');
            }
        })
        .fail((xhr, status, error) => {
            console.error('AJAX Error:', xhr.responseText, status, error);
            showToast(`Failed to refresh device list: ${error}`, 'danger');
        });
}

/**
 * Get the badge class for a given status
 * @param {string} status - The status of the device
 * @returns {string} The badge class
 */
function getStatusClass(status) {
    switch (status) {
        case 'Online': return 'success';
        case 'Recently Active': return 'info';
        case 'Active': return 'primary';
        case 'Away': return 'warning';
        case 'Offline': return 'secondary';
        case 'Disconnected': return 'danger';
        default: return 'secondary';
    }
}

/**
 * Update statistics cards with real-time data
 * @param {object} stats - The statistics object from the AJAX response.
 */
function updateStatistics(stats) {
    $('#totalUsersStat').text(stats.total_users || 0);
    $('#onlineUsersStat').text(stats.online_users || 0);
    $('#pendingCommandsStat').text(stats.pending_commands || 0);
    $('#commandsTodayStat').text(stats.commands_today || 0);
}

$(function () {
    $('#annExpire').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        orientation: 'bottom auto',
        clearBtn: true,
        container: '#announcementModal' // ensures it's inside the modal
    });
});