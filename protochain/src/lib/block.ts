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
  constructor(block?: Block) {  // instrução de como faze-la. Passo como parametro tudo aquilo que eu vou pegar de fora
    this.index = block?.index || 0;
    this.hashPrevious= block?.hashPrevious || "0".repeat(64);
    this.timestamp=block?.timestamp || Date.now(); //alguns blocos talvez tenha tudo preenchido, outros não, se nãao tiver eu coloco a data atual
    this.data=block?.data || "";
    this.hash = block?.hash || this.getHash();
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
// - Adicionar nonce para proof-of-work (mineração)
// - Validar formato do hash (64 caracteres hex)
// - Permitir dados complexos (objetos JSON)
// - Adicionar assinatura digital (criptografia assimétrica)
// - Implementar Merkle Tree para múltiplas transações
