import camelcase from "camelcase";

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
