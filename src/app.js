console.log("Hello from top of file app.js")


import * as pdfjsLib from '../pdf/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = '../pdf/build/pdf.worker.mjs';

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const pdfUrl = 'https://client-secure-assets.syd1.cdn.digitaloceanspaces.com/e527d106-c5df-440d-a950-eaf23b0d265d/fc1ad91f-53ff-4c8c-b825-c54dc7ba295f';
const fullUrl = `${proxyUrl}${pdfUrl}`;

// const worker = new PDFWorker();
// pdfjsLib.GlobalWorkerOptions.workerPort = worker;

fetch(fullUrl)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    const pdfData = new Uint8Array(arrayBuffer);
    pdfjsLib.getDocument({ data: pdfData })
      .promise.then(pdfDocument => {
        // Render the PDF document
        renderPDF(pdfDocument);
      })
      .catch(error => {
        console.error('Error loading PDF:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching PDF:', error);
  });

console.log("Here is the pdfUrl:", pdfUrl)
const viewerContainer = document.getElementById('pdf-viewer');

async function renderPDF(pdfDocument) {
  try {
    // Request the first page
    const pdfPage = await pdfDocument.getPage(1);

    // Create the PDF viewer and render it in the container
    const viewer = new PDFViewer({ container: viewerContainer });
    viewer.setDocument(pdfDocument);

    const viewport = pdfPage.getViewport({ scale: 1.0 });
    viewer.width = viewport.width;
    viewer.height = viewport.height;

    const ctx = viewer.getContext("2d");
    const renderContext = {
      viewerContext: ctx,
      viewport: viewport,
    };

    // Render the PDF page
    const renderTask = pdfPage.render(renderContext);
    await renderTask.promise;

    // Add event listener for page rendering
    viewer.eventBus.on('pagerendered', () => {
      console.log('Page rendered');
    });
  } catch (error) {
    console.error('Error rendering PDF:', error);
  }
}

console.log('Log from file app.js');
