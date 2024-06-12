Projeto Tempero

Trata-se de um projeto de extensão universitária, desenvolvido no primeiro semestre de 2024, por um grupo de alunos da Universidade Estacio, no Recreio dos Bandeirantes, Rio de Janeiro. Os autores do projeto são: Abner Lobato de Azevedo, Eldon Alves da Costa, Gustavo Calisto de Lima Quaresma, Mariana de Carvalho Rocha e Rafael dos Santos Catarino

O objetivo do projeto foi desenvolver um aplicativo para controlar o estoque dos produtos consumidos por um pequeno restaurante self-service, localizado no Barra World Shopping, situado no bairro Recreio, Rio de Janeiro. O aplicativo deverá ser utilizado em dispositivo móvel em Android. 

O aplicativo foi desenvolvido em React Native, com a utilização do Expo e do SGBD SQLite local.

O aplicativo tem uma tela de entrada (tela Home), onde constam a logo do restaurante e quatro botões que permitirão ao usuário utilizar as funcionalidades do sistema. 

Os botões da tela Home são:
- Listar produtos;
- Cadastrar Produto;
- Gerar Relatórios;
- Apagar Dados.

O botão Listar Produtos aciona a tela Produtos Cadastrados, onde constam: a lista de todos os produtos cadastrados (em ordem alfabética), um filtro que lista os produtos cujo estoque tenham atingido o estoque mínimo, um filtro para selecionar o nome do produto digitado, um filtro para selecionar os produtos segundo o seu tipo (bebida, comida ou descartável) e três botões que acionam as seguintes funcionalidades: atualizar o estoque de um produto, editar certas características de um produto e excluir um produto selecionado.

O botão Cadastrar Produto aciona uma tela através da qual o usuário realizará o cadastro dos produtos a terem seus estoques controlados.

O botão Gerar Relatórios carrega uma tela onde o usuário poderá gerar os seguintes relatórios: relatório de entradas e saídas do estoque, relatório de despesas e relatório de lucro das bebidas.

O botão Apagar Dados permite ao usuário apagar os dados de movimentação, de forma a limitar o espaço ocupado pelo aplicativo no dispositivo móvel.
