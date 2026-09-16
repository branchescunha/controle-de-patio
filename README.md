# Controle de Pátio

Aplicação web desenvolvida em Angular para gerenciamento de veículos presentes no pátio de uma oficina. O sistema permite registrar entradas, visualizar os veículos cadastrados, alternar entre diferentes modos de visualização e remover veículos, mantendo os dados persistidos localmente no navegador.

## Demonstração

A aplicação está publicada na Vercel:

https://controle-de-patio-memora.vercel.app

## Funcionalidades

- Cadastro de entrada de veículos
- Validação dos campos obrigatórios
- Feedback visual para campos inválidos
- Contador de veículos presentes no pátio
- Visualização dos veículos em cartões
- Visualização dos veículos em tabela
- Alternância entre os modos Cartões e Tabela
- Remoção de veículos
- Persistência dos dados com localStorage
- Recuperação automática dos dados ao recarregar a aplicação
- Estado vazio quando não existem veículos cadastrados
- Interface responsiva
- Testes automatizados dos principais comportamentos

## Tecnologias utilizadas

- Angular 22
- TypeScript
- HTML5
- CSS3
- Reactive Forms
- localStorage
- Vitest
- Prettier
- Vercel

## Estrutura do projeto

```txt
controle-de-patio/
├── .vscode/
├── public/
├── src/
│   ├── app/
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.spec.ts
│   │   └── app.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── .editorconfig
├── .gitignore
├── .prettierrc
├── angular.json
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```
