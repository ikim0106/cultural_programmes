import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import { useMemo } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
// import {
//   QueryClient,
//   QueryClientProvider,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { fakeData, usStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminPage() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [value, setValue] = React.useState(0);
  const [toEditUserId, setToEditUserId] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const columns1 = useMemo(() => [
    {
      accessorKey: 'eventId',
      header: 'Event ID',
      enableEditing: false,
      size: 80
    },
    {
      accessorKey: 'titlee',
      header: 'Title',
      enableEditing: true,
      size: 80
    },
    {
      accessorKey: 'venueid',
      header: 'Venue ID',
      enableEditing: true,
      size: 80
    },
    {
      accessorFn: (row) => new Date(row.updatedAt).toLocaleString(),
      accessorKey: "updatedAt",
      header: "Last Update",
      enableEditing: false,
      size: 20,
    },
    // {
    //   accessorKey: 'venuee',
    //   header: 'Venue Name',
    //   enableEditing: true,
    //   size: 80
    // },
    {
      accessorKey: 'predateE',
      header: 'Date',
      enableEditing: true,
      size: 80
    },
    {
      accessorKey: 'progtimee',
      header: 'Time',
      enableEditing: true,
      size: 80
    },
    {
      accessorKey: 'desce',
      header: 'Description',
      enableEditing: true,
      size: 80
    },
    {
      accessorKey: 'presenterorge',
      header: 'Presenter',
      enableEditing: true,
      size: 80
    },
    {
      accessorKey: 'pricee',
      header: 'Price',
      enableEditing: true,
      size: 80
    },
  ])

  const columns2 = useMemo(() => [
    {
      accessorKey: 'userId',
      header: 'User ID',
      enableEditing: true,
      size: 160
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableEditing: false,
      size: 160
    },
    {
      accessorKey: 'password',
      header: 'Password',
      enableEditing: true,
      size: 160
    },
    {
      accessorFn: (row) => new Date(row.updatedAt).toLocaleString(),
      accessorKey: "updatedAt",
      header: "Last Update",
      enableEditing: false,
      size: 20,
    },
  ])

  const logout = () => {
    localStorage.clear()
    window.location.href = '/';
  }

  const getAllEvent = async () => {
    let response = await fetch('http://localhost:8080/getAllEvent', {
      method: "Get",
      headers: {
        Authorization: userData.user?.userId,
      }
    })
    let data = await response.json();
    if (data.success)
      setEvents(data.events)
  }

  const getAllUser = async () => {
    let response = await fetch('http://localhost:8080/getAllUser', {
      method: "Get",
      headers: {
        Authorization: userData.user?.userId,
      }
    })
    let data = await response.json();
    if (data.success)
      setUsers(data.users)
      // console.log(data)
  }

  useEffect(() => {
    const tempJSON = JSON.parse(localStorage.getItem('userData'));
    if (localStorage.getItem('userData') && tempJSON.user.role === "admin") {
      setUserData(JSON.parse(localStorage.getItem('userData')));
      if (userData?.user?.userId) {
        getAllEvent();
        getAllUser();
        setIsLoading(false);
      }
    } else {
      window.location.href = '/';
    }
  }, [userData?.user?.userId]);

  const handleEditEvent = async ({ values, table }) => {
    // console.log(values, table)
    let response = await fetch(`http://localhost:8080/updateEvent/${values.eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: userData.user.userId
      },
      body: JSON.stringify(values)
    })
    const resJSON = await response.json()
    console.log(resJSON)
    if (resJSON.success) {
      const getAllEvent = async () => {
        let response = await fetch('http://localhost:8080/getAllEvent', {
          method: "Get",
          headers: {
            Authorization: userData.user.userId,
          }
        })
        let data = await response.json();
        if (data.success)
          setEvents(data.events)
      }
      getAllEvent();
    }
    table.setEditingRow(null)
  }

  const handleEditUser = async ({ values, table }) => {
    console.log(values, table)
    // return
    let response = await fetch(`http://localhost:8080/updateUser/${toEditUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: userData.user.userId
      },
      body: JSON.stringify(values)
    })
    const resJSON = await response.json()
    console.log(resJSON)
    const getAllUsers = async () => {
      let response = await fetch('http://localhost:8080/getAllUser', {
        method: "Get",
        headers: {
          Authorization: userData.user.userId,
        }
      })
      let data = await response.json();
      if (data.success)
        setUsers(data.users)
    }
    getAllUsers();
    table.setEditingRow(null)
  }

  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      console.log(row)
      const data = row.original
      let response = await fetch(`http://localhost:8080/deleteEvent/${data.eventId}/fromVenue/${data.venueid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.user.userId
        },
      })
      const resJSON = await response.json()
      console.log(resJSON)
      if (resJSON.success) {
        const getAllEvent = async () => {
          let response = await fetch('http://localhost:8080/getAllEvent', {
            method: "Get",
            headers: {
              Authorization: userData.user.userId,
            }
          })
          let data = await response.json();
          if (data.success)
            setEvents(data.events)
        }
        getAllEvent();
      }
    }
  }

  const openDeleteUserModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log(row)
      const data = row.original
      let response = await fetch(`http://localhost:8080/delUser/${data.userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.user.userId
        },
      })
      const resJSON = await response.json()
      console.log(resJSON)
      if (resJSON.success) {
        const getAllUser = async () => {
          let response = await fetch('http://localhost:8080/getAllUser', {
            method: "Get",
            headers: {
              Authorization: userData.user.userId,
            }
          })
          let data = await response.json();
          if (data.success)
            setUsers(data.users)
        }
        getAllUser();
      }
    }
  }

  const handleNewEvent = async ({ values, table }) => {
    console.log(values)
    // return
    let response = await fetch(`http://localhost:8080/addEventToVenue/${values.venueid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userData.user.userId
      },
      body: JSON.stringify(values)
    })
    const resJSON = await response.json()
    console.log(resJSON)
    if (resJSON.success) {
      const getAllEvent = async () => {
        let response = await fetch('http://localhost:8080/getAllEvent', {
          method: "Get",
          headers: {
            Authorization: userData.user.userId,
          }
        })
        let data = await response.json();
        if (data.success)
          setEvents(data.events)
      }
      getAllEvent();
    }
    table.setEditingRow(null)
  }

  const eventsTable = useMaterialReactTable({
    columns: columns1,
    data: events,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleNewEvent,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditEvent,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Create New Event</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => table.setEditingRow(row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New Event
      </Button>
    ),
  })

  const usersTable = useMaterialReactTable({
    columns: columns2,
    data: users,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditUser,
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => { 
      setToEditUserId(row.original.userId)
      return (

      <>
        <DialogTitle variant="h6">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    )},
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => table.setEditingRow(row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error"
            onClick={() => openDeleteUserModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  })

  return (
    <>
      {!isLoading &&
      <div>
        <PrimarySearchAppBar userData={userData.user} logOut={logout} />
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Box 
          >
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="CRUD Events" sx={{fontSize:'20px'}} {...a11yProps(0)} />
              <Tab label="CRUD Users" sx={{fontSize:'20px'}} {...a11yProps(1)}/>
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <MaterialReactTable table={eventsTable} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <MaterialReactTable table={usersTable} />
            </CustomTabPanel>
          </Box>
          {/* <table>
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
        </table> */}
        </div>
      </div>
      }
    </>
  );
}

export default AdminPage;