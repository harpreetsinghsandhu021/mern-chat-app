import React, { useState, useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import classes from "../styles/Messages.module.css";

const EmojiPickerApp = ({ textRef, message, setMessage }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  function handleEmoji(emoji) {
    const ref = textRef.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    const newText = start + emoji.emoji + end;
    setMessage(newText);
    setCursorPosition(start.length + emoji.length);
  }
  return (
    <div className="ps-relative">
      <button
        type="reset"
        onClick={() => setShowPicker((prevShow) => !prevShow)}
      >
        <BsEmojiSmile />
      </button>
      {showPicker && (
        <div className={classes.emoji__wrapper}>
          <EmojiPicker
            onEmojiClick={handleEmoji}
            className={classes.emoji__picker}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerApp;
