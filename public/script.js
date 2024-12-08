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

let currentVideo = "intro.mp4"; // Başlangıç videosu

// Ses toggle kontrolü
muteButton.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted; // Ses durumunu değiştir
  muteButton.innerText = videoPlayer.muted ? "🔇" : "🔊"; // Buton simgesini değiştir
});

// Skip butonuna tıklama olayı
skipButton.addEventListener("click", () => {
  console.log("Skip butonuna basıldı.");
  if (currentVideo === "intro.mp4") {
    // Intro videosundaysa seçim ekranını göster
    videoPlayer.pause(); // Videoyu durdur
    choiceOverlay.style.display = "flex"; // Seçenek ekranını göster
  } else {
    // Diğer videolardaysa, video bitmiş gibi davran ve arama ekranını aç
    console.log(`${currentVideo} atlandı, arama ekranı gösteriliyor.`);
    videoPlayer.pause();
    searchContainer.style.display = "block";
    searchContainer.scrollIntoView({ behavior: "smooth" }); // Arama çubuğunu görünür yap
    searchInput.focus(); // Kullanıcı odaklanır

    // Replay butonunu göster
    replayButton.style.display = "block"; // Replay butonunu görünür yap
    replayButton.style.position = "absolute";
    replayButton.style.top = "50%";
    replayButton.style.left = "50%";
    replayButton.style.transform = "translate(-50%, -50%)"; // Ortalamak için
    replayButton.style.zIndex = "3"; // Replay butonu üstte gözüksün
  }
});

// Videoyu oynat
function playVideo(videoPath) {
  videoPlayer.src = videoPath;
  videoPlayer.muted = muteButton.innerText === "🔇"; // Ses durumunu ayarla
  videoPlayer.play().catch((error) => {
    console.error("Video oynatılamıyor:", error);
  });
  choiceOverlay.style.display = "none"; // Seçenek ekranını gizle
  searchContainer.style.display = "none"; // Arama çubuğunu gizle
  console.log(`Video oynatılıyor: ${videoPath}`);
}

// Video sona erdiğinde işlem yap
videoPlayer.addEventListener("ended", () => {
  if (currentVideo === "intro.mp4") {
    choiceOverlay.style.display = "flex"; // Seçenek ekranını göster
    console.log("Intro videosu bitti, seçim ekranı gösteriliyor.");
  } else {
    // Video sona erdiğinde arama çubuğunu göster ve odakla
    console.log(`${currentVideo} bitti, arama ekranı gösteriliyor.`);
    searchContainer.style.display = "block";
    searchContainer.scrollIntoView({ behavior: "smooth" }); // Arama çubuğunu görünür yap
    searchInput.focus(); // Kullanıcı odaklanır
  }
});

// Seçeneklere tıklama olayları
choice1.addEventListener("click", () => {
  currentVideo = "1.mp4"; // Seçenek 1 videosu
  playVideo(currentVideo);
});

choice2.addEventListener("click", () => {
  currentVideo = "2.mp4"; // Seçenek 2 videosu
  playVideo(currentVideo);
});

choice3.addEventListener("click", () => {
  currentVideo = "1.mp4"; // Seçenek 3 videosu
  playVideo(currentVideo);
});

// Arama butonuna tıklama
searchButton.addEventListener("click", async () => {
  const userInput = searchInput.value.trim();
  if (!userInput) {
    alert("Lütfen bir soru girin.");
    return;
  }

  // Kullanıcı arama yaptıktan sonra responseArea'yı genişlet
  responseArea.style.height = "300px"; // Genişlik ve yükseklik ayarlandı
  responseArea.style.overflowY = "auto"; // Kaydırma özelliği eklendi

  responseArea.innerText = "Yanıt bekleniyor...";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, currentVideo }), // currentVideo bilgisini gönderiyoruz
    });

    const data = await res.json();
    console.log("GPT yanıtı:", data);

    if (data.error) {
      responseArea.innerText = `Hata: ${data.error}`;
    } else {
      if (currentVideo === "2.mp4" && data.imageUrl) {
        // Resim yanıtı için bir <img> elementi oluştur
        const img = document.createElement("img");
        img.src = data.imageUrl;
        img.alt = "Generated Image";
        img.style.maxWidth = "100%";
        img.style.marginTop = "20px";
        responseArea.innerHTML = ""; // Önceki yanıtları temizle
        responseArea.appendChild(img);
      } else if (currentVideo === "3.mp4" && data.code) {
        // Kod yanıtı için bir <pre> elementi oluştur
        const pre = document.createElement("pre");
        pre.textContent = data.code;
        responseArea.innerHTML = ""; // Önceki yanıtları temizle
        responseArea.appendChild(pre);
      } else if (currentVideo === "1.mp4" && data.answer) {
        // Text yanıtı için normal şekilde göster
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
    videoPlayer.play(); // Videoyu oynat
    console.log("Video oynatılıyor.");
  } else {
    videoPlayer.pause(); // Videoyu durdur
    console.log("Video durduruldu.");
  }
});
// İlk video başlat (intro.mp4)
playVideo(currentVideo);
