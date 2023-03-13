import axios from 'axios';

export default function DocumentCallback() {
  const handleCallback = async (event) => {
    const document = event.detail;

    if (document.status === 'signed') {
      // Si el documento ha sido firmado, descarga el archivo firmado y el archivo XML
      const responseSigned = await axios.get(`https://app-sandbox.mifiel.co/api/v1/documents/${document.id}/signed_file`, {
        headers: {
          'Authorization': 'Bearer f03cb83dde2941b14fd0e63541e852a9054201e8:eMgbtmS6BVmF7O8lINhxpeylTt0JccJBXorc9YfCXfduRb7wEUXYgCMGT0doL+55Wodwk8kA+yO312X0n8FK6A=='
        },
        responseType: 'arraybuffer'
      });

      const responseXml = await axios.get(`https://app-sandbox.mifiel.co/api/v1/documents/${document.id}/xml_file`, {
        headers: {
          'Authorization': 'Bearer f03cb83dde2941b14fd0e63541e852a9054201e8:eMgbtmS6BVmF7O8lINhxpeylTt0JccJBXorc9YfCXfduRb7wEUXYgCMGT0doL+55Wodwk8kA+yO312X0n8FK6A=='
        },
        responseType: 'arraybuffer'
      });

      // Guarda los archivos en el servidor
      const signedDocumentFile = 'ruta/al/archivo/firmado.pdf'; // Cambia esto por la ruta donde guardes el archivo firmado
      const xmlFile = 'ruta/al/archivo/xml.xml'; // Cambia esto por la ruta donde guardes el archivo XML

      require('fs').writeFileSync(signedDocumentFile, responseSigned.data);
      require('fs').writeFileSync(xmlFile, responseXml.data);

      // Une el PDF y el XML usando pdftk
      const { spawnSync } = require('child_process');
      spawnSync('pdftk', [signedDocumentFile, 'attach_files', xmlFile, 'output', signedDocumentFile]);

      console.log('Documento firmado descargado y unido al XML');
    }
  };

  return (
    <div>
      <h1>Callback de Documento</h1>
      <p>Esta página recibirá el callback de documento firmado de Mifiel y descargará el archivo firmado y el archivo XML para unirlos.</p>
      <div id="mifiel-callbacks"></div>
      <script src="https://widget.mifiel.com/mifiel-widget-2.0.0.js"></script>
      <script>
       
      </script>
    </div>
  );
}
