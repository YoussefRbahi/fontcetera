import { useEffect, useState, useRef } from "react";
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
  const [selectedFont, setSelectedFont] = useState<string>("b");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formattedText = toUnicodeVariant(inputText, selectedFont);

  useEffect(() => {
    // Load data from storage when component mounts
    chrome.storage.session.get(["inputText", "selectedFont"], (result) => {
      if (result.inputText) setInputText(result.inputText);
      if (result.selectedFont) setSelectedFont(result.selectedFont);
    });

    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Save data to storage whenever it changes
    chrome.storage.session.set({ inputText, selectedFont });
  }, [inputText, selectedFont]);

  return (
    <div className="w-80 m-0 p-4 grid gap-4 text-sm">
      <div className="grid gap-2">
        <label htmlFor="input-textarea" className="text-lg">
          Enter text:
        </label>
        <textarea
          name="userInput"
          id="input-textarea"
          ref={inputRef}
          className="border w-full h-20 px-2 py-0.5 resize-none"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
      </div>

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
            <label htmlFor={font.id}>
              {toUnicodeVariant(font.name, font.id)}
            </label>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <label htmlFor="output-textarea" className="text-lg">
          Formatted Text:
        </label>
        <textarea
          name="userOutput"
          id="output-textarea"
          className="border w-full h-20 px-2 py-0.5 resize-none"
          value={formattedText}
          readOnly
        ></textarea>
      </div>
      <div className="flex justify-between">
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
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      disabled={isCopied}
      className={`text-center transition-all duration-100 bg-blue-500 hover:bg-blue-700 text-white font-bold w-32 py-2 px-4 rounded text-nowrap ${
        isCopied && "bg-slate-300  hover:bg-slate-300 text-green-800"
      }`}
      onClick={() => {
        copyToClipboard(copiableText);
      }}
    >
      {/*toUnicodeVariant(*/ isCopied ? "✅ Done!" : "📋 Copy text" /*, font)*/}
    </button>
  );
}
function ClearText({ setInputText }: { setInputText: (text: string) => void }) {
  const [isCleared, setIsCleared] = useState(false);

  function clearText() {
    setInputText("");
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 2000); // Reset cleared state after 2 seconds
  }

  return (
    <button
      disabled={isCleared}
      className={`text-center transition-all duration-100 text-white font-bold w-28 py-2 px-4 rounded text-nowrap ${
        isCleared
          ? "bg-slate-300  hover:bg-slate-300 text-green-800"
          : "bg-red-500 hover:bg-green-700"
      }`}
      onClick={() => clearText()}
    >
      {isCleared ? "✅ Cleared" : "🗑️ Clear"}
    </button>
  );
}

export default App;
