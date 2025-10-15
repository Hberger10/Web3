import transactionType from './transactionType';    
import { SHA256 } from 'crypto-js';
import validation from './validation';
/**
 * 
 */


export default class Transaction {
    type: transactionType;
    timestamp: number;
    hash: string;
    data: string;
    

    constructor(tx?: Transaction) {
        this.type= tx?.type || transactionType.REGULAR;
        this.timestamp= tx?.timestamp || Date.now();
        this.data= tx?.data || "";
        this.hash=tx?.hash || this.getHash();

    }

    
    getHash():string {
        return SHA256(
            this.type +
            this.timestamp +
            this.data
        ).toString();   

    }

    isvalid(): validation{
        if(this.hash !== this.getHash()){
            return {success: false, message: 'Invalid transaction hash'}
        }
        if (!this.data)
            return new validation(false,"invalid data")

        return new validation 
    }
}
