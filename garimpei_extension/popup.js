const cookieNames = [
  "ssid",
  "_d2id",
  "_csrf",
  "x-meli-session-id",
  "ftid"
];

function getCookie(name) {
  return new Promise(resolve => {
    chrome.cookies.get(
      {
        url: "https://www.mercadolivre.com.br",
        name: name
      },
      cookie => resolve(cookie ? cookie.value : null)
    );
  });
}

async function collectCookies() {

  const cookies = [];

  for (const name of cookieNames) {
    const value = await getCookie(name);
    if (value) cookies.push(`${name}=${value}`);
  }

  return cookies.join("; ");
}

async function checkPage() {

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  const url = tabs[0].url;

  const status = document.getElementById("status");

  if (!url.includes("mercadolivre.com.br")) {

    status.innerHTML = `
<div class="status-dot error"></div>
<span>Abra o Mercado Livre logado</span>
`;

    return false;
  }

  if (!url.includes("/afiliados")) {

    status.innerHTML = `
<div class="status-dot error"></div>
<span>Abra a página de afiliados</span>
`;

    return false;
  }

  status.innerHTML = `
<div class="status-dot ok"></div>
<span>Sessão detectada</span>
`;

  return true;

}

async function init() {

  const valid = await checkPage();

  if (!valid) return;

  const cookieHeader = await collectCookies();

  document.getElementById("result").textContent = cookieHeader;

}

document.getElementById("copy").onclick = () => {

  const text = document.getElementById("result").textContent;

  if (!text) return;

  navigator.clipboard.writeText(text);

  const copied = document.getElementById("copied");

  copied.classList.add("show");

  setTimeout(() => {
    copied.classList.remove("show");
  }, 2000);

};

init();