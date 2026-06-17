#!/usr/bin/env node

const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = Number(process.env.ZEBRA_BRIDGE_PORT || 17888);
const PRINTER = process.env.ZEBRA_PRINTER || '';
const IS_WINDOWS = process.platform === 'win32';

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) {
        reject(new Error('الملف كبير جداً'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function listPrinters() {
  return new Promise(resolve => {
    if (IS_WINDOWS) {
      execFile('powershell.exe', [
        '-NoProfile',
        '-Command',
        'Get-CimInstance Win32_Printer | Select-Object Name,ShareName | ConvertTo-Json -Compress'
      ], { timeout: 5000 }, (error, stdout) => {
        if (error) {
          resolve([]);
          return;
        }

        try {
          const parsed = JSON.parse(stdout || '[]');
          const rows = Array.isArray(parsed) ? parsed : [parsed];
          resolve(rows
            .filter(Boolean)
            .map(row => row.ShareName || row.Name)
            .filter(Boolean));
        } catch {
          resolve([]);
        }
      });
      return;
    }

    execFile('lpstat', ['-p'], { timeout: 3000 }, (error, stdout) => {
      if (error) {
        resolve([]);
        return;
      }

      const printers = stdout
        .split('\n')
        .map(line => line.match(/^printer\s+(\S+)/)?.[1])
        .filter(Boolean);
      resolve(printers);
    });
  });
}

async function choosePrinter(requestedPrinter) {
  if (requestedPrinter) return requestedPrinter;
  if (PRINTER) return PRINTER;

  const printers = await listPrinters();
  return printers.find(name => /zebra|zdesigner|gk|gc/i.test(name)) || '';
}

function getWindowsPrinterTarget(printerName) {
  if (!printerName) {
    throw new Error('حدد اسم مشاركة طابعة Zebra في ZEBRA_PRINTER');
  }
  if (printerName.startsWith('\\\\')) return printerName;
  return `\\\\localhost\\${printerName}`;
}

function printRawWindows(filePath, printerName) {
  return new Promise((resolve, reject) => {
    const target = getWindowsPrinterTarget(printerName);
    const command = `copy /B "${filePath}" "${target}"`;
    execFile('cmd.exe', ['/d', '/s', '/c', command], { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout || error.message));
        return;
      }
      resolve((stdout || '').trim());
    });
  });
}

function printRawMac(filePath, printerName) {
  return new Promise((resolve, reject) => {
    const args = [];
    if (printerName) args.push('-d', printerName);
    args.push('-o', 'raw', filePath);

    execFile('lp', args, { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function printRaw(buffer, printerName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(os.tmpdir(), `figs-zebra-${Date.now()}.epl`);
    fs.writeFileSync(filePath, buffer);

    const printJob = IS_WINDOWS
      ? printRawWindows(filePath, printerName)
      : printRawMac(filePath, printerName);

    printJob
      .then(resolve)
      .catch(reject)
      .finally(() => fs.rm(filePath, { force: true }, () => {}));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, {
      ok: true,
      port: PORT,
      printer: PRINTER || null,
      printers: await listPrinters()
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/print') {
    try {
      const body = JSON.parse(await readBody(req));
      if (!body.dataBase64) {
        sendJson(res, 400, { ok: false, error: 'لم يصل ملف الطباعة' });
        return;
      }

      const printerName = await choosePrinter(body.printer || '');
      const buffer = Buffer.from(body.dataBase64, 'base64');
      const job = await printRaw(buffer, printerName);

      sendJson(res, 200, {
        ok: true,
        printer: printerName || 'default',
        job
      });
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error.message || 'تعذر الطباعة'
      });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log(`Zebra local printer bridge is running: http://127.0.0.1:${PORT}`);
  console.log(`Health check: http://127.0.0.1:${PORT}/health`);
  if (IS_WINDOWS) {
    console.log('Windows: share the Zebra printer, then run: set ZEBRA_PRINTER=ShareName && node zebra-local-printer.js');
  } else {
    console.log('macOS/Linux: set printer name if needed: ZEBRA_PRINTER="Printer_Name" node zebra-local-printer.js');
  }
});
