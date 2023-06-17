from celery import Celery
from piano_transcription_inference import PianoTranscription, sample_rate, load_audio
from transcription.progress_stream import ProgressStream
import sys


celery = Celery(__name__, broker='redis://localhost:6379/0',
                backend='redis://localhost:6379/0')


@celery.task(bind=True)
def transcribe_audio(self, file_path):
    old_stdout = sys.stdout
    sys.stdout = ProgressStream(self, sys.stdout)

    try:
        filename = self.request.id
        (audio, _) = load_audio(file_path, sr=sample_rate, mono=True)
        transcriptor = PianoTranscription(device='cpu')
        transcriptor.transcribe(audio, 'mids/{}.mid'.format(filename))
    finally:
        sys.stdout = old_stdout
