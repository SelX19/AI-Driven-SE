const express = require('express');
const { exec, execFile } = require('child_process');

const app = express();
app.use(express.json()); // Use the modern express.json() middleware

const PORT = 3001; // you can change if needed

// New, more secure endpoint for running commands with input
app.post('/execute', (req, res) => {
    const { command, input } = req.body;

    if (!command || !input) {
        return res.status(400).json({ error: 'Both "command" and "input" are required in the request body.' });
    }

    // Arguments for the gemini command - the input is a positional argument, and --yolo enables non-interactive execution
    const args = [
        command,
        input,
        '--yolo'
    ];    // Use execFile for security - it prevents shell injection
    execFile('gemini', args, (error, stdout, stderr) => {
        if (error) {
            console.error(`ExecFile Error: ${error.message}`);
            // Send stderr as part of the response for better debugging in n8n
            return res.status(500).json({ error: error.message, stderr: stderr || null, stdout: stdout || null });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }
        console.log(`Stdout: ${stdout}`);
        res.json({ stdout, stderr });
    });
});

// New endpoint with context and placeholder replacement
app.post('/execute_with_context', (req, res) => {
    const { command, input, context } = req.body;

    if (!command || !input || !context) {
        return res.status(400).json({ error: 'All "command", "input", and "context" are required in the request body.' });
    }

    const args = [
        command,
        input,
        context,
        '--yolo'
    ];

    execFile('gemini', args, (error, stdout, stderr) => {
        if (error) {
            console.error(`ExecFile Error: ${error.message}`);
            return res.status(500).json({ error: error.message, stderr: stderr || null, stdout: stdout || null });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }
        console.log(`Stdout: ${stdout}`);
        res.json({ stdout, stderr });
    });
});


// Existing POST endpoint to run Gemini commands
app.post('/run', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'command is required' });
    }

    // Construct Gemini CLI command - WARNING: Insecure, prefer /execute
    const cliCommand = `gemini ${command}`;

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
