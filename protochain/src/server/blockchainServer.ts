// Importa o Express e garante a compatibilidade com CommonJS/TypeScript.
// Use esta importação padrão que funciona melhor com 'esModuleInterop' ativado:
import express from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';


// 1. O tipo primitivo para números em TypeScript é 'number' (minúsculo), não 'Number' (Maiúsculo).
const PORT: number = 3000; 

// Inicializa a aplicação Express.
const app = express();
app.use(morgan('tiny'));
app.use(express.json());


const blockchain=new Blockchain();

// 2. Remove o sinal de '<' e usa a função de callback diretamente.
if (require.main === module) {
    // Se for o ponto de entrada, inicia o servidor:
    app.listen(PORT, () => {
        console.log(`Blockchain server is running at ${PORT}`);
    });
}

app.get('/blocks/:indexOrHash', (req, res, next) => {
    const param = req.params.indexOrHash;
    let block; // Variável para armazenar o bloco encontrado

    // 1. Tenta buscar por índice (se for um número)
    if (/^[0-9]+$/.test(param)) {
        const index = parseInt(param);
        block = blockchain.blocks[index];
    }
    // 2. Tenta buscar por hash (se não for um número)
    else {
        block = blockchain.getBlock(param);
    }

    // 3. VERIFICAÇÃO CRÍTICA
    if (block) {
        // Se o bloco existe, retorna 200 OK com os dados do bloco
        res.json(block);
    } else {
        // Se o bloco for 'undefined' (não encontrado), retorna 404 Not Found
        // (Este passo impede o retorno de '1' ou qualquer comportamento inesperado)
        res.status(404).json({ error: `Block with index or hash '${param}' not found.` });""
    }
});

app.get('/status',(req,res,next)=>{
    res.json({
        number0fBlocks: blockchain.blocks.length,
        isValid: blockchain.isvalid().success,
        lastBlock: blockchain.getLastBlock()    
    })
})