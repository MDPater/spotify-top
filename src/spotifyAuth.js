import UserData from "./spotify/getUserData";

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

    //clear localStorage
    function logout(){
        localStorage.clear();
        window.location.reload();
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

    //fetch Spotify API access_token from generated code_verifier
    function exchangeToken(code){
        const code_verifier = localStorage.getItem('code_verifier');

        const params = new URLSearchParams();
            params.append("client_id", client_id);
            params.append("grant_type", "authorization_code");
            params.append("code", code);
            params.append("redirect_uri", redirect_uri);
            params.append("code_verifier", code_verifier);
        
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: params
        })
        .then(addThrowErrorToFetch)
        .then((data) => {
            tokenResponse(data);
            
            //clear search query
            window.history.replaceState({}, document.title, '/');
        })
    }

    //check for fetch error
    async function addThrowErrorToFetch(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw { response, error: await response.json() };
        }
    }

    //get Auth token from fetch response
    function tokenResponse(data){
        console.log(data);

        access_token = data.access_token;
        refresh_token = data.refresh_token;

        const t = new Date();
        expires_at = t.setSeconds(t.getSeconds() + data.expires_in);

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expires_at', expires_at);

        getUserData();
    }

    //fetch User top Songs, Artists
    async function getUserData(){
        UserData();
    }

    //get from Spotify app dashboard
    const client_id = 'YOUR CLIENT ID';
    const redirect_uri = 'http://localhost:3000';

    //Restore API tokens from localstorage or assign null
    let access_token = localStorage.getItem('access_token') || null;
    let refresh_token = localStorage.getItem('refresh_token') || null;
    let expires_at = localStorage.getItem('expires_at') || null;

    //If Authorization accepted get code
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    if (code){
        //Authorized and ready to get access_token
        exchangeToken(code)
    } else if(access_token && refresh_token && expires_at){
        //user logged in
        getUserData();
    }else{
        //not logged in
        
    }

    document.getElementById('login-button').addEventListener('click', redirectToSpotifyAuthEndpoint);
    document.getElementById('logout-button').addEventListener('click', logout);
}