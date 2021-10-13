# O Desafio

No contexto dos meios de pagamento, o desafio é construir uma API Restful para gestão de contas.

Mais detalhes no repositório [cdt-baas/desafio-dev-api-rest](https://github.com/cdt-baas/desafio-dev-api-rest).

# A Solução

A solução é baseada no framework [Express](https://expressjs.com/pt-br/) para a interface web, e no Mapeamento Objeto Relacional (ORM) [Knex.js](https://knexjs.org/) para construção do banco de dados e de suas consultas.

Para organização dos arquivos/scripts, é utilizado o [Consign](https://github.com/jarradseers/consign).

# Manual de Execução

A aplicação utiliza duas soluções de banco de dados dependendo do valor da variável de ambiente **NODE_ENV**.

Caso a variável seja definida como _development_ (padrão), o banco de dados utilizado será SQLite, caso seja definido como _production_, o banco de dados utilizado será Postgres.

No modo _development_, para executar a aplicação baste executar o _script_ **NPM** **_dev_**, que o arquivo do SQLite será criado.

> npm run dev

No modo _production_, além de ajustar a variável **NODE_ENV** e necessário ajustar também a variável **PG_CONNECTION_STRING** com as configurações de conexão ao banco de dados Postgres.

Por exemplo:

```
NODE_ENV=production
PG_CONNECTION_STRING=postgres://postgres:123456@localhost:5432/banco
```

> As variáveis de ambiente podem ser definidas em um arquivo **.env** no diretório raiz. Para comodidade, foi adicionado no repositório um arquivo **.env.defaults** como exemplo.

> No dois caos, _development_ ou _production_, a aplicação irá realizar as migrações no banco de dados para criá-lo, conforme scprits descritos no diretório _./migrations_.

## Docker

O repositório contém um arquivo para o **Docker Compose**. Também possui um arquivo **Dockerfile** para construção da imagem.

Essas duas opções definem a variável de ambiente **NODE_ENV** para _production_, e consequentemente utilizam o Postgres como banco de dados.

## Utilizando Docker manualmente

Segue exemplo de comandos para utilizar o Docker manualmente.

### Criando um container para o Banco de Dados (Postgres)

```
docker run --name some-postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=postgres -e POSTGRES_DB=banco -p 5432:5432 -d postgres:13
```

Onde `some-postgres` é o nome do container.

### Criando uma rede para conectar os _containers_

```
docker network create some-network
```

Onde `some-network` é o nome da rede

#### Conectando o container do banco de dados na rede

```
docker network connect some-network some-postgres
```

Onde `some-network` é o nome da rede e `some-postgres` é o nome do container a conectar

### Criando uma imagem Docker da aplicação

```
docker build . -t dev-api-rest-app
```

Onde `dev-api-rest-app` é o nome da imagem

#### Criando um container com a imagem

```
docker run -d -p 3000:3000 -e DATABASE_URL="postgres://postgres:123456@some-postgres:5432/banco" -e DATABASE_SSL=false --network some-network dev-api-rest-app
```

Onde `some-network` é o nome da rede, `some-postgres` é o nome do container com o banco de dados e `dev-api-rest-app` é o nome da imagem a ser usada para criar o container

# Descrição das Rotas da API

A seguir a descrição das rotas (_endpoints_) da API Restful. Seguindo o padrão "VERBO HTTP" {{URL}}/rota.

# POST {{URL}}/pessoa

Cria uma nova _Pessoa_.

## Parâmetro

### URL

Nenhum.

### Corpo

Objeto com as seguintes propriedades:

-   nome: Nome da pessoa;
-   cpf: cpf da pessoa (apenas os 11 dígitos);
-   dataNascimento: data de nascimento da pessoa (formato JS válido).

Exemplo:

```
{
    "nome": "Cicrano de Tal",
    "cpf": "22222222222",
    "dataNascimento": "1982-08-28"
}
```

## Retorno

Nenhum.

# PUT {{URL}}/pessoa/:id

Atualiza uma _Pessoa_.

## Parâmetro

### URL

-   id: ID da Pessoa.

### Corpo

Objeto com as seguintes propriedades:

-   nome: Nome da pessoa;
-   cpf: cpf da pessoa (apenas os 11 dígitos);
-   dataNascimento: data de nascimento da pessoa (formato JS válido).

Exemplo:

```
{
    "nome": "Cicrano de Tal",
    "cpf": "22222222222",
    "dataNascimento": "1982-08-28"
}
```

## Retorno

Nenhum.

# GET /pessoa/:id

Obtém uma _Pessoa_.

## Parâmetro

### URL

-   id: ID da Pessoa.

### Corpo

Nenhum.

## Retorno

Objeto referente a uma pessoa.

Exemplo:

```
{
  "idPessoa": 2,
  "nome": "Cicrano de Tal",
  "cpf": "22222222222",
  "dataNascimento": "1982-08-28"
}
```

# DELETE {{URL}}/pessoa/:id

Exclui uma _Pessoa_.

## Parâmetro

### URL

-   id: ID da Pessoa.

### Corpo

Nenhum.

## Retorno

Nenhum.

# POST {{URL}}/conta

Cria uma nova _Conta_.

## Parâmetro

### URL

Nenhum.

### Corpo

Objeto com as seguintes propriedades:

-   idPessoa: ID da Pessoa;
-   limiteSaqueDiario: valor decimal para o limite diário de saque;
-   tipoConta: valor inteiro referente ao tipo da conta;
-   dataCriacao: data de criação da conta (formato JS válido).

Exemplo:

```
{
    "idPessoa": "2",
    "limiteSaqueDiario": "1000",
    "tipoConta": "10",
    "dataCriacao": "2021-08-28"
}
```

## Retorno

Nenhum.

# PUT {{URL}}/conta

Atualiza uma nova _Conta_.

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Objeto com as seguintes propriedades:

-   idPessoa: ID da Pessoa;
-   limiteSaqueDiario: valor decimal para o limite diário de saque;
-   tipoConta: valor inteiro referente ao tipo da conta;
-   dataCriacao: data de criação da conta (formato JS válido).

Exemplo:

```
{
    "idPessoa": "2",
    "limiteSaqueDiario": "1000",
    "tipoConta": "10",
    "dataCriacao": "2021-08-28"
}
```

## Retorno

Nenhum.

# GET {{URL}}/conta/:id

Obtém uma _Conta_.

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Nenhum.

## Retorno

Objeto referente a uma conta.

Exemplo:

```
{
  "idConta": 1,
  "idPessoa": 2,
  "saldo": 5293,
  "limiteSaqueDiario": 1000,
  "flagAtivo": 1,
  "tipoConta": 10,
  "dataCriacao": "2021-08-28"
}
```

# DELETE {{URL}}/pessoa/:id

Exclui uma _Conta_.

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Nenhum.

## Retorno

Nenhum.

# GET {{URL}}/conta/:id/saldo

Obtém o saldo de uma _Conta_.

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Nenhum.

## Retorno

Objeto referente ao saldo da conta.

Exemplo:

```
{
  "idConta": "1",
  "saldo": 5293
}
```

# PUT {{URL}}/conta/:id/movimentar

Realiza movimentação (depósito ou saque) em uma _Conta_.

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Objeto com a seguinte propriedade:

-   valor: valor da movimentação, sendo que valores **positivos** para depósito e valores **negativos** para saque.

Exemplo:

```
{
    "valor": -100.00
}
```

## Retorno

Objeto referente ao saldo da conta.

Exemplo:

```
{
  "idConta": "1",
  "saldo": 5293
}
```

# PUT {{URL}}/conta/:id/ativar-desativar

Altera a situação de uma _Conta_ (ativa ou bloqueada).

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Objeto com a seguinte propriedade:

-   ativo: _true_ para ativar ou _false_ para bloquear.

Exemplo:

```
{
    "ativo": true
}
```

## Retorno

Objeto referente à situação da conta.

Exemplo:

```
{
  "idConta": "1",
  "flagAtivo": true
}
```

# GET {{URL}}/extrato/:id

Obtém o extrato com as movimentações de uma _Conta_.

## Parâmetro

### URL

-   id: ID da Conta.

### Corpo

Objeto **opcional** com as seguintes propriedades:

-   de: data início do período das movimentações da conta (formato JS válido);
-   ate: data fim do período das movimentações da conta (formato JS válido).

> Caso o objeto opcional com as datas não seja enviado na requisição, todas as transações da conta serão retornadas.

Exemplo:

```
{
    "de": "2021-10-01",
    "ate": "2021-10-12"
}
```

## Retorno

_Array_ de objetos referente às transações da conta.

Exemplo:

```
[
  {
    "idTransacao": 1,
    "idConta": 1,
    "valor": 1000,
    "dataTransacao": "2021-10-12"
  },
  {
    "idTransacao": 2,
    "idConta": 1,
    "valor": -7,
    "dataTransacao": "2021-10-12"
  },
  {
    "idTransacao": 3,
    "idConta": 1,
    "valor": -700,
    "dataTransacao": "2021-10-12"
  },
  {
    "idTransacao": 4,
    "idConta": 1,
    "valor": 1000,
    "dataTransacao": "2021-10-12"
  }
]
```
