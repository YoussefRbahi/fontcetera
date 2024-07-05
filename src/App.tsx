import { useEffect, useState } from "react";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import "./App.css";

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
      <CopyToClipboard copiableText={formattedText} />
    </div>
  );
}

function CopyToClipboard({ copiableText }: { copiableText: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset copied state after 1 second
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      disabled={isCopied}
      className={`text-center transition-all duration-100 bg-blue-500 hover:bg-blue-700 text-white font-bold w-40 py-2 px-4 rounded ${
        isCopied && "bg-slate-300  hover:bg-slate-300 text-green-800"
      }`}
      onClick={() => {
        copyToClipboard(copiableText);
      }}
    >
      {isCopied ? "Done! ✓" : " Copy text"}
    </button>
  );
}

export default App;
