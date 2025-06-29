import axios from "axios";

const APIService = async ({ question, onResponse }) => {
  // const API_KEY = "AIzaSyAiUqUOYbZs2blgfFRBiD6XGyBeZKTiQRI";
  const API_KEY = "AIzaSyDAwwkHabXKN7vAhN9Akf7YunjFJ2D67CI";

  try {
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      method: "POST",
      data: {
        contents: [{ parts: [{ text: question }] }],
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.status === 200 && response.data) {
      onResponse(response.data); // Invoke the callback with the response data
    } else {
      console.error("Invalid response from Gemini API:", response);
      onResponse({
        candidates: [{
          content: {
            parts: [{
              text: "Sorry, we couldn't generate a response. Please try again later."
            }]
          }
        }]
      });
    }
  } catch (error) {
    console.error("Error generating response:", error);
    // Provide a fallback response structure that matches what the component expects
    onResponse({
      candidates: [{
        content: {
          parts: [{
            text: "An error occurred while processing your request. Please try again later."
          }]
        }
      }]
    });
  }
};

export default APIService;
