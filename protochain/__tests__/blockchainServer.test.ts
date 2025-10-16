// __tests__/blockchainServer.test.ts

import {describe, test,expect,jest} from '@jest/globals';
import request from 'supertest';
import {app} from '../src/server/blockchainServer';
import Block from '../src/lib/block';

import Transaction from '../src/lib/transaction';

jest.mock('../src/lib/block'); 

test('GET /status - Should return status', async () => {
    const response = await request(app)
        // CORREÇÃO 1: Usar '/status' (minúsculo)
        .get('/status'); 

    expect(response.status).toEqual(200);

    // CORREÇÃO 2: Acessar a propriedade 'isValid' (camelCase) que é um booleano.
    expect(response.body.isValid).toEqual(true); 
});

test('GET /nextblock - Should get next block info', async () => {
    const response = await request(app)
        .get('/nextblock');

    expect(response.status).toEqual(200);
    expect(response.body.index).toEqual(1);
});

test('GET /blocks/:hash - Should get block', async () => {
    const response = await request(app)
        .get('/blocks/abc');

    expect(response.status).toEqual(200);
    expect(response.body.hash).toEqual("abc");
});

test('GET /blocks/:index - Should NOT get block', async () => {
    const response = await request(app)
        .get('/blocks/1');

    expect(response.status).toEqual(404);
});

test('POST /blocks/ - Should add block', async () => {
    const block = new Block({
        index: 1
    }as Block);
    const response = await request(app)
        .post('/blocks')
        .send(block);

    expect(response.status).toEqual(201);
    expect(response.body.index).toEqual(1);
});

test('POST /blocks/ - Should NOT add block', async () => {
    
    const response = await request(app)
        .post('/blocks')
        .send({});

    expect(response.status).toEqual(422);
    
});

test('POST /blocks/ - Should NOT add block(invalid)', async () => {
    // é considerado inválido se o index for negativo ou se o hashPrevious for vazio
    const block = new Block({
      index: -1,
      hashPrevious: "",
      transactions: [new Transaction({
        data: 'Genesis block'
    } as Transaction)]
    } as Block);
    
    const response = await request(app)
        .post('/blocks')
        .send(block);

    expect(response.status).toEqual(400);
    
});

test('GET /blocks/:indexOrHash - Should get block by INDEX (0)', async () => {
    // 1. Tenta buscar pelo índice 0
    const response = await request(app)
        .get('/blocks/0');

    // 2. Espera sucesso e o bloco Gênese
    expect(response.status).toEqual(200);
    expect(response.body.index).toEqual(0);
});


