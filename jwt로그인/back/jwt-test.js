const jwt = require("jsonwebtoken");

const secret = "this is my secret";

const token = jwt.sign(
        { useIdx: 100, nickname: "KKU" }, // payload 정의
        secret // 서버 비밀키
      );

console.log(token);


const verifiedToken = jwt.verify(token, secret); // jwt 검증
// jwt.verifiy라는 메서드에 jwt토큰과 시크릿키를 넣어주면 verifiedToken이 우리 서버에서 발급한 것이 맞는지
// 검증을 하고 검증이 완료된다면 payload안에 있는 것을 디코딩해서 우리가 사용할 수 있게끔 리턴해준다

console.log(verifiedToken)