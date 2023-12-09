import React, { useEffect, useState } from "react";
import classes from "../styles/Message.module.css";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import { BiSolidDownload } from "react-icons/bi";

const FileMessage = (props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  async function handleImageDownload(imageUrl) {
    const fetchUrl = await fetch(
      `${process.env.REACT_APP_IMAGE_URL}/img/files/${imageUrl}`
    );
    const res = await fetchUrl.blob();

    const url = window.URL.createObjectURL(res);

    const anchor = document.createElement("a");
    anchor.href = url;

    anchor.setAttribute("download", `${imageUrl}`);

    document.body.appendChild(anchor);
    anchor.click();
  }

  async function fetchThumbnails() {
    const fetchUrl = await fetch(
      `${process.env.REACT_APP_IMAGE_URL}/video/poster/${props.fileMessage}`
    );
    const res = await fetchUrl.blob();

    const url = window.URL.createObjectURL(res);
    setThumbnailUrl(url);
  }

  useEffect(() => {
    if (props.fileMessage.includes(".mp4")) {
      fetchThumbnails();
    }
  }, []);

  function playVideo() {
    const video = document.getElementById(`video--${props.fileMessage}`);
    video.setAttribute("controls", "controls");
    video.play();
    if (!videoIsPlaying) {
      setVideoIsPlaying(true);
    } else {
      setVideoIsPlaying(false);
    }
  }

  return (
    <div className={classes.file__message}>
      {!props.me && props.message.conversation.isGroup && (
        <div className="absolute top-0.5 left-[-37px]">
          <img
            src={`${process.env.REACT_APP_IMAGE_URL}/img/users/${props.message.sender.photo}`}
            alt=""
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
      <div>
        {props.fileMessage.includes(".jpeg") ? (
          <div style={{ position: "relative" }}>
            <img
              crossorigin="anonymous"
              src={`${process.env.REACT_APP_IMAGE_URL}/img/files/${props.fileMessage}`}
              alt=""
            />
            <div className={classes.actions}>
              <button onClick={() => handleImageDownload(props.fileMessage)}>
                <BiSolidDownload />
              </button>
            </div>
          </div>
        ) : (
          <>
            {props.fileMessage.includes(".mp4") && (
              <div className={classes.video__player}>
                <video
                  poster={thumbnailUrl}
                  id={`video--${props.fileMessage}`}
                  muted
                  crossOrigin="anonymous"
                >
                  <source
                    src={`${process.env.REACT_APP_IMAGE_URL}/video/${props.fileMessage}`}
                    type="video/mp4"
                  ></source>
                </video>
                {!videoIsPlaying && (
                  <button onClick={playVideo}>
                    <FaPlay />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileMessage;
