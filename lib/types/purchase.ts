export type Product = {
    id: string;
    type: string;
    platform: string;
    price: number;
    price_amount_micros: number;
    price_currency_code: string;
    title: string;
    description: string;
}

export type Transaction = {
    id: string;
    productId: string;
    transactionDate: string;
    transactionId: string;
    transactionState: string;
    transactionReceipt: string;
    transactionError: string;
    verify: () => void;
    finish: () => void;
}

export type Receipt = {
    id: string;
    productId: string;
    transactionDate: string;
    transactionId: string;
    transactionState: string;
    transactionReceipt: string;
    transactionError: string;
    finish: () => void;

}
