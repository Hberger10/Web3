import Block from './block';
import Validation from '../validation';

/**
 * Mocked Blockchain class
 *
 * Esta classe simula o comportamento da Blockchain real, mas com lógica simples
 * e previsível, ideal para testes de integração (como o servidor Express).
 */
export default class MockBlockchain {
    // A propriedade blocks é pública e deve ser acessível para simular o estado da cadeia.
    // Inicializamos com um mock de bloco gênese.
    // Usamos um array privado para simular o armazenamento, se necessário, mas 
    // mantemos 'blocks' como a interface pública.
    blocks: Block[] = [];
    nextIndex: number = 1;

    constructor() {
        // Inicializa com um bloco gênese simulado
        // A sintaxe new Block() aqui irá chamar o CONSTRUTOR MOCKADO do Block.
        this.blocks = [new Block()]; 
    }

    // MOC: Retorna sempre o bloco gênese simulado.
    getLastBlock(): Block {
        // Garantimos que o mock sempre retorna um objeto Block válido
        return this.blocks[this.blocks.length - 1]; 
    }

    // MOC: Simplesmente retorna uma validação de sucesso sem executar a lógica complexa
    // Isso é útil para testar o caminho de sucesso do servidor (Status 201).
    addBlock(block: Block): Validation {
        // Opcionalmente, pode-se adicionar o bloco para simular o crescimento da cadeia no mock
        this.blocks.push(block); 
        this.nextIndex++;
        return new Validation(true, "");
    }


    // MOC: Retorna sempre uma validação de sucesso.
    // Útil para o endpoint /status (isValid: true).
    isvalid(): Validation { 
        return new Validation(true, "Mocked chain is valid.");
    }
    
    // MOC: Testa se o getBlock foi chamado.
    // Retorna um bloco real para um hash conhecido (para testar o caminho de sucesso do servidor)
    // e undefined para qualquer outro hash (para testar o caminho 404).
    getBlock(hash: string): Block | undefined {
        // Simplesmente encontra o bloco na lista de mocks
        return this.blocks.find(b => b.hash === hash);
    }
}