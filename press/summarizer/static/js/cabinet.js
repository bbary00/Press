$(document).ready(function () {
  if (document.getElementById("delete_text")) {
    document
      .getElementById("delete_text")
      .addEventListener("click", _delete, false);
  }

  if (document.getElementById("copy_text")) {
    document
      .getElementById("copy_text")
      .addEventListener("click", copyMain, false);
  }

  if (document.getElementById("save_pdf")) {
    document
      .getElementById("save_pdf")
      .addEventListener("click", downloadPdf, false);
  }

  function _delete() {
    let form = $(".deleteForm")[0];
    form.submit();
  }

  function downloadPdf() {
    let mainText = Array.from(
      document.getElementById("output").children
    ).map((obj) => (obj.className == "main" ? obj.innerText : ""));
    let pdf = mainText.join("\n");
    var printWindow = window.open("", "", "height=400,width=800");
    printWindow.document.write("<html><head><title>PRESS</title>");
    printWindow.document.write("</head><body >");
    printWindow.document.write(pdf);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  }

  function copyMain() {
    let mainText = Array.from(
      document.getElementById("output").children
    ).map((obj) => (obj.className == "main" ? obj.innerText : ""));
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = mainText.join("\n");
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Copied!");
  }
});
