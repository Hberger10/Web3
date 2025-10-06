import { describe, test, expect } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';

describe('Blockchain Class Tests', () => {

  test('getLastBlock should return the last block', () => {
    const chain = new Blockchain();
    const last = chain.getLastBlock();  // cobre linhas 18-19
    expect(last.index).toBe(0);          // bloco gênesis
  });

  test('addBlock should add a valid block', () => {
  const chain = new Blockchain();

  const block1 = new Block(1, chain.getLastBlock().hash, "Block 1 data");
  const validation = chain.addBlock(block1);  // Recebe um objeto Validation

  expect(validation.success).toBe(true);  // Verifica o sucesso da validação
  expect(validation.message).toBe("");    // Espera que a mensagem esteja vazia (porque o bloco é válido)
});


  test('addBlock should reject invalid block (empty hashPrevious)', () => {
  const chain = new Blockchain();

  const invalidBlock = new Block(1, "", "Block 1 data");
  const validation = chain.addBlock(invalidBlock);  // Recebe um objeto Validation

  // Verifica se a validação falhou
  expect(validation.success).toBe(false);  // Espera que success seja false
  expect(validation.message).toBe("Invalid block: Previous hash is empty.");  // Verifica a mensagem de erro
});



  test('isvalid should return true for a valid blockchain', () => { //testando "isvalid" para blockchain valida
    const chain = new Blockchain();

    const block1 = new Block(1, chain.getLastBlock().hash, "Block 1 data");
    chain.addBlock(block1);

     expect(chain.isvalid().success).toBe(true);
  });

  test('isvalid should return false if a block is invalid', () => { //testando "isvalid" para blockchain invalida
    const chain = new Blockchain();

    const block1 = new Block(1, chain.getLastBlock().hash, "Block 1 data");
    chain.addBlock(block1);

    // adiciona um bloco inválido
    const invalidBlock = new Block(2, "", "Block 2 data"); //é colocado um bloco invalido com hashprevious vazio
    chain.blocks.push(invalidBlock);

     expect(chain.isvalid().success).toBe(false);  // cobre linhas do for loop e if (!isvalid)
  });

});









