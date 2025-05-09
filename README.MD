```markdown
# Rungo App - README

Este documento fornece instruções para instalar as dependências e iniciar o projeto Rungo App, que consiste em um backend Node.js e um frontend React Native.

## Estrutura do Projeto

rungo-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── config/
│   │   └── firebase-admin-config.js
│   │   └── rungo-app-mob-firebase-adminsdk-fbsvc-69ccb0f0aa.json  # SUAS CREDENCIAIS FIREBASE
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── public.js
│   └── .env
├── frontend/
│   ├── App.js
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── auth/
│   │   │   └── authGuard.js
│   │   ├── navigation/
│   │   │   └── HomeTabs.js
│   │   ├── screens/
│   │   │   ├── HomeScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── StoreScreen.js
│   │   └── ... (outros arquivos do frontend)
└── README.md

## Backend

### Pré-requisitos

* **Node.js** (versão LTS recomendada): [https://nodejs.org/](https://nodejs.org/)
* **npm** (geralmente instalado com Node.js)
* **Firebase Project:** Você precisará de um projeto Firebase configurado e um arquivo de credenciais da conta de serviço (JSON).

### Instalação das Dependências

1.  Navegue até a pasta do backend no seu terminal:
    ```bash
    cd backend
    ```

2.  Instale as dependências listadas no arquivo `package.json`:
    ```bash
    npm install
    ```

### Configuração

1.  **Arquivo `.env`:**
    * Crie um arquivo `.env` na raiz da pasta `backend`.
    * Adicione a seguinte variável de ambiente, substituindo `SUA_CHAVE_SECRETA_AQUI` por uma chave secreta forte para JWT:
        ```
        JWT_SECRET=SUA_CHAVE_SECRETA_AQUI
        PORT=3000 # (Opcional: altere a porta se necessário)
        ```

2.  **Credenciais do Firebase:**
    * Baixe o arquivo de credenciais da sua conta de serviço do Firebase (no Firebase Console, vá em Configurações do projeto -> Contas de serviço -> Gerar nova chave privada).
    * Coloque este arquivo na pasta `backend/config` e **renomeie-o para `rungo-app-mob-firebase-adminsdk-fbsvc-69ccb0f0aa.json`** (ou ajuste o nome no arquivo `backend/config/firebase-admin-config.js` se preferir outro nome).

### Execução do Backend

1.  No terminal, ainda dentro da pasta `backend`, execute o seguinte comando para iniciar o servidor:
    ```bash
    npm start
    ```
    Ou, se estiver usando `nodemon` para desenvolvimento:
    ```bash
    npm run dev
    ```
    O servidor backend será iniciado (por padrão) na porta 3000.

## Frontend

### Pré-requisitos

* **Node.js** (versão LTS recomendada): [https://nodejs.org/](https://nodejs.org/)
* **npm** ou **yarn**
* **React Native CLI:** Instale globalmente se ainda não o fez:
    ```bash
    npm install -g react-native-cli
    # ou
    yarn global add react-native-cli
    ```
* **Ambiente de Desenvolvimento React Native:** Configure seu ambiente para desenvolvimento React Native (SDKs Android/iOS, emuladores/simuladores). Consulte a documentação oficial do React Native para mais detalhes: [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

### Instalação das Dependências

1.  Navegue até a pasta do frontend no seu terminal:
    ```bash
    cd frontend
    ```

2.  Instale as dependências listadas no arquivo `package.json` usando `npm` ou `yarn`:
    ```bash
    npm install
    # ou
    yarn install
    ```

### Configuração

1.  **URL do Backend:**
    * No arquivo `frontend/src/screens/LoginScreen.js`, localize a variável `API_URL` e **substitua `SEU_IP_AQUI:3000` pelo endereço IP da sua máquina onde o backend está rodando**, seguido pela porta (geralmente 3000). Se você estiver usando um emulador/simulador na mesma máquina, `http://localhost:3000` ou o endereço IP específico da interface de rede do emulador/simulador podem funcionar. Para dispositivos físicos na mesma rede, use o IP da sua máquina.

    ```javascript
    const API_URL = 'http://SEU_IP_AQUI:3000';
    ```

### Execução do Frontend

1.  No terminal, ainda dentro da pasta `frontend`, execute um dos seguintes comandos para iniciar o aplicativo em um emulador/simulador ou dispositivo conectado:

    * **Expo Go:**
        ```bash
        npm start
        ```

    * **Para Android:**
        ```bash
        npx react-native run-android
        # ou
        yarn android
        ```

    * **Para iOS:**
        ```bash
        npx react-native run-ios
        # ou
        yarn ios
        ```

    Certifique-se de que seu emulador/simulador esteja em execução ou que um dispositivo esteja conectado ao seu computador.

Este guia deve fornecer os passos iniciais para configurar e executar o projeto Rungo App. Certifique-se de adaptar as configurações conforme necessário para o seu ambiente específico.
```