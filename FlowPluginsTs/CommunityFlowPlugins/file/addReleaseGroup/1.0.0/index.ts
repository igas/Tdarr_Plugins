import fileMoveOrCopy from '../../../../FlowHelpers/1.0.0/fileMoveOrCopy';
import {
  getContainer,
  getFileAbosluteDir,
  getFileName,
} from '../../../../FlowHelpers/1.0.0/fileUtils';
import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from '../../../../FlowHelpers/1.0.0/interfaces/interfaces';

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = (): IpluginDetails => ({
  name: 'Rename File (add release group)',
  description: 'Replace release group in file name',
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
      label: 'Release group',
      name: 'releaseGroup',
      type: 'string',
      // eslint-disable-next-line no-template-curly-in-string
      defaultValue: 'xmirotvorecx',
      inputUI: {
        type: 'text',
      },
      // eslint-disable-next-line no-template-curly-in-string
      tooltip:
        'Specify a release group to add to the file name. The release group will be added before the file extension.',
    },
  ],
  outputs: [
    {
      number: 1,
      tooltip: 'Renamed',
    },
    {
      number: 2,
      tooltip: 'Not Renamed',
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = async (args: IpluginInputArgs): Promise<IpluginOutputArgs> => {
  const lib = require('../../../../../methods/lib')();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details);

  const fileName = args.inputFileObj.meta?.FileName || '';
  const container = getContainer(args.inputFileObj._id);
  const regex = new RegExp(`]-[A-Za-z0-9]+.${container}$`);

  const newName = fileName
    .trim()
    .replace(regex, `]-${args.inputs.releaseGroup}.${container}`);

  const fileDir = getFileAbosluteDir(args.inputFileObj._id);
  const newPath = `${fileDir}/${newName}`;

  if (args.inputFileObj._id === newPath) {
    args.jobLog('Input and output path are the same, skipping rename.');

    return {
      outputFileObj: {
        _id: args.inputFileObj._id,
      },
      outputNumber: 2,
      variables: args.variables,
    };
  }

  await fileMoveOrCopy({
    operation: 'move',
    sourcePath: args.inputFileObj._id,
    destinationPath: newPath,
    args,
  });

  return {
    outputFileObj: {
      _id: newPath,
    },
    outputNumber: 1,
    variables: args.variables,
  };
};
export { details, plugin };
