/* Medalanda Banana Nursery - Firebase Realtime Database */

const $ = id => document.getElementById(id);
const ROOT = "banana_nursery";

let db, auth, batches = {}, sales = {}, applications = {}, team = {};

const today = new Date().toISOString().slice(0, 10);

["pottingDate", "saleDate", "appDate"].forEach(id => {
  if ($(id)) $(id).value = today;
});

function readyConfig() {
  return typeof firebaseConfig !== "undefined" &&
    firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PASTE_") &&
    firebaseConfig.appId && !firebaseConfig.appId.includes("PASTE_");
}

if (!readyConfig()) {
  $("loginMsg").textContent =
    "Firebase config එක සම්පූර්ණ නැහැ. firebase-config.js තුළ Firebase Console එකෙන් ලබාගත් apiKey සහ appId දාන්න.";
} else {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

    auth = firebase.auth();
    db = firebase.database();

    auth.onAuthStateChanged(user => {
      $("loginView").classList.toggle("hidden", !!user);
      $("appView").classList.toggle("hidden", !user);

      if (user) startApp();
    });

  } catch (err) {
    $("loginMsg").textContent =
      "Firebase ආරම්භ කිරීමේ දෝෂයක්: " + err.message;
  }
}

$("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!auth) {
    $("loginMsg").textContent =
      "Login කිරීමට පෙර firebase-config.js හි Firebase Web App config එක සම්පූර්ණ කරන්න.";
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(
      $("email").value.trim(),
      $("password").value
    );
  } catch (err) {
    $("loginMsg").textContent = err.message;
  }
});

$("logoutBtn").onclick = () => auth.signOut();

function path(p) {
  return db.ref(`${ROOT}/${p}`);
}

function notify(msg, error = false) {
  $("notice").textContent = msg;
  $("notice").classList.remove("hidden");
  $("notice").classList.toggle("error", error);

  setTimeout(() => $("notice").classList.add("hidden"), 4500);
}

function values(obj) {
  return Object.entries(obj || {}).map(([id, v]) => ({ id, ...v }));
}

function fmt(n) {
  return Number(n || 0).toLocaleString("en-US");
}

function dateAdd(d, days) {
  let x = new Date(d + "T12:00:00");
  x.setDate(x.getDate() + days);
  return x.toISOString().slice(0, 10);
}

function startApp() {
  path("batches").on("value", s => {
    batches = s.val() || {};
    render();
  });

  path("sales").on("value", s => {
    sales = s.val() || {};
    render();
  });

  path("applications").on("value", s => {
    applications = s.val() || {};
    render();
  });

  path("team").on("value", s => {
    team = s.val() || {};
    render();
  });
}

function batchStock(b) {
  return Number(b.initialCount || 0) +
    Number(b.adjustmentTotal || 0) -
    Number(b.soldTotal || 0);
}

/* ========================================
   PROPAGATOR COUNTER
   එක් Batch එකක් = භාවිතයේ ඇති Propagator එකක්
   උපරිම Propagator ගණන = 3
======================================== */

function usedPropagators() {
  return values(batches).filter(b => b.stage === "Propagator").length;
}

function freePropagators() {
  return Math.max(0, 3 - usedPropagators());
}

function batchDisplayLabel(b) {
  const duplicates = values(batches).filter(
    x => x.variety === b.variety &&
      Number(x.batchNo) === Number(b.batchNo)
  );

  return duplicates.length > 1
    ? `${b.variety} ${b.batchNo} (${b.pottingDate || "date unknown"})`
    : `${b.variety} ${b.batchNo}`;
}

/* ========================================
   DASHBOARD
======================================== */

