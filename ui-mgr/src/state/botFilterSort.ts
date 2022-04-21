import type { TBotStatus } from "@jithyan/lib";
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import { botRegistry, getBotInfo, ImmutableBotMap } from "./botRegistry";

export function useSortedAndFilteredBots() {
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
  | "symbolAsc"
  | "symbolDesc"
>({
  key: "sortBotMethod",
  default: "statusDesc",
});

export const filterMethod = atom<{ method: "" | "symbol"; value: string }>({
  key: "filterMethod",
  default: {
    method: "",
    value: "",
  },
});

export const filteredBotData = selector({
  key: "filterBotData",
  get: ({ get }) => {
    const bots = get(botRegistry);
    const { method, value } = get(filterMethod);
    if (!method || !value) {
      return bots;
    }
    return bots.filter((b) => {
      const sym = getBotInfo(b, "symbol").toLowerCase();
      const has = getBotInfo(b, "symbol")
        .toLowerCase()
        .includes(value.toLowerCase());
      console.log({ sym, has, value });
      return has;
    });
  },
});

export function useBotFilterQueryValue() {
  return useRecoilValue(filterMethod).value;
}

export function useBotFilter() {
  return useSetRecoilState(filterMethod);
}

export const sortedBotData = selector({
  key: "sortedBotData",
  get: ({ get }) => {
    const bots = get(filteredBotData);
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
function sortByStatusAsc(a: ImmutableBotMap, b: ImmutableBotMap): number {
  const statusA = statusSortScore[getBotInfo(a, "status")];
  const statusB = statusSortScore[getBotInfo(b, "status")];

  return statusA - statusB;
}

function sortByProfit(a: ImmutableBotMap, b: ImmutableBotMap): number {
  const profitA = Number(getBotInfo(a, "state")?.profit ?? "0");
  const profitB = Number(getBotInfo(b, "state")?.profit ?? "0");

  return profitA - profitB;
}

function sortBySymbol(a: ImmutableBotMap, b: ImmutableBotMap): number {
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
