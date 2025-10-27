
import Validation from '../validation';



/**
 * Transaction input class
 */

export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;
    previousTx: string;

    constructor(txInput?:TransactionInput) {
        this.previousTx=txInput?.previousTx || "xyz"
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
        if (!this.previousTx &&!this.signature)
            return new Validation(false, "Signature and previous TX are required.");

        if (this.amount <1)
            return new Validation(false, "Amount must be than zero");

        

        return new Validation();
        

    }
}