import { describe, test, expect, } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';


describe('Transactions tests', () => {

  test('Should be valid(regular default)', () => {
    const tx = new Transaction({
        data: 'tx'
    } as Transaction);
    
    const valid = tx.isvalid();

    expect(valid.success).toBe(true); 
  });


test('Should NOT be valid(invalid hash)', () => {
    const tx = new Transaction({
        data: 'tx',
        type: TransactionType.REGULAR,
        timestamp: Date.now(),
        hash: "abc"
    } as Transaction);
    
    const valid = tx.isvalid();

    expect(valid.success).toBe(false); 
  });

test('Should be valid(FEE)', () => {
    const tx = new Transaction({
        data: 'tx'
    , type: TransactionType.FEE
    } as Transaction);
    
    const valid = tx.isvalid();

    expect(valid.success).toBe(true); 
  });



test('Should NOT be valid(Invalid data)', () => {
    const tx = new Transaction();
    const valid = tx.isvalid();
    expect(valid.success).toBe(false);
  });






});