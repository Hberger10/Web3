import Block from './block';
import Validation from './validation';

/**
 * Blockchain class
 */

export default class Blockchain {
  blocks: Block[] = [];
  nextIndex: number = 0;

  constructor() {
    // Adiciona o bloco gênesis à blockchain
    this.blocks = [new Block(0, "genesis", "2")];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];  // Acessa o último bloco da blockchain
  }


  getBlock(hash: string): Block | undefined {
    // Presume que 'this.blocks' é o seu array de blocos.
    // O método 'find' percorre o array e retorna o primeiro bloco (b) onde b.hash é igual ao hash procurado.
    return this.blocks.find(b => b.hash === hash);
}
 addBlock(block: Block): Validation {
  const lastBlock = this.getLastBlock();  // Obtém o último bloco

  // Chama o método isvalid() e recebe a instância de Validation
  const validation = block.isvalid(lastBlock.hash, lastBlock.index);

  if (!validation.success) {
    console.log(validation.message);  // Exibe a mensagem de erro no console
    return validation;  // Retorna o objeto Validation com sucesso: false
  }

  this.blocks.push(block);  // Adiciona o bloco à blockchain
  this.nextIndex++;
  return new Validation(true);  // Retorna uma instância de Validation com sucesso: true
}


   isvalid(): Validation {  // percorre todos os blocos da nossa blockchain
    for (let i = this.blocks.length - 1; i > 0; i--) {  // começa do final e vai diminuindo um
      const currentBlock = this.blocks[i];  // bloco na posição i
      const previousBlock = this.blocks[i - 1];  // bloco anterior

      // Passa corretamente os parâmetros para o método isvalid
      const validation = currentBlock.isvalid(previousBlock.hash, previousBlock.index);  // Recebe uma instância de Validation

      if (!validation.success) {
        // Se qualquer bloco for inválido, retorna uma nova instância de Validation com false e a mensagem de erro
        return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`);
      }
    }
    return new Validation();  // Se todos os blocos forem válidos, retorna sucesso (true)
  }
}
