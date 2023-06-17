import React, { FC } from 'react';
import MidiPlayer from 'react-midi-player';

interface MidiPlayerProps {
  midiUrl: string;
}

const MidiPlayerComponent: FC<MidiPlayerProps> = ({ midiUrl }) => {
  return (
    <MidiPlayer url={midiUrl} />
  );
};

export default MidiPlayerComponent;

