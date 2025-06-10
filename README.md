# RITA - Frontend

Sistema de envio de notificações via WhatsApp com sistema de pagamentos e integração com o Paçoca.

## 🔗 Backend

Repositório do backend: [PacocaOficial/rita-back](https://github.com/PacocaOficial/rita-back)


## ✅ Requisitos
Antes de iniciar, certifique-se de que você tem as seguintes ferramentas instaladas na sua máquina:

- **Node.js**: ^18.x (ou superior)  
  [Download Node.js](https://nodejs.org/)

- **npm** ou **yarn**: Gerenciador de pacotes  
  npm já vem com o Node.js, mas você pode instalar o [Yarn](https://classic.yarnpkg.com/en/docs/install) se preferir.

- **Git**: Para clonar o repositório  
  [Download Git](https://git-scm.com/)

- **Backend funcionando**: O projeto depende da API do backend. Siga as instruções no repositório [PacocaOficial/rita-back](https://github.com/PacocaOficial/rita-back) para configurá-lo corretamente.

- **Editor de código** (recomendado): [Visual Studio Code](https://code.visualstudio.com/)


## 🛠 Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário  
- **Node.js com TypeScript**: Backend para integração com WhatsApp  
- **Axios**: Cliente HTTP para requisições à API  
- **Tailwind CSS**: Framework de estilo utilitário para CSS  


## 🚀 Como Funciona

1. Cadastre ou entre com sua conta do Paçoca.  
2. Escolha o melhor plano para você.  
3. Cadastre seus agendamentos ou tarefas.  
4. As mensagens serão enviadas automaticamente via WhatsApp.

 
## ⚙️ Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/PacocaOficial/rita-front
   cd rita-front
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o backend, leia a documentação em: https://github.com/PacocaOficial/rita-back

4. Execute o projeto:
   ```sh
   npm run dev
   ```
5. Configure o ambiente, copie o arquivo .env.example para .env 
    ```
    PACOCA_API_URL=http://localhost:8081/api
    RITA_API_URL=http://localhost:8085/api

    ```

6. Configure o WhatsAP
    (Ainda em desenvolvimento)

```
## Licença
Este projeto está licenciado sob a [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.pt_BR).  
Você pode copiar, modificar e redistribuir para fins **não comerciais**, desde que atribua os créditos ao autor original.
```