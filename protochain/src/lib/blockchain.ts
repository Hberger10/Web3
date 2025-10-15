import Block from './block';
import Validation from './validation';
import BlockInfo from './blockInfo';
import Transaction from './transaction';
import TransactionType from './transactionType';

/**
 * Blockchain class
 */

export default class Blockchain {
  blocks: Block[] = [];
  nextIndex: number = 0;
  static readonly difficulty_factor: number = 5; // Dificuldade padrão para o mock (pode ser ajustada conforme necessário)
  static readonly MAX_DIFFICULTY: number = 62; // Dificuldade máxima permitida

  constructor() {
    
    this.blocks = [new Block({
        index: this.nextIndex,
        // Usamos hashPrevious aqui, pois o construtor do Block o espera (mesmo que a imagem mostre 'previousHash')
        hashPrevious: "0".repeat(64), 
        
        transactions: [new Transaction({
            type: TransactionType.FEE,
            data: new Date().toString()
        } as Transaction)]
    } as Block)]; 
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];  // Acessa o último bloco da blockchain
  }

  getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.difficulty_factor);
    }


  getBlock(hash: string): Block | undefined {
    // Presume que 'this.blocks' é o seu array de blocos.
    // O método 'find' percorre o array e retorna o primeiro bloco (b) onde b.hash é igual ao hash procurado.
    return this.blocks.find(b => b.hash === hash);
}
 addBlock(block: Block): Validation {
  const lastBlock = this.getLastBlock();  // Obtém o último bloco

  // Chama o método isvalid() e recebe a instância de Validation
  const validation = block.isValid(lastBlock.hash, lastBlock.index,this.getDifficulty());

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
      const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index,this.getDifficulty());  // Recebe uma instância de Validation

      if (!validation.success) {
        // Se qualquer bloco for inválido, retorna uma nova instância de Validation com false e a mensagem de erro
        return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`);
      }
    }
    return new Validation();  // Se todos os blocos forem válidos, retorna sucesso (true)
  }


    getFeerPerTx() : number {
      return 0.01;
 } // Exemplo fixo, pode ser ajustado conforme necessário


  getNextBlock(): BlockInfo {
    const transactions = [new Transaction({
        data: new Date().toString()
    } as Transaction)];
    
  const difficulty = this.getDifficulty();
  const PreviousHash = this.getLastBlock().hash;
  const index = this.blocks.length;
  const feeperTx = this.getFeerPerTx();
  const maxdifficulty = Blockchain.MAX_DIFFICULTY;
  return{
    transactions,
    difficulty,
    PreviousHash,
    index,
    feeperTx,
    maxdifficulty
  } as BlockInfo
} // Retorna informações do próximo bloco a ser minerado

}


// ============================================================================
// RESUMO DA CLASSE BLOCKCHAIN
// ============================================================================
//
// Esta classe implementa uma blockchain completa com:
//
// ✅ PROPRIEDADES:
// - blocks: Array contendo todos os blocos
// - nextIndex: Contador para o próximo índice
//
// ✅ MÉTODOS PRINCIPAIS:
// - constructor(): Inicializa com bloco gênesis
// - addBlock(): Adiciona blocos com validação rigorosa
// - isvalid(): Valida integridade de toda a cadeia
//
// ✅ MÉTODOS AUXILIARES:
// - getLastBlock(): Retorna último bloco
// - getBlock(): Busca bloco por hash
//
// ✅ CARACTERÍSTICAS DE SEGURANÇA:
// - Validação antes de adicionar blocos
// - Encadeamento criptográfico (hashPrevious)
// - Verificação de integridade de toda cadeia
// - Detecção de adulteração
//
// ✅ IMUTABILIDADE:
// A estrutura garante que:
// 1. Blocos são adicionados apenas no final
// 2. Cada bloco está criptograficamente ligado ao anterior
// 3. Alterar um bloco antigo quebra toda a cadeia
// 4. Fraudes são facilmente detectáveis
//
// ⚠️ LIMITAÇÕES ATUAIS:
// - Armazenamento em memória (perde dados ao reiniciar)
// - Sem persistência em banco de dados
// - Sem proof-of-work (mineração) //esta sendo adicionado
// - Sem rede peer-to-peer (descentralização)
// - Sem sistema de transações
// - Busca por hash é O(n) (poderia ser O(1) com HashMap)
//
// ⚠️ MELHORIAS POSSÍVEIS:
// - Adicionar persistência (MongoDB, PostgreSQL, LevelDB)
// - Implementar proof-of-work para mineração
// - Adicionar difficulty adjustment
// - Implementar Merkle Tree para transações
// - Adicionar sistema de wallets e transações
// - Implementar API RESTful completa
// - Adicionar sincronização entre nós (P2P)
// - Implementar fork resolution
// - Adicionar smart contracts (como Ethereum)
// - Otimizar busca com índices (HashMap)
// - Adicionar snapshot/checkpoints
// - Implementar pruning (limpeza de dados antigos)
//
// 💡 USO TÍPICO:
// const blockchain = new Blockchain();  // Cria com bloco gênesis
// const bloco = new Block(1, blockchain.getLastBlock().hash, "dados");
// const resultado = blockchain.addBlock(bloco);
// if (resultado.success) {
//   console.log("Bloco adicionado!");
// }
//
// 
