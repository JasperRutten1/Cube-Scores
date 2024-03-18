var express = require('express');
var router = express.Router();

const data = {
    lastUpdated: new Date(),
    visitorTimes: [],
    proTimes: [],
    lastTime: null
};

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send(data);
});

router.get('/add/:time/:firstName/:lastName/:age/:pro', (req, res, next) => {
  let params = req.params;
  addTime(params.time, params.firstName, params.lastName, params.age, params.pro);
  res.send(data);
})

router.get('/overview', (req, res, next) => {
  res.render('overview', {title: "Overview", data: data});
});

/*
----------------------------
Internal functions
----------------------------
*/

const addTime = (time, firstName, lastName, age, pro) => {
  console.log(pro);
  let timeObj = {
    id: pro == "true" ? getLastProId() + 1 : getLastVisId() + 1,
    time: time,
    firstName: firstName,
    lastName: lastName,
    age: age
  }
  if(pro == "true") data.proTimes.push(timeObj)
  else data.visitorTimes.push(timeObj)
  updateLastTime(timeObj);
}

const getLastProId = () => {
  data.proTimes.length > 0 ? data.proTimes[data.proTimes.length - 1].id : 1
}

const getLastVisId = () => {
  data.visitorTimes.length > 0 ? data.visitorTimes[data.visitorTimes.length - 1].id : 1
}

const updateLastTime = (time) => {
  data.lastUpdated = new Date();
  data.lastTime = time;
}

module.exports = router;