# Waller back
## _Projeto_

Waller é um sistema de teste para realização de transferências financeiras. Nele é possível realizar retirada, pagamentos, depósito, ver seus rendimentos totais e acompanhar por meio de gráfico as entradas (com rendimento) e saídas de sua conta. Aqui se trata do projeto de back end.

O projeto é dividido em módulos (cada qual podendo ter seu banco correspondente), os quais são importados dentro do módulo de start do nest. No caso em específico, tem-se apenas o módulo de transactions e do graphql, todavia, pode-se acrescentar mais módulos (apps) conforme novas funcionalidades forem surgindo.

Dentro de cada módulo se tem os controllers e services. Os controllers ficam responsáveis por gerar os endpoints que serão consumidos pelo graphql e os services pelas regras de negócio.

O graphql consome os dados em endpoints gerados a partir dos controllers e retorna os valores para serem utilizados no front


## Tech

Waller lança mão de algumas tecnologias, aqui sendo as principais delas no back-end:

- **NestJs** - Framework bastante prático, que gera um molde de projeto para que se possa construir respeitando sua arquitetura definida. Isso é interessante para que o projeto cresça e se mantenha organizado, diferentemente do express que oferece maior flexibilidade nessa questão;
- **Typescript** - Assim como no frontend, o typescript é utilizado para melhorar a legibilidade e diminuir quantidade de bugs do projeto;
- **GraphQL** - O grapql server é orientado a chamar os endpoints gerados pelo controller. Utilizado aqui dentro do repositório, porém facilmente desacoplado se necessário;
- **Typeorm** - ORM para facilitar as operações que envolviam a modelagem do banco de dados;
- **Aws** - Não necessariamente no projeto em si, mas o banco de dados é setado na nuvem para que fique independente da máquina do usuário que for testar;
-  **Eslint, Prettier, Husky, Github Actions** - Tecnologias usadas para melhorar a entrega do código e evitar possíveis bugs commitados na branch principal. 

Além dessas, outras tecnologias para desenvolvimento foram utilizadas, não sendo necessário citá-las aqui.

## Instalação e teste

Assim como no front-end, para rodar o projeto, faz-se necessário ter o node v12 ou superior instalado em sua máquina. Após isso, execute os comandos a seguir conforme necessário: 

Instalando os módulos...
```sh
yarn intall
```
Testar em dev...
```sh
yarn start
```

Para gerar uma build para produção...

```sh
yarn build
```
E testes...

```sh
yarn test
```

Comandos usuais para não gerar confusão :)

## O que falta nesse projeto?

Dentre as diversas limitações, algumas podem ser levantadas para serem posteriormente adicionadas/melhoradas:
- Testes end-to-end assim como no front-end. Eles evitariam possíveis bugs em casos muito delicados envolvendo toda regra de negócio;
- Assim como no front também, autorização e autenticação nas requisições. Isso é imprescindível para lançamento fora de testes;
- Uma possível separação do módulo do graphql em outro repo/projeto para fazer essa intermediação entre o front-back de forma completamente independente;
- Transformar cada app em um package para poder ser chamado nesse projeto de graphql de forma independente;
