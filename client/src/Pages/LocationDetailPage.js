// 4. A separate view for one single location, containing:
// a. A map showing the location.
// b. The location details.
// c. User comments, where users can add new comments seen by all other users.

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import { grey } from '@mui/material/colors';
import { padding } from '@mui/system';


function LocationDetailPage() {

    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [errors, setErrors] = useState(null);

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
    const logout = () => {
        localStorage.clear()
        window.location.href = '/';
    }


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

        if (data.success) {
            setComment('');
            setComments((prevComments) => [data.comment, ...prevComments]);
            setErrors(null);
        } else {
            let errors = {}
            errors.comment = data.message
            setErrors(errors);
        }
        console.log(data.message)
    };
    const getRandomDeepColor = () => {
        const getRandomHex = () => {
            const min = 128;
            const max = 255;
            return Math.floor(Math.random() * (max - min + 1) + min).toString(16).padStart(2, '0');
        };

        const red = getRandomHex();
        const green = getRandomHex();
        const blue = getRandomHex();
        return `#${red}${green}${blue}`;
    };
    const favourite = async () => {
        let response = await fetch(`http://localhost:8080/addVenue/${venue.venueId}/toFavourite/${userData.user.userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //     "userId": userData.user.userId,
            //     "venueId": venue.venueId,
            //     "comment": comment
            // }),
        })
        let data = await response.json();

        // if (data.success)
        // TODO: display in front end?
        console.log(data.message)
    };
    return (
        // Important! Always set the container height explicitly
        <>
            {!isLoading &&
                <div>
                    <PrimarySearchAppBar userData={userData.user} logOut={logout} />
                    <div className={"container"} style={{
                        height: '100%',
                        width: '100%',
                        margin: "auto",
                        backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/e/e0/Hong_Kong_Cultural_Centre_201408.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                    }}>
                        <div style={{
                            height: '100%',
                            backgroundColor: '#bbc4eb8c'
                        }}>

                            <iframe
                                title="googleMap"
                                width="100%"
                                height="450"
                                loading="lazy"
                                allowfullscreen
                                referrerpolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4&q=${venue.latitude},${venue.longitude}`}

                            // src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4&q=${venue.venuee}`}
                            >
                            </iframe>
                            <Button variant="contained" color="error" onClick={() => {
                                favourite()
                            }} style={{
                                float: 'right',
                                backgroundColor: '#cc4646d2'
                            }}>♥︎ Add to my favourite Venue</Button><br />

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
                                            <Button variant="contained" onClick={() => {
                                                if (comment.trim() === '')
                                                    console.log(`Comment should not be empty`)
                                                else
                                                    addComment();
                                            }} style={{
                                                marginLeft: '71%',
                                                // backgroundColor: '#3d7ec98e',
                                                // border: '1px solid #28558994',
                                            }}>Submit</Button>
                                        </td></tr></table>
                            </div>
                        </div>
                    </div></div>
            }
        </>


    );
}



export default LocationDetailPage;

