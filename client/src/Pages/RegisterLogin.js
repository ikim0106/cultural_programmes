import React,  {useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Paper, Box, Avatar, Typography, TextField, Button, Alert, Snackbar, AlertTitle, Link, InputAdornment, FormGroup, FormControlLabel, Checkbox} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useWindowDimensions from '../Utils/WidthHeight';
import { useNavigate } from 'react-router-dom'

const defaultTheme = createTheme()

const RegisterLogin = () => {
  const { height, width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [newRole, setNewRole] = useState('user');
  const [userId, setUserId] = useState('')
  const [verifCode, setVerifCode] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
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

  const changeCode = (event) => {
    setCode(event.target.value)
  }

  const toggleAdmin = () => {
    setNewRole(newRole==='user'? 'admin' : 'user')
  }

  const sendVerificationCode = async () => {
    let response = await fetch('http://localhost:8080/genCodeForRegister', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: email})
    })
    const temp = await response.json()
    setVerifCode(temp.code)
  }


  const changeEmail = (event) => {
    setEmail(event.target.value)
  }

  const userLogIn = async () => {
    if(!isRegister && (!userId || !password)) {
      setOpenToast(true)
      return
    }
    if(isRegister && (!userId || !password || !confirmPassword || !code || !email)) {
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
      console.log(resJSON)
      if(resJSON.success && resJSON.user.role==="user") {
        localStorage.setItem('userData', JSON.stringify(resJSON))
        nagivate('/user')
        return
      }

      if(resJSON.success && resJSON.user.role==="admin") {
        localStorage.setItem('userData', JSON.stringify(resJSON))
        nagivate('/admin')
        return
      }
    }

    if(isRegister && userId && password && password===confirmPassword && code===verifCode && email) {
      // console.log(newRole)
      // return
      let response = await fetch('http://localhost:8080/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: userId,
          email: email,
          password: password,
          code: code,
          role: newRole
        })
      })
      const resJSON = await response.json()
      if(resJSON.success && newRole === "user") {
        localStorage.setItem('userData', JSON.stringify({user: {userId: userId, password: password, role: newRole}}))
        nagivate('/user')
      }
      else if(resJSON.success && newRole === "admin") {
        localStorage.setItem('userData', JSON.stringify({user: {userId: userId, password: password, role: newRole}}))
        nagivate('/admin')
      }
    }
  }

  const toggleIsRegister = () => {
    setIsRegister(!isRegister)
    setPassword('')
    setConfirmPassword('')
    setUserId('')
    setEmail('')
    setCode('')
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
          <AlertTitle>Failed to {isRegister ? 'register' : 'log in'}</AlertTitle>
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
              <h2 style={{ fontFamily: "Georgia, serif", textAlign: 'center' }}>Hong Kong<br></br>
              Culture Programme Application</h2>
              <Typography variant="h5" sx={{marginTop:'2vh'}}>
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
              {isRegister && 
                <TextField 
                  id="outlined-basic" 
                  label="Email *" 
                  variant="outlined" 
                  fullWidth 
                  autoComplete='off'
                  value={email}
                  sx={{
                    marginTop: '3vh'
                  }}
                  onChange={changeEmail}
                  InputProps={
                    {endAdornment:
                      <InputAdornment position="end">
                        <Button onClick={sendVerificationCode} variant="contained" endIcon={<SendIcon />}>
                          Send Code
                        </Button>
                    </InputAdornment>
                  }}
                />
              }
              {isRegister && 
                <TextField 
                  id="outlined-basic" 
                  label="Verification Code *" 
                  variant="outlined" 
                  fullWidth 
                  autoComplete='off'
                  value={code}
                  sx={{
                    marginTop: '3vh'
                  }}
                  onChange={changeCode}
                />
              }
              <TextField 
                id="outlined-basic" 
                label="Password *" 
                variant="outlined" 
                fullWidth 
                autoComplete='off'
                type='password'
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
                  type='password'
                  fullWidth 
                  autoComplete='off'
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
              {isRegister && 
                <FormGroup>
                  <FormControlLabel control={<Checkbox onClick={toggleAdmin} />} label="Admin account" />
                </FormGroup>
              }
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
