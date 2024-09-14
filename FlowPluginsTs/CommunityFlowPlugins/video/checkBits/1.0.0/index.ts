import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from "../../../../FlowHelpers/1.0.0/interfaces/interfaces"

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = (): IpluginDetails => ({
  name: "Check Video Bits",
  description: "Check if a file is 8/10/12 bit video",
  style: {
    borderColor: "DeepPink",
  },
  tags: "video",
  isStartPlugin: false,
  pType: "",
  requiresVersion: "2.11.01",
  sidebarPosition: -1,
  icon: "faQuestion",
  inputs: [],
  outputs: [
    {
      number: 1,
      tooltip: "File is 8 bit video",
    },
    {
      number: 2,
      tooltip: "File is 10 bit video",
    },
    {
      number: 3,
      tooltip: "File is 12 bit video",
    },
  ],
})

type Bits = "8" | "10" | "12" | "unknown"

const mapping = { "8": 1, "10": 2, "12": 3 } as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = (args: IpluginInputArgs): IpluginOutputArgs => {
  const lib = require("../../../../../methods/lib")()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details)

  let bits: Bits = "unknown"

  if (Array.isArray(args?.inputFileObj?.ffProbeData?.streams)) {
    const videos = args.inputFileObj.ffProbeData.streams.filter((stream) => {
      return stream.codec_type === "video"
    })
    for (let i = 0; i < args.inputFileObj.ffProbeData.streams.length; i += 1) {
      const stream = args.inputFileObj.ffProbeData.streams[i]
      if (stream.bits_per_raw_sample === 8 || stream.pix_fmt === "yuv420p") {
        bits = "8"
      }
      if (
        stream.bits_per_raw_sample === 10 ||
        stream.pix_fmt === "yuv420p10le"
      ) {
        bits = "10"
      }
      if (
        stream.bits_per_raw_sample === 12 ||
        stream.pix_fmt === "yuv420p12le"
      ) {
        bits = "12"
      }
    }
  } else {
    throw new Error("File has no stream data")
  }

  if (bits === "unknown") {
    throw new Error("File is not 8/10/12 bit video")
  }

  return {
    outputFileObj: args.inputFileObj,
    outputNumber: mapping[bits],
    variables: args.variables,
  }
}
export { details, plugin }
