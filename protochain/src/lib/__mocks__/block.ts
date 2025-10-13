
import validation from '../validation';



/**
 * Mocked block Class
 */
//criando uma classe de bloco e exportando ela futuramente para o blockchain
export default class Block { 
  index: number;
  timestamp: number;
  hash: string;
  hashPrevious: string;
  data: string;
  
/**
 * Creates a new mock block
 * @param block The mock block
 */
  constructor(block?: Block) {  // Passo como parametro tudo aquilo que eu vou pegar de fora
    this.index = block?.index || 0;
    this.hashPrevious= block?.hashPrevious || "0".repeat(64);
    this.timestamp=block?.timestamp || Date.now(); //alguns blocos talvez tenha tudo preenchido, outros não, se não tiver eu coloco a data atual
    this.data=block?.data || "";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return this.hash || "abc";//calcula e retorna tudo isso como string sha256
  }
/**
 * validates the mock block
 * @returns returns if the block is valid
 */
  isvalid(hashPrevious: string,previousIndex: number): validation {
  if (!hashPrevious || previousIndex<0 || this.index<0) return new validation(false,"invalid index or hashPrevious."); 
  return new validation();
}

}