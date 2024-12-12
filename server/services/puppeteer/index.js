import puppeteer from "puppeteer";
import { uploadImageToCloudinary } from "../../utils.js";
import { generateColdEmail, processingImageText } from "../open-ai/index.js";
import { updateColdEmailContent, updateProfileSummary } from "../../db/user_profiles.js";

const profileInfo = {
    email : "prakharsrivwork@gmail.com",
    password: "Kumar1234##"
}

export async function loginToLinkedin(page, email, password ) {
    await page.goto("https://www.linkedin.com/login", { waitUntil: "networkidle0" });
    await page.waitForSelector("#username");
    await page.type("#username", email, { delay: 100 });

    await page.waitForSelector("#password");
    await page.type("#password", password, { delay: 100 });

    await page.waitForSelector('[type="submit"]');
    await page.click('[type="submit"]');

    await page.waitForNavigation();
}

async function removeDomElement(page, elementSelector) {
    await page.evaluate((selector) => {
        let element = document.querySelector(selector);
        while( element ) {  
            element.remove();
            element = document.querySelector(selector)
        }
    }, elementSelector); 
}

async function generateProfileSummary(page, data) {
    const { name, linkedinProfileUrl, mobileNumber } = data;
    console.log(name, linkedinProfileUrl)
    try {
        await page.goto(`${linkedinProfileUrl}`, { waitUntil: "domcontentloaded" });  
        removeDomElement(page, "#msg-overlay")         
        const imagePath = `./services/puppeteer/outputs/curr.png`;
        await page.screenshot({ path:imagePath, fullPage: true });
        const imageUrl = await uploadImageToCloudinary(imagePath);
        const summary = await processingImageText(imageUrl);
        return summary?.content;
    }catch(e) {
        console.log(e);
        throw new Error(e?.message);
    }
}

export async function scrapeLinkedinProfiles(data) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});
    await loginToLinkedin(page, profileInfo.email, profileInfo.password);
    console.log("Logged In - Now viewing profiles")
    const currentUrl = await page.url();
    console.log(currentUrl)

    if( currentUrl !== 'https://linkedin.in/feed' ) {
        console.log("Perform Security Checks");
        await new Promise(resolve => setTimeout(resolve, 20 * 1000));
    }

    for (let row of data) {
        let attemptsLeft = 3; // Make 3 attempts incase of any errors
        while( attemptsLeft ) {
            try {
                const profile = await generateProfileSummary(page, row);
                if( profile.trim().length == 0 ) throw new Error("Incomplete Information"); 
                attemptsLeft = 0;
                updateProfileSummary(row.linkedinProfileUrl, row.mobileNumber, profile);
                const coldEmailContent = await generateColdEmail(profile);
                updateColdEmailContent(coldEmailContent, row.linkedinProfileUrl)
            }catch (e) {
                console.log(e);
                attemptsLeft--;
            }
        } 
    }

    await browser.close();
}