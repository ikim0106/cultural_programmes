const express = require('express');
const cors = require('cors');
const fs = require('fs')
const morgan = require('morgan')
const app = express();
const port = 8080
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const mongoose = require('mongoose');
const venueData = fs.readFileSync('./eventData/tenVenuesAndEventsClean.json', 'utf-8')
mongoose.connect('mongodb+srv://mongo:mongo@cluster0.a9q2k5d.mongodb.net/prj');
// mongoose.connect('mongodb://127.0.0.1:27017/proj');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', async function () {
  console.log("Connection is open...");

  const EventSchema = mongoose.Schema({
    eventId: { type: String, unique: [true, "eventId should be unique"] },
    titlee: { type: String },
    cat1: { type: String },
    cat2: { type: String },
    predateE: { type: String },
    progtimee: { type: String },
    venueId: { type: String },
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
  }, { timestamps: true })
  const Event = mongoose.model("Event", EventSchema)

  const VenueSchema = mongoose.Schema({
    venueId: { type: String, unique: [true, "venueId should be unique"] },
    venuee: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
  }, { timestamps: true })
  const Venue = mongoose.model("Venue", VenueSchema)

  // const populateDB = async () => {
  //   const venueJSON = JSON.parse(venueData)
  //   for(var venueKey in venueJSON) {
  //     let events = venueJSON[venueKey].events
  //     let eventJSON = {}
  //     let allEvents = []
  //     for(var eventKey in events) {
  //       eventJSON = events[eventKey]
  //       eventJSON['eventId'] = eventKey
  //       const eventTemp = new Event(eventJSON)
  //       allEvents.push(eventTemp._id)
  //       await eventTemp.save()
  //     }

  //     const newVenue = new Venue({
  //       venueId: venueKey,
  //       venuee: venueJSON[venueKey].venuee,
  //       latitude: venueJSON[venueKey].latitude,
  //       longitude: venueJSON[venueKey].longitude,
  //       events: allEvents
  //     })
  //     // console.log(newVenue)
  //     await newVenue.save()
  //   }
  // }

  // const fetchedVenues = await Venue
  //   .find({}).populate('events')
  // console.log(fetchedVenues[0])
  const CommentSchema = mongoose.Schema({
    userId: { type: String, ref: 'User' },
    venueId: { type: String, ref: 'Venue' },
    comment: { type: String },
  }, { timestamps: true });

  const Comment = mongoose.model("Comment", CommentSchema)

  const UserSchema = mongoose.Schema({
    userId: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'] }
  }, { timestamps: true });

  const User = mongoose.model("User", UserSchema)

  app.post('/register', (req, res) => {
    console.log({ "input": req.body })
    let newUser = new User({
      userId: req.body.username,
      password: req.body.password,
      role: req.body.role === "admin" ? "admin" : "user"
    })
    User.findOne({ userId: req.body.username })
      .then((user) => {
        if (user)
          res.status(409).send({ success: 0, message: `username already exists` })
        else
          newUser.save()
            .then(() => {
              res.status(201).send({ success: 1, message: `register successfully` })
            })
            .catch(err => {
              res.status(500).send({ success: 0, message: err })
            })
      })
      .catch(err => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.post('/login', (req, res) => {
    console.log({ "input": req.body })
    User.findOne({ userId: req.body.username })
      .then((user) => {
        // console.log(user)
        if (!user)
          res.status(404).send({ success: 0, message: `Invalid user` })
        else
          if (user.password !== req.body.password)
            res.status(401).send({ success: 0, message: `Wrong password` })
          else
            res.status(200).send({
              success: 1, message: `login successfully`,
              user: { userId: user.userId, role: user.role }
            })
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.post('/resetPassword', (req, res) => {
    console.log({ "input": req.body })
    User.findOne({ userId: req.body.username })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `Invalid user` })
        else
          if (user.password !== req.body.password)
            res.status(401).send({ success: 0, message: `Wrong old password` })
          else {
            user.password = req.body.newpassword;
            user.save()
              .then(() => {
                res.status(200).send({ success: 1, message: `reset password successfully` })
              })
              .catch((err) => {
                res.status(500).send({ success: 0, message: err })
              })
          }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.delete('/delUser/:userId', (req, res) => {
    console.log({ input: req.params })
    User.findOneAndDelete({ userId: req.params.userId })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `userId not found` })
        else
          res.status(200).send({ success: 1, message: `user deleted successfully` })
        // res.status(204).send() // 204 no content
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.get('/getAllVenue', (req, res) => {
    Venue.find()
      .populate('events')
      .then((items) => {
        res.status(200).send({ success: 1, message: `get venues successfully`, venues: items })
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.post('/addComment', (req, res) => {
    console.log({ input: req.body })
    Venue.findOne({ venueId: req.body.venueId })
      .then((venue) => {
        if (!venue)
          res.status(404).send({ success: 0, message: `Invalid venueId` });
        else {
          User.findOne({ userId: req.body.userId })
            .then((user) => {
              if (!user)
                res.status(404).send({ success: 0, message: `Invalid userId` });
              else {
                let newComment = new Comment({
                  userId: req.body.userId,
                  venueId: req.body.venueId,
                  comment: req.body.comment
                })
                newComment.save()
                  .then(() => {
                    res.status(201).send({ success: 1, message: `add comment successfully` });
                  })
                  .catch((err) => {
                    res.status(500).send({ success: 0, message: err })
                  })
              }
            })
            .catch((err) => {
              res.status(500).send({ success: 0, message: err });
            })
        }
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      })
  })

  app.delete('/delComment/:id', (req, res) => {
    console.log({ input: req.params })
    Comment.findByIdAndDelete(req.params.id)
      .then((cm) => {
        if (!cm)
          res.status(404).send({ success: 0, message: `Invalid comment _id` });
        else
          res.status(200).send({ success: 1, message: `comment deleted successfully` })
        // res.status(204).send() // 204 no content
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err });
      })
  })

})

//
const server = app.listen(port);
console.log(`server listening at port ${port}`)