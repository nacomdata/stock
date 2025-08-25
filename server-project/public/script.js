// This file is intentionally left blank.// Auto-fill Material Name in Stock In form when Material ID is entered
document.addEventListener('DOMContentLoaded', function() {
  var stockinId = document.getElementById('stockin-id');
  var stockinName = document.getElementById('stockin-name');
  if (stockinId && stockinName) {
    stockinId.addEventListener('input', function() {
      var id = stockinId.value.trim();
      var materials = JSON.parse(localStorage.getItem('materials')) || [];
      var found = materials.find(m => m.id === id);
      if (found) {
        stockinName.value = found.name;
      } else {
        stockinName.value = '';
      }
    });
  }
});
// Navigation
function showSection(sectionId) {
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  document.getElementById('nav-' + sectionId).classList.add('active');
  if (sectionId === 'report') renderReport();
}

// LocalStorage Setup
if (!localStorage.getItem("materials")) {
  const defaultMaterials = [
    { id: "001", name: "Screws (pack of 100)", in: 50, out: 20 },
    { id: "002", name: "Wooden Planks (1m)", in: 200, out: 150 },
    { id: "003", name: "Paint (1L cans)", in: 30, out: 12 }
  ];
  localStorage.setItem("materials", JSON.stringify(defaultMaterials));
}

// Dashboard Search
function searchMaterial() {
  const rawId = document.getElementById("search-id").value.trim().toUpperCase();
  const id = rawId.startsWith("MAT") ? rawId.slice(3) : rawId;
  if (!id) {
    alert("Please enter a Material ID");
    return;
  }
  const materials = JSON.parse(localStorage.getItem("materials")) || [];
  const material = materials.find(m => m.id === id);
  if (material) {
    document.getElementById("mat-id").textContent = material.id;
    document.getElementById("mat-name").textContent = material.name;
    document.getElementById("mat-in").textContent = material.in;
    document.getElementById("mat-out").textContent = material.out;
    document.getElementById("mat-balance").textContent = material.in - material.out;
  } else {
    alert("❌ Material not found!");
    clearMaterialInfo();
  }
}
function clearMaterialInfo() {
  document.getElementById("mat-id").textContent = "—";
  document.getElementById("mat-name").textContent = "—";
  document.getElementById("mat-in").textContent = "—";
  document.getElementById("mat-out").textContent = "—";
  document.getElementById("mat-balance").textContent = "—";
}
document.getElementById("search-id").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    searchMaterial();
  }
});

// Stock In Form
document.getElementById("stockin-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("stockin-id").value.trim();
  const qty = parseInt(document.getElementById("stockin-qty").value, 10);
  let materials = JSON.parse(localStorage.getItem("materials")) || [];
  const idx = materials.findIndex(m => m.id === id);
  const msg = document.getElementById("stockin-msg");
  if (idx === -1) {
    msg.textContent = "Material not found!";
    msg.className = "error";
    return;
  }
  materials[idx].in = (materials[idx].in || 0) + qty;
  localStorage.setItem("materials", JSON.stringify(materials));
  msg.textContent = "Stock In updated successfully!";
  msg.className = "success";
  this.reset();
});

// Button Functions
function handleEdit() {
  alert('Edit function coming soon!');
}
function handleBackToDashboard() {
  showSection('dashboard');
}
function handleExit() {
  exitApp();
}
function handlePrint() {
  window.print();
}

// Attach to all Edit, Back, Exit, Print buttons
document.addEventListener('DOMContentLoaded', function() {
  // Edit buttons
  document.querySelectorAll('.action.edit').forEach(btn => {
    btn.onclick = handleEdit;
  });
  // Back to Dashboard buttons
  document.querySelectorAll('.action.back').forEach(btn => {
    btn.onclick = handleBackToDashboard;
  });
  // Exit buttons
  document.querySelectorAll('.action.exit').forEach(btn => {
    btn.onclick = handleExit;
  });
    // Print button (already handled above, but ensure)
    const printBtn = document.getElementById('report-print-btn');
    if (printBtn) printBtn.onclick = handlePrint;
    // Back to Dashboard and Exit for report section
    const reportBackBtn = document.getElementById('report-back-btn');
    if (reportBackBtn) reportBackBtn.onclick = handleBackToDashboard;
    const reportExitBtn = document.getElementById('report-exit-btn');
    if (reportExitBtn) reportExitBtn.onclick = handleExit;
});

