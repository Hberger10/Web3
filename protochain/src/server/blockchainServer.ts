import express from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';

const PORT: number = 3000; 

const app = express();

if (process.argv.includes('--run')) {
    app.use(morgan('tiny'));
}
app.use(express.json());

const blockchain = new Blockchain(); //chama o construtor da classe blockchain

// ✅ DEFINA TODAS AS ROTAS ANTES DO app.listen()

app.get('/status', (req, res,next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length, 
        isValid: blockchain.isvalid().success,
        lastBlock: blockchain.getLastBlock()    
    })
});

app.get('/blocks/:indexOrHash', (req, res,next) => {
    const indexOrHash = req.params.indexOrHash.trim(); 
    
    // Tenta buscar por índice primeiro
    const blockByIndex = blockchain.blocks[parseInt(indexOrHash)];
    
    if (blockByIndex) {
        return res.json(blockByIndex);
    }
    
    // Se não encontrar por índice, busca por hash
    const blockByHash = blockchain.blocks.find(b => b.hash === indexOrHash);
    
    if (blockByHash) {
        return res.json(blockByHash);
    }
    
    return res.status(404).json({ 
        error: `Block with index or hash '${indexOrHash}' not found.` 
    });
});


    app.post('/blocks', (req, res, next) => {
  if (req.body.hash=== undefined) return res.sendStatus(422); //feito teste caso não consiga adicionar o bloco/teste feito no blockchainServer.test.ts

  const block = new Block(req.body as Block); //cria um novo bloco com os dados que vieram no corpo da requisição/teste feito no blockchainServer.test.ts
  const validation = blockchain.addBlock(block);

  if (validation.success)
    res.status(201).json(block);
  else
    res.status(400).json(validation); //próximo passo: fazer o teste que não consegue adicionar o bloco
});

// ✅ app.listen() SEMPRE POR ÚLTIMO
if (process.argv.includes('--run')) {
    if (require.main === module) {
        app.listen(PORT, () => {
            console.log(`Blockchain server is running at a  ${PORT}`);
        });
    }
}


export {
    app
}