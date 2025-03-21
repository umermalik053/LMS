import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
   const handleOnChange = (content) => {
      setInput({...input, description: content });
   }
  return <ReactQuill theme="snow" value={input.description} onChange={handleOnChange} />;
};

export default RichTextEditor;
