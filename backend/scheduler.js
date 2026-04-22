const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

const runPythonScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'scraper', scriptName);
    console.log(`Executing ${scriptName}...`);
    
    // Depending on the OS, it might be python or python3
    const command = `python "${scriptPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptName}: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr from ${scriptName}: ${stderr}`);
      }
      console.log(`Stdout from ${scriptName}:\n${stdout}`);
      resolve();
    });
  });
};

const runPipeline = async () => {
  console.log('--- Starting Scheduled Data Pipeline ---');
  try {
    await runPythonScript('scraper.py');
    console.log('Scraping completed successfully.');
    
    await runPythonScript('ml_predictor.py');
    console.log('ML Prediction completed successfully.');
    
    console.log('--- Pipeline Execution Finished ---');
  } catch (error) {
    console.error('Pipeline failed:', error);
  }
};

// Schedule to run every day at midnight
// For testing purposes, you could change this to '* * * * *' (every minute)
cron.schedule('0 0 * * *', () => {
  console.log('Running daily data pipeline job...');
  runPipeline();
});

console.log('Scheduler initialized. Cron job is set to run at midnight daily.');

module.exports = { runPipeline };
