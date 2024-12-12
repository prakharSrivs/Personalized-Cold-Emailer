# LinkedIn Profile Scraper and Cold Email Generator

This project is designed to extract LinkedIn profile information and generate personalized cold emails for outreach. It uses Puppeteer for web scraping, OpenAI for generating summaries, and stores the data in a PostgreSQL database.

## Server Setup

### Prerequisites

Before running the server, ensure you have the following:

- **Node.js** installed (version 14 or higher).
- **PostgreSQL** database set up and running. You will need to configure the database connection in the server's environment variables.
- Install the required dependencies by running:

    ```bash
    npm install

### Running the Server
Navigate to the server folder and start the server :

    ```bash
    node index.js

### Notes:
Headless Mode: The scraping is performed using Puppeteer in non-headless mode (headless: false) to allow you to manually complete any security checks or CAPTCHA prompts that may appear due to frequent use of the email address associated with the scraping process.

Retries for Profile Extraction: For each LinkedIn profile, the script will attempt to extract the information up to 3 times in case of any errors or failed attempts. This ensures higher reliability in data extraction.
