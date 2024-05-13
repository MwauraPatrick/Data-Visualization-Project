import pkg from 'papaparse';
const {parse} = pkg; 
import moment from 'moment'; // Import Moment.js

let url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/`;

/**
 * 
 * @param {*} file_name 
 * @param {*} key 
 * @returns 
 */
export async function fetchData(file_name, key) {
    try {
        const file_path = url+file_name+".csv";
  
        const response = await fetch(file_path); // Replace with your server-side endpoint
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
        }

        const csvString = await response.text();
        const labelsToExtract = ["SalesOrderCreationDate", "OrderQuantity"];
        const parsedData = processData(csvString);
     
        //const parsedData = extractData(csvString, ...labelsToExtract);

        return(parsedData);

    } catch (error) {
        console.error('Error fetching CSV data:', error);
       
    }
}
/**
 * 
 */
function extractData(csvString, ...rowLabels) {
    console.log("Processing csv data");

    let data = parse(csvString, { header: true }); // Assume headers
 
    if (!data.data || !data.data.length) {
        console.error('Error: Empty CSV data or invalid format');
        return {}; // Return empty object for error handling
    }
    
    const headers = data.data[0]; // Assuming headers are in the first row
   
    data = data.data.slice(2);
    // Extract data from matching rows
    const results = {};
    for (const label of rowLabels) {
        results[label] = data.map(row => row['SalesOrderCreationDate']); // Store entire matching row as value
    }
    
    return results;
}

/**
 * 
 * @param {*} csvString 
 * @returns 
 */
function processData(csvString) {
    console.log("Processing csv data");

    const parsedData = parse(csvString, { header: true }); // Assume headers

    if (!parsedData.data || !parsedData.data.length) {
        console.error('Error: Empty CSV data or invalid format');
        return []; // Return empty array for error handling
    }
    //skip the first 2 rows
    const data = parsedData.data.slice(2);

    // Extract labels and data from all rows
    const labels = data.map(row => row['SalesOrderCreationDate']);
    const quantity = data.map(row => parseFloat(row['OrderQuantity']));
    
    return { labels, quantity };
}

export function applyFilter(data, startDate, endDate ) {
    console.log("Updating chart")
    if (!data || !data.labels || !data.quantity || !startDate || !endDate) {
        console.error('Error: Missing data, labels, start date, or end date');
        return { labels: [], quantity: [] }; // Return empty arrays for error handling
    }

    const filteredData = data.labels.reduce((acc, label, index) => {
        const date = new Date(label);

        // Filter based on date being within the start and end date range (inclusive)
        if (date >= startDate && date <= endDate) {
        const dateString = date.toDateString(); // Convert to date string for grouping
        acc[dateString] = (acc[dateString] || 0) + data.quantity[index];
        }

        return acc;
    }, {});

    // Convert grouped data to arrays for labels (dates) and quantity
    const filteredLabels = Object.keys(filteredData).sort((a, b) => new Date(a) - new Date(b));;

    const filteredQuantity = filteredLabels.map(dateString => filteredData[dateString]);

    // Optional: Format dates using Moment.js (if imported)
    if (moment) {
        filteredLabels.forEach((label, index) => {
        filteredLabels[index] = moment(label).format('MM-DD-YYYY');
        });
    }

    return { labels: filteredLabels, quantity: filteredQuantity };
}

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    return `${year}-${month}-${day}`;
}