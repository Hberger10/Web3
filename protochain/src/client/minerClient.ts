import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import BlockInfo from '../lib/blockInfo';

import Block from '../lib/block'

const API_URL = process.env.BLOCKCHAIN_SERVER || 'http://localhost:3000';
const minerWallet={
    privateKey: "12346",
    publicKey: `${process.env.MINER_WALLET}`
}

let totalMined =0;
console.log("miner started with wallet "+ minerWallet.publicKey);


async function mine() {
    
    console.log("getting next block info...");
    const {data} = await axios.get(`${API_URL}/nextblock`);
    const blockInfo: BlockInfo = data as BlockInfo;

    const newBlock= Block.fromBlockInfo(blockInfo)
    //todo: adicionar tx de recompensa para o minerador
    console.log("start mining block"+ blockInfo.index)
    newBlock.mine(blockInfo.difficulty,minerWallet.publicKey)



    console.log(blockInfo);

    try{
        await axios.post(`${API_URL}/blocks`,newBlock);
        console.log("block added successfully");
        totalMined++;
        console.log("Total blocks mined by this miner: "+ totalMined);
    }


    catch(err:any){
    console.error(err.response ? err.response.data : err.message);


}


setTimeout(mine,1000);
}

mine();