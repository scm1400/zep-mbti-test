import { LocationInfo, ScriptPlayer } from "zep-script";
import { getRandomIdsByDimension, MBTIAnswer, MBTIQuestions } from "./src/MBTIQuestions";
import { createTextObject } from "./src/Utillity";

const MBTI_SPRITES = {
    ISTJ: ScriptApp.loadSpritesheet("mbti/ISTJ.png"),
    ISFJ: ScriptApp.loadSpritesheet("mbti/ISFJ.png"),
    INFJ: ScriptApp.loadSpritesheet("mbti/INFJ.png"),
    INTJ: ScriptApp.loadSpritesheet("mbti/INTJ.png"),
    ISTP: ScriptApp.loadSpritesheet("mbti/ISTP.png"),
    ISFP: ScriptApp.loadSpritesheet("mbti/ISFP.png"),
    INFP: ScriptApp.loadSpritesheet("mbti/INFP.png"),
    INTP: ScriptApp.loadSpritesheet("mbti/INTP.png"),
    ESTP: ScriptApp.loadSpritesheet("mbti/ESTP.png"),
    ESFP: ScriptApp.loadSpritesheet("mbti/ESFP.png"),
    ENFP: ScriptApp.loadSpritesheet("mbti/ENFP.png"),
    ENTP: ScriptApp.loadSpritesheet("mbti/ENTP.png"),
    ESTJ: ScriptApp.loadSpritesheet("mbti/ESTJ.png"),
    ESFJ: ScriptApp.loadSpritesheet("mbti/ESFJ.png"),
    ENFJ: ScriptApp.loadSpritesheet("mbti/ENFJ.png"),
    ENTJ: ScriptApp.loadSpritesheet("mbti/ENTJ.png"),
}

const QuestionCountPerDimension = 15;

function safeGetLocation(key: string): LocationInfo {
    try {
        const locations = ScriptMap.getLocationList(key);
        if (!locations || locations.length === 0) {
            return null;
        }
        return locations[0];
    } catch (error) {
        return null;
    }
}

const Location: {
    MainScreen: LocationInfo,
    SubScreens: Record<string, LocationInfo>,
    Selects: Record<string, LocationInfo>,
}
    = {
    MainScreen: safeGetLocation("screen_main"),
    SubScreens: {
        screen_sub_1: safeGetLocation("screen_sub_1"),
        screen_sub_2: safeGetLocation("screen_sub_2"),
        screen_sub_3: safeGetLocation("screen_sub_3"),
        screen_sub_4: safeGetLocation("screen_sub_4"),
        screen_sub_5: safeGetLocation("screen_sub_5"),
    },
    Selects: {
        select_1: safeGetLocation("select_1"),
        select_2: safeGetLocation("select_2"),
        select_3: safeGetLocation("select_3"),
        select_4: safeGetLocation("select_4"),
        select_5: safeGetLocation("select_5"),
    }
}

const QuestionSize = QuestionCountPerDimension * 4;

Object.entries(Location.Selects).forEach(([key, location], index) => {
    if(!location) return;
    //@ts-ignore
    ScriptApp.addOnLocationEnter(key, (player: ScriptPlayer) => {
        const question = MBTIQuestions.find((q) => q.id == player.tag.questionNum);
        if (player.tag.questionOrderArr.length > 0) {
            player.tag.answers.push({ id: player.tag.questionNum, value: index - 2 });
            player.spawnAtLocation("start");
            player.tag.questionNum = player.tag.questionOrderArr.pop();
            renderMbtiQuestion(player);
            player.showCenterLabel(`${player.tag.answers.length}/${QuestionSize} 완료`, 0xffffff, 0x00000, 0);
        } else {
            const mbtiInfo = calculateMBTI(player.tag.answers);
            player.tag.mbti = mbtiInfo.title;
            player.title = player.tag.mbti;
            //@ts-ignore
            player.setCustomEffectSprite(2, MBTI_SPRITES[mbtiInfo.title], 0, 13, 1);
            
            // MBTI 결과 팝업 표시
            showMbtiResultPopup(player, mbtiInfo);
            
            player.spawnAtLocation("complete");
            player.sendUpdated();

            const data = {
                id: player.id,
                name: player.name,
                mbtiString: player.tag.mbti,
                mbtiPercentages: mbtiInfo.percentages,
                updatedAt: new Date().toISOString(),
            }
            saveMbtiResult(player.id, data, () => { });
        }
    })
})

const cameraPosition = ScriptMap.getLocation("camera");

const isMBTITestMap = !!ScriptMap.getLocation("map_mbti_test");

