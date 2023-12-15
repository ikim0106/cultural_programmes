// Student Name : Ng Tik Wai, Inho Kim, Chan Yau Ki, Mak Wing Chit, Ngai Wai Ki
// Student ID : 1155151991, 1155116159, 1155157432, 1155157789, 1155158093
const fs = require('fs')
const xmljs = require('xml-js')

// const xmltojson = () => {
//   const xml = fs.readFileSync('events.xml', 'utf-8')
//   const json = xmljs.xml2js(xml, {compact: true, spaces: 4})
//   // json._declaration = {}
//   const eventArr = json.events.event

//   let res = {}
//   // res["kek"] = "kek"
//   eventArr.map((event) => {
//     // console.log(event)
//     res[`${event._attributes.id}`] = event
//     delete res[`${event._attributes.id}`][`_attributes`]
//   })

//   fs.writeFileSync('events.json', JSON.stringify(res, null, 2))
// }

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
      if(venueKey === eventsJSON[eventKey]["venueid"]["_cdata"] && eventsJSON[eventKey]["pricee"]["_cdata"]) {
        if((eventsJSON[eventKey]["pricee"]["_cdata"] || "").toLowerCase().includes("free") ||
        (eventsJSON[eventKey]["pricee"]["_cdata"] || "").split('$').length==2 &&
        !(eventsJSON[eventKey]["pricee"]["_cdata"] || "").split('$')[1].includes(' ') &&
        !(eventsJSON[eventKey]["pricee"]["_cdata"] || "").split('$')[1].includes(';') &&
        !(eventsJSON[eventKey]["pricee"]["_cdata"] || "").split('$')[1].includes(','))
        // console.log((eventsJSON[eventKey]["pricee"]["_cdata"] || "").toLowerCase())
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

const cleanTenVenues = () => {
  const tenVenues = fs.readFileSync('tenVenuesAndEvents.json', 'utf-8')
  const tenVenuesJSON = JSON.parse(tenVenues)
  for(var venueKey in tenVenuesJSON) {
    delete tenVenuesJSON[venueKey].venuec
    for(var venueDetailKey in tenVenuesJSON[venueKey]) {
      // console.log(tenVenuesJSON[venueKey][venueDetailKey])
      if(venueDetailKey!='events') {
        tenVenuesJSON[venueKey][`${venueDetailKey.toString()}`] = tenVenuesJSON[venueKey][venueDetailKey]._cdata
      }
      else {
        for(var eventID in tenVenuesJSON[venueKey]['events']) {
          for(var eventDetailKey in tenVenuesJSON[venueKey]['events'][eventID]) {
            if(eventDetailKey.endsWith('C') || eventDetailKey.endsWith('c'))
              delete tenVenuesJSON[venueKey]['events'][eventID][eventDetailKey]
            else
            tenVenuesJSON[venueKey]['events'][eventID][eventDetailKey] = tenVenuesJSON[venueKey]['events'][eventID][eventDetailKey]._cdata || ""
            // console.log(eventDetailKey)
          }
          // console.log(tenVenuesJSON[venueKey]['events'])
        }
      }

    }
  }
  console.log(tenVenuesJSON)
  fs.writeFileSync('tenVenuesAndEventsClean.json', JSON.stringify(tenVenuesJSON, null, 2))
}
// xmltojson2()
// venueWithEvents()
// cleanTenVenues()