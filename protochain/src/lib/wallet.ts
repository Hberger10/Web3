import * as ecc from 'tiny-secp256k1';
import ECPairFactory,{ECPairInterface} from 'ecpair';
import { Buffer } from 'buffer';

const ECPair = ECPairFactory(ecc);

/**
 * A simple Wallet class to manage private keys.
 */

export default class Wallet {

    privateKey: string; //password wallet
    publicKey: string;  //adress wallet 

    constructor(wifOrPrivateKey?: string) {
        let keys;

        
        if (wifOrPrivateKey) {
            
            if (wifOrPrivateKey.length === 64) {
                
                keys = ECPair.fromPrivateKey(Buffer.from(wifOrPrivateKey, "hex"));
            } else {
                keys = ECPair.fromWIF(wifOrPrivateKey);
            }
            
        } else {
            
            keys = ECPair.makeRandom();
        }

        /* c8 ignore start */
        this.privateKey = keys.privateKey
            ? Buffer.from(keys.privateKey).toString("hex")
            : "";
        this.publicKey = keys.publicKey
            ? Buffer.from(keys.publicKey).toString("hex")
            : "";

        /* c8 ignore end */
    }
}
    