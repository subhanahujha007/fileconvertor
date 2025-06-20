import {
  BsFillImageFill,
  BsFileEarmarkTextFill,
  BsFillCameraVideoFill,
} from "react-icons/bs";
import { PiSpeakerSimpleHighFill } from "react-icons/pi";
import { AiFillFile } from "react-icons/ai";
import type { ReactElement } from "react";

export default function fileToIcon(file_type: string): ReactElement {
  if (file_type.includes("video")) return <BsFillCameraVideoFill />;
  if (file_type.includes("audio")) return <PiSpeakerSimpleHighFill />;
  if (file_type.includes("text")) return <BsFileEarmarkTextFill />;
  if (file_type.includes("image")) return <BsFillImageFill />;
  return <AiFillFile />;
}
