import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

function App() {

  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);

  // Load saved content
  useEffect(() => {

    const savedText = localStorage.getItem("editorContent");

    if (savedText && editorRef.current) {
      editorRef.current.innerHTML = savedText;
      updateWordCount();
    }

  }, []);

  // Text formatting
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  // Word counter + autosave
  const updateWordCount = () => {

    const text = editorRef.current.innerText;

    const words = text.trim().split(/\s+/).filter(Boolean);

    setWordCount(words.length);

    localStorage.setItem("editorContent", editorRef.current.innerHTML);
  };

  // Clear editor
  const clearText = () => {

    editorRef.current.innerHTML = "";
    localStorage.removeItem("editorContent");
    setWordCount(0);
  };

  // Export PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    const text = editorRef.current.innerText;

    doc.text(text, 10, 10);

    doc.save("document.pdf");
  };

  // Export Word
  const exportWord = () => {

    const text = editorRef.current.innerText;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph(text)
          ]
        }
      ]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "document.docx");
    });

  };

  return (

    <div className="editor-wrapper">

      <h1>✨ Smart Document Editor</h1>

      <div className="toolbar">

        <button onClick={() => formatText("bold")}>
          B
        </button>

        <button onClick={() => formatText("italic")}>
          I
        </button>

        <button onClick={() => formatText("underline")}>
          U
        </button>

        <div className="toolbar-divider"></div>

        <button onClick={() => formatText("insertUnorderedList")}>
          • List
        </button>

        <div className="toolbar-divider"></div>

        <button onClick={exportPDF}>
          PDF
        </button>

        <button onClick={exportWord}>
          DOCX
        </button>

        <div className="toolbar-divider"></div>

        <button onClick={clearText}>
          Clear
        </button>

      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable
        onInput={updateWordCount}
      ></div>

      <div className="word-count">
        Words: {wordCount}
      </div>

    </div>
  );
}

export default App;