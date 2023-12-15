import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import GoogleMapReact from 'google-map-react';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Tables from "../Components/Table";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Modal, Box, Typography, TextField, Snackbar, Alert, AlertTitle } from '@mui/material';

const Lable = ({ text, venue, buttonOnclickFunction }) => (
	<div
		style={{
			backgroundColor: 'white',
			width: '100px',
			height: '100px',
			borderRadius: 5,
			padding: 15,
			alignItems: "center",
			alignSelf: "center",
			fontSize: 13,
		}}
	>
		<h5 style={{ color: "black" }}>{text}</h5>
		<Button onClick={() => buttonOnclickFunction(venue)} style={{
		backgroundColor: '#566a9a',
		height: 25,
		color: 'white',
		border: '1px solid black'}}>Click Me</Button>
	</div>
);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
	height: '30vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function UserPage() {
	const [venues, SetVenues] = useState([]);
	const [userData, setUserData] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [value, setValue] = React.useState(0);
	const [open, setOpen] = useState(false)
	const [oldPw, setOldPw] = useState('')
	const [newPw, setNewPw] = useState('')
	const [openToast, setOpenToast] = useState(false)
	const nagivate = useNavigate();
	const logout = () => {
		localStorage.clear()
		window.location.href = '/';
	}

	const handleOpen = () => setOpen(true);
	const handleCloseToast = () => {
    setOpenToast(false)
  }
	const handleClose = () => setOpen(false);
	const resetPassword = () => {
		console.log("RESET PASSWORD")
		handleOpen()
	}

	const handleOldPw = (event) => {
		setOldPw(event.target.value)
	}

	const handleNewPw = (event) => {
		setNewPw(event.target.value)
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

	const newPassword = async () => {
    // return
    let response = await fetch(`http://localhost:8080/resetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userData.user.userId
      },
      body: JSON.stringify({password: oldPw, newpassword: newPw})
    })
    const resJSON = await response.json()
		if(!resJSON.success) {
			setOpenToast(true)
		}
		else {
			logout()
		}
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
					<Snackbar open={openToast} autoHideDuration={4000} onClose={handleCloseToast} sx={{
						display: 'flex',
						justifyContent: 'center',
						width: '100vw',
					}}>
						<Alert severity="error" sx={{ width: '30vw'}}>
							<AlertTitle>Failed to reset password</AlertTitle>
							<strong>Wrong old password</strong>
						</Alert>
					</Snackbar>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Reset password
							</Typography>
							
							<TextField 
								sx={{
									marginTop: '2vh',
									width: '100%'
								}}
								label="Old password "
								value={oldPw}
								onChange={handleOldPw}
							>
							</TextField>
							<TextField 
								sx={{
									marginTop: '2vh',
									width: '100%'
								}}
								label="New password"
								value={newPw}
								onChange={handleNewPw}
							></TextField>
							<Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: '4vh', marginTop: '7vh' }}
                onClick={newPassword}
              >
                {'Reset Password'}
              </Button>
						</Box>
					</Modal>
					<PrimarySearchAppBar id="top" userData={userData.user} logOut={logout} resetPassword={resetPassword} />
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
								<path style={{
								fontFamily: 'Courier New' ,
								}}>🏡 Main Page</path>
	
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
								<br></br>
								<br></br>
								<br></br>
								<h1 style={{ fontFamily: "Georgia, serif" }}>Programme Location:</h1>
								<hr></hr>
								<sta style={{ fontFamily: "Verdana, serif", marginTop: 20 }}>(Click to see location details)</sta>


							
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
							</div>
							<a href="#top" style={{float: 'right', margin: '1%'}}>Back to Top⇪</a>
							</div></div></div>
				</>
			}
		</>
	);
}


export default UserPage;
