import { SHA256 } from 'crypto-js'
import validation from './validation';



/**
 * Block Class
 */
export default class Block {
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
  constructor(index: number,  hashPrevious: string, data: string) { 
    this.index = index;
    this.hashPrevious= hashPrevious;
    this.timestamp=Date.now();
    this.data=data;
    this.hash = this.getHash();
  }

  getHash(): string {
    return SHA256(this.index + this.timestamp+ this.hashPrevious+ this.data).toString();
  }
/**
 * validates the block
 * @returns returns if the block is valid
 */
  isvalid(hashPrevious: string,previousIndex: number): validation {
  if (previousIndex !== this.index-1) return new validation(false,"invalid index."); //verifica indice
  if (!this.data) new validation(false,"invalid data."); //verificia data
  if (!this.hashPrevious || this.hashPrevious === "") new validation(false,"invalid HashPrevious .");  // Verifica se hashPrevious é vazio
  
  return new validation();
}

}
