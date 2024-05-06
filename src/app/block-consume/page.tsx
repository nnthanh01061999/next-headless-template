"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BLOCK_ARRAY, TBlock, generateExpect, pushBlock } from "@/utils/circle-stack";
import { useEffect, useState } from "react";

const defaultDifficult = 1;

function Page() {
  const [array, setArray] = useState<TBlock[]>([]);
  const [difficult, setDifficult] = useState<number>(defaultDifficult);
  const [win, setWin] = useState<boolean>(false);
  const [expect, setExpect] = useState<TBlock[]>();

  const handlePush = (block: TBlock) => {
    const newBlock = pushBlock(array, block);
    setArray(newBlock);
  };

  const onReset = () => {
    setArray([]);
    setExpect(generateExpect(BLOCK_ARRAY, difficult));
  };

  useEffect(() => {
    const isWin = array.join(",") === expect?.join(",");
    setWin(isWin);
  }, [array, expect]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between space-y-2 font-mono">
        <div className={cn(["grid gap-2 grid-flow-col"])}>
          <Button onClick={() => onReset()}>Reset</Button>
          <Button onClick={() => setArray([])}>Clear</Button>
          <Button onClick={() => handlePush("A")}>Push A</Button>
          <Button onClick={() => handlePush("B")}>Push B</Button>
          <Button onClick={() => handlePush("C")}>Push C</Button>
          <Button onClick={() => handlePush("D")}>Push D</Button>
        </div>
        <div className="grid grid-flow-col gap-2">
          <Input
            type="number"
            value={difficult}
            onChange={(e) => {
              setDifficult(+e.target.value);
              onReset();
            }}
          />
        </div>
        <div className="grid grid-flow-col gap-2">
          {win ? (
            <p>You Win</p>
          ) : (
            <>
              <p>Expect: </p>
              <p>{expect?.join(",")}</p>
            </>
          )}
        </div>
        <div>
          {array.map((item, index) => (
            <p key={index + item}>{item}</p>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Page;
