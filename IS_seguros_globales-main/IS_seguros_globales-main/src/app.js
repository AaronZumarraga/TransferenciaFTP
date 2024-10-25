import dotenv from 'dotenv';
import { createObjectCsvWriter } from 'csv-writer';
import { faker } from '@faker-js/faker';
import moment from 'moment-timezone';
import { generateCode } from './codeGenerator.js';
import * as ftp from 'basic-ftp';
import os from 'os';

// Cargar variables de entorno
dotenv.config();

const csvWriter = createObjectCsvWriter({
  path: `./files/${moment(new Date()).local().format('YYYY-MM-DD')}.csv`,
  header: [
    { id: 'poliza', title: 'Poliza' },
    { id: 'monto', title: 'Monto' },
    { id: 'fecha', title: 'Fecha' },
    { id: 'descripcion', title: 'Descripcion' },
  ]
});

const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function sendFileByFTP(filePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    // Conexión al servidor FTP
    await client.access({
      host: "127.0.0.1", // Cargar desde las variables de entorno
      user: "prueba", // Cargar desde las variables de entorno
      password: "prueba", // Cargar desde las variables de entorno
      secure: true, // Intenta usar conexión segura
      secureOptions: {
        rejectUnauthorized: false // Ignorar la verificación del certificado autofirmado
      },
      port: 21
    });
    console.log("Conexión FTP exitosa");

    // Verifica y crea el directorio si no existe
    await client.ensureDir('/prueba/');

    // Define la ruta de destino para el archivo subido
    const remoteFilePath = `/prueba/${filePath.split('/').pop()}`;

    // Intenta subir el archivo
    await client.uploadFrom(filePath, remoteFilePath);
    console.log("Archivo enviado correctamente por FTP a:", remoteFilePath);

  } catch (error) {
    console.error("Error en el envío FTP:", error.message);
    if (error.code) {
      console.error("Código de error:", error.code);
    }
  } finally {
    client.close();
    console.log("Cliente FTP cerrado");
  }
}

export const createPoliza = async () => {
  try {
    const poliza = {
      poliza: generateCode(5),
      monto: getRandomAmount(1000, 10000),
      fecha: moment(faker.date.past()).format('DD/MM/YYYY HH:mm:ss'),
      descripcion: faker.lorem.sentence(),
    };

    const filePath = `./files/${moment(new Date()).local().format('YYYY-MM-DD')}.csv`;

    await csvWriter.writeRecords([poliza]);
    console.log(`El archivo CSV se ha generado localmente en: ${filePath}`);

    // Enviar archivo por FTP
    console.log('Iniciando el proceso de envío del archivo al servidor FTP...');
    await sendFileByFTP(filePath);
    console.log('Proceso completo: archivo enviado al servidor FTP para su revisión.');
  } catch (error) {
    console.error("Error al generar o enviar el archivo:", error);
  }
};


// Ejecutar la función
createPoliza();
