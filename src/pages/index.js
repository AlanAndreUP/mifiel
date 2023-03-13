import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import Script from 'next/script'
let idD= "";
let pdfBytes;
export default function Home()  {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
 
  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 500]);
    const { width, height } = page.getSize();

    const fontSize = 50;
    page.drawText('Hello, World!a', {
      x: width / 2 - fontSize,
      y: height / 2,
      size: fontSize,
    });

    pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    setPdfBlob(pdfBlob);
  };

  const createDocument = async () => {
    setIsLoading(true);
    setErrorMessage(null);
  
    try {
      await generatePdf();
  
      const url = 'https://app-sandbox.mifiel.com/api/v1/documents';
  
      const formData = new FormData();
      formData.append('file', pdfBlob, 'example.pdf');
      formData.append(
        'signatories',
        JSON.stringify([
          {
            email: 'usuario1@example.com'
          },
        ])
      );
  
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        auth: {
          username: '013b36e5461d2f3f38aacce7a57d08b7e7fde494',
          password: '7LwWew2qx9kAvfQyODuKrCDjaKQ1b+AsG0iLwdey2E7gmUJ9txhIttOfdp40w481FJ7AOU3CCtLeydCMDi2YMg=='
        },
      });
  
     // const widgetId = await getWidgetId(response.data.id);
  
      setIsLoading(false);
      setErrorMessage(null);
      console.log(response.data.id);
      console.log(response.data.signers[0].widget_id);
       idD = response.data.id;
      
      
     
  
      return response.data.signers[0].widget_id;
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const handleDocumentSigned = async () => {
    const url = `https://app-sandbox.mifiel.com/api/v1/documents/${idD}`;
  
    // Obtener el PDF firmado
    const signedPdfBytes = await axios.get(`${url}/file_signed?download=true`, {
      auth: {
        username: '013b36e5461d2f3f38aacce7a57d08b7e7fde494',
        password: '7LwWew2qx9kAvfQyODuKrCDjaKQ1b+AsG0iLwdey2E7gmUJ9txhIttOfdp40w481FJ7AOU3CCtLeydCMDi2YMg=='
  
      },
      responseType: 'arraybuffer',
    });
    const signedPdfDoc = await PDFDocument.load(signedPdfBytes.data);
  
    // Obtener el XML
    const xmlResponse = await axios.get(`${url}/xml?download=true`, {
      auth: {
        username: '013b36e5461d2f3f38aacce7a57d08b7e7fde494',
        password: '7LwWew2qx9kAvfQyODuKrCDjaKQ1b+AsG0iLwdey2E7gmUJ9txhIttOfdp40w481FJ7AOU3CCtLeydCMDi2YMg=='
  
      },
    });
    const xml = xmlResponse.data;
    // Cargar el PDF original
    const originalPdfDoc = await PDFDocument.load(pdfBytes);


    // Agregar las páginas del PDF original al nuevo PDF
// Unir el PDF original con el PDF firmado
// Crear nuevo documento PDF
const newPdfDoc = await PDFDocument.create();

const originalPages = originalPdfDoc.getPages(); // Obtener las páginas del PDF original

for (const page of originalPages) {
  const copiedPage = await newPdfDoc.copyPages(signedPdfDoc, [page.index]);
  newPdfDoc.addPage(copiedPage[0]);
}

    // Agregar las páginas del PDF firmado al nuevo PDF
    const { pages: signedPages } = signedPdfDoc;
    for (const page of signedPages) {
      const copiedPage = await newPdfDoc.copyPages(signedPdfDoc, [page.index]);
      newPdfDoc.addPage(copiedPage[0]);
    }
    // Actualizar el contenido del XML
    const base64Pdf = Buffer.from(newPdfDoc).toString('base64');
    const xmlWithPdf = xml.replace(/<file>(.*?)<\/file>/s, `<file>${base64Pdf}</file>`);
  
    // Descargar el XML actualizado
    const xmlBlob = new Blob([xmlWithPdf], { type: 'text/xml' });
    const xmlUrl = URL.createObjectURL(xmlBlob);
    const xmlLink = document.createElement('a');
    xmlLink.href = xmlUrl;
    xmlLink.download = 'example-signed.xml';
    xmlLink.click();
  };
  
  
  
  const showSignatureWidget = async (widgetId, pdfBlob) => {
    const pdfBase64 = await blobToBase64(pdfBlob);

    window.mifiel.widget({
      widgetId: widgetId,
      pdf: pdfBase64,
      appendTo: 'signature-widget',
      successBtnText: 'Proceed to next step',

      onSuccess: {
        callToAction: function () {
          alert('documento firmado');
          handleDocumentSigned();
        },
      },
      onError: {
        callToAction: 'https://www.mifiel.com',
      },
    });
    
    
  };
  
  const handleCreatePdf = async () => {
    const widgetId = await createDocument();
     console.log(widgetId);
     console.log(idD);
    if (widgetId) {
      const widgetDiv = document.createElement('div');
      widgetDiv.id = 'signature-widget';
      document.body.appendChild(widgetDiv);
      showSignatureWidget(widgetId, pdfBlob);
    }
  };return (
    <div>
      <h1>Generar pdf de ejemplo</h1>
      <button onClick={handleCreatePdf}>Crear pdf y enviarlo</button>
      {pdfBlob && (
        <a href={URL.createObjectURL(pdfBlob)} download="example.pdf">
          Download PDF
        </a>
      )}
      <div id="signature-widget"></div>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
      <Script src="https://app-sandbox.mifiel.com/sign-snippet-v1.0.0.min.js" />
    </div>
  );
      }
  