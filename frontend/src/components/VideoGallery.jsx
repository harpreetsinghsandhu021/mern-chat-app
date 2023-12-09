import React, { useState } from "react";
import classes from "../styles/Messages.module.css";
const VideoGallery = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className={classes.videos__wrapper}>
        <video src={props.files[activeIndex].filePreview} controls />
      </div>
      <div className={classes.video__bar}>
        {props.files.map((file, index) => (
          <div
            onClick={() => setActiveIndex(index)}
            className={`${classes.video__thumbnail} ${
              activeIndex === index && classes.video__active
            }`}
          >
            <video src={file.filePreview} />
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoGallery;
