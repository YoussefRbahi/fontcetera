import "./App.css";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import { useEffect, useState } from "react";

interface Font {
  name: string;
  id: string;
}
function App() {
  const fonts: Font[] = [
    { name: "Bold", id: "b" },
    { name: "Italic", id: "i" },
    { name: "Bold Italic", id: "bi" },
  ];
  const [inputText, setInputText] = useState<string>("");
  const [formattedText, setFormattedText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("b");

  useEffect(() => {
    setFormattedText(toUnicodeVariant(inputText, selectedFont));
  }, [selectedFont, inputText]);

  return (
    <div className="w-80 h-80 ">
      <label htmlFor="input-textarea">
        Enter text:
        <textarea
          name="userInput"
          id="input-textarea"
          className="border w-full h-40"
          onChange={(e) => {
            setInputText(e.target.value);
          }}
        ></textarea>
      </label>
      {/* Radio buttons to select font */}
      <div className="flex gap-2">
        {fonts.map((font) => (
          <div key={font.id} className="flex gap-2">
            <input
              type="radio"
              id={font.id}
              name="selected-font"
              value={font.id}
              checked={selectedFont === font.id}
              onChange={() => setSelectedFont(font.id)}
            />
            <label htmlFor={font.id}>{font.name}</label>
          </div>
        ))}
      </div>
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
