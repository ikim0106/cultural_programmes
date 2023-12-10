const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const app = express();
const port = 3000
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mongo:mongo@cluster0.a9q2k5d.mongodb.net/prj');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', async function () {
  console.log("Connection is open...");

  const VenueSchema = mongoose.Schema({
    venueId: { type: String, unique: [true, "venueId should be unique"] },
    venueName: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    events: { type: Object }
  })

  const Venue = mongoose.model("Venue", VenueSchema)

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

  let user1 = new User({
    userId: 'user1',
    password: '123',
    role: 'user'
  })
  await user1.save()
    .catch(err => {
      console.log(err)
    })

  const newVenue = new Venue({
    venueId: "36310304",
    latitude: "22.38136",
    longitude: "114.18990",
    events: {
      "156410": {
        "titlec": {
          "_cdata": "跆拳道班"
        },
        "titlee": {
          "_cdata": "Taekwondo Class"
        },
        "cat1": {
          "_cdata": "inc4"
        },
        "cat2": {
          "_cdata": "inc4sc14"
        },
        "predateC": {
          "_cdata": "2024年1月6日至6月29日 (逢星期六)  晚上7:30至晚上9:30 (10/2, 11/5 除外)"
        },
        "predateE": {
          "_cdata": "6 Jan to 29 Jun 2024 (Every Sat) 7:30pm - 9:30pm (Except 10/2, 11/5)"
        },
        "progtimec": {
          "_cdata": "不適用"
        },
        "progtimee": {
          "_cdata": "Not Applicable"
        },
        "venueid": {
          "_cdata": "36310304"
        },
        "agelimitc": {},
        "agelimite": {},
        "pricec": {},
        "pricee": {},
        "descc": {},
        "desce": {},
        "urlc": {},
        "urle": {},
        "tagenturlc": {},
        "tagenturle": {},
        "remarkc": {},
        "remarke": {},
        "enquiry": {
          "_cdata": "2381 6382"
        },
        "fax": {},
        "email": {},
        "saledate": {},
        "interbook": {},
        "presenterorgc": {
          "_cdata": "國際跆拳道香港總會主辦"
        },
        "presenterorge": {
          "_cdata": "Presented by International Taekwondo H. K. Association"
        }
      },
      "156411": {
        "titlec": {
          "_cdata": "國際標準舞及拉丁舞班"
        },
        "titlee": {
          "_cdata": "International Standard Dance &amp; Latin Dance Class"
        },
        "cat1": {
          "_cdata": "inc4"
        },
        "cat2": {
          "_cdata": "inc4sc14"
        },
        "predateC": {
          "_cdata": "2024年1月8日至6月24日 (逢星期一)  早上9:00至下午2:00 (12/2, 1/4, 10/6 除外)"
        },
        "predateE": {
          "_cdata": "8 Jan to 24 Jun 2024 (Every Mon) 9:00am-2:00pm (Except 12/2, 1/4, 10/6)"
        },
        "progtimec": {
          "_cdata": "不適用"
        },
        "progtimee": {
          "_cdata": "Not Applicable"
        },
        "venueid": {
          "_cdata": "36310304"
        },
        "agelimitc": {},
        "agelimite": {},
        "pricec": {},
        "pricee": {},
        "descc": {},
        "desce": {},
        "urlc": {},
        "urle": {},
        "tagenturlc": {},
        "tagenturle": {},
        "remarkc": {},
        "remarke": {},
        "enquiry": {
          "_cdata": "9357 6737"
        },
        "fax": {},
        "email": {},
        "saledate": {},
        "interbook": {},
        "presenterorgc": {
          "_cdata": "夢幻國際舞蹈協會主辦"
        },
        "presenterorge": {
          "_cdata": "Presented by Magic International Dancing Association"
        }
      },
      "156498": {
        "titlec": {
          "_cdata": "拉丁舞班"
        },
        "titlee": {
          "_cdata": "Latin Dance Class"
        },
        "cat1": {
          "_cdata": "inc4"
        },
        "cat2": {
          "_cdata": "inc4sc14"
        },
        "predateC": {
          "_cdata": "2024年1月5日至6月28日 (逢星期五)  下午2:30至下午4:30 (9/2, 29/3, 10/5 除外)"
        },
        "predateE": {
          "_cdata": "5 Jan to 28 Jun 2024 (Every Fri) 2:30pm-4:30pm (Except 9/2, 29/3, 10/5)"
        },
        "progtimec": {
          "_cdata": "不適用"
        },
        "progtimee": {
          "_cdata": "Not Applicable"
        },
        "venueid": {
          "_cdata": "36310304"
        },
        "agelimitc": {},
        "agelimite": {},
        "pricec": {},
        "pricee": {},
        "descc": {},
        "desce": {},
        "urlc": {},
        "urle": {},
        "tagenturlc": {},
        "tagenturle": {},
        "remarkc": {},
        "remarke": {},
        "enquiry": {
          "_cdata": "9632 0052"
        },
        "fax": {},
        "email": {},
        "saledate": {},
        "interbook": {},
        "presenterorgc": {
          "_cdata": "香港標準舞蹈學會主辦"
        },
        "presenterorge": {
          "_cdata": "Presented by Hong Kong Ballroom Dance Club"
        }
      },
      "156499": {
        "titlec": {
          "_cdata": "沙田文藝協會芭蕾舞班"
        },
        "titlee": {
          "_cdata": "Ballet Class of Sha Tin Arts Association"
        },
        "cat1": {
          "_cdata": "inc4"
        },
        "cat2": {
          "_cdata": "inc4sc14"
        },
        "predateC": {
          "_cdata": "2024年1月5日至6月30日 (逢星期五) 下午5:00至晚上7:00 (9/2, 29/3, 10/5除外); (逢星期六) 上午9:00至下午4:30 (10/2, 30/3, 11/5 除外); (逢星期日) 早上9:00至早上11:30 (11/2, 31/3, 12/5除外)"
        },
        "predateE": {
          "_cdata": "5 Jan to 30 Jun 2024 (Every Fri) 5:00pm-7:00pm (Except 9/2, 29/3, 10/5); (Every Sat) 9:00am-4:30pm (Except 10/2, 30/3, 11/5); (Every Sun) 9:00am-11:30am (Except 11/2, 31/3, 12/5)"
        },
        "progtimec": {
          "_cdata": "不適用"
        },
        "progtimee": {
          "_cdata": "Not Applicable"
        },
        "venueid": {
          "_cdata": "36310304"
        },
        "agelimitc": {},
        "agelimite": {},
        "pricec": {},
        "pricee": {},
        "descc": {},
        "desce": {},
        "urlc": {},
        "urle": {},
        "tagenturlc": {},
        "tagenturle": {},
        "remarkc": {},
        "remarke": {},
        "enquiry": {
          "_cdata": "2606 6554"
        },
        "fax": {},
        "email": {},
        "saledate": {},
        "interbook": {},
        "presenterorgc": {
          "_cdata": "沙田文藝協會有限公司主辦"
        },
        "presenterorge": {
          "_cdata": "Presented by Sha Tin Arts Association Limited"
        }
      }
    }
  })

  console.log(newVenue)

  await newVenue.save()
    .catch((err) => {
      console.log(err)
    })

  app.get('/getAllVenue', (req, res) => {
    Venue.find()
      .then((items) => {
        res.status(200).send({ success: 1, message: `get venues successfully`, venues: items })
      })
      .catch((err) => {
        res.status(200).send({ success: 0, message: err, venues: items })
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