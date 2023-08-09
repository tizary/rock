const readline = require('readline-sync');
var secureRandom = require('secure-random')
const crypto = require('crypto');

const arr = process.argv.slice(2);
const maxLen = arr.length;
if (maxLen > 2 && maxLen % 2 === 1) {
  const duplicate = arr.filter(
    (item, index, array) => array.indexOf(item) !== index
  );
  if (duplicate.length > 0) {
    console.log("arguments must not be repeated");
  } else {

    const HMACkey = randomSecureValue()
    const compMoveNumber = randomInt(maxLen);
    const moveComp = arr[compMoveNumber-1];
    const HMAC = createHashValue(moveComp + HMACkey)
    console.log(`HMAC: ${HMAC}`);

    const move = availableMoves(arr);
    rec(move, moveComp);

    console.log(`HMAC key: ${HMACkey}`);
  }
} else {
  console.log("enter an odd number (3 or more) of unique arguments");
}

function createHashValue(value) {
  const hash = crypto.createHash("SHA3-256")
  const finalHex = hash.update(value).digest("hex")
  return finalHex
}

function randomSecureValue() {
  const data = secureRandom.randomBuffer(256)
  return createHashValue(data)
}

function randomInt(value) {
  let rand = 1 + Math.random() * value;
  return Math.floor(rand);
}

function availableMoves(array) {
  console.log("Available moves:");
  array.forEach((item, index) => {
    console.log(`${index+1} - ${item}`);
  })
  console.log(`0 - exit`);
  console.log(`? - help`);

  return readline.question("Enter your move:");
}

function rec(move, moveComp) {
  if (+move > 0 && +move <= maxLen) {
    const moveUser = arr[move-1];

    console.log(`Your move: ${moveUser}`);
    console.log(`Computer move: ${moveComp}`);

    const resultObj = winComb();
    console.log(`You ${resultObj[moveComp][moveUser]}`);

  } else if (move === '0') {
    console.log('GOOD BYE');
    process.exit();
  } else if (move === '?') {
    helpTable(moveComp);
  } else {
    const newMove = availableMoves(arr);
    rec(newMove, moveComp)
  }
}

function helpTable(moveComp) {
  const winObj = winComb();
  console.log(`+------------`.repeat(maxLen + 1));
  const arrToStr = arr.map(item => item.length < 12 ? item + ' '.repeat(10-item.length) : item).join(' | ')
  console.log(`| PC \\ User  | ${arrToStr}`);
  console.log(`+------------`.repeat(maxLen + 1));

  for (let key in winObj) {
    const arguments = Object.values(winObj[key])
    const arrToStr = arguments.map(item => item.length < 12 ? item + ' '.repeat(10-item.length) : item).join(' | ')
    console.log(`| ${key.length < 10 ? key + ' '.repeat(10-key.length) : key} | ${arrToStr}` );
    console.log(`+------------`.repeat(maxLen + 1));
  }

  const move = availableMoves(arr);
  rec(move, moveComp);
}

function winComb() {
  const str = ['Draw']
  for (let i = 1; i < maxLen / 2; i++) {
    str.push('Win');
  }
  for (let i = 1; i < maxLen / 2; i++) {
    str.push('Lose');
  }

  const obj = {}
  for (let item of arr) {
    const obj2 = {}
    for (let i = 0; i < arr.length; i++) {

      obj2[arr[i]] = str[i]
    }
    obj[item] = obj2
    const lastValue = str[maxLen-1]
    str.unshift(lastValue)
    str.splice(-1, 1)
  }
  return obj;
}
