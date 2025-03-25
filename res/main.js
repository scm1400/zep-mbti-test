/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 498:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var MBTIQuestions_1 = __webpack_require__(515);
var Utillity_1 = __webpack_require__(896);
var MBTI_SPRITES = {
  ISTJ: App.loadSpritesheet("mbti/ISTJ.png"),
  ISFJ: App.loadSpritesheet("mbti/ISFJ.png"),
  INFJ: App.loadSpritesheet("mbti/INFJ.png"),
  INTJ: App.loadSpritesheet("mbti/INTJ.png"),
  ISTP: App.loadSpritesheet("mbti/ISTP.png"),
  ISFP: App.loadSpritesheet("mbti/ISFP.png"),
  INFP: App.loadSpritesheet("mbti/INFP.png"),
  INTP: App.loadSpritesheet("mbti/INTP.png"),
  ESTP: App.loadSpritesheet("mbti/ESTP.png"),
  ESFP: App.loadSpritesheet("mbti/ESFP.png"),
  ENFP: App.loadSpritesheet("mbti/ENFP.png"),
  ENTP: App.loadSpritesheet("mbti/ENTP.png"),
  ESTJ: App.loadSpritesheet("mbti/ESTJ.png"),
  ESFJ: App.loadSpritesheet("mbti/ESFJ.png"),
  ENFJ: App.loadSpritesheet("mbti/ENFJ.png"),
  ENTJ: App.loadSpritesheet("mbti/ENTJ.png")
};
var QuestionCountPerDimension = 15;
function safeGetLocation(key) {
  try {
    var locations = Map.getLocationList(key);
    if (!locations || locations.length === 0) {
      return null;
    }
    return locations[0];
  } catch (error) {
    return null;
  }
}
var Location = {
  MainScreen: safeGetLocation("screen_main"),
  SubScreens: {
    screen_sub_1: safeGetLocation("screen_sub_1"),
    screen_sub_2: safeGetLocation("screen_sub_2"),
    screen_sub_3: safeGetLocation("screen_sub_3"),
    screen_sub_4: safeGetLocation("screen_sub_4"),
    screen_sub_5: safeGetLocation("screen_sub_5")
  },
  Selects: {
    select_1: safeGetLocation("select_1"),
    select_2: safeGetLocation("select_2"),
    select_3: safeGetLocation("select_3"),
    select_4: safeGetLocation("select_4"),
    select_5: safeGetLocation("select_5")
  }
};
var QuestionSize = QuestionCountPerDimension * 4;
Object.entries(Location.Selects).forEach(function (_a, index) {
  var key = _a[0],
    location = _a[1];
  if (!location) return;
  //@ts-ignore
  App.addOnLocationEnter(key, function (player) {
    var question = MBTIQuestions_1.MBTIQuestions.find(function (q) {
      return q.id == player.tag.questionNum;
    });
    if (player.tag.questionOrderArr.length > 0) {
      player.tag.answers.push({
        id: player.tag.questionNum,
        value: index - 2
      });
      player.spawnAtLocation("start");
      player.tag.questionNum = player.tag.questionOrderArr.pop();
      renderMbtiQuestion(player);
      player.showCenterLabel("".concat(player.tag.answers.length, "/").concat(QuestionSize, " \uC644\uB8CC"), 0xffffff, 0x00000, 0);
    } else {
      var mbtiInfo = calculateMBTI(player.tag.answers);
      player.tag.mbti = mbtiInfo.title;
      player.title = player.tag.mbti;
      //@ts-ignore
      player.setCustomEffectSprite(2, MBTI_SPRITES[mbtiInfo.title], 0, 13, 1);
      // MBTI 결과 팝업 표시
      showMbtiResultPopup(player, mbtiInfo);
      player.spawnAtLocation("complete");
      player.sendUpdated();
      var data = {
        id: player.id,
        name: player.name,
        mbtiString: player.tag.mbti,
        mbtiPercentages: mbtiInfo.percentages,
        updatedAt: new Date().toISOString()
      };
      saveMbtiResult(player.id, data, function () {});
    }
  });
});
var cameraPosition = Map.getLocation("camera");
var isMBTITestMap = !!Map.getLocation("map_mbti_test");
// 플레이어가 입장할 때 동작하는 함수
App.onJoinPlayer.Add(function (player) {
  player.tag = {
    welcomeWidget: null,
    resultWidget: null,
    systemWidget: null,
    mbti: null,
    mbtiPercentages: null,
    questionOrderArr: [],
    questionNum: null,
    answers: [],
    init: false
  };
  player.tag.systemWidget = player.showWidget("system.html", "topleft", 0, 0);
  if (player.isGuest) {
    player.moveSpeed = 0;
    player.sendUpdated();
    showLoginRequiredPopup(player);
    loginRequired(player);
    return;
  }
  if (isMBTITestMap) {
    player.moveSpeed = 0;
    if (!player.isMobile) {
      player.displayRatio = 1;
      if (cameraPosition) {
        player.setCameraTarget(cameraPosition.x, cameraPosition.y, 0);
      }
    } else {
      player.displayRatio = 0.8;
    }
    player.enableFreeView = false;
    player.sendUpdated();
    // 환영 팝업 표시
    showWelcomePopup(player);
  }
  getMbtiResult(player);
});
// 환영 팝업 표시 함수
function showWelcomePopup(player) {
  // 먼저 DB에서 기존 결과가 있는지 확인
  var AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
  var CollectionName = "MBTI_RESULT";
  var requestURL = "".concat(AWS_API, "?collection=").concat(CollectionName, "&key=").concat(player.id);
  App.httpGet(requestURL, null, function (res) {
    var response = JSON.parse(res);
    if (response && response.mbtiString) {
      // 이미 테스트를 완료한 사용자인 경우
      player.tag.mbti = response.mbtiString;
      player.tag.mbtiPercentages = response.mbtiPercentages;
      // 커스텀 이펙트 설정
      //@ts-ignore
      player.setCustomEffectSprite(2, MBTI_SPRITES[response.mbtiString], 0, 13, 1);
      player.sendUpdated();
      // 바로 결과 팝업 표시
      showMbtiResultPopup(player);
    } else {
      // 처음 테스트하는 사용자인 경우 환영 팝업 표시
      player.tag.welcomeWidget = player.showWidget("res/welcome_popup.html", "middle", 600, 600);
      // 위젯에서 메시지를 받으면 동작하는 함수
      player.tag.welcomeWidget.onMessage.Add(function (player, data) {
        if (data.type === "START_MBTI_TEST") {
          // 테스트 시작 요청 처리
          if (player.tag.welcomeWidget) {
            player.tag.welcomeWidget.destroy();
            player.tag.welcomeWidget = null;
          }
          startMbtiTest(player);
        } else if (data.type === "CHECK_TEST_COMPLETED") {
          // 테스트 완료 여부 확인 요청
          checkTestCompleted(player);
        } else if (data.type === "GO_TO_MBTI_LOUNGE") {
          // MBTI 라운지로 이동 요청
          if (player.tag.welcomeWidget) {
            player.tag.welcomeWidget.destroy();
            player.tag.welcomeWidget = null;
          }
          goToMBTILounge(player);
        }
      });
    }
  });
}
// MBTI 결과 팝업 표시 함수
function showMbtiResultPopup(player, mbtiInfo) {
  if (mbtiInfo === void 0) {
    mbtiInfo = null;
  }
  // mbtiInfo가 제공된 경우 (테스트 완료 후 호출된 경우)
  if (mbtiInfo) {
    // console.log("받은 MBTI 결과 데이터:", JSON.stringify(mbtiInfo));
    // 백분율 정보 추출 및 변환
    var eOrIType = void 0,
      sOrNType = void 0,
      tOrFType = void 0,
      jOrPType = void 0;
    var eOrIScore = void 0,
      sOrNScore = void 0,
      tOrFScore = void 0,
      jOrPScore = void 0;
    try {
      // 정규식 패턴 수정
      var eOrIMatch = mbtiInfo.percentages.eOrI.match(/([EI])\s*\((\d+)\)/);
      var sOrNMatch = mbtiInfo.percentages.sOrN.match(/([SN])\s*\((\d+)\)/);
      var tOrFMatch = mbtiInfo.percentages.tOrF.match(/([TF])\s*\((\d+)\)/);
      var jOrPMatch = mbtiInfo.percentages.jOrP.match(/([JP])\s*\((\d+)\)/);
      // 첫 번째 문자와 백분율 추출
      eOrIType = eOrIMatch ? eOrIMatch[1] : mbtiInfo.title[0];
      sOrNType = sOrNMatch ? sOrNMatch[1] : mbtiInfo.title[1];
      tOrFType = tOrFMatch ? tOrFMatch[1] : mbtiInfo.title[2];
      jOrPType = jOrPMatch ? jOrPMatch[1] : mbtiInfo.title[3];
      eOrIScore = eOrIMatch ? parseInt(eOrIMatch[2]) : 50;
      sOrNScore = sOrNMatch ? parseInt(sOrNMatch[2]) : 50;
      tOrFScore = tOrFMatch ? parseInt(tOrFMatch[2]) : 50;
      jOrPScore = jOrPMatch ? parseInt(jOrPMatch[2]) : 50;
      // console.log("추출된 타입과 점수:", {
      //     eOrIType, eOrIScore,
      //     sOrNType, sOrNScore,
      //     tOrFType, tOrFScore,
      //     jOrPType, jOrPScore
      // });
    } catch (err) {
      // console.error("정규식 처리 중 오류 발생:", err);
      // 오류 발생 시 기본값 설정
      eOrIType = mbtiInfo.title[0];
      sOrNType = mbtiInfo.title[1];
      tOrFType = mbtiInfo.title[2];
      jOrPType = mbtiInfo.title[3];
      eOrIScore = sOrNScore = tOrFScore = jOrPScore = 50;
    }
    player.tag.mbti = mbtiInfo.title;
    player.tag.mbtiPercentages = {
      EI: eOrIType === 'E' ? "E ".concat(eOrIScore, "% / I ").concat(100 - eOrIScore, "%") : "I ".concat(eOrIScore, "% / E ").concat(100 - eOrIScore, "%"),
      SN: sOrNType === 'S' ? "S ".concat(sOrNScore, "% / N ").concat(100 - sOrNScore, "%") : "N ".concat(sOrNScore, "% / S ").concat(100 - sOrNScore, "%"),
      TF: tOrFType === 'T' ? "T ".concat(tOrFScore, "% / F ").concat(100 - tOrFScore, "%") : "F ".concat(tOrFScore, "% / T ").concat(100 - tOrFScore, "%"),
      JP: jOrPType === 'J' ? "J ".concat(jOrPScore, "% / P ").concat(100 - jOrPScore, "%") : "P ".concat(jOrPScore, "% / J ").concat(100 - jOrPScore, "%")
    };
    // console.log("설정된 mbtiPercentages:", JSON.stringify(player.tag.mbtiPercentages));
  }
  // 결과 위젯 표시
  player.tag.resultWidget = player.showWidget("result_popup.html", "top", 700, 800);
  // 위젯에서 메시지를 받으면 동작하는 함수
  player.tag.resultWidget.onMessage.Add(function (player, data) {
    if (data.type === "REQUEST_MBTI_RESULT") {
      // 결과 요청 처리
      if (player.tag.mbti) {
        var mbtiResult = {
          mbtiType: player.tag.mbti,
          percentages: player.tag.mbtiPercentages
        };
        // console.log("위젯으로 전송하는 MBTI 결과:", JSON.stringify(mbtiResult));
        // 위젯으로 결과 데이터 전송
        player.tag.resultWidget.sendMessage({
          mbtiResult: mbtiResult
        });
      }
    } else if (data.type === "CLOSE_RESULT") {
      // 결과 팝업 닫기 요청
      if (player.tag.resultWidget) {
        player.tag.resultWidget.destroy();
        player.tag.resultWidget = null;
      }
      // 기존 테스트 결과가 있는 경우에만 환영 팝업 표시
      if (mbtiInfo === null) {
        // 결과를 닫으면 환영 팝업 표시 (선택할 수 있도록)
        player.tag.welcomeWidget = player.showWidget("res/welcome_popup.html", "middle", 600, 600);
        // 위젯에서 메시지를 받으면 동작하는 함수
        player.tag.welcomeWidget.onMessage.Add(function (player, data) {
          if (data.type === "START_MBTI_TEST") {
            // 테스트 시작 요청 처리
            if (player.tag.welcomeWidget) {
              player.tag.welcomeWidget.destroy();
              player.tag.welcomeWidget = null;
            }
            startMbtiTest(player);
          } else if (data.type === "CHECK_TEST_COMPLETED") {
            // 테스트 완료 여부 확인 요청
            if (player.tag.welcomeWidget) {
              player.tag.welcomeWidget.sendMessage({
                testCompleted: true
              });
            }
          } else if (data.type === "GO_TO_MBTI_LOUNGE") {
            // MBTI 라운지로 이동 요청
            if (player.tag.welcomeWidget) {
              player.tag.welcomeWidget.destroy();
              player.tag.welcomeWidget = null;
            }
            goToMBTILounge(player);
          }
        });
      }
    } else if (data.type === "RETRY_MBTI_TEST") {
      // 테스트 다시 시작 요청
      if (player.tag.resultWidget) {
        player.tag.resultWidget.destroy();
        player.tag.resultWidget = null;
      }
      startMbtiTest(player);
    } else if (data.type === "SHARE_TO_ZEP_CHAT") {
      // Zep 채팅창에 결과 공유
      if (data.content) {
        // 채팅창에 MBTI 결과 공유
        App.sayToAll("[".concat(player.name, "\uB2D8\uC758 MBTI \uACB0\uACFC] ").concat(player.tag.mbti));
        App.sayToAll("".concat(getMbtiNickname(player.tag.mbti)));
      }
    } else if (data.type === "GO_TO_MBTI_LOUNGE") {
      // MBTI 라운지로 이동 요청
      if (player.tag.resultWidget) {
        player.tag.resultWidget.destroy();
        player.tag.resultWidget = null;
      }
      goToMBTILounge(player);
    }
  });
}
// MBTI 테스트 시작 함수
function startMbtiTest(player) {
  player.tag.questionOrderArr = (0, MBTIQuestions_1.getRandomIdsByDimension)(QuestionCountPerDimension); // 항목별로 n개
  player.tag.questionNum = player.tag.questionOrderArr.pop();
  player.tag.answers = [];
  player.showCenterLabel("MBTI 테스트 준비중...", 0xffffff, 0x00000, 200);
  var playerId = player.id;
  App.runLater(function () {
    var player = App.getPlayerByID(playerId);
    if (!player) return;
    player.showCenterLabel("MBTI 테스트 준비 완료!", 0xffffff, 0x00000, 200);
    player.moveSpeed = 140;
    player.sendUpdated();
    renderMbtiQuestion(player);
    player.tag.init = true;
  }, 1);
}
// MBTI 유형의 별명 반환 함수
function getMbtiNickname(mbtiType) {
  var mbtiNicknames = {
    "ISTJ": "청렴결백한 논리주의자",
    "ISFJ": "용감한 수호자",
    "INFJ": "선의의 옹호자",
    "INTJ": "용의주도한 전략가",
    "ISTP": "만능 재주꾼",
    "ISFP": "호기심 많은 예술가",
    "INFP": "열정적인 중재자",
    "INTP": "논리적인 사색가",
    "ESTP": "모험을 즐기는 사업가",
    "ESFP": "자유로운 영혼의 연예인",
    "ENFP": "열정적인 활동가",
    "ENTP": "논쟁을 즐기는 변론가",
    "ESTJ": "엄격한 관리자",
    "ESFJ": "사교적인 외교관",
    "ENFJ": "정의로운 사회운동가",
    "ENTJ": "대담한 통솔자"
  };
  return mbtiNicknames[mbtiType] || "알 수 없는 유형";
}
function renderMbtiQuestion(player) {
  // const questionIndex = player.tag.questionNum - 1;
  var mbtiQuestion = MBTIQuestions_1.MBTIQuestions.find(function (d) {
    return d.id == player.tag.questionNum;
  });
  var language = "en";
  if (player.language === "ko" || player.language === "ja") {
    language = player.language;
  }
  if (Location.MainScreen) {
    (0, Utillity_1.createTextObject)(player, mbtiQuestion.question[language], Location.MainScreen.x, Location.MainScreen.y - 0.5, {
      color: "white",
      fontSize: "20px",
      wordWrap: {
        useAdvancedWrap: true,
        width: Location.MainScreen.width * 32
      },
      fixedWidth: Location.MainScreen.width * 32,
      align: "center"
    });
  }
  Object.values(Location.SubScreens).forEach(function (locationInfo, index) {
    if (!locationInfo) return;
    var optionText = mbtiQuestion.options[index].text[language];
    (0, Utillity_1.createTextObject)(player, optionText, locationInfo.x, locationInfo.y, {
      color: "white",
      fontSize: "14px",
      wordWrap: {
        useAdvancedWrap: true,
        width: locationInfo.width * 32
      },
      fixedWidth: locationInfo.width * 32,
      align: "center"
    });
  });
}
// 3) MBTI 유형 계산 함수
function calculateMBTI(answers) {
  // 각 축별 점수
  var eScore = 0,
    iScore = 0;
  var sScore = 0,
    nScore = 0;
  var tScore = 0,
    fScore = 0;
  var jScore = 0,
    pScore = 0;
  var _loop_1 = function (answer) {
    // answer.id에 해당하는 question을 찾음
    var question = MBTIQuestions_1.MBTIQuestions.find(function (q) {
      return q.id === answer.id;
    });
    if (!question) return "continue";
    var dimension = question.dimension;
    var value = answer.value;
    switch (dimension) {
      case 'EI':
        // value가 0 이상 → E, 0 미만 → I
        if (value >= 0) eScore += value;else iScore += Math.abs(value);
        break;
      case 'SN':
        // value가 0 이상 → S, 0 미만 → N
        if (value >= 0) sScore += value;else nScore += Math.abs(value);
        break;
      case 'TF':
        // value가 0 이상 → T, 0 미만 → F
        if (value >= 0) tScore += value;else fScore += Math.abs(value);
        break;
      case 'JP':
        // value가 0 이상 → J, 0 미만 → P
        if (value >= 0) jScore += value;else pScore += Math.abs(value);
        break;
    }
  };
  for (var _i = 0, answers_1 = answers; _i < answers_1.length; _i++) {
    var answer = answers_1[_i];
    _loop_1(answer);
  }
  // EI, SN, TF, JP 각각 비교
  var eOrI = eScore >= iScore ? 'E' : 'I';
  var sOrN = sScore >= nScore ? 'S' : 'N';
  var tOrF = tScore >= fScore ? 'T' : 'F';
  var jOrP = jScore >= pScore ? 'J' : 'P';
  return {
    title: "".concat(eOrI).concat(sOrN).concat(tOrF).concat(jOrP),
    percentages: {
      eOrI: eScore >= iScore ? "E (".concat(Math.floor(eScore / (eScore + iScore) * 100) || 0, ")") : "I (".concat(Math.floor(iScore / (eScore + iScore) * 100) || 0, ")"),
      sOrN: sScore >= nScore ? "S (".concat(Math.floor(sScore / (sScore + nScore) * 100) || 0, ")") : "N (".concat(Math.floor(nScore / (sScore + nScore) * 100) || 0, ")"),
      tOrF: tScore >= fScore ? "T (".concat(Math.floor(tScore / (tScore + fScore) * 100) || 0, ")") : "F (".concat(Math.floor(fScore / (tScore + fScore) * 100) || 0, ")"),
      jOrP: jScore >= pScore ? "J (".concat(Math.floor(jScore / (jScore + pScore) * 100) || 0, ")") : "P (".concat(Math.floor(pScore / (jScore + pScore) * 100) || 0, ")")
    }
  };
}
var RequestOptions = /** @class */function () {
  function RequestOptions() {}
  return RequestOptions;
}();
function saveMbtiResult(key, data, callback) {
  var AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
  var CollectionName = "MBTI_RESULT";
  var saveObject = __assign(__assign({}, data), {
    collection: CollectionName,
    key: key
  });
  App.httpPostJson(AWS_API, null, saveObject, function (res) {
    if (res.startsWith('success', 1)) {
      callback(true);
    } else {
      callback(false);
    }
  });
}
function getMbtiResult(player) {
  // 이미 MBTI 데이터가 로드된 경우는 중복 호출하지 않음
  if (player.tag.mbti) return;
  var AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
  var CollectionName = "MBTI_RESULT";
  var requestURL = "".concat(AWS_API, "?collection=").concat(CollectionName, "&key=").concat(player.id);
  var playerId = player.id;
  App.httpGet(requestURL, null, function (res) {
    var player = App.getPlayerByID(playerId);
    if (!player) return;
    var response = JSON.parse(res);
    if (response) {
      if (response.mbtiString) {
        // MBTI 결과 데이터 저장
        player.tag.mbti = response.mbtiString;
        // mbtiPercentages가 없거나 형식이 다른 경우 기본값 설정
        if (!response.mbtiPercentages || !response.mbtiPercentages.EI) {
          player.tag.mbtiPercentages = {
            EI: response.mbtiString[0] === 'E' ? "E 70% / I 30%" : "I 70% / E 30%",
            SN: response.mbtiString[1] === 'S' ? "S 70% / N 30%" : "N 70% / S 30%",
            TF: response.mbtiString[2] === 'T' ? "T 70% / F 30%" : "F 70% / T 30%",
            JP: response.mbtiString[3] === 'J' ? "J 70% / P 30%" : "P 70% / J 30%"
          };
        } else {
          player.tag.mbtiPercentages = response.mbtiPercentages;
        }
        console.log("설정된 mbtiPercentages (DB):", JSON.stringify(player.tag.mbtiPercentages));
        // 커스텀 이펙트 설정
        //@ts-ignore
        player.setCustomEffectSprite(2, MBTI_SPRITES[response.mbtiString], 0, 13, 1);
        player.sendUpdated();
      }
    }
  });
}
function showLoginRequiredPopup(player) {
  player.showAlert("로그인이 필요합니다.", function (res) {
    showLoginRequiredPopup(player);
    loginRequired(player);
  }, {
    content: "MBTI 테스트를 위해 로그인이 필요합니다."
  });
}
function loginRequired(player) {
  if (player.tag.systemWidget) {
    player.tag.systemWidget.sendMessage({
      type: "loginRequired"
    });
  }
  return;
}
// 테스트 완료 상태 확인 함수
function checkTestCompleted(player) {
  // DB에서 데이터를 불러오기 전에 이미 tag.mbti가 있는지 확인
  if (player.tag.welcomeWidget && player.tag.mbti) {
    // 이미 불러온 MBTI 데이터가 있는 경우
    player.tag.welcomeWidget.sendMessage({
      testCompleted: true
    });
  } else {
    // DB에서 테스트 결과 다시 확인
    var AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
    var CollectionName = "MBTI_RESULT";
    var requestURL = "".concat(AWS_API, "?collection=").concat(CollectionName, "&key=").concat(player.id);
    App.httpGet(requestURL, null, function (res) {
      if (!player.tag.welcomeWidget) return; // 위젯이 이미 닫힌 경우
      try {
        var response = JSON.parse(res);
        if (response && response.mbtiString) {
          // DB에 결과가 있는 경우
          player.tag.mbti = response.mbtiString;
          player.tag.mbtiPercentages = response.mbtiPercentages;
          player.tag.welcomeWidget.sendMessage({
            testCompleted: true
          });
        } else {
          // DB에 결과가 없는 경우
          player.tag.welcomeWidget.sendMessage({
            testCompleted: false
          });
        }
      } catch (error) {
        // console.error("MBTI 결과 확인 중 오류:", error);
        // 오류 발생 시 테스트 완료하지 않은 것으로 처리
        player.tag.welcomeWidget.sendMessage({
          testCompleted: false
        });
      }
    });
  }
}
// MBTI 라운지로 이동 함수
function goToMBTILounge(player) {
  try {
    // MBTI 라운지 맵으로 이동
    player.spawnAtMap("6epyab", "WaV3qN");
  } catch (error) {
    // console.error("MBTI 라운지 이동 실패:", error);
    // 이동 실패 시 플레이어에게 알림
    player.showCenterLabel("MBTI 라운지 이동에 실패했습니다.", 0xFF0000, 0xFFFFFF, 200);
  }
}

