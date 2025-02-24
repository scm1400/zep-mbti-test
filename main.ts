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
        const questionNum = player.tag.questionNum;
        if (questionNum < QuestionSize) {
            player.tag.answers.push({ id: questionNum, value: index - 2 });
            // player.sendMessage(JSON.stringify(player.tag.answers));
            player.spawnAtLocation("start");
            player.tag.questionNum++;
            renderMbtiQuestion(player);

            player.showCenterLabel(`${questionNum}/${QuestionSize} 완료`);
        } else {
            player.tag.mbti = calculateMBTI(player.tag.answers);
            player.title = player.tag.mbti;
            player.spawnAtLocation("complete");
            player.sendUpdated();
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
): string {
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

    return `${eOrI}${sOrN}${tOrF}${jOrP}`;
}