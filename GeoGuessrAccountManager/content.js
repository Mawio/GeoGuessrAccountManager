chrome.runtime.onMessage.addListener(function (request) {
  switch (request.type) {
    case "email":
      var inp = document.forms[0].elements[0];
      inp.value = request.email;
      var ev = new Event("input");
      inp.dispatchEvent(ev);
      setTimeout(function () {
        document
          .getElementsByClassName("button button--medium button--primary")[0]
          .click();
      }, 100);
      confermaEmail(request.email);
      break;
    case "passwords":
      insertPasswords();
      break;
  }
});

function confermaEmail(indirizzo) {
  var temp = indirizzo.split("@");
  var nome = temp[0];
  var domain = temp[1];
  var url =
    "https://www.1secmail.com/api/v1/?action=getMessages&login=" +
    nome +
    "&domain=" +
    domain;
  var fetchNow = function () {
    fetch(url)
      .then((res) => res.json())
      .then((out) => {
        if (out.length != 0) {
          conferma(nome, domain, out[0].id);
        } else fetchNow();
      });
  };

  fetchNow();
}

function conferma(nome, domain, id) {
  var url =
    "https://www.1secmail.com/api/v1/?action=readMessage&login=" +
    nome +
    "&domain=" +
    domain +
    "&id=" +
    id;
  fetch(url)
    .then((res) => res.json())
    .then((out) => {
      htmlText = out.htmlBody;
      var el = document.createElement("html");
      el.innerHTML = htmlText;
      var link = el.getElementsByTagName("a")[0].href;
      chrome.runtime.sendMessage({ type: "confirmLink", url: link });
    });
}

function insertPasswords() {
  var randPassword = Array(10)
    .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
  var inp1 = document.forms[0].elements[0];
  inp1.value = randPassword;
  var ev = new Event("input");
  inp1.dispatchEvent(ev);
  var inp2 = document.forms[0].elements[1];
  inp2.value = randPassword;
  inp2.dispatchEvent(ev);
  setTimeout(function () {
    document
      .getElementsByClassName("button button--medium button--primary")[0]
      .click();
  }, 100);
}
