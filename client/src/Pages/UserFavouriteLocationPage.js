import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
// import GoogleMapReact from 'google-map-react';
import { useNavigate, useLocation } from 'react-router-dom'

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


    useEffect(() => {
        const tempJSON = JSON.parse(localStorage.getItem('userData'))
        if (localStorage.getItem('userData') && tempJSON.user.role === "user") {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            // getAllVenue();
            setIsLoading(false)
        } else {
            window.location.href = '/';
        }
    }, [])


    const viewLocationDetails = (venue) => {
        nagivate('/LocationDetailPage', { state: venue })
    }
    return (
        <>
            {!isLoading &&
                <>
                    <div>
                        <PrimarySearchAppBar userData={userData.user} logOut={logout} />
                        User id: {userData.user.userId}
                        <table>
                            <tr>
                                <th>Venue Name</th>
                                <th>Events</th>
                            </tr>
                            {venues.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{val.venuee ? val.venuee : 'No Name'}</td>
                                        <td>{val.events ? val.events.length : 0}</td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>


                </>
            }
        </>
    );
}

export default UserFavouriteLocation;