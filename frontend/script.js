const TOTAL_SLOTS = 50;

// ---------- STORAGE ----------
function getVehicles() {
  return JSON.parse(localStorage.getItem("vehicles")) || [];
}

function saveVehicles(vehicles) {
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
}

function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

function saveHistory(history) {
  localStorage.setItem("history", JSON.stringify(history));
}

// ---------- VALIDATION ----------
function isValidVehicleNumber(number) {
  return /^[A-Z0-9]{8,10}$/.test(number);
}

// ---------- DASHBOARD ----------
function updateDashboard() {
  const vehicles = getVehicles();
  const occupied = vehicles.length;
  const available = TOTAL_SLOTS - occupied;

  if (document.getElementById("occupied")) {
    document.getElementById("occupied").innerText = occupied;
    document.getElementById("available").innerText = available;
  }

  loadHistory();
}

// ---------- ADD VEHICLE ----------
function addVehicle() {
  const number = document.getElementById("vehicleNumber").value.toUpperCase();
  const type = document.getElementById("vehicleType").value;
  const error = document.getElementById("error");

  error.innerText = "";

  if (!number || !isValidVehicleNumber(number)) {
    error.innerText = "Invalid vehicle number";
    return;
  }

  if (!type) {
    error.innerText = "Select vehicle type";
    return;
  }

  const vehicles = getVehicles();

  if (vehicles.some(v => v.number === number)) {
    error.innerText = "Vehicle already parked";
    return;
  }

  vehicles.push({ number, type, entryTime: new Date() });
  saveVehicles(vehicles);

  alert("Vehicle Added");
  window.location.href = "dashboard.html";
}

// ---------- EXIT VEHICLE ----------
function exitVehicle() {
  const number = document.getElementById("exitVehicle").value.toUpperCase();
  const error = document.getElementById("exitError");
  const feeDisplay = document.getElementById("fee");

  error.innerText = "";
  feeDisplay.innerText = "";

  if (!number || !isValidVehicleNumber(number)) {
    error.innerText = "Invalid vehicle number";
    return;
  }

  let vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.number === number);

  if (index === -1) {
    error.innerText = "Vehicle not found";
    return;
  }

  const entryTime = new Date(vehicles[index].entryTime);
  const exitTime = new Date();
  const hours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));
  const fee = hours * 20;

  // save history
  const history = getHistory();
  history.push({
    number,
    type: vehicles[index].type,
    entryTime,
    exitTime,
    fee
  });
  saveHistory(history);

  vehicles.splice(index, 1);
  saveVehicles(vehicles);

  feeDisplay.innerText = "Parking Fee: ₹" + fee;
}

// ---------- LOAD HISTORY ----------
function loadHistory() {
  const table = document.getElementById("historyTable");
  if (!table) return;

  const history = getHistory();
  table.innerHTML = "";

  history.forEach((h, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${h.number}</td>
        <td>${h.type}</td>
        <td>${new Date(h.entryTime).toLocaleString()}</td>
        <td>${new Date(h.exitTime).toLocaleString()}</td>
        <td>${h.fee}</td>
      </tr>
    `;
  });
}

window.onload = updateDashboard;
