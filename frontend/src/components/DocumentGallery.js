import React, { useState } from "react";
import classes from "../styles/Messages.module.css";
import mime from "mime";

const DocumentGallery = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const type = mime
    .getExtension(props.files[activeIndex].file.type)
    .toUpperCase();

  let fileSize;

  if (props.files[activeIndex].file.size < 1024 * 1024) {
    fileSize = (props.files[activeIndex].file.size / 1024).toFixed(2) + " KB";
  } else {
    fileSize =
      (props.files[activeIndex].file.size / (1024 * 1024)).toFixed(2) + " MB";
  }

  return (
    <>
      <div className={classes.docs__wrapper}>
        <h5>{props.files[activeIndex].file.name}</h5>
      </div>
      <div className={classes.doc__preview}>
        <div className={classes.doc__preview__cnt}>
          <img
            className={classes.doc__img}
            src={`/preview/${type ? type : "DEFAULT"}.png`}
          />
          <h4> No Preview Available</h4>
          <p>
            {fileSize} - {type}
          </p>
        </div>
      </div>
      <div className={classes.video__bar}>
        {props.files.map((file, index) => {
          const fileType = mime.getExtension(file.file.type);

          return (
            <div
              onClick={() => setActiveIndex(index)}
              className={`${classes.doc__item} ${
                index === activeIndex && classes.video__active
              }`}
            >
              <img
                className={classes.doc__img}
                src={`/file/${fileType ? fileType : "DEFAULT"}.png`}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DocumentGallery;
