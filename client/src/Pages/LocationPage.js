import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import GoogleMapReact from 'google-map-react';


const Lable = ({ text, venue, buttonOnclickFunction }) => <div style={{
    backgroundColor: 'white',
    width: '100px',
    height: '100px',
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
}}><h5 style={{ color: "black" }}>{text}</h5>
    <button onClick={() => buttonOnclickFunction(venue)}>Click Me</button></div>;
function LocationPage() {
    const nagivate = useNavigate()
    const [venues, SetVenues] = useState([]);
    const defaultProps = {
        center: {
            lat: 22.302711,
            lng: 114.177216
            // this is hong kong
        },
        zoom: 14

    };
    const handleApiLoaded = (map, maps) => {
        // use map and maps objects

    };
    const viewLocationDetails = (venue) => {
        nagivate('/LocationDetailPage', { state: venue })
    }
    useEffect(() => {
        const getAllVenue = async () => {
            let response = await fetch('http://localhost:8080/getAllVenue', {
                method: "Get",
            })
            let data = await response.json();
            if (data.success)
                SetVenues(data.venues)
            console.log(data.message)
        }
        getAllVenue();
    }, [])
    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
                {venues.map((val, key) => {
                    console.log(val)
                    const venue = JSON.parse(JSON.stringify(val));
                    return (
                        <Lable
                            lat={val.latitude}
                            lng={val.longitude}
                            text={val.venuee}
                            venue={val}
                            buttonOnclickFunction={viewLocationDetails}
                        />)
                })}
            </GoogleMapReact>
        </div>


        // <div style={{
        //     backgroundColor: 'blue',
        // }}><h5 style={{ color: "red" }}>text</h5>
        //     <button>Click Me</button></div>
    );
}



export default LocationPage;