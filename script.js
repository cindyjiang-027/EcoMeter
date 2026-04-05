function goToCalculator() {
  window.location.href = "calculator.html";
}

function updateForm() {
  const type = document.getElementById("activityType").value;

  document.getElementById("transportFields").classList.add("hidden");
  document.getElementById("foodFields").classList.add("hidden");

  if (type === "transport") {
    document.getElementById("transportFields").classList.remove("hidden");
  } else if (type === "food") {
    document.getElementById("foodFields").classList.remove("hidden");
  }
}

// 🔥 Save data
function saveData(value) {
  let history = JSON.parse(localStorage.getItem("carbonData")) || [];

  history.push(value);

  if (history.length > 7) {
    history.shift();
  }

  localStorage.setItem("carbonData", JSON.stringify(history));
}

// 🔥 Update UI
function updateUI() {
  let history = JSON.parse(localStorage.getItem("carbonData")) || [];

  // weekly summary
  let total = history.reduce((a, b) => a + b, 0);

  document.getElementById("weeklySummary").innerText =
    history.length > 0
      ? total.toFixed(2) + " kg CO₂"
      : "No data yet";

  // trend
  let list = document.getElementById("trendList");
  list.innerHTML = "";

  history.forEach((val, index) => {
    let li = document.createElement("li");
    li.innerText = `Day ${index + 1}: ${val.toFixed(2)} kg`;
    list.appendChild(li);
  });
}

function calculate() {
  const type = document.getElementById("activityType").value;

  let total = 0;
  let tip = "";

  if (type === "transport") {
    const transport = document.getElementById("transport").value;
    const distance = parseFloat(document.getElementById("distance").value);

    if (!transport || isNaN(distance)) {
      alert("Please complete transport inputs.");
      return;
    }

    const factors = { car: 0.4, bus: 0.2, walk: 0 };
    total = factors[transport] * distance;

    if (transport === "car") {
      tip = "Driving produces high emissions. Try bus or walking.";
    } else if (transport === "bus") {
      tip = "Good choice! Bus is more eco-friendly.";
    } else {
      tip = "Excellent! Walking has zero emissions.";
    }

  } else if (type === "food") {
    const food = document.getElementById("food").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!food || isNaN(amount)) {
      alert("Please complete food inputs.");
      return;
    }

    const factors = { meat: 5, vegetarian: 2 };
    total = factors[food] * amount;

    if (food === "meat") {
      tip = "Meat has high emissions. Try plant-based meals.";
    } else {
      tip = "Great choice! Plant-based food is eco-friendly.";
    }

  } else {
    alert("Please select an activity type.");
    return;
  }

  // show result
  document.getElementById("resultText").innerText =
    `${total.toFixed(2)} kg CO₂`;

  document.getElementById("tip").innerText = tip;

  // 🔥🔥🔥 关键三步
  saveData(total);
  updateUI();
}

// 🔥 初始化
window.onload = function () {
  updateUI();
};