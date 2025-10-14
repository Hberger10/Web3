import { describe, test, expect } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Validation from '../src/lib/validation'; 

// Cria um mock para a classe Block com a lógica simplificada para fins de teste de cobertura
// Isso é necessário porque o teste 'addBlock should reject invalid block' falha em cadeia.
const mockBlock = (isValid: boolean, message: string = "") => {
  return class MockBlock extends Block {
    constructor(block?: Block) {
      super(block);
    }
    // Sobrescreve o método isvalid para retornar o resultado de validação desejada
    isvalid(previousHash: string, previousIndex: number): Validation {
      return new Validation(isValid, message);
    }
  };
};

// TROCA: Definição da constante do minerador, usada no mine()
const MINER_NAME = "TestMiner"; 

describe('Blockchain Class Tests', () => {

// ... (Aqui estariam os testes como getLastBlock e addBlock - valid original que você omitiu)

// NOVO TESTE: Valida o método getBlock (Cobre as linhas 24-27 do blockchain.ts)
  test('getBlock should successfully retrieve a block by its hash', () => {
    const chain = new Blockchain();
    // TROCA: Obtém a dificuldade da cadeia (necessária para mineração e validação)
    const difficulty = chain.getDifficulty(); 
    
    // Adiciona um bloco para que a cadeia tenha mais de um
    const previousHash = chain.getLastBlock().hash;
    const block1 = new Block({
        index: 1,
        hashPrevious: previousHash,
        data: "Test Block for retrieval"
    } as Block);
    // TROCA: Mineração obrigatória antes da adição (para que passe no isvalid)
    block1.mine(difficulty, MINER_NAME); 
    
    chain.addBlock(block1); // O addBlock agora deve ser bem-sucedido
    
    // 1. Tenta buscar o bloco usando seu hash (Cobre o caminho de sucesso)
    const foundBlock = chain.getBlock(block1.hash);
    expect(foundBlock).toBeDefined();
    expect(foundBlock?.index).toBe(1); 
    
    // 2. Verifica a busca por um hash que não existe (Cobre o caminho de falha, retornando undefined)
    const notFoundBlock = chain.getBlock("nonexistent_hash_1234");
    expect(notFoundBlock).toBeUndefined();
  });


  test('addBlock should reject invalid block (empty hashPrevious)', () => {
    const chain = new Blockchain();
    // TROCA: Obtém a dificuldade, necessária para a validação do bloco.
    const difficulty = chain.getDifficulty(); 
    
    // CORREÇÃO: O teste deve esperar a mensagem de erro REAL do seu método block.isvalid
    // A mensagem de erro em src/lib/block.ts é: "invalid HashPrevious ."

    // TROCA: Cria o bloco com hashPrevious vazio
    const invalidBlock = new Block({
      index: 1,
      hashPrevious: "", // A falha que queremos testar
      data: "Block 1 data"
    } as Block);
    // TROCA: Minera o bloco. Garantimos que ele passe no PoW e falhe APENAS no HashPrevious.
    invalidBlock.mine(difficulty, MINER_NAME); 

    const validation = chain.addBlock(invalidBlock);

    // Verifica se a validação falhou (Cobre as linhas 35-37 do addBlock)
    expect(validation.success).toBe(false);
    expect(validation.message).toBe("invalid HashPrevious ."); 
  });

  test('isvalid should return true for the initial chain (Genesis only)', () => {
    const chain = new Blockchain();
    
    // O construtor cria a cadeia com 1 bloco (Genesis).
    // O loop 'for' em isvalid() (i > 0) será ignorado.
    // Isso garante que a linha de retorno final (L58) seja executada.
    expect(chain.isvalid().success).toBe(true);
});


  test('isvalid should return false if a block is invalid', () => { 
    const chain = new Blockchain();
    // TROCA: Obtém a dificuldade, necessária para a validação do bloco.
    const difficulty = chain.getDifficulty(); 
    const previousHash = chain.getLastBlock().hash;

    const block1 = new Block({
      index: 1,
      hashPrevious: previousHash,
      data: "Block 1 data"
    } as Block);
    // TROCA: Mineração obrigatória antes da adição.
    block1.mine(difficulty, MINER_NAME); 
    chain.addBlock(block1);

    // Adiciona um bloco inválido forçadamente para que o isvalid() encontre o erro
    const invalidBlock = new Block({
      index: 2,
      hashPrevious: "wrong_hash_to_break_chain", // Força um hashPrevious incorreto
      data: "Block 2 data"
    } as Block); 
    // TROCA: Minera o bloco (garante que ele passe no PoW e falhe no encadeamento)
    invalidBlock.mine(difficulty, MINER_NAME);
    
    chain.blocks.push(invalidBlock); // Adiciona sem validação (para forçar o teste da cadeia)

    // O isvalid() deve encontrar o erro e retornar false
    const validation = chain.isvalid();
    expect(validation.success).toBe(false); 
    
    // Cobre as linhas 54-56 (retorno de falha no for loop)
    expect(validation.message).toContain("Invalid block #2: invalid HashPrevious .");
  });
});

test ('Should get nextblock info', () => {
    const blockchain = new Blockchain();
    const info = blockchain.getNextBlock();
    expect(info.index).toBe(1);
});








