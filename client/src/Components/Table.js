import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../Components/PrimarySearchAppBar';
import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

function Table(mode) {
    console.log(mode.mode)
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let columns = [];
    if (mode.mode === "allevent" || mode.mode === "event") {
        columns = ([
            {
                accessorKey: 'titlee',
                header: 'Title',
                enableEditing: true,
                size: 80
            },
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
    } else if (mode.mode === "venue") {
        columns = ([
            {
                accessorKey: 'venuee',
                header: 'Venue Name',
                enableEditing: true,
                size: 1200
            },
            {
                accessorKey: 'events',
                header: 'Number of Events',
                enableEditing: true,
                size: 10
            }
        ])
    }

    useEffect(() => {
        const tempJSON = JSON.parse(localStorage.getItem('userData'))
        if (localStorage.getItem('userData') && tempJSON.user.role === "user") {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            setIsLoading(false)
        } else {
            window.location.href = '/';
        }
    }, [])

    const table = useMaterialReactTable({
        columns,
        data: data,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
    })

    useEffect(() => {
        if (mode.mode === "allevent") {
            const getAllEvent = async () => {
                let response = await fetch('http://localhost:8080/getAllEvent', {
                    method: "Get",
                })
                let data = await response.json();
                if (data.success)
                    console.log(data.events)
                setData(data.events)
            }
            getAllEvent();
        } else if (mode.mode === "venue") {
            const getAllVenue = async () => {
                let response = await fetch('http://localhost:8080/getAllVenue', {
                    method: "Get",
                })
                let data = await response.json();
                if (data.success)
                    console.log(data.venues)
                setData(data.venues.map((venue) => {
                    return {
                        venuee: venue.venuee,
                        events: venue.events.length
                    }
                }));
            }
            getAllVenue();
        }else if(mode.mode === "event"){
            const getEvent = async () => {
                let response = await fetch(`http://localhost:8080/getEvent/${mode.id}`, {
                    method: "Get",
                })
                let data = await response.json();
                if (data.success)
                    console.log(data.events)
                setData(data.events)
            }
            getEvent();

        }
    }, [mode.mode])

    return (
        <>
            {!isLoading &&
                <div>
                    <PrimarySearchAppBar userData={userData.user} />
                    <MaterialReactTable table={table} />
                </div>
            }
        </>
    );
}

export default Table;