// Student Name : Ng Tik Wai, Inho Kim, Chan Yau Ki, Mak Wing Chit, Ngai Wai Ki
// Student ID : 1155151991, 1155116159, 1155157432, 1155157789, 1155158093
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const app = express();
const port = 8080;
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

const SENDER_EMAIL = "fyy2303@gmail.com";
const SENDER_EMAIL_PASSWORD = "gzkjinvlemayjnto";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
const mongoose = require("mongoose");
const venueData = fs.readFileSync(
  "./eventData/tenVenuesAndEventsClean.json",
  "utf-8"
);
mongoose.connect("mongodb+srv://mongo:mongo@cluster0.a9q2k5d.mongodb.net/prj");
// mongoose.connect('mongodb://127.0.0.1:27017/proj');

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", async function () {
  console.log("Connection is open...");

  const EventSchema = mongoose.Schema(
    {
      eventId: { type: String, unique: [true, "eventId should be unique"] },
      titlee: { type: String },
      cat1: { type: String },
      cat2: { type: String },
      predateE: { type: String },
      progtimee: { type: String },
      venueid: { type: String },
      agelimite: { type: String },
      pricee: { type: String },
      desce: { type: String },
      urle: { type: String },
      tagenturle: { type: String },
      remarke: { type: String },
      enquiry: { type: String },
      fax: { type: String },
      email: { type: String },
      saledate: { type: String },
      interbook: { type: String },
      presenterorge: { type: String },
    },
    { timestamps: true }
  );
  const Event = mongoose.model("Event", EventSchema);

  const VenueSchema = mongoose.Schema(
    {
      venueId: { type: String, unique: [true, "venueId should be unique"] },
      venuee: { type: String },
      latitude: { type: String },
      longitude: { type: String },
      events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    },
    { timestamps: true }
  );
  const Venue = mongoose.model("Venue", VenueSchema);

  const populateDB = async () => {
    const venueJSON = JSON.parse(venueData);
    for (var venueKey in venueJSON) {
      let events = venueJSON[venueKey].events;
      let eventJSON = {};
      let allEvents = [];
      for (var eventKey in events) {
        eventJSON = events[eventKey];
        eventJSON["eventId"] = eventKey;
        eventJSON["venuee"] = venueKey;
        const eventTemp = new Event(eventJSON);
        allEvents.push(eventTemp._id);
        await eventTemp.save();
      }

      const newVenue = new Venue({
        venueId: venueKey,
        venuee: venueJSON[venueKey].venuee,
        latitude: venueJSON[venueKey].latitude,
        longitude: venueJSON[venueKey].longitude,
        events: allEvents,
      });
      // console.log(newVenue)
      await newVenue.save();
    }
  };
  // await populateDB()

  // const fetchedEvents = await Event
  //   .find({})
  // const fetchedVenues = await Venue
  //   .find({})
  // console.log(fetchedEvents.length)
  // console.log(fetchedVenues.length)
  // return

  const CommentSchema = mongoose.Schema(
    {
      userId: { type: String, ref: "User" },
      venueId: { type: String, ref: "Venue" },
      comment: { type: String },
    },
    { timestamps: true }
  );

  const Comment = mongoose.model("Comment", CommentSchema);

  const UserSchema = mongoose.Schema(
    {
      userId: { type: String, unique: true },
      email: { type: String },
      password: { type: String },
      role: { type: String, enum: ["user", "admin"] },
      favouriteVenue: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Venue", default: [] },
      ],
    },
    { timestamps: true }
  );

  const User = mongoose.model("User", UserSchema);

  const CodeSchema = mongoose.Schema(
    {
      email: { type: String },
      code: { type: String },
    },
    { timestamps: true }
  );

  const Code = mongoose.model("Code", CodeSchema);

  async function auth(req, res, next) {
    console.log({ headers: req.headers.authorization });
    if (!req.headers.authorization)
      return res.status(401).json({ success: 0, message: "Plz Login" });
    User.findOne({ userId: req.headers.authorization })
      .then((user) => {
        if (!user)
          res.status(401).json({ success: 0, message: "User not found" });
        else {
          req.user = user;
          console.log(`Authentication success`);
          next();
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  }

  app.post("/genCodeForRegister", (req, res) => {
    console.log({ input: req.body });
    let code = Math.floor(100000 + Math.random() * 900000);
    let subject = "Please confirm your account";
    let data = `<p>Your verification code is: <strong>${code}</strong><br>This verification code will be expired in 15 mins</p>`;
    let newCode = new Code({ email: req.body.email, code: code });
    newCode
      .save()
      .then((newCode) => {
        console.log(newCode.code);
        schedule.scheduleJob(
          newCode.createdAt.getTime() + 15 * 60 * 1000,
          async () => {
            Code.findByIdAndDelete(newCode._id)
              .then((deleted) => {
                if (!deleted)
                  console.log(`${code} is removed before this scheduleJob`);
                else console.log(`${code} successfully removed`);
              })
              .catch((err) => {
                res.status(500).send({ success: 0, message: err });
              });
          }
        );
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SENDER_EMAIL, pass: SENDER_EMAIL_PASSWORD },
    });
    var mailOptions = {
      from: SENDER_EMAIL,
      to: req.body.email,
      subject: subject,
      html: data,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) return res.status(500).json({ success: 0, message: error });
      else {
        console.log(info.response);
        res
          .status(200)
          .send({ success: 1, message: "Email sent", code: newCode.code });
      }
    });
  });

  app.post("/register", (req, res) => {
    console.log({ input: req.body });
    User.findOne({ userId: req.body.username })
      .then((user) => {
        if (user)
          res
            .status(409)
            .send({ success: 0, message: `username already exists` });
        else
          Code.findOneAndDelete({ email: req.body.email, code: req.body.code })
            .then((code) => {
              if (!code)
                res.status(400).send({ success: 0, message: `Invalid code` });
              else {
                let newUser = new User({
                  userId: req.body.username,
                  email: req.body.email,
                  password: req.body.password,
                  role: req.body.role,
                });
                newUser
                  .save()
                  .then(() => {
                    res
                      .status(201)
                      .send({ success: 1, message: `register successfully` });
                  })
                  .catch((err) => {
                    res.status(500).send({ success: 0, message: err });
                  });
              }
            })
            .catch((err) => {
              res.status(500).send({ success: 0, message: err });
            });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.post("/addUser", (req, res) => {
    console.log({ input: req.body });
    User.findOne({ userId: req.body.userId })
      .then((user) => {
        if (user) {
          res
            .status(409)
            .send({ success: 0, message: `username already exists` });
        } else {
          let newUser = new User({
            userId: req.body.userId,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
          });
          newUser
            .save()
            .then(() => {
              res
                .status(201)
                .send({ success: 1, message: `register successfully` });
            })
            .catch((err) => {
              res.status(500).send({ success: 0, message: err });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.post("/login", (req, res) => {
    console.log({ input: req.body });
    User.findOne({ userId: req.body.username })
      .then((user) => {
        // console.log(user)
        if (!user)
          res.status(404).send({ success: 0, message: `Invalid user` });
        else if (user.password !== req.body.password)
          res.status(401).send({ success: 0, message: `Wrong password` });
        else
          res.status(200).send({
            success: 1,
            message: `login successfully`,
            user: { userId: user.userId, role: user.role },
          });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.post("/resetPassword", auth, (req, res) => {
    console.log({ input: req.body });
    if (req.user.password != req.body.password)
      res.status(401).send({ success: 0, message: `Wrong old password` });
    else {
      req.user.password = req.body.newpassword;
      req.user
        .save()
        .then(() => {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: SENDER_EMAIL, pass: SENDER_EMAIL_PASSWORD },
          });
          var mailOptions = {
            from: SENDER_EMAIL,
            to: req.user.email,
            subject: `Your password have been reset`,
            html: `<p>Your have reset your password.</p>`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error)
              return res.status(500).json({ success: 0, message: error });
            else {
              console.log(info.response);
              res
                .status(200)
                .send({ success: 1, message: `reset password successfully` });
            }
          });
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
    }
  });

  app.post("/genCodeForForgetPassword", async (req, res) => {
    console.log({ input: req.body });
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%*&+1234567890";
    let code = "";
    for (let i = 0; i < 10; i++)
      code += characters[Math.floor(Math.random() * characters.length)];
    let subject = "Forget Password";
    let data = `<p>Your new password is: <strong>${code}</strong><br>Please reset it after login</p>`;
    User.findOneAndUpdate(
      { email: req.body.email, userId: req.body.userId },
      { password: code },
      { new: true }
    )
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `User not registered` });
        else {
          console.log(user.password);
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: SENDER_EMAIL,
              pass: SENDER_EMAIL_PASSWORD,
            },
          });
          var mailOptions = {
            from: SENDER_EMAIL,
            to: req.body.email,
            subject: subject,
            html: data,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) res.status(500).json({ success: 0, message: error });
            else {
              console.log(info.response);
              res.status(200).send({ success: 1, message: "Email sent" });
            }
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  // app.post('/genCodeForForgetPassword', async (req, res) => {
  //   console.log({ input: req.body });
  //   User.findOne({ email: req.body.email, userId: req.body.userId })
  //     .then((user) => {
  //       if (!user)
  //         res.status(404).send({ success: 0, message: `User not registered` });
  //       else {
  //         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%*_+-';
  //         let code = ''
  //         for (let i = 0; i < 10; i++)
  //           code += characters[Math.floor(Math.random() * characters.length)];
  //         let subject = "One-time Password";
  //         let data = `<p>Your one-time password is: <strong>${code}</strong><br>This password will be expired in 15 mins</p>`
  //         let newCode = new Code({ email: req.body.email, code: code });
  //         newCode.save()
  //           .then((newCode) => {
  //             console.log(newCode.code)
  //             schedule.scheduleJob(newCode.createdAt.getTime() + 15 * 60 * 1000, async () => {
  //               Code.findByIdAndDelete(newCode._id)
  //                 .then((deleted) => {
  //                   if (!deleted) console.log(`${code} is removed before this scheduleJob`);
  //                   else console.log(`${code} successfully removed`);
  //                 })
  //                 .catch((err) => {
  //                   res.status(500).send({ success: 0, message: err });
  //                 })
  //             })
  //           })
  //           .catch((err) => {
  //             res.status(500).send({ success: 0, message: err });
  //           })
  //         var transporter = nodemailer.createTransport({
  //           service: 'gmail',
  //           auth: {
  //             user: SENDER_EMAIL,
  //             pass: SENDER_EMAIL_PASSWORD,
  //           },
  //         });
  //         var mailOptions = {
  //           from: SENDER_EMAIL,
  //           to: req.body.email,
  //           subject: subject,
  //           html: data,
  //         };
  //         transporter.sendMail(mailOptions, function (error, info) {
  //           if (error)
  //             res.status(500).json({ success: 0, message: error });
  //           else {
  //             console.log(info.response)
  //             res.status(200).send({ success: 1, message: 'Email sent' });
  //           }
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ success: 0, message: err });
  //     })
  // })

  // app.post('/forgetPassword', (req, res) => {
  //   console.log({ input: req.body });
  //   Code.findOneAndDelete({ email: req.body.email, code: req.body.code })
  //     .then((code) => {
  //       if (!code)
  //         res.status(400).send({ success: 0, message: `Invalid code` });
  //       else
  //         User.findOneAndUpdate(
  //           { userId: req.body.userId },
  //           { password: req.body.password },
  //           { new: true }
  //         )
  //           .then((user) => {
  //             if (!user)
  //               res.status(404).send({ success: 0, message: `Invalid userId` });
  //             else
  //               res.status(200).send({ success: 1, message: `reset password successfully` });
  //           })
  //           .catch((err) => {
  //             res.status(500).send({ success: 0, message: err });
  //           });
  //     })
  //     .catch((err) => {
  //       res.status(500).send({ success: 0, message: err });
  //     });
  // })

  app.delete("/delUser/:userId0", auth, (req, res) => {
    console.log({ input: req.params });
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      User.findOneAndDelete({ userId: req.params.userId0, role: "user" })
        .then((user) => {
          if (!user)
            res.status(404).send({
              success: 0,
              message: `You cannot delete an admin or a user not existing`,
            });
          else
            res
              .status(200)
              .send({ success: 1, message: `user deleted successfully` });
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });

  app.get("/getAllUser", auth, (req, res) => {
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      User.find({ role: "user" })
        .then((users) => {
          res
            .status(200)
            .send({ success: 1, message: `get all user`, users, users });
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });

  app.put("/updateUser/:userId0", auth, (req, res) => {
    console.log({ input: req.body, input_params: req.params });
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      User.findOneAndUpdate({ userId: req.params.userId0 }, req.body, {
        new: true,
      })
        .then((user) => {
          if (!user)
            res.status(404).send({
              success: 0,
              message: `you cannot modify another admin or a user not existing`,
            });
          else
            res.status(200).send({
              success: 1,
              message: `update user successfully`,
              user: user,
            });
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });

  app.get("/profile", auth, (req, res) => {
    console.log({ input: req.params });
    req.user
      .populate({
        path: "favouriteVenue",
        populate: {
          path: "events",
          model: "Event",
        },
      })
      .then((user) => {
        res.status(200).send({
          success: 1,
          message: `get profile successfully`,
          profile: user,
        });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.put("/addVenue/:venueId/toFavourite", auth, (req, res) => {
    console.log({ input: req.params });
    Venue.findOne({ venueId: req.params.venueId })
      .then((venue) => {
        if (!venue)
          res.status(404).send({ success: 0, message: `venueId not found` });
        else {
          if (req.user.favouriteVenue.includes(venue._id))
            res.status(200).send({
              success: 0,
              message: `The Location already exists in your favorite veune`,
            });
          else {
            req.user.favouriteVenue.push(venue._id);
            req.user
              .save()
              .then(() => {
                res.status(200).send({
                  success: 1,
                  message: `Successfully add to my favourite veune`,
                });
              })
              .catch((err) => {
                res.status(500).send({ success: 0, message: err });
              });
          }
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.put("/delVenue/:venueId/fromFavourite", auth, (req, res) => {
    console.log({ input: req.params });
    Venue.findOne({ venueId: req.params.venueId })
      .then((venue) => {
        if (!venue)
          res.status(404).send({ success: 0, message: `venueId not found` });
        else {
          if (!req.user.favouriteVenue.includes(venue._id))
            res.status(200).send({
              success: 0,
              message: `The Location does not exists in your favorite venue`,
            });
          else {
            req.user.favouriteVenue.pull(venue._id);
            req.user
              .save()
              .then(() => {
                res.status(200).send({
                  success: 1,
                  message: `Successfully dropped from your favourite veune`,
                });
              })
              .catch((err) => {
                res.status(500).send({ success: 0, message: err });
              });
          }
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.post("/addEventToVenue/:venueId", auth, (req, res) => {
    console.log({ input: req.body, input_params: req.params });
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      Venue.findOne({ venueId: req.params.venueId })
        .then((venue) => {
          if (!venue)
            res.status(404).send({ success: 0, message: `venue not found` });
          else {
            let newEvent = new Event({
              eventId: Date.now(),
              titlee: req.body.titlee,
              cat1: req.body.cat1,
              cat2: req.body.cat2,
              predateE: req.body.predateE,
              progtimee: req.body.progtimee,
              agelimite: req.body.agelimite,
              venueid: req.body.venueid,
              venuee: req.body.venuee,
              pricee: req.body.pricee,
              desce: req.body.desce,
              urle: req.body.urle,
              tagenturle: req.body.tagenturle,
              remarke: req.body.remarke,
              enquiry: req.body.enquiry,
              fax: req.body.fax,
              email: req.body.email,
              saledate: req.body.saledate,
              interbook: req.body.interbook,
              presenterorge: req.body.presenterorge,
            });
            newEvent
              .save()
              .then((e) => {
                venue.events.push(e._id);
                venue
                  .save()
                  .then(() => {
                    res.status(200).send({
                      success: 1,
                      message: `add event successfully`,
                      event: newEvent,
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({ success: 0, message: err });
                  });
              })
              .catch((err) => {
                res.status(500).send({ success: 0, message: err });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });

  app.delete("/deleteEvent/:eventId/fromVenue/:venueId", auth, (req, res) => {
    console.log({ input: req.params });
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      Venue.findOne({ venueId: req.params.venueId })
        .then((venue) => {
          if (!venue)
            res.status(404).send({ success: 0, message: `venue not found` });
          else
            Event.findOne({ eventId: req.params.eventId })
              .then((e) => {
                if (!e)
                  res
                    .status(404)
                    .send({ success: 0, message: `event not found` });
                else {
                  venue.events.pull(e._id);
                  venue
                    .save()
                    .then(() => {
                      e.deleteOne().then(() => {
                        res.status(200).send({
                          success: 1,
                          message: `delete event successfully`,
                        });
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({ success: 0, message: err });
                    });
                }
              })
              .catch((err) => {
                res.status(500).send({ success: 0, message: err });
              });
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });

  app.put("/updateEvent/:eventId", auth, (req, res) => {
    console.log({ input: req.body, input_params: req.params });
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      Event.findOneAndUpdate({ eventId: req.params.eventId }, req.body, {
        new: true,
      })
        .then((e) => {
          if (!e)
            res.status(404).send({ success: 0, message: `eventId not found` });
          else
            res.status(200).send({
              success: 1,
              message: `update event successfully`,
              event: e,
            });
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });

  app.get("/getAllVenue", auth, (req, res) => {
    Venue.find()
      .populate("events")
      .then((items) => {
        res.status(200).send({
          success: 1,
          message: `get venues successfully`,
          venues: items,
        });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.get("/getAllEvent", auth, (req, res) => {
    // if (req.user.role !== "admin")
    //   res.status(401).send({ success: 0, message: `Only admin can do this operation` });
    // else
    Event.find()
      // .populate('events')
      .then((items) => {
        res.status(200).send({
          success: 1,
          message: `get events successfully`,
          events: items,
        });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.get("/getEvent/:venueId", (req, res) => {
    Event.find({ venueid: req.params.venueId })
      .then((items) => {
        res.status(200).send({
          success: 1,
          message: `get venues successfully`,
          events: items,
        });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.get("/getEvent/:venueId", auth, (req, res) => {
    Venue.findOne({ venueId: req.params.venueId })
      .populate("events")
      .then((items) => {
        res.status(200).send({
          success: 1,
          message: `get venues successfully`,
          venues: items,
        });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.get("/getAllCommentFor/:venueId", auth, (req, res) => {
    console.log({ input: req.params });
    Comment.find({ venueId: req.params.venueId })
      .sort({ createdAt: -1 })
      .then((comments) => {
        res.status(200).send({
          success: 1,
          message: `get comments successfully`,
          comments: comments,
        });
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.post("/addComment", auth, (req, res) => {
    console.log({ input: req.body });
    Venue.findOne({ venueId: req.body.venueId })
      .then((venue) => {
        if (!venue)
          res.status(404).send({ success: 0, message: `Invalid venueId` });
        else {
          let newComment = new Comment({
            userId: req.user.userId,
            venueId: req.body.venueId,
            comment: req.body.comment,
          });
          newComment
            .save()
            .then(() => {
              res.status(201).send({
                success: 1,
                message: `add comment successfully`,
                comment: newComment,
              });
            })
            .catch((err) => {
              res.status(500).send({ success: 0, message: err });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      });
  });

  app.delete("/delComment/:id", auth, (req, res) => {
    console.log({ input: req.params });
    if (req.user.role !== "admin")
      res
        .status(401)
        .send({ success: 0, message: `Only admin can do this operation` });
    else
      Comment.findByIdAndDelete(req.params.id)
        .then((cm) => {
          if (!cm)
            res
              .status(404)
              .send({ success: 0, message: `Invalid comment _id` });
          else
            res
              .status(200)
              .send({ success: 1, message: `comment deleted successfully` });
          // res.status(204).send() // 204 no content
        })
        .catch((err) => {
          res.status(500).send({ success: 0, message: err });
        });
  });
});

const server = app.listen(port);
console.log(`server listening at port ${port}`);
