const upload = document.getElementById("upload");
const previewImg = document.getElementById("previewImg");
const qualityInput = document.getElementById("qualityInput");
const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");
const info = document.getElementById("info");

let originalFile;
let img = new Image();

upload.addEventListener("change", e => {
  originalFile = e.target.files[0];
  if (!originalFile) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
    previewImg.style.display = "block";
    img.src = reader.result;
  };
  reader.readAsDataURL(originalFile);
});

processBtn.addEventListener("click", () => {
  if (!originalFile) {
    alert("Please upload an image first");
    return;
  }

  let quality = parseInt(qualityInput.value);

  if (isNaN(quality) || quality < 1 || quality > 100) {
    alert("Please enter image quality between 1 and 100");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob(
    blob => {
      const newUrl = URL.createObjectURL(blob);
      downloadBtn.href = newUrl;
      downloadBtn.download = `quality_${quality}_${originalFile.name}`;
      downloadBtn.style.display = "inline-block";

      info.innerHTML = `
        Original Size: ${(originalFile.size / 1024).toFixed(1)} KB<br>
        New Size: ${(blob.size / 1024).toFixed(1)} KB<br>
        Dimensions: ${img.width} × ${img.height}
      `;
    },
    "image/jpeg",
    quality / 100
  );
});
