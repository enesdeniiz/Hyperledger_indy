/**
 * ChainFlow SSI Login System - Dashboard Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const userDidElement = document.getElementById('user-did');
    const credentialExpiryElement = document.getElementById('credential-expiry');
    const proofIdElement = document.getElementById('proof-id');
    const logoutButton = document.getElementById('logout-button');
    
    // Check if user is logged in
    checkLogin();
    
    // Event listeners
    logoutButton.addEventListener('click', logout);
    
    /**
     * Check if user is logged in
     */
    function checkLogin() {
        // Get user data from session storage
        const userDID = sessionStorage.getItem('userDID');
        const proofId = sessionStorage.getItem('proofId');
        const expiryDate = sessionStorage.getItem('expiryDate');
        
        // If no user data, redirect to login
        if (!userDID || !proofId) {
            window.location.href = '/';
            return;
        }
        
        // Display user data
        displayUserData(userDID, proofId, expiryDate);
    }
    
    /**
     * Display user data
     */
    function displayUserData(did, proofId, expiryDate) {
        // Display DID
        userDidElement.textContent = formatDID(did);
        userDidElement.setAttribute('title', did);
        
        // Display proof ID
        proofIdElement.textContent = formatProofId(proofId);
        proofIdElement.setAttribute('title', proofId);
        
        // Display expiry date
        if (expiryDate) {
            const formattedDate = formatExpiryDate(expiryDate);
            credentialExpiryElement.textContent = formattedDate;
        } else {
            credentialExpiryElement.textContent = 'Belirtilmemiş';
        }
    }
    
    /**
     * Format DID for display
     */
    function formatDID(did) {
        if (!did || did.length < 10) {
            return did;
        }
        
        return `${did.substring(0, 8)}...${did.substring(did.length - 4)}`;
    }
    
    /**
     * Format proof ID for display
     */
    function formatProofId(proofId) {
        if (!proofId || proofId.length < 10) {
            return proofId;
        }
        
        return `${proofId.substring(0, 8)}...${proofId.substring(proofId.length - 4)}`;
    }
    
    /**
     * Format expiry date for display
     */
    function formatExpiryDate(dateString) {
        try {
            // Try to parse as ISO date
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                // Try to parse as timestamp
                const timestamp = parseInt(dateString);
                if (!isNaN(timestamp)) {
                    const timestampDate = new Date(timestamp * 1000);
                    return formatDate(timestampDate);
                }
                
                return 'Geçersiz tarih';
            }
            
            return formatDate(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Geçersiz tarih';
        }
    }
    
    /**
     * Format date as DD.MM.YYYY
     */
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}.${month}.${year}`;
    }
    
    /**
     * Logout
     */
    function logout() {
        // Clear session storage
        sessionStorage.removeItem('userDID');
        sessionStorage.removeItem('proofId');
        sessionStorage.removeItem('expiryDate');
        
        // Redirect to login
        window.location.href = '/';
    }
});
