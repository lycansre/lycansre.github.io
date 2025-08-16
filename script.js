const langData = {
  ar: {
    title: "محول الملفات إلى PDF",
    drop: "اسحب الملفات هنا أو انقر للاختيار",
    converting: "جاري التحويل...",
    done: "تم التحويل!",
    langButton: "English"
  },
  en: {
    title: "File to PDF Converter",
    drop: "Drag & drop files here or click to choose",
    converting: "Converting...",
    done: "Done!",
    langButton: "العربية"
  }
};

let currentLang = "ar";

const title = document.getElementById("title");
const dropText = document.getElementById("drop-text");
const langToggle = document.getElementById("langToggle");
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const progress = document.getElementById("progress");

// Language toggle
langToggle.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyLang();
});

function applyLang() {
  title.textContent = langData[currentLang].title;
  dropText.textContent = langData[currentLang].drop;
  langToggle.textContent = langData[currentLang].langButton;
  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
}
applyLang();

// File handling
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFiles);

["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropArea.classList.add("highlight");
  });
});
["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove("highlight"));
});
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  [...files].forEach(file => convertToPDF(file));
}

async function convertToPDF(file) {
  progress.textContent = `${langData[currentLang].converting} (${file.name})`;

  const { jsPDF } = window.jspdf;

  if (file.type === "application/pdf") {
    downloadFile(file, file.name); // already pdf
  } else if (file.type === "image/png" || file.type === "image/jpeg") {
    const reader = new FileReader();
    reader.onload = () => {
      const pdf = new jsPDF();
      pdf.addImage(reader.result, "JPEG", 10, 10, 180, 160);
      pdf.save(file.name.replace(/\.[^/.]+$/, "") + ".pdf");
    };
    reader.readAsDataURL(file);
  } else if (file.type === "text/plain") {
    const text = await file.text();
    html2pdf().from(`<pre>${text}</pre>`).save(file.name + ".pdf");
  } else if (file.name.endsWith(".md")) {
    const text = await file.text();
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);
    html2pdf().from(html).save(file.name.replace(".md", ".pdf"));
  } else if (file.name.endsWith(".docx")) {
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await window.mammoth.extractRawText({ arrayBuffer: reader.result });
      html2pdf().from(`<pre>${result.value}</pre>`).save(file.name.replace(".docx", ".pdf"));
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Unsupported file type: " + file.type);
  }

  progress.textContent = langData[currentLang].done;
}

function downloadFile(file, filename) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
