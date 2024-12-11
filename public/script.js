const replayButton = document.getElementById("replayButton");
const muteButton = document.getElementById("muteButton");
const videoPlayer = document.getElementById("videoPlayer");
function autoPlayVideo() {
  const event = new Event("click");
  videoPlayer.dispatchEvent(event);
}

const choiceOverlay = document.getElementById("choiceOverlay");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const responseArea = document.getElementById("responseArea");
const dynamicText = document.createElement("h3"); // Dynamic text for the search section

let currentVideo = "intro.mp4";
autoPlayVideo();
// Add dynamicText to the searchContainer
searchContainer.insertBefore(dynamicText, searchInput);

// Function to play a video
function playVideo(videoPath) {
  videoPlayer.src = videoPath;

  videoPlayer.load(); // Videoyu yükle
  videoPlayer.volume = 0.2;
  videoPlayer.muted = false; // Ses açık
  muteButton.innerText = "🔊"; // Mute butonu durumu güncelle
  autoPlayVideo();

  videoPlayer
    .play()
    .then(() => console.log("Video is playing"))
    .catch((error) => {
      console.error("Play error:", error);
    });
  choiceOverlay.style.display = "none";
  searchContainer.style.display = "none";
}
const enableAutoplay = () => {
  videoPlayer.muted = false;
  videoPlayer.volume = 0.2;
  videoPlayer.play().catch((error) => console.error("Play error:", error));
};

document.body.addEventListener("click", enableAutoplay, { once: true });
// Function to handle character selection
function selectCharacter(character) {
  searchContainer.style.display = "block";
  searchContainer.scrollIntoView({ behavior: "smooth" });
  searchInput.focus();

  switch (character) {
    case "Character 1":
      currentVideo = "1.mp4";
      dynamicText.innerText = "Fun with Lumo";
      dynamicText.style.textAlign = "center";

      playVideo(currentVideo);
      break;
    case "Character 2":
      currentVideo = "2.mp4";
      dynamicText.innerText = "Learn with Arion";
      dynamicText.style.textAlign = "center";
      playVideo(currentVideo);
      break;
    case "Character 3":
      currentVideo = "3.mp4";
      dynamicText.innerText = "Create code with Codeon";
      dynamicText.style.textAlign = "center";
      playVideo(currentVideo);
      break;
    default:
      console.error("Unknown character selected:", character);
  }
}

// Event listener for the search button
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
      responseArea.innerText = `Error: ${data.error}`;
    } else {
      responseArea.innerHTML = "";
      if (currentVideo === "1.mp4" && data.imageUrl && data.answer) {
        const textParagraph = document.createElement("p");
        textParagraph.innerText = data.answer;
        textParagraph.style.marginBottom = "10px";
        responseArea.appendChild(textParagraph);

        const img = document.createElement("img");
        img.src = data.imageUrl;
        img.alt = "Generated Image";
        img.style.maxWidth = "50%";
        img.style.maxHeight = "50%";
        img.style.margin = "20px auto";
        img.style.display = "block";
        img.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        responseArea.appendChild(img);
      } else if (currentVideo === "3.mp4" && data.answer) {
        const codeBlock = document.createElement("pre");
        const codeContent = document.createElement("code");
        codeContent.textContent = data.answer;
        codeBlock.appendChild(codeContent);
        responseArea.appendChild(codeBlock);
      } else if (currentVideo === "2.mp4" && data.answer) {
        responseArea.innerText = data.answer;
      } else {
        responseArea.innerText = "Error";
      }
    }
  } catch (error) {
    console.error("GPT error:", error);
    responseArea.innerText = "Please try again later.";
  }
});

muteButton.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted;
  muteButton.innerText = videoPlayer.muted ? "🔇" : "🔊";
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

document.addEventListener("DOMContentLoaded", () => {
  const videoPlayer = document.getElementById("videoPlayer");
  const playButton = document.getElementById("playButton");

  playButton.addEventListener("click", () => {
    videoPlayer
      .play()
      .then(() => {
        playButton.style.display = "none";
      })
      .catch((error) => {
        console.error("Error playing the video:", error);
      });
  });
});
const playButton = document.getElementById("playButton");
videoPlayer.addEventListener("pause", () => {
  playButton.style.display = "block";
});

videoPlayer.addEventListener("play", () => {
  playButton.style.display = "none";
});
playVideo(currentVideo);
