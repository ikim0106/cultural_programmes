import React, { useEffect, useState } from "react";
import Tables from '../Components/Table';
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import withStyles from "@mui/styles/withStyles";
import { Table } from "@mui/material";


function TablePage() {
    const [value, setValue] = React.useState(0);
    

    const handleChange = (event, newValue) => {
        // event.type can be equal to focus with selectionFollowsFocus.
            setValue(newValue);
            console.log(newValue)
    };

    return (
        <>
            <Grid container spacing={4}>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                    m={2}
                >
                    <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                        <Tab label="Venue"/>
                        <Tab label="Event"/>
                    </Tabs>
                </Grid>
            </Grid>
            {value === 0?<Tables mode="venue" />:<Tables mode="allevent"/>}
        </>);

}
export default TablePage;