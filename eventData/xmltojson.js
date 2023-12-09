const fs = require('fs')
const xmljs = require('xml-js')
const filename = 'events.xml'

const xmltojson = (path) => {
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

  fs.writeFileSync('events.json', JSON.stringify(res))
  console.log(JSON.stringify(res))
  
}

xmltojson(filename)