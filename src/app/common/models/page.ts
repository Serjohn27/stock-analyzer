import { StockData } from './stock-data';

export interface Page {
    pageNumber: number;
    pageSize: number;
    totalNumberOfPages: number;
    totalNumberOfElements: number;
    content: StockData[];
}
