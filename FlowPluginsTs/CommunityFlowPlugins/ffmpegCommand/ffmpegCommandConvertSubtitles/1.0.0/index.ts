/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import { checkFfmpegCommandInit } from '../../../../FlowHelpers/1.0.0/interfaces/flowUtils';
import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from '../../../../FlowHelpers/1.0.0/interfaces/interfaces';

/* eslint-disable no-param-reassign */
const details = (): IpluginDetails => ({
  name: 'Convert Subtitles',
  description: 'Convert subtitles in the file',
  style: {
    borderColor: 'DeepPink',
  },
  tags: 'video',
  isStartPlugin: false,
  pType: '',
  requiresVersion: '2.11.01',
  sidebarPosition: -1,
  icon: '',
  inputs: [
    {
      label: 'Output Codec',
      name: 'outputCodec',
      type: 'string',
      defaultValue: 'copy',
      inputUI: {
        type: 'dropdown',
        options: ['copy', 'ass', 'srt', 'ssa', 'mov_text'],
      },
      tooltip: 'Specify codec for the subtitles',
    },
    {
      label: 'Preferred language',
      name: 'preferredLanguage',
      type: 'string',
      defaultValue: 'eng',
      inputUI: {
        type: 'dropdown',
        options: ['eng', 'rus'],
      },
      tooltip: 'Specify language to keep',
    },
  ],
  outputs: [
    {
      number: 1,
      tooltip: 'Continue to next plugin',
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = (args: IpluginInputArgs): IpluginOutputArgs => {
  const lib = require('../../../../../methods/lib')();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details);

  checkFfmpegCommandInit(args);

  const targetCodec = String(args.inputs.outputCodec);
  const preferredLanguage = String(args.inputs.preferredLanguage);

  args.variables.ffmpegCommand.streams.forEach((stream) => {
    if (stream.codec_type === 'subtitle'
      && stream.tags
      && stream.tags.language
      && preferredLanguage === stream.tags.language.toLowerCase()) {
      stream.outputArgs.push('-c:s:{outputTypeIndex}', targetCodec);
      stream.removed = false;
    }
  });

  return {
    outputFileObj: args.inputFileObj,
    outputNumber: 1,
    variables: args.variables,
  };
};

export { details, plugin };
