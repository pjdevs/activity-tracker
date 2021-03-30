# Activity Tracker

A simple tracker for participants of activities

## Usage

- Fill the `activities.json` file with all your activities
- An activity is an object :
```json
{
    "name": "<name>",
    "teamActivity": "<is this activity with teams"
}
```
- Start the server with `node main.js`

## Specs

- Every `GET` on `/` will update the activity list
- Participants list is under folder `participants` with name `list-<activity-name>.json`