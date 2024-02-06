// readline 모듈을 불러와 사용자 입력을 처리하기 위한 인터페이스 설정
const read = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let answer; // 정답을 저장할 변수
let attemptCount = 1; // 시도 횟수를 저장할 변수
let possibleNumbers = new Set(); // 가능한 숫자들을 저장할 집합
const NUMBER_LENGTH = 3; // 숫자의 길이 상수 (세 자리수)

// 주어진 Set에서 무작위 요소를 반환하는 함수
const getRandomElementFromSet = (set) => {
  const array = Array.from(set);
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// 게임을 초기화하는 함수
const initializeGame = () => {
  for (let i = 10; i <= 999; ++i) {
    let numString = i.toString().padStart(NUMBER_LENGTH, "0");
    const uniqueDigits = new Set(numString);
    if (uniqueDigits.size === NUMBER_LENGTH) {
      possibleNumbers.add(numString);
    }
  }
  answer = getRandomElementFromSet(possibleNumbers);
};

// 입력된 값이 유효한지 검증하는 함수
const isValidInput = (input) => {
  const regex = new RegExp(`^\\d{${NUMBER_LENGTH}}$`);
  return regex.test(input) && new Set(input).size === NUMBER_LENGTH;
};

// 주어진 답과 추측 사이의 볼과 스트라이크 수를 계산하는 함수
const calculateBallsAndStrikes = (answer, guess) => {
  let balls = 0;
  let strikes = 0;
  for (let i = 0; i < NUMBER_LENGTH; ++i) {
    if (answer[i] === guess[i]) {
      strikes++;
    } else if (answer.includes(guess[i])) {
      balls++;
    }
  }
  return strikes === 0
    ? `${balls}B`
    : balls === 0
    ? `${strikes}S`
    : `${balls}B${strikes}S`;
};

// 가능한 숫자들 중 결과에 부합하지 않는 숫자를 제거하는 함수
const updatePossibleNumbers = (result, guess) => {
  console.log(result);
  const toDelete = new Set();
  possibleNumbers.forEach((num) => {
    if (calculateBallsAndStrikes(num, guess) !== result) {
      toDelete.add(num);
    }
  });
  toDelete.forEach((num) => {
    possibleNumbers.delete(num);
  });
};

// 사용자로부터 입력을 받고 게임 로직을 처리하는 함수
const query = () => {
  read.question(`${attemptCount}번째 시도 : `, (num) => {
    if (!isValidInput(num)) {
      console.log(`유효하지 않은 입력입니다. 다시 입력해주세요.`);
      query();
      return;
    }
    const result = calculateBallsAndStrikes(answer, num);
    if (answer !== num) {
      updatePossibleNumbers(result, num);
      console.log(`추천 넘버 : ${getRandomElementFromSet(possibleNumbers)}`);
      attemptCount++;
      query();
    } else {
      console.log(result);
      console.log(`${attemptCount}번만에 맞히셨습니다.`);
      console.log(`게임을 종료합니다.`);
      read.close();
    }
  });
};

// 게임을 시작하는 함수
const play = () => {
  initializeGame();
  console.log(`컴퓨터가 숫자를 생성하였습니다. 답을 맞춰보세요!`);
  console.log(`서로 다른 세자리수를 골라주세요. Ex) 273, 012`);
  query();
};

play(); // 게임 시작
