# Server
Server para la plataforma de movilidad de mascotas.

# Configuración local
  - Descargar dependencias:
  ```sh
    npm install
  ```
  - configurar db :
  ```sh
    - sequelize db:create
    - sequelize db:migrate
    - sequelize db:seed:all
  ```
# Deploy local
  - correr el server
  ```sh
    npm run start:dev
  ```