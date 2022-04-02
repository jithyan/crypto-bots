import type { TBotStatus } from "common-util";
import { atom, selector, useRecoilValue, useRecoilState } from "recoil";
import { botRegistry, getBotInfo, ImmutableBotInfo } from "./botRegistry";

export function useSortedBotList() {
  return useRecoilValue(sortedBotData);
}

export function useBotSortMethod() {
  return useRecoilState(sortBotMethod);
}

const sortBotMethod = atom<
  | "statusAsc"
  | "statusDesc"
  | "profitAsc"
  | "profitDesc"
  | ""
  | "symbolAsc"
  | "symbolDesc"
>({
  key: "sortBotMethod",
  default: "",
});

export const sortedBotData = selector({
  key: "sortedBotData",
  get: ({ get }) => {
    const bots = get(botRegistry).toList();
    const sortBy = get(sortBotMethod);

    switch (sortBy) {
      case "statusAsc":
        return bots.sort(sortByStatusAsc);
      case "statusDesc":
        return bots.sort((a, b) => sortByStatusAsc(a, b) * -1);
      case "profitAsc":
        return bots.sort(sortByProfit);
      case "profitDesc":
        return bots.sort((a, b) => sortByProfit(a, b) * -1);
      case "symbolAsc":
        return bots.sort(sortBySymbol);
      case "symbolDesc":
        return bots.sort((a, b) => sortBySymbol(a, b) * -1);
      default:
        return bots;
    }
  },
});

const statusSortScore: Record<TBotStatus, number> = {
  "NOT WORKING": 5,
  ONLINE: 4,
  "STARTING UP": 3,
  "SHUTTING DOWN": 2,
  OFFLINE: 1,
};
function sortByStatusAsc(a: ImmutableBotInfo, b: ImmutableBotInfo): number {
  const statusA = statusSortScore[getBotInfo(a, "status")];
  const statusB = statusSortScore[getBotInfo(b, "status")];

  return statusA - statusB;
}

function sortByProfit(a: ImmutableBotInfo, b: ImmutableBotInfo): number {
  const profitA = Number(getBotInfo(a, "state")?.profit ?? "0");
  const profitB = Number(getBotInfo(b, "state")?.profit ?? "0");

  return profitA - profitB;
}

function sortBySymbol(a: ImmutableBotInfo, b: ImmutableBotInfo): number {
  const statusA = getBotInfo(a, "symbol");
  const statusB = getBotInfo(b, "symbol");

  if (statusA < statusB) {
    return -1;
  } else if (statusA > statusB) {
    return 1;
  } else {
    return 0;
  }
}
