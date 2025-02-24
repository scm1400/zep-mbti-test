import { ScriptPlayer } from "zep-script";

// 전역 상수(예시)
const TILE_SIZE = 32;
const FONT_FAMILY = "Arial";


interface PhaserGoOption {
    text: {
        name: string;
        x: number;
        y: number;
        text: string | string[];
        style: PhaserGoTextStyle;
    };
}
interface PhaserGoTextStyle {
    fontSize: string;
    fontFamily?: string;
    fontStyle?: string;
    color: string;
    strokeThickness?: number;
    stroke?: string;
    align: string;
    wordWrap: {
        useAdvancedWrap?: boolean;
        width?: number;
    };
    resolution?: number;
    fixedWidth?: number;
    maxLines?: number;
};


export function createTextObject(
    player: ScriptPlayer,
    text: string,
    x: number,
    y: number,
    textStyle: PhaserGoTextStyle,
): void {
    // id 설정
    const id = `${x}_${y}`;

    let depth = 1002;
    let xPos = x * TILE_SIZE;
    let yPos = y * TILE_SIZE + 32;

    // 공통 PhaserGoOption
    const phaserGoOption: PhaserGoOption = {
        text: {
            name: id,
            x: xPos,
            y: yPos,
            text: text,
            style: {
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
                resolution: 2,
                ...textStyle
            }
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



