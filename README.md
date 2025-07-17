# Projeto Tinnki

**Índice**

- [Projeto Tinnki](#projeto-tinnki)
  - [Arquitetura da Aplicação](#arquitetura-da-aplicação)
    - [/app](#app)
    - [/components](#components)
    - [/interfaces](#interfaces)
    - [/lib](#lib)
    - [/models](#models)
    - [/modules](#modules)
  - [Instalação e configuração](#instalação-e-configuração)
    - [Instalação de dependências](#instalação-de-dependências)
    - [Configurar variáveis de ambiente](#configurar-variáveis-de-ambiente)
    - [Build do projeto](#build-do-projeto)
    - [Inicialização do projeto](#inicialização-do-projeto)
  - [Tecnologias utilizadas](#tecnologias-utilizadas)
    - [Framework](#framework)
    - [Requests](#requests)
    - [Persistência](#persistência)
    - [API](#api)
    - [UI](#ui)
  - [Autores](#autores)

## Arquitetura da Aplicação

### /app
Este diretório contém a aplicação React Native, que é responsável por renderizar o frontend da aplicação.

- **(auth)** - contém as rotas de autenticação
- **(general)** - contém as rotas gerais (após autenticação)

### /components
Este diretório contém os componentes reutilizáveis da aplicação.

- **ui** - contém os componentes de interface (gerados utilizando React Native Reusables)

### /interfaces
Este diretório é responsável por realizar a comunicação do frontend com ferramentas externas, por enquanto, apenas com a nossa API.

### /lib
Este diretório contém funções utilitárias que poderiam ser reutilizadas em outros projetos.

### /models
Este diretório contém os modelos de dados utilizados na aplicação.

### /modules
Este diretório contém os módulos da aplicação, que são responsáveis por realizar a lógica de negócio.

## Instalação e configuração

### Instalação de dependências

```bash
yarn
```

### Configurar variáveis de ambiente

Seguir exemplo demonstrado em `.env.example`, criando um arquivo `.env` na raiz do projeto

### Build do projeto

Como estamos utilizando algumas bibliotecas que utilizam dependências nativas, precisamos fazer o build do projeto.

Caso esteja utilizando um **emulador Android**, execute o seguinte comando:
```
yarn android
```

Caso esteja utilizando um **emulador iOS**, execute o seguinte comando:

```bash
yarn ios
```

### Inicialização do projeto

Para inicializar o projeto, execute o seguinte comando:

```bash
  yarn dev
```

Após isso, aperte `a` para abrir o **emulador Android** ou `i` para abrir o **emulador iOS**.

## Tecnologias utilizadas

### Framework
Para o desenvolvimento do frontend, utilizamos o [Expo](https://expo.dev/), que é um framework para desenvolvimento de aplicações [React Native](https://reactnative.dev/).

### Requests
Para executar as requisições HTTP, utilizamos o [React Query](https://react-query.tanstack.com/) e o [Axios](https://axios-http.com/), que são bibliotecas para gerenciamento de estado e requisições HTTP, respectivamente.

### Persistência
Para persistir os dados no dispositivo, utilizamos o [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) que é uma biblioteca de armazenamento local para React Native, que é muito mais rápida e eficiente do que o AsyncStorage.

Ela também possui suporte ao React Query, o que facilita a integração com o gerenciamento de estado.

### API
A API utilizada utilizamos a [Newsee Fastify API](https://github.com/andrebeolchi/anki-back), que é responsável por fornecer os dados para o frontend.

### UI
Para a estilização do frontend, utilizamos [NativeWind](https://www.nativewind.dev/) e [React Native Reusables](https://rnr-docs.vercel.app/getting-started/introduction/), uma reprodução de shadcn/ui para react native.

## Autores

<img src="https://avatars.githubusercontent.com/u/61586777" width="16" height="16"> [André Beolchi](https://github.com/andrebeolchi) (RM 359648)
<br><img src="https://avatars.githubusercontent.com/u/34667580" width="16" height="16"> [Fellipe Corominas](https://github.com/LeFelps) (RM 359677)
