const express = require('express');
const cors = require('cors');
const fs = require('fs')
const app = express();
const port = 3000
app.use(cors());
app.use(express.json());
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
    eventId: {type: String, unique: [true, "eventId should be unique"]},
    titlee: {type: String},
    cat1: {type: String},
    cat2: {type: String},
    predateE: {type: String},
    progtimee: {type: String},
    venueId: {type: String},
    agelimite: {type: String},
    pricee: {type: String},
    desce: {type: String},
    urle: {type: String},
    tagenturle: {type: String},
    remarke: {type: String},
    enquiry: {type: String},
    fax: {type: String},
    email: {type: String},
    saledate: {type: String},
    interbook: {type: String},
    presenterorge: {type: String},
  }, {timestamps:true})
  const Event = mongoose.model("Event", EventSchema)

  const VenueSchema = mongoose.Schema({
    venueId: {type: String, unique: [true, "venueId should be unique"]},
    venuee: {type: String},
    latitude: {type: String},
    longitude: {type: String},
    events: [{type:mongoose.Schema.Types.ObjectId, ref: 'Event'}]
  }
  , {timestamps:true})
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

  app.post('/api/users/signup', async(req, res) => {
    console.log(req.body)
    res.send('done')
  })
})

//
const server = app.listen(port);
console.log(`server listening at port ${port}`)