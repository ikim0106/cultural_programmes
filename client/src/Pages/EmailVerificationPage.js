import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import { useNavigate } from 'react-router-dom'

import { TextField, Button } from '@mui/material';

function EmailVerificationPage() {
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [emailAddress, setEmailAddress] = useState('')
    const [code, setCode] = useState('')
    const nagivate = useNavigate();
    const logout = () => {
        localStorage.clear()
        window.location.href = '/';
    }

    useEffect(() => {
        const tempJSON = JSON.parse(localStorage.getItem("userData"));
        if (localStorage.getItem("userData") && tempJSON.user.role === "user") {
            setUserData(JSON.parse(localStorage.getItem("userData")));
            if (userData?.user?.userId) {
                setIsLoading(false);
            }
        } else {
            window.location.href = "/";
        }
    }, [userData?.user?.userId]);
    const changeEmailAddress = (event) => {
        setEmailAddress(event.target.value)
    }

    const changeCode = (event) => {
        setCode(event.target.value)
    }

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
                                <>
                                    <h1>Email Verification</h1>
                                    <TextField
                                        id="outlined-basic"
                                        label="Email address"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        value={emailAddress}
                                        sx={{
                                            marginTop: '3vh'
                                        }}
                                        onChange={changeEmailAddress}
                                    />
                                    <Button
                                        sx={{ mt: 2, mb: 2, height: '4vh' }}
                                        variant="contained">
                                        Get verification code
                                    </Button>
                                    <TextField
                                        id="outlined-basic"
                                        label="Verification code"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        value={code}
                                        sx={{
                                            marginTop: '3vh'
                                        }}
                                        onChange={changeCode}
                                    />
                                    <Button
                                        sx={{ mt: 2, mb: 2, height: '4vh' }}
                                        variant="contained">
                                        Verifiy my account
                                    </Button>
                                </>

                            </div></div></div>
                </>
            }
        </>
    );
}


export default EmailVerificationPage;