// Stock Out Form
document.getElementById("stockout-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("stockout-id").value.trim();
  const qty = parseInt(document.getElementById("stockout-qty").value, 10);
  let materials = JSON.parse(localStorage.getItem("materials")) || [];
  const idx = materials.findIndex(m => m.id === id);
  const msg = document.getElementById("stockout-msg");
  if (idx === -1) {
    msg.textContent = "Material not found!";
    msg.className = "error";
    return;
  }
  if ((materials[idx].in || 0) - (materials[idx].out || 0) < qty) {
    msg.textContent = "Not enough stock!";
    msg.className = "error";
    return;
  }
  materials[idx].out = (materials[idx].out || 0) + qty;
  localStorage.setItem("materials", JSON.stringify(materials));
  msg.textContent = "Stock Out updated successfully!";
  msg.className = "success";
  this.reset();
});

// Add New Material Form
document.getElementById("newmat-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("newmat-id").value.trim();
  const name = document.getElementById("newmat-name").value.trim();
  let materials = JSON.parse(localStorage.getItem("materials")) || [];
  const msg = document.getElementById("newmat-msg");
  if (!id || !name) {
    msg.textContent = "Please fill all fields!";
    msg.className = "error";
    return;
  }
  if (materials.some(m => m.id === id)) {
    msg.textContent = "Material ID already exists!";
    msg.className = "error";
    return;
  }
  materials.push({ id, name, in: 0, out: 0 });
  localStorage.setItem("materials", JSON.stringify(materials));
  msg.textContent = "Material added successfully!";
  msg.className = "success";
  this.reset();
});

// Report Table
function renderReport() {
  const materials = JSON.parse(localStorage.getItem("materials")) || [];
  const tbody = document.querySelector("#report-table tbody");
  tbody.innerHTML = "";
  // Get filter values
  const dateFromVal = document.getElementById("report-date-from")?.value;
  const dateToVal = document.getElementById("report-date-to")?.value;
  const matNameVal = document.getElementById("report-material")?.value?.toLowerCase() || "";
  // For demo: date filter is not functional unless you store per-transaction dates in your data model
  // Material name filter
  let filtered = materials;
  if (matNameVal) {
    filtered = filtered.filter(m => m.name.toLowerCase().includes(matNameVal));
  }
  // If you add per-transaction date, filter here as well
  // Example for future: filter by transaction date if available
  // if (dateFromVal || dateToVal) {
  //   filtered = filtered.filter(m => {
  //     // Compare m.date (must be stored in your data)
  //   });
  // }
  filtered.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.id}</td>
                    <td>${m.name}</td>
                    <td>${m.in || 0}</td>
                    <td>${m.out || 0}</td>
                    <td>${(m.in || 0) - (m.out || 0)}</td>`;
    tbody.appendChild(tr);
  });
}

// Report filter events
document.addEventListener("DOMContentLoaded", function() {
  const reportSection = document.getElementById("report");
  if (reportSection) {
    document.getElementById("report-filter-btn").onclick = renderReport;
    document.getElementById("report-clear-btn").onclick = function() {
      document.getElementById("report-date-from").value = "";
      document.getElementById("report-date-to").value = "";
      document.getElementById("report-material").value = "";
      renderReport();
    };
    // Optional: live filter as you type
    document.getElementById("report-material").addEventListener("input", renderReport);
    document.getElementById("report-print-btn").onclick = function() {
      window.print();
    };
  }
});

// Exit
function exitApp() {
  if (confirm("Are you sure you want to exit and delete all data?")) {
    localStorage.removeItem("materials");
    alert("All data deleted. Closing application...");
    window.open('', '_self');
    window.close();
  }
}
// সব ম্যাটেরিয়াল লোড
const res = await fetch('/api/materials');
const materials = await res.json();

// নতুন ম্যাটেরিয়াল যোগ
await fetch('/api/materials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, name, unit, remarks })
});

// Stock In
await fetch('/api/stockin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, qty })
});

// Stock Out
await fetch('/api/stockout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, qty })
});

// Delete
await fetch('/api/materials/' + id, { method: 'DELETE' });