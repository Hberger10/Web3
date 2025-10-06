import { SHA256 } from 'crypto-js'
import validation from './validation';



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
/**
 * Creates a new block
 * @param index The block index in blockchain
 * 
 * @param hashPrevious the block hashp
 * @param data the block data
 */
  constructor(index: number,  hashPrevious: string, data: string) {  // instrução de como faze-la
    this.index = index;
    this.hashPrevious= hashPrevious;
    this.timestamp=Date.now();
    this.data=data;
    this.hash = this.getHash();
  }

  getHash(): string {
    return SHA256(this.index + this.timestamp+ this.hashPrevious+ this.data).toString();//calcula e retorna tudo isso como string sha256
  }
/**
 * validates the block
 * @returns returns if the block is valid
 */
  isvalid(hashPrevious: string,previousIndex: number): validation {
  if (previousIndex !== this.index-1) return new validation(false,"invalid index."); //verifica indice e retorna validation 
  if (!this.data) return new validation(false,"invalid data."); //verifica se tem conteúdo,s nãao tiver retorna validation
  if (!this.hashPrevious || this.hashPrevious === "" || this.hashPrevious!= hashPrevious) return new validation(false,"invalid HashPrevious .");  // Verifica se hashPrevious é vazio e se alguem alterou as propriedades dos blocos
  
  return new validation();
}

}
