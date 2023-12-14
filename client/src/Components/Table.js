import React, { useEffect, useState } from "react";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

function Table(mode) {
  console.log(mode.mode);
  const [data, setData] = useState([]);
  const [venues, SetVenues] = useState([]);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const nagivate = useNavigate();
  let columns = [];
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
      },
    ];
  } else if (mode.mode === "venue") {
    columns = [
      {
        accessorKey: "venuee",
        header: "Venue Name",
        enableEditing: true,
        size: 1200,
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
          if (data.success) console.log(data.events);
          setData(data.events);
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
