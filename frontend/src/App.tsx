import { useState } from 'react';
import Upload from './components/Upload';
import MidiPlayerComponent from './components/MidiPlayer';

function App() {
  // TBD
  const [midi, setMidi] = useState<string | null>(null);

  return (
    <div className="App">
      <h1>Audio to MIDI Transcriber</h1>
      <Upload midi={midi}/>
    </div>
  );
}

export default App;

