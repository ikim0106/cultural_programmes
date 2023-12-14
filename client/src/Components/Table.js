import React, { useEffect, useState } from "react";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import e from "cors";

function calculatePrice(price) {
  if (price.includes("Free")) { price = 0; }
  else if (price.includes("HK$")) { price = parseInt(price.slice(3)); }
  else if (price.includes("$")) { price = parseInt(price.slice(1)); }
  else { price = 0; }
  return price;
}

function Table(mode) {
  console.log(mode.mode, mode.id);
  const [data, setData] = useState([]);
  const [venues, SetVenues] = useState([]);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [max, setMax] = useState(0);
  const nagivate = useNavigate();
  let columns = [];

  const viewLocationDetails = (venue) => {
    console.log("venue", venue);
    venue = venues.filter((val, key) => {
      return val.venuee === venue ? val : null;
    });
    console.log("new venue", venue);
    nagivate("/LocationDetailPage", { state: venue[0] });
  };

  useEffect(() => {
    const getData = () => {
      if (mode.mode === "allevent") {
        const getAllEvent = async () => {
          let response = await fetch("http://localhost:8080/getAllEvent", {
            method: "Get",
            headers: {
              Authorization: userData?.user?.userId,
            },
          });
          let data = await response.json();
          if (data.success) console.log(data.events);
          setData(data.events);
          setMax(Math.max(...data.events.map((event) => calculatePrice(event.pricee))));
          console.log("max", max);
        };
        getAllEvent();
      } else if (mode.mode === "venue") {
        const getAllVenue = async () => {
          let response = await fetch("http://localhost:8080/getAllVenue", {
            method: "Get",
            headers: {
              Authorization: userData?.user?.userId,
            },
          });
          let data = await response.json();
          console.log(data);
          if (data.success) console.log(data.venues);
          SetVenues(data.venues);
          setData(
            data.venues.map((venue) => {
              return {
                venuee: venue.venuee,
                events: venue.events.length,
              };
            })
          );
        };
        getAllVenue();
      } else if (mode.mode === "event") {
        const getEvent = async () => {
          let response = await fetch(
            `http://localhost:8080/getEvent/${mode.id}`,
            {
              method: "Get",
              headers: {
                Authorization: userData?.user?.userId,
              },
            }
          );
          let data = await response.json();
          console.log(data)
          if (data.success) console.log(data.events);
          setData(data.events);
          setMax(Math.max(...data.events.map((event) => calculatePrice(event.pricee))));
          console.log("max", max);
        };
        getEvent();
      }
    };

    const tempJSON = JSON.parse(localStorage.getItem("userData"));
    console.log("tempJSON", tempJSON);
    if (localStorage.getItem("userData") && tempJSON.user.role === "user") {
      setUserData(JSON.parse(localStorage.getItem("userData")));
      if (userData?.user?.userId) {
        getData();
        setIsLoading(false);
      }
    } else {
      window.location.href = "/";
    }
  }, [mode.mode, mode.id, userData?.user?.userId]);



  if (mode.mode === "allevent" || mode.mode === "event") {
    columns = [
      {
        accessorKey: "titlee",
        header: "Title",
        enableEditing: true,
        size: 80,
      },
      {
        accessorKey: "predateE",
        header: "Date",
        enableEditing: true,
        size: 80,
      },
      {
        accessorKey: "progtimee",
        header: "Time",
        enableEditing: true,
        size: 80,
      },
      {
        accessorKey: "desce",
        header: "Description",
        enableEditing: true,
        size: 80,
      },
      {
        accessorKey: "presenterorge",
        header: "Presenter",
        enableEditing: true,
        size: 80,
      },
      {
        accessorKey: "pricee",
        header: "Price",
        enableEditing: true,
        size: 80,
        filterVariant: 'range-slider',
        muiFilterSliderProps: {
          max: max, //custom max (as opposed to faceted max)
          min: 0, //custom min (as opposed to faceted min)
          valueLabelFormat: (value) =>
            value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            }),
        },
        filterFn: (row, id, filterValue) => {
          console.log("filter:", filterValue);
          let value = row.getValue(id);
          if (value.includes("Free")) { value = 0; }
          else if (value.includes("HK$")) { value = parseInt(value.slice(3)); }
          else if (value.includes("$")) { value = parseInt(value.slice(1)); }
          console.log("filter:", row.getValue(id), filterValue, value);
          return value <= filterValue[1] && value >= filterValue[0];
        },
      }
    ];
  } else if (mode.mode === "venue") {
    columns = [
      {
        accessorKey: "venuee",
        header: "Venue Name",
        enableEditing: true,
        size: 700,
      },
      {
        accessorKey: "events",
        header: "Number of Events",
        enableEditing: true,
        size: 10,
      },
    ];
  }

  const venueTable = useMaterialReactTable({
    columns,
    data: data,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        console.log("row", row.original.venuee);
        viewLocationDetails(row.original.venuee);
      },
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
      },
    }),
  });

  const eventTable = useMaterialReactTable({
    columns,
    data: data,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
  });


  return (
    <>
      {!isLoading && (
        <div>
          <MaterialReactTable
            table={mode.mode === "venue" ? venueTable : eventTable}
          />
        </div>
      )}
    </>
  );
}

export default Table;
