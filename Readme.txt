Definição

Api para registrar o volume mensal de leite produzido, o preço mensal por litro de leite e o montante mensal recebido pelos produtores.


Tecnologias utilizadas

Verificar a seção "dependencies" do arquivo package.json na raiz do projeto.

Passa a passo para a criação da API:

OBS: sempre cada passo corresponde a um commit, portanto verificar o conteúdo dos commits.

1 - Criar um repositório no GitHub para armazenar e versionar o código fonte da API:

  - https://github.com/arthais-systems/milk-api/tree/develop
  - https://github.com/arthais-systems/milk-api.git

2 - Criar uma branch "develop" a partir da branch "master";

3 - Clonar o referido repositório:

  $ git clone https://github.com/arthais-systems/milk-api.git

4 - Entrar na pasta clonada da API:

  $ cd milk-api

5 - Transferir para a branch "develop":

  $ git checkout develop

6 - Inicializar a nova API:

  $ npm init

  - package name: default
  - version: default
  - description: Api para registrar o volume mensal de leite produzido, o preço mensal por litro de leite e o montante mensal recebido pelos produtores.
  - entry point: server.js
  - test comand: default
  - git repository: default
  - keywords: javascript nodejs express mongoose mochajs chaijs swagger mongodb milk
  - author: Raimundo Santo (exemplo)
  - license: MIT
  - Is this ok? yes

7 - Instalar o express, express-async-handler, mongoose e cors:

  $ npm install express express-async-handler mongoose cors --save
  
8 - Criar o arquivo de entry point server.js;

9 - Configurar o comando "node server.js" como script de start da aplicação;

10 - Instalar o dotenv:

  $ npm install dotenv --save

11 - Habilitar requisições de diferentes origens, do inglês Cross-Origin Requests - CORS;

12 - Instalar o colors:
  
  $ npm install colors --save

13 - Configurar o ambiente de desenvolvimento;

14 - Configurar a conexão com o banco de dados MongoDB;

15 - Criar os models;

16 - Criar os controladores;

17 - Criar as rotas;

18 - Configurar os roteadores no arquivo server.js;

19 - Adicionar todos os métodos necessários aos controladores e adicionar todos os end-points necessários às rotas.

20 - Configurar o Swagger;

21 - Desacoplar a implementação utilizando JoiJS para implentar os Middlewares de validação;

FALTA FAZER:

22 - Desacoplar a persistência

23 - Implementar segurança com helmet e node-oauth2-jwt-bearer;

24 - Criar os testes unitários;

25 - Criar os testes integrados.


{
      "type": "node",
      "name": "Attach by Process ID",
      "request": "attach",
      "processId": "${command:PickProcess}",
      "protocol": "inspector",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}\\server.js",
      "restart": true
    },
 