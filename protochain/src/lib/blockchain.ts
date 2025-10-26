import Block from './block';
import Validation from './validation';
import BlockInfo from './blockInfo';
import Transaction from './transaction';
import TransactionType from './transactionType';
import TransactionSearch from './transactionSearch';
import TransactionInput from './transactionInput';

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;
    static readonly TX_PER_BLOCK = 2;

    /**
     * Creates a new blockchain
     */
    constructor() {
        this.mempool = [];
        this.blocks = [new Block({
            index: this.nextIndex,
            previousHash: "",
            transactions: [new Transaction({
                type: TransactionType.FEE,
                txInput:new TransactionInput()
            } as Transaction)]
        } as Block)];
        this.nextIndex++;
    }

    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)+1;
    }

    addTransaction(transaction: Transaction): Validation {
        if(transaction.txInput){
            const from= transaction.txInput.fromAddress;
            const pendingTx = this.mempool.map(tx=> tx.txInput).filter(txi=>txi!.fromAddress===from)

            if (pendingTx && pendingTx.length)
                return new Validation(false,"Duplicate transaction in mempool: somehashvalue")

            //TODO: Validar origem dos fundos

        }

        const validation = transaction.isValid();
        if (!validation.success)
            return new Validation(false, `Invalid transaction: ${validation.message}`);

        if (this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash))) //verifica se ja tem uma transacao igual em algum bloco
            
            return new Validation(false, `Duplicate transaction: ${transaction.hash}`);

        
        this.mempool.push(transaction);
        return new Validation(true, transaction.hash);
    }

    addBlock(block: Block): Validation {
        const lastBlock = this.getLastBlock();

        const validation = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());
        if (!validation.success)
            return new Validation(false, `Invalid block: ${validation.message}`);

        const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE).map(tx => tx.hash);//all transactions except fee
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash))//transactions in the mempool that are not in the new block
        if (newMempool.length + txs.length !== this.mempool.length)
            return new Validation(false, `Invalid tx in block: mempool`);
            
        this.mempool = newMempool;

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation(true,block.hash);

    }



    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.hash === hash);
    }

    getTransaction(hash: string): TransactionSearch  {
        const mempoolIndex = this.mempool.findIndex(t => t.hash === hash);
        if (mempoolIndex !== -1)
            return {
                transaction: this.mempool[mempoolIndex],
                mempoolIndex: mempoolIndex,
                blockIndex: -1
            } as TransactionSearch;

        const blockIndex = this.blocks.findIndex(b => b.transactions.some(tx => tx.hash === hash));
        if (blockIndex !== -1) {
            const block = this.blocks[blockIndex];
            const transaction = block.transactions.find(tx => tx.hash === hash)!;
            return {
                transaction: transaction,
                mempoolIndex: -1,
                blockIndex: blockIndex
            } as TransactionSearch;
        }

        return {blockIndex: -1, mempoolIndex: -1, transaction: null as any} as TransactionSearch;
    }

    isValid(): Validation {
        for (let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
            if (!validation.success)
                return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`);
        }
        return new Validation();
    }

    getFeePerTx(): number {
        return 1;
    }

    getNextBlock(): BlockInfo | null {
      if (this.mempool.length === 0)
          return null;
        const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);

        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;
        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }
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
