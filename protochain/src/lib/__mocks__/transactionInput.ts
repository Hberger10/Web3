
import Validation from '../validation';



/**
 * Transaction input class
 */

export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;

    constructor(txInput?:TransactionInput) {
        this.fromAddress = txInput?.fromAddress || "carteira 1 ";
        this.amount=txInput?.amount || 10 ;
        this.signature=txInput?.signature || "abc";

    }

    sign(privateKey: string): void {
        this.signature = "abc";
    }

    getHash(): string {
        return "abc";
    }

    isValid(): Validation {
        if (!this.signature || this.signature.length === 0) {
            return new Validation(false, "No signature in this transaction input.");
        }

        if (this.amount <1)
            return new Validation(false, "Amount must be than zero");

        

        return new Validation();
        

    }
}