import { FinancePayment } from '@/types/finance';
import { InvestmentItem } from '@/types/investments';

export const PAYMENT_FIELDS: Array<{ field: keyof FinancePayment, label: string, type?: string, enumOptions?: string[], }> = [
    { field: "name", label: "Name" },
    { field: "type", label: "Type", enumOptions: ["credit", "cash"] },
    { field: "amount", label: "Amount", type: "number" },
    { field: "date", label: "Date", type: "date" },
    { field: "loop", label: "Loop", type: "checkbox" },
    { field: "status", label: "Payment Status", enumOptions: ["coming", "paid"] }
];

export const ITEM_FIELDS: Array<{ field: keyof InvestmentItem, label: string, type?: string, enumOptions?: string[] }> = [
    { field: "assetName", label: "Asset Name" },
    { field: "term", label: "Term", enumOptions: ["short", "middle", "long"] },
    { field: "investedAmount", label: "Invested Amount", type: "number" },
    { field: "entryDate", label: "Entry Date", type: "date" },
    { field: "exitDate", label: "Exit Date", type: "date" },
    { field: "result", label: "Result", enumOptions: ["none", "profit", "loss"] },
    { field: "resultAmount", label: "Result Amount", type: "number" },
    { field: "status", label: "Status", enumOptions: ["open", "closed"] }
];