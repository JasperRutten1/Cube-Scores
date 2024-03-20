# Getting Started

**Before starting thing make sure you have node.js installed.**

open the express folder with a command prompt or terminal. 

run the following command in the express folder:

```
npm start
```

open the following pages in any browser

Controller:
> http://localhost:3000/times/overview

Overview:
> http://localhost:3000/times/controller

## Overview

This page serves as a display page. It will show scores for both the professional's league and visitors league.
Below it also shows the last added to the scores.

Scores are ranked by shortest time and are refreshed every 20 seconds.

## Controller

This page allows you to add new scores. 
Fill in the fields (all are required).
> note: time is in milliseconds, this time will later be shown differently.

make sure to hit the checkbox in case the competitor is a professional.

Click the add button when you want to add the score.