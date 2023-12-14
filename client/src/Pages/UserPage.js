import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import GoogleMapReact from 'google-map-react';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Tables from "../Components/Table";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

const Lable = ({ text, venue, buttonOnclickFunction }) => (
	<div
		style={{
			backgroundColor: "white",
			width: "100px",
			height: "100px",
			borderRadius: 5,
			padding: 10,
			alignItems: "center",
			alignSelf: "center",
		}}
	>
		<h5 style={{ color: "black" }}>{text}</h5>
		<button onClick={() => buttonOnclickFunction(venue)}>Click Me</button>
	</div>
);

function UserPage() {
	const [venues, SetVenues] = useState([]);
	const [userData, setUserData] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [value, setValue] = React.useState(0);
	const nagivate = useNavigate();
	const logout = () => {
		localStorage.clear()
		window.location.href = '/';
	}


	useEffect(() => {
		const getAllVenue = async () => {
			let response = await fetch("http://localhost:8080/getAllVenue", {
				method: "Get",
				headers: {
					Authorization: userData?.user?.userId,
				},
			});
			let data = await response.json();
			if (data.success) SetVenues(data.venues);
			console.log(data.message);
		};

		const tempJSON = JSON.parse(localStorage.getItem("userData"));
		if (localStorage.getItem("userData") && tempJSON.user.role === "user") {
			setUserData(JSON.parse(localStorage.getItem("userData")));
			if (userData?.user?.userId) {
				getAllVenue();
				setIsLoading(false);
			}
		} else {
			window.location.href = "/";
		}
	}, [userData?.user?.userId]);

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



	const handleChange = (event, newValue) => {
		// event.type can be equal to focus with selectionFollowsFocus.
		setValue(newValue);
		console.log(newValue);
	};

	return (
		<>
			{!isLoading &&
				<>
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

							<Button variant="contained" color="error" onClick={() => {
								nagivate('/myFavourite')
							}} style={{
								float: 'right',
								backgroundColor: '#de2d2dd2',
								margin: '2%',
								marginRight: '5%',
							}}>♥︎ See my favourite location</Button><br />

							<div style={{
								margin: "5%",
								padding: "3%",
								background: "#ebedf4df",
								borderRadius: "10px",
								height: 'auto'
							}}>
								<h1 style={{ fontFamily: "Georgia, serif" }}>Programme Information:</h1>
								<hr></hr>
								<Grid container spacing={4}>
									<Grid item lg={3} sm={6} xl={3} xs={12} m={2}>
										<Tabs
											value={value}
											onChange={handleChange}
											aria-label="nav tabs example"
										>
											<Tab label="Location" />
											<Tab label="Event" />
										</Tabs>
									</Grid>
								</Grid>
								{value === 0 ? <Tables mode="venue" /> : <Tables mode="allevent" />}
							
							<br></br>

							
							<div className={"container"} style={{ height: '100vh', width: '90%', margin: "auto" }}>
								<GoogleMapReact
									bootstrapURLKeys={{ key: "AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4" }}
									defaultCenter={defaultProps.center}
									defaultZoom={defaultProps.zoom}
									yesIWantToUseGoogleMapApiInternals
									onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
								>
									{venues.map((val, key) => {
										console.log(val)
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
							</div></div></div></div>
				</>
			}
		</>
	);
}


export default UserPage;
