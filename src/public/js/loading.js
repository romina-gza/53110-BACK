const uploadForm = document.getElementById("uploadForm");
const loadingMessage = document.getElementById("loadingMessage");

uploadForm.addEventListener("submit", () => {
  loadingMessage.style.display = "block"; // Mostrar el mensaje de carga
});
