var express = require('express');
var router = express.Router();

let data = {};

const fs = require('fs');

const writeData = () => {
  fs.writeFile('data.json', JSON.stringify(data, null, 2), () => {
    console.log("writing data");
  });
}

const readData = ()  => {
  fs.readFile('data.json', (err, rawData) => {
    if (err) {
      console.log(err);
    } else {
      console.log("reading data");
      data = JSON.parse(rawData);
      console.log(data);
    }
  });
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send(data);
});

// router.get('/add/:time/:firstName/:lastName/:age/:pro', (req, res, next) => {
//   let params = req.params;
//   addTime(params.time, params.firstName, params.lastName, params.age, params.pro);
//   res.send(data);
// })

router.post('/add', (req, res, next) => {
  console.log(req.body);
  addTime(req.body.time, req.body.firstName, req.body.lastName, req.body.age, req.body.pro);
  res.redirect('controller');
})

router.get('/overview', (req, res, next) => {
    sortArray(data.visitorTimes);
    sortArray(data.proTimes);
  res.render('overview', {
    title: "Overview", 
    data: data
  });
});

router.get('/controller', (req, res, next) => {
  res.render('controller', {title: "Controller"});
});

/*
----------------------------
Internal functions
----------------------------
*/

const addTime = (time, firstName, lastName, age, pro) => {
  console.log(pro);
  data.times[getLastId() + 1] = {
    id: getLastId() + 1,
    time: time,
    firstName: firstName,
    lastName: lastName,
    age: age,
    pro: pro
  }
  writeData();
}

const getLastId = () => {
  let id = 0;
  runOnScores(score => {if(score.id > id) id = score.id;})
  return id;
}

const sortArray = (array) => {
  let sorted = array.sort((a, b) => a.time-b.time);
  return sorted;
}

const runOnScores = (func) => {
  Object.keys(data.times).forEach(func);
}

const addDisplayTime = (time) => {
  let totalSeconds = Math.floor(time.time / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let milliseconds = time.time % 1000;

  if(minutes > 0) time.display = `${minutes}:${seconds}.${milliseconds}`
  else time.display = `${seconds}.${milliseconds}`
}

if (fs.existsSync("data.json")) {
  console.log("file found");
  readData();
} else {
  data = {
    lastUpdated: new Date(),
    times: {},
    lastTime: null
  }
  writeData();
}

module.exports = router;