const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

// Keep reference to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    title: 'Roster Dataslate — 11th Edition',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#0f0f0f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow localStorage to work properly
      partition: 'persist:40k-analyzer',
    },
    show: false, // Don't show until ready
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Show when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Analysis',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.executeJavaScript(
            "document.querySelector('[onclick=\"showTab(\\\'paste\\\')\"]').click(); document.getElementById('roster-input').value='';"
          )
        },
        { type: 'separator' },
        {
          label: 'Export Library',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow?.webContents.executeJavaScript('exportLibrary()')
        },
        {
          label: 'Import Library',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow?.webContents.executeJavaScript('importLibrary()')
        },
        { type: 'separator' },
        { role: 'quit', label: 'Quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { type: 'separator' },
        { role: 'zoomIn',  label: 'Zoom In',  accelerator: 'CmdOrCtrl+=' },
        { role: 'zoomOut', label: 'Zoom Out', accelerator: 'CmdOrCtrl+-' },
        { role: 'resetZoom', label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Full Screen' },
      ]
    },
    {
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools', label: 'Toggle DevTools', accelerator: 'F12' }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
