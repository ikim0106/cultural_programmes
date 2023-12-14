import React, { useEffect, useState } from "react";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import GoogleMapReact from "google-map-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table } from "@mui/material";
import TablePage from "./TablePage";
const Lable = ({ text, venue, buttonOnclickFunction }) => (
  <div
    style={{
      backgroundColor: "white",
      width: "100px",
      height: "100px",
      borderRadius: 5,
      padding: 10,
      alignItems: "center",
      alignSelf: "center",
    }}
  >
    <h5 style={{ color: "black" }}>{text}</h5>
    <button onClick={() => buttonOnclickFunction(venue)}>Click Me</button>
  </div>
);

function UserPage() {
  const [venues, SetVenues] = useState([]);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const nagivate = useNavigate();
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const getAllVenue = async () => {
      let response = await fetch("http://localhost:8080/getAllVenue", {
        method: "Get",
        headers: {
          Authorization: userData?.user?.userId,
        },
      });
      let data = await response.json();
      if (data.success) SetVenues(data.venues);
      console.log(data.message);
    };

    const tempJSON = JSON.parse(localStorage.getItem("userData"));
    if (localStorage.getItem("userData") && tempJSON.user.role === "user") {
      setUserData(JSON.parse(localStorage.getItem("userData")));
      if (userData?.user?.userId) {
        getAllVenue();
        setIsLoading(false);
      }
    } else {
      window.location.href = "/";
    }
  }, [userData?.user?.userId]);

  const defaultProps = {
    center: {
      lat: 22.302711,
      lng: 114.177216,
      // this is hong kong
    },
    zoom: 14,
  };
  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
  };
  const viewLocationDetails = (venue) => {
    console.log("venue", venue);
    nagivate("/LocationDetailPage", { state: venue });
  };
  return (
    <>
      {!isLoading && (
        <>
          <div>
            <PrimarySearchAppBar userData={userData.user} logOut={logout} />
            User id: {userData.user.userId}
            <table>
              <tr>
                <th>Venue Name</th>
                <th>Events</th>
              </tr>
              {venues.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.venuee ? val.venuee : "No Name"}</td>
                    <td>{val.events ? val.events.length : 0}</td>
                  </tr>
                );
              })}
            </table>
          </div>

          <div>
            <TablePage />
          </div>

          <div
            className={"container"}
            style={{ height: "100vh", width: "90%", margin: "auto" }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4",
              }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
              {venues.map((val, key) => {
                console.log(val);
                const venue = JSON.parse(JSON.stringify(val));
                return (
                  <Lable
                    lat={val.latitude}
                    lng={val.longitude}
                    text={val.venuee}
                    venue={val}
                    buttonOnclickFunction={viewLocationDetails}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
        </>
      )}
    </>
  );
}

export default UserPage;
