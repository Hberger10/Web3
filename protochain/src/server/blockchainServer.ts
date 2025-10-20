import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import Block from '../lib/block';
import Blockchain from '../lib/blockchain';
import Transaction from '../lib/transaction';

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);

const app = express();

/* c8 ignore start */
if (process.argv.includes("--run"))
    app.use(morgan('tiny'));
/* c8 ignore end */

app.use(express.json());

const blockchain = new Blockchain();

app.get('/status', (req, res, next) => {
    res.json({
        mempoolSize: blockchain.mempool.length,
        blocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

app.get('/blocks/next', (req: Request, res: Response, next: NextFunction) => {
    res.json(blockchain.getNextBlock());
})

app.get('/blocks/:indexOrHash', (req: Request, res: Response, next: NextFunction) => {
    const indexOrHash = req.params.indexOrHash.trim();
    
    // 1. TENTA BUSCAR POR ÍNDICE (Prioridade, pois é mais rápido e confiável)
    // Verifica se é um número
    if (/^[0-9]+$/.test(indexOrHash)) {
        const index = parseInt(indexOrHash);
        
        // Verifica se o índice está dentro dos limites válidos
        if (index >= 0 && index < blockchain.blocks.length) {
            // Se encontrou, RETORNA IMEDIATAMENTE (CORREÇÃO CHAVE)
            return res.json(blockchain.blocks[index]);
        }
        // Se for um número, mas fora dos limites (ex: bloco 10 em cadeia de 4), 
        // Não tenta buscar por hash; a busca por índice falhou.
    }

    // 2. TENTA BUSCAR POR HASH
    // Executa apenas se o parâmetro não era um número ou se o índice estava fora dos limites.
    const blockByHash = blockchain.getBlock(indexOrHash);

    if (blockByHash) {
        return res.json(blockByHash);
    }

    // 3. SE NADA FOR ENCONTRADO
    return res.sendStatus(404);
});

app.post('/blocks', (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash === undefined) return res.sendStatus(422);

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if (validation.success)
        res.status(201).json(block);
    else
        res.status(400).json(validation);
})

app.post('/transactions', (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash === undefined) return res.sendStatus(422);

    const tx= new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(tx);

    if (validation.success)
        res.status(201).json(tx);
    else
        res.status(400).json(validation);
})

app.get('/transactions/{:hash}', (req: Request, res: Response, next: NextFunction) => { 

    if (req.params.hash)
        res.json(blockchain.getTransaction(req.params.hash));
    else
        res.json({
            next: blockchain.mempool.slice(0, Blockchain.TX_PER_BLOCK),
            total: blockchain.mempool.length
        });
})

app.post('/blocks', (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash === undefined) return res.sendStatus(422);

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if (validation.success)
        res.status(201).json(block);
    else
        res.status(400).json(validation);
})








/* c8 ignore start */
if (process.argv.includes("--run"))
    app.listen(PORT, () => console.log(`Blockchain server is running at ${PORT}`));
/* c8 ignore end */

export {
    app
}