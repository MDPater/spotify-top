window.onload = function() {
    //generate code_verifier String for Auth
    function generateRandomString(length){
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    //generate Code Challenge for Auth
    async function generateCodeChallenge(codeVerifier){
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));

        return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    //generate url for Authorization
    function generateUrlWithParams(url, params){
        const urlObject = new URL(url);
        urlObject.search = new URLSearchParams(params).toString();

        return urlObject.toString();
    }

    //authorize with Spotify API
    function redirectToSpotifyAuthEndpoint(){
        const codeVerifier = generateRandomString(64);

        generateCodeChallenge(codeVerifier).then((code_challenge) => {
            window.localStorage.setItem('code_verifier', codeVerifier);

            window.location = generateUrlWithParams('https://accounts.spotify.com/authorize', {
            response_type: 'code',
            client_id,
            scope: 'user-top-read',
            code_challenge_method: 'S256',
            code_challenge,
            redirect_uri,
        })
        });
        //if authorized URL will return with code in response
    }

    //get from Spotify app dashboard
    const client_id = '532eacb714ff45edafb79a2253c51666';
    const _uri = 'http://localhost:3000';
    //encoded uri string, if not encoded uri doesnt work because special characters
    const redirect_uri = encodeURIComponent(_uri);

    //Restore API tokens from localstorage or assign null
    let access_token = localStorage.getItem('access_token') || null;
    let refresh_token = localStorage.getItem('refresh_token') || null;
    let expires_at = localStorage.getItem('expires_at') || null;

    //If Authorization accepted get code
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    if (code){
        //Authorized and ready to get access_token
    }

    document.getElementById('login-button').addEventListener('click', redirectToSpotifyAuthEndpoint);
}