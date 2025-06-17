function checkLogin() {
  const loggedIn = localStorage.getItem("loggedIn");
  const expireAt = localStorage.getItem("expireAt");
  if (!loggedIn || new Date().getTime() > expireAt) {
    localStorage.clear();
    alert("Session expired. Please login again.");
    window.location.href = "index.html";
  } else {
    showTab("download");
    loadStreams();
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function showTab(tab) {
  document.querySelectorAll(".tab-content").forEach(div => {
    div.style.display = "none";
  });
  document.getElementById(tab).style.display = "block";
}

function downloadSchedule() {
  fetch("https://topembed.pw/api.php?format=json")
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach(match => {
        html += `<div class="match-box">
          <strong>${match.league}</strong> <br/>
          ${match.team1} vs ${match.team2} - ${match.time}
        </div>`;
      });
      document.getElementById("downloadList").innerHTML = html;
    })
    .catch(() => {
      alert("Failed to fetch schedule.");
    });
}

function createStream() {
  const league = document.getElementById("league").value;
  const team1 = document.getElementById("team1").value;
  const team2 = document.getElementById("team2").value;
  const time = document.getElementById("time").value;

  if (!league || !team1 || !team2 || !time) return alert("Fill all fields");

  const streams = JSON.parse(localStorage.getItem("streams") || "[]");
  streams.push({ league, team1, team2, time });
  localStorage.setItem("streams", JSON.stringify(streams));

  alert("Match added!");
  document.getElementById("league").value = "";
  document.getElementById("team1").value = "";
  document.getElementById("team2").value = "";
  document.getElementById("time").value = "";
  loadStreams();
}

function loadStreams() {
  const streams = JSON.parse(localStorage.getItem("streams") || "[]");
  let html = "";
  streams.forEach((m, index) => {
    html += `<div class="match-box">
      <strong>${m.league}</strong> <br/>
      ${m.team1} vs ${m.team2} - ${m.time}
      <br><button onclick="deleteStream(${index})">Delete</button>
    </div>`;
  });
  document.getElementById("deleteList").innerHTML = html;
}

function deleteStream(index) {
  const streams = JSON.parse(localStorage.getItem("streams") || "[]");
  streams.splice(index, 1);
  localStorage.setItem("streams", JSON.stringify(streams));
  loadStreams();
}
