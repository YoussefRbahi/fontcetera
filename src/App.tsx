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
    { name: "Bold/italic", id: "bi" },
  ];
  const [inputText, setInputText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("b");
  const formattedText = toUnicodeVariant(inputText, selectedFont);

  // Load data from storage when component mounts

  /*
  useEffect(() => {
    chrome.storage.session.get(["inputText", "selectedFont"], (result) => {
      if (result.inputText) setInputText(result.inputText);
      if (result.selectedFont) setSelectedFont(result.selectedFont);
    });
  }, []);
  */

  useEffect(() => {
    // Save data to storage whenever it changes
    chrome.storage.session.set({ inputText, selectedFont });
  }, [inputText, selectedFont]);

  return (
    <div className="w-64 m-0 p-2 grid gap-2 text-sm font-mono bg-slate-100 text-slate-800">
      <div className="grid gap-1">
        <label htmlFor="input-textarea" className="text-label">
          Enter text:
        </label>
        <textarea
          name="userInput"
          id="input-textarea"
          autoFocus
          className="text-area"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
      </div>

      <div className="grid gap-1">
        <label htmlFor="output-textarea" className="text-label">
          Formatted text:
        </label>
        <textarea
          name="userOutput"
          id="output-textarea"
          className="text-area"
          value={formattedText}
          readOnly
        ></textarea>
      </div>
      {/* Radio buttons to select font */}
      <div className="flex gap-2 justify-center">
        {fonts.map((font) => (
          <div key={font.id} className="flex gap-0.5">
            <input
              type="radio"
              id={font.id}
              name="selected-font"
              value={font.id}
              checked={selectedFont === font.id}
              onChange={() => setSelectedFont(font.id)}
              className="accent-emerald-600 active:accent-emerald-800"
            />
            <label htmlFor={font.id}>
              {toUnicodeVariant(font.name, font.id)}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-around mb-2">
        <CopyToClipboard copiableText={formattedText} font={selectedFont} />
        <ClearText setInputText={setInputText} />
      </div>
    </div>
  );
}

function CopyToClipboard({
  copiableText,
  font,
}: {
  copiableText: string;
  font: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // Reset copied state after 1.5 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      disabled={isCopied}
      className={`button ${
        isCopied
          ? "bg-slate-300  hover:bg-slate-300 text-emerald-800"
          : "bg-emerald-600 hover:bg-emerald-800"
      }`}
      onClick={() => {
        copyToClipboard(copiableText);
      }}
    >
      {/*toUnicodeVariant(*/ isCopied ? "✅ Copied" : "📋 Copy" /*, font)*/}
    </button>
  );
}
function ClearText({ setInputText }: { setInputText: (text: string) => void }) {
  const [isCleared, setIsCleared] = useState(false);

  function clearText() {
    setInputText("");
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 1500); // Reset cleared state after 1.5 seconds
  }

  return (
    <button
      disabled={isCleared}
      className={`button ${
        isCleared
          ? "bg-slate-300  hover:bg-slate-300 text-emerald-800"
          : "bg-slate-500 hover:bg-slate-700"
      }`}
      onClick={() => clearText()}
    >
      {isCleared ? "✅ Cleared" : "🗑️ Clear"}
    </button>
  );
}

export default App;
