import { Config } from '@mifiel/api-client-auth';
import { ApiClient } from '@mifiel/api-client';
import { Document, Page, Text, View } from '@react-pdf/renderer';

Config.setTokens({
  appId: 'ac08ce2a2022292b96459122b0f7c4cd17f98888',
  appSecret: 'UZcAQtaYwc5yT/mer2Oma2Y44/cQRL4Xev2w+j9uWzePfIvO447SyBi9TfFg2wRtMbKkT6VgNAwfs7wiDL24Vw==',
  env: 'sandbox' // Cambiar a 'production' para ambiente de producción
});

export default async function createPdf() {
  const pdfDoc = (
    <Document>
      <Page>
        <View>
          <Text>Hello, world!</Text>
        </View>
      </Page>
    </Document>
  );

  const pdfBlobUrl = await pdfDoc.toBlobUrl();
  const response = await fetch(pdfBlobUrl);
  const pdfBuffer = await response.arrayBuffer();

  const fileName = 'nombre-del-archivo.pdf'; // Cambiar por el nombre deseado
  const fileHash = await ApiClient.getFileHash(pdfBuffer); // Obtener el hash del archivo
  console.log(fileHash);
  const signCallbackUrl = 'https://tu-sitio.com/mifiel/callback/sign'; // Cambiar por la URL de tu sitio
  const callbackUrl = 'https://tu-sitio.com/mifiel/callback/document'; // Cambiar por la URL de tu sitio

  const response1 = await ApiClient.post('/documents', {
    name: fileName,
    file: Buffer.from(pdfBuffer).toString('base64'),
    file_name: fileName,
    hash: fileHash,
    sign_callback_url: signCallbackUrl,
    callback_url: callbackUrl
  });

  return response1.widget_id;
}
