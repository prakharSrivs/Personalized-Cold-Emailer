import cloudinary from "cloudinary"
import xlsx from "xlsx"
import axios from "axios";
import camelcase from "camelcase";


cloudinary.config({
    cloud_name: 'dhzod7y8u',
    api_key: '249729739671587',
    api_secret: 'r4U4Ej8vHxjsOXdknbFgTB2v2FU'
});

export async function imageUrlToBase64(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Error fetching and encoding image:', error);
        throw error;
    }
}

export function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

export async function uploadImageToCloudinary(filePath) {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: 'linkedin-screenshots', 
    });
    return result.secure_url;
}

export function cleanData(data) {
    const res = [];

    data.forEach((row) => {
        let obj = {};
        for (const key in row) {
            let camelCaseKey = camelcase(key);
            obj[camelCaseKey] = row[key];
        }
        res.push(obj);
    });

    return res;
}
