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

async function generateCookies() {

  const cookies = [];

  for (const name of cookieNames) {
    const value = await getCookie(name);
    if (value) cookies.push(`${name}=${value}`);
  }

  const cookieHeader = cookies.join("; ");

  document.getElementById("result").value = cookieHeader;
}

document.getElementById("generate").onclick = generateCookies;

document.getElementById("copy").onclick = () => {

  const text = document.getElementById("result").value;

  if (!text) {
    alert("Primeiro gere os cookies.");
    return;
  }

  navigator.clipboard.writeText(text);

  alert("Cookies copiados!");
};