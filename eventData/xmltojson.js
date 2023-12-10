const fs = require('fs')
const xmljs = require('xml-js')

const xmltojson = () => {
  const xml = fs.readFileSync('events.xml', 'utf-8')
  const json = xmljs.xml2js(xml, {compact: true, spaces: 4})
  // json._declaration = {}
  const eventArr = json.events.event

  let res = {}
  // res["kek"] = "kek"
  eventArr.map((event) => {
    // console.log(event)
    res[`${event._attributes.id}`] = event
    delete res[`${event._attributes.id}`][`_attributes`]
  })

  fs.writeFileSync('events.json', JSON.stringify(res, null, 2))
}

const xmltojson2 = () => {
  const xml = fs.readFileSync('venues.xml', 'utf-8')
  const json = xmljs.xml2js(xml, {compact: true, spaces: 4})
  // return
  const venueArr = json.venues.venue

  let res = {}
  // res["kek"] = "kek"
  venueArr.map((venue) => {
    // console.log(event)
    res[`${venue._attributes.id}`] = venue
    delete res[`${venue._attributes.id}`][`_attributes`]
  })

  fs.writeFileSync('venues.json', JSON.stringify(res, null, 2))
}

const venueWithEvents = () => {
  const events = fs.readFileSync('events.json', 'utf-8')
  const venues = fs.readFileSync('venues.json', 'utf-8')
  const venueJSON = JSON.parse(venues)
  const eventsJSON = JSON.parse(events)
  
  let eligibleVenues = {}
  let tenVenues = {}
  let tempVenues = {}

  for(var venueKey in venueJSON) {
    let tempVenue = venueJSON[venueKey]
    tempVenue["events"] = {}
    for(var eventKey in eventsJSON) {
      if(venueKey === eventsJSON[eventKey]["venueid"]["_cdata"]) {
        tempVenue["events"][`${eventKey}`] = eventsJSON[eventKey]
      }
      tempVenues[`${venueKey}`] = tempVenue
    }
  }

  for(var venueKey in tempVenues) {
    let numberOfEvents = Object.keys(tempVenues[venueKey].events).length
    // console.log(numberOfEvents)
    
    // console.log(Object.keys(tempVenues[venueKey].latitude).length)
    if(numberOfEvents>2 
        && Object.keys(tempVenues[venueKey].latitude).length!=0
        && Object.keys(tempVenues[venueKey].longitude).length!=0) {
      eligibleVenues[venueKey] = tempVenues[venueKey]
    }
  }
  // console.log(eligibleVenues)

  fs.writeFileSync('allEligibleVenuesAndEvents.json', JSON.stringify(eligibleVenues, null, 2))

  const keys = Object.keys(eligibleVenues)

  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  const selectedKeys = keys.slice(0, 10)
  selectedKeys.forEach(key=> {
    tenVenues[key] = eligibleVenues[key]
  })

  // console.log(tenVenues)
  fs.writeFileSync('tenVenuesAndEvents.json', JSON.stringify(tenVenues, null, 2))
}

// xmltojson()
// xmltojson2()
venueWithEvents()

