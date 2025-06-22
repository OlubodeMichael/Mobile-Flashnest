import axios from "axios";

class FlashcardService {
  /**
   * Generates flashcards using OpenRouter AI API
   * @param {Object} options - Configuration options
   * @param {string} [options.topic] - Topic to generate flashcards about
   * @param {string} [options.text] - Text content to generate flashcards from
   * @param {number} [options.count=10] - Number of flashcards to generate (1-50)
   * @param {string} [options.fileContent] - File content for PDF or DOCX
   * @param {string} [options.fileType] - MIME type of the file
   * @returns {Promise<Array>} Array of flashcards with question and answer
   * @throws {Error} If the API request fails or returns invalid data
   */
  static async generateFlashcards({
    topic,
    text,
    count = 10,
    fileContent,
    fileType,
  }) {
    // Validate count
    const validatedCount = parseInt(count, 10);
    if (isNaN(validatedCount) || validatedCount < 1 || validatedCount > 50) {
      throw new Error("Count must be between 1 and 50");
    }

    // Handle input: topic, text, or file (prioritize file content over text input)
    let content = "";
    if (topic) {
      content = `Generate ${validatedCount} flashcards on "${topic}".`;
    } else if (fileContent) {
      // Handle any file that contains text content (prioritize over text input)
      content = `Generate ${validatedCount} flashcards from this document:\n\n${fileContent}`;
    } else if (text) {
      content = `Generate ${validatedCount} flashcards from the following:\n\n${text}`;
    } else {
      throw new Error("Provide a topic, text, or file");
    }

    // Prompt
    const prompt = `${content}
    
    Only return a valid JSON array of flashcards. No explanation, no markdown.
    
    Format:
    [
      { "question": "What is H₂O?", "answer": "Water" },
      { "question": "What is the atomic number of Carbon?", "answer": "6" }
    ]`;

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-chat-v3-0324:free",
          max_tokens: 1000,
          messages: [
            {
              role: "system",
              content: "You are an AI that generates study flashcards.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_PUBLIC_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      let message = response.data.choices?.[0]?.message?.content || "";

      // Clean markdown code fences
      message = message.replace(/```json|```/g, "").trim();

      // Try parsing the response
      let flashcards;
      try {
        flashcards = JSON.parse(message);
      } catch (err) {
        console.error("JSON parsing error:", err);
        // Try to extract the JSON array if full message parsing fails
        const match = message.match(/\[([\s\S]*?)\]/);
        if (match) {
          const jsonString = "[" + match[1] + "]";
          flashcards = JSON.parse(jsonString);
        } else {
          throw new Error("AI did not return any valid JSON");
        }
      }

      // Validate flashcards array
      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error("No valid flashcards returned");
      }

      return flashcards;
    } catch (error) {
      console.error("FlashcardService error:", error);
      if (error.response) {
        throw new Error(`OpenRouter error: ${error.response.statusText}`);
      }
      throw error;
    }
  }
}

export default FlashcardService;
