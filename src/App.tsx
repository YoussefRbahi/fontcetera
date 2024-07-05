import "./App.css";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import { useEffect, useState } from "react";

function App() {
  interface MainFont {
    name: string;
    id: string;
  }
  const mainFonts: MainFont[] = [
    { name: "bold", id: "b" },
    { name: "italic", id: "i" },
    { name: "boldItalic", id: "bi" },
  ];
  const [formattedText, setFormattedText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("b");

  const formatText = (text: string) => {
    const newText = toUnicodeVariant(text, selectedFont);
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
