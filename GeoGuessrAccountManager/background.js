function actionOnUpdate() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].url === "https://www.geoguessr.com/signup") {
      let url =
        "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1";
      fetch(url)
        .then((res) => res.json())
        .then((out) => {
          let emailString = out[0];
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "email",
            email: emailString,
          });
        });
    }
    if (tabs[0].url === "https://www.geoguessr.com/signout?target=%2F") {
      signUp();
    }
    if (
      tabs[0].url.substring(0, 47) ===
      "https://www.geoguessr.com/profile/set-password/"
    ) {
      insertPasswords(tabs);
    }
  });
}

chrome.runtime.onMessage.addListener(function (message) {
  switch (message.type) {
    case "script":
      logOut();
      break;
    case "confirmLink":
      confirmLink(message.url);
      break;
  }
});

function logOut() {
  chrome.tabs.update({ url: "https://www.geoguessr.com/signout?target=%2F" });
}

function signUp() {
  chrome.tabs.update({ url: "https://www.geoguessr.com/signup" });
}

chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === "complete") {
    actionOnUpdate();
  }
});

function confirmLink(url) {
  chrome.tabs.update({ url: url });
}

function insertPasswords(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {
    type: "passwords",
  });
}
