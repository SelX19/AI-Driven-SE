const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

const PORT = 3001; // you can change if needed

// POST endpoint to run Gemini commands
app.post('/run', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'command is required' });
    }

    // Construct Gemini CLI command
    const cliCommand = `gemini /${command}`;

    // Run Gemini CLI command
    exec(cliCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }
        console.log(`Stdout: ${stdout}`);
        res.json({ stdout, stderr });
    });
});

app.listen(PORT, () => {
    console.log(`Gemini Runner listening at http://localhost:${PORT}`);
});

