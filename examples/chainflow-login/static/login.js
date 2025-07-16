/**
 * ChainFlow SSI Login System - Login Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loginInitial = document.getElementById('login-initial');
    const loginQR = document.getElementById('login-qr');
    const loginConnecting = document.getElementById('login-connecting');
    const loginProofRequest = document.getElementById('login-proof-request');
    const loginSuccess = document.getElementById('login-success');
    const loginError = document.getElementById('login-error');
    const loginButton = document.getElementById('login-button');
    const cancelButton = document.getElementById('cancel-login');
    const retryButton = document.getElementById('retry-login');
    const deepLinkButton = document.getElementById('deep-link');
    const qrcodeElement = document.getElementById('qrcode');
    const errorMessage = document.getElementById('error-message');
    
    // State
    let connectionId = null;
    let invitationUrl = null;
    let statusCheckInterval = null;
    
    // Event listeners
    loginButton.addEventListener('click', startLogin);
    cancelButton.addEventListener('click', cancelLogin);
    retryButton.addEventListener('click', startLogin);
    deepLinkButton.addEventListener('click', openDeepLink);
    
    /**
     * Start the login process
     */
    function startLogin() {
        // Show connecting UI
        showElement(loginConnecting);
        hideElement(loginInitial);
        hideElement(loginQR);
        hideElement(loginProofRequest);
        hideElement(loginSuccess);
        hideElement(loginError);
        
        // Initialize login
        fetch('/api/login/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store connection ID
            connectionId = data.connection_id;
            
            // Create invitation URL and QR code
            const invitation = data.invitation;
            invitationUrl = `didcomm://${btoa(JSON.stringify(invitation))}`;
            
            // Generate QR code
            QRCode.toCanvas(qrcodeElement, invitationUrl, {
                width: 200,
                margin: 2
            }, function(error) {
                if (error) {
                    console.error('Error generating QR code', error);
                    showLoginError('QR kod oluşturulurken bir hata oluştu.');
                }
            });
            
            // Show QR code UI
            hideElement(loginConnecting);
            showElement(loginQR);
            
            // Start checking status
            startStatusCheck();
        })
        .catch(error => {
            console.error('Error initializing login:', error);
            showLoginError('Giriş başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
        });
    }
    
    /**
     * Cancel the login process
     */
    function cancelLogin() {
        // Stop status check
        stopStatusCheck();
        
        // Reset state
        connectionId = null;
        invitationUrl = null;
        
        // Show initial UI
        showElement(loginInitial);
        hideElement(loginQR);
        hideElement(loginConnecting);
        hideElement(loginProofRequest);
        hideElement(loginSuccess);
        hideElement(loginError);
    }
    
    /**
     * Open deep link to wallet
     */
    function openDeepLink() {
        if (invitationUrl) {
            window.location.href = invitationUrl;
        }
    }
    
    /**
     * Start checking login status
     */
    function startStatusCheck() {
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
        }
        
        statusCheckInterval = setInterval(() => {
            if (!connectionId) {
                stopStatusCheck();
                return;
            }
            
            checkLoginStatus();
        }, 2000);
    }
    
    /**
     * Stop checking login status
     */
    function stopStatusCheck() {
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            statusCheckInterval = null;
        }
    }
    
    /**
     * Check login status
     */
    function checkLoginStatus() {
        fetch(`/api/login/status/${connectionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                handleStatusUpdate(data);
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }
    
    /**
     * Handle status update
     */
    function handleStatusUpdate(data) {
        const status = data.status;
        
        switch (status) {
            case 'invitation_created':
                // Already showing QR code
                break;
                
            case 'request_received':
            case 'response_sent':
            case 'connected':
                // Connection established, waiting for proof request
                hideElement(loginQR);
                showElement(loginConnecting);
                break;
                
            case 'proof_requested':
                // Proof requested, waiting for user to approve
                hideElement(loginConnecting);
                showElement(loginProofRequest);
                break;
                
            case 'login_successful':
                // Login successful, store user data and redirect
                stopStatusCheck();
                
                // Store user data in session storage
                sessionStorage.setItem('userDID', data.did);
                sessionStorage.setItem('proofId', data.proof_id);
                sessionStorage.setItem('expiryDate', data.expiry_date);
                
                // Show success UI
                hideElement(loginProofRequest);
                showElement(loginSuccess);
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
                break;
                
            case 'error':
                // Error occurred
                stopStatusCheck();
                showLoginError(data.error || 'Giriş sırasında bir hata oluştu.');
                break;
                
            default:
                // Unknown status
                console.log('Unknown status:', status);
        }
    }
    
    /**
     * Show login error
     */
    function showLoginError(message) {
        errorMessage.textContent = message;
        hideElement(loginInitial);
        hideElement(loginQR);
        hideElement(loginConnecting);
        hideElement(loginProofRequest);
        hideElement(loginSuccess);
        showElement(loginError);
    }
    
    /**
     * Show element
     */
    function showElement(element) {
        if (element) {
            element.classList.remove('d-none');
        }
    }
    
    /**
     * Hide element
     */
    function hideElement(element) {
        if (element) {
            element.classList.add('d-none');
        }
    }
});
