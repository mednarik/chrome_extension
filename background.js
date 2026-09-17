chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: copyContentHTML
  });
});

function copyContentHTML() {
  console.log("copyContentHTML fired");
  const el = document.querySelector(".content");
  console.log("found element:", el);
  if (!el) {
    alert("No element with class 'content' found on this page.");
    return;
  }

  window.focus();

  navigator.clipboard.writeText(el.outerHTML)
    .then(() => {
      const original = el.style.outline;
      el.style.outline = "3px solid limegreen";
      setTimeout(() => (el.style.outline = original), 400);
    })
    .catch((err) => {
      console.error("Clipboard write failed:", err);
      fallbackCopy(el.outerHTML);
    });
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
  } catch (e) {
    console.error("Fallback copy also failed:", e);
  }
  document.body.removeChild(ta);
}