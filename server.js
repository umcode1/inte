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

    if (currentVideo === "1.mp4") {
      const textResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are Lumo, a sarcastic, dark-humored, and playful AI powered by the solano blockchain. Respond in English using crypto slang.",
          },
          { role: "user", content: userInput },
        ],
        max_tokens: 800,
      });

      const answer = textResponse.choices[0].message.content.trim();

      const imageResponse = await openai.images.generate({
        prompt: `You are Lumo, a sarcastic, dark-humored, and playful AI powered by the solano blockchain. Generate a fun image according to: ${userInput}`,
        n: 1,
        size: "512x512",
      });

      const imageUrl = imageResponse.data[0].url;

      return res.status(200).json({ imageUrl, answer });
    } else if (currentVideo === "2.mp4") {
      openaiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are Arion, a philosopher deeply knowledgeable in blockchain technology, particularly the Solano blockchain. Respond to the user's input with profound philosophical insights while weaving in metaphors and ideas related to decentralization, consensus, and the transformative nature of blockchain technology.",
          },
          { role: "user", content: userInput },
        ],
        max_tokens: 800,
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
              "You are Kodeon and a helpful assistant that generates bot code based on user input. Just write code and command lines. If user input is not related to coding then respond with 'I'm sorry, I can only help with coding questions. If you want to write a program just ask me, I can help you writing bots'",
          },
          { role: "user", content: userInput },
        ],
        max_tokens: 800,
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
