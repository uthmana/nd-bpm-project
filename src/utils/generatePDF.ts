// import puppeteer from 'puppeteer';
// import { renderToStaticMarkup } from 'react-dom/server';
// import React from 'react';
// import InvoiceDoc from '../components/invoice';
// import path from 'path';

// interface ProcessItem {
//   product: string;
//   application: string;
//   standard: string;
//   color: string;
//   shipmentQty: number;
// }

// interface InvoiceData {
//   id: string;
//   barcode: string;
//   rep_name: string;
//   address: string;
//   tax_Office: string;
//   taxNo: string;
//   createdAt: string;
//   invoiceDate: string;
//   description?: string;
//   process?: ProcessItem[];
//   serverSide?: boolean;
// }

// async function createPDF(invoiceData: InvoiceData): Promise<string> {
//   // Render the React component to an HTML string
//   const htmlString = renderToStaticMarkup(React.createElement(InvoiceDoc, { invoice: invoiceData }));

//   // Launch Puppeteer browser
//   const browser = await puppeteer.launch({
//     headless: true, // Ensure Puppeteer runs in headless mode
//     args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add necessary flags for environments like Heroku
//   });
//   const page = await browser.newPage();

//   // Set the HTML content
//   await page.setContent(htmlString, { waitUntil: 'load' });

//   // Define the PDF path
//   const pdfPath = path.join(process.cwd(), 'public', `invoice_${invoiceData.id}.pdf`);

//   // Generate the PDF
//   await page.pdf({
//     path: pdfPath,
//     format: 'A4',
//     printBackground: true,
//   });

//   // Close the browser
//   await browser.close();

//   return pdfPath;
// }

// export default createPDF;
