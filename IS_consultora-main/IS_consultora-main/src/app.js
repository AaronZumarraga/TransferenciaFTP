import dotenv from 'dotenv'; // Asegúrate de importar dotenv
import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import * as ftp from 'basic-ftp';
import os from 'os';

// Cargar variables de entorno
dotenv.config();

const csvWriter = createObjectCsvWriter({
  path: './reviewedFiles/output.csv',
  header: [
    { id: 'poliza', title: 'Poliza' },
    { id: 'monto', title: 'Monto' },
    { id: 'fecha', title: 'Fecha' },
    { id: 'descripcion', title: 'Descripcion' },
    { id: 'aprobado', title: 'Aprobado' },
  ]
});

const pathFileToReview = './filesToReview/output.csv';
const systemUser = os.userInfo().username;

async function downloadFileByFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: "127.0.0.1",
      user: "prueba",
      password: "prueba", // Usar la variable de entorno
      secure: true,
      secureOptions: {
        rejectUnauthorized: false // Ignorar la verificación del certificado
      },
      port: 21
    });
    console.log("Conexión FTP exitosa");

    // Descargar el archivo
    await client.downloadTo(pathFileToReview, `uploaded/${pathFileToReview.split('/').pop()}`);
    console.log("Archivo recibido correctamente por FTP");

  } catch (error) {
    console.error("Error en la recepción FTP:", error);
  } finally {
    client.close(); // Asegurarse de cerrar el cliente FTP
  }
}

async function uploadFileByFTP(filePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: "127.0.0.1",
      user: "prueba",
      password: "prueba", // Usar la variable de entorno
      secure: true,
      secureOptions: {
        rejectUnauthorized: false // Ignorar la verificación del certificado
      },
      port: 21
    });
    console.log("Conexión FTP exitosa para subir el archivo");

    // Subir el archivo
    await client.uploadFrom(filePath, `uploaded/${filePath.split('/').pop()}`);
    console.log("Archivo enviado correctamente por FTP");

  } catch (error) {
    console.error("Error en el envío FTP:", error);
  } finally {
    client.close(); // Asegurarse de cerrar el cliente FTP
  }
}

export const reviewPolicies = async () => {
  const results = [];
  const recordsToCSV = [];

  try {
    console.log('Conectando al servidor FTP para descargar el archivo de revisión...');
    await downloadFileByFTP();
    console.log(`Archivo descargado con éxito desde el servidor FTP a: ${pathFileToReview}`);

    fs.createReadStream(pathFileToReview)
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log('Iniciando la revisión de las políticas descargadas...');

        for (const { Poliza, Monto, Fecha, Descripcion } of results) {
          const mustAccept = Math.random() > 0.5;
          const newRow = {
            poliza: Poliza,
            monto: Monto,
            fecha: Fecha,
            descripcion: Descripcion,
            aprobado: mustAccept ? 'APROBADO' : 'NO APROBADO'
          };

          recordsToCSV.push(newRow);
        }

        await csvWriter.writeRecords(recordsToCSV);
        console.log('Revisión completada. El archivo con el estado de las políticas ha sido generado.');

        // Subir el archivo procesado de vuelta al servidor FTP
        console.log('Iniciando el proceso de envío del archivo revisado al servidor FTP...');
        await uploadFileByFTP('./reviewedFiles/output.csv');
        console.log('Archivo revisado enviado correctamente al servidor FTP.');
      });
  } catch (error) {
    console.error("Error durante la revisión o procesamiento del archivo:", error);
  }
};


reviewPolicies();
