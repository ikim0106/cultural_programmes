import React,  {useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Paper, Box, Avatar, Typography, TextField, Button, Alert, Snackbar, AlertTitle, Link} from '@mui/material';
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
  const [openToast, setOpenToast] = useState(false)
  const [passwordToast, setPasswordToast] = useState(false)

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

  const userLogIn = async () => {
    if(!isRegister && (!userId || !password)) {
      setOpenToast(true)
      return
    }
    if(isRegister && (!userId || !password || !confirmPassword)) {
      setOpenToast(true)
      return
    }
    if(isRegister && (password!==confirmPassword)) {
      setPasswordToast(true)
      return
    }
    if(!isRegister && userId && password) {
      let response = await fetch('http://localhost:8080/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username: userId, password: password})
      })
      const resJSON = await response.json()
      if(resJSON.success && resJSON.user.role=="user") {
        nagivate('/user', {state: resJSON})
        return
      }
    }

    if(isRegister && userId && password && password==confirmPassword) {
      let response = await fetch('http://localhost:8080/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username: userId, password: password})
      })
      const resJSON = await response.json()
      if(resJSON.success) {
        nagivate('/user', {state: {user: {userId: userId, password: password}}})
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

  // console.log(isMobile)
  useEffect(() => {
    if(height/width>1.2) setIsMobile(true)
    else setIsMobile(false)
  }, [height, width])

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline/>
      <Snackbar open={openToast} autoHideDuration={4000} onClose={handleCloseToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw'}}>
          <AlertTitle>Failed to log in</AlertTitle>
          <strong>Please fill out all required fields</strong>
        </Alert>
      </Snackbar>

      <Snackbar open={passwordToast} autoHideDuration={4000} onClose={handleClosePasswordToast} sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
      }}>
        <Alert severity="error" sx={{ width: '30vw'}}>
          <AlertTitle>Password error</AlertTitle>
          <strong>Passwords do not match</strong>
        </Alert>
      </Snackbar>
      <Grid container sx={{height: '100vh'}}>
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
              <Typography variant="h5" sx={{marginTop:'2vh'}}>
                {isRegister ? 'Sign up' : 'Sign in'}
              </Typography>
              <TextField 
                id="outlined-basic" 
                label="Username *" 
                variant="outlined" 
                fullWidth 
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
                value={password}
                sx={{
                  marginTop: '3vh'
                }}
                onChange={changePassword}
              />
              {isRegister && 
                <TextField 
                  id="outlined-basic" 
                  label="Confirm Password *" 
                  variant="outlined" 
                  fullWidth 
                  value={confirmPassword}
                  sx={{
                    marginTop: '3vh'
                  }}
                  onChange={changeConfirmPassword}
                />
              }
              <div style={{
                marginRight: 'auto'
              }}>
                <span style={{color: 'red'}}>*</span> are required fields
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: '4vh' }}
                onClick={userLogIn}
              >
                {isRegister ? 'Register' : 'Sign in'}
              </Button>
              {!isRegister && 
                <Link variant="body2" onClick={() => toggleIsRegister()} sx={{
                  "&:hover": {
                    cursor:'pointer'
                  }
                }}>
                  {"No account? Register here!"}
                </Link>
              }
              {isRegister && 
                <Link variant="body2" onClick={() => toggleIsRegister()} sx={{
                  "&:hover": {
                    cursor:'pointer'
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