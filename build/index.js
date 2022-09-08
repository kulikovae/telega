"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
let currentStake;
let stakeMessage = "My validator stake is ";
let newLine = "\n";
let blockHeight = "Current block height is ";
let conectionPeers = "Reachable peers are ";
let producedblocks = "Produced blocks 0";
let expectedblocks = "Expected blocks 0";
let validatorstatus = "My validator status is: ";
let buildversion = "Version build is ";
let telegramMessage = '';
const stake = "near_current_stake";
const bn = "near_block_number";
const near = ' NEARs';
const peers = "near_peer_reachable";
const prod = "near_epoch_block_produced_number";
const expect = "near_epoch_block_expected_number";
const status = "near_is_validator";
const build = "near_version_build";
function getNearMetric(metric) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)('http://135.181.194.212:9090/api/v1/query?query=' + metric, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!response.ok) {
                console.log(`Error! status: ${response.status}`);
            }
            const result = (yield response.json());
            return result.data.result[0].value[1];
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
                return error.message;
            }
            else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
            }
        }
    });
}
function sendToTelegram(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false,
                disable_notification: false,
                reply_to_message_id: null,
                chat_id: '@nearkulikovae'
            })
        };
        const response = yield (0, node_fetch_1.default)('https://api.telegram.org/bot5621198298:AAFvCLCvzFZDQ-RBxiRPao8BFH9jYjiXFYk/sendMessage', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
        return response;
    });
}
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        stakeMessage = stakeMessage + (yield getNearMetric(stake)) + near;
        blockHeight = blockHeight + (yield getNearMetric(bn));
        conectionPeers = conectionPeers + (yield getNearMetric(peers));
        producedblocks = producedblocks + (yield getNearMetric(prod));
        expectedblocks = expectedblocks + (yield getNearMetric(expect));
        buildversion = buildversion + (yield getNearMetric(build));
        let isValidator = yield getNearMetric(status);
        if (isValidator == 1) {
            validatorstatus = validatorstatus + "current";
        }
        telegramMessage = telegramMessage + stakeMessage + newLine
            + blockHeight + newLine
            + conectionPeers + newLine
            + producedblocks + newLine
            + expectedblocks + newLine
            + validatorstatus + newLine
            + buildversion + newLine;
        yield sendToTelegram(telegramMessage);
    });
}
sendMessage();
