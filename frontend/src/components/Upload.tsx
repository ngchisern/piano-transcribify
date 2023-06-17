import { ChangeEvent, useState, useEffect } from "react";
import { LinearProgress, Typography } from "@mui/joy";
import { MuiFileInput } from "mui-file-input"

import axios from "axios";


type UploadProps = {
  midi: string | null;
};

enum TranscriptionStatus {
  PENDING = "PENDING",
  STARTED = "STARTED",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

function Upload({ midi }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<TranscriptionStatus | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    const resp = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setTaskId(resp.data.task_id);
  };
  
  useEffect(() => {
    const getTranscriptionStatus = () => { 
      // check task status every 1 second 
      axios.get(`/api/transcription/${taskId}`).then((resp) => {
        const state = resp.data.state;
        const status = resp.data.status;

        if (state === "SUCCESS") {
          setStatus(TranscriptionStatus.SUCCESS);
          return;
        } else if (state === "FAILURE") {
          setStatus(TranscriptionStatus.FAILURE);
          return;
        } else {
          setTimeout(getTranscriptionStatus, 1000);
        }
        
        if (status) {
          setProgress(status['current'] / status['total']);
        }
      });
    };

    if (taskId) {
      setStatus(TranscriptionStatus.STARTED);
      setProgress(0);
      getTranscriptionStatus();
    }
  }, [taskId]);

  return (
    <div>
      <input type="file" accept=".mp3" onChange={onChange} />
      <button onClick={onSubmit}>Submit</button>
      { status === TranscriptionStatus.STARTED && progress !== null ?
      <LinearProgress
        determinate
        variant="outlined"
        color="neutral"
        size="sm"
        thickness={32}
        value={progress * 100}
        sx={{
          '--LinearProgress-radius': '0px',
          '--LinearProgress-progressThickness': '24px',
          color: 'neutral.100',
          boxShadow: 'sm',
          borderColor: 'neutral.500',
        }}
      >
        <Typography
          level="body3"
          fontWeight="xl"
          textColor="common.white"
          sx={{ mixBlendMode: 'difference' }}
        >
          LOADING… {`${Math.round(progress * 100)}%`}
        </Typography>
      </LinearProgress>
      :
      <div>No file is being processed.</div>
      }
      { status === TranscriptionStatus.SUCCESS && 
      <a href={`/api/download/${taskId}`} download>Download</a>
      }
    </div>
  );
}

export default Upload;
