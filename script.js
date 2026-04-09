let selectedFile = null;
const BASE_URL = "https://cloudnest.onrender.com";
// 1️⃣ First: just store the file when user selects it
document.getElementById("fileInput").addEventListener("change", function () {
  if (this.files.length > 0) {
    selectedFile = this.files[0];
    document.querySelector(".unique-code").innerText =
      "File selected — click Upload";
  }
});

// 2️⃣ Second: upload ONLY when button is clicked
async function uploadFile() {
  if (!selectedFile) {
    document.querySelector(".unique-code").innerText =
      "Select a file first";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    document.querySelector(".unique-code").innerText = "Uploading...";

    const response = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.code) {
      document.querySelector(".unique-code").innerText =
        "Your Code: " + data.code;
    } else {
      document.querySelector(".unique-code").innerText =
        "Upload failed";
    }

  } catch (error) {
    document.querySelector(".unique-code").innerText =
      "Server error — start backend";
  }
}

function fetchFile() {
  const code = document.querySelector(".code-fetch").value.trim();
  if (!code) {
    alert("Enter a code to fetch the file");
    return;
  }
  window.location.href = `${BASE_URL}/download/${code}`;
  
}
// Optional copy button
function copyCode() {
  const text = document.querySelector(".unique-code").innerText;
  if (text.includes("Your Code:")) {
    navigator.clipboard.writeText(text.replace("Your Code: ", ""));
  }
}
