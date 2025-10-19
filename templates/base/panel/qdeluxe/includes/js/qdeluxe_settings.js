/**
 * Q Deluxe Settings JavaScript Functions
 * 
 * Handles form interactions, dynamic content management,
 * and AJAX actions for the Q Deluxe configuration interface.
 * 
 * @package Cockpit
 * @subpackage Q Deluxe
 */

function getCsrfToken() {
    return $('input[name="csrf_token"]').val();
}

// View image in modal (same as Purple)
function viewImage(url) {
    if (!url) return;
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = url;
        modalImage.onerror = function () {
            this.src = 'https://i.imgur.com/QXLRWuy.png';
        };
        window.currentImageUrl = url;
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
}

function openImageInNewTab() {
    if (window.currentImageUrl) {
        window.open(window.currentImageUrl, '_blank');
    }
}

function deleteAppStore(id) {
    if (confirm('Are you sure you want to delete this app?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_appstore: 1,
                app_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-appstore";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting app store:', error);
            }
        });
    }
}

function deleteSection(id) {
    if (confirm('Are you sure you want to delete this section?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_section: 1,
                section_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-sections";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting section:', error);
            }
        });
    }
}

function deleteHomeItem(id) {
    if (confirm('Are you sure you want to delete this home item?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_home_item: 1,
                home_item_id: id, // <-- fix here
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-sections";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting home item:', error);
            }
        });
    }
}

function deleteTheme(id) {
    if (confirm('Are you sure you want to delete this theme?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_theme: 1,
                theme_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-themes";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting theme:', error);
            }
        });
    }
}

function deleteTeam(id) {
    if (confirm('Are you sure you want to delete this team?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_team: 1,
                team_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-sports";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting team:', error);
            }
        });
    }
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_event: 1,
                event_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-sports";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting event:', error);
            }
        });
    }
}

function deleteSportCategory(id) {
    if (id === 0) {
        alert('Cannot delete the Uncategorized category.');
        return;
    }
    if (confirm('Are you sure you want to delete this sport category?')) {
        $.ajax({
            type: "POST",
            url: "./includes/post_qdeluxe_settings.php",
            data: {
                delete_sport_category: 1,
                category_id: id,
                csrf_token: getCsrfToken()
            },
            success: function () {
                window.location.href = "./qdeluxe_settings.php?tab=pills-sports";
            },
            error: function (xhr, status, error) {
                console.error('Error deleting sport category:', error);
            }
        });
    }
}

function editAppStore(app_id, name, description, banner, package_name, install_url) {
    $("#name").val(name);
    $("#description").val(description);
    $("#banner").val(banner);
    $("#package_name").val(package_name);
    $("#install_url").val(install_url);

    $('#post_appstore button[name="post_appstore"]').text('Update App');
    $('html, body').animate({
        scrollTop: $("#name").offset().top - 100
    }, 500);
}
function editSection(title, predefined, reference) {
    $("#section_title").val(title);

    if (predefined === 'Custom') {
        $('#predefined').val('general');
    } else {
        $('#predefined').val(predefined);
    }
    $("#predefined").val(predefined);
    $("#reference").val(reference);

    $('#post_section button[name="post_section"]').text('Update Section');
    $('html, body').animate({
        scrollTop: $("#section_title").offset().top - 100
    }, 500);
}
function editHomeItem(title, type, description, reference, reference_text, backdrop_image, backdrop_video, section_id) {
    $("#title").val(title);
    $("#type").val(type);
    $("#description").val(description);
    $("#reference").val(reference);
    $("#reference_text").val(reference_text);
    $("#backdrop_image").val(backdrop_image);
    $("#backdrop_video").val(backdrop_video);
    $("#section_id").val(section_id);

    $('#post_home_item button[name="post_home_item"]').text('Update Content');
    $('html, body').animate({
        scrollTop: $("#title").offset().top - 100
    }, 500);
}
function editTheme(theme_name, preview_image, download_url) {
    $("#theme_name").val(theme_name);
    $("#theme_preview_image").val(preview_image);
    $("#theme_download_url").val(download_url);

    $('#post_theme button[name="post_theme"]').text('Update Theme');
    $('html, body').animate({
        scrollTop: $("#theme_name").offset().top - 100
    }, 500);
}

