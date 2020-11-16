# Desafio Nível02 - Database Upload

## Sobre

O diferencial deste desafio, foi trazer uma experiência com banco de dados **postgres** escrito com uma abstração usando o TypeORM, por meio do **NodeJS** e **TypeScript**.

Todo este desafio, foi feito a fim de praticar todas as tecnologias ensinadas e alguns dos patterns ensinados para melhor visibilidade/coerência do código.

## O desafio

Como objetivo, tinhamos a criação de rotas para uma aplicação de controle financeiro. A fim de manipular a informação e salvá-las no banco.

Para isso possuímos **quatro rotas**:

-**`POST /transactions:`** Ao cadastrar uma nova transação, ela deve ser armazenada dentro do seu banco de dados, possuindo os campos id, title, value, type, category_id, created_at, updated_at.

-**`GET /transactions:`** Essa rota deve retornar uma listagem com todas as transações que você cadastrou até agora, junto com o valor da soma de entradas, retiradas e total de crédito.

-**`DELETE /transactions/:id:`** A rota deve deletar uma transação com o id presente nos parâmetros da rota;

-**`POST /transactions/import:`** A rota deve permitir a importação de um arquivo com formato **csv**.

## Aprovação

Para que o desafio seja dado como **finalizado**, temos alguns testes presentes. Dentre estes:

-**`should be able to create a new transaction`**

-**`should create tags when inserting new transactions`**

-**`should not create tags when they already exists`**

-**`should be able to list the transactions`**

-**`should not be able to create outcome transaction without a valid balance`**

-**`should be able to delete a transaction`**

-**`should be able to import a file csv.`**

### Conclusão

Um desafio que agregou bastante conhecimento, pelo fato de conseguirmos entender na prática as tecnologias e a utilidade dos patterns aplicados.

No entanto, bastante desafiador; com o uso de um banco de dados, migrations, o relacionamento entre **services - repositories - rotas**, todos estes são conceitos/patterns que ficaram mais claros com a prática. Por fim, são conceitos extensos e que precisam de muita prática para entendimento completo.
