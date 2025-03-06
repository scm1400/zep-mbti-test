// MBTI 문항에 대한 인터페이스
export interface MBTIQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  question: string;
  options: {
    text: string;
    value: number;
  }[];
}

// 사용자 응답에 대한 인터페이스
export interface MBTIAnswer {
  id: number;    // 질문 ID (1 ~ 100)
  value: number; // -2 ~ +2
}

export const MBTIQuestions = [
  // EI (외향-내향) 질문
  {
    "id": 1,
    "dimension": "EI",
    "question": {
      "ko": "나는 타인과의 상호작용에서 에너지를 얻는 편이다.",
      "en": "I tend to feel energized by interacting with others.",
      "ja": "私は他者との交流でエネルギーを得る傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 2,
    "dimension": "EI",
    "question": {
      "ko": "나는 새로운 사람들과의 만남에서 긍정적인 경험을 하곤 한다.",
      "en": "I tend to have positive experiences when meeting new people.",
      "ja": "新しい人と会うとき、前向きな経験をする傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 3,
    "dimension": "EI",
    "question": {
      "ko": "나는 혼자 깊이 생각하기보다 타인과의 대화를 통해 내 생각을 정리하는 것을 선호한다.",
      "en": "I prefer organizing my thoughts by discussing them with others rather than thinking alone.",
      "ja": "一人で考えるより、他者と話すことで自分の考えを整理することを好む。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 4,
    "dimension": "EI",
    "question": {
      "ko": "나는 처음 만난 사람과 자연스럽게 대화를 시작하는 편이다.",
      "en": "I naturally initiate conversation when meeting someone new.",
      "ja": "初対面の人と会うとき、自然に会話を始める。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 5,
    "dimension": "EI",
    "question": {
      "ko": "나는 주말에 집에 머무는 것보다 사회적 활동에 참여하는 것이 더 활력을 준다고 느낀다.",
      "en": "I feel more energized by engaging in social activities during the weekend than by staying at home.",
      "ja": "週末は家にいるよりも、社会的な活動に参加することでエネルギーを感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 6,
    "dimension": "EI",
    "question": {
      "ko": "나는 파티나 모임 후에 피로감보다 만족감을 더 크게 느낀다.",
      "en": "After a party or gathering, I tend to feel more satisfied than tired.",
      "ja": "パーティーや集まりの後は、疲労感よりも満足感を強く感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 7,
    "dimension": "EI",
    "question": {
      "ko": "나는 그룹 활동 시 자연스럽게 리더나 진행자 역할을 맡는 경향이 있다.",
      "en": "I tend to naturally take on a leadership or facilitator role during group activities.",
      "ja": "グループ活動では、自然とリーダーや進行役を担う傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 8,
    "dimension": "EI",
    "question": {
      "ko": "나는 새로운 사람에게 먼저 말을 거는 것을 주저하지 않는다.",
      "en": "I do not hesitate to speak to someone new.",
      "ja": "新しい人に対して先んじて話しかけることをためらわない。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 9,
    "dimension": "EI",
    "question": {
      "ko": "나는 큰 모임에서 내 생각을 자유롭게 표현하는 것을 즐긴다.",
      "en": "I enjoy expressing my thoughts freely in large gatherings.",
      "ja": "大規模な集まりで自分の考えを自由に表現することを楽しむ。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 10,
    "dimension": "EI",
    "question": {
      "ko": "나는 다수의 사람들과 함께 일할 때 효율성이 높다고 느낀다.",
      "en": "I feel that working with many people is more efficient.",
      "ja": "多くの人と一緒に働く方が効率的だと感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 11,
    "dimension": "EI",
    "question": {
      "ko": "나는 계획되지 않은 모임에서도 사람들과 함께 있으면 즐거움을 느낀다.",
      "en": "I enjoy being with people even in unplanned gatherings.",
      "ja": "計画されていない集まりでも、人と一緒にいると楽しいと感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 12,
    "dimension": "EI",
    "question": {
      "ko": "나는 새로운 팀원이나 친구를 만나는 데 적극적인 편이다.",
      "en": "I am proactive when it comes to meeting new team members or friends.",
      "ja": "新しいチームメンバーや友人に出会うことに積極的である。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 13,
    "dimension": "EI",
    "question": {
      "ko": "나는 내 감정을 말로 표현하는 것을 비교적 수월하게 느낀다.",
      "en": "I find it relatively easy to express my emotions verbally.",
      "ja": "自分の感情を言葉で表現するのは比較的容易だと感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 14,
    "dimension": "EI",
    "question": {
      "ko": "나는 일상에서의 경험을 다른 사람과 공유하고 싶어 한다.",
      "en": "I feel the urge to share my daily experiences with others.",
      "ja": "日常の出来事を他人と共有したいと感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 15,
    "dimension": "EI",
    "question": {
      "ko": "나는 주위의 관심이나 시선을 받을 때 긍정적인 느낌을 갖는다.",
      "en": "I tend to feel positive when I receive attention from others.",
      "ja": "周囲の関心や視線を受けると、前向きな気持ちになる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
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
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 27,
    "dimension": "SN",
    "question": {
      "ko": "나는 구체적인 설명서나 매뉴얼이 있을 때 작업하기 더 편하다고 느낀다.",
      "en": "I find it easier to work when clear instructions or manuals are provided.",
      "ja": "具体的な説明書やマニュアルがあると作業しやすいと感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 28,
    "dimension": "SN",
    "question": {
      "ko": "나는 사소한 디테일을 꼼꼼히 관찰하는 편이다.",
      "en": "I tend to pay close attention to even the smallest details.",
      "ja": "些細なディテールにも注意を払う傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 29,
    "dimension": "SN",
    "question": {
      "ko": "나는 추상적인 개념보다 현실적인 예시를 더 중시한다.",
      "en": "I value realistic examples more than abstract concepts.",
      "ja": "抽象的な概念よりも現実的な例を重視する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 30,
    "dimension": "SN",
    "question": {
      "ko": "나는 과거의 경험과 기록이 미래를 예측하는 데 도움이 된다고 생각한다.",
      "en": "I believe that past experiences and records help in predicting the future.",
      "ja": "過去の経験や記録が未来の予測に役立つと考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 31,
    "dimension": "SN",
    "question": {
      "ko": "나는 자료나 정보가 충분하지 않을 때 불안감을 느끼는 편이다.",
      "en": "I tend to feel uneasy when there is a lack of sufficient information.",
      "ja": "十分な情報がないと不安を感じる傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 32,
    "dimension": "SN",
    "question": {
      "ko": "나는 사물이나 상황을 관찰할 때 눈에 보이는 것부터 파악하는 편이다.",
      "en": "I tend to assess things by first noticing what is visible.",
      "ja": "物事や状況を見るとき、まず目に見えるものから把握する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 33,
    "dimension": "SN",
    "question": {
      "ko": "나는 현재 상황에서 실질적인 해결책을 먼저 모색하는 편이다.",
      "en": "I tend to seek practical solutions first in the present situation.",
      "ja": "現状で実際に機能する解決策をまず模索する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 34,
    "dimension": "SN",
    "question": {
      "ko": "나는 상상력보다는 실제로 작동하는지 여부를 더 중요하게 생각한다.",
      "en": "I consider whether something works in practice more important than imaginative ideas.",
      "ja": "想像力よりも、実際に機能するかどうかを重視する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 35,
    "dimension": "SN",
    "question": {
      "ko": "나는 직감보다 검증된 정보를 신뢰하는 경향이 있다.",
      "en": "I tend to trust verified information over mere intuition.",
      "ja": "直感よりも、検証済みの情報を信頼する傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 36,
    "dimension": "SN",
    "question": {
      "ko": "나는 문제 해결 시 이론보다 실제 사례 분석에 집중하는 편이다.",
      "en": "When solving problems, I focus more on analyzing real examples than on theories.",
      "ja": "問題解決の際、理論よりも実例の分析に重点を置く。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 37,
    "dimension": "SN",
    "question": {
      "ko": "나는 타인의 상상력보다 구체적인 수치나 데이터를 더 신뢰하는 편이다.",
      "en": "I tend to trust concrete figures or data more than others' imaginative ideas.",
      "ja": "他人の想像力よりも、具体的な数値やデータを信頼する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 38,
    "dimension": "SN",
    "question": {
      "ko": "나는 새로운 아이디어보다 검증된 방식을 선호한다.",
      "en": "I prefer proven methods over new ideas.",
      "ja": "新しいアイデアよりも、検証済みの方法を好む。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 39,
    "dimension": "SN",
    "question": {
      "ko": "나는 주변의 작은 변화도 빠르게 감지하고 적절히 대응하는 편이다.",
      "en": "I quickly notice even small changes around me and respond appropriately.",
      "ja": "周囲の小さな変化にもすぐに気付き、適切に対処する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 40,
    "dimension": "SN",
    "question": {
      "ko": "나는 먼 미래보다는 당장의 문제를 먼저 해결하는 경향이 있다.",
      "en": "I tend to address immediate problems before considering distant future possibilities.",
      "ja": "遠い未来よりも、目の前の問題を先に解決する傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
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
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 52,
    "dimension": "TF",
    "question": {
      "ko": "나는 업무나 과제에서 효율과 결과를 가장 중시한다.",
      "en": "I prioritize efficiency and outcomes in tasks and assignments.",
      "ja": "業務や課題では効率と成果を最も重視する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 53,
    "dimension": "TF",
    "question": {
      "ko": "나는 누군가 고민을 털어놓을 때 먼저 해결책을 모색하는 편이다.",
      "en": "When someone shares their concerns, I tend to look for solutions first.",
      "ja": "誰かが悩みを打ち明けると、まず解決策を探す傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 54,
    "dimension": "TF",
    "question": {
      "ko": "나는 갈등 상황에서 감정보다 문제의 원인과 해결책에 초점을 맞춘다.",
      "en": "In conflict situations, I focus more on identifying the causes and solutions than on emotions.",
      "ja": "対立の際、感情よりも問題の原因と解決策に焦点を当てる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 55,
    "dimension": "TF",
    "question": {
      "ko": "나는 논쟁 중에도 옳고 그름을 명확하게 하고자 하는 편이다.",
      "en": "I strive to clearly distinguish between right and wrong during arguments.",
      "ja": "議論の際、正誤を明確にしたいと努める。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 56,
    "dimension": "TF",
    "question": {
      "ko": "나는 친구에게 조언할 때 현실적이고 합리적인 방향을 제시하는 편이다.",
      "en": "When giving advice to friends, I tend to offer practical and rational suggestions.",
      "ja": "友人に助言する際、現実的で合理的な提案をする傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 57,
    "dimension": "TF",
    "question": {
      "ko": "나는 결정을 내릴 때 감정보다 객관적인 사실에 더 의존하는 편이다.",
      "en": "I tend to rely on objective facts rather than emotions when making decisions.",
      "ja": "判断する際、感情よりも客観的な事実に依存する傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 58,
    "dimension": "TF",
    "question": {
      "ko": "나는 타인의 이야기를 들을 때 공감보다 논리적 근거를 우선시하는 편이다.",
      "en": "When listening to others, I tend to prioritize logical reasoning over empathy.",
      "ja": "他人の話を聞くとき、共感よりも論理的根拠を優先する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 59,
    "dimension": "TF",
    "question": {
      "ko": "나는 결정을 내릴 때 주위 사람들의 감정보다 객관적 사실에 더 집중한다.",
      "en": "I focus more on objective facts than on others' emotional reactions when making decisions.",
      "ja": "判断する際、周囲の感情よりも客観的な事実に集中する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 60,
    "dimension": "TF",
    "question": {
      "ko": "나는 사람과의 관계보다 업무 성과와 효율을 더 우선시하는 편이다.",
      "en": "I tend to prioritize work performance and efficiency over personal relationships.",
      "ja": "人間関係よりも、業務の成果や効率を優先する傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 61,
    "dimension": "TF",
    "question": {
      "ko": "나는 의사소통 시 감정보다 근거 제시가 중요하다고 생각한다.",
      "en": "I believe that providing evidence is more important than emotion when communicating.",
      "ja": "コミュニケーションの際、感情よりも根拠を示すことが重要だと考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 62,
    "dimension": "TF",
    "question": {
      "ko": "나는 감정보다는 원칙을 지키는 것이 문제 해결에 효과적이라고 믿는다.",
      "en": "I believe that sticking to principles is more effective for solving problems than relying on emotions.",
      "ja": "感情よりも原則を守ることが、問題解決により効果的だと信じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 63,
    "dimension": "TF",
    "question": {
      "ko": "나는 결과가 중요하다면 다소 냉정한 방법도 수용할 수 있다.",
      "en": "If results are important, I can accept somewhat detached methods.",
      "ja": "結果が重要なら、多少冷静な方法も受け入れることができる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 64,
    "dimension": "TF",
    "question": {
      "ko": "나는 협업 시 목표 달성을 위해 감정보다 결과를 우선시하는 편이다.",
      "en": "In collaborations, I tend to prioritize achieving goals over attending to others' feelings.",
      "ja": "協働の際、他人の感情よりも目標達成を優先する傾向がある。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 65,
    "dimension": "TF",
    "question": {
      "ko": "나는 어떤 결정을 내리기 전 '이것이 옳은가?'를 먼저 고려하고 그 후에 '이것이 좋은가?'를 생각한다.",
      "en": "Before making a decision, I first consider 'Is this right?' and then think 'Is this good?'",
      "ja": "何かを決定する前に、『これが正しいか？』をまず考え、その後『これが良いか？』を検討する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
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
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 78,
    "dimension": "JP",
    "question": {
      "ko": "나는 모임을 계획할 때 세부 일정을 미리 확정하는 것을 선호한다.",
      "en": "I prefer to finalize detailed schedules in advance when planning gatherings.",
      "ja": "集まりを計画する際、詳細なスケジュールを事前に決定することを好む。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 79,
    "dimension": "JP",
    "question": {
      "ko": "나는 여행 시 자유로운 일정보다 정해진 일정표가 있는 패키지 여행을 선호한다.",
      "en": "When traveling, I prefer package tours with fixed itineraries over free-form travel.",
      "ja": "旅行に行くとき、自由旅行よりも日程が決まっているパッケージツアーを好む。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 80,
    "dimension": "JP",
    "question": {
      "ko": "나는 불확실한 일정보다는 명확한 계획이 있을 때 더 안정감을 느낀다.",
      "en": "I feel more secure when I have a clear plan rather than an uncertain schedule.",
      "ja": "不確定な予定よりも、明確な計画があると安心する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 81,
    "dimension": "JP",
    "question": {
      "ko": "나는 계획이 변경되면 큰 스트레스를 느끼는 편이다.",
      "en": "I tend to experience significant stress when plans change.",
      "ja": "計画が変更されると大きなストレスを感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 87,
    "dimension": "JP",
    "question": {
      "ko": "나는 규칙과 절차를 준수하는 것이 일의 일관성을 유지하는 데 중요하다고 생각한다.",
      "en": "I believe that following rules and procedures is essential for maintaining consistency.",
      "ja": "規則や手続きを守ることが、仕事の一貫性を保つために重要だと考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 89,
    "dimension": "JP",
    "question": {
      "ko": "나는 매일 일정표나 할 일 목록을 작성할 때 만족감을 느낀다.",
      "en": "I feel satisfied when I have the habit of making daily schedules or to-do lists.",
      "ja": "毎日スケジュールややることリストを作る習慣があると満足する。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 90,
    "dimension": "JP",
    "question": {
      "ko": "나는 어떤 일을 시작하기 전에 명확한 목표와 기한이 설정되어야 한다고 생각한다.",
      "en": "I believe that clear goals and deadlines should be set before starting any task.",
      "ja": "何かを始める前に、明確な目標と期限を設定すべきだと考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 91,
    "dimension": "JP",
    "question": {
      "ko": "나는 예측 불가능한 이벤트보다 예측 가능한 상황을 선호한다.",
      "en": "I prefer predictable situations over unpredictable events.",
      "ja": "予測不可能なイベントよりも、予測可能な状況を好む。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 92,
    "dimension": "JP",
    "question": {
      "ko": "나는 자유로운 사고보다 체계적인 접근을 통한 문제 해결이 더 효율적이라고 생각한다.",
      "en": "I believe that a systematic approach to problem-solving is more efficient than free-form thinking.",
      "ja": "自由な発想よりも、体系的なアプローチによる問題解決の方が効率的だと考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 94,
    "dimension": "JP",
    "question": {
      "ko": "나는 물건이 제자리에 있지 않으면 불편함을 느낀다.",
      "en": "I tend to feel uncomfortable when things are not in their proper place.",
      "ja": "物が所定の位置にないと不快に感じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 95,
    "dimension": "JP",
    "question": {
      "ko": "나는 회의나 토론 시 정해진 순서를 따르는 것이 효과적이라고 생각한다.",
      "en": "I believe that following a predetermined order in meetings or discussions is more effective than speaking freely.",
      "ja": "会議や討論では、自由に話すよりも定められた順序に従う方が効果的だと考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 96,
    "dimension": "JP",
    "question": {
      "ko": "나는 중요한 결정을 내리기 전에 충분한 시간을 가지고 신중히 고민하는 편이다.",
      "en": "I tend to take sufficient time to deliberate carefully before making important decisions.",
      "ja": "重要な決定を下す前に、十分な時間をかけて慎重に考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 98,
    "dimension": "JP",
    "question": {
      "ko": "나는 철저한 계획이 대부분의 상황에서 실패를 줄이는 데 도움이 된다고 믿는다.",
      "en": "I believe that thorough planning helps reduce failures in most situations.",
      "ja": "徹底した計画がほとんどの状況で失敗を減らすのに役立つと信じる。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  },
  {
    "id": 100,
    "dimension": "JP",
    "question": {
      "ko": "나는 일과 생활에서 예측 불가능한 요소를 최소화하는 것이 안정감에 기여한다고 생각한다.",
      "en": "I believe that minimizing unpredictable factors in work and life contributes to a sense of stability.",
      "ja": "仕事や生活において予測不可能な要素を最小限にすることが安心感につながると考える。"
    },
    "options": [
      { "text": { "ko": "전혀 그렇지 않다", "en": "Not at all", "ja": "全くそうではない" }, "value": -2 },
      { "text": { "ko": "그렇지 않은 편이다", "en": "Slightly disagree", "ja": "あまりそうではない" }, "value": -1 },
      { "text": { "ko": "보통이다", "en": "Neutral", "ja": "普通" }, "value": 0 },
      { "text": { "ko": "그런 편이다", "en": "Somewhat agree", "ja": "そうだ" }, "value": 1 },
      { "text": { "ko": "매우 그렇다", "en": "Strongly agree", "ja": "非常にそうだ" }, "value": 2 }
    ]
  }
];
export function getRandomIdsByDimension(n: number): number[] {
  // 각 차원별로 질문 그룹핑
  const grouped: Record<string, number[]> = {};
  MBTIQuestions.forEach(q => {
    if (!grouped[q.dimension]) {
      grouped[q.dimension] = [];
    }
    grouped[q.dimension].push(q.id);
  });

  // 각 그룹에서 n개의 랜덤 id 선택
  let result: number[] = [];
  for (const dimension in grouped) {
    // 질문 배열 복사 후 섞기(shuffle)
    const shuffled = grouped[dimension].slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // n개 이하인 경우 모두 선택, 그렇지 않으면 n개 선택
    const selected = shuffled.slice(0, Math.min(n, shuffled.length));
    result = result.concat(selected);
  }

  return result;
}