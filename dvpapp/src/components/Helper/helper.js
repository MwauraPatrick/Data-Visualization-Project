import moment from 'moment'; // Import Moment.js
import 'chartjs-adapter-moment';
import pkg from 'papaparse';

const {parse} = pkg;    


let url = `https://raw.githubusercontent.com/JannesPeeters/suncharge/main/data/`

export async function fetchData(file_name, ...labelsToExtract) {
    try {
        const file_path = url + file_name + ".csv"
        const response = await fetch(file_path); // Replace with your server-side endpoint
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
        }
        console.log("Fetching " + file_name + " file")
        const csvString = await response.text();
        
        const results = {};
        const parsedData = processData(csvString, results, ...labelsToExtract);

        return (results)

    } catch (error) {
        console.error('Error fetching CSV data:', error);
       
    }
    
}

function processData(csvString, results, ...rowLabels) {
    console.log("Processing csv data");

    const parsedData = parse(csvString, { header: true }); // Assume headers

    if (!parsedData.data || !parsedData.data.length) {
        console.error('Error: Empty CSV data or invalid format');
        return []; // Return empty array for error handling
    }
    //skip the first 2 rows
    const data = parsedData.data.slice(2);

    for (const label of rowLabels) {
        results[label] = data.map(row => row[label]); // Store entire matching row as value
    }
    // Extract labels and data from all rows
    const labels = data.map(row => row['SalesOrderCreationDate']);
    const quantity = data.map(row => parseFloat(row['OrderQuantity']));
    
    return { labels, quantity };
}

function applyFilter(data, startDate, endDate, ...rowLabels ) {
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

 /**
     * 
     * @param data
     * @param startDate
     * @param endDate
     * @param rowLabels
     */
 export function applyFilter2(data, startDate, endDate, results, ...rowLabels) {
    console.log("extracting data between " + startDate + " and " + endDate)
    const filteredData = data[rowLabels[0]].reduce((acc, label, index) => {
        const date = new Date(label);
        // Filter based on date being within the start and end date range (inclusive)
        if (date >= startDate && date <= endDate) {
            const dateString = date.toDateString(); // Convert to date string for grouping
            acc[dateString] = acc[dateString] || {};
            for (let i = 1; i < rowLabels.length; i++) {
                const l = rowLabels[i];
                acc[dateString][l] = (acc[dateString][l] || 0) + Number(data[l][index]); // Use label for indexing
            }
        }

        return acc;
    }, {});


    // Convert grouped data to arrays for labels (dates) and quantity
    const filteredLabels = Object.keys(filteredData).sort((a, b) => new Date(a) - new Date(b));;
    
    results[rowLabels[0]] = filteredLabels

    for (let i = 1; i < rowLabels.length; i++) {
        const l = rowLabels[i];
        results[l] = filteredLabels.map(dateString => filteredData[dateString][l])
    };

    // Optional: Format dates using Moment.js (if imported)
    if (moment) {
        results[rowLabels[0]].forEach((label, index) => {
        results[rowLabels[0]][index] = moment(label).format('MM-DD-YYYY');
        });
    }
    
    return 1;
}
  
/**
 * 
* @param date
*/
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    return `${year}-${month}-${day}`;
}
