import React, { useContext, useState } from "react";
import classes from "../styles/Messages.module.css";
import { ImCross } from "react-icons/im";
import { ChatContext } from "../shared/context/chatContext";
import ImageGallery from "react-image-gallery";
import VideoGallery from "./VideoGallery";
import DocumentGallery from "./DocumentGallery";

import "react-image-gallery/styles/css/image-gallery.css";
const FilePreviewer = () => {
  const [activeTab, setActiveTab] = useState(1);

  const chatCtx = useContext(ChatContext);
  const images = [];

  chatCtx.files
    .filter((file) => file.type.includes("image"))
    .map((file) =>
      images.push({
        original: file.filePreview,
        thumbnail: file.filePreview,
      })
    );

  const videoFiles = chatCtx.files.filter((file) =>
    file.type.includes("video")
  );

  const documentFiles = chatCtx.files.filter((file) =>
    file.type.includes("doc")
  );

  return (
    <div className={classes.file__previewer}>
      <div className={classes.inner__preview}>
        <header className={classes.preview__header}>
          <button
            onClick={() => chatCtx.setSelectedFiles(null)}
            className={classes.cross}
          >
            <ImCross />
          </button>
          <div className={classes.select__tabs}>
            <button
              onClick={() => setActiveTab(1)}
              className={activeTab === 1 && classes.active}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={activeTab === 2 && classes.active}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={activeTab === 3 && classes.active}
            >
              Documents
            </button>
          </div>
        </header>
        <div className={classes.images__wrapper}>
          {activeTab === 1 && (
            <ImageGallery
              useBrowserFullscreen={false}
              showPlayButton={false}
              sizes={40}
              thumbnailClass={"gallery"}
              items={images}
            />
          )}

          {activeTab === 2 && videoFiles.length > 0 && (
            <VideoGallery files={videoFiles} />
          )}
          {activeTab === 3 && documentFiles.length > 0 && (
            <DocumentGallery files={documentFiles} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewer;
