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
  if (currentVideo === "intro.mp4") {
    videoPlayer.pause();
    choiceOverlay.style.display = "flex";
  } else {
    videoPlayer.pause();
    searchContainer.style.display = "block";
    searchContainer.scrollIntoView({ behavior: "smooth" });
    searchInput.focus();

    // replayButton.style.display = "block";
    // replayButton.style.position = "absolute";
    // replayButton.style.top = "50%";
    // replayButton.style.left = "50%";
    // replayButton.style.transform = "translate(-50%, -50%)";
    // replayButton.style.zIndex = "3";
  }
});

function playVideo(videoPath) {
  videoPlayer.src = videoPath;
  videoPlayer.muted = muteButton.innerText === "🔇";
  videoPlayer.play().catch((error) => {
    console.error(error);
  });
  choiceOverlay.style.display = "none";
  searchContainer.style.display = "none";
}

videoPlayer.addEventListener("ended", () => {
  if (currentVideo === "intro.mp4") {
    choiceOverlay.style.display = "flex";
  } else {
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
    alert("Please provide a question");
    return;
  }

  responseArea.style.height = "300px";
  responseArea.style.overflowY = "auto";

  responseArea.innerText = "Waiting...";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, currentVideo }),
    });

    const data = await res.json();

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
      } else if (currentVideo === "3.mp4" && data.answer) {
        responseArea.innerHTML = "";

        const codeBlock = document.createElement("pre");
        const codeContent = document.createElement("code");
        codeContent.textContent = data.answer;

        codeBlock.appendChild(codeContent);
        responseArea.appendChild(codeBlock);
      } else if (currentVideo === "1.mp4" && data.answer) {
        console.log(data.answer);
        responseArea.innerText = data.answer;
      } else {
        responseArea.innerText = "Error";
      }
    }
  } catch (error) {
    console.error("Gpt error", error);
    responseArea.innerText = "Please try again later.";
  }
});
replayButton.addEventListener("click", () => {
  playVideo(currentVideo);
});

videoPlayer.addEventListener("click", () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
});

playVideo(currentVideo);
