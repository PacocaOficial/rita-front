# RITA  - Frontend
Site de envio de notificação por WhatsApp com sistema de pagamentos e integração com o Paçoca 

## Backend
Baixe o backend em: https://github.com/PacocaOficial/rita-back

## Tecnologias Utilizadas
- **React**: IA utilizada para analisar o conteúdo dos posts
- **Node com TypeScript**: Integração com WhatsApp
- **Axios**: Relaliza as requisições para API
- **Tailwind CSS**: Para estilo

## Como Funciona
1. Cadastre ou entre com sua conta do Paçoca, escolha o melhor plano para você e cadastre seus agendamentos, ou tarefas para serem enviados por WhatsApp.

## Instalação e Execução

1. Clone este repositório:
   ```sh
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
