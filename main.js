const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
const { createServer } = require('http');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();

  // Configurar la URL del servidor donde se encuentran las actualizaciones
  autoUpdater.setFeedURL('http://tu-servidor.com/actualizaciones');

  // Comprobar actualizaciones cada 10 minutos
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 10 * 60 * 1000);

  // Evento que se dispara cuando una actualización está disponible para descargar
  autoUpdater.on('update-available', () => {
    // Mostrar una ventana de diálogo al usuario
    const response = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      title: 'Nueva versión disponible',
      message: 'Una nueva versión de la aplicación ha sido descargada. ¿Desea reiniciar ahora?',
      buttons: ['Reiniciar ahora', 'Más tarde']
    });

    if (response === 0) {
      // Reiniciar la aplicación para aplicar la actualización
      autoUpdater.quitAndInstall();
    }
  });

  // Evento que se dispara cuando la actualización se descarga y está lista para instalar
  autoUpdater.on('update-downloaded', () => {
    // Mostrar una notificación al usuario informando que la actualización está lista para instalar
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización lista',
      message: 'La nueva versión ha sido descargada y está lista para instalar. La aplicación se reiniciará.'
    }).then(() => {
      // Reiniciar la aplicación para aplicar la actualización
      autoUpdater.quitAndInstall();
    });
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});