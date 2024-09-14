"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () { return ({
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
}); };
exports.details = details;
var mapping = { "8": 1, "10": 2, "12": 3 };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var _a, _b;
    var lib = require("../../../../../methods/lib")();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    var bits = "unknown";
    if (Array.isArray((_b = (_a = args === null || args === void 0 ? void 0 : args.inputFileObj) === null || _a === void 0 ? void 0 : _a.ffProbeData) === null || _b === void 0 ? void 0 : _b.streams)) {
        var videos = args.inputFileObj.ffProbeData.streams.filter(function (stream) {
            return stream.codec_type === "video";
        });
        videos.forEach(function (stream) {
            if (stream.bits_per_raw_sample === 8 || stream.pix_fmt === "yuv420p") {
                bits = "8";
            }
            if (stream.bits_per_raw_sample === 10 ||
                stream.pix_fmt === "yuv420p10le") {
                bits = "10";
            }
            if (stream.bits_per_raw_sample === 12 ||
                stream.pix_fmt === "yuv420p12le") {
                bits = "12";
            }
        });
    }
    else {
        throw new Error("File has no stream data");
    }
    if (bits === "unknown") {
        throw new Error("File is not 8/10/12 bit video");
    }
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: mapping[bits],
        variables: args.variables,
    };
};
exports.plugin = plugin;
