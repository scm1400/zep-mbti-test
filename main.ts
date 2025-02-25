import { LocationInfo, ScriptPlayer } from "zep-script";
import { MBTIAnswer, MBTIQuestion, MBTIQuestions } from "./src/MBTIQuestions";
import { createTextObject } from "./src/Utillity";

const Location: {
    MainScreen: LocationInfo,
    SubScreens: Record<string, LocationInfo>,
    Selects: Record<string, LocationInfo>,
}
    = {
    MainScreen: ScriptMap.getLocationList("screen_main")[0],
    SubScreens: {
        screen_sub_1: ScriptMap.getLocationList("screen_sub_1")[0],
        screen_sub_2: ScriptMap.getLocationList("screen_sub_2")[0],
        screen_sub_3: ScriptMap.getLocationList("screen_sub_3")[0],
        screen_sub_4: ScriptMap.getLocationList("screen_sub_4")[0],
        screen_sub_5: ScriptMap.getLocationList("screen_sub_5")[0],
    },
    Selects: {
        select_1: ScriptMap.getLocationList("select_1")[0],
        select_2: ScriptMap.getLocationList("select_2")[0],
        select_3: ScriptMap.getLocationList("select_3")[0],
        select_4: ScriptMap.getLocationList("select_4")[0],
        select_5: ScriptMap.getLocationList("select_5")[0],
    }
}

const QuestionSize = Object.keys(MBTIQuestions).length;

Object.entries(Location.Selects).forEach(([key, location], index) => {
    //@ts-ignore
    ScriptApp.addOnLocationEnter(key, (player: ScriptPlayer) => {
        const questionCount = player.tag.questionNum;
        const question = MBTIQuestions[questionCount];
        if (questionCount < QuestionSize && question) {
            player.tag.answers.push({ id: question.id, value: index - 2 });
            // player.sendMessage(JSON.stringify(player.tag.answers));
            player.spawnAtLocation("start");
            player.tag.questionNum++;
            renderMbtiQuestion(player);
            player.showCenterLabel(`${questionCount}/${QuestionSize} 완료`);
        } else {
            const mbtiInfo = calculateMBTI(player.tag.answers);
            player.tag.mbti = mbtiInfo.title;
            player.title = player.tag.mbti;
            let resultString = "";
            Object.values(mbtiInfo.percentages).forEach((string, index,) => {
                resultString += string + "\n";
            })
            player.showAlert("MBTI 검사 결과", () => {
                player.spawnAtMap("AlPRzo", "yBZAkk");
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

ScriptApp.onJoinPlayer.Add((player) => {
    player.tag = {};

    player.tag.questionNum = 1;
    player.tag.answers = [];
    player.moveSpeed = 0;
    player.displayRatio = 1.25;
    player.enableFreeView = false;
    player.showCenterLabel("MBTI 테스트 준비중...");
    player.sendUpdated();

    const playerId = player.id;
    ScriptApp.runLater(() => {
        const player = ScriptApp.getPlayerByID(playerId);
        if (!player) return;
        player.showCenterLabel("MBTI 테스트 준비 완료!");
        player.moveSpeed = 140;
        player.sendUpdated();
        renderMbtiQuestion(player);
        player.tag.init = true;
    }, 1);

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
    const questionIndex = player.tag.questionNum - 1;
    const mbtiQuestion = MBTIQuestions[questionIndex];

    createTextObject(player,
        mbtiQuestion.question,
        Location.MainScreen.x,
        Location.MainScreen.y,
        {
            color: "white",
            fontSize: "20px",
            wordWrap: { useAdvancedWrap: true, width: Location.MainScreen.width * 32 },
            fixedWidth: Location.MainScreen.width * 32,
            align: "center",
        })

    Object.values(Location.SubScreens).forEach((locationInfo, index) => {
        const optionText = mbtiQuestion.options[index].text;

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
            eOrI: eScore >= iScore ? `E (${Math.floor(eScore / (eScore + iScore) * 100)})` : `I (${Math.floor(iScore / (eScore + iScore) * 100)})`,
            sOrN: sScore >= nScore ? `S (${Math.floor(sScore / (sScore + nScore) * 100)})` : `N (${Math.floor(nScore / (sScore + nScore) * 100)})`,
            tOrF: tScore >= fScore ? `T (${Math.floor(tScore / (tScore + fScore) * 100)})` : `F (${Math.floor(fScore / (tScore + fScore) * 100)})`,
            jOrP: jScore >= pScore ? `J (${Math.floor(jScore / (jScore + pScore) * 100)})` : `P (${Math.floor(pScore / (jScore + pScore) * 100)})`,
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

            }
        }
    })
}