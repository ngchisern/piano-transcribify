# piano-transcribify

This project allows users to upload a piano audio file and receive a visualized MIDI transcription. The application uses a Python Flask server for the backend, Celery for background tasks, Redis as a message broker, and a React application for the frontend.

## Running the application

The application comprises four main parts: the frontend, the server, the Redis broker, and the Celery worker. Each of these runs in its own process.

### 1. Frontend
Start the React development server. By default, this runs on port 5173.
```
cd frontend
npm run dev
```

### 2. Server
In a new terminal window, start the Flask server. This will run on port 8000.
```
cd backend
flask run --host 0.0.0.0 --port 8000 --debug
```

### 3. Broker & Result Backend:
In another terminal window, start the Redis server. By default, Redis runs on port 6379.
```
redis-server
```

### 4. Background Task:
Finally, start the Celery worker in another terminal window.
```
cd backend
celery -A transcription.tasks.celery worker --loglevel=info
```

Now, you should be able to access the application at http://localhost:5173.
