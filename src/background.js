import {app, BrowserWindow, ipcMain, protocol} from 'electron';
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import * as path from "path";
import {Database} from 'sqlite3';

const electron = require('electron');

require('@electron/remote/main').initialize();

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const dbPath = path.join(userDataPath, 'your-database-file.db');
console.log(dbPath);

const db = new Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database: ', err.message);
    return;
  }

  db.serialize(() => {
    // Create the categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        color TEXT)`,
        (err) => {
      if (err) {
        console.error('Error creating categories table: ', err.message);
      } else {
        db.get("SELECT COUNT(*) AS count FROM categories", [], (err, row) => {
          if (err) {
            console.error('Error querying categories table: ', err.message);
          } else if (row.count === 0) {
            const categories = ['Housing', 'Food', 'Transportation', 'Healthcare', 'Entertainment', 'Education', 'Savings', 'Miscellaneous'];
            const colors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE', '#808080'];
            const stmt = db.prepare('INSERT INTO categories (name, type, color) VALUES (?, ?, ?)', (err) => {
              if (err) {
                console.error('Error preparing statement: ', err.message);
                return;
              }
              categories.forEach((category, index) => {
                stmt.run(category, 'expense', colors[index], (err) => {
                  if (err) {
                    console.error('Error inserting row: ', err.message);
                  }
                });
              });
              stmt.finalize((err) => {
                if (err) {
                  console.error('Error finalizing statement: ', err.message);
                }
              });
            });
          }
        });


        // Insert default categories

      }
    });

    // Create the raw_data table with a foreign key reference to the categories table
    db.run(`CREATE TABLE IF NOT EXISTS raw_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE, 
    source TEXT, 
    type TEXT, 
    reason TEXT, 
    balance REAL, 
    amount REAL, 
    currency TEXT, 
    category_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  )`, (err) => {
      if (err) {
        console.error('Error creating raw_data table: ', err.message);
      } else {


      }
    });
  });

});

ipcMain.on('add-raw-data', (event, arg) => {
  const stmt = db.prepare('INSERT INTO raw_data VALUES (?, ?, ?, ?, ?, ?, ?, ?)', (err) => {
    if (err) {
      console.error('Error preparing statement: ', err.message);
      return;
    }
    arg.forEach(row => {
      stmt.run(row['Umsatzanzeige'], row['__parsed_extra'][0], row['__parsed_extra'][1], row['__parsed_extra'][2], row['__parsed_extra'][3], row['__parsed_extra'][5], row['__parsed_extra'][4],null, (err) => {
        if (err) {
          console.error('Error inserting row: ', err.message);
        }
      });
    });
    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement: ', err.message);
      }
    });
  });
});

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }
}

function fetchRawData() {
  return new Promise((resolve, reject) => {
    // Modified SQL query to join with categories table
    db.all(`SELECT raw_data.*, categories.name AS category_name, categories.color AS category_color
            FROM raw_data
            LEFT JOIN categories ON raw_data.category_id = categories.id`,
        [], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        });
  });
}

function fetchCategories(){
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM categories`, [], (err, rows) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(rows);
        });
    });
}

ipcMain.handle('fetch-raw-data', async () => {
  try {
    return await fetchRawData();
  } catch (error) {
    console.error('Error fetching data: ', error.message);
    return [];
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close((err) => {
      if (err) {
        console.error('Error closing database: ', err.message);
      }
    });
    app.quit();
  }
});

app.on('browser-window-created', (_, window) => {
  require("@electron/remote/main").enable(window.webContents);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
