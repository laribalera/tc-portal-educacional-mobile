# TC Portal Educacional — Mobile

Aplicação mobile do **TC Portal Educacional**, desenvolvida em **React Native com Expo**, responsável pela interface em dispositivos móveis, autenticação de professores e consumo da API REST do sistema educacional.

Este projeto compõe a camada mobile da aplicação full-stack cujo backend está disponível em:
https://github.com/laribalera/tc-portal-educacional

---

## Índice

* [Visão Geral](#visão-geral)
* [Arquitetura](#arquitetura)
* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Configuração](#configuração)
* [Executando a Aplicação](#executando-a-aplicação)
* [Funcionalidades Mobile](#funcionalidades-mobile)
* [Integração com a API](#integração-com-a-api)
* [Estrutura do Projeto](#estrutura-do-projeto)
* [Desenvolvimento](#desenvolvimento)
* [Contribuição](#contribuição)
* [Licença](#licença)
* [Suporte](#suporte)

---

## Visão geral

O **TC Portal Educacional — Mobile** é o aplicativo responsável por permitir acesso ao portal educacional através de dispositivos móveis, oferecendo autenticação de professores, visualização de conteúdos educacionais e navegação integrada à API backend.

### Principais funcionalidades

* Login de professores via API
* Persistência de sessão com AsyncStorage
* Navegação por stacks, abas inferiores e abas superiores
* Visualização de posts educacionais
* Integração completa com a API REST do sistema
* Interface otimizada para dispositivos móveis

---

## Arquitetura

A aplicação mobile atua como **cliente da API REST**, consumindo os serviços expostos pelo backend.

### Mobile (React Native + Expo)

```
src/
├── components/      # Componentes reutilizáveis de interface
├── context/         # Contextos globais (ex: autenticação)
├── navigation/      # Configuração de rotas e navegação
├── screens/         # Telas do aplicativo
├── services/        # Comunicação com a API (Axios)
├── storage/         # Persistência local (AsyncStorage)
└── theme/           # Estilos e tema visual
```

### Backend relacionado

O backend segue arquitetura **Node.js + Express + MongoDB (MVC)** e pode ser encontrado em:

https://github.com/laribalera/tc-portal-educacional

---

## Pré-requisitos

* Node.js **18+**
* npm ou yarn
* Expo CLI (opcional)
* Backend do portal educacional em execução
* Emulador Android/iOS ou aplicativo **Expo Go**

---

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio-mobile>
cd tc-portal-educacional-mobile
```

2. Instale as dependências:

```bash
npm install
```

---

## Configuração

### URL da API

Configure a URL base da API no serviço HTTP:

```
src/services/api.js
```

Exemplo:

```js
baseURL: "http://10.0.2.2:3000"
```

> Em dispositivos físicos, utilize o **IP da máquina** em vez de `localhost`.

---

## Executando a aplicação

### Modo de desenvolvimento

```bash
npm start
```

ou

```bash
npx expo start
```

Após iniciar:

* Escaneie o QR Code com **Expo Go**
* Execute em **emulador Android**
* Execute em **simulador iOS**
* Execute na **web**

### Scripts disponíveis

```bash
npm start
npm run android
npm run ios
npm run web
```

---

## Funcionalidades Mobile

### Autenticação

* Login de professores com JWT
* Armazenamento local do token com AsyncStorage
* Recuperação automática de sessão

### Conteúdos educacionais

* Listagem de posts vindos da API
* Visualização de detalhes de conteúdo
* Navegação fluida entre telas

### Navegação

* Stack Navigator
* Bottom Tabs
* Material Top Tabs

---

## Integração com a API

O aplicativo consome os endpoints definidos no backend:

* Autenticação de professores
* CRUD de posts
* Busca de conteúdos
* Gerenciamento de professores

Para detalhes completos da API, consulte:

https://github.com/laribalera/tc-portal-educacional

---

## Estrutura do projeto

```
tc-portal-educacional-mobile/
├── assets/              # Imagens e ícones
├── src/
│   ├── components/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── storage/
│   └── theme/
├── App.js               # Componente raiz
├── index.js             # Registro do app
├── app.json             # Configuração do Expo
├── package.json         # Dependências e scripts
└── package-lock.json
```

### Principais dependências

* React **19**
* React Native **0.81**
* Expo **SDK 54**
* React Navigation (stack, bottom tabs, material top tabs)
* Axios
* AsyncStorage
* Expo Font + Google Fonts (Poppins)

---

## Desenvolvimento

### Diretrizes

* Centralizar chamadas HTTP em `services/`
* Utilizar Context API para autenticação global
* Manter separação por camadas (screens, components, services)
* Garantir compatibilidade mobile
* Sincronizar mudanças com a API backend

---

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'Adiciona nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais.

---

## Suporte

Para dúvidas ou problemas:

1. Consulte a documentação do backend
2. Verifique issues existentes
3. Abra uma nova issue com detalhes
