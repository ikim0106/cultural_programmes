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

  const populateDB = async () => {
    const venueJSON = JSON.parse(venueData)
    for (var venueKey in venueJSON) {
      let events = venueJSON[venueKey].events
      let eventJSON = {}
      let allEvents = []
      for (var eventKey in events) {
        eventJSON = events[eventKey]
        eventJSON['eventId'] = eventKey
        eventJSON['venuee'] = venueKey
        const eventTemp = new Event(eventJSON)
        allEvents.push(eventTemp._id)
        await eventTemp.save()
      }

      const newVenue = new Venue({
        venueId: venueKey,
        venuee: venueJSON[venueKey].venuee,
        latitude: venueJSON[venueKey].latitude,
        longitude: venueJSON[venueKey].longitude,
        events: allEvents
      })
      // console.log(newVenue)
      await newVenue.save()
    }
  }
  // await populateDB()

  // const fetchedEvents = await Event
  //   .find({})
  // const fetchedVenues = await Venue
  //   .find({})
  // console.log(fetchedEvents.length)
  // console.log(fetchedVenues.length)
  // return

  const CommentSchema = mongoose.Schema({
    userId: { type: String, ref: 'User' },
    venueId: { type: String, ref: 'Venue' },
    comment: { type: String },
  }, { timestamps: true });

  const Comment = mongoose.model("Comment", CommentSchema)

  const UserSchema = mongoose.Schema({
    userId: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'] },
    favouriteVenue: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue', default: [] }]
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

  app.get('/profile/:userId', (req, res) => {
    console.log({ input: req.params })
    User.findOne({ userId: req.params.userId })
      .populate({
        path: 'favouriteVenue',
        populate: {
          path: 'events',
          model: 'Event'
        }
      })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `user not found` })
        else
          res.status(200).send({ success: 1, message: `get profile successfully`, profile: user })
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.put('/addVenue/:venueId/toFavourite/:userId', (req, res) => {
    console.log({ input: req.params })
    User.findOne({ userId: req.params.userId })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `userId not found` })
        else {
          Venue.findOne({ venueId: req.params.venueid })
            .then((venue) => {
              if (!venue)
                res.status(404).send({ success: 0, message: `venueId not found` })
              else {
                if (user.favouriteVenue.includes(venue._id))
                  res.status(200).send({ success: 0, message: `Venue already exists in favorites` });
                else {
                  user.favouriteVenue.push(venue._id);
                  user.save()
                    .then(() => {
                      res.status(200).send({ success: 1, message: `successfully add to my favourite` })
                    })
                    .catch((err) => {
                      res.status(500).send({ success: 0, message: err })
                    })
                }
              }
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

  app.put('/delVenue/:venueId/fromFavourite/:userId', (req, res) => {
    console.log({ input: req.params })
    User.findOne({ userId: req.params.userId })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `userId not found` })
        else {
          Venue.findOne({ venueId: req.params.venueId })
            .then((venue) => {
              if (!venue)
                res.status(404).send({ success: 0, message: `venueId not found` })
              else {
                if (!user.favouriteVenue.includes(venue._id))
                  res.status(200).send({ success: 0, message: `Venue does not exists in favorites` });
                else {
                  user.favouriteVenue.pull(venue._id);
                  user.save()
                    .then(() => {
                      res.status(200).send({ success: 1, message: `successfully delete from my favourite` })
                    })
                    .catch((err) => {
                      res.status(500).send({ success: 0, message: err })
                    })
                }
              }
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

  app.post('/addEventToVenue/:venueId/by/:userId', (req, res) => {
    console.log({ input: req.body, input_params: req.params })
    User.findOne({ userId: req.params.userId })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `user not found` });
        else
          if (user.role !== "admin")
            res.status(401).send({ success: 0, message: `Only admin can do this operation` });
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
                    presenterorge: req.body.presenterorge
                  })
                  newEvent.save()
                    .then((e) => {
                      venue.events.push(e._id);
                      venue.save()
                        .then(() => {
                          res.status(200).send({ success: 1, message: `add event successfully`, event: newEvent })
                        })
                        .catch((err) => {
                          res.status(500).send({ success: 0, message: err })
                        })
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
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.delete('/deleteEvent/:eventId/fromVenue/:venueId/by/:userId', (req, res) => {
    console.log({ input: req.params })
    User.findOne({ userId: req.params.userId })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `user not found` });
        else
          if (user.role !== "admin")
            res.status(401).send({ success: 0, message: `Only admin can do this operation` });
          else
            Venue.findOne({ venueId: req.params.venueId })
              .then((venue) => {
                if (!venue)
                  res.status(404).send({ success: 0, message: `venue not found` });
                else
                  Event.findOne({ eventId: req.params.eventId })
                    .then((e) => {
                      if (!e)
                        res.status(404).send({ success: 0, message: `event not found` });
                      else {
                        venue.events.pull(e._id);
                        venue.save()
                          .then(() => {
                            e.deleteOne()
                              .then(() => {
                                res.status(200).send({ success: 1, message: `delete event successfully` })
                              })
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
              .catch((err) => {
                res.status(500).send({ success: 0, message: err })
              })
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.put('/updateEvent/:eventId/by/:userId', (req, res) => {
    console.log({ input: req.body, input_params: req.params })
    User.findOne({ userId: req.params.userId })
      .then((user) => {
        if (!user)
          res.status(404).send({ success: 0, message: `user not found` });
        else
          if (user.role !== "admin")
            res.status(401).send({ success: 0, message: `Only admin can do this operation` });
          else
            Event.findOneAndUpdate(
              { eventId: req.params.eventId },
              req.body,
              { new: true }
            ).then((e) => {
              if (!e)
                res.status(404).send({ success: 0, message: `eventId not found` });
              else
                res.status(200).send({ success: 1, message: `update event successfully`, event: e })
            })
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

  app.get('/getAllEvent', (req, res) => {
    Event.find()
      // .populate('events')
      .then((items) => {
        res.status(200).send({ success: 1, message: `get events successfully`, events: items })
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })
  })

  app.get('/getEvent/:venueId', (req, res) => {
    Venue.findOne({ venueId: req.params.venueId })
      .populate('events')
      .then((items) => {
        res.status(200).send({ success: 1, message: `get venues successfully`, venues: items })
      })
      .catch((err) => {
        res.status(500).send({ success: 0, message: err })
      })

  })

  app.get('/getAllCommentFor/:venueId', (req, res) => {
    console.log({ input: req.params })
    Comment.find({ venueId: req.params.venueId })
      .sort({ createdAt: 1 })
      .then((comments) => {
        res.status(200).send({ success: 1, message: `get comments successfully`, comments: comments })
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