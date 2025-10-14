import { SHA256 } from 'crypto-js'
import validation from './validation';
import BlockInfo from './blockInfo';




/**
 * Block Class
 */
//criando uma classe de bloco e exportando ela futuramente para o blockchain
export default class Block { //como se fosse a receita
  index: number;
  timestamp: number;
  hash: string;
  hashPrevious: string;
  data: string;
  nonce: number; //melhoria futura: adicionar nonce para proof-of-work (mineração) 
  miner: string; //melhoria futura: adicionar miner para identificar quem minerou o bloco
/**
 * Creates a new block
 * @param index The block index in blockchain
 * 
 * @param hashPrevious the block hashp
 * @param data the block data
 */
  constructor(block?: Block) {  // instrução de como faze-la. Passo como parametro tudo aquilo que eu vou pegar de fora
    this.index = block?.index || 0;
    this.hashPrevious= block?.hashPrevious || "0".repeat(64);
    this.timestamp=block?.timestamp || Date.now(); //alguns blocos talvez tenha tudo preenchido, outros não, se nãao tiver eu coloco a data atual
    this.data=block?.data || "";
    this.nonce = block?.nonce || 0; //melhoria futura: adicionar nonce para proof-of-work (mineração)
    this.miner = block?.miner || "unknown"; //melhoria futura: adicionar miner para identificar quem minerou o bloco
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return SHA256(this.index + this.timestamp+ this.hashPrevious+ this.data + this.nonce + this.miner).toString();//calcula e retorna tudo isso como string sha256
  }

/** * Mines the block by finding a valid nonce that produces a hash with the required difficulty
 * @param difficulty The mining difficulty (number of leading zeros required in the hash)
 * @param miner The miner wallet address
 */

  mine(difficulty: number, miner: string): void {
    this.miner = miner;
    const prefix = new Array(difficulty + 1).join("0");


    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.getHash();
    }
  }

/**
 * validates the block
 * @returns returns if the block is valid
 * @param hashPrevious The previous block hash
 * @param previousIndex The previous block index
 * @param difficulty The mining difficulty (number of leading zeros required in the hash)
 */
  isvalid(hashPrevious: string,previousIndex: number, difficulty: number): validation {
  if (previousIndex !== this.index-1) return new validation(false,"invalid index."); //verifica indice e retorna validation 
  if (!this.data) return new validation(false,"invalid data."); //verifica se tem conteúdo,s nãao tiver retorna validation
  if (!this.hashPrevious || this.hashPrevious === "" || this.hashPrevious!= hashPrevious) return new validation(false,"invalid HashPrevious .");  // Verifica se hashPrevious é vazio e se alguem alterou as propriedades dos blocos
  if (!this.nonce || !this.miner) return new validation(false,"invalid nonce or miner."); //melhoria futura: valida nonce e miner
  

  const prefix = new Array(difficulty + 1).join("0"); //melhoria futura: valida proof-of-work (mineração) com base na dificuldade. Exemplo: dificuldade 3 exige hash começando com "000"
  if (this.hash !== this.getHash() || !this.hash.startsWith(prefix)) return new validation(false,"invalid hash."); //verifica se o hash bate com o hash calculado
  return new validation();
}

static fromBlockInfo(blockInfo: BlockInfo): Block {
  const block = new Block;
  block.index =blockInfo.index;
  block.hashPrevious=blockInfo.PreviousHash;
  block.data=blockInfo.data
  return block;
}


}





//RESUMO DA CLASSE BLOCK
// ============================================================================
//
// Esta classe implementa um bloco individual de uma blockchain com:
//
// ✅ PROPRIEDADES:
// - index: Posição na cadeia
// - timestamp: Momento da criação
// - hash: Impressão digital única (SHA256)
// - hashPrevious: Elo com o bloco anterior
// - data: Informação armazenada
//
// ✅ MÉTODOS:
// - constructor(): Inicializa o bloco e calcula hash
// - getHash(): Gera hash SHA256 das propriedades
// - isvalid(): Valida integridade e encadeamento
//
// ✅ SEGURANÇA:
// - Hash criptográfico torna bloco imutável
// - Encadeamento via hashPrevious previne adulteração
// - Validações múltiplas garantem integridade
//
// ⚠️ MELHORIAS POSSÍVEIS:
// - Adicionar nonce para proof-of-work (mineração) (ESTA SENDO ADICIONADO)
// - Validar formato do hash (64 caracteres hex)
// - Permitir dados complexos (objetos JSON)
// - Adicionar assinatura digital (criptografia assimétrica)
// - Implementar Merkle Tree para múltiplas transações
