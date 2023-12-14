import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
// import GoogleMapReact from 'google-map-react';
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button';
import { margin } from '@mui/system';

// const Lable = ({ text, venue, buttonOnclickFunction }) => <div style={{
// 	backgroundColor: 'white',
// 	width: '100px',
// 	height: '100px',
// 	borderRadius: 5,
// 	padding: 10,
// 	alignItems: "center",
// 	alignSelf: "center",
// }}><h5 style={{ color: "black" }}>{text}</h5>
// 	<button onClick={() => buttonOnclickFunction(venue)}>Click Me</button></div>;

function UserFavouriteLocation() {
    const [venues, SetVenues] = useState([]);
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const nagivate = useNavigate();
    const logout = () => {
        localStorage.clear()
        window.location.href = '/';
    }
    

    const getMyFavouriteVenue = async () => {
        let response = await fetch('http://localhost:8080/profile', {
            method: "Get",
            headers: {
                Authorization: userData?.user?.userId,
            }
        })
        let data = await response.json();
        if (data.success)
            SetVenues(data.profile.favouriteVenue)
        console.log(data.message)
    }

    useEffect(() => {
        const tempJSON = JSON.parse(localStorage.getItem('userData'))
        if (localStorage.getItem('userData') && tempJSON.user.role === "user") {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            if (userData?.user?.userId) {
                getMyFavouriteVenue();
                setIsLoading(false)
            }
        } else {
            window.location.href = '/';
        }
    }, [userData?.user?.userId])


    const viewLocationDetails = (venue) => {
        nagivate('/LocationDetailPage', { state: venue })
    }
    return (
        <>
            {!isLoading &&
                <>
                    <div className={"container"} style={{
                        height: '100%',
                        width: '100%',
                        margin: "auto",
                        backgroundImage: 'url(https://media.nomadicmatt.com/2020/thingstodohk1.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                    }}>
                        <div style={{
                            height: '100%',
                            backgroundColor: '#bbc4eb8c'
                        }}>
                            <PrimarySearchAppBar userData={userData.user} logOut={logout} />
                            {/* User id: {userData.user.userId} */}

                            <Button variant="contained" color="success" onClick={() => {
                                nagivate('/user')
                            }} style={{
                                float: 'left',
                                backgroundColor: '#469f74ec',
                                margin: '2%' 
                            }}>↩︎  Return to Main Page</Button><br />

                            <div style={{
                                margin: "5%",
                                padding: "3%",
                                background: "#ebedf4df",
                                borderRadius: "10px",
                                height: '1000px'
                            }}>
                                <h1 style={{ margin: '2%', fontFamily: "Georgia, serif" }}>MY Favourite Locations</h1>
                                <hr></hr>

                                <table style={{ margin: '2%', width: '95%',}}>
                                    <tr>
                                        <th></th>
                                        <th><h3 style={{ margin: '2%', fontFamily: "Georgia, serif" }}>Location Venue</h3></th>
                                        <th><h3 style={{ margin: '2%', fontFamily: "Georgia, serif" }}>Number of Events</h3></th>
                                        <th><h3 style={{ margin: '2%', fontFamily: "Georgia, serif" }}>Location Details</h3></th>
                                    </tr>
                                    
                                    {venues.map((val, key) => {
                                        return (
                                            
                                            <tr key={key} style={{ 
                                                fontFamily: "Georgia",
                                                textAlign: 'center', 
                                                fontSize: 'large',
                                                padding: '2%'
                                                }}>
                                                <td>1.</td>
                                                <td>{val.venuee ? val.venuee : 'No Name'}</td>
                                                <td>{val.events ? val.events.length : 0}</td>
                                                <td><Button variant="contained" color="success" onClick={() => 
                                                    viewLocationDetails(val)}>Click Me</Button></td>
                                            </tr>
                                            
                                        )
                                    })}
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default UserFavouriteLocation;
