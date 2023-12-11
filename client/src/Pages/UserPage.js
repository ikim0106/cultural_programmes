import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

function UserPage() {
    const [venues, SetVenues] = useState([]);
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

		const location = useLocation();
		console.log(location.state)

    return (
			<div>
				User id: {location.state.user.userId}
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
    );
}

export default UserPage;