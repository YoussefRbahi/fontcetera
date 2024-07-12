import { useEffect, useState } from "react";
import { string_to_unicode_variant as toUnicodeVariant } from "string-to-unicode-variant";
import "./App.css";
import Logo from "./logo.svg";
import House from "./images/house-solid.svg?react";
import Circle from "./images/circle-info-solid.svg?react";

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
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isMoreOptions, setIsMoreOptions] = useState<boolean>(false);
  // const [saveText, setSaveText] = useState(false);

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

  const toggleMoreOptions = () => {
    setIsMoreOptions(!isMoreOptions);
  };

  // // Load data from storage when component mounts
  // useEffect(() => {
  //   chrome.storage.local.get("saveText", (result) => {
  //     if (result.saveText !== undefined) {
  //       setSaveText(result.saveText);
  //       console.log("Loaded saveText:", result.saveText);
  //     } else {
  //       console.log("No saveText found in storage, using default value");
  //     }
  //   });

  //   chrome.storage.local.get(["inputText", "selectedFont"], (result) => {
  //     if (result.inputText) {
  //       setInputText(result.inputText);
  //       console.log("Loaded input text:", result.inputText);
  //     } else {
  //       console.log("No input text found in local storage");
  //     }

  //     if (result.selectedFont) {
  //       setSelectedFont(result.selectedFont);
  //       console.log("Loaded selected font:", result.selectedFont);
  //     } else {
  //       console.log("No selected font found in local storage");
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   chrome.storage.local.get("saveText", (result) => {
  //     if (result.saveText !== saveText) {
  //       chrome.storage.local.set({ saveText }, () => {
  //         console.log("Saved settings to local storage:", saveText);
  //       });
  //     }
  //   });
  // }, [saveText]);

  // useEffect(() => {
  //   // Save text and font selection to local storage whenever they changes
  //   chrome.storage.local.set({ inputText, selectedFont });
  // }, [inputText, selectedFont]);

  useEffect(() => {
    let timerId: number | null = null;

    if (isCopied) {
      timerId = setTimeout(() => setIsCopied(false), 2000);
    }

    return () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
    };
  }, [isCopied]);

  useEffect(() => {
    setIsCopied(false);
  }, [inputText, selectedFont, isBold, isItalic, decorations]);
  return (
    <div className="w-64 m-0 bg-white grid  text-sm font-mono bg-gradient-to-br from-sky-50  to-amber-50 text-slate-600">
      <div>
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

        <div className={` relative px-4`}>
          <div className={`${isMoreOptions && "invisible"}`}>
            <div className={`grid gap-1 ${isMoreOptions && "invisible"}`}>
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
                  title="Bold"
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
                  title="Italic"
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
                  title="Underline"
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
                  title="Strikethrough"
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
                  title="Overline"
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
          {isMoreOptions && <MoreOptions />}
        </div>

        <div className="flex relative py-2 border-t border-slate-300 px-4  align-middle justify-between">
          <span
            className={`absolute button text-[0.8rem] px-0 font-light ${
              !isMoreOptions && "invisible"
            }`}
          >
            Version 1.0.0
          </span>
          <div className={`flex w-2/3 gap-1 ${isMoreOptions && "invisible"}`}>
            <CopyToClipboard
              copiableText={formattedText}
              isCopied={isCopied}
              setIsCopied={setIsCopied}
            />
            <ClearText inputText={inputText} setInputText={setInputText} />
          </div>
          <button
            className=""
            title={isMoreOptions ? "Home" : "More"}
            onClick={() => {
              toggleMoreOptions();
            }}
          >
            {isMoreOptions ? (
              <House className="fill-emerald-600 hover:fill-emerald-800 h-6 -translate-y-0.5" />
            ) : (
              <Circle className="fill-emerald-600 hover:fill-emerald-800 h-6 -translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyToClipboard({
  copiableText,
  isCopied,
  setIsCopied,
}: {
  copiableText: string;
  isCopied: boolean;
  setIsCopied: (isCopied: boolean) => void;
}) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      disabled={isCopied}
      className={`button  text-white ${
        isCopied
          ? "disabled:text-emerald-600 disabled:bg-transparent  "
          : " hover:bg-emerald-800 disabled:hover:bg-emerald-600 disabled:text-white bg-emerald-600 disabled:opacity-30"
      }`}
      onClick={() => {
        copyToClipboard(copiableText);
      }}
    >
      {isCopied ? "Copied" : "Copy"}
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
      className={`button ${
        inputText === "" ? "" : "hover:bg-red-800 hover:text-white"
      }`}
      onClick={() => clearText()}
    >
      Clear
    </button>
  );
}

function OptionButton({
  title,
  letter,
  enableState,
  isApplied,
  onClick,
  className,
  spanClass,
}: {
  title?: string;
  letter: string;
  enableState: boolean;
  isApplied?: boolean;
  onClick: () => void;
  className: string;
  spanClass?: string;
}) {
  return (
    <button
      title={title}
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

function MoreOptions({}) {
  return (
    <div className="flex flex-col gap-0 justify-start absolute h-full w-full px-4 top-0 left-0">
      <div className="">
        <h3 className="text-label tracking-widest text-emerald-600">About</h3>
        <p className="text-[0.8rem]">
          Fontcetera allows you to easily format your text with various Unicode
          fonts and styles.
        </p>
      </div>
      <div className=" hidden flex-col">
        <h2 className="text-label tracking-widest mt-4">Settings</h2>
        {/* <ul className="flex flex-col w-3/4 ">
          <li className="flex justify-between items-center">
            <label htmlFor="save">Save input:</label>
            <div className="block">
              {/* <button
                onClick={() => setSaveText(true)}
                className={`px-2 py-1 rounded ${
                  saveText
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                yes
              </button>
              |
              <button
                onClick={() => setSaveText(false)}
                className={`px-2 py-1 rounded ${
                  !saveText
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                no
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center">
            <label htmlFor="dark">Dark mode :</label>
            {/* <input
              title="Dark mode"
              id="dark"
              type="checkbox"
              checked={settings.darkMode}
              onChange={() =>
                setSettings({ ...settings, darkMode: !settings.darkMode })
              }
            /> 
            <span className="block text-xs translate-x-1/3 tracking-tighter text-slate-600">
              Coming soon
            </span>
          </li>
        </ul> */}
      </div>
      <div className="relative flex flex-col">
        <h2 className="text-label tracking-widest text-emerald-600 mt-4">
          How to use
        </h2>
        <ol className="list-decimal list-inside text-[0.8rem] leading-4 flex flex-col gap-1">
          <li>Enter text in the input field</li>
          <li>Select the font and styles</li>
          <li>Copy the formatted text and use it elsewhere</li>
        </ol>
      </div>

      <div className="absolute bottom-1 text-[0.8rem]">
        <span>Created by </span>
        <a
          href="https://rbahi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:underline font-bold"
        >
          Youssef Rbahi
        </a>
      </div>
    </div>
  );
}

export default App;
