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
  addTime(req.body.time, req.body.firstName, req.body.lastName, req.body.age, req.body.pro === "true" ? true : false);
  res.redirect('controller');
})

router.post('/edit', (req, res, next) => {
  console.log(req.body);
  editTime(
    parseInt(
      req.body.id
    ),
    req.body.firstName,
    req.body.lastName,
    req.body.newAge, 
    req.body.newTime, 
    req.body.newPro
  );
  res.redirect('controller');
})

router.get('/overview', (req, res, next) => {
  res.render('overview', {
    title: "Overview", 
    pros: getProTimes(),
    visitors: getVisitorTimes(),
    lastTime: data.lastTime
  });
});

router.get('/controller', (req, res, next) => {
  res.render('controller', {
    title: "Controller",
    times: data.times
  });
});

/*
----------------------------
Internal functions
----------------------------
*/

const editTime = (id, firstName, lastName, age, time, pro) => {
  if(data.times[id] == null){
    console.log("could not find score");
    return;
  }
  data.times[id].firstName = firstName;
  data.times[id].lastName = lastName;
  data.times[id].age = age;
  data.times[id].time = time;
  data.times[id].display = getDisplayTime(time);
  data.times[id].pro = pro === "true" ? true : false;
  writeData();
}

const addTime = (time, firstName, lastName, age, pro) => {
  let foundScore = getUserScore(firstName, lastName, age);
  if(foundScore){
    if(time < foundScore.time){
      console.log("editing existing score!");
      data.times[foundScore.id].time = time;
      data.times[foundScore.id].setTime = new Date();
      data.times[foundScore.id].display = getDisplayTime(time);
      data.lastTime = data.times[foundScore.id];
    }
    else{
      console.log("new time is slower, not updating!")
    }
  }
  else{
    console.log("adding new score!");
    let newId = getLastId() + 1
    data.times[newId] = {
      id: newId,
      time: time,
      firstName: firstName,
      lastName: lastName,
      age: age,
      pro: pro,
      setTime: new Date(),
      display: getDisplayTime(time)
    }
    data.lastTime = data.times[newId];
  }
  writeData();
}

const getLastId = () => {
  let highestId = 0;
  for(let id of Object.keys(data.times)){
    let intId = parseInt(id);
    if(intId > highestId) highestId = intId;
  }
  return highestId;
}

const getUserScore = (firstName, lastName, age) => {
  for(let id of Object.keys(data.times)){
    let score = data.times[id];
    if(score.firstName === firstName && score.lastName === lastName, score.age === age) return score;
  }
  return null;
}

const getVisitorTimes = () => {
  let times = [];
  for(let id of Object.keys(data.times)){
    let score = data.times[id];
    if(score.pro == false) times.push(score);
  }
  console.log(`visitors: ${times.length}`);
  return sortArrayByTime(times);
}

const getProTimes = () => {
  let times = [];
  for(let id of Object.keys(data.times)){
    let score = data.times[id];
    if(score.pro == true) times.push(score);
  }
  console.log(`pros: ${times.length}`);
  return sortArrayByTime(times);
}

const sortArrayByTime = (array) => {
  let sorted = array.sort((a, b) => a.time-b.time);
  return sorted;
}

const getDisplayTime = (time) => {
  let totalSeconds = Math.floor(time / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = `${totalSeconds % 60}`;
  if(seconds.length < 2) seconds = "0" + seconds;
  let milliseconds = `${time % 1000}`;
  while(milliseconds.length < 3) milliseconds = "0" + milliseconds; 

  if(minutes > 0) return `${minutes}:${seconds}.${milliseconds}`
  else return `${seconds}.${milliseconds}`
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