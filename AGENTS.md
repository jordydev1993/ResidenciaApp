# AGENTS.md

## Cursor Cloud specific instructions

### Architecture Overview

This is a 3-tier .NET Framework 4.7.2 web application (originally designed for Windows):

| Service | Technology | Port | Notes |
|---------|-----------|------|-------|
| **Database** | SQL Server 2019 (Docker) | 1433 | Container name: `sqlserver`, SA password: `Str0ngP@ssw0rd!` |
| **Backend API** | ASP.NET Web API on Mono/xsp4 | 50948 | Built with `msbuild`, hosted with `xsp4` |
| **Frontend** | Static HTML/JS/CSS | 5500 | Served via `python3 -m http.server 5500` |

### Starting Services

1. **Docker + SQL Server** (must start first):
   ```bash
   sudo dockerd &>/tmp/dockerd.log &
   sleep 3
   sudo docker start sqlserver  # Container already created with correct config
   ```

2. **Backend API**:
   ```bash
   cd /workspace/api && msbuild WebApi/WebApi.csproj /p:Configuration=Debug
   cd /workspace/api/WebApi && xsp4 --port 50948 --address 0.0.0.0 --nonstop &>/tmp/xsp4.log &
   ```

3. **Frontend**:
   ```bash
   cd /workspace/frontend && python3 -m http.server 5500 --bind 0.0.0.0 &>/tmp/frontend.log &
   ```

### Key Gotchas

- The `db/bd.sql` file is **UTF-16 LE** encoded with emojis. Direct execution via `sqlcmd` requires conversion: strip non-BMP characters, convert to UTF-8, and add `GO` separators before `CREATE VIEW` / `CREATE PROCEDURE` statements. See the setup process for the cleaning script approach.
- The database SQL file is missing several stored procedures the C# code expects (`SP_Usuario_LoginExitoso`, `SP_Usuario_LoginFallido`, `SP_Usuario_Insert`). These must be created manually. Also `SP_Usuario_Autenticar` and `SP_Sesion_Crear` have parameter mismatches with the C# code and must be recreated to match.
- The admin user's default password hash in `bd.sql` uses a different algorithm than the C# `PasswordHelper` class. After DB init, regenerate the hash via `GET /api/Test/HashPassword?password=Admin123!` and update the `Usuario` table.
- The `Web.config` connection string must use SQL Authentication (not Integrated Security) on Linux: `Data Source=localhost,1433;User Id=SA;Password=Str0ngP@ssw0rd!;...`
- CORS is configured to allow origins on ports 5500, 8000, and 3000 (see `WebApiConfig.cs`).
- Default login credentials: `admin` / `Admin123!`

### Testing

- No automated test suite exists in this codebase.
- Manual testing: login at `http://localhost:5500/auth.html`, verify dashboard loads with data at `http://localhost:5500/dashboard.html`.
- API test: `curl -X POST http://localhost:50948/api/Auth/Login -H "Content-Type: application/json" -d '{"Usuario":"admin","Password":"Admin123!"}'`

### Lint / Build

- **Build**: `cd /workspace/api && msbuild WebApi/WebApi.csproj /p:Configuration=Debug`
- No linter configured for the C# backend or the vanilla JS frontend.
