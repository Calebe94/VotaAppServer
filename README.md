# VotaAppServer

Web service para o [VotaApp](https://github.com/thecobra159/VotaAPP/tree/develop).

## Setup

* Instalar as Dependências:
  ```
    npm install
  ```

* Para criar o banco:
  ```
    npm run createdb
  ```

* Rodar o servidor para testes:
  ```
    npm test
  ```

* Rodar o servidor para Produção:
  ```
    npm start
  ```

## Rotas

### Autenticação
```
  /api/auth/
```
  * Tipo: POST
  * Recebe: JSON { username: username, password: password}
  * Retorna: {"auth":true}%

* Teste: 

      curl -d '{"username": "123412341234", "password": "spcsp2018"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/auth/

### Candidatos
```
  /api/candidatos/:type
```
  * Tipo: GET
  * Recebe: vereador ou prefeito como parâmetro de URL
  * Retorna: [ { nome: String, partido: String, foto: String } ]

* Teste: 
        
      curl http://localhost:8080/api/candidatos/vereador

### Adicionar candidatos

Em desenvolvimento...

## Banco

* Nome do **Database** 
  * vota_app

* Collections
  * candidatos
  * eleitores

# Referências

* [An Introduction to Mongoose for MongoDB and Node.js](https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527)