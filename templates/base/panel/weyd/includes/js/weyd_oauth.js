/**
 * Weyd OAuth JavaScript
 * 
 * Handles OAuth authentication flows for Trakt and debrid services.
 * Adapted from weyd_pub_2 source for Cockpit module integration.
 * 
 * @package Cockpit
 * @subpackage Weyd
 * @author Ian O'Neill
 * @version See version.json
 */

const WEYD_CONFIG = {
    OAUTH_TYPES: ["Premiumize", "Real-Debrid", "Trakt"],
    POLL_INTERVALS: {
        DEFAULT: 5000,
        TIMEOUT: 1800000
    },
    ENDPOINTS: {
        PREMIUMIZE: {
            code: "../../api/weyd/api/debrid/pm/code.php",
            poll: "../../api/weyd/api/debrid/pm/poll.php"
        },
        TRAKT: {
            code: "../../api/weyd/api/trakt/code.php",
            poll: "../../api/weyd/api/trakt/poll.php"
        },
        REAL_DEBRID: {
            code: "../../api/weyd/api/debrid/rd/code.php",
            poll: "../../api/weyd/api/debrid/rd/poll.php"
        }
    }
};

const WeydOAuth = {
    oauthPoller: null,
    oauthTimeout: null,

    /**
     * Clear OAuth polling timers
     */
    clearOAuth() {
        if (this.oauthPoller) {
            clearInterval(this.oauthPoller);
            this.oauthPoller = null;
        }
        if (this.oauthTimeout) {
            clearTimeout(this.oauthTimeout);
            this.oauthTimeout = null;
        }
    },

    /**
     * Start OAuth authentication flow
     */
    startOAuth(serviceName, deviceId = null, userId = null, customName = null) {
        console.log(`[WeydOAuth] Starting OAuth for ${serviceName}`);

        const codeEndpoint = this.getEndpoint(serviceName, "code");
        const pollEndpoint = this.getEndpoint(serviceName, "poll");
        const payload = this.buildPayload(deviceId, userId, customName);

        fetch(codeEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(json => {
                if (!json.success) {
                    console.error("[WeydOAuth] Error:", json.message || "Something went wrong");
                    alert("Error: " + (json.message || "Something went wrong"));
                    return;
                }
                const oauthData = json.data ? json.data : json;
                if (!oauthData || typeof oauthData !== 'object' || !oauthData.verification_url || !oauthData.user_code) {
                    console.error("[WeydOAuth] Invalid OAuth data:", oauthData);
                    alert("Error: Invalid OAuth data received from server.");
                    return;
                }
                this.setupOAuthModal(oauthData, serviceName, payload, pollEndpoint);
            })
            .catch(error => {
                console.error("[WeydOAuth] Fetch error:", error);
                alert("Failed to start OAuth process");
            });
    },

    /**
     * Get OAuth endpoint for service
     */
    getEndpoint(service, type) {
        const endpoints = WEYD_CONFIG.ENDPOINTS;
        switch (service) {
            case "Premiumize": return endpoints.PREMIUMIZE[type];
            case "Trakt": return endpoints.TRAKT[type];
            case "Real-Debrid": return endpoints.REAL_DEBRID[type];
            default: return endpoints.REAL_DEBRID[type];
        }
    },

    /**
     * Build payload for OAuth request
     */
    buildPayload(deviceId, userId, customName) {
        const payload = {};
        if (deviceId) payload.device_id = deviceId;
        if (userId) payload.user_id = userId;
        if (customName) payload.name = customName;
        return payload;
    },

    /**
     * Setup OAuth modal with authentication data
     */
    setupOAuthModal(data, serviceName, payload, pollUrl) {
        const modal = document.getElementById("oauth-modal");
        const backdrop = document.getElementById("modal-backdrop");

        if (!modal) {
            console.error("[WeydOAuth] OAuth modal not found");
            return;
        }

        const nameEl = document.getElementById("oauth-service-name");
        const linkEl = document.getElementById("oauth-verification-url");
        const codeEl = document.getElementById("oauth-user-code");

        if (nameEl) nameEl.textContent = serviceName;
        if (linkEl) {
            linkEl.textContent = data.verification_url;
            linkEl.href = data.verification_url;
        }
        if (codeEl) {
            codeEl.value = data.user_code;
            codeEl.style.textAlign = "center";
        }

        modal.style.display = "block";
        if (backdrop) backdrop.style.display = "block";

        this.startPolling(payload, pollUrl, data);
    },

    /**
     * Start polling for OAuth completion
     */
    startPolling(payload, pollUrl, pollingInfo) {
        const expiresInMs = 1000 * (parseInt(pollingInfo.expires_in, 10) || 1800);
        const intervalMs = 1000 * (parseInt(pollingInfo.interval, 10) || 5);
        const startTime = Date.now();

        this.oauthPoller = setInterval(() => {
            const elapsed = Date.now() - startTime;

            fetch(pollUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(payload)
            })
                .then(resp => resp.json())
                .then(json => {
                    if (json.success) {
                        console.log("[WeydOAuth] Success - clearing and reloading");
                        this.clearOAuth();
                        this.closeOAuthModal();
                        location.reload();
                    } else if (json.message && !json.message.includes("not yet available")) {
                        console.error("[WeydOAuth] Poll error:", json.message);
                    }
                })
                .catch(err => {
                    console.error("[WeydOAuth] Poll fetch error:", err);
                });

            if (elapsed > expiresInMs) {
                console.warn("[WeydOAuth] Timed out");
                this.clearOAuth();
                this.closeOAuthModal();
                alert("Authorization timed out. Please try again.");
            }
        }, intervalMs);

        this.oauthTimeout = setTimeout(() => {
            console.warn("[WeydOAuth] Absolute timeout reached");
            this.clearOAuth();
            this.closeOAuthModal();
        }, expiresInMs);
    },

    /**
     * Close OAuth modal
     */
    closeOAuthModal() {
        const modal = document.getElementById("oauth-modal");
        const backdrop = document.getElementById("modal-backdrop");

        if (modal) modal.style.display = "none";
        if (backdrop) backdrop.style.display = "none";

        this.clearOAuth();
    },

    /**
     * Initialize OAuth handlers
     */
    init() {
        const closeBtn = document.getElementById("oauth-close-btn");
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeOAuthModal();
            });
        }

        const backdrop = document.getElementById("modal-backdrop");
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeOAuthModal();
                }
            });
        }

        document.querySelectorAll(".service-option").forEach(option => {
            option.addEventListener("click", () => {
                const selectedType = option.dataset.type;
                this.selectServiceType(selectedType);
            });
        });

        const startOAuthBtn = document.getElementById("start-oauth-button");
        if (startOAuthBtn) {
            startOAuthBtn.addEventListener("click", () => {
                const typeValue = document.getElementById("selected_type")?.value;
                const serviceName = document.getElementById("name")?.value?.trim();

                if (!serviceName) {
                    alert("Service name is required before connecting.");
                    document.getElementById("name")?.focus();
                    return;
                }

                if (typeValue && serviceName) {
                    this.startOAuth(typeValue, null, null, serviceName);
                }
            });
        }

        this.initTraktHandlers();
    },

    /**
     * Select service type and update UI
     */
    selectServiceType(type) {
        document.querySelectorAll(".service-option").forEach(option => {
            option.classList.remove("active");
        });
        document.querySelector(`.service-option[data-type="${type}"]`)?.classList.add("active");

        const typeInput = document.getElementById("selected_type");
        if (typeInput) typeInput.value = type;

        const isOAuthType = WEYD_CONFIG.OAUTH_TYPES.includes(type);
        const isEditing = document.getElementById("service-form")?.dataset.editing === '1';

        const apiKeyWrapper = document.getElementById("api-key-wrapper");
        const oauthBtnWrapper = document.getElementById("oauth-button-wrapper");
        const rdWarning = document.getElementById("rd-warning");

        if (apiKeyWrapper) {
            apiKeyWrapper.style.display = isOAuthType ? "none" : "block";
        }
        if (oauthBtnWrapper) {
            oauthBtnWrapper.style.display = !isEditing && isOAuthType ? "block" : "none";
        }
        if (rdWarning) {
            rdWarning.style.display = type === "Real-Debrid" ? "block" : "none";
        }
    },

    /**
     * Initialize Trakt-specific handlers
     */
    initTraktHandlers() {
        document.querySelectorAll(".connect-trakt-button").forEach(btn => {
            btn.addEventListener("click", () => {
                const userId = parseInt(btn.dataset.userId, 10);
                if (userId) {
                    this.startOAuth("Trakt", null, userId);
                } else {
                    alert("User ID missing.");
                }
            });
        });

        document.querySelectorAll(".disconnect-trakt").forEach(btn => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                if (!confirm("Are you sure you want to disconnect Trakt?")) return;

                const form = document.createElement("form");
                form.method = "POST";
                form.action = window.location.href;

                const csrfToken = getCsrfToken();

                const inputs = [
                    { name: "revoke_trakt_token", value: "1" },
                    { name: "user_id", value: btn.dataset.userId },
                    { name: "csrf_token", value: csrfToken }
                ];

                inputs.forEach(inputData => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = inputData.name;
                    input.value = inputData.value;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            });
        });
    }
};

function startOAuth(service, deviceId = null, userId = null, name = null) {
    WeydOAuth.startOAuth(service, deviceId, userId, name);
}

function closeOAuthModal() {
    WeydOAuth.closeOAuthModal();
}

function selectServiceType(serviceType) {
    WeydOAuth.selectServiceType(serviceType);
}

document.addEventListener("DOMContentLoaded", () => {
    WeydOAuth.init();
});