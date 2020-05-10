import express from 'express'
import redis from 'redis'
import https from 'https'

const app = express();
const client = redis.createClient()

const getApiData = async () => {
    //Usa Api do Rick And Morty para pegar informaçao 
    return https.get(`https://rickandmortyapi.com/api/character/2`, (resp) => {
        return resp.on('data', async (body) => {
            //Envia retorno da Api para a chave `ricks` 
            await client.set('ricks', body.toString())
            //Seta o tempo de expiração do valor para 5 segundos
            await client.expire('ricks', 5);
            //Retorna Valor
            return body.toString()
        });
    })
}
//Rota simples via express
app.get("/", async (req, res) => {
    // Busca no redis a chave Ricks
    client.get('ricks', async (err, reply) => {
        // Se não existir, retorna vazio (feito desta forma para ficar visualmente mais fácil a validação)
        if(!reply) {
            console.log('api');
            return res.json('');
        }
        //Caso exista, retorna o valor da chave Ricks
        console.log('redis');
        return res.json(reply);
    }); 
    
});

//Inicia Servidor
app.listen(3000, () => {
    console.log('Tá no ar');
})