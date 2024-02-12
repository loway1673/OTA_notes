const express = require('express');
const app = express();
const ObjectsToCsv = require('objects-to-csv');
const crypto = require("crypto");
const fs = require("fs");
const csvToJson = require('convert-csv-to-json');


app.use(express.json())

app.post('/notes', async (req, res) => {
    let title  = req.body.title;
    let body = req.body.body;

    if(title === undefined || title === null) {
        return res.status(500).json({ Error: "Please input a valid title" });
    }

    if(body === undefined || body === null) {
        return res.status(500).json({ Error: "Please input a valid body" });
    }

    const uuid = crypto.randomUUID();
    let testNote = [{id: uuid, title: title, body: body}];
    const csv = new ObjectsToCsv(testNote);

    // Save to file:
    await csv.toDisk('./test.csv',  { append: true });

    res.json(JSON.stringify(testNote) + ' saved in test.csv');
});

app.get('/notes/:id', (req, res) => {
    let id = req.params.id;

    try {
        let csv = csvToJson.fieldDelimiter(',').getJsonFromCsv("test.csv");
        let result = [];
        result = csv.filter(res => res.id === id);
        res.json(result);
    } catch(err) {
        res.status(404).json({ Error: "Unexpected error occured" });
    }
    
})

app.get('/notes', (req, res) => {
    try {
        let csv = [];
        csv = csvToJson.fieldDelimiter(',').getJsonFromCsv("test.csv");
    
        res.json((csv));
    } catch(err) {
        res.status(500).json({ Error: "Unexpected error occured" });
    }
});

app.put('/notes/:id', async(req, res) => {
    try {
        let id = req.params.id;
        if(id === undefined || id === null) {
            return res.status(500).json("Please provide ID");
        }

        let csv = csvToJson.fieldDelimiter(',').getJsonFromCsv("test.csv");
        let note = csv.find((el) => el.id === id);
        console.log(note);

        if(!note) {
            return res.status(404).json({ "Error": "No match found on ID: " + id });
        }

        let newTitle = req.body.title;
        let newBody = req.body.body;

        if(newTitle === undefined || newTitle === null) {
            return res.status(500).json({ Error: "Please input a valid title" });
        }

        if(newBody === undefined || newBody === null) {
            return res.status(500).json({ Error: "Please input a valid body" });
        }

        note.title = newTitle;
        note.body = newBody;

        const csvObj = new ObjectsToCsv(csv);
        // Save to file:
        await csvObj.toDisk('./test.csv');
        res.status(200).json(JSON.stringify({ title: newTitle, body: newBody }) + ' updated in test.csv');
    } catch(err) {
        res.status(500).json({ Error: "Unexpected error occured" });
    }
});

app.delete('/notes/:id', async(req, res, next) => {
    let id = req.params.id;

    if(id === undefined || id === null) {
        return res.status(500).json("Please provide ID");
    }
    try {
        let csv = csvToJson.fieldDelimiter(',').getJsonFromCsv("test.csv");
        let index = csv.findIndex((res) => res.id === id);

        if(index === -1) {
            return res.status(404).json({ Error: "Notes not found" });
        }

        let deleted = csv.splice(index, 1);

        const csvObj = new ObjectsToCsv(csv);
        // Save to file:
        await csvObj.toDisk('./test.csv');

        res.json('Deleted: ' + JSON.stringify(deleted));
    } catch(err) {
        res.status(500).json({ Error: "Unexpected error occured" });
    }
});

app.listen(3000, () => {
    console.log('listening to port: 3000');
    console.log("POST /notes: Create a new note");
    console.log("GET /notes: Retrieve all notes");
    console.log("GET /notes/:id: Retrieve a specific note by ID");
    console.log("PUT /notes/:id: Update a specific note");
    console.log("DELETE /notes/:id: Delete a specific note");
});