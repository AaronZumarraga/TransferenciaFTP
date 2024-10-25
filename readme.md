# **Sistema de Integración de Pólizas de Seguros**

Este proyecto consiste en dos sistemas que interoperan mediante la generación, transferencia y procesamiento de archivos CSV a través de un servidor FTP. Cada sistema tiene una función específica relacionada con la gestión de pólizas de seguros: **Sistema1** genera los archivos con datos de pólizas, mientras que **Sistema2** revisa estos archivos y los procesa para indicar si las pólizas han sido aprobadas o no.

## **Tabla de Contenidos**
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Servidor FTP](#servidor-ftp)
- [Contribución](#contribución)

## **Descripción del Proyecto**

El sistema de integración de pólizas de seguros consta de dos módulos:
1. **Sistema1**: Genera archivos CSV que contienen información de pólizas de seguros y los sube a un servidor FTP.
2. **Sistema2**: Descarga los archivos CSV desde el servidor FTP, revisa las pólizas, y genera un nuevo archivo CSV con el estado de aprobación de cada póliza. Luego, sube este archivo revisado nuevamente al servidor FTP.

### **Tecnologías Utilizadas**
- Node.js
- FTP (con `basic-ftp`)
- Dotenv (para la gestión de variables de entorno)
- Faker.js (para generar datos ficticios)
- Moment.js (para formateo de fechas)
- CSV Writer (para generación de archivos CSV)
- CSV Parser (para lectura de archivos CSV)

## **Requisitos**
Antes de empezar, asegúrate de tener los siguientes requisitos instalados:

- Node.js v14 o superior
- Servidor FTP (se recomienda FileZilla Server)
- Dependencias del proyecto (ver sección de [Instalación](#instalación))

## **Instalación**

1. Clona este repositorio en tu máquina local


2. Instala las dependencias del proyecto utilizando **npm**:

   ```bash
   npm install
   ```

## **Configuración**

El proyecto utiliza variables de entorno para configurar detalles como las credenciales de acceso al servidor FTP. Debes crear un archivo `.env` en la raíz del proyecto y definir las siguientes variables:

```bash
FTP_HOST=127.0.0.1
FTP_USER=prueba
FTP_PASSWORD=prueba
FTP_PORT=21
```

### **Estructura del Servidor FTP**
- El **Virtual Path** `/prueba` está asociado a la ruta nativa `C:\Users\AarónZumárraga\Downloads\IS_seguros_globales-main\IS_seguros_globales-main`. Este directorio se utiliza para subir los archivos generados por **Sistema1**.
- El **Virtual Path** `/uploaded` está asociado a la ruta nativa `C:\Users\AarónZumárraga\Downloads\IS_consultora-main\IS_consultora-main\filesToReview`. Este directorio se utiliza para los archivos revisados por **Sistema2**.

## **Ejecución**

### **Ejecutar Sistema1**
Este sistema genera un archivo CSV con los datos de las pólizas y lo sube al servidor FTP en la ruta `/prueba`.

```bash
node sistema1.js
```

Salida esperada:
```
El archivo CSV se ha generado localmente en: ./files/YYYY-MM-DD.csv
Iniciando el proceso de envío del archivo al servidor FTP...
Conexión FTP exitosa
Archivo enviado correctamente por FTP a: /prueba/YYYY-MM-DD.csv
Cliente FTP cerrado
```

### **Ejecutar Sistema2**
Este sistema descarga el archivo CSV de pólizas desde el servidor FTP, lo procesa, y sube un archivo revisado a la ruta `/uploaded`.

```bash
node sistema2.js
```

Salida esperada:
```
Conectando al servidor FTP para descargar el archivo de revisión...
Archivo descargado con éxito desde el servidor FTP a: ./filesToReview/output.csv
Iniciando la revisión de las pólizas descargadas...
Revisión completada. El archivo con el estado de las políticas ha sido generado.
Iniciando el proceso de envío del archivo revisado al servidor FTP...
Archivo revisado enviado correctamente al servidor FTP.
```

## **Estructura del Proyecto**

```
├── files/                   # Archivos CSV generados por Sistema1
├── reviewedFiles/            # Archivos CSV revisados por Sistema2
├── filesToReview/            # Directorio donde Sistema2 almacena los archivos descargados
├── sistema1.js               # Código de Sistema1 (generación y subida de pólizas)
├── sistema2.js               # Código de Sistema2 (descarga, revisión y subida de pólizas)
├── codeGenerator.js          # Módulo auxiliar para generar códigos de pólizas
├── .env                      # Variables de entorno
├── package.json              # Dependencias del proyecto
```

## **Servidor FTP**

Se utiliza un servidor **FileZilla FTP** para manejar la transferencia de archivos entre los sistemas. Asegúrate de tener configurados los siguientes **virtual paths** en el servidor:

- **/prueba**: Mapea a `C:\Users\AarónZumárraga\Downloads\IS_seguros_globales-main\IS_seguros_globales-main`
- **/uploaded**: Mapea a `C:\Users\AarónZumárraga\Downloads\IS_consultora-main\IS_consultora-main\filesToReview`

### **Configuración de FileZilla**

1. **Agregar Virtual Paths**:
   - `/prueba` → `C:\Users\AarónZumárraga\Downloads\IS_seguros_globales-main\IS_seguros_globales-main`
   - `/uploaded` → `C:\Users\AarónZumárraga\Downloads\IS_consultora-main\IS_consultora-main\filesToReview`

2. **Credenciales**:
   - Usuario: `prueba`
   - Contraseña: `prueba`

3. **Puerto**: El puerto del servidor FTP es `21` y se utiliza una conexión **segura (FTPS)** con verificación de certificado autofirmado deshabilitada.

