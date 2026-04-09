const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs-extra");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.static(__dirname));

fs.ensureDirSync("client_uploads");

// store files in "uploads" folder
const storage = multer.diskStorage({
  destination: "client_uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// keep mapping: code -> filename
const FILE = "fileCodes.json";
let codeMap = {};

if (fs.existsSync(FILE)) {
  codeMap = fs.readJsonSync(FILE);
}

// generate unique 6-digit code
function generateUniqueCode() {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (codeMap[code]);   // avoid duplicates
  return code;
}

// API to upload file + get code
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const code = generateUniqueCode();

  // save mapping
  codeMap[code] = req.file.filename;
  fs.writeJsonSync(FILE, codeMap);

  res.json({
    code: code,
    message: "File uploaded successfully"
  });
});

// API to download file using code
app.get("/download/:code", (req, res) => {
  const code = req.params.code;

  if (!codeMap[code]) {
    return res.status(404).json({ error: "Invalid code" });
  }

  const filepath = "client_uploads/" + codeMap[code];
  res.download(filepath);
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

