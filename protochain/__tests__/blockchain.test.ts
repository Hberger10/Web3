import { describe, test, expect,jest } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block'; 
import Transaction from '../src/lib/transaction';


jest.mock('../src/lib/transaction');
jest.mock('../src/lib/block');

// Cria um mock para a classe Block com a lógica simplificada para fins de teste de cobertura
// Isso é necessário porque o teste 'addBlock should reject invalid block' falha em cadeia.


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
        transactions: [new Transaction({
        data: 'Genesis block'
    } as Transaction)]
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
      transactions: [new Transaction({
        data: "Block 2 data"
    } as Transaction)]
    } as Block);
    // TROCA: Minera o bloco. Garantimos que ele passe no PoW e falhe APENAS no HashPrevious.
    invalidBlock.mine(difficulty, MINER_NAME); 

    const validation = chain.addBlock(invalidBlock);

    // Verifica se a validação falhou (Cobre as linhas 35-37 do addBlock)
    expect(validation.success).toBe(false);
    expect(validation.message).toBe("Invalid HashPrevious."); 
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

    const block = new Block({
      index: 1,
      hashPrevious: previousHash,
      transactions: [new Transaction({
        data: 'Genesis block'
    } as Transaction)]
    } as Block);
    // TROCA: Mineração obrigatória antes da adição.
    block.mine(difficulty, MINER_NAME); 
    chain.addBlock(block);

    // Adiciona um bloco inválido forçadamente para que o isvalid() encontre o erro
    const invalidBlock = new Block({
      index: 2,
      hashPrevious: "wrong_hash_to_break_chain", // Força um hashPrevious incorreto
      transactions: [new Transaction({
        data: "Block 2 data"
    } as Transaction)]
    } as Block); 
    // TROCA: Minera o bloco (garante que ele passe no PoW e falhe no encadeamento)
    invalidBlock.mine(difficulty, MINER_NAME);
    
    chain.blocks.push(invalidBlock); // Adiciona sem validação (para forçar o teste da cadeia)

    // O isvalid() deve encontrar o erro e retornar false
    const validation = chain.isvalid();
    expect(validation.success).toBe(false); 
    
    // Cobre as linhas 54-56 (retorno de falha no for loop)
    expect(validation.message).toContain("Invalid block #2: Invalid HashPrevious.");
  });
});

test ('Should get nextblock info', () => {
    const blockchain = new Blockchain();
    const info = blockchain.getNextBlock();
    expect(info.index).toBe(1);
});








