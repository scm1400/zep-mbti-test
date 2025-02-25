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
var Location = {
  MainScreen: Map.getLocationList("screen_main")[0],
  SubScreens: {
    screen_sub_1: Map.getLocationList("screen_sub_1")[0],
    screen_sub_2: Map.getLocationList("screen_sub_2")[0],
    screen_sub_3: Map.getLocationList("screen_sub_3")[0],
    screen_sub_4: Map.getLocationList("screen_sub_4")[0],
    screen_sub_5: Map.getLocationList("screen_sub_5")[0]
  },
  Selects: {
    select_1: Map.getLocationList("select_1")[0],
    select_2: Map.getLocationList("select_2")[0],
    select_3: Map.getLocationList("select_3")[0],
    select_4: Map.getLocationList("select_4")[0],
    select_5: Map.getLocationList("select_5")[0]
  }
};
var QuestionSize = Object.keys(MBTIQuestions_1.MBTIQuestions).length;
Object.entries(Location.Selects).forEach(function (_a, index) {
  var key = _a[0],
    location = _a[1];
  //@ts-ignore
  App.addOnLocationEnter(key, function (player) {
    var questionCount = player.tag.questionNum;
    var question = MBTIQuestions_1.MBTIQuestions[questionCount];
    if (questionCount < QuestionSize && question) {
      player.tag.answers.push({
        id: question.id,
        value: index - 2
      });
      // player.sendMessage(JSON.stringify(player.tag.answers));
      player.spawnAtLocation("start");
      player.tag.questionNum++;
      renderMbtiQuestion(player);
      player.showCenterLabel("".concat(questionCount, "/").concat(QuestionSize, " \uC644\uB8CC"));
    } else {
      var mbtiInfo = calculateMBTI(player.tag.answers);
      player.tag.mbti = mbtiInfo.title;
      player.title = player.tag.mbti;
      var resultString_1 = "";
      Object.values(mbtiInfo.percentages).forEach(function (string, index) {
        resultString_1 += string + "\n";
      });
      player.showAlert("MBTI 검사 결과", function () {
        player.spawnAtMap("AlPRzo", "yBZAkk");
      }, {
        content: resultString_1
      });
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
App.onJoinPlayer.Add(function (player) {
  player.tag = {};
  player.tag.questionNum = 1;
  player.tag.answers = [];
  player.moveSpeed = 0;
  player.displayRatio = 1.25;
  player.enableFreeView = false;
  player.showCenterLabel("MBTI 테스트 준비중...");
  player.sendUpdated();
  var playerId = player.id;
  App.runLater(function () {
    var player = App.getPlayerByID(playerId);
    if (!player) return;
    player.showCenterLabel("MBTI 테스트 준비 완료!");
    player.moveSpeed = 140;
    player.sendUpdated();
    renderMbtiQuestion(player);
    player.tag.init = true;
  }, 1);
});
var _refreshDelay = 0;
App.onUpdate.Add(function (dt) {
  _refreshDelay += dt;
  if (_refreshDelay > 10) {
    App.players.forEach(function (player) {
      if (player.away) {
        player.spawnAtMap("AlPRzo", "yBZAkk");
      }
    });
  }
});
function renderMbtiQuestion(player) {
  var questionIndex = player.tag.questionNum - 1;
  var mbtiQuestion = MBTIQuestions_1.MBTIQuestions[questionIndex];
  (0, Utillity_1.createTextObject)(player, mbtiQuestion.question, Location.MainScreen.x, Location.MainScreen.y, {
    color: "white",
    fontSize: "20px",
    wordWrap: {
      useAdvancedWrap: true,
      width: Location.MainScreen.width * 32
    },
    fixedWidth: Location.MainScreen.width * 32,
    align: "center"
  });
  Object.values(Location.SubScreens).forEach(function (locationInfo, index) {
    var optionText = mbtiQuestion.options[index].text;
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
      eOrI: eScore >= iScore ? "E (".concat(Math.floor(eScore / (eScore + iScore) * 100), ")") : "I (".concat(Math.floor(iScore / (eScore + iScore) * 100), ")"),
      sOrN: sScore >= nScore ? "S (".concat(Math.floor(sScore / (sScore + nScore) * 100), ")") : "N (".concat(Math.floor(nScore / (sScore + nScore) * 100), ")"),
      tOrF: tScore >= fScore ? "T (".concat(Math.floor(tScore / (tScore + fScore) * 100), ")") : "F (".concat(Math.floor(fScore / (tScore + fScore) * 100), ")"),
      jOrP: jScore >= pScore ? "J (".concat(Math.floor(jScore / (jScore + pScore) * 100), ")") : "P (".concat(Math.floor(pScore / (jScore + pScore) * 100), ")")
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
  var AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
  var CollectionName = "MBTI_RESULT";
  var requestURL = "".concat(AWS_API, "?collection=").concat(CollectionName, "&key=").concat(player.id);
  var playerId = player.id;
  // App.sayToAll(`[httpGet] requestURL = ${requestURL}`)
  App.httpGet(requestURL, null, function (res) {
    var player = App.getPlayerByID(playerId);
    if (!player) return;
    var response = JSON.parse(res);
    if (response) {
      if (response.mbtiString) {}
    }
  });
}

/***/ }),

/***/ 515:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MBTIQuestions = void 0;
exports.MBTIQuestions = [{
  "id": 1,
  "dimension": "EI",
  "question": "사람들과 어울리는 것을 더 선호하는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 2,
  "dimension": "EI",
  "question": "새로운 사람들을 만나는 것이 즐겁다고 느낀다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 3,
  "dimension": "EI",
  "question": "혼자 조용히 생각하기보다는 대화를 통해 생각을 정리한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 4,
  "dimension": "EI",
  "question": "처음 보는 사람과 대화를 시작하는 데 큰 어려움이 없다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 5,
  "dimension": "EI",
  "question": "주말을 집에서 혼자 보내기보다는 친구들과 어울리는 것을 좋아한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 6,
  "dimension": "EI",
  "question": "파티나 모임이 끝난 후에도 피곤함보다는 만족감을 더 느낀다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 7,
  "dimension": "EI",
  "question": "그룹 활동을 할 때 자연스럽게 리더나 진행 역할을 맡게 된다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 8,
  "dimension": "EI",
  "question": "낯선 사람들에게도 먼저 말을 거는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 9,
  "dimension": "EI",
  "question": "큰 모임에서 내 생각을 자유롭게 표현하는 것이 즐겁다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 10,
  "dimension": "EI",
  "question": "여러 사람과 함께 일하는 것이 오히려 효율적이라고 생각한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 11,
  "dimension": "EI",
  "question": "계획 없는 모임이라도 사람들과 함께라면 즐겁다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 12,
  "dimension": "EI",
  "question": "새로운 팀원이나 친구를 사귀는 데 적극적인 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 13,
  "dimension": "EI",
  "question": "내 감정을 말로 표현하는 것이 비교적 쉬운 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 14,
  "dimension": "EI",
  "question": "일상에서 일어난 일을 바로 누군가에게 이야기하고 싶다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 15,
  "dimension": "EI",
  "question": "주위 사람들의 시선이나 관심이 나에게 쏠리는 것을 즐긴다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
},
// {
//   "id": 16,
//   "dimension": "EI",
//   "question": "전화 통화나 직접 만남으로 소통하는 것을 크게 부담스럽지 않게 느낀다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 17,
//   "dimension": "EI",
//   "question": "내 의견을 듣기 전에 다른 사람의 생각을 들어보려 해도, 결국 내 생각도 빨리 공유하고 싶다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 18,
//   "dimension": "EI",
//   "question": "흥미로운 주제가 나오면 여러 사람들과 활발하게 토론하고 싶다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 19,
//   "dimension": "EI",
//   "question": "사적인 공간보다 대중적인 장소에서 더 활기찬 에너지를 느낀다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 20,
//   "dimension": "EI",
//   "question": "낯선 환경에서도 빠르게 적응하여 사람들과 잘 어울린다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 21,
//   "dimension": "EI",
//   "question": "혼자서 오랜 시간을 보내면 오히려 지치거나 답답해진다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 22,
//   "dimension": "EI",
//   "question": "여럿이 모인 자리에서 발표하거나 이야기하는 것을 두려워하지 않는다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 23,
//   "dimension": "EI",
//   "question": "사교 모임이 취소되면 조금 아쉬움을 느낀다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 24,
//   "dimension": "EI",
//   "question": "새로운 사람과 만나면 대화 주제를 찾는 데 큰 어려움이 없다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
// {
//   "id": 25,
//   "dimension": "EI",
//   "question": "혼자 있을 때보다 사람들과 함께 있을 때 아이디어가 잘 나온다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",        "value": 0 },
//     { "text": "그런 편이다",    "value": 1 },
//     { "text": "매우 그렇다",    "value": 2 }
//   ]
// },
{
  "id": 26,
  "dimension": "SN",
  "question": "아이디어보다는 실제 경험을 통해 배우는 것을 선호한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 27,
  "dimension": "SN",
  "question": "구체적인 설명서나 매뉴얼이 있을 때 일하기가 훨씬 편하다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 28,
  "dimension": "SN",
  "question": "사소한 디테일도 놓치지 않으려 노력하는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 29,
  "dimension": "SN",
  "question": "추상적인 개념보다는 현실적인 예시를 더 중요하게 여긴다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 30,
  "dimension": "SN",
  "question": "과거의 경험과 기록이 미래를 예측하는 데 도움이 된다고 본다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 31,
  "dimension": "SN",
  "question": "사전에 준비된 자료가 부족하면 쉽게 불안함을 느낀다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 32,
  "dimension": "SN",
  "question": "사물이나 상황을 볼 때 먼저 눈에 보이는 것부터 파악한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 33,
  "dimension": "SN",
  "question": "현재 상황에서 가능한 실질적인 해법을 먼저 탐색하는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 34,
  "dimension": "SN",
  "question": "상상력보다는 실제로 작동하는지 여부가 더 중요하다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 35,
  "dimension": "SN",
  "question": "직감보다는 검증된 정보에 의존하려고 한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 36,
  "dimension": "SN",
  "question": "문제를 해결할 때 이론보다는 실제 사례 분석에 집중한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 37,
  "dimension": "SN",
  "question": "타인이 상상력을 발휘해도, 나는 구체적인 수치나 데이터를 더 믿는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 38,
  "dimension": "SN",
  "question": "새로운 아이디어보다 검증된 방식을 더 신뢰한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 39,
  "dimension": "SN",
  "question": "주변에서 일어나는 작은 변화도 잘 감지하고 대처하려는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 40,
  "dimension": "SN",
  "question": "먼 미래의 가능성보다는 당장 눈앞의 문제부터 해결하는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
},
// {
//   "id": 41,
//   "dimension": "SN",
//   "question": "실행하기 전에 테스트나 시뮬레이션을 꼼꼼히 거쳐보고 싶다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 42,
//   "dimension": "SN",
//   "question": "모호한 가정보다는 확실한 사실 관계를 먼저 파악한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 43,
//   "dimension": "SN",
//   "question": "주변 환경의 작은 단서도 놓치지 않고 살피는 편이다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 44,
//   "dimension": "SN",
//   "question": "복잡한 이론보다는 구체적인 사례 예시가 이해하기 쉽다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 45,
//   "dimension": "SN",
//   "question": "아이디어가 떠올라도 먼저 현실화가 가능한지부터 생각한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 46,
//   "dimension": "SN",
//   "question": "절차와 규칙을 정확히 따르는 것이 중요하다고 생각한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 47,
//   "dimension": "SN",
//   "question": "미래 트렌드를 예측하기보다는 현재 시장 상황을 분석하기 좋아한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 48,
//   "dimension": "SN",
//   "question": "물질적인 증거나 데이터를 통해 문제를 파악하는 것이 안전하다고 본다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 49,
//   "dimension": "SN",
//   "question": "문제를 해결할 때 '실제 사례'가 더 중요하다고 느낀다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 50,
//   "dimension": "SN",
//   "question": "추상적인 논의보다는 구체적 수치와 데이터가 더 신뢰가 간다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
{
  "id": 51,
  "dimension": "TF",
  "question": "논리적으로 맞지 않는 이야기에는 즉각적으로 반박하고 싶다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 52,
  "dimension": "TF",
  "question": "업무나 과제에서 효율과 결과를 최우선으로 고려한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 53,
  "dimension": "TF",
  "question": "누군가 고민을 털어놓으면, 먼저 해결책을 생각해주는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 54,
  "dimension": "TF",
  "question": "갈등 상황에서 감정보다 문제의 원인과 해결책을 먼저 분석한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 55,
  "dimension": "TF",
  "question": "논쟁에서 상대 기분을 상하게 하더라도 옳고 그름을 명확히 하고 싶다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 56,
  "dimension": "TF",
  "question": "친구에게 조언할 때 현실적이고 합리적인 방향으로 이야기한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 57,
  "dimension": "TF",
  "question": "감정보다는 사실관계를 먼저 명확히 해야 한다고 본다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 58,
  "dimension": "TF",
  "question": "상대방의 이야기를 들을 때 공감보다는 논리적 근거를 찾으려 한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 59,
  "dimension": "TF",
  "question": "판단을 내릴 때 주위 사람들의 감정적 반응은 크게 중요하지 않다고 느낀다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 60,
  "dimension": "TF",
  "question": "사람들과의 관계보다 업무 효율과 성과가 더 중요하다고 본다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 61,
  "dimension": "TF",
  "question": "의사소통할 때 감정보다는 근거를 제시하는 게 중요하다고 생각한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 62,
  "dimension": "TF",
  "question": "감정적 접근보다는 원칙을 지키는 것이 문제를 해결하는 데 효율적이라 본다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 63,
  "dimension": "TF",
  "question": "결과가 중요하다면 다소 차가운 방법이라도 수용할 수 있다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 64,
  "dimension": "TF",
  "question": "협업에서 상대 기분보다는 목표 달성이 우선이라고 본다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 65,
  "dimension": "TF",
  "question": "\"이것이 옳은가?\"를 먼저 묻고, \"이것이 좋은가?\"는 그다음에 생각한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
},
// {
//   "id": 66,
//   "dimension": "TF",
//   "question": "내 주장이 논리적으로 확실하다면, 다른 이들의 감정을 거스르더라도 강행한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 67,
//   "dimension": "TF",
//   "question": "감정적으로 접근하면 비효율적이라 생각하는 편이다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 68,
//   "dimension": "TF",
//   "question": "내 말이 사실이라면, 상대가 상처받아도 어쩔 수 없다고 생각한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 69,
//   "dimension": "TF",
//   "question": "동료의 실수가 있으면 솔직하고 직설적으로 지적하는 편이다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 70,
//   "dimension": "TF",
//   "question": "누군가 감정적으로 힘들어도, 우선 상황을 객관적으로 파악한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 71,
//   "dimension": "TF",
//   "question": "감정은 자주 변하지만 데이터나 사실은 변하지 않는다고 믿는다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 72,
//   "dimension": "TF",
//   "question": "원칙과 규칙이 분명하면 감정적 갈등이 줄어든다고 느낀다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 73,
//   "dimension": "TF",
//   "question": "개인 감정보다는 통계나 자료가 설득력이 있다고 본다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 74,
//   "dimension": "TF",
//   "question": "상대방이 거절감을 느끼더라도 피드백을 즉시 전달하는 것을 선호한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
// {
//   "id": 75,
//   "dimension": "TF",
//   "question": "합리적 판단이 사람들과의 감정적 공감보다 중요하다고 생각한다.",
//   "options": [
//     { "text": "전혀 그렇지 않다", "value": -2 },
//     { "text": "그렇지 않은 편이다", "value": -1 },
//     { "text": "보통이다",         "value": 0 },
//     { "text": "그런 편이다",     "value": 1 },
//     { "text": "매우 그렇다",     "value": 2 }
//   ]
// },
{
  "id": 76,
  "dimension": "JP",
  "question": "주말이나 휴일 일정을 미리 계획해두지 않으면 불안하다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 78,
  "dimension": "JP",
  "question": "모임을 계획할 때 세부 일정을 미리 확정하고 싶다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 79,
  "dimension": "JP",
  "question": "여행을 갈 때도 자유 여행보다 일정표가 있는 패키지를 선호한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 80,
  "dimension": "JP",
  "question": "불확실한 일정이나 상황보다는 확실한 계획이 마음이 편하다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 81,
  "dimension": "JP",
  "question": "계획이 어그러지면 스트레스를 크게 받는다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 87,
  "dimension": "JP",
  "question": "규칙과 절차를 준수해야 일관성 있게 진행된다고 믿는다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 89,
  "dimension": "JP",
  "question": "매일 일정표나 할 일 목록을 짜는 습관이 있으면 만족스럽다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 90,
  "dimension": "JP",
  "question": "어떤 일을 시작하기 전에 명확한 목표와 기한이 설정되어야 한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 91,
  "dimension": "JP",
  "question": "예측 불가능한 이벤트보다는 예측 가능한 상황을 선호한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 92,
  "dimension": "JP",
  "question": "자유로운 사고나 발상보다는 체계적인 접근이 더 효율적이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 94,
  "dimension": "JP",
  "question": "물건이 제자리에 있지 않으면 신경이 쓰이는 편이다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 95,
  "dimension": "JP",
  "question": "회의나 토론도 자유롭게 말하기보다는 정해진 순서를 따르는 게 좋다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 96,
  "dimension": "JP",
  "question": "중요한 결정을 내리기 전에 충분한 시간을 두고 고민해야 한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 98,
  "dimension": "JP",
  "question": "대부분의 상황에서 철저한 계획이 실패를 줄인다고 생각한다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}, {
  "id": 100,
  "dimension": "JP",
  "question": "일이나 생활에서 벗어나는 변수를 최소화해야 한다고 믿는다.",
  "options": [{
    "text": "전혀 그렇지 않다",
    "value": -2
  }, {
    "text": "그렇지 않은 편이다",
    "value": -1
  }, {
    "text": "보통이다",
    "value": 0
  }, {
    "text": "그런 편이다",
    "value": 1
  }, {
    "text": "매우 그렇다",
    "value": 2
  }]
}];

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