// 4. A separate view for one single location, containing:
// a. A map showing the location.
// b. The location details.
// c. User comments, where users can add new comments seen by all other users.

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import GoogleMapReact from 'google-map-react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
const Lable = ({ text }) => <div style={{
    backgroundColor: 'white',
    width: '100px',
    height: '100px',
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
}}><h5 style={{ color: "black" }}>{text}</h5>
    <button>Click Me</button></div>;

function LocationDetailPage() {

    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const tempJSON = JSON.parse(localStorage.getItem('userData'))
        if (localStorage.getItem('userData') && tempJSON.user.role === "user") {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            setIsLoading(false)
        } else {
            window.location.href = '/';
        }
    }, [])

    const location = useLocation();
    console.log(location.state)
    const venue = location.state
    const defaultProps = {
        center: {
            lat: venue.latitude,
            lng: venue.longitude
        },
        zoom: 18

    };
    const handleApiLoaded = (map, maps) => {
        // use map and maps objects

    };
    const addComment = async () => {
        let response = await fetch('http://localhost:8080/addComment', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "userId": userData.user.userId,
                "venueId": venue.venueId,
                "comment": comment
            }),
        })
        let data = await response.json();

        // if (data.success)
        // TODO: append child?
        console.log(data.message)
    };
    return (
        // Important! Always set the container height explicitly
        <>
            {!isLoading &&
                <div className={"container"} style={{ height: '100vh', width: '100%', margin: "auto" }}>
                    {/* <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
                <Lable lat={venue.latitude}
                    lng={venue.longitude}
                    text={venue.venuee}
                />

            </GoogleMapReact> */}
                    <iframe
                        width="100%"
                        height="450"
                        loading="lazy"
                        allowfullscreen
                        referrerpolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4&q=${venue.latitude},${venue.longitude}`}

                    // src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4&q=${venue.venuee}`}
                    >
                    </iframe>
                    <h4>location details:</h4>
                    <p>Name: {venue.venuee}</p>
                    {/* <p>name: {venue.venuee}</p> */}
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Your Comment Here"
                        maxRows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button variant="outlined" onClick={() => {
                        if (comment.trim() === '')
                            console.log(`Comment should not be empty`)
                        else
                            addComment();
                    }}>Comment</Button>
                </div>
            }
        </>

        // <div style={{
        //     backgroundColor: 'blue',
        //     height: '100vh', width: '100%'
        // }}>
        //     <h5 style={{ color: "red" }}>text</h5>
        //     <button>Click Me</button>
        // </div>
    );
}



export default LocationDetailPage;