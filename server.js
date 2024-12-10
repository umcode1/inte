const express = require("express");
const path = require("path");

const app = express();
const PORT = 3021;
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

console.log("Loaded API Key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/ask", async (req, res) => {
  const { userInput, currentVideo } = req.body;

  if (!userInput) {
    console.error("No user input provided");
    return res.status(400).json({ error: "Please provide a question" });
  }

  try {
    let openaiResponse;

    if (currentVideo === "2.mp4") {
      openaiResponse = await openai.images.generate({
        prompt: userInput,
        n: 1,
        size: "512x512",
      });
      const imageUrl = openaiResponse.data[0].url;
      return res.status(200).json({ imageUrl });
    } else if (currentVideo === "1.mp4") {
      openaiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are Lumo, a sarcastic, dark-humored, and playful AI powered by the solano blockchain. Respond in English using crypto slang.",
          },
          { role: "user", content: userInput },
        ],
        max_tokens: 150,
      });
      const answer = openaiResponse.choices[0].message.content.trim();
      return res.status(200).json({ answer });
    } else if (currentVideo === "3.mp4") {
      openaiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are Kodeon and a helpful assistant that generates bot code based on user input. You must provide code snippets that are written in Python and can be used to create a simple chatbot. The code should be concise, clear, and easy to understand. Make sure to include comments to explain the code and provide context.",
          },
          { role: "user", content: userInput },
        ],
        max_tokens: 200,
      });
      const answer = openaiResponse.choices[0].message.content.trim();
      return res.status(200).json({ answer });
    } else {
      return res.status(400).json({ error: "Invalid video context" });
    }
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
