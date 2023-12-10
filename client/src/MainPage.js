import React, { useEffect, useState } from 'react';

function MainPage() {

    const [venues, SetVenues] = useState([]);

    useEffect(() => {
        const getAllVenue = async () => {
            let response = await fetch('http://localhost:3000/getAllVenue', {
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
        <div className="App">
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

export default MainPage;