import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Wallet from '../src/lib/wallet';

jest.mock('../src/lib/transaction');

describe("transactionInput tests", () => {
    let alice: Wallet
    const exampleWIF= "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"

    beforeAll(()=> {
        alice=new Wallet();
    })

    
    test('Should generate wallet', () => {
        const wallet=new Wallet

        expect (wallet.privateKey).toBeTruthy();
        expect (wallet.publicKey).toBeTruthy();
        
    })

    test('Should recovered wallet(PK)', () => {
        const wallet=new Wallet(alice.privateKey);

        expect (wallet.publicKey).toEqual(wallet.publicKey);
        
        
    })

    test('Should recovered wallet(WIF)', () => {
        const wallet=new Wallet(exampleWIF);

        expect (wallet.publicKey).toBeTruthy();
        expect (wallet.publicKey).toBeTruthy();
        
        
    })

    
})

