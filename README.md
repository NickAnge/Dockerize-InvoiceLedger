# Dockerize-InvoiceLedger

Invoice Ledger was a project that was build by me(back-end) and my collegue Giorgos Kletsas(front-end) for our internship at CERTH Volos(NitLab). Its about an web application that follows the route of tracks with their invoices.

### Backend Architecture
  - Node.js
  - Express.js 
  - PostgreSQL for storage
  - Jwt for authentication

## Installation and Run 
[Backend-repo](https://github.com/NickAnge/InvoiceLedger-backend)

### Frontend Architecture
  - vue.js framework
  - vuex.js library
  - vuetify 
  
## **Dockerize**
Install Docker and Docker-compose to your pc with your op package manager.

Here is the docker-compose.yml that powers the whole setup.

    version: "3.7"
    services:
    db: #storage
       container_name: Invoice-db
       build:
           context: ./postgres
       environment:
           POSTGRES_PASSWORD: postgres
           POSTGRES_USER: postgres
           POSTGRES_DB: mydb
       volumes:
           - ./postgres/pgdata:/var/lib/postgresql/data
    
    web-backend: #backend
        container_name: Invoice-backend
        build:
            context: ./InvoiceLedger-backend
        ports:
            - "5000:5000"
        depends_on:
            - "db"
        environment:
            DB_HOST: db
        command: ["./wait-for-it.sh", "db:5432", "--", "node", "server.js"]
    web-frontend: #frontend
        container_name: Invoice-frontend
        build:
            context: ./Invoice-Ledger-FrontEnd
        ports:
            - "8080:80"
        depends_on:
            - "web-backend"
  

### Clone
    - Clone this repo to your local machine using : git clone https://github.com/NickAnge/Dockerize-InvoiceLedger.git
    
### Try it
  1. Install [Docker-compose](https://docs.docker.com/compose/install/) to your pc:
  2. docker-compose up 
  3. docker container list
  4. https://localhost:8080
