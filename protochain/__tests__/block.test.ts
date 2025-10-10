import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';

let genesis: Block;

beforeAll(() => {
  // Inicializando o bloco gênesis antes de todos os testes
  genesis = new Block({index: 0, hashPrevious: "0".repeat(64), data: "genesis block data"} as Block);
});

describe('Block Class Tests', () => {

  test('Genesis block should be valid', () => {
    // Para o bloco gênesis, passamos previousIndex = -1 e previousHash fictício
    const valid = genesis.isvalid("none", -1); 
    expect(valid).toBeTruthy();
  });

  

  test('Should be valid with proper previous hash and index', () => { //aqui estamos testando se o segundo bloco é valido
    // Criando um novo bloco com índice 1 e hashPrevious igual ao hash do bloco gênesis
    // não precisamos passar timestamp e hash, o construtor cuida disso
    const block = new Block({index: 1, hashPrevious: genesis.hash, data: "Block 2 data"} as Block);
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeTruthy();
  });

  test('Should NOT be valid (empty hashPrevious)', () => {
    const block = new Block({index: 1, hashPrevious: "", data: "1"} as Block);
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeFalsy();
  });

  test('Should NOT be valid (negative index)', () => {
    const block = new Block({index: -1, hashPrevious: "abc", data: "abcd"} as Block);
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeFalsy();
  });

  test('Should NOT be valid (empty data)', () => {
    const block = new Block({index: 1, hashPrevious: "abc", data: ""} as Block);
    const valid = block.isvalid(genesis.hashPrevious, genesis.index);
    expect(valid).toBeFalsy();
  });

});



