import { SourceBase } from "./shared";

export type InvestmentResult = "profit" | "loss" | "none";
export type InvestmentStatus = "open" | "closed";
export type InvestmentTerm = "short" | "middle" | "long";

export type InvestmentItem = {
    id: string;
    assetName: string;
    term: InvestmentTerm;
    investedAmount: number;
    entryDate: string;
    exitDate: string | null; // null means still open
    result: InvestmentResult;
    resultAmount: number | null;
    status: InvestmentStatus;

};

export type InvestmentSource = SourceBase & {
    type: "crypto" | "forex" | "investment";
    items: InvestmentItem[];
    //name?: string IF THERE IS A TYPE ERROR LOOK HERE
};