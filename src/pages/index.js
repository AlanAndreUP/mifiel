import axios from "axios";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import sha256 from "crypto-js/sha256";
import React, { useState } from 'react';
import styles from "../styles/Home.module.css";

const CreatePDFButton = () => {
  const [pdfData, setPdfData] = useState(null);

  const createPDF = () => {
    const doc = new jsPDF();
    doc.text("Hello World!", 10, 10);
    const pdf = doc.output('blob');
    setPdfData(pdf);
  }

  const handleSignDocument = async () => {
    try {
      const hash = sha256(await pdfData.arrayBuffer()).toString();
      const response = await axios.post(
        "https://app-sandbox.mifiel.com/api/v1/documents",
        {
          name: "documento.pdf",
          hash,
          signatories: [
            { email: "ejemplo@mifiel.com", name: "Ejemplo Mifiel" }
          ]
        },
        {
          headers: {
            Authorization: "Bearer rkikmskj6G2ShHwweQMrDanMZiIPa0G4GukuS5ZwddBwCzPyz87gwV3HgT3cKdRicQdQ0hyWPiM1hPdjvn3xaA=="
          }
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={createPDF}>
        Crear PDF
      </button>
      {pdfData && (
        <div>
          <h2 className={styles.title}>Documento para firmar:</h2>
          <iframe src={URL.createObjectURL(pdfData)} />
          <button className={styles.button} onClick={handleSignDocument}>
            Firmar documento
          </button>
        </div>
      )}
    </div>
  );
};
export default CreatePDFButton;