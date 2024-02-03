import React from "react";
const UserData = async function(){
    const access_token = localStorage.getItem("access_token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+ access_token);

    let artist_list = [];

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10", requestOptions)
        .then((response) => {
            if(response.ok){
                return response.json();
            }else{
                throw new Error(response.statusText);
            }
        })
        .then(data => artist_list = data.items)

    console.log(artist_list)

    return (
        <div className="data">
            <div className="header">
                <h1>Tracks</h1>
                <h1>Artist</h1>
            </div>
        </div>
    )
    
}

export default UserData;