/***/ }),

/***/ 515:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MBTIQuestions = void 0;
exports.getRandomIdsByDimension = getRandomIdsByDimension;
exports.MBTIQuestions = [
// EI (외향-내향) 질문
{
  "id": 1,
  "dimension": "EI",
  "question": {
    "ko": "나는 타인과의 상호작용에서 에너지를 얻는 편이다.",
    "en": "I tend to feel energized by interacting with others.",
    "ja": "私は他者との交流でエネルギーを得る傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 2,
  "dimension": "EI",
  "question": {
    "ko": "나는 새로운 사람들과의 만남에서 긍정적인 경험을 하곤 한다.",
    "en": "I tend to have positive experiences when meeting new people.",
    "ja": "新しい人と会うとき、前向きな経験をする傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 3,
  "dimension": "EI",
  "question": {
    "ko": "나는 혼자 깊이 생각하기보다 타인과의 대화를 통해 내 생각을 정리하는 것을 선호한다.",
    "en": "I prefer organizing my thoughts by discussing them with others rather than thinking alone.",
    "ja": "一人で考えるより、他者と話すことで自分の考えを整理することを好む。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 4,
  "dimension": "EI",
  "question": {
    "ko": "나는 처음 만난 사람과 자연스럽게 대화를 시작하는 편이다.",
    "en": "I naturally initiate conversation when meeting someone new.",
    "ja": "初対面の人と会うとき、自然に会話を始める。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 5,
  "dimension": "EI",
  "question": {
    "ko": "나는 주말에 집에 머무는 것보다 사회적 활동에 참여하는 것이 더 활력을 준다고 느낀다.",
    "en": "I feel more energized by engaging in social activities during the weekend than by staying at home.",
    "ja": "週末は家にいるよりも、社会的な活動に参加することでエネルギーを感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 6,
  "dimension": "EI",
  "question": {
    "ko": "나는 파티나 모임 후에 피로감보다 만족감을 더 크게 느낀다.",
    "en": "After a party or gathering, I tend to feel more satisfied than tired.",
    "ja": "パーティーや集まりの後は、疲労感よりも満足感を強く感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 7,
  "dimension": "EI",
  "question": {
    "ko": "나는 그룹 활동 시 자연스럽게 리더나 진행자 역할을 맡는 경향이 있다.",
    "en": "I tend to naturally take on a leadership or facilitator role during group activities.",
    "ja": "グループ活動では、自然とリーダーや進行役を担う傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 8,
  "dimension": "EI",
  "question": {
    "ko": "나는 새로운 사람에게 먼저 말을 거는 것을 주저하지 않는다.",
    "en": "I do not hesitate to speak to someone new.",
    "ja": "新しい人に対して先んじて話しかけることをためらわない。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 9,
  "dimension": "EI",
  "question": {
    "ko": "나는 큰 모임에서 내 생각을 자유롭게 표현하는 것을 즐긴다.",
    "en": "I enjoy expressing my thoughts freely in large gatherings.",
    "ja": "大規模な集まりで自分の考えを自由に表現することを楽しむ。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 10,
  "dimension": "EI",
  "question": {
    "ko": "나는 다수의 사람들과 함께 일할 때 효율성이 높다고 느낀다.",
    "en": "I feel that working with many people is more efficient.",
    "ja": "多くの人と一緒に働く方が効率的だと感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 11,
  "dimension": "EI",
  "question": {
    "ko": "나는 계획되지 않은 모임에서도 사람들과 함께 있으면 즐거움을 느낀다.",
    "en": "I enjoy being with people even in unplanned gatherings.",
    "ja": "計画されていない集まりでも、人と一緒にいると楽しいと感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 12,
  "dimension": "EI",
  "question": {
    "ko": "나는 새로운 팀원이나 친구를 만나는 데 적극적인 편이다.",
    "en": "I am proactive when it comes to meeting new team members or friends.",
    "ja": "新しいチームメンバーや友人に出会うことに積極的である。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 13,
  "dimension": "EI",
  "question": {
    "ko": "나는 내 감정을 말로 표현하는 것을 비교적 수월하게 느낀다.",
    "en": "I find it relatively easy to express my emotions verbally.",
    "ja": "自分の感情を言葉で表現するのは比較的容易だと感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 14,
  "dimension": "EI",
  "question": {
    "ko": "나는 일상에서의 경험을 다른 사람과 공유하고 싶어 한다.",
    "en": "I feel the urge to share my daily experiences with others.",
    "ja": "日常の出来事を他人と共有したいと感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 15,
  "dimension": "EI",
  "question": {
    "ko": "나는 주위의 관심이나 시선을 받을 때 긍정적인 느낌을 갖는다.",
    "en": "I tend to feel positive when I receive attention from others.",
    "ja": "周囲の関心や視線を受けると、前向きな気持ちになる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
},
// SN (감각-직관) 질문
{
  "id": 26,
  "dimension": "SN",
  "question": {
    "ko": "나는 아이디어보다는 실제 경험을 통해 배우는 것을 선호한다.",
    "en": "I prefer learning through actual experiences rather than abstract ideas.",
    "ja": "アイデアよりも実際の経験を通じて学ぶことを好む。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 27,
  "dimension": "SN",
  "question": {
    "ko": "나는 구체적인 설명서나 매뉴얼이 있을 때 작업하기 더 편하다고 느낀다.",
    "en": "I find it easier to work when clear instructions or manuals are provided.",
    "ja": "具体的な説明書やマニュアルがあると作業しやすいと感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 28,
  "dimension": "SN",
  "question": {
    "ko": "나는 사소한 디테일을 꼼꼼히 관찰하는 편이다.",
    "en": "I tend to pay close attention to even the smallest details.",
    "ja": "些細なディテールにも注意を払う傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 29,
  "dimension": "SN",
  "question": {
    "ko": "나는 추상적인 개념보다 현실적인 예시를 더 중시한다.",
    "en": "I value realistic examples more than abstract concepts.",
    "ja": "抽象的な概念よりも現実的な例を重視する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 30,
  "dimension": "SN",
  "question": {
    "ko": "나는 과거의 경험과 기록이 미래를 예측하는 데 도움이 된다고 생각한다.",
    "en": "I believe that past experiences and records help in predicting the future.",
    "ja": "過去の経験や記録が未来の予測に役立つと考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 31,
  "dimension": "SN",
  "question": {
    "ko": "나는 자료나 정보가 충분하지 않을 때 불안감을 느끼는 편이다.",
    "en": "I tend to feel uneasy when there is a lack of sufficient information.",
    "ja": "十分な情報がないと不安を感じる傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 32,
  "dimension": "SN",
  "question": {
    "ko": "나는 사물이나 상황을 관찰할 때 눈에 보이는 것부터 파악하는 편이다.",
    "en": "I tend to assess things by first noticing what is visible.",
    "ja": "物事や状況を見るとき、まず目に見えるものから把握する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 33,
  "dimension": "SN",
  "question": {
    "ko": "나는 현재 상황에서 실질적인 해결책을 먼저 모색하는 편이다.",
    "en": "I tend to seek practical solutions first in the present situation.",
    "ja": "現状で実際に機能する解決策をまず模索する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 34,
  "dimension": "SN",
  "question": {
    "ko": "나는 상상력보다는 실제로 작동하는지 여부를 더 중요하게 생각한다.",
    "en": "I consider whether something works in practice more important than imaginative ideas.",
    "ja": "想像力よりも、実際に機能するかどうかを重視する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 35,
  "dimension": "SN",
  "question": {
    "ko": "나는 직감보다 검증된 정보를 신뢰하는 경향이 있다.",
    "en": "I tend to trust verified information over mere intuition.",
    "ja": "直感よりも、検証済みの情報を信頼する傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 36,
  "dimension": "SN",
  "question": {
    "ko": "나는 문제 해결 시 이론보다 실제 사례 분석에 집중하는 편이다.",
    "en": "When solving problems, I focus more on analyzing real examples than on theories.",
    "ja": "問題解決の際、理論よりも実例の分析に重点を置く。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 37,
  "dimension": "SN",
  "question": {
    "ko": "나는 타인의 상상력보다 구체적인 수치나 데이터를 더 신뢰하는 편이다.",
    "en": "I tend to trust concrete figures or data more than others' imaginative ideas.",
    "ja": "他人の想像力よりも、具体的な数値やデータを信頼する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 38,
  "dimension": "SN",
  "question": {
    "ko": "나는 새로운 아이디어보다 검증된 방식을 선호한다.",
    "en": "I prefer proven methods over new ideas.",
    "ja": "新しいアイデアよりも、検証済みの方法を好む。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 39,
  "dimension": "SN",
  "question": {
    "ko": "나는 주변의 작은 변화도 빠르게 감지하고 적절히 대응하는 편이다.",
    "en": "I quickly notice even small changes around me and respond appropriately.",
    "ja": "周囲の小さな変化にもすぐに気付き、適切に対処する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 40,
  "dimension": "SN",
  "question": {
    "ko": "나는 먼 미래보다는 당장의 문제를 먼저 해결하는 경향이 있다.",
    "en": "I tend to address immediate problems before considering distant future possibilities.",
    "ja": "遠い未来よりも、目の前の問題を先に解決する傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
},
// TF (사고-감정) 질문
{
  "id": 51,
  "dimension": "TF",
  "question": {
    "ko": "나는 논리적 근거가 부족한 주장에 대해 즉각적으로 의문을 제기하는 편이다.",
    "en": "I tend to immediately question arguments that lack logical basis.",
    "ja": "論理的な根拠のない主張にはすぐに疑問を呈する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 52,
  "dimension": "TF",
  "question": {
    "ko": "나는 업무나 과제에서 효율과 결과를 가장 중시한다.",
    "en": "I prioritize efficiency and outcomes in tasks and assignments.",
    "ja": "業務や課題では効率と成果を最も重視する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 53,
  "dimension": "TF",
  "question": {
    "ko": "나는 누군가 고민을 털어놓을 때 먼저 해결책을 모색하는 편이다.",
    "en": "When someone shares their concerns, I tend to look for solutions first.",
    "ja": "誰かが悩みを打ち明けると、まず解決策を探す傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 54,
  "dimension": "TF",
  "question": {
    "ko": "나는 갈등 상황에서 감정보다 문제의 원인과 해결책에 초점을 맞춘다.",
    "en": "In conflict situations, I focus more on identifying the causes and solutions than on emotions.",
    "ja": "対立の際、感情よりも問題の原因と解決策に焦点を当てる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 55,
  "dimension": "TF",
  "question": {
    "ko": "나는 논쟁 중에도 옳고 그름을 명확하게 하고자 하는 편이다.",
    "en": "I strive to clearly distinguish between right and wrong during arguments.",
    "ja": "議論の際、正誤を明確にしたいと努める。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 56,
  "dimension": "TF",
  "question": {
    "ko": "나는 친구에게 조언할 때 현실적이고 합리적인 방향을 제시하는 편이다.",
    "en": "When giving advice to friends, I tend to offer practical and rational suggestions.",
    "ja": "友人に助言する際、現実的で合理的な提案をする傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 57,
  "dimension": "TF",
  "question": {
    "ko": "나는 결정을 내릴 때 감정보다 객관적인 사실에 더 의존하는 편이다.",
    "en": "I tend to rely on objective facts rather than emotions when making decisions.",
    "ja": "判断する際、感情よりも客観的な事実に依存する傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 58,
  "dimension": "TF",
  "question": {
    "ko": "나는 타인의 이야기를 들을 때 공감보다 논리적 근거를 우선시하는 편이다.",
    "en": "When listening to others, I tend to prioritize logical reasoning over empathy.",
    "ja": "他人の話を聞くとき、共感よりも論理的根拠を優先する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 59,
  "dimension": "TF",
  "question": {
    "ko": "나는 결정을 내릴 때 주위 사람들의 감정보다 객관적 사실에 더 집중한다.",
    "en": "I focus more on objective facts than on others' emotional reactions when making decisions.",
    "ja": "判断する際、周囲の感情よりも客観的な事実に集中する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 60,
  "dimension": "TF",
  "question": {
    "ko": "나는 사람과의 관계보다 업무 성과와 효율을 더 우선시하는 편이다.",
    "en": "I tend to prioritize work performance and efficiency over personal relationships.",
    "ja": "人間関係よりも、業務の成果や効率を優先する傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 61,
  "dimension": "TF",
  "question": {
    "ko": "나는 의사소통 시 감정보다 근거 제시가 중요하다고 생각한다.",
    "en": "I believe that providing evidence is more important than emotion when communicating.",
    "ja": "コミュニケーションの際、感情よりも根拠を示すことが重要だと考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 62,
  "dimension": "TF",
  "question": {
    "ko": "나는 감정보다는 원칙을 지키는 것이 문제 해결에 효과적이라고 믿는다.",
    "en": "I believe that sticking to principles is more effective for solving problems than relying on emotions.",
    "ja": "感情よりも原則を守ることが、問題解決により効果的だと信じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 63,
  "dimension": "TF",
  "question": {
    "ko": "나는 결과가 중요하다면 다소 냉정한 방법도 수용할 수 있다.",
    "en": "If results are important, I can accept somewhat detached methods.",
    "ja": "結果が重要なら、多少冷静な方法も受け入れることができる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 64,
  "dimension": "TF",
  "question": {
    "ko": "나는 협업 시 목표 달성을 위해 감정보다 결과를 우선시하는 편이다.",
    "en": "In collaborations, I tend to prioritize achieving goals over attending to others' feelings.",
    "ja": "協働の際、他人の感情よりも目標達成を優先する傾向がある。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 65,
  "dimension": "TF",
  "question": {
    "ko": "나는 어떤 결정을 내리기 전 '이것이 옳은가?'를 먼저 고려하고 그 후에 '이것이 좋은가?'를 생각한다.",
    "en": "Before making a decision, I first consider 'Is this right?' and then think 'Is this good?'",
    "ja": "何かを決定する前に、『これが正しいか？』をまず考え、その後『これが良いか？』を検討する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
},
// JP (판단-인식) 질문
{
  "id": 76,
  "dimension": "JP",
  "question": {
    "ko": "나는 주말이나 휴일 일정을 미리 계획하지 않으면 불안감을 느낀다.",
    "en": "I tend to feel uneasy if I do not plan my weekend or holiday schedule in advance.",
    "ja": "週末や休日の予定を事前に計画しないと不安になる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 78,
  "dimension": "JP",
  "question": {
    "ko": "나는 모임을 계획할 때 세부 일정을 미리 확정하는 것을 선호한다.",
    "en": "I prefer to finalize detailed schedules in advance when planning gatherings.",
    "ja": "集まりを計画する際、詳細なスケジュールを事前に決定することを好む。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 79,
  "dimension": "JP",
  "question": {
    "ko": "나는 여행 시 자유로운 일정보다 정해진 일정표가 있는 패키지 여행을 선호한다.",
    "en": "When traveling, I prefer package tours with fixed itineraries over free-form travel.",
    "ja": "旅行に行くとき、自由旅行よりも日程が決まっているパッケージツアーを好む。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 80,
  "dimension": "JP",
  "question": {
    "ko": "나는 불확실한 일정보다는 명확한 계획이 있을 때 더 안정감을 느낀다.",
    "en": "I feel more secure when I have a clear plan rather than an uncertain schedule.",
    "ja": "不確定な予定よりも、明確な計画があると安心する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 81,
  "dimension": "JP",
  "question": {
    "ko": "나는 계획이 변경되면 큰 스트레스를 느끼는 편이다.",
    "en": "I tend to experience significant stress when plans change.",
    "ja": "計画が変更されると大きなストレスを感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 87,
  "dimension": "JP",
  "question": {
    "ko": "나는 규칙과 절차를 준수하는 것이 일의 일관성을 유지하는 데 중요하다고 생각한다.",
    "en": "I believe that following rules and procedures is essential for maintaining consistency.",
    "ja": "規則や手続きを守ることが、仕事の一貫性を保つために重要だと考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 89,
  "dimension": "JP",
  "question": {
    "ko": "나는 매일 일정표나 할 일 목록을 작성할 때 만족감을 느낀다.",
    "en": "I feel satisfied when I have the habit of making daily schedules or to-do lists.",
    "ja": "毎日スケジュールややることリストを作る習慣があると満足する。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 90,
  "dimension": "JP",
  "question": {
    "ko": "나는 어떤 일을 시작하기 전에 명확한 목표와 기한이 설정되어야 한다고 생각한다.",
    "en": "I believe that clear goals and deadlines should be set before starting any task.",
    "ja": "何かを始める前に、明確な目標と期限を設定すべきだと考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 91,
  "dimension": "JP",
  "question": {
    "ko": "나는 예측 불가능한 이벤트보다 예측 가능한 상황을 선호한다.",
    "en": "I prefer predictable situations over unpredictable events.",
    "ja": "予測不可能なイベントよりも、予測可能な状況を好む。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 92,
  "dimension": "JP",
  "question": {
    "ko": "나는 자유로운 사고보다 체계적인 접근을 통한 문제 해결이 더 효율적이라고 생각한다.",
    "en": "I believe that a systematic approach to problem-solving is more efficient than free-form thinking.",
    "ja": "自由な発想よりも、体系的なアプローチによる問題解決の方が効率的だと考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 94,
  "dimension": "JP",
  "question": {
    "ko": "나는 물건이 제자리에 있지 않으면 불편함을 느낀다.",
    "en": "I tend to feel uncomfortable when things are not in their proper place.",
    "ja": "物が所定の位置にないと不快に感じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 95,
  "dimension": "JP",
  "question": {
    "ko": "나는 회의나 토론 시 정해진 순서를 따르는 것이 효과적이라고 생각한다.",
    "en": "I believe that following a predetermined order in meetings or discussions is more effective than speaking freely.",
    "ja": "会議や討論では、自由に話すよりも定められた順序に従う方が効果的だと考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 96,
  "dimension": "JP",
  "question": {
    "ko": "나는 중요한 결정을 내리기 전에 충분한 시간을 가지고 신중히 고민하는 편이다.",
    "en": "I tend to take sufficient time to deliberate carefully before making important decisions.",
    "ja": "重要な決定を下す前に、十分な時間をかけて慎重に考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 98,
  "dimension": "JP",
  "question": {
    "ko": "나는 철저한 계획이 대부분의 상황에서 실패를 줄이는 데 도움이 된다고 믿는다.",
    "en": "I believe that thorough planning helps reduce failures in most situations.",
    "ja": "徹底した計画がほとんどの状況で失敗を減らすのに役立つと信じる。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}, {
  "id": 100,
  "dimension": "JP",
  "question": {
    "ko": "나는 일과 생활에서 예측 불가능한 요소를 최소화하는 것이 안정감에 기여한다고 생각한다.",
    "en": "I believe that minimizing unpredictable factors in work and life contributes to a sense of stability.",
    "ja": "仕事や生活において予測不可能な要素を最小限にすることが安心感につながると考える。"
  },
  "options": [{
    "text": {
      "ko": "전혀 그렇지 않다",
      "en": "Not at all",
      "ja": "全くそうではない"
    },
    "value": -2
  }, {
    "text": {
      "ko": "그렇지 않은 편이다",
      "en": "Slightly disagree",
      "ja": "あまりそうではない"
    },
    "value": -1
  }, {
    "text": {
      "ko": "보통이다",
      "en": "Neutral",
      "ja": "普通"
    },
    "value": 0
  }, {
    "text": {
      "ko": "그런 편이다",
      "en": "Somewhat agree",
      "ja": "そうだ"
    },
    "value": 1
  }, {
    "text": {
      "ko": "매우 그렇다",
      "en": "Strongly agree",
      "ja": "非常にそうだ"
    },
    "value": 2
  }]
}];
function getRandomIdsByDimension(n) {
  var _a;
  // 각 차원별로 질문 그룹핑
  var grouped = {};
  exports.MBTIQuestions.forEach(function (q) {
    if (!grouped[q.dimension]) {
      grouped[q.dimension] = [];
    }
    grouped[q.dimension].push(q.id);
  });
  // 각 그룹에서 n개의 랜덤 id 선택
  var result = [];
  for (var dimension in grouped) {
    // 질문 배열 복사 후 섞기(shuffle)
    var shuffled = grouped[dimension].slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      _a = [shuffled[j], shuffled[i]], shuffled[i] = _a[0], shuffled[j] = _a[1];
    }
    // n개 이하인 경우 모두 선택, 그렇지 않으면 n개 선택
    var selected = shuffled.slice(0, Math.min(n, shuffled.length));
    result = result.concat(selected);
  }
  return result;
}

/***/ }),

/***/ 896:
/***/ (function(__unused_webpack_module, exports) {



var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createTextObject = createTextObject;
// 전역 상수(예시)
var TILE_SIZE = 32;
var FONT_FAMILY = "Arial";
;
function createTextObject(player, text, x, y, textStyle) {
  // id 설정
  var id = "".concat(x, "_").concat(y);
  var depth = 1002;
  var xPos = x * TILE_SIZE;
  var yPos = y * TILE_SIZE + 32;
  // 공통 PhaserGoOption
  var phaserGoOption = {
    text: {
      name: id,
      x: xPos,
      y: yPos,
      text: text,
      style: __assign({
        fontSize: "14px",
        fontFamily: FONT_FAMILY,
        fontStyle: "bold",
        color: "black",
        strokeThickness: 1,
        stroke: "#000000",
        align: "center",
        wordWrap: {
          useAdvancedWrap: true
        },
        resolution: 2
      }, textStyle)
    }
  };
  if (!player.tag.init) {
    // @ts-ignore
    player.addPhaserGo(phaserGoOption);
    // @ts-ignore
    player.callPhaserFunc(id, "setDepth", [depth]);
    // @ts-ignore
    player.callPhaserFunc(id, 'setOrigin', [0, 0]);
  } else {
    //@ts-ignore
    player.callPhaserFunc(id, "setText", [text]);
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(498);
/******/ 	
/******/ })()
;