function editTeam(name, flag, id) {
    $("#team_name").val(name);
    $("#flag").val(flag);

    $('#post_team button[name="post_team"]').text('Update Team');
    $('html, body').animate({
        scrollTop: $("#team_name").offset().top - 100
    }, 500);
}

function editEvent(team_a_id, team_b_id, backdrop, start_timestamp, description_ev, category_id, channel_id) {
    $("#team_a_id").val(team_a_id);
    $("#team_b_id").val(team_b_id);
    $("#backdrop").val(backdrop);
    $("#start_timestamp").val(start_timestamp);
    $("#description_ev").val(description_ev);
    $("#category_id").val(category_id);
    $("#channel_id").val(channel_id);

    $('#post_event button[name="post_event"]').text('Update Event');
    $('html, body').animate({
        scrollTop: $("#team_a_id").offset().top - 100
    }, 500);
}

$(function () {
    // Initialize toasts
    $('.toast').each(function () {
        var toast = new bootstrap.Toast(this);
        toast.show();
    });

    // Hide reference field if 'recent' is selected
    $('#predefined').on('change', function () {
        const val = $(this).val();
        if (val === 'recent-movies' || val === 'recent-shows' || val === 'general') {
            $('#reference-group').hide();
        } else {
            $('#reference-group').show();
        }
    }).trigger('change'); // Trigger on page load

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        $('.nav-link[href="#' + tabParam + '"]').tab('show');
    }

    $('.nav-link').on('click', function () {
        $('#pre-text').hide();
    });

    $('#serviceDataBtn').on('click', function () {
        $.ajax({
            url: './includes/post_qdeluxe_services.php',
            type: 'POST',
            data: { get_service_list: 1, csrf_token: getCsrfToken() },
            dataType: 'json',
            success: function (services) {
                let html = '<div class="mb-3"><label for="serviceSelect" class="form-label">Select Service:</label><select id="serviceSelect" class="form-select">';
                html += '<option value="">-- Select --</option>';
                services.forEach(function (service) {
                    html += `<option value="${service.service_id}">${service.service_name}</option>`;
                });
                html += '</select></div><div id="serviceDataDetails"></div>';
                $('#serviceDataContent').html(html);
            }
        });
    });

    // When a service is selected, load its data
    $(document).on('change', '#serviceSelect', function () {
        const serviceId = $(this).val();
        if (!serviceId) {
            $('#serviceDataDetails').html('');
            return;
        }
        $.ajax({
            url: './includes/post_qdeluxe_services.php',
            type: 'POST',
            data: { get_service_data: 1, service_id: serviceId, csrf_token: getCsrfToken() },
            dataType: 'json',
            success: function (data) {
                let html = '<pre style="max-height:400px;overflow:auto;">' + JSON.stringify(data, null, 2) + '</pre>';
                $('#serviceDataDetails').html(html);
            }
        });
    });

    // Load leagues into dropdown when modal opens
    $('#importTeamsModal').on('show.bs.modal', function () {
        $.getJSON('./includes/db/thesportsdb_leagues.json', function (leagues) {
            let options = '<option disabled>Select League</option>';
            leagues.forEach(function (league) {
                if (league.idLeague && league.strLeague) {
                    options += `<option value="${league.idLeague}">${league.strLeague}</option>`;
                }
            });
            $('#leagueSelect').html(options);
        });
        $('#importTeamsStatus').html('');
        $('#importTeamsForm')[0].reset();
    });

    // Handle import form submit
    $('#importTeamsForm').on('submit', function (e) {
        e.preventDefault();
        const leagueId = $('#leagueSelect').val();
        const apiKey = $('#tsdbApiKey').val();
        if (!leagueId || !apiKey) return;

        $('#importTeamsStatus').html('<span class="text-info">Importing teams...</span>');

        $.ajax({
            type: 'POST',
            url: './includes/post_qdeluxe_settings.php',
            data: {
                import_teams: 1,
                league_id: leagueId,
                api_key: apiKey,
                csrf_token: getCsrfToken()
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    $('#importTeamsStatus').html('<span class="text-success">Teams imported successfully!</span>');
                } else {
                    $('#importTeamsStatus').html('<span class="text-danger">' + (resp.message || 'Import failed') + '</span>');
                }
                window.location.href = "./qdeluxe_settings.php?tab=pills-sports";
            },
            error: function () {
                $('#importTeamsStatus').html('<span class="text-danger">Error importing teams.</span>');
            }
        });
    });

    // Load leagues into dropdown when modal opens
    $('#importEventsModal').on('show.bs.modal', function () {
        $.getJSON('./includes/db/thesportsdb_leagues.json', function (leagues) {
            let options = '<option disabled>Select League</option>';
            leagues.forEach(function (league) {
                if (league.idLeague && league.strLeague) {
                    options += `<option value="${league.idLeague}">${league.strLeague}</option>`;
                }
            });
            $('#eventLeagueSelect').html(options);
        });
        $('#importEventsStatus').html('');
        $('#importEventsForm')[0].reset();
    });

    // Handle import form submit
    $('#importEventsForm').on('submit', function (e) {
        e.preventDefault();
        const leagueId = $('#eventLeagueSelect').val();
        const apiKey = $('#eventTsdbApiKey').val();
        const categoryId = $('#eventCategorySelect').val();
        if (!leagueId || !apiKey || categoryId === null) return;

        $('#importEventsStatus').html('<span class="text-info">Importing events...</span>');

        $.ajax({
            type: 'POST',
            url: './includes/post_qdeluxe_settings.php',
            data: {
                import_events: 1,
                league_id: leagueId,
                api_key: apiKey,
                category_id: categoryId,
                csrf_token: getCsrfToken()
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    $('#importEventsStatus').html('<span class="text-success">Events imported successfully!</span>');
                } else {
                    $('#importEventsStatus').html('<span class="text-danger">' + (resp.message || 'Import failed') + '</span>');
                }
                window.location.href = "./qdeluxe_settings.php?tab=pills-sports";
            },
            error: function () {
                $('#importEventsStatus').html('<span class="text-danger">Error importing events.</span>');
            }
        });
    });

    // Load leagues into dropdown when modal opens
    $('#importNotificationsModal').on('show.bs.modal', function () {
        $.getJSON('./includes/db/thesportsdb_leagues.json', function (leagues) {
            let options = '<option disabled>Select League</option>';
            leagues.forEach(function (league) {
                if (league.idLeague && league.strLeague) {
                    options += `<option value="${league.idLeague}">${league.strLeague}</option>`;
                }
            });
            $('#notificationLeagueSelect').html(options);
        });
        $('#importNotificationsStatus').html('');
        $('#importNotificationsForm')[0].reset();
    });

    // Handle import notifications form submit
    $('#importNotificationsForm').on('submit', function (e) {
        e.preventDefault();
        const sectionId = $('#notificationSectionSelect').val();
        const leagueId = $('#notificationLeagueSelect').val();
        const apiKey = $('#notificationApiKey').val();
        if (!sectionId || !leagueId || !apiKey) return;

        $('#importNotificationsStatus').html('<span class="text-info">Importing notifications...</span>');

        $.ajax({
            type: 'POST',
            url: './includes/post_qdeluxe_settings.php',
            data: {
                import_notifications: 1,
                section_id: sectionId,
                league_id: leagueId,
                api_key: apiKey,
                csrf_token: getCsrfToken()
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.success) {
                    $('#importNotificationsStatus').html('<span class="text-success">Notifications imported successfully!</span>');
                } else {
                    $('#importNotificationsStatus').html('<span class="text-danger">' + (resp.message || 'Import failed') + '</span>');
                }
                window.location.href = "./qdeluxe_settings.php?tab=pills-sections";
            },
            error: function () {
                $('#importNotificationsStatus').html('<span class="text-danger">Error importing notifications.</span>');
            }
        });
    });
});