function render() {
  const bs = values(batches);
  const ss = values(sales);
  const apps = values(applications);
  const ts = values(team);

  // Total available plant stock
  $("totalStock").textContent = fmt(
    bs.reduce((a, b) => a + batchStock(b), 0)
  );

  // Total batches
  $("totalBatches").textContent = fmt(bs.length);

  // Total sold plants
  $("totalSold").textContent = fmt(
    ss.reduce((a, x) => a + Number(x.quantity || 0), 0)
  );

  // FIX: Propagator count (not plant count)
  // Maximum available Propagators = 3
  $("propCount").textContent = fmt(
    Math.min(3, usedPropagators())
  );

  // Dashboard batch rows
  const rows = bs.map(b => `
    <tr>
      <td>${esc(batchDisplayLabel(b))}</td>
      <td>${esc(b.variety)}</td>
      <td>${esc(b.pottingDate)}</td>
      <td><span class="pill">${esc(b.stage || "Propagator")}</span></td>
      <td>${fmt(batchStock(b))}</td>
      <td>${esc(b.propagatorEnd || "")}</td>
    </tr>
  `).join("");

  $("dashRows").innerHTML = rows || empty(6);

  // Batch management table
  $("batchRows").innerHTML = bs.map(b => `
    <tr>
      <td>${esc(batchDisplayLabel(b))}</td>
      <td>${esc(b.variety)}</td>
      <td>${esc(b.pottingDate)}</td>
      <td>${fmt(b.initialCount)}</td>
      <td>${fmt(batchStock(b))}</td>
      <td>${esc(b.stage)}</td>
      <td>
        <button class="small-btn" onclick="openBatch('${b.id}')">
          Manage
        </button>
      </td>
    </tr>
  `).join("") || empty(7);

  // Batch selection dropdowns
  const opts = bs.map(b => `
    <option value="${b.id}">
      ${esc(batchDisplayLabel(b))} — ${fmt(batchStock(b))} plants
    </option>
  `).join("");

  $("saleBatch").innerHTML = opts;
  $("appBatch").innerHTML = opts;

  // Sales records
  $("salesRows").innerHTML = ss
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map(x => `
      <tr>
        <td>${esc(x.date)}</td>
        <td>${esc(batches[x.batchId]
          ? batchDisplayLabel(batches[x.batchId])
          : x.batchLabel)}</td>
        <td>${esc(x.buyer || "")}</td>
        <td>${fmt(x.quantity)}</td>
        <td>${esc(x.notes || "")}</td>
      </tr>
    `).join("") || empty(5);

  // Fertilizer / application records
  $("appRows").innerHTML = apps
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map(x => `
      <tr>
        <td>${esc(x.date)}</td>
        <td>${esc(batches[x.batchId]
          ? batchDisplayLabel(batches[x.batchId])
          : x.batchLabel)}</td>
        <td>${esc(x.type)}</td>
        <td>${esc(x.product)}</td>
        <td>${esc(x.quantity)} ${esc(x.unit || "")}</td>
        <td>${esc(x.notes || "")}</td>
      </tr>
    `).join("") || empty(6);

  // Team
  $("teamCards").innerHTML = ts.map(x => `
    <article class="team-card">
      <b>${esc(x.name)}</b>
      <span>${esc(x.role)}</span>
      <small>${esc(x.phone || "")}</small>
    </article>
  `).join("") || "<p>No team members added yet.</p>";

  // Reports
  $("reportSummary").innerHTML = `
    <p>Total batches: <b>${bs.length}</b></p>
    <p>Available plants: <b>${fmt(bs.reduce((a,b) => a + batchStock(b), 0))}</b></p>
    <p>Sales records: <b>${ss.length}</b></p>
    <p>Fertilizer / chemical records: <b>${apps.length}</b></p>
  `;
}

