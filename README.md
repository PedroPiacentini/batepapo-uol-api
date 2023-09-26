# Batepapo UOL API

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/PedroPiacentini/batepapo-uol-api/blob/main/LICENSE)

## Instalação

Certifique-se de ter o Node.js instalado. Clone o repositório e execute os seguintes comandos:

```bash
npm install
npm start
```
## Uso

- **POST** `/participants`
    - Deve receber (pelo `body` do request), um parâmetro **name**, contendo o nome do participante a ser cadastrado na sala:
  
      ```jsx
      {
          name: "João"
      }
      ```

- **GET** `/participants`
    - Retornar a lista de todos os participantes.
    - Caso não haja nenhum participante na sala, o retorno deve ser um array vazio.

- **POST** `/messages`
    - Deve receber (pelo `body` da request), os parâmetros `to`, `text` e `type`:
        
        ```jsx
        {
            to: "Maria",
            text: "olá",
            type: "private_message"
        }
        ```
        
    - O `from` da mensagem **não será enviado pelo body**. Será enviado pelo cliente através de um **header** na requisição chamado `User`.

- **GET** `/messages`
    - Retornar as mensagens
    - Aceita um parâmetro via query string. Esse parâmetro deve se chamar limit.

- **POST** `/status`
    - Deve receber por um **header** na requisição, chamado `User`, contendo o nome do participante a ser atualizado.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **MongoDB**
- **Joi**
- **Day.js**
- **Dotenv**
- **Cors**
