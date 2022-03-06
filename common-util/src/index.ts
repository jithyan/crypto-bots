type BotFilePathArgs = ArgWithNoSymbol | ArgWithSymbol;

type ArgWithNoSymbol = Record<"port" | "volatileAsset" | "stableAsset", string>;
type ArgWithSymbol = Record<"port" | "symbol", string>;

function isArgWithSymbol(arg: BotFilePathArgs): arg is ArgWithSymbol {
  return Boolean((arg as ArgWithSymbol).symbol);
}

export function getBotFilePath(args: BotFilePathArgs): string {
  const { port } = args;
  const symbol = isArgWithSymbol(args)
    ? args.symbol.trim().toLowerCase()
    : `${args.volatileAsset.trim()}${args.stableAsset.trim()}`.toLowerCase();

  return `${symbol}/${port}_${symbol}_bot`.toLowerCase();
}

export function getTimeSalt(): string {
  const d = new Date().toISOString().split(":");
  d.pop();
  return d.join(":");
}