function empty(n) {
  return `<tr><td colspan="${n}" class="empty">No records yet</td></tr>`;
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

/* ========================================
   ADD NEW BATCH
======================================== */

$("batchForm").onsubmit = async e => {
  e.preventDefault();

  const variety = $("variety").value;
  const batchNo = Number($("batchNo").value);
  const pottingDate = $("pottingDate").value;
  const initialCount = Number($("initialCount").value);

  // Propagator limit check
  if (usedPropagators() >= 3) {
    return notify(
      "Propagator තුනම දැනට භාවිතයේ තියෙනවා. එකක් Nursery එකට මාරු කරලා නැවත Batch එකක් දාන්න.",
      true
    );
  }

  const data = {
    variety,
    batchNo,
    pottingDate,
    initialCount,
    stage: "Propagator",
    propagatorEnd: dateAdd(pottingDate, 14),
    adjustmentTotal: 0,
    soldTotal: 0,
    notes: $("batchNotes").value,
    createdAt: Date.now()
  };

  try {
    let r = await path("batches").push(data);

    await path(`history/${r.key}`).push({
      type: "Potting",
      date: pottingDate,
      quantity: initialCount,
      unit: "plants",
      createdAt: Date.now()
    });

    e.target.reset();
    $("pottingDate").value = today;

    notify("Batch saved successfully.");

  } catch (err) {
    notify(err.message, true);
  }
};

/* ========================================
   BATCH MANAGEMENT
======================================== */

window.openBatch = id => {
  const b = batches[id];
  if (!b) return;

  const box = $("batchDetail");
  box.classList.remove("hidden");

  box.innerHTML = `
    <div class="panel-head">
      <h3>${esc(batchDisplayLabel(b))} — Batch Management</h3>
      <button class="small-btn"
        onclick="document.getElementById('batchDetail').classList.add('hidden')">
        Close
      </button>
    </div>

    <p>
      Potting: ${esc(b.pottingDate)} |
      Propagator end: ${esc(b.propagatorEnd)} |
      Available: <b>${fmt(batchStock(b))}</b>
    </p>

    <form id="adjustForm" class="form-grid">
      <label>
        Action
        <select id="adjType">
          <option value="Nursery Count">Propagator Count / Move to Nursery</option>
          <option value="Stock Add">Add stock</option>
          <option value="Stock Loss">Record loss</option>
          <option value="Correction">Stock correction (+/-)</option>
        </select>
      </label>

      <label>
        Quantity
        <input id="adjQty" type="number" required>
      </label>

      <label>
        Date
        <input id="adjDate" type="date" value="${today}" required>
      </label>

      <label>
        Notes
        <input id="adjNotes">
      </label>

      <button class="primary">Save Stock Update</button>
    </form>

    <div id="historyRows"></div>
  `;

  // Batch history
  path(`history/${id}`).once("value").then(s => {
    let h = values(s.val()).sort(
      (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
    );

    $("historyRows").innerHTML = "<h4>Batch History</h4>" +
      h.map(x => `
        <p class='history-line'>
          ${esc(x.date)} · ${esc(x.type)} ·
          ${esc(x.quantity)} ${esc(x.unit || "")} ·
          ${esc(x.notes || "")}
        </p>
      `).join("");
  });

  // Stock update
  $("adjustForm").onsubmit = async e => {
    e.preventDefault();

    let type = $("adjType").value;
    let q = Number($("adjQty").value);
    let date = $("adjDate").value;

    if (!q) return notify("Quantity එක ඇතුළත් කරන්න.", true);

    let delta = type === "Stock Loss"
      ? -Math.abs(q)
      : type === "Correction"
        ? q
        : Math.abs(q);

    if (type === "Nursery Count") {
      if (q > Number(b.initialCount || 0) + Number(b.adjustmentTotal || 0)) {
        return notify(
          "Count එක ආරම්භක/වත්මන් ගණනට වඩා වැඩියි. Correction භාවිතා කරන්න.",
          true
        );
      }

      delta = q - (
        Number(b.initialCount || 0) +
        Number(b.adjustmentTotal || 0)
      );
    }

    if (batchStock(b) + delta < 0) {
      return notify("Stock එක negative වෙන්න බැහැ.", true);
    }

    try {
      // Moving a batch to Nursery releases one Propagator
      const updatedStage = type === "Nursery Count"
        ? "Nursery"
        : b.stage;

      await path(`batches/${id}`).update({
        adjustmentTotal:
          Number(b.adjustmentTotal || 0) + delta,
        stage: updatedStage,
        lastUpdated: Date.now()
      });

      await path(`history/${id}`).push({
        type,
        date,
        quantity: q,
        unit: "plants",
        notes: $("adjNotes").value,
        delta,
        createdAt: Date.now()
      });

      notify("Stock updated.");

    } catch (err) {
      notify(err.message, true);
    }
  };
};

/* ========================================
   SALES
======================================== */

$("saleForm").onsubmit = async e => {
  e.preventDefault();

  let id = $("saleBatch").value;
  let b = batches[id];
  let q = Number($("saleQty").value);

  if (!b) return notify("Batch එක තෝරන්න.", true);

  if (q < 1 || q > batchStock(b)) {
    return notify("ප්‍රමාණවත් stock නැහැ.", true);
  }

  try {
    const record = {
      batchId: id,
      batchLabel: batchDisplayLabel(b),
      date: $("saleDate").value,
      quantity: q,
      buyer: $("buyer").value,
      notes: $("saleNotes").value,
      createdAt: Date.now()
    };

    await path("sales").push(record);

    await path(`batches/${id}`).update({
      soldTotal: Number(b.soldTotal || 0) + q,
      lastUpdated: Date.now()
    });

    await path(`history/${id}`).push({
      type: "Sale",
      date: record.date,
      quantity: q,
      unit: "plants",
      notes: record.buyer,
      createdAt: Date.now()
    });

    e.target.reset();
    $("saleDate").value = today;

    notify("Sale saved and stock reduced.");

  } catch (err) {
    notify(err.message, true);
  }
};

/* ========================================
   APPLICATIONS
======================================== */

$("appForm").onsubmit = async e => {
  e.preventDefault();

  let id = $("appBatch").value;
  let b = batches[id];

  if (!b) return notify("Batch එක තෝරන්න.", true);

  try {
    await path("applications").push({
      batchId: id,
      batchLabel: batchDisplayLabel(b),
      type: $("appType").value,
      product: $("product").value,
      date: $("appDate").value,
      quantity: Number($("appQty").value),
      unit: $("appUnit").value,
      notes: $("appNotes").value,
      createdAt: Date.now()
    });

    e.target.reset();
    $("appDate").value = today;

    notify("Application record saved.");

  } catch (err) {
    notify(err.message, true);
  }
};

/* ========================================
   TEAM
======================================== */

$("teamForm").onsubmit = async e => {
  e.preventDefault();

  try {
    await path("team").push({
      name: $("memberName").value,
      role: $("memberRole").value,
      phone: $("memberPhone").value,
      notes: $("memberNotes").value,
      createdAt: Date.now()
    });

    e.target.reset();
    notify("Team member saved.");

  } catch (err) {
    notify(err.message, true);
  }
};

/* ========================================
   EXPORT CSV
======================================== */

$("exportCsv").onclick = () => {
  let rows = [
    ["Batch Display", "Variety", "Batch Number", "Potting Date", "Initial Count", "Available", "Stage"],
    ...values(batches).map(b => [
      batchDisplayLabel(b),
      b.variety,
      b.batchNo,
      b.pottingDate,
      b.initialCount,
      batchStock(b),
      b.stage
    ])
  ];

  let csv = rows.map(r =>
    r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  let a = document.createElement("a");

  a.href = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
  );

  a.download = "banana-nursery-batches.csv";
  a.click();

  URL.revokeObjectURL(a.href);
};

/* ========================================
   NAVIGATION
======================================== */

$("nav").onclick = e => {
  let btn = e.target.closest("[data-page]");
  if (btn) showPage(btn.dataset.page);
};

document.querySelectorAll("[data-go]").forEach(b => {
  b.onclick = () => showPage(b.dataset.go);
});

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));

  $(page + "Page").classList.remove("hidden");

  document.querySelectorAll("#nav button").forEach(b => {
    b.classList.toggle("active", b.dataset.page === page);
  });

  $("pageTitle").textContent =
    page.charAt(0).toUpperCase() + page.slice(1);
}
