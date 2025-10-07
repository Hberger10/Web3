import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';

let genesis: Block;

beforeAll(() => {
  // Inicializando o bloco gênesis antes de todos os testes
  genesis = new Block(0, "0".repeat(64), "genesis block data");
});

describe('Block Class Tests', () => {

  test('Genesis block should be valid', () => {
    // Para o bloco gênesis, passamos previousIndex = -1 e previousHash fictício
    const valid = genesis.isvalid("none", -1); 
    expect(valid).toBeTruthy();
  });

  test('Should be valid with proper previous hash and index', () => {
    const block = new Block(1, "abc", "abcd");
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeTruthy();
  });

  test('Should NOT be valid (empty hashPrevious)', () => {
    const block = new Block(1, "", "1");
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeFalsy();
  });

  test('Should NOT be valid (negative index)', () => {
    const block = new Block(-1, "abc", "abcd");
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeFalsy();
  });

  test('Should NOT be valid (empty data)', () => {
    const block = new Block(1, "abc", "");
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeFalsy();
  });

});



