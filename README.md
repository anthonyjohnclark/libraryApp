# Library App

A setup guide for running the Library App locally, including Docker-based SQL Server setup, backend API, and frontend configuration.

## Table of Contents

1. [Requirements](#requirements)
2. [Setting Up the Local Database](#setting-up-the-local-database)
3. [Configuring the Backend](#configuring-the-backend)
4. [Starting the Backend](#starting-the-backend)
5. [Running the Frontend](#running-the-frontend)
6. [Future Migrations](#future-migrations)

---

### Requirements

- **Docker Desktop** installed
- **.NET SDK** and **dotnet ef tools** installed
- **Node.js** v20.10.0

### Setting Up the Local Database

1. **Start SQL Server in Docker**  
   Run the following Docker command to set up an SQL Server instance:

   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD={yourPassword}" -p 1433:1433 --name LibraryAppServer -d mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Configure Connection String**  
   In `appSettings.Development.json`, update the `DefaultConnection` connection string with your password:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost,1433;User Id=SA;Password={yourPassword};Database=LibraryDb;TrustServerCertificate=True"
   }
   ```

3. **Connect Using a Database Management Tool (Optional)**
   - **Username**: `sa`
   - **Password**: `{yourPassword}`

### Configuring the Backend

1. **Install `dotnet-ef` Tools**  
   Ensure you have `dotnet ef` tools installed to manage database migrations and updates:

   ```bash
   dotnet tool install --global dotnet-ef
   ```

2. **Apply Initial Database Update**  
   Run the following command in the project’s root directory to apply the initial migration to your local database:

   ```bash
   dotnet ef database update
   ```

### Starting the Backend

1. **Run the Backend API**  
   Navigate to the project’s root directory and run the following command to start the backend:

   ```bash
   dotnet run --project Api
   ```

### Running the Frontend

1. **Install Frontend Dependencies**  
   Navigate to the frontend directory and install the necessary packages:

   ```bash
   npm install
   ```

2. **Start the Frontend in Development Mode**  
   Run the frontend with a proxy to the backend API:

   ```bash
   npm start
   ```

3. **Build the Frontend for Production**  
   To compile the frontend and deploy it to `wwwroot/dist`, use:

   ```bash
   npm run build
   ```

### Future Migrations

For any future migrations, run the following command in the root directory:

```bash
dotnet ef migrations add {MigrationName} --project Persistence --startup-project Api
```

## Troubleshooting

- **Docker Container Not Starting**: Ensure Docker Desktop is running, and that the container isn’t already running from a previous session.
- **Database Connection Error**: Verify the connection string in `appSettings.Development.json` matches your local setup, including the correct password.

---
