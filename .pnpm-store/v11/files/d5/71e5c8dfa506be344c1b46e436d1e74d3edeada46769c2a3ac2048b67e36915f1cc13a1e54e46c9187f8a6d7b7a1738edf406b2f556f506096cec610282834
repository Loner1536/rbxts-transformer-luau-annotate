"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapToBlock = wrapToBlock;
var typescript_1 = __importDefault(require("typescript"));
function wrapToBlock(nodes) {
    if (Array.isArray(nodes)) {
        if (nodes.length === 1) {
            return nodes[0];
        }
        else {
            return typescript_1.default.factory.createBlock(nodes);
        }
    }
    return nodes;
}
