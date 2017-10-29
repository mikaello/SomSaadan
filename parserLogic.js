// @flow

type Segment = {
  substring: string,
  duration: number,
};

type Transcription = {
  formattedString: string,
  segments: Array<Segment>,
};

type TextEvent = {
  transcriptions: Array<Transcription>,
  isFinal: boolean,
};
