const fs = require("fs");
const path = require("path");

const STOCKS_DIR = path.join(__dirname, "..", "stocks");

if (!fs.existsSync(STOCKS_DIR)) fs.mkdirSync(STOCKS_DIR, { recursive: true });

/**
 * Turns arbitrary user input ("Disney Plus") into a safe, consistent
 * key used for both the filename and the service's display name
 * ("disney-plus").
 */
function sanitizeServiceName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

function getFilePath(service) {
  return path.join(STOCKS_DIR, `${sanitizeServiceName(service)}.txt`);
}

function serviceExists(service) {
  return fs.existsSync(getFilePath(service));
}

/** Creates an empty stock file for a new service. Returns false if it already exists. */
function createService(service) {
  const filePath = getFilePath(service);
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, "", "utf-8");
  return true;
}

/** Deletes a service's stock file entirely. */
function deleteService(service) {
  const filePath = getFilePath(service);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

/**
 * Returns the list of available service keys by reading the /stocks
 * folder directly — there is no in-memory cache, so this is always
 * fresh and is also why /reload doesn't need any special logic for it.
 */
function listServices() {
  if (!fs.existsSync(STOCKS_DIR)) return [];
  return fs
    .readdirSync(STOCKS_DIR)
    .filter((f) => f.endsWith(".txt"))
    .map((f) => f.replace(/\.txt$/, ""));
}

/** Reads all non-empty lines (accounts) currently in a service's file. */
function readLines(service) {
  const filePath = getFilePath(service);
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function getStockCount(service) {
  return readLines(service).length;
}

/** Appends one or more lines (accounts) to a service's stock file. Returns count added. */
function addStock(service, lines) {
  const filePath = getFilePath(service);
  if (!fs.existsSync(filePath)) return false;

  const cleanLines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
  if (cleanLines.length === 0) return 0;

  const current = readLines(service);
  const updated = [...current, ...cleanLines];
  fs.writeFileSync(filePath, updated.join("\n") + "\n", "utf-8");
  return cleanLines.length;
}

/** Wipes all stock for a service while keeping the file (and service) intact. */
function clearStock(service) {
  const filePath = getFilePath(service);
  if (!fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, "", "utf-8");
  return true;
}

/**
 * Removes and returns the first available account ("pops" one line).
 * Synchronous fs calls are used deliberately: Node never interleaves
 * sync I/O, so two /gen commands firing at the same instant still
 * can't both grab the same line.
 */
function popStock(service) {
  const lines = readLines(service);
  if (lines.length === 0) return null;

  const account = lines.shift();
  const filePath = getFilePath(service);
  fs.writeFileSync(filePath, lines.length ? lines.join("\n") + "\n" : "", "utf-8");
  return account;
}

module.exports = {
  STOCKS_DIR,
  sanitizeServiceName,
  serviceExists,
  createService,
  deleteService,
  listServices,
  readLines,
  getStockCount,
  addStock,
  clearStock,
  popStock,
};
