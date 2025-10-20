import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { Buffer } from 'buffer';
import  sha256  from 'crypto-js/sha256';
import Validation from './validation';

const ECPair = ECPairFactory(ecc);

/**
 * Transaction input class
 */

export default class TransactionInput {
    fromAdress: string;
    amount: number;
    signature: string;

    constructor(txInput?:TransactionInput) {
        this.fromAdress = txInput?.fromAdress || "";
        this.amount=txInput?.amount || 0 ;
        this.signature=txInput?.signature || "";

    }

    sign(privateKey: string): void {
        const hashToSign = Buffer.from(this.getHash(), "hex");
        const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
        this.signature = Buffer.from(keyPair.sign(hashToSign)).toString("hex");
    }

    getHash(): string {
        return sha256(this.fromAdress + this.amount ).toString();
    }

    isValid(): Validation {
        if (!this.signature || this.signature.length === 0) {
            return new Validation(false, "No signature in this transaction input.");
        }

        if (this.amount <1)
            return new Validation(false, "Amount must be than zero");

        const hash= Buffer.from(this.getHash(),"hex");
        const isValid= ECPair.fromPublicKey(Buffer.from(this.fromAdress,"hex"))
            .verify(hash,Buffer.from(this.signature,"hex"))

        return isValid? new Validation(): new Validation(false,"invalid tx input")
        

    }
}