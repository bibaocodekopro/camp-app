const { ipcRenderer } = window;

let currentZone = "Asia/Tokyo";

$(document).ready(function () {
    // 📝 xử lý submit form
    $("#campForm").on("submit", function (e) {
        e.preventDefault();

        const url = $("#url").val();
        const qty = parseInt($("#qty").val());
        const mode = $("#mode").val();

        // set thời gian bắt đầu
        $("#startTime").val(new Date().toLocaleTimeString());

        ipcRenderer.send("start-camp", { url, qty, mode });
    });
});


$("#region").on("change", function () {
  currentZone = $(this).val();
});

function updateCurrentTime() {
  const now = new Date();

  // Convert sang timeZone đã chọn
  const options = {
    timeZone: currentZone,
    hour12: false
  };
  const formatter = new Intl.DateTimeFormat("en-GB", {
    ...options,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  // Format ngày giờ cơ bản
  const parts = formatter.formatToParts(now);
  const date = `${parts.find(p => p.type === "day").value}/${parts.find(p => p.type === "month").value}/${parts.find(p => p.type === "year").value}`;
  const time = `${parts.find(p => p.type === "hour").value}:${parts.find(p => p.type === "minute").value}:${parts.find(p => p.type === "second").value}`;

  // Lấy milliseconds (000–999)
  const ms = now.getMilliseconds().toString().padStart(3, "0");

  $("#currentTime").text(`${date} ${time}.${ms}`);
}

setInterval(updateCurrentTime, 10); // update mỗi 10ms cho mượt
updateCurrentTime();