$(document).ready(function () {
  window.onload = function () {
    onChange();
    if (document.getElementById("mySideinfoCabinet").childNodes.length > 5) {
      document.getElementById("mySideinfoCabinet").style.width = "200px";
    }
  };

  document.getElementById("summary_text").onpaste = function () {
    setTimeout(onPaste, 1);
  };

  $( "#summary_text" ).keyup(function() {
    onChange();
  });

  if (document.getElementById("save_text")) {
    document.getElementById("save_text").addEventListener("click", save, false);
  }

  if (document.getElementById("save_pdf")) {
    document
      .getElementById("save_pdf")
      .addEventListener("click", downloadPdf, false);
  }

  if (document.getElementById("copy_text")) {
    document
      .getElementById("copy_text")
      .addEventListener("click", copyMain, false);
  }

  $(".signup-form").submit(function (e) {
    $.post("/signup/", $(this).serialize(), function (data) {
      if (!data.success) {
        data.messages.forEach((message) => addNotification(message));
        if (data.send_activation) {
          $(".send_activation").css("display", "block");
        }
      } else {
        alert(data.message);
        window.location.href = "/";
      }
    });
    e.preventDefault();
  });

  $(".send_activation").click(function (e) {
    $.post("/send_activation/", $(".signup-form").serialize(), function (data) {
      if (!data.success) {
        data.messages.forEach((message) => addNotification(message));
      } else {
        alert(data.message);
        window.location.href = "/";
      }
    });
    e.preventDefault();
  });

  $(".change_password").click(function (e) {
    $.post("/change_password/", $(".login-form").serialize(), function (data) {
      if (!data.success) {
        data.messages.forEach((message) => addNotification(message));
      } else {
        alert(data.message);
        window.location.href = "/";
      }
    });
    e.preventDefault();
  });

  $(".login-form").submit(function (e) {
    $.post("/login/", $(this).serialize(), function (data) {
      if (!data.success) {
        addNotification(data.message);
        if (data.forget_password) {
          $(".change_password").css("display", "block");
        }
      } else {
        window.location.href = "/";
      }
    });
    e.preventDefault();
  });

  $("#id_number_of_percent").change(function () {
    screenNumberOfSentences();
  });

  function screenNumberOfSentences(countOnly = false) {
    let text = document.getElementById("summary_text").value;
    if (!text) return 0;
    let sentences_in_text = text.match(/[^\.!\?]+[\.!\?]+["']?|.+$/g).length;
    let percent = document.getElementById("id_number_of_percent").value;
    let number_of_sentenses = Math.ceil((sentences_in_text * percent) / 100);
    document
      .getElementById("id_number_of_sentence")
      .setAttribute("value", number_of_sentenses);
    if (countOnly) return 0;
    document.getElementById(
      "rangeValue"
    ).innerText = `${percent}% ${number_of_sentenses} sent.`;
    return number_of_sentenses;
  }

  function onPaste() {
    screenNumberOfSentences((countOnly = true));
    $(".summarizeForm").submit();
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

  function save() {
    let form = $(".summarizeForm")[0];
    form.action = "save/";
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

  function onChange() {
    let text_tag = document.getElementById("summary_text");
    if (
      text_tag.getAttribute("maxlength") &&
      text_tag.value.length >= text_tag.getAttribute("maxlength")
    ) {
      addNotification(
        "Ліміт символів досягнуто. Досі не зареєстрований? Зроби це зараз та пресуй більші тексти!"
      );
    }
    screenNumberOfSentences();
  }

  function addNotification(message) {
    var node = document.createElement("div");
    node.classList.add("error");
    node.innerText = message;
    info_block = document.getElementById("insert-before");
    info_block.parentNode.insertBefore(node, info_block.nextSibling);
    document.getElementById("mySideinfoCabinet").style.width = "200px";
  }
});
