import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';

function UserPage() {
    const [venues, SetVenues] = useState([]);
		const [userData, setUserData] = useState();
		const [isLoading, setIsLoading] = useState(true);

		const logout = () => {
			localStorage.clear()
			window.location.href = '/';
		}

		useEffect(()=> {
			const tempJSON = JSON.parse(localStorage.getItem('userData'))
			if(localStorage.getItem('userData') && tempJSON.user.role === "user") {
				setUserData(JSON.parse(localStorage.getItem('userData')))
				setIsLoading(false)
			} else {
				window.location.href = '/';
			}
		},[])
		
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
			<>
			{!isLoading &&
				<div>
					<PrimarySearchAppBar userData={userData.user} logOut={logout}/>
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
			}
			</>
    );
}

export default UserPage;