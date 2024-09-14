/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import { checkFfmpegCommandInit } from "../../../../FlowHelpers/1.0.0/interfaces/flowUtils"
import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from "../../../../FlowHelpers/1.0.0/interfaces/interfaces"

/* eslint-disable no-param-reassign */
const details = (): IpluginDetails => ({
  name: "Set Channels Count",
  description: "Set the channel count",
  style: {
    borderColor: "DeepPink",
  },
  tags: "audio",
  isStartPlugin: false,
  pType: "",
  requiresVersion: "2.11.01",
  sidebarPosition: -1,
  icon: "",
  inputs: [
    {
      label: "Channel Count",
      name: "channelCount",
      type: "number",
      defaultValue: "6",
      inputUI: {
        type: "dropdown",
        options: ["2", "6", "8"],
      },
      tooltip: "Specify number of channels in the output file",
    },
  ],
  outputs: [
    {
      number: 1,
      tooltip: "Continue to next plugin",
    },
  ],
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = async (args: IpluginInputArgs): Promise<IpluginOutputArgs> => {
  const lib = require("../../../../../methods/lib")()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details)

  checkFfmpegCommandInit(args)

  for (let i = 0; i < args.variables.ffmpegCommand.streams.length; i += 1) {
    const stream = args.variables.ffmpegCommand.streams[i]

    if (stream.codec_type === "audio") {
      const numberOfChannels = Number(args.inputs.channelCount)

      if (stream.channels !== numberOfChannels) {
        args.variables.ffmpegCommand.shouldProcess = true

        stream.outputArgs.push(
          "-ac:a:{outputTypeIndex}",
          String(numberOfChannels)
        )
      }
    }
  }

  return {
    outputFileObj: args.inputFileObj,
    outputNumber: 1,
    variables: args.variables,
  }
}
export { details, plugin }
