import { useEffect, useState } from "react";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import "./App.css";
import Logo from "./logo.svg";

interface Font {
  name: string;
  id: string;
  canBold: boolean;
  canItalic: boolean;
  canDecorate: boolean;
}

function App() {
  const fonts: Font[] = [
    {
      name: "Serif",
      id: "",
      canBold: true,
      canItalic: true,
      canDecorate: true,
    },
    {
      name: "Sans-serif",
      id: "s",
      canBold: true,
      canItalic: true,
      canDecorate: true,
    },
    {
      name: "Gothic",
      id: "g",
      canBold: true,
      canItalic: false,
      canDecorate: true,
    },
    {
      name: "Script",
      id: "c",
      canBold: true,
      canItalic: false,
      canDecorate: true,
    },
    {
      name: "Double-struck",
      id: "d",
      canBold: false,
      canItalic: false,
      canDecorate: true,
    },
    {
      name: "Monospace",
      id: "m",
      canBold: false,
      canItalic: false,
      canDecorate: true,
    },
    {
      name: "Full width",
      id: "w",
      canBold: false,
      canItalic: false,
      canDecorate: false,
    },
  ];

  const [inputText, setInputText] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<Font | null>(fonts[0]);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [decorations, setDecorations] = useState({
    isUnderlined: false,
    isStriked: false,
    isOverlined: false,
  });

  const formattedText = toUnicodeVariant(
    inputText,
    (selectedFont?.canBold ? (isBold ? "b" : "") : "") +
      (selectedFont?.canItalic ? (isItalic ? "i" : "") : "") +
      selectedFont?.id,
    selectedFont?.canDecorate
      ? [
          decorations.isUnderlined ? "u" : "",
          decorations.isStriked ? "s" : "",
          decorations.isOverlined ? "o" : "",
        ]
      : ""
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
    <div className="w-64 m-0 bg-white grid  text-sm font-mono bg-gradient-to-br from-sky-50  to-amber-50 text-slate-800">
      <div className="flex items-center tracking-normal px-4 py-2 border-b border-slate-300 gap-0.5">
        <img
          src={Logo}
          alt="Logo"
          className="w-auto h-8  drop-shadow-[2px_1px_1px_grey]"
        />
        <h1 className="inline-block leading-none text-2xl translate font-serif font-black drop-shadow-[1px_1px_0.5px_grey] text-emerald-600 translate-y-0.5">
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
            }}
          >
            {fonts.map((font) => (
              <option value={font.id} key={font.id}>
                {toUnicodeVariant(font.name, font.id)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex my-2 gap-2">
          <div className="flex gap-1">
            <OptionButton
              letter="B"
              enableState={selectedFont?.canBold || false}
              isApplied={isBold}
              onClick={() => setIsBold(!isBold)}
              className="font-black"
              spanClass={`-translate-y-[1px] ${
                selectedFont?.canBold
                  ? isBold
                    ? "text-white drop-shadow-[1px_1px_0px_#FFFFFF] "
                    : "text-black drop-shadow-[1px_1px_0px_#000000] "
                  : "drop-shadow-[1px_1px_0px_#cbd5e1] "
              }`}
            />
            <OptionButton
              letter="I"
              enableState={selectedFont?.canItalic || false}
              isApplied={isItalic}
              onClick={() => setIsItalic(!isItalic)}
              className="italic"
            />
          </div>
          <span className="bg-slate-300 w-[1px] "></span>
          <div className="flex gap-1">
            <OptionButton
              letter="U"
              enableState={selectedFont?.canDecorate || false}
              isApplied={decorations.isUnderlined}
              onClick={() =>
                setDecorations({
                  ...decorations,
                  isUnderlined: !decorations.isUnderlined,
                })
              }
              className="underline"
            />
            <OptionButton
              letter="S"
              enableState={selectedFont?.canDecorate || false}
              isApplied={decorations.isStriked}
              onClick={() =>
                setDecorations({
                  ...decorations,
                  isStriked: !decorations.isStriked,
                })
              }
              className="line-through"
            />
            <OptionButton
              letter="O"
              enableState={selectedFont?.canDecorate || false}
              isApplied={decorations.isOverlined}
              onClick={() =>
                setDecorations({
                  ...decorations,
                  isOverlined: !decorations.isOverlined,
                })
              }
              className="border-current"
              spanClass="border-inherit border-t-2 "
            />
          </div>
        </div>
      </div>
      <div className="flex py-2 border-t border-slate-300 px-4  align-middle justify-between">
        <div className="flex w-2/3 gap-1 ">
          <CopyToClipboard copiableText={formattedText} />
          <ClearText inputText={inputText} setInputText={setInputText} />
        </div>
      </div>
    </div>
  );
}

function CopyToClipboard({ copiableText }: { copiableText: string }) {
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
      className={`button text-emerald-600 ${
        isCopied ? "" : " hover:bg-slate-300"
      }`}
      onClick={() => {
        copyToClipboard(copiableText);
      }}
    >
      {/*toUnicodeVariant(*/ isCopied ? "Copied" : "Copy" /*, font)*/}
    </button>
  );
}
function ClearText({
  inputText,
  setInputText,
}: {
  inputText: string;
  setInputText: (text: string) => void;
}) {
  function clearText() {
    setInputText("");
  }

  return (
    <button
      disabled={inputText === ""}
      className={`button text-slate-500 ${
        inputText === "" ? "" : "hover:bg-red-800 hover:text-white"
      }`}
      onClick={() => clearText()}
    >
      Clear
    </button>
  );
}

function OptionButton({
  letter,
  enableState,
  isApplied,
  onClick,
  className,
  spanClass,
}: {
  letter: string;
  enableState: boolean;
  isApplied?: boolean;
  onClick: () => void;
  className: string;
  spanClass?: string;
}) {
  return (
    <button
      disabled={!enableState}
      onClick={onClick}
      className={`option-button font-extralight ${
        isApplied ? "bg-emerald-600 text-white" : ""
      } ${className}`}
    >
      <span
        className={`inline-block leading-none ${spanClass ? spanClass : ""}`}
      >
        {letter}
      </span>
    </button>
  );
}

export default App;
