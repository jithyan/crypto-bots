import { atom, selector, useRecoilValue, useRecoilState } from "recoil";
import { botRegistry, getBotInfo, ImmutableBotInfo } from "./botRegistry";

export function useSortedBotList() {
  return useRecoilValue(sortedBotData);
}

export function useBotSortMethod() {
  return useRecoilState(sortBotMethod);
}

const sortBotMethod = atom<"statusAsc" | "statusDesc" | "">({
  key: "sortBotMethod",
  default: "",
});

export const sortedBotData = selector({
  key: "sortedBotData",
  get: ({ get }) => {
    const bots = get(botRegistry).toList();
    const sortBy = get(sortBotMethod);

    if (sortBy === "statusAsc") {
      return bots.sort(sortByStatusAsc);
    } else if (sortBy === "statusDesc") {
      return bots.sort(sortByStatusDesc);
    } else {
      return bots;
    }
  },
});

function sortByStatusAsc(a: ImmutableBotInfo, b: ImmutableBotInfo): number {
  if (getBotInfo(a, "status") < getBotInfo(b, "status")) {
    return -1;
  } else if (getBotInfo(a, "status") === getBotInfo(b, "status")) {
    return 0;
  } else {
    return 1;
  }
}

function sortByStatusDesc(a: ImmutableBotInfo, b: ImmutableBotInfo): number {
  if (getBotInfo(a, "status") < getBotInfo(b, "status")) {
    return 1;
  } else if (getBotInfo(a, "status") === getBotInfo(b, "status")) {
    return 0;
  } else {
    return -1;
  }
}
