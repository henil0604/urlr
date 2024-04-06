import { atom } from "jotai";

export const overallEngagementGraphDataAtom = atom<
  {
    timestamp: Date;
    name: string;
  }[]
>([]);
