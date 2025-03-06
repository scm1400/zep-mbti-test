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
            // player.sendMessage(JSON.stringify(player.tag.answers));
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
            let resultString = "";
            Object.values(mbtiInfo.percentages).forEach((string, index,) => {
                resultString += string + "\n";
            })
            player.showAlert("MBTI 검사 결과", () => {
                player.spawnAtMap("6epyab", "WaV3qN");
            }, {
                content: resultString
            })
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

ScriptApp.onJoinPlayer.Add((player) => {
    player.tag = {};
    player.tag.systemWidegt = player.showWidget("system.html", "topleft", 0, 0);

    if (player.isGuest) {
        player.moveSpeed = 0;
        player.sendUpdated();
        showLoginRequiredPopup(player);

        loginRequired(player);
        return;
    }
    
    if(isMBTITestMap){
        player.tag.questionOrderArr = getRandomIdsByDimension(QuestionCountPerDimension);// 항목별로 n개
        player.tag.questionNum = player.tag.questionOrderArr.pop();
        player.tag.answers = [];
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

        player.showCenterLabel("MBTI 테스트 준비중...", 0xffffff, 0x00000, 200);
        player.sendUpdated();
    
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

    getMbtiResult(player);
});

let _refreshDelay = 0;
ScriptApp.onUpdate.Add((dt) => {
    _refreshDelay += dt;
    if (_refreshDelay > 10) {
        ScriptApp.players.forEach((player) => {
            if (player.away) {
                player.spawnAtMap("AlPRzo", "yBZAkk");
            }
        })
    }
})

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
    if (player.tag.systemWidegt) {
        player.tag.systemWidegt.sendMessage({
            type: "loginRequired",
        });
    }
    return;
}
