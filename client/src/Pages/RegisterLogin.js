import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Paper, Box, Avatar, Typography, TextField, Button, Alert, Snackbar, AlertTitle, Link } from '@mui/material';
import useWindowDimensions from '../Utils/WidthHeight';
import { useNavigate } from 'react-router-dom'

const defaultTheme = createTheme()

const RegisterLogin = () => {
  const { height, width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [openToast, setOpenToast] = useState(false)
  const [passwordToast, setPasswordToast] = useState(false)
  const [emailToast, setEmailToast] = useState(false)
  const [codeToast, setCodeToast] = useState(false)
  const [invalidUserToast, setInvalidUserToast] = useState(false)
  const [wrongPasswordToast, setWrongPasswordToast] = useState(false)
  const [userNameExistToast, setUserNameExistToast] = useState(false)
  const [wrongCodeToast, setWrongCodeToast] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const nagivate = useNavigate()

  const changeUserId = (event) => {
    setUserId(event.target.value)
  }

  const changePassword = (event) => {
    setPassword(event.target.value)
  }

  const changeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
  }

  const changeEmail = (event) => {
    setEmail(event.target.value)
  }

  const changeCode = (event) => {
    setCode(event.target.value)
  }

  const getVerificationCode = async () => {
    if (isRegister && (!userId || !password || !confirmPassword)) {
      setOpenToast(true)
      return
    }
    if (isRegister && (password !== confirmPassword)) {
      setPasswordToast(true)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isRegister && (!email || (!emailRegex.test(email)))) {
      setEmailToast(true)
      return
    }
    //start fetch
    let response = await fetch('http://localhost:8080/genCodeForRegister', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })
    const resJSON = await response.json()
    if (resJSON.success) {
      setIsSent(true);
    }
    ;
  }

  const userLogIn = async () => {
    if (!isRegister && (!userId || !password)) {
      setOpenToast(true)
      return
    }
    if (isRegister && (!userId || !password || !confirmPassword)) {
      setOpenToast(true)
      return
    }
    if (isRegister && (password !== confirmPassword)) {
      setPasswordToast(true)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isRegister && (!email || (!emailRegex.test(email)))) {
      setEmailToast(true)
      return
    }
    if (isRegister && isSent && code.length !== 6) {
      setCodeToast(true)
      return
    }
    if (!isRegister && userId && password) {
      let response = await fetch('http://localhost:8080/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: userId, password: password })
      })
      const resJSON = await response.json()
      console.log(resJSON)
      if (resJSON.success && resJSON.user.role === "user") {
        localStorage.setItem('userData', JSON.stringify(resJSON))
        nagivate('/user')
        return
      }

      if (resJSON.success && resJSON.user.role === "admin") {
        localStorage.setItem('userData', JSON.stringify(resJSON))
        nagivate('/admin')
        return
      }
      if (!resJSON.success && response.status === 404) {
        setInvalidUserToast(true)
        return
      }
      if (!resJSON.success && response.status === 401) {
        setWrongPasswordToast(true)
        return
      }
    }

    if (isRegister && userId && password && email && code && password === confirmPassword) {
      let response = await fetch('http://localhost:8080/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: userId, email: email, password: password, role: "user", code: code })
      })
      const resJSON = await response.json()
      if (resJSON.success) {
        localStorage.setItem('userData', JSON.stringify(resJSON))
        nagivate('/user')
      }
      if (!resJSON.success && response.status === 409) {
        setUserNameExistToast(true)
        return
      }
      if (!resJSON.success && response.status === 400) {
        setWrongCodeToast(true)
        return
      }
    }
  }

  const toggleIsRegister = () => {
    setIsRegister(!isRegister)
    setPassword('')
    setConfirmPassword('')
    setUserId('')
  }

  const handleCloseToast = () => {
    setOpenToast(false)
  }

  const handleClosePasswordToast = () => {
    setPasswordToast(false)
  }

  const handleCloseEmailToast = () => {
    setEmailToast(false)
  }

  const handleCloseCodeToast = () => {
    setCodeToast(false)
  }

  const handleCloseInvalidUserToast = () => {
    setInvalidUserToast(false)
  }

  const handleCloseWrongPasswordToast = () => {
    setWrongPasswordToast(false)
  }

  const handleCloseUserNameExistToast = () => {
    setUserNameExistToast(false)
  }

  const handleCloseWrongCodeToast = () => {
    setWrongCodeToast(false)
  }

  // console.log(isMobile)
  useEffect(() => {
    if (height / width > 1.2) setIsMobile(true)
    else setIsMobile(false)
  }, [height, width])

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Snackbar open={openToast} autoHideDuration={4000} onClose={handleCloseToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>Failed to log in</AlertTitle>
          <strong>Please fill out all required fields</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={passwordToast} autoHideDuration={4000} onClose={handleClosePasswordToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>Password error</AlertTitle>
          <strong>Passwords do not match</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={emailToast} autoHideDuration={4000} onClose={handleCloseEmailToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>Email error</AlertTitle>
          <strong>Please check the format of the email</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={codeToast} autoHideDuration={4000} onClose={handleCloseCodeToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>Verification code error</AlertTitle>
          <strong>Verification code should be 6 digit</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={invalidUserToast} autoHideDuration={4000} onClose={handleCloseInvalidUserToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>No User</AlertTitle>
          <strong>There is no user with this username</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={wrongPasswordToast} autoHideDuration={4000} onClose={handleCloseWrongPasswordToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>Please check</AlertTitle>
          <strong>You might mistyped your username/password</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={userNameExistToast} autoHideDuration={4000} onClose={handleCloseUserNameExistToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>You are too late</AlertTitle>
          <strong>This username is already used by other</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={wrongCodeToast} autoHideDuration={4000} onClose={handleCloseWrongCodeToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw' }}>
          <AlertTitle>This code is wrong</AlertTitle>
          <strong>Please check your email again</strong>
        </Alert>
      </Snackbar>

      <Grid container sx={{ height: '100vh' }}>
        {!isMobile &&
          <Grid item xs={7}
            sx={{
              backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/e/e0/Hong_Kong_Cultural_Centre_201408.jpg)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        }
        <Grid item xs={isMobile ? 12 : 5} component={Paper} square>
          <Box
            sx={{
              padding: '5vh 3vw 5vh 3vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar src="https://cdn-icons-png.flaticon.com/512/197/197570.png" />
            <h2 style={{ fontFamily: "Georgia, serif", textAlign: 'center' }}>Hong Kong<br></br>
              Culture Programme Application</h2>
            <Typography variant="h5" sx={{ marginTop: '2vh' }}>
              {isRegister ? 'Sign up' : 'Sign in'}
            </Typography>
            <TextField
              id="outlined-basic"
              label="Username *"
              variant="outlined"
              fullWidth
              autoComplete='off'
              value={userId}
              sx={{
                marginTop: '3vh'
              }}
              onChange={changeUserId}
              autoFocus
            />
            <TextField
              id="outlined-basic"
              label="Password *"
              variant="outlined"
              fullWidth
              autoComplete='off'
              value={password}
              sx={{
                marginTop: '3vh'
              }}
              onChange={changePassword}
            />
            {isRegister && (
              <>
                <TextField
                  id="outlined-basic"
                  label="Confirm Password *"
                  variant="outlined"
                  fullWidth
                  autoComplete='off'
                  value={confirmPassword}
                  sx={{
                    marginTop: '3vh'
                  }}
                  onChange={changeConfirmPassword}
                />
                <>
                  <TextField
                    id="outlined-basic"
                    label="Email address *"
                    variant="outlined"
                    fullWidth
                    autoComplete='off'
                    value={email}
                    sx={{
                      marginTop: '3vh'
                    }}
                    onChange={changeEmail}
                  />
                  <div style={{
                    marginRight: 'auto'
                  }}>
                    <span style={{ color: 'red' }}>*</span> are required fields
                  </div>
                  <Button
                    onClick={getVerificationCode}
                    sx={{ mt: 3, mb: 2, height: '4vh' }}
                    variant="contained">
                    Get verification code
                  </Button>

                </>


              </>

            )
            }
            {(isRegister && isSent) && <TextField
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
            />}
            {(!isRegister || isSent) && <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: '4vh' }}
              onClick={userLogIn}
            >
              {isRegister ? 'Register' : 'Sign in'}
            </Button>}
            {!isRegister &&
              <Link variant="body2" onClick={() => toggleIsRegister()} sx={{
                "&:hover": {
                  cursor: 'pointer'
                }
              }}>
                {"No account? Register here!"}
              </Link>
            }
            {isRegister &&
              <Link variant="body2" onClick={() => toggleIsRegister()} sx={{
                "&:hover": {
                  cursor: 'pointer'
                }
              }}>
                {"Have an account? Sign in here!"}
              </Link>
            }
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default RegisterLogin
