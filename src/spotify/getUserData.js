import React from "react";
import { ReactDOM } from "react";
const UserData = async function(){

    //variables
    const tracks = document.getElementById("tracks");
    const artists = document.getElementById("artists");
    const access_token = localStorage.getItem("access_token");
    let artist_list = [];
    let track_list = [];

    //functions to render Result data to HTML
    function trackTemplate(){
        var temp_url = '';
        temp_url += "<h3>Tracks</h3>"
        var html = track_list.map(function (item) {
            temp_url += `<li>
                    <div>
                        <img src="${item.album.images[0].url}" width="150" height="150">
                    </div>
                    <div>`
            temp_url += '<p>' + item.name +'</p>'
            temp_url += `</div>
                    </li>`
        });

        return tracks.innerHTML = temp_url
    }

    function artistTemplate(data){
        var temp_url = '';
        temp_url += "<h3>Artists</h3>"
        var html = artist_list.map(function (item) {
            temp_url += `<li>
                    <div>
                        <img src="${item.images[0].url}" width="150" height="150">
                    </div>
                    <div>`
            temp_url += '<p>' + item.name +'</p>'
            temp_url += `</div>
                    </li>`
        });

        return artists.innerHTML = temp_url
    }

    //API params
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+ access_token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    //fetch User top 10 Artist from ~4 weeks and log result to console
    await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10", requestOptions)
        .then((response) => {
            if(response.ok){
                return response.json();
            }else{
                throw new Error(response.statusText);
            }
        })
        .then(data => {
            artist_list = data.items
            artists.innerHTML = artistTemplate()
        })

    console.log(artist_list)

    //fetch User top 10 Songs from ~4 weeks and log result to console
    await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10", requestOptions)
        .then((response) => {
            if(response.ok){
                return response.json();
            }else{
                throw new Error(response.statusText);
            }
        })
        .then(data => {
            track_list = data.items
            tracks.innerHTML = trackTemplate()
        })

    console.log(track_list)
}

export default UserData;