import fetch from 'node-fetch';

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
const prod = "near_epoch_block_produced_number"
const expect = "near_epoch_block_expected_number"
const status = "near_is_validator"
const build = "near_version_build";

async function getNearMetric(metric: string) {
          try {
            const response = await fetch('http://135.181.194.212:9090/api/v1/query?query=' + metric, {
              method: 'POST',
              headers: {
                   Accept: 'application/json',
                         },
             });

             if (!response.ok) {
             console.log(`Error! status: ${response.status}`);
             }
                              
             const result = (await response.json());
                             
             return result.data.result[0].value[1];
                            
          } catch (error) {
          if (error instanceof Error) {
                  console.log('error message: ', error.message);
                  return error.message;
          } else {
                  console.log('unexpected error: ', error);
                  return 'An unexpected error occurred';
          }
                } 
}

async function sendToTelegram(message : string) {
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
      
      const response = await fetch('https://api.telegram.org/bot5621198298:AAFvCLCvzFZDQ-RBxiRPao8BFH9jYjiXFYk/sendMessage', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    return response
}

async function sendMessage() {
    stakeMessage = stakeMessage + await getNearMetric(stake) + near;
    blockHeight = blockHeight + await getNearMetric(bn);
    conectionPeers = conectionPeers + await getNearMetric(peers);
    producedblocks = producedblocks + await getNearMetric(prod);
    expectedblocks = expectedblocks + await getNearMetric(expect);
    buildversion = buildversion + await getNearMetric(build);

    let isValidator = await getNearMetric(status);
    if (isValidator == 1)
    {
        validatorstatus = validatorstatus + "current";
    }


    telegramMessage = telegramMessage + stakeMessage + newLine
                        + blockHeight + newLine
                        + conectionPeers + newLine
                        + producedblocks + newLine
                        + expectedblocks + newLine
                        + validatorstatus + newLine
                        + buildversion + newLine;

    await sendToTelegram(telegramMessage);
}


sendMessage();