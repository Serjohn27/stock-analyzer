export interface StockData {
  symbol: string;
  date: Date;
  lastPrice: number;
  lastVolume: number;
  percentChange: number;
  technicals: any;
  fundamentals: any;
}
