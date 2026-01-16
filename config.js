const CONFIG = {
    
    SCOPES: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    
    REDIRECT_URI: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `${window.location.origin}/login.html`
        : 'https://akvaparkovi.vercel.app/login.html',
    
    MAIN_SITE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? window.location.origin
        : 'https://akvaparkovi.vercel.app'
};

Object.freeze(CONFIG);

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Config loaded:', {
        clientId: CONFIG.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
        propertyId: CONFIG.GA_PROPERTY_ID,
        redirectUri: CONFIG.REDIRECT_URI
    });
}
