// Student Name : Ng Tik Wai, Inho Kim, Chan Yau Ki, Mak Wing Chit, Ngai Wai Ki
// Student ID : 1155151991, 1155116159, 1155157432, 1155157789, 1155158093
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import { grey } from "@mui/material/colors";
import { padding } from "@mui/system";
import Tables from "../Components/Table";
import { useNavigate } from "react-router-dom";

function LocationDetailPage() {
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState(null);

  const getAllCommentFor = async () => {
    let response = await fetch(
      `http://localhost:8080/getAllCommentFor/${venue.venueId}`,
      {
        method: "GET",
        headers: {
          Authorization: userData.user.userId,
        },
      }
    );
    let data = await response.json();

    if (data.success) setComments(data.comments);
    console.log(data.message);
    console.log(data.comments);
  };

  useEffect(() => {
    const tempJSON = JSON.parse(localStorage.getItem("userData"));
    if (localStorage.getItem("userData") && tempJSON.user.role === "user") {
      setUserData(JSON.parse(localStorage.getItem("userData")));
      if (userData?.user?.userId) {
        getAllCommentFor();
        setIsLoading(false);
      }
    } else {
      window.location.href = "/";
    }
  }, [userData?.user?.userId]);

  const location = useLocation();
  console.log(location.state);
  const venue = location.state;
  const nagivate = useNavigate();
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const addComment = async () => {
    let response = await fetch("http://localhost:8080/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userData.user.userId,
      },
      body: JSON.stringify({
        userId: userData.user.userId,
        venueId: venue.venueId,
        comment: comment,
      }),
    });
    let data = await response.json();

    if (data.success) {
      setComment("");
      setComments((prevComments) => [data.comment, ...prevComments]);
      setErrors(null);
    } else {
      let errors = {};
      errors.comment = data.message;
      setErrors(errors);
    }
    console.log(data.message);
  };
  const favourite = async () => {
    let response = await fetch(
      `http://localhost:8080/addVenue/${venue.venueId}/toFavourite`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.user.userId,
        },

        body: JSON.stringify({
          userId: userData.user.userId,
          venueId: venue.venueId,
          comment: comment,
        }),
      }
    );

    let data = await response.json();

    // if (data.success)
    console.log(data.message);
    alert(data.message);
  };

  const fromfavourite = async () => {
    let response = await fetch(
      `http://localhost:8080/delVenue/${venue.venueId}/fromFavourite`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.user.userId,
        },
        body: JSON.stringify({
          userId: userData.user.userId,
          venueId: venue.venueId,
          comment: comment,
        }),
      }
    );
    let data = await response.json();

    // if (data.success)
    console.log(data.message);
    alert(data.message);
  };

  const getRandomDeepColor = (seed) => {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
  
    return `rgb(${r}, ${g}, ${b})`;
  };
  return (
    // Important! Always set the container height explicitly
    <>
      {!isLoading && (
        <div>
          <PrimarySearchAppBar userData={userData.user} logOut={logout} />
          <div
            className={"container"}
            style={{
              height: "100%",
              width: "100%",
              margin: "auto",
              backgroundImage:
                "url(https://upload.wikimedia.org/wikipedia/commons/e/e0/Hong_Kong_Cultural_Centre_201408.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
            }}
          >
            <div
              className="container"
              style={{
                height: "100%",
                backgroundColor: "#bbc4eb8c",
                padding: 8
              }}
            >
              <iframe
                title="googleMap"
                width="100%"
                height="450"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4&q=${venue.latitude},${venue.longitude}`}

              // src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOgqsV8q9A_EPJVSRJ1XTtUzRhtz-H_B4&q=${venue.venuee}`}
              ></iframe>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  nagivate("/user");
                }}
                style={{
                  float: "left",
                  backgroundColor: "#2e7d32",
                  margin: "2%",
                }}
              >
                ↩︎ Return to Main Page
              </Button>
              <br />

              <br />
              <Button
                variant="contained"
                onClick={() => {
                  fromfavourite();
                }}
                style={{
                  float: "right",
                  backgroundColor: "#2c5aaaf4",
                  margin: "1%",
                }}
              >
                🗑 Remove from my favourite Venue
              </Button>


              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  favourite();
                }}
                style={{
                  float: "right",
                  backgroundColor: "#de2d2dd2",
                  margin: "1%",
                }}
              >
                ♥︎ Add to my favourite Venue
              </Button>
              <br />

              <div
                style={{
                  margin: "5%",
                  padding: "3%",
                  background: "#ebedf4df",
                  borderRadius: "10px",
                }}
              >
                <path
                  style={{
                    fontFamily: "Courier New",
                  }}
                >
                  🏡 Main Page {">"} Location Details {">"} {venue.venuee}
                </path>

                <h1 style={{ fontFamily: "Georgia, serif" }}>{venue.venuee}</h1>
                <h3 style={{ fontFamily: "Georgia, serif" }}>Event details:</h3>

                <Tables mode="event" id={venue.venueId} />

                <br></br>
                <br></br>
                <br></br>

                <div
                  style={{ border: "2px solid rgba(128, 128, 128, 0.58)" }}
                ></div>

                <table
                  id="formtable"
                  style={{
                    padding: "0.5%",
                    marginTop: "1%",
                    marginLeft: "3%",
                    backgroundColor: "#faf9fa6e",
                    width: "95%",
                    paddingBottom: "5%",
                  }}
                >
                  <tr>
                    <td
                      id="formleft"
                      style={{
                        padding: "2%",
                      }}
                    >
                      <h2 style={{ fontFamily: "Georgia, serif" }}>Comments</h2>
                      <hr></hr>
                      {comments &&
                        comments.map((val, key) => {
                          const randomColor = getRandomDeepColor(`${userData.userId}`);
                          return (
                            <div
                              key={key}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div style={{ marginRight: "10px" }}>
                                <svg viewBox="0 0 80 80" width="40" height="40">
                                  <circle
                                    cx="40"
                                    cy="40"
                                    r="38"
                                    fill={randomColor}
                                  />
                                  <text
                                    x="50%"
                                    y="50%"
                                    text-anchor="middle"
                                    fill="white"
                                    font-size="30px"
                                    dy=".3em"
                                  >
                                    {val.userId.charAt(0)}
                                  </text>
                                </svg>
                              </div>
                              <div>
                                <h4>@{val.userId}</h4>
                                <p
                                  style={{
                                    marginTop: "-2%",
                                  }}
                                >
                                  {val.comment}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </td>
                    <td
                      id="formright"
                      style={{
                        width: "55%",
                        paddingLeft: "10%",
                      }}
                    >
                      <h1 style={{ fontFamily: "Georgia, serif" }}>
                        Any Question?
                      </h1>
                      <h3 style={{ fontFamily: "Georgia, serif" }}>
                        Leave a comment:
                      </h3>

                      {/* <p>name: {venue.venuee}</p> */}

                      <TextField
                        id="outlined-multiline-flexible"
                        label="Your Comment Here"
                        maxRows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                          marginBottom: "2%",
                          width: "90%",
                          backgroundColor: "#ebedf4f6",
                        }}
                      />
                      {errors?.comment && (
                        <p
                          style={{
                            fontFamily: "Georgia, serif",
                            color: "red ",
                          }}
                        >
                          {errors.comment}
                        </p>
                      )}
                      <br></br>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (comment.trim() === "") {
                            let errors = {};
                            errors.comment = "Comment should not be empty";
                            setErrors(errors);
                          } else addComment();
                        }}
                        style={{
                          marginLeft: "71%",
                          // backgroundColor: '#3d7ec98e',
                          // border: '1px solid #28558994',
                        }}
                      >
                        Submit
                      </Button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LocationDetailPage;
