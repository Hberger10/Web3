import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';

// TROCA: Definição de constantes de mineração para uso global nos testes
const GLOBAL_DIFFICULTY = 1; // Dificuldade baixa para mineração rápida
const GLOBAL_MINER = "GenesisMiner"; 

let genesis: Block;

beforeAll(() => {
  // Inicializando o bloco gênesis
  genesis = new Block({index: 0, hashPrevious: "0".repeat(64), data: "genesis block data"} as Block);
  
  // TROCA CRUCIAL: Minerar o Bloco Gênese para que ele seja considerado válido
  genesis.mine(GLOBAL_DIFFICULTY, GLOBAL_MINER); 
});

describe('Block Class Tests', () => {

  const exampleDifficulty = GLOBAL_DIFFICULTY; // Usa a dificuldade minerada no Gênese
  const exampleMiner = "miner1"; 

  test('Genesis block should be valid', () => {
    // O Gênese foi minerado no beforeAll. O teste agora deve passar.
    const valid = genesis.isvalid("0".repeat(64), -1, exampleDifficulty); 
    expect(valid.success).toBe(true); 
  });


 // Assumindo que você tem 'genesis' (bloco 0) e 'exampleDifficulty' e 'exampleMiner' definidos no escopo do seu teste.
test('Should be valid BlockInfo,()', () => {
    
    const block = Block.fromBlockInfo({
        index: 1,
        difficulty: exampleDifficulty,
        data: "Block 2",
        maxdifficulty: 62,
        PreviousHash: genesis.hash,
        feeperTx: 0.01,
        
    } as BlockInfo);
    
    block.mine(exampleDifficulty, exampleMiner);

   
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty);
    
    expect(valid.success).toBe(true);
});

  test('Should be valid with proper previous hash and index', () => { 
    const block = new Block({index: 1, hashPrevious: genesis.hash, data: "Block 2 data"} as Block);
    
    // TROCA CRUCIAL: Minerar o Bloco 1 antes de validar
    block.mine(exampleDifficulty,exampleMiner); 
    
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
    // TROCA: Minerar antes de validar (para que a falha NÃO seja no PoW)
    block.mine(exampleDifficulty, exampleMiner); 
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
    expect(valid.message).toBe("invalid HashPrevious .");
  });


  test('Should NOT be valid (empty hashPrevious)', () => {
    // O construtor define hashPrevious como "". A validação deve capturar isso.
    const block = new Block({index: 1, hashPrevious: "", data: "1"} as Block);
    // TROCA: Minerar antes de validar
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isvalid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
    // A mensagem de erro em block.ts é "invalid HashPrevious ."
    expect(valid.message).toBe("invalid HashPrevious ."); 
  });

  test('Should NOT be valid (negative index)', () => {
    const block = new Block({index: -1, hashPrevious: "abc", data: "abcd"} as Block);
    // Não precisa minerar, pois o índice é a prioridade de falha
    const valid = block.isvalid(genesis.hashPrevious, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
    expect(valid.message).toBe("invalid index.");
  });

  test('Should NOT be valid (empty data)', () => {
    const block = new Block({index: 1, hashPrevious: "abc", data: ""} as Block);
    // Não precisa minerar
    const valid = block.isvalid(genesis.hashPrevious, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
    expect(valid.message).toBe("invalid data.");
  });


});





