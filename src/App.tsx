import "./App.css";
import { transform, getFonts, revertTransform } from "convert-unicode-fonts";
import { useState } from "react";

function App() {
  const fonts = getFonts();
  const [formattedText, setFormattedText] = useState<string>("");

  const formatText = (text: string) => {
    const newText = transform(text, fonts["bold"]);
    setFormattedText(newText);
  };

  return (
    <div className="w-80 h-80 ">
      <label htmlFor="input-textarea">
        Enter text:
        <textarea
          name="userInput"
          id="input-textarea"
          className="border w-full h-40"
          onChange={(e) => {
            formatText(e.target.value);
          }}
        ></textarea>
      </label>
      <label htmlFor="output-textarea">
        Formatted Text:
        <textarea
          name="userOutput"
          id="output-textarea"
          className="border w-full h-40"
          value={formattedText}
          readOnly
        ></textarea>
      </label>
    </div>
  );
}

export default App;
