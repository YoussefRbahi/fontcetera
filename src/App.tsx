import { useEffect, useState } from "react";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import "./App.css";
import Logo from "./logo.svg";

interface Font {
  name: string;
  id: string;
  canBold: boolean;
  canItalic: boolean;
}

function App() {
  const fonts: Font[] = [
    // { name: "Bold", id: "b" },
    // { name: "Italic", id: "i" },
    // { name: "Bold/italic", id: "bi" },
    { name: "Gothic", id: "g", canBold: true, canItalic: false },
    { name: "Script", id: "c", canBold: true, canItalic: false },
    { name: "Double-struck", id: "d", canBold: false, canItalic: false },
    { name: "Sans-serif", id: "s", canBold: true, canItalic: true },
    { name: "Monospace", id: "m", canBold: false, canItalic: false },
    { name: "Full width", id: "w", canBold: false, canItalic: false },
  ];

  const [inputText, setInputText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<Font | null>(fonts[0]);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);

  const formattedText = toUnicodeVariant(
    inputText,
    (isBold ? "b" : "") + (isItalic ? "i" : "") + selectedFont?.id
  );

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
    <div className="w-64 m-0 bg-white grid  text-sm font-mono bg-gradient-to-bl from-yellow-50  to-blue-50 text-slate-800">
      <div className="flex items-end px-4 py-2 border-b border-slate-300 gap-0">
        <img src={Logo} alt="Logo" className="w-auto h-8" />
        <h1 className="font-bold text-lg font-serif tracking-widest text-emerald-600 -mb-0.5 -translate-x-1.5">
          ontcetera
        </h1>
      </div>

      <div className="px-4">
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
        <div className="flex my-2 gap-2 text-base h-auto">
          <select
            className="border-2 border-slate-300 rounded-md h-8 w-full"
            title="Font selection"
            value={selectedFont?.id || ""}
            onChange={(e) => {
              const font = fonts.find((f) => f.id === e.target.value);
              setSelectedFont(font || null);
              if (!font?.canBold) {
                setIsBold(false);
              }
              if (!font?.canItalic) {
                setIsItalic(false);
              }
            }}
          >
            {fonts.map((font) => (
              <option value={font.id} key={font.id}>
                {toUnicodeVariant(font.name, font.id)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap my-2 gap-1">
          <button
            disabled={!selectedFont?.canBold}
            onClick={() => setIsBold(!isBold)}
            className={`option-button font-bold ${
              isBold ? "bg-emerald-600 text-white" : "text-black"
            }`}
          >
            <span className="block">B</span>
          </button>
          <button
            disabled={!selectedFont?.canItalic}
            onClick={() => setIsItalic(!isItalic)}
            className={`option-button font-extralight  ${
              isItalic && "bg-emerald-600 text-white"
            }`}
          >
            <span className="block italic">I</span>
          </button>
        </div>
      </div>
      <div className="flex py-2 border-t border-slate-300 px-4  align-middle justify-between">
        <div className="flex w-2/3 gap-2 ">
          <CopyToClipboard copiableText={formattedText} font={selectedFont} />
          <ClearText setInputText={setInputText} />
        </div>
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
      {/*toUnicodeVariant(*/ isCopied ? "Copied" : "Copy" /*, font)*/}
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
      {isCleared ? "Cleared" : "Clear"}
    </button>
  );
}

export default App;
