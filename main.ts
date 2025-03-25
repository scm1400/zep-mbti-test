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
    if (!location) return;
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
function showWelcomePopup(player: ScriptPlayer) {
    // 먼저 DB에서 기존 결과가 있는지 확인
    const AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
    const CollectionName = "MBTI_RESULT";
    let requestURL = `${AWS_API}?collection=${CollectionName}&key=${player.id}`;

    ScriptApp.httpGet(requestURL, null, res => {
        const response = JSON.parse(res);

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
function showMbtiResultPopup(player: ScriptPlayer, mbtiInfo = null) {
    // mbtiInfo가 제공된 경우 (테스트 완료 후 호출된 경우)
    if (mbtiInfo) {
        // console.log("받은 MBTI 결과 데이터:", JSON.stringify(mbtiInfo));

        // 백분율 정보 추출 및 변환
        let eOrIType, sOrNType, tOrFType, jOrPType;
        let eOrIScore, sOrNScore, tOrFScore, jOrPScore;

        try {
            // 정규식 패턴 수정
            const eOrIMatch = mbtiInfo.percentages.eOrI.match(/([EI])\s*\((\d+)\)/);
            const sOrNMatch = mbtiInfo.percentages.sOrN.match(/([SN])\s*\((\d+)\)/);
            const tOrFMatch = mbtiInfo.percentages.tOrF.match(/([TF])\s*\((\d+)\)/);
            const jOrPMatch = mbtiInfo.percentages.jOrP.match(/([JP])\s*\((\d+)\)/);

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
            EI: eOrIType === 'E' ? 
                `E ${eOrIScore}% / I ${100 - eOrIScore}%` : 
                `I ${eOrIScore}% / E ${100 - eOrIScore}%`,
            SN: sOrNType === 'S' ? 
                `S ${sOrNScore}% / N ${100 - sOrNScore}%` : 
                `N ${sOrNScore}% / S ${100 - sOrNScore}%`,
            TF: tOrFType === 'T' ? 
                `T ${tOrFScore}% / F ${100 - tOrFScore}%` : 
                `F ${tOrFScore}% / T ${100 - tOrFScore}%`,
            JP: jOrPType === 'J' ? 
                `J ${jOrPScore}% / P ${100 - jOrPScore}%` : 
                `P ${jOrPScore}% / J ${100 - jOrPScore}%`
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
                const mbtiResult = {
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
                ScriptApp.sayToAll(`[${player.name}님의 MBTI 결과] ${player.tag.mbti}`);
                ScriptApp.sayToAll(`${getMbtiNickname(player.tag.mbti)}`);
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

    if (Location.MainScreen) {
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
        if (!locationInfo) return;
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
    // 이미 MBTI 데이터가 로드된 경우는 중복 호출하지 않음
    if (player.tag.mbti) return;

    const AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
    const CollectionName = "MBTI_RESULT";
    let requestURL = `${AWS_API}?collection=${CollectionName}&key=${player.id}`;

    const playerId = player.id;
    ScriptApp.httpGet(requestURL, null, res => {
        const player = ScriptApp.getPlayerByID(playerId);
        if (!player) return;
        const response = JSON.parse(res);
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

// 테스트 완료 상태 확인 함수
function checkTestCompleted(player: ScriptPlayer) {
    // DB에서 데이터를 불러오기 전에 이미 tag.mbti가 있는지 확인
    if (player.tag.welcomeWidget && player.tag.mbti) {
        // 이미 불러온 MBTI 데이터가 있는 경우
        player.tag.welcomeWidget.sendMessage({
            testCompleted: true
        });
    } else {
        // DB에서 테스트 결과 다시 확인
        const AWS_API = 'https://jstvymmti6.execute-api.ap-northeast-2.amazonaws.com/liveAppDBRequest';
        const CollectionName = "MBTI_RESULT";
        let requestURL = `${AWS_API}?collection=${CollectionName}&key=${player.id}`;

        ScriptApp.httpGet(requestURL, null, res => {
            if (!player.tag.welcomeWidget) return; // 위젯이 이미 닫힌 경우

            try {
                const response = JSON.parse(res);
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
function goToMBTILounge(player: ScriptPlayer) {
    try {
        // MBTI 라운지 맵으로 이동
        player.spawnAtMap("6epyab", "WaV3qN");
    } catch (error) {
        // console.error("MBTI 라운지 이동 실패:", error);
        // 이동 실패 시 플레이어에게 알림
        player.showCenterLabel("MBTI 라운지 이동에 실패했습니다.", 0xFF0000, 0xFFFFFF, 200);
    }
}
