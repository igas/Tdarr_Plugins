import os from "os"
import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from "../../../../FlowHelpers/1.0.0/interfaces/interfaces"
import { checkFfmpegCommandInit } from "../../../../FlowHelpers/1.0.0/interfaces/flowUtils"

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = (): IpluginDetails => ({
  name: "8 Bit Video",
  description: "Set 8 Bit Video",
  style: {
    borderColor: "DeepPink",
  },
  tags: "video",
  isStartPlugin: false,
  pType: "",
  requiresVersion: "2.11.01",
  sidebarPosition: -1,
  icon: "",
  inputs: [],
  outputs: [
    {
      number: 1,
      tooltip: "Continue to next plugin",
    },
  ],
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = (args: IpluginInputArgs): IpluginOutputArgs => {
  const lib = require("../../../../../methods/lib")()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details)

  checkFfmpegCommandInit(args)

  for (let i = 0; i < args.variables.ffmpegCommand.streams.length; i += 1) {
    const stream = args.variables.ffmpegCommand.streams[i]
    if (stream.codec_type === "video") {
      if (
        stream.outputArgs.some((row) => row.includes("qsv")) &&
        os.platform() !== "win32"
      ) {
        stream.outputArgs.push("-vf", "scale_qsv=format=yuv420p")
      } else {
        stream.outputArgs.push("-pix_fmt:v:{outputTypeIndex}", "yuv420p")
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
