# AGENTS.md

## Cursor Cloud specific instructions

### Architecture overview

This is a 3-tier children's residential care management system:

| Layer | Tech | Port | Notes |
|-------|------|------|-------|
| **Frontend** | Static HTML5 + JS ES6 + Tailwind CSS (CDN) | 5500 | No build step. Serve with `python3 -m http.server 5500` from `frontend/` |
| **Backend API** | .NET Framework 4.7.2 (ASP.NET Web API) | 50948 | Original backend requires Windows/IIS. On Linux, use `dev_api_server.py` (Python Flask) |
| **Database** | SQL Server 2022 (Docker) | 1433 | SA password: `Admin123!Pass`. DB name: `ResidenciaDB` |

### Running services on Linux

1. **Start SQL Server** (must be running before the API):
   ```bash
   docker start sqlserver 2>/dev/null || docker run -d --name sqlserver -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Admin123!Pass' -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Start the development API server** (Python Flask, mirrors the .NET API):
   ```bash
   cd /workspace && python3 dev_api_server.py &
   ```

3. **Start the frontend** (static file server):
   ```bash
   cd /workspace/frontend && python3 -m http.server 5500 &
   ```

4. **Access the app**: http://localhost:5500/auth.html  
   **Credentials**: `admin` / `Admin123!`

### Key gotchas

- The original backend targets **.NET Framework 4.7.2** (not .NET Core), so it cannot run natively on Linux. The `dev_api_server.py` is a Python Flask replacement that queries the same SQL Server database.
- The backend can be **built** on Linux using Mono (`xbuild`) for compilation checks, but **cannot be run** with Mono's XSP4 due to a known TLS type-loading bug in Mono 6.8.
- The `db/bd.sql` file is **UTF-16LE** encoded and contains interleaved markdown documentation. To re-initialize the database, convert to UTF-8 and extract from `USE master;` onward: `iconv -f UTF-16LE -t UTF-8 db/bd.sql | sed -n '/^USE master;/,$p' | sed '/^\/\/EJEMPLO/d' > /tmp/bd_clean.sql`
- The frontend's API base URL defaults to `http://localhost:50948` (configured in `frontend/assets/js/utils/http.js`).
- SQL Server CLI tools are at `/opt/mssql-tools18/bin/sqlcmd`.

### Build check (lint equivalent)

```bash
cd /workspace/api && xbuild WebApi/WebApi.csproj /p:Configuration=Debug
```

### Testing

No automated test suite exists in this codebase. Manual testing is done by running the application and navigating the UI.
