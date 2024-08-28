"use client";
import FormTextArea from "@/components/control/input/FormTextArea";
import { Spinner } from "@/components/radix-theme/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { arrayUnique } from "@/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ReactJson from "react-json-view";
import { z } from "zod";
import vi from "./vi.dic.json";

const schema = z.object({
  keyword: z.string().min(1, "Required"),
});

type Schema = z.infer<typeof schema>;

export default function Page() {
  const [result, setResult] = useState<any>();
  const forms = useForm<Schema>({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmit = (values: Schema) => {
    const words = values.keyword.trim().split(" ");
    if (!words.length) return;
    const destructWords = words.map((word) => destructWord(word));
    const destructWordSimilar = getAllDestructWordSimilar(destructWords);
    const generates = generateAllCase(destructWordSimilar);
    const newWords = generates.map((word) => structWord(word));
    const uniqueNewWords = arrayUnique(newWords) as string[];
    const validSpells = uniqueNewWords.filter((word) => {
      return vi?.[word as keyof typeof vi];
    });
    const completeWords = shuffleWordToCompleteWord(validSpells, words.length);
    const validCompleteWords = checkValidStruct(destructWordSimilar, completeWords);
    setResult({
      recommends: validCompleteWords,
      allResult: completeWords,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-auto bg-foreground p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between space-y-2 font-mono">
        <FormProvider {...forms}>
          <form onSubmit={forms.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <FormTextArea name="keyword" label="keyword" description="This is keyword" required />
              <Button className="w-fit" type="submit">
                Submit
              </Button>
              <ReactJson src={result} theme="monokai" />
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}

type WordStruct = {
  initialConsonant: string;
  vowel: string;
  finalConsonant: string;
  tone: string;
};

function destructWord(word: string) {
  const wordLowerCase = word.toLowerCase();

  let result = {
    initialConsonant: "",
    vowel: "",
    finalConsonant: "",
    tone: "",
    punctuation: "",
  };

  for (let char of wordLowerCase) {
    if (punctuation.test(char)) {
      result.punctuation += char;
    } else if (vowelToneMap?.[char]) {
      result.vowel += vowelToneMap?.[char]?.char;
      result.tone += !result.tone ? vowelToneMap?.[char]?.tone : "";
    } else if (
      !result.vowel &&
      (!result.initialConsonant || initialComposeConsonants?.[result.initialConsonant[result.initialConsonant.length - 1]].includes(char)) &&
      initialConsonants.includes(char)
    ) {
      result.initialConsonant += char;
    } else if (finalConsonants.includes(char)) {
      result.finalConsonant += char;
    }
  }

  return result;
}

const getAllDestructWordSimilar = (destructWord: WordStruct[]) => {
  return destructWord.reduce((prev, cur) => {
    const similarInitialConsonants = initialConsonantSimilarMap[cur.initialConsonant];
    const similarVowels = vowelSimilarMap[cur.vowel];

    const allCase: WordStruct[] = [];

    similarInitialConsonants?.forEach((initialConsonant) => {
      similarVowels?.forEach((vowel) => {
        allCase.push({ ...cur, vowel, initialConsonant });
      });
    });
    return [...prev, cur, ...allCase];
  }, [] as WordStruct[]);
};

const generateAllCase = (input: WordStruct[]) => {
  const initialConsonants: string[] = [];
  const vowels: string[] = [];
  const finalConsonants: string[] = [];
  const tones: string[] = [];
  input.forEach((item) => {
    initialConsonants.push(item.initialConsonant);
    vowels.push(item.vowel);
    finalConsonants.push(item.finalConsonant);
    tones.push(item.tone);
  });
  const result: WordStruct[] = [];
  initialConsonants.forEach((initialConsonant) => {
    vowels.forEach((vowel) => {
      tones.forEach((tone) => {
        finalConsonants.forEach((finalConsonant) => {
          result.push({ initialConsonant, vowel, finalConsonant, tone });
        });
      });
    });
  });
  return result;
};

const structWord = (input: WordStruct) => {
  const { initialConsonant, vowel, finalConsonant, tone } = input;
  const vowelStruct = vowel ? vowelsWithToneMap[vowel] : undefined;
  const vowelWithTone = vowelStruct ? vowelStruct[tone] : undefined;
  return initialConsonant + (vowelWithTone || vowel) + finalConsonant;
};

const generateCombinations = (arr: string[], length: number): string[][] => {
  if (length === 1) return arr.map((item) => [item]);

  const combinations: string[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const remaining = generateCombinations(arr.slice(i + 1), length - 1);
    remaining.forEach((combination) => {
      combinations.push([arr[i], ...combination]);
    });
  }
  return combinations;
};

const shuffleWordToCompleteWord = (word: string[], pick: number): string[] => {
  // Get all combinations of the specified length
  const combinations = generateCombinations(word, pick);

  // Convert combinations into complete words
  return combinations.map((combination) => combination.join(" "));
};

const getMapFromStruct = (wordStruct: WordStruct[]) => {
  return wordStruct.reduce(
    (prev, cur) => ({
      initialConsonantMap: { ...prev.initialConsonantMap, [cur.initialConsonant]: true },
      vowelMap: { ...prev.vowelMap, [cur.vowel]: true },
      finalConsonantMap: { ...prev.finalConsonantMap, [cur.finalConsonant]: true },
      toneMap: { ...prev.toneMap, [cur.tone]: true },
    }),
    {
      initialConsonantMap: {},
      vowelMap: {},
      finalConsonantMap: {},
      toneMap: {},
    },
  );
};

type AnyObject = { [key: string]: any };

// Helper function to sort an object’s keys and values
const sortObject = (obj: AnyObject): AnyObject => {
  if (typeof obj !== "object" || obj === null) return obj;

  // Sort arrays by their elements
  if (Array.isArray(obj)) return obj.map(sortObject).sort();

  // Sort object keys
  return Object.keys(obj)
    .sort()
    .reduce((sortedObj, key) => {
      sortedObj[key] = sortObject(obj[key]);
      return sortedObj;
    }, {} as AnyObject);
};

//update this check for valid word and similar word
const checkValidStruct = (validWordStruct: WordStruct[], words: string[]) => {
  const validMap = getMapFromStruct(validWordStruct);
  const validMapJson = JSON.stringify(sortObject(validMap));

  return words.filter((word) => {
    const values = word?.split(" ");
    const destructWords = values?.map((value) => destructWord(value));
    const destructWordSimilar = getAllDestructWordSimilar(destructWords);
    const checkMap = getMapFromStruct(destructWordSimilar);
    return JSON.stringify(sortObject(checkMap)) === validMapJson;
  });
};

const tone_ngang = "ngang";
const tone_huyen = "huyen";
const tone_sac = "sac";
const tone_hoi = "hoi";
const tone_nga = "nga";
const tone_nang = "nang";

const initialConsonants = ["a", "b", "c", "d", "đ", "g", "h", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x"];
const finalConsonants = ["c", "m", "n", "g", "h", "p", "t"];
const punctuation = /[.,!?;:()]/;

const initialComposeConsonants = {
  c: ["h"],
  g: ["h"],
  k: ["h"],
  n: ["g", "h"],
  p: ["h"],
  q: ["u"],
  t: ["h", "r"],
} as Record<string, string[]>;

const vowelsWithToneMap = {
  a: {
    [tone_ngang]: "a",
    [tone_sac]: "á",
    [tone_huyen]: "à",
    [tone_hoi]: "ả",
    [tone_nga]: "ã",
    [tone_nang]: "ạ",
  },
  ă: {
    [tone_ngang]: "ă",
    [tone_sac]: "ắ",
    [tone_huyen]: "ằ",
    [tone_hoi]: "ẳ",
    [tone_nga]: "ẵ",
    [tone_nang]: "ặ",
  },
  â: {
    [tone_ngang]: "â",
    [tone_sac]: "ấ",
    [tone_huyen]: "ầ",
    [tone_hoi]: "ẩ",
    [tone_nga]: "ẫ",
    [tone_nang]: "ậ",
  },
  e: {
    [tone_ngang]: "e",
    [tone_sac]: "é",
    [tone_huyen]: "è",
    [tone_hoi]: "ẻ",
    [tone_nga]: "ẽ",
    [tone_nang]: "ẹ",
  },
  ê: {
    [tone_ngang]: "ê",
    [tone_sac]: "ế",
    [tone_huyen]: "ề",
    [tone_hoi]: "ể",
    [tone_nga]: "ễ",
    [tone_nang]: "ệ",
  },
  i: {
    [tone_ngang]: "i",
    [tone_sac]: "í",
    [tone_huyen]: "ì",
    [tone_hoi]: "ỉ",
    [tone_nga]: "ĩ",
    [tone_nang]: "ị",
  },
  o: {
    [tone_ngang]: "o",
    [tone_sac]: "ó",
    [tone_huyen]: "ò",
    [tone_hoi]: "ỏ",
    [tone_nga]: "õ",
    [tone_nang]: "ọ",
  },
  ô: {
    [tone_ngang]: "ô",
    [tone_sac]: "ố",
    [tone_huyen]: "ồ",
    [tone_hoi]: "ổ",
    [tone_nga]: "ỗ",
    [tone_nang]: "ộ",
  },
  ơ: {
    [tone_ngang]: "ơ",
    [tone_sac]: "ớ",
    [tone_huyen]: "ờ",
    [tone_hoi]: "ở",
    [tone_nga]: "ỡ",
    [tone_nang]: "ợ",
  },
  u: {
    [tone_ngang]: "u",
    [tone_sac]: "ú",
    [tone_huyen]: "ù",
    [tone_hoi]: "ủ",
    [tone_nga]: "ũ",
    [tone_nang]: "ụ",
  },
  ư: {
    [tone_ngang]: "ư",
    [tone_sac]: "ứ",
    [tone_huyen]: "ừ",
    [tone_hoi]: "ử",
    [tone_nga]: "ữ",
    [tone_nang]: "ự",
  },
  y: {
    [tone_ngang]: "y",
    [tone_sac]: "ý",
    [tone_huyen]: "ỳ",
    [tone_hoi]: "ỷ",
    [tone_nga]: "ỹ",
    [tone_nang]: "ỵ",
  },
} as Record<string, Record<string, string>>;

const vowelToneMap = {
  a: { char: "a", tone: tone_ngang },
  á: { char: "a", tone: tone_sac },
  à: { char: "a", tone: tone_huyen },
  ả: { char: "a", tone: tone_hoi },
  ã: { char: "a", tone: tone_nga },
  ạ: { char: "a", tone: tone_nang },
  ă: { char: "ă", tone: tone_ngang },
  ắ: { char: "ă", tone: tone_sac },
  ằ: { char: "ă", tone: tone_huyen },
  ẳ: { char: "ă", tone: tone_hoi },
  ẵ: { char: "ă", tone: tone_nga },
  ặ: { char: "ă", tone: tone_nang },
  â: { char: "â", tone: tone_ngang },
  ấ: { char: "â", tone: tone_sac },
  ầ: { char: "â", tone: tone_huyen },
  ẩ: { char: "â", tone: tone_hoi },
  ẫ: { char: "â", tone: tone_nga },
  ậ: { char: "â", tone: tone_nang },
  e: { char: "e", tone: tone_ngang },
  é: { char: "e", tone: tone_sac },
  è: { char: "e", tone: tone_huyen },
  ẻ: { char: "e", tone: tone_hoi },
  ẽ: { char: "e", tone: tone_nga },
  ẹ: { char: "e", tone: tone_nang },
  ê: { char: "ê", tone: tone_ngang },
  ế: { char: "ê", tone: tone_sac },
  ề: { char: "ê", tone: tone_huyen },
  ể: { char: "ê", tone: tone_hoi },
  ễ: { char: "ê", tone: tone_nga },
  ệ: { char: "ê", tone: tone_nang },
  i: { char: "i", tone: tone_ngang },
  í: { char: "i", tone: tone_sac },
  ì: { char: "i", tone: tone_huyen },
  ỉ: { char: "i", tone: tone_hoi },
  ĩ: { char: "i", tone: tone_nga },
  ị: { char: "i", tone: tone_nang },
  o: { char: "o", tone: tone_ngang },
  ó: { char: "o", tone: tone_sac },
  ò: { char: "o", tone: tone_huyen },
  ỏ: { char: "o", tone: tone_hoi },
  õ: { char: "o", tone: tone_nga },
  ọ: { char: "o", tone: tone_nang },
  ô: { char: "ô", tone: tone_ngang },
  ố: { char: "ô", tone: tone_sac },
  ồ: { char: "ô", tone: tone_huyen },
  ổ: { char: "ô", tone: tone_hoi },
  ỗ: { char: "ô", tone: tone_nga },
  ộ: { char: "ô", tone: tone_nang },
  ơ: { char: "ơ", tone: tone_ngang },
  ớ: { char: "ơ", tone: tone_sac },
  ờ: { char: "ơ", tone: tone_huyen },
  ở: { char: "ơ", tone: tone_hoi },
  ỡ: { char: "ơ", tone: tone_nga },
  ợ: { char: "ơ", tone: tone_nang },
  u: { char: "u", tone: tone_ngang },
  ú: { char: "u", tone: tone_sac },
  ù: { char: "u", tone: tone_huyen },
  ủ: { char: "u", tone: tone_hoi },
  ũ: { char: "u", tone: tone_nga },
  ụ: { char: "u", tone: tone_nang },
  ư: { char: "ư", tone: tone_ngang },
  ứ: { char: "ư", tone: tone_sac },
  ừ: { char: "ư", tone: tone_huyen },
  ử: { char: "ư", tone: tone_hoi },
  ữ: { char: "ư", tone: tone_nga },
  ự: { char: "ư", tone: tone_nang },
  y: { char: "y", tone: tone_ngang },
  ý: { char: "y", tone: tone_sac },
  ỳ: { char: "y", tone: tone_huyen },
  ỷ: { char: "y", tone: tone_hoi },
  ỹ: { char: "y", tone: tone_nga },
  ỵ: { char: "y", tone: tone_nang },
} as Record<string, { char: string; tone: string }>;

const initialConsonantSimilarMap = {
  k: ["c"],
  c: ["k"],
  d: ["đ", "r", "g"],
  đ: ["d", "r", "g"],
  r: ["d", "đ", "g"],
  gi: ["d", "đ", "r"],
  h: ["h"],
  l: ["l"],
  m: ["m"],
  n: ["n"],
  p: ["b"],
  b: ["p"],
  t: ["th"],
  th: ["t"],
  v: ["v"],
  x: ["s"],
  s: ["x"],
  z: ["z"],
  ng: ["ngh"],
  ngh: ["ng"],
} as Record<string, string[]>;

const vowelSimilarMap = {
  a: ["â"],
  â: ["a"],
  e: ["ê"],
  ê: ["e"],
  i: ["i", "uy"],
  o: ["ô", "ơ"],
  ô: ["o", "ơ"],
  ơ: ["o", "ô"],
  u: ["ư"],
  ư: ["u"],
  y: ["y", "i", "uy"],
} as Record<string, string[]>;
