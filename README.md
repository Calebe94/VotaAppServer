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

Rota para a autenticação do eleitor.

```
  /api/auth/
```
  * Tipo: POST
  * Recebe: JSON { username: username, password: password}
  * Retorna: {"auth":true}%

* Teste: 

      curl -d '{"username": "123412341234", "password": "spcsp2018"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/auth/

### Candidatos

Rota para resgatar todos os candidatos cadastrados no banco de dados.

```
  /api/candidatos/:type
```
  * Tipo: GET
  * Recebe: vereador ou prefeito como parâmetro de URL
  * Retorna: [ { nome: String, partido: String, foto: String, id: _id } ]

* Teste: 
        
      curl http://localhost:8080/api/candidatos/vereador

### Adicionar 

Rota utilizada para cadastrar **Prefeito**, **Vereador** e **Eleitor**.

```
  /api/add/:(vereador/prefeito/eleitor)
```
  * Tipo: POST
  * Recebe: 
      * Vereador/Prefeito: { nome: nome_candidato, partido: partido_candidato, foto: url_foto }
      * Eleitor: { nome: nome_eleitor, titulo: titulo_eleitor, senha: senha_eleitor }
  * Retorna: { status: true/false}

* Teste: 
        
      curl -d '{"nome": "Jon Doe", "titulo": "123112311231", "senha": "umasenhaforte"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/add/eleitor

### Votar

Rota utilizada para efetuar a votação realizada pelo eleitor.

```
  /api/votar/
```
  * Tipo: POST
  * Recebe: { type: prefeito/vereador, id_candidato: _id_candidato, id_eleitor: _id_eleitor }
  * Retorna: { status: true/false}

* Teste: 
        
      curl -d '{"type": "prefeito", "id": "ads213213sadas0231209us"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/votar

## Banco

* Nome do **Database** 
  * vota_app

* Collections
  * vereadores
  * prefeitos
  * eleitores

# Referências

* [An Introduction to Mongoose for MongoDB and Node.js](https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527)