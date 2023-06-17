from werkzeug.utils import secure_filename
import os

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from transcription.tasks import transcribe_audio

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']

    if not file.filename:
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join('uploads', filename)
    file.save(file_path)

    task = transcribe_audio.delay(file_path)
    return jsonify({'task_id': str(task.id)}), 200


@app.route('/transcription/<task_id>', methods=['GET'])
def get_task_status(task_id):
    task = transcribe_audio.AsyncResult(task_id)
    response = {'state': task.state, 'status': task.info}
    return jsonify(response)


@app.route('/download/<task_id>', methods=['GET'])
def download_file(task_id):
    file_path = os.path.join('mids', f'{task_id}.mid')
    return send_file(file_path, as_attachment=True,
                     download_name='audio.mid', mimetype='audio/midi')


if __name__ == '__main__':
    app.run()
