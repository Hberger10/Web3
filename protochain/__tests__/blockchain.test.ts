import { describe, test, expect, jest } from '@jest/globals';
import Block from '../src/lib/block';
import Blockchain from '../src/lib/blockchain';
import Transaction from '../src/lib/transaction';
import Validation from '../src/lib/validation';
import blockchain from '../src/lib/blockchain';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe("Blockchain tests", () => {

    test('Should has genesis blocks', () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test('Should be valid (genesis)', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should be valid (two blocks)', () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [new Transaction({
                txInput:new TransactionInput()
            } as Transaction)]
        } as Block));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT be valid', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput()
        } as Transaction);
        blockchain.mempool.push(tx);
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx]
        } as Block));

        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toEqual(false);
    })

    test('Should NOT be valid', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput()
        } as Transaction);
        blockchain.mempool.push(tx);
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx]
        } as Block));

        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toEqual(false);
    }) 

    test('Should add transaction', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput(),
            hash: 'somehashvalue'

        } as Transaction);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toEqual(true);
    })

    test('Should NOT add transaction (Pending Tx)', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput(),
            hash: 'somehashvalue'

        } as Transaction);

        blockchain.addTransaction(tx);


        const tx1 = new Transaction({
            txInput:new TransactionInput(),
            hash: 'somehashvalueDiferent'

        } as Transaction);

        const validation1 = blockchain.addTransaction(tx1);
        expect(validation1.success).toBeFalsy();
    })

    test('Should NOT add transaction (duplicate hash)', () => {
    const blockchain = new Blockchain();

    const hashValue = 'somehashvalue';

    
    const tx1 = new Transaction({
        to: "address1",
        txInput:new TransactionInput(),
        hash: hashValue
    } as Transaction);

    const validation1 = blockchain.addTransaction(tx1);
    
    
    expect(validation1.success).toBe(true);
    expect(blockchain.mempool.length).toBe(1);

    
    const tx2 = new Transaction({
        txInput:new TransactionInput(),
        hash: hashValue
    } as Transaction);

    const validation2 = blockchain.addTransaction(tx2);

    
    expect(validation2.success).toBe(false);
    expect(validation2.message).toBe(`Duplicate transaction in mempool: ${hashValue}`);
    
    
    expect(blockchain.mempool.length).toBe(1);
});

        


    

    

    test('Should NOT add transaction (invalid tx)', () => {
        const blockchain = new Blockchain();

        const txInput = new TransactionInput();
        txInput.amount = -10;

        const tx = new Transaction({
            txInput,
            hash: 'xyz'
        } as Transaction)

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toEqual(false);
    })

    test('Should get transaction', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput(),
            hash: 'somehashvalue'

        } as Transaction);

        blockchain.mempool.push(tx);
        

        const validation = blockchain.getTransaction(tx.hash);
        

        expect(validation.mempoolIndex).toEqual(0);
    })

    test('Should get transaction in blockchain', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput(),
            hash: 'somehashvalue'

        } as Transaction);

        blockchain.blocks.push(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx]
        } as Block));

        

        const validation = blockchain.getTransaction(tx.hash);
        

        expect(validation.blockIndex).toEqual(1);
    })


    test('Should NOT get transaction in blockchain or mempool', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput(),
            hash: 'somehashvalue'

        } as Transaction);
        const validation = blockchain.getTransaction(tx.hash);
        expect(validation.blockIndex).toEqual(-1);
    })
    
    test('Should add block', () => {
        const blockchain = new Blockchain();
        const tx = new Transaction({
            txInput:new TransactionInput(),
        } as Transaction);
        blockchain.mempool.push(tx);
        blockchain.addTransaction(tx);
        const result = blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx]
        } as Block));
        console.log(result.message);
        expect(result.success).toEqual(true);
    })

    test('Should get block', () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toBeTruthy();
    })

    test('Should NOT add block', () => {
        const blockchain = new Blockchain();
        const block = new Block({
            index: -1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [new Transaction({
                txInput:new TransactionInput(),
            } as Transaction)]
        } as Block)
        const result = blockchain.addBlock(block);
        expect(result.success).toEqual(false);
    })

    test('Should get next block info', () => {
        const blockchain = new Blockchain();
        blockchain.mempool.push(new Transaction({
            txInput:new TransactionInput(),
        } as Transaction));
        const info = blockchain.getNextBlock();
        
        expect(info? info.index:0).toEqual(1);
    })
        

    test('Should NOT get next block info', () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info === null).toEqual(true);
    });

});