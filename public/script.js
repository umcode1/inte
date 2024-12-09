const videoPlayer = document.getElementById("videoPlayer");
const choiceOverlay = document.getElementById("choiceOverlay");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");
const choice3 = document.getElementById("choice3");
const replayButton = document.getElementById("replayButton");

const muteButton = document.getElementById("muteButton");
const skipButton = document.getElementById("skipButton");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const responseArea = document.getElementById("responseArea");

muteButton.innerText = "🔇";

let currentVideo = "intro.mp4";

muteButton.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted;
  muteButton.innerText = videoPlayer.muted ? "🔇" : "🔊";
});

skipButton.addEventListener("click", () => {
  console.log("Skip butonuna basıldı.");
  if (currentVideo === "intro.mp4") {
    videoPlayer.pause();
    choiceOverlay.style.display = "flex";
  } else {
    console.log(`${currentVideo} atlandı, arama ekranı gösteriliyor.`);
    videoPlayer.pause();
    searchContainer.style.display = "block";
    searchContainer.scrollIntoView({ behavior: "smooth" });
    searchInput.focus();

    replayButton.style.display = "block";
    replayButton.style.position = "absolute";
    replayButton.style.top = "50%";
    replayButton.style.left = "50%";
    replayButton.style.transform = "translate(-50%, -50%)";
    replayButton.style.zIndex = "3";
  }
});

function playVideo(videoPath) {
  videoPlayer.src = videoPath;
  videoPlayer.muted = muteButton.innerText === "🔇";
  videoPlayer.play().catch((error) => {
    console.error("Video oynatılamıyor:", error);
  });
  choiceOverlay.style.display = "none";
  searchContainer.style.display = "none";
  console.log(`Video oynatılıyor: ${videoPath}`);
}

videoPlayer.addEventListener("ended", () => {
  if (currentVideo === "intro.mp4") {
    choiceOverlay.style.display = "flex";
    console.log("Intro videosu bitti, seçim ekranı gösteriliyor.");
  } else {
    console.log(`${currentVideo} bitti, arama ekranı gösteriliyor.`);
    searchContainer.style.display = "block";
    searchContainer.scrollIntoView({ behavior: "smooth" });
    searchInput.focus();
  }
});

choice1.addEventListener("click", () => {
  currentVideo = "1.mp4";
  playVideo(currentVideo);
});

choice2.addEventListener("click", () => {
  currentVideo = "2.mp4";
  playVideo(currentVideo);
});

choice3.addEventListener("click", () => {
  currentVideo = "3.mp4";
  playVideo(currentVideo);
});

searchButton.addEventListener("click", async () => {
  const userInput = searchInput.value.trim();
  if (!userInput) {
    alert("Lütfen bir soru girin.");
    return;
  }

  responseArea.style.height = "300px";
  responseArea.style.overflowY = "auto";

  responseArea.innerText = "Yanıt bekleniyor...";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, currentVideo }),
    });

    const data = await res.json();
    console.log("GPT yanıtı:", data);

    if (data.error) {
      responseArea.innerText = `Hata: ${data.error}`;
    } else {
      if (currentVideo === "2.mp4" && data.imageUrl) {
        const img = document.createElement("img");
        img.src = data.imageUrl;
        img.alt = "Generated Image";
        img.style.maxWidth = "100%";
        img.style.marginTop = "20px";
        responseArea.innerHTML = "";
        responseArea.appendChild(img);
      } else if (currentVideo === "3.mp4" && data.code) {
        const pre = document.createElement("pre");
        pre.textContent = data.code;
        responseArea.innerHTML = "";
        responseArea.appendChild(pre);
      } else if (currentVideo === "1.mp4" && data.answer) {
        responseArea.innerText = data.answer;
      } else {
        responseArea.innerText = "Bilinmeyen bir hata oluştu.";
      }
    }
  } catch (error) {
    console.error("GPT çağrısı başarısız:", error);
    responseArea.innerText = "Bir hata oluştu. Lütfen tekrar deneyin.";
  }
});
replayButton.addEventListener("click", () => {
  console.log(`Video ${currentVideo} baştan oynatılıyor.`);
  playVideo(currentVideo);
});

videoPlayer.addEventListener("click", () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    console.log("Video oynatılıyor.");
  } else {
    videoPlayer.pause();
    console.log("Video durduruldu.");
  }
});

playVideo(currentVideo);
