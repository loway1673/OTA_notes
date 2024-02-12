 OTA notes

## To run OTA Notes
1. clone repository
> `git clone https://github.com/loway1673/OTA_notes.git`
2. go to OTA_notes directory and run
> `npm install`
3. run
> npm start
4. Take note that OTA_notes application will run in port 3000. If another task is running in the same port, please terminate the other task.
5. Import the postman collection (OTA.postman_collection.json) to your postman.
6. Send request using postman

## Notes on running postman collection
For save and update operations, please send input via request body in raw json format
>`
{
    "title": "newTitle",
    "body": "newBody"
}
`