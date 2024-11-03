"use strict";
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var flowUtils_1 = require("../../../../FlowHelpers/1.0.0/interfaces/flowUtils");
/* eslint-disable no-param-reassign */
var details = function () { return ({
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
            tooltip: 'Specify codec of the output file',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: 'Continue to next plugin',
        },
    ],
}); };
exports.details = details;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    (0, flowUtils_1.checkFfmpegCommandInit)(args);
    var targetCodec = String(args.inputs.outputCodec);
    args.variables.ffmpegCommand.streams.forEach(function (stream) {
        if (stream.codec_type === 'subtitle') {
            stream.outputArgs.push('-c:s:{outputTypeIndex}', targetCodec);
        }
    });
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;
