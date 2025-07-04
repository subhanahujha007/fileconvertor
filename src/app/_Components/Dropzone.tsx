// @ts-nocheck
'use client'

import { FiUploadCloud } from "react-icons/fi";
import { LuFileSymlink } from "react-icons/lu";
import { MdClose, MdDone } from "react-icons/md";
import ReactDropzone from "react-dropzone";
import bytesToSize from "@/utils/bytes-to-size";
import fileToIcon from "@/utils/file-to-icon";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import compressFileName from "@/utils/compress-file-name";
import { Skeleton } from "@/components/ui/skeleton";
import convertFile from "@/utils/convert";
import { ImSpinner3 } from "react-icons/im";
import { Badge } from "@/components/ui/badge";
import { HiOutlineDownload } from "react-icons/hi";
import { BiError } from "react-icons/bi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import loadFfmpeg from "@/utils/load-fffpmg";
import type { Action } from "../../../types";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const extensions = {
  image: [
    "jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "svg", "raw", "tga"
  ],
  video: [
    "mp4", "m4v", "mp4v", "3gp", "3g2", "avi", "mov", "wmv", "mkv", "flv", "ogv", "webm", "h264", "264", "hevc", "265"
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"]
};

export default function Dropzone() {
  const [is_hover, setIsHover] = useState(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [is_loaded, setIsLoaded] = useState(false);
  const [is_converting, setIsConverting] = useState(false);
  const [is_done, setIsDone] = useState(false);
  const ffmpegRef = useRef<any>(null);
  const [defaultValues, setDefaultValues] = useState("video");
  const [selcted, setSelected] = useState("...");

  const accepted_files = {
    "image/*": extensions.image.map((ext) => `.${ext}`),
    "audio/*": [],
    "video/*": [],
  };

  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const downloadAll = () => {
    for (const action of actions) {
      !action.is_error && download(action);
    }
  };

  const download = (action: Action) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };

  const convert = async () => {
    let tmp_actions = actions.map((elt) => ({
      ...elt,
      is_converting: true,
    }));
    setActions(tmp_actions);
    setIsConverting(true);
    for (let action of tmp_actions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? { ...elt, is_converted: true, is_converting: false, url, output }
            : elt
        );
        setActions(tmp_actions);
      } catch {
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? { ...elt, is_converted: false, is_converting: false, is_error: true }
            : elt
        );
        setActions(tmp_actions);
      }
    }
    setIsDone(true);
    setIsConverting(false);
  };

  const handleUpload = (data: Array<any>) => {
    handleExitHover();
    setFiles(data);
    const tmp: Action[] = data.map((file) => ({
      file_name: file.name,
      file_size: file.size,
      from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
      to: null,
      file_type: file.type,
      file,
      is_converted: false,
      is_converting: false,
      is_error: false,
    }));
    setActions(tmp);
  };

  const handleHover = () => setIsHover(true);
  const handleExitHover = () => setIsHover(false);

  const updateAction = (file_name: string, to: string) => {
    setActions(
      actions.map((action) =>
        action.file_name === file_name ? { ...action, to } : action
      )
    );
  };

  const checkIsReady = () => {
    setIsReady(actions.every((action) => !!action.to));
  };

  const deleteAction = (action: Action) => {
    setActions(actions.filter((elt) => elt !== action));
    setFiles(files.filter((elt) => elt.name !== action.file_name));
  };

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else checkIsReady();
  }, [actions]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFfmpeg();
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  };

  // === RETURN UI ===
  if (actions.length) {
    return (
      <div className="space-y-6">
        {actions.map((action, i) => (
          <div
            key={i}
            className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between"
          >
            {!is_loaded && (
              <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
            )}
            <div className="flex gap-4 items-center">
              <span className="text-2xl text-orange-600">{fileToIcon(action.file_type)}</span>
              <div className="flex items-center gap-1 w-96">
                <span className="text-md font-medium overflow-x-hidden">{compressFileName(action.file_name)}</span>
                <span className="text-muted-foreground text-sm">({bytesToSize(action.file_size)})</span>
              </div>
            </div>

            {action.is_error ? (
              <Badge variant="destructive" className="flex gap-2">
                <span>Error Converting File</span>
                <BiError />
              </Badge>
            ) : action.is_converted ? (
              <Badge variant="default" className="flex gap-2 bg-green-500">
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.is_converting ? (
              <Badge variant="default" className="flex gap-2">
                <span>Converting</span>
                <span className="animate-spin">
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className="text-muted-foreground text-md flex items-center gap-4">
                <span>Convert to</span>
                <Select
                  onValueChange={(value) => {
                    if (extensions.audio.includes(value)) {
                      setDefaultValues("audio");
                    } else if (extensions.video.includes(value)) {
                      setDefaultValues("video");
                    }
                    setSelected(value);
                    updateAction(action.file_name, value);
                  }}
                  value={selcted}
                >
                  <SelectTrigger className="w-32 text-center text-muted-foreground bg-background text-md font-medium">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent className="h-fit">
                    {action.file_type.includes("image") && (
                      <div className="grid grid-cols-2 gap-2 w-fit">
                        {extensions.image.map((elt, i) => (
                          <SelectItem key={i} value={elt} className="mx-auto">
                            {elt}
                          </SelectItem>
                        ))}
                      </div>
                    )}
                    {action.file_type.includes("video") && (
                      <Tabs defaultValue={defaultValues} className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="video" className="w-full">Video</TabsTrigger>
                          <TabsTrigger value="audio" className="w-full">Audio</TabsTrigger>
                        </TabsList>
                        <TabsContent value="video">
                          <div className="grid grid-cols-3 gap-2 w-fit">
                            {extensions.video.map((elt, i) => (
                              <SelectItem key={i} value={elt} className="mx-auto">
                                {elt}
                              </SelectItem>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="audio">
                          <div className="grid grid-cols-3 gap-2 w-fit">
                            {extensions.audio.map((elt, i) => (
                              <SelectItem key={i} value={elt} className="mx-auto">
                                {elt}
                              </SelectItem>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                    {action.file_type.includes("audio") && (
                      <div className="grid grid-cols-2 gap-2 w-fit">
                        {extensions.audio.map((elt, i) => (
                          <SelectItem key={i} value={elt} className="mx-auto">
                            {elt}
                          </SelectItem>
                        ))}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {action.is_converted ? (
              <Button variant="outline" onClick={() => download(action)}>
                Download
              </Button>
            ) : (
              <span
                onClick={() => deleteAction(action)}
                className="cursor-pointer hover:bg-muted rounded-full h-10 w-10 flex items-center justify-center text-2xl text-foreground"
              >
                <MdClose />
              </span>
            )}
          </div>
        ))}
        <div className="flex w-full justify-end">
          {is_done ? (
            <div className="space-y-4 w-fit">
              <Button size="lg" className="rounded-xl font-semibold relative py-4 text-md flex gap-2 items-center w-full" onClick={downloadAll}>
                {actions.length > 1 ? "Download All" : "Download"} <HiOutlineDownload />
              </Button>
              <Button size="lg" onClick={reset} variant="outline" className="rounded-xl">
                Convert Another File(s)
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              disabled={!is_ready || is_converting}
              className="rounded-xl font-semibold relative py-4 text-md flex items-center w-44"
              onClick={convert}
            >
              {is_converting ? <span className="animate-spin text-lg"><ImSpinner3 /></span> : <span>Convert Now</span>}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ReactDropzone
      onDrop={handleUpload}
      onDragEnter={handleHover}
      onDragLeave={handleExitHover}
      accept={accepted_files}
      onDropRejected={() => {
        handleExitHover();
        toast.error("Error uploading your file(s)", {
          description: "Allowed Files: Audio, Video and Images.",
          duration: 5000,
        });
      }}
      onError={() => {
        handleExitHover();
        toast.error("Error uploading your file(s)", {
          description: "Allowed Files: Audio, Video and Images.",
          duration: 5000,
        });
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="bg-background h-72 lg:h-80 xl:h-96 rounded-3xl shadow-sm border-secondary border-2 border-dashed cursor-pointer flex items-center justify-center"
        >
          <input {...getInputProps()} />
          <div className="space-y-4 text-foreground">
            {is_hover ? (
              <>
                <div className="justify-center flex text-6xl">
                  <LuFileSymlink />
                </div>
                <h3 className="text-center font-medium text-2xl">Yes, right there</h3>
              </>
            ) : (
              <>
                <div className="justify-center flex text-6xl">
                  <FiUploadCloud />
                </div>
                <h3 className="text-center font-medium text-2xl">Click, or drop your files here</h3>
              </>
            )}
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}
