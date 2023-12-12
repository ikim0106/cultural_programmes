// 4. A separate view for one single location, containing:
// a. A map showing the location.
// b. The location details.
// c. User comments, where users can add new comments seen by all other users.

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import GoogleMapReact from 'google-map-react';
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
    return (
        // Important! Always set the container height explicitly

        <div style={{ height: '100vh', width: '100%' }}>
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
                width="600"
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
        </div>


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