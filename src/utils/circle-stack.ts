export type TBlock = "A" | "B" | "C" | "D";

export const A = "A";
export const B = "B";
export const C = "C";
export const D = "D";

export const BLOCK_ARRAY: TBlock[] = [A, B, C, D];

export const consumeRules = {
  A: {
    consume: D,
  },
  B: {
    consume: A,
  },
  C: {
    consume: B,
  },
  D: {
    consume: C,
  },
} satisfies Record<
  TBlock,
  {
    consume: TBlock;
  }
>;

export const check2BlockNearest = (
  array: (string | number)[],
  newBlock: string | number
) => {
  if (array[array.length - 1] === newBlock) return false;
  return true;
};

export const consumeArray = (array: TBlock[]) => {
  let newStack: TBlock[] = [];
  array.forEach((block) => {
    const consume = consumeRules[block].consume;
    if (newStack.includes(consume))
      newStack = newStack.filter((block) => block !== consume);
    newStack.push(block);
  });
  return newStack;
};

export const pushBlock = (array: TBlock[], block: TBlock) => {
  if (!check2BlockNearest(array, block)) return array;
  array.push(block);
  return consumeArray(array);
};

export const generateExpect = (array: TBlock[], length: number) => {
  let valid = false;
  let result;
  while (!valid) {
    const temp = Array(length)
      .fill(0)
      .map(() => array[Math.floor(Math.random() * array.length)]);
    if (consumeArray(temp).length === length) {
      result = temp;
      valid = true;
    }
  }
  return result;
};

export const check2BlockEqual = (array: TBlock[], expect: TBlock[]) => {
  if (array.length !== expect.length) return false;
  return !!expect.find((block, index) => block !== array[index]);
};
