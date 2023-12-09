import classes from "../styles/Message.module.css";
import { IconButton } from "rsuite";
import SortDownIcon from "@rsuite/icons/SortDown";

export default function FileOthers(props) {
  async function hanldeDocDownload() {
    const fetchUrl = await fetch(
      `${process.env.REACT_APP_IMAGE_URL}/img/files/${props.file.file}`
    );
    const res = await fetchUrl.blob();

    const url = window.URL.createObjectURL(res);

    const anchor = document.createElement("a");
    anchor.href = url;

    anchor.setAttribute("download", `${props.file.file}`);

    document.body.appendChild(anchor);
    anchor.click();
  }

  return (
    <div className={classes.document__file}>
      <div className={`flex ${classes.documents__cont}`}>
        <div>
          <img
            src={`/file/${props.file.type ? props.file.type : "DEFAULT"}.png`}
          />
        </div>
        <div className={classes.doc__cnt}>
          <p className={classes.doc__name}> {props.file.file} </p>
          <p className={classes.doc__details}>
            <span>{props.file.type}</span>
            <span>.</span>
            <span>{props.file.size} </span>
          </p>
        </div>
        <div>
          <IconButton onClick={hanldeDocDownload} icon={<SortDownIcon />} />
        </div>
      </div>
    </div>
  );
}