// 플레이어가 입장할 때 동작하는 함수
ScriptApp.onJoinPlayer.Add((player) => {
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
    
    if(isMBTITestMap){
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
function showWelcomePopup(player: ScriptPlayer) {
    player.tag.welcomeWidget = player.showWidget("welcome_popup.html", "center", 0, 0);
    
    // 위젯에서 메시지를 받으면 동작하는 함수
    player.tag.welcomeWidget.onMessage.Add(function(player, data) {
        if (data.type === "START_MBTI_TEST") {
            // 테스트 시작 요청 처리
            if (player.tag.welcomeWidget) {
                player.tag.welcomeWidget.destroy();
                player.tag.welcomeWidget = null;
            }
            
            startMbtiTest(player);
        }
    });
}

// MBTI 테스트 시작 함수
function startMbtiTest(player: ScriptPlayer) {
    player.tag.questionOrderArr = getRandomIdsByDimension(QuestionCountPerDimension);// 항목별로 n개
    player.tag.questionNum = player.tag.questionOrderArr.pop();
    player.tag.answers = [];
    
    player.showCenterLabel("MBTI 테스트 준비중...", 0xffffff, 0x00000, 200);
    
    const playerId = player.id;
    ScriptApp.runLater(() => {
        const player = ScriptApp.getPlayerByID(playerId);
        if (!player) return;
        player.showCenterLabel("MBTI 테스트 준비 완료!", 0xffffff, 0x00000, 200);
        player.moveSpeed = 140;
        player.sendUpdated();
        renderMbtiQuestion(player);
        player.tag.init = true;
    }, 1);
}

// MBTI 결과 팝업 표시 함수
function showMbtiResultPopup(player: ScriptPlayer, mbtiInfo) {
    // 백분율 정보를 UI에 맞게 변환
    const eScore = parseInt(mbtiInfo.percentages.eOrI.match(/\d+/)[0]);
    const sScore = parseInt(mbtiInfo.percentages.sOrN.match(/\d+/)[0]);
    const tScore = parseInt(mbtiInfo.percentages.tOrF.match(/\d+/)[0]);
    const jScore = parseInt(mbtiInfo.percentages.jOrP.match(/\d+/)[0]);
    
    player.tag.mbti = mbtiInfo.title;
    player.tag.mbtiPercentages = {
        EI: mbtiInfo.title[0] === 'E' ? `E ${eScore}% / I ${100 - eScore}%` : `I ${eScore}% / E ${100 - eScore}%`,
        SN: mbtiInfo.title[1] === 'S' ? `S ${sScore}% / N ${100 - sScore}%` : `N ${sScore}% / S ${100 - sScore}%`,
        TF: mbtiInfo.title[2] === 'T' ? `T ${tScore}% / F ${100 - tScore}%` : `F ${tScore}% / T ${100 - tScore}%`,
        JP: mbtiInfo.title[3] === 'J' ? `J ${jScore}% / P ${100 - jScore}%` : `P ${jScore}% / J ${100 - jScore}%`
    };
    
    player.tag.resultWidget = player.showWidget("result_popup.html", "center", 0, 0);
    
    // 위젯에서 메시지를 받으면 동작하는 함수
    player.tag.resultWidget.onMessage.Add(function(player, data) {
        if (data.type === "REQUEST_MBTI_RESULT") {
            // 결과 요청 처리
            if (player.tag.mbti) {
                const mbtiResult = {
                    mbtiType: player.tag.mbti,
                    percentages: player.tag.mbtiPercentages
                };
                
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
                ScriptApp.sayToAll(`[${player.name}님의 MBTI 결과] ${player.tag.mbti}`);
                ScriptApp.sayToAll(`${getMbtiNickname(player.tag.mbti)}`);
            }
        }
    });
}

// MBTI 유형의 별명 반환 함수
function getMbtiNickname(mbtiType: string): string {
    const mbtiNicknames = {
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

function renderMbtiQuestion(player: ScriptPlayer) {
    // const questionIndex = player.tag.questionNum - 1;
    const mbtiQuestion = MBTIQuestions.find((d) => d.id == player.tag.questionNum);
    let language = "en";
    if (player.language === "ko" || player.language === "ja") {
        language = player.language;
    }

    if(Location.MainScreen){
        createTextObject(player,
            mbtiQuestion.question[language],
            Location.MainScreen.x,
            Location.MainScreen.y - 0.5,
            {
                color: "white",
                fontSize: "20px",
                wordWrap: { useAdvancedWrap: true, width: Location.MainScreen.width * 32 },
                fixedWidth: Location.MainScreen.width * 32,
                align: "center",
            }
        )
    }

    Object.values(Location.SubScreens).forEach((locationInfo, index) => {
        if(!locationInfo) return;
        const optionText = mbtiQuestion.options[index].text[language];

        createTextObject(player,
            optionText,
            locationInfo.x,
            locationInfo.y,
            {
                color: "white",
                fontSize: "14px",
                wordWrap: { useAdvancedWrap: true, width: locationInfo.width * 32 },
                fixedWidth: locationInfo.width * 32,
                align: "center",
            })
    })
}

// 3) MBTI 유형 계산 함수
function calculateMBTI(
    answers: MBTIAnswer[]
): { title: string, percentages: object } {
    // 각 축별 점수
    let eScore = 0, iScore = 0;
    let sScore = 0, nScore = 0;
    let tScore = 0, fScore = 0;
    let jScore = 0, pScore = 0;

    for (const answer of answers) {
        // answer.id에 해당하는 question을 찾음
        const question = MBTIQuestions.find((q) => q.id === answer.id);
        if (!question) continue;

        const { dimension } = question;
        const { value } = answer;

        switch (dimension) {
            case 'EI':
                // value가 0 이상 → E, 0 미만 → I
                if (value >= 0) eScore += value;
                else iScore += Math.abs(value);
                break;

            case 'SN':
                // value가 0 이상 → S, 0 미만 → N
                if (value >= 0) sScore += value;
                else nScore += Math.abs(value);
                break;

            case 'TF':
                // value가 0 이상 → T, 0 미만 → F
                if (value >= 0) tScore += value;
                else fScore += Math.abs(value);
                break;

            case 'JP':
                // value가 0 이상 → J, 0 미만 → P
                if (value >= 0) jScore += value;
                else pScore += Math.abs(value);
                break;
        }
    }

    // EI, SN, TF, JP 각각 비교
    const eOrI = eScore >= iScore ? 'E' : 'I';
    const sOrN = sScore >= nScore ? 'S' : 'N';
    const tOrF = tScore >= fScore ? 'T' : 'F';
    const jOrP = jScore >= pScore ? 'J' : 'P';

    return {
        title: `${eOrI}${sOrN}${tOrF}${jOrP}`,
        percentages: {
            eOrI: eScore >= iScore ? `E (${(Math.floor(eScore / (eScore + iScore) * 100)) || 0})` : `I (${(Math.floor(iScore / (eScore + iScore) * 100)) || 0})`,
            sOrN: sScore >= nScore ? `S (${(Math.floor(sScore / (sScore + nScore) * 100)) || 0})` : `N (${(Math.floor(nScore / (sScore + nScore) * 100)) || 0})`,
            tOrF: tScore >= fScore ? `T (${(Math.floor(tScore / (tScore + fScore) * 100)) || 0})` : `F (${(Math.floor(fScore / (tScore + fScore) * 100)) || 0})`,
            jOrP: jScore >= pScore ? `J (${(Math.floor(jScore / (jScore + pScore) * 100)) || 0})` : `P (${(Math.floor(pScore / (jScore + pScore) * 100)) || 0})`,
        }
    };
}

class RequestOptions {
    key?: string;
    sortAttr?: string;
    sortOrder?: string;
    limit?: number;
    page?: number | 'count';
    searchAttr?: string;
    searchValue?: string;

    constructor() {
    }
}

function saveMbtiResult(key: string, data, callback) {
    const AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
    const CollectionName = "MBTI_RESULT";

    let saveObject = { ...data, collection: CollectionName, key: key };

    ScriptApp.httpPostJson(AWS_API, null, saveObject, res => {
        if (res.startsWith('success', 1)) {
            callback(true);
        } else {
            callback(false);
        }
    });
}


function getMbtiResult(player) {
    const AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
    const CollectionName = "MBTI_RESULT";
    let requestURL = `${AWS_API}?collection=${CollectionName}&key=${player.id}`;

    const playerId = player.id;
    // App.sayToAll(`[httpGet] requestURL = ${requestURL}`)
    ScriptApp.httpGet(requestURL, null, res => {
        const player = ScriptApp.getPlayerByID(playerId);
        if (!player) return;
        const response = JSON.parse(res);
        if (response) {
            if (response.mbtiString) {
                if(ScriptApp.mapHashID !== "WaV3qN"){
                    player.spawnAtMap("6epyab", "WaV3qN");
                } else {
                    //@ts-ignore
                    player.setCustomEffectSprite(2, MBTI_SPRITES[response.mbtiString], 0, 13, 1);
                    player.sendUpdated();
                }
            }
        }
    })
}

function showLoginRequiredPopup(player: ScriptPlayer) {
    player.showAlert("로그인이 필요합니다.", (res) => {
        showLoginRequiredPopup(player);
        loginRequired(player);
    }, {
        content: "MBTI 테스트를 위해 로그인이 필요합니다."
    })
}

function loginRequired(player) {
    if (player.tag.systemWidget) {
        player.tag.systemWidget.sendMessage({
            type: "loginRequired",
        });
    }
    return;
}
