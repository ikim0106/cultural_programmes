// 4. A separate view for one single location, containing:
// a. A map showing the location.
// b. The location details.
// c. User comments, where users can add new comments seen by all other users.

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import GoogleMapReact from 'google-map-react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { padding } from '@mui/system';
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
    const [comments, setComments] = useState([]);


    const getAllCommentFor = async () => {
        let response = await fetch(`http://localhost:8080/getAllCommentFor/${venue.venueId}`, {
            method: "GET",
            headers: {
                Authorization: userData.user.userId,
            }
        })
        let data = await response.json();

        if (data.success)
            setComments(data.comments)
        console.log(data.message)
        console.log(data.comments)
    };

    useEffect(() => {
        const tempJSON = JSON.parse(localStorage.getItem('userData'))
        if (localStorage.getItem('userData') && tempJSON.user.role === "user") {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            if (userData?.user?.userId) {
                getAllCommentFor();
                setIsLoading(false)
            }
        } else {
            window.location.href = '/';
        }
    }, [userData?.user?.userId])

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
            headers: {
                "Content-Type": "application/json",
                Authorization: userData.user.userId,
            },
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
                <div className={"container"} style={{
                    height: '100%',
                    width: '100%',
                    margin: "auto",
                    backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/e/e0/Hong_Kong_Cultural_Centre_201408.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                }}>
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
                    <div style={{
                        height: '100%',
                        backgroundColor: '#bbc4eb8c'
                    }}>

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
                        <div style={{
                            margin: "5%",
                            padding: "3%",
                            background: "#ebedf4df",
                            borderRadius: "10px"
                        }}>
                            <h1 style={{ fontFamily: "Georgia, serif" }}>{venue.venuee}</h1>
                            <h3 style={{ fontFamily: "Georgia, serif" }}>Event details:</h3>

                            <p>--Event table--</p>
                            <br></br>
                            <br></br>
                            <br></br>


                            <div style={{ border: '2px solid rgba(128, 128, 128, 0.58)' }}></div>

                            <table id="formtable" style={{
                                padding: '0.5%',
                                marginTop: '1%',
                                marginLeft: '3%',
                                backgroundColor: '#faf9fa6e',
                                width: '95%',
                                paddingBottom: '5%',
                            }}><tr>
                                    <td id="formleft" style={{
                                        padding: '2%',

                                    }}>
                                        <h2 style={{ fontFamily: "Georgia, serif" }}>Comments</h2>
                                        <hr></hr>
                                        {comments && comments.length > 0 &&
                                            comments.map((val, key) => {
                                                return (
                                                    <div key={key} >
                                                        <h4>@{val.userId}</h4>
                                                        <p style={{
                                                            marginTop: '-2%',
                                                        }}>{val.comment}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </td>
                                    <td id="formright" style={{
                                        width: '55%',
                                        
                                        paddingLeft: '10%',
                                    }}>
                                        <h1 style={{ fontFamily: "Georgia, serif" }}>Any Question?</h1>
                                        <h3 style={{ fontFamily: "Georgia, serif" }}>Leave a comment:</h3>

                                        {/* <p>name: {venue.venuee}</p> */}
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            label="Your Comment Here"
                                            maxRows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            style={{
                                                marginBottom: '2%',
                                                width: '90%',
                                                backgroundColor: '#ebedf4f6'
                                            }}
                                        />
                                        <br></br>
                                        <Button variant="outlined" onClick={() => {
                                            if (comment.trim() === '')
                                                console.log(`Comment should not be empty`)
                                            else
                                                addComment();
                                        }} style={{
                                            marginLeft: '71%',
                                            backgroundColor: '#d4e3ee5f'
                                        }}>Submit</Button>
                                    </td></tr></table>
                        </div>
                    </div>
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
