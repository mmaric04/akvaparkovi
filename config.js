/**
 * Konfiguracija za Google Analytics API
 * 
 * NAPOMENA: Za sigurnost u produkciji, ove vrijednosti bi trebale biti
 * učitane s backend servera ili korištene environment varijable.
 * 
 * Za lokalni razvoj, zamijenite vrijednosti svojim podacima.
 */

const CONFIG = {
    // Google OAuth 2.0 Client ID
    // Ovo je javni identifikator i siguran je za korištenje u frontendu
    GOOGLE_CLIENT_ID: '1061343184622-lua8vt3f458culh6a8nt7g939nui3f0f.apps.googleusercontent.com',
    
    // Google Analytics Property ID
    GA_PROPERTY_ID: '520322226',
    
    // Google Analytics Measurement ID (za gtag.js tracking)
    GA_MEASUREMENT_ID: 'G-K41V3G1YGJ',
    
    // API Key - koristi se za neke Google API pozive
    // NAPOMENA: U produkciji ograničite ovaj ključ na specifične domene u Google Cloud Console
    GOOGLE_API_KEY: 'AIzaSyBWJGbh_Cy2TvNqbRcSf-zXA-GD22OTB68',
    
    // OAuth Scopes
    SCOPES: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    
    // Redirect URLs
    REDIRECT_URI: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `${window.location.origin}/login.html`
        : 'https://akvaparkovi.vercel.app/login.html',
    
    // Main site URL
    MAIN_SITE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? window.location.origin
        : 'https://akvaparkovi.vercel.app'
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

// Log za debug (ukloniti u produkciji)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Config loaded:', {
        clientId: CONFIG.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
        propertyId: CONFIG.GA_PROPERTY_ID,
        redirectUri: CONFIG.REDIRECT_URI
    });
}
