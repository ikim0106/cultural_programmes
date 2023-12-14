import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import { useNavigate } from 'react-router-dom'

import { TextField, Button } from '@mui/material';

function ResetPassword() {
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [errors, setErrors] = useState({});
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
    const changeEmail = (event) => {
        setEmail(event.target.value)
    }

    const changeCode = (event) => {
        setCode(event.target.value)
    }
    const validateEmail = () => {
        let errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) errors.email = "Email is required";
        else if (!emailRegex.test(email)) errors.email = "Wrong format";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateForm = () => {
        let errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) errors.email = "Email is required";
        else if (!emailRegex.test(email)) errors.email = "Wrong format";

        if (!code) errors.code = "Verification code is required";
        if (code.length != 6) errors.code = "Invalid verification code";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const getVerificationCode = async () => {
        if (validateEmail()) {
            let body = { email: email }

            let response = await fetch("http://localhost:8080/" + "getVerificationCode", {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })

            const data = await response.json();
            console.log(data);
            let errors = {};
            errors.code = data.message;
            setErrors(errors);
        }
    }
    const handleVerification = async () => {
        if (validateForm()) {
            let body = {
                email: email,
                code: Number(code),
            }

            let response = await fetch("http://localhost:8080/" + "register", {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })

            const data = await response.json();
            console.log(data);

            if (!data.success) {
                let errors = {};
                errors.code = data.message;
                setErrors(errors);
            } else {
                console.log(data.message);
                setEmail("");
                // setPassword("");
                setErrors({});
            }
        }
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
                                <>
                                    <h1>Email Verification</h1>
                                    <TextField
                                        id="outlined-basic"
                                        label="Email address"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete='off'
                                        value={email}
                                        sx={{
                                            marginTop: '3vh'
                                        }}
                                        onChange={changeEmail}
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


export default ResetPassword;
