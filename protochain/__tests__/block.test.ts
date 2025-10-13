// __tests__/block.test.ts

import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';

let genesis: Block;
const GLOBAL_DIFFICULTY = 1; // Usamos dificuldade baixa para que a mineração seja rápida
const GLOBAL_MINER = "GenesisMiner"; 

beforeAll(() => {
  // Inicializando o bloco gênesis antes de todos os testes
  genesis = new Block({index: 0, hashPrevious: "0".repeat(64), data: "genesis block data"} as Block);
  genesis.mine(GLOBAL_DIFFICULTY, GLOBAL_MINER);
});

describe('Block Class Tests', () => {

  const exampleDifficulty = GLOBAL_DIFFICULTY; // TROCA: Usa a constante global
  const exampleMiner = "miner1"; 

  

  test('Genesis block should be valid', () => {
    // Para o bloco gênesis, a validação deve ser feita contra valores que ele próprio define como válido
    const valid = genesis.isvalid("0".repeat(64), -1, exampleDifficulty); // Passando o hashPrevious default e um index -1 (que deve ser ignorado pela lógica do gênesis, ou -1 para que -1 != 0-1 seja false)
    expect(valid.success).toBe(true);
  });

  

  test('Should be valid with proper previous hash and index', () => { 
    // O bloco anterior REAL para o block (index 1) é o genesis.
    const block = new Block({index: 1, hashPrevious: genesis.hash, data: "Block 2 data"} as Block);
    
    // TROCA: Minera o Bloco 1.
    block.mine(exampleDifficulty,exampleMiner); 
    
    // A validação usa o hash do Gênese (agora minerado e válido).
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty);

    console.log(valid.message);
    expect(valid.success).toBe(true); 
  });



  
  // NOVO TESTE: Valida o erro de sequência de índice (Cobre a validação: previousIndex !== this.index-1)
  test('Should NOT be valid (invalid index sequence)', () => { 
    // Criando um bloco com index 3, mas o anterior tem index 0. (3 != 0 + 1)
    const block = new Block({index: 3, hashPrevious: genesis.hash, data: "Block 3 data"} as Block);
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBe(false);
    expect(valid.message).toBe("invalid index.");
  });
  
  // NOVO TESTE: Valida o erro de hash mismatch (Cobre a validação: this.hashPrevious != hashPrevious)
  test('Should NOT be valid (hash mismatch)', () => { 
    // Criando um bloco que aponta para um hash falso ("wrong_hash")
    const block = new Block({index: 1, hashPrevious: "wrong_hash", data: "Block 2 data"} as Block);
    // Validamos contra o hash real do genesis (genesis.hash)
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
    expect(valid.message).toBe("invalid HashPrevious .");
  });


  test('Should NOT be valid (empty hashPrevious)', () => {
    // O construtor define hashPrevious como "". A validação deve capturar isso.
    const block = new Block({index: 1, hashPrevious: "", data: "1"} as Block);
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty); // Deve falhar aqui, não importa o hash real
    expect(valid.success).toBeFalsy();
    // A mensagem de erro em block.ts é "invalid HashPrevious ."
    expect(valid.message).toBe("invalid HashPrevious ."); 
  });

  test('Should NOT be valid (negative index)', () => {
    const block = new Block({index: -1, hashPrevious: "abc", data: "abcd"} as Block);
    const valid = block.isvalid(genesis.hashPrevious, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
    expect(valid.message).toBe("invalid index.");
  });

  test('Should NOT be valid (empty data)', () => {
    const block = new Block({index: 1, hashPrevious: "abc", data: ""} as Block);
    const valid = block.isvalid(genesis.hashPrevious, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
    expect(valid.message).toBe("invalid data.");
  });

});



