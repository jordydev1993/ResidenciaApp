"""
Development API server for Linux environments.
Mirrors the .NET Framework Web API endpoints using Flask + pyodbc.
This is NOT for production use - only for local development when
the original .NET backend cannot run (e.g., Linux/macOS).
"""
import hashlib
import hmac
import os
import base64
import datetime
import json
import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

CONN_STR = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=ResidenciaDB;"
    "UID=SA;"
    "PWD=Admin123!Pass;"
    "TrustServerCertificate=yes;"
)


def get_conn():
    return pyodbc.connect(CONN_STR)


def rows_to_list(cursor):
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    result = []
    for row in rows:
        d = {}
        for i, col in enumerate(columns):
            val = row[i]
            if isinstance(val, (datetime.datetime, datetime.date)):
                d[col] = val.isoformat()
            else:
                d[col] = val
        result.append(d)
    return result


def serialize(obj):
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    return obj


# ---------- Password helpers (PBKDF2 compatible with C# PasswordHelper) ----------

def verify_password(password, stored_hash):
    """Verify password against PBKDF2 hash. Supports salt.hash (C# PasswordHelper) and iterations:salt:hash formats."""
    try:
        if "." in stored_hash and ":" not in stored_hash:
            parts = stored_hash.split(".")
            if len(parts) != 2:
                return False
            salt = base64.b64decode(parts[0])
            stored = base64.b64decode(parts[1])
            derived = hashlib.pbkdf2_hmac("sha1", password.encode("utf-8"), salt, 10000, dklen=len(stored))
            return hmac.compare_digest(derived, stored)
        else:
            parts = stored_hash.split(":")
            if len(parts) != 3:
                return False
            iterations = int(parts[0])
            salt = base64.b64decode(parts[1])
            stored = base64.b64decode(parts[2])
            derived = hashlib.pbkdf2_hmac("sha1", password.encode("utf-8"), salt, iterations, dklen=len(stored))
            return hmac.compare_digest(derived, stored)
    except Exception:
        return False


def hash_password(password):
    """Generate PBKDF2 hash compatible with C# PasswordHelper (salt.hash format, 32-byte salt/hash, 10000 iterations)."""
    salt = os.urandom(32)
    derived = hashlib.pbkdf2_hmac("sha1", password.encode("utf-8"), salt, 10000, dklen=32)
    salt_b64 = base64.b64encode(salt).decode()
    hash_b64 = base64.b64encode(derived).decode()
    return f"{salt_b64}.{hash_b64}"


def generate_token():
    return base64.b64encode(os.urandom(64)).decode()


# ---------- Dashboard ----------

@app.route("/api/Dashboard/Stats", methods=["GET"])
def dashboard_stats():
    try:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) FROM dbo.Legajo")
        total_legajos = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM dbo.Alerta")
        total_alertas = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM dbo.Alerta A
            INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
            WHERE A.FechaVencimiento < CAST(GETDATE() AS DATE)
              AND EA.Nombre NOT IN ('Completada', 'Finalizada')
        """)
        alertas_vencidas = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM dbo.Alerta A
            INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
            WHERE A.FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE))
              AND EA.Nombre NOT IN ('Completada', 'Finalizada')
        """)
        alertas_proximas = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM dbo.Alerta A
            INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
            WHERE EA.Nombre IN ('Completada', 'Finalizada')
        """)
        alertas_completadas = cur.fetchone()[0]

        cur.execute("""
            SELECT EA.Nombre AS Estado, COUNT(*) AS Total
            FROM dbo.Alerta A INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
            GROUP BY EA.Nombre ORDER BY Total DESC
        """)
        por_estado = [{"label": r[0], "value": r[1]} for r in cur.fetchall()]

        cur.execute("""
            SELECT P.Nombre AS Prioridad, COUNT(*) AS Total
            FROM dbo.Alerta A INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
            GROUP BY P.Nombre ORDER BY Total DESC
        """)
        por_prioridad = [{"label": r[0], "value": r[1]} for r in cur.fetchall()]

        conn.close()
        return jsonify({
            "success": True,
            "kpis": {
                "totalLegajos": total_legajos,
                "totalAlertas": total_alertas,
                "alertasVencidas": alertas_vencidas,
                "alertasProximas": alertas_proximas,
                "alertasCompletadas": alertas_completadas,
            },
            "charts": {
                "porEstado": por_estado,
                "porPrioridad": por_prioridad,
            },
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- Alerta ----------

@app.route("/api/Alerta", methods=["GET"])
def alerta_list():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Alerta_GetAll")
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Alerta/<int:aid>", methods=["GET"])
def alerta_get(aid):
    return jsonify("Implementar SP_Alerta_GetById si es necesario")


@app.route("/api/Alerta", methods=["POST"])
def alerta_create():
    try:
        d = request.get_json(force=True)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "EXEC SP_Alerta_Insert @TipoId=?, @PrioridadId=?, @EstadoId=?, @LegajoId=?, @Descripcion=?, @FechaVencimiento=?",
            d.get("TipoId") or d.get("tipoId"),
            d.get("PrioridadId") or d.get("prioridadId"),
            d.get("EstadoId") or d.get("estadoId"),
            d.get("LegajoId") or d.get("legajoId"),
            d.get("Descripcion") or d.get("descripcion"),
            d.get("FechaVencimiento") or d.get("fechaVencimiento"),
        )
        row = cur.fetchone()
        new_id = row[0] if row else 0
        conn.commit()
        conn.close()
        return jsonify({"Id": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Alerta/<int:aid>", methods=["PUT"])
def alerta_update(aid):
    try:
        d = request.get_json(force=True)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "EXEC SP_Alerta_Update @Id=?, @EstadoId=?, @PrioridadId=?, @Descripcion=?, @FechaVencimiento=?",
            aid,
            d.get("EstadoId") or d.get("estadoId"),
            d.get("PrioridadId") or d.get("prioridadId"),
            d.get("Descripcion") or d.get("descripcion"),
            d.get("FechaVencimiento") or d.get("fechaVencimiento"),
        )
        conn.commit()
        conn.close()
        return jsonify({"Id": aid})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Alerta/<int:aid>/completar", methods=["POST"])
def alerta_completar(aid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Alerta_Update @Id=?, @EstadoId=3", aid)
        conn.commit()
        conn.close()
        return jsonify({"Id": aid, "EstadoId": 3})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Alerta/<int:aid>", methods=["DELETE"])
def alerta_delete(aid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Alerta_Delete @Id=?", aid)
        conn.commit()
        conn.close()
        return jsonify("Alerta eliminada correctamente")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- Legajo ----------

@app.route("/api/Legajo", methods=["GET"])
def legajo_list():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Legajo_GetAll")
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Legajo/<int:lid>", methods=["GET"])
def legajo_get(lid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Legajo_GetById @Id=?", lid)
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data[0] if data else {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Legajo", methods=["POST"])
def legajo_create():
    try:
        d = request.get_json(force=True)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "EXEC SP_Legajo_Insert @NinoId=?, @TutorId=?, @EstadoId=?, @FechaIngreso=?, @Observaciones=?",
            d.get("NinoId") or d.get("ninoId"),
            d.get("TutorId") or d.get("tutorId"),
            d.get("EstadoId") or d.get("estadoId"),
            d.get("FechaIngreso") or d.get("fechaIngreso"),
            d.get("Observaciones") or d.get("observaciones"),
        )
        row = cur.fetchone()
        new_id = row[0] if row else 0
        conn.commit()
        conn.close()
        return jsonify({"Id": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Legajo/<int:lid>", methods=["PUT"])
def legajo_update(lid):
    try:
        d = request.get_json(force=True)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "EXEC SP_Legajo_Update @Id=?, @EstadoId=?, @TutorId=?, @Observaciones=?",
            lid,
            d.get("EstadoId") or d.get("estadoId"),
            d.get("TutorId") or d.get("tutorId"),
            d.get("Observaciones") or d.get("observaciones"),
        )
        conn.commit()
        conn.close()
        return jsonify({"Id": lid})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Legajo/<int:lid>", methods=["DELETE"])
def legajo_delete(lid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Legajo_Delete @Id=?", lid)
        conn.commit()
        conn.close()
        return jsonify({"message": f"Legajo con Id={lid} eliminado correctamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- Nino ----------

@app.route("/api/Nino", methods=["GET"])
def nino_list():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT N.Id, N.Dni, N.Apellido, N.Nombre, N.FechaNacimiento,
                   N.FechaCreacion, N.FechaModificacion, E.Nombre AS Estado, L.Id AS LegajoId
            FROM dbo.Nino N
            LEFT JOIN dbo.Legajo L ON L.NinoId = N.Id
            LEFT JOIN dbo.Estado E ON E.Id = L.EstadoId
            ORDER BY N.Apellido, N.Nombre
        """)
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Nino/<nid>", methods=["GET"])
def nino_get(nid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT TOP 1 Id, Dni, Apellido, Nombre, FechaNacimiento FROM dbo.Nino WHERE Dni = ?", nid)
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data[0] if data else {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Nino", methods=["POST"])
def nino_create():
    try:
        d = request.get_json(force=True)
        nid = d.get("Id") or d.get("id") or 0
        conn = get_conn()
        cur = conn.cursor()
        if nid and int(nid) > 0:
            cur.execute(
                """UPDATE dbo.Nino SET Dni=?, Nombre=?, Apellido=?, FechaNacimiento=?,
                   FechaModificacion=SYSDATETIME() WHERE Id=?""",
                d.get("DNI") or d.get("Dni") or d.get("dni"),
                d.get("Nombre") or d.get("nombre"),
                d.get("Apellido") or d.get("apellido"),
                d.get("FechaNacimiento") or d.get("fechaNacimiento"),
                int(nid),
            )
            conn.commit()
            conn.close()
            return jsonify(d)
        else:
            dni = d.get("DNI") or d.get("Dni") or d.get("dni")
            cur.execute(
                """INSERT INTO dbo.Nino (Dni, Apellido, Nombre, FechaNacimiento, UsuarioCreacion)
                   VALUES (?, ?, ?, ?, 'admin'); SELECT CAST(SCOPE_IDENTITY() AS INT);""",
                dni,
                d.get("Apellido") or d.get("apellido"),
                d.get("Nombre") or d.get("nombre"),
                d.get("FechaNacimiento") or d.get("fechaNacimiento"),
            )
            row = cur.fetchone()
            new_id = row[0] if row else 0
            conn.commit()
            conn.close()
            result = dict(d)
            result["Id"] = new_id
            return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Nino/<nid>", methods=["DELETE"])
def nino_delete(nid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM dbo.Nino WHERE Dni = ?", nid)
        conn.commit()
        conn.close()
        return jsonify(f"Nino {nid} eliminado")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- Tutor ----------

@app.route("/api/Tutor", methods=["GET"])
def tutor_list():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT Id, Nombre, Apellido, Telefono, Email FROM dbo.Tutor ORDER BY Apellido, Nombre")
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Tutor", methods=["POST"])
def tutor_create():
    try:
        d = request.get_json(force=True)
        tid = d.get("Id") or d.get("id") or 0
        conn = get_conn()
        cur = conn.cursor()
        if tid and int(tid) > 0:
            cur.execute(
                """UPDATE dbo.Tutor SET Nombre=?, Apellido=?, Telefono=?, Email=?,
                   FechaModificacion=SYSDATETIME() WHERE Id=?""",
                d.get("Nombre") or d.get("nombre"),
                d.get("Apellido") or d.get("apellido"),
                d.get("Telefono") or d.get("telefono"),
                d.get("Email") or d.get("email"),
                int(tid),
            )
            conn.commit()
            conn.close()
            return jsonify(d)
        else:
            cur.execute(
                """INSERT INTO dbo.Tutor (Nombre, Apellido, Telefono, Email, UsuarioCreacion)
                   VALUES (?, ?, ?, ?, 'admin'); SELECT CAST(SCOPE_IDENTITY() AS INT);""",
                d.get("Nombre") or d.get("nombre"),
                d.get("Apellido") or d.get("apellido"),
                d.get("Telefono") or d.get("telefono"),
                d.get("Email") or d.get("email"),
            )
            row = cur.fetchone()
            new_id = row[0] if row else 0
            conn.commit()
            conn.close()
            result = dict(d)
            result["Id"] = new_id
            return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Tutor/<int:tid>", methods=["PUT"])
def tutor_update(tid):
    try:
        d = request.get_json(force=True)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """UPDATE dbo.Tutor SET Nombre=?, Apellido=?, Telefono=?, Email=?,
               FechaModificacion=SYSDATETIME() WHERE Id=?""",
            d.get("Nombre") or d.get("nombre"),
            d.get("Apellido") or d.get("apellido"),
            d.get("Telefono") or d.get("telefono"),
            d.get("Email") or d.get("email"),
            tid,
        )
        conn.commit()
        conn.close()
        return jsonify(d)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Tutor/<int:tid>", methods=["DELETE"])
def tutor_delete(tid):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM dbo.Tutor WHERE Id = ?", tid)
        conn.commit()
        conn.close()
        return jsonify(f"Tutor {tid} eliminado")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- Catalog endpoints: Estado, TipoAlerta, Prioridad, EstadoAlerta ----------

def _catalog_routes(table, columns, order_by="Nombre"):
    def _list():
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT {columns} FROM dbo.{table} ORDER BY {order_by}")
        data = rows_to_list(cur)
        conn.close()
        return jsonify(data)

    return _list


@app.route("/api/Estado", methods=["GET"])
def estado_list():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT Id, Nombre, Descripcion FROM dbo.Estado ORDER BY Nombre")
    data = rows_to_list(cur)
    conn.close()
    return jsonify(data)


@app.route("/api/Estado", methods=["POST"])
def estado_create():
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO dbo.Estado (Nombre, Descripcion) VALUES (?, ?); SELECT CAST(SCOPE_IDENTITY() AS INT);",
        d.get("Nombre") or d.get("nombre"),
        d.get("Descripcion") or d.get("descripcion"),
    )
    row = cur.fetchone()
    d["Id"] = row[0] if row else 0
    conn.commit()
    conn.close()
    return jsonify(d), 201


@app.route("/api/Estado/<int:eid>", methods=["PUT"])
def estado_update(eid):
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("UPDATE dbo.Estado SET Nombre=?, Descripcion=? WHERE Id=?",
                d.get("Nombre") or d.get("nombre"), d.get("Descripcion") or d.get("descripcion"), eid)
    conn.commit()
    conn.close()
    d["Id"] = eid
    return jsonify(d)


@app.route("/api/Estado/<int:eid>", methods=["DELETE"])
def estado_delete(eid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM dbo.Estado WHERE Id=?", eid)
    conn.commit()
    conn.close()
    return jsonify(f"Estado {eid} eliminado")


@app.route("/api/TipoAlerta", methods=["GET"])
def tipo_alerta_list():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT Id, Nombre, Descripcion FROM dbo.TipoAlerta ORDER BY Nombre")
    data = rows_to_list(cur)
    conn.close()
    return jsonify(data)


@app.route("/api/TipoAlerta", methods=["POST"])
def tipo_alerta_create():
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO dbo.TipoAlerta (Nombre, Descripcion) VALUES (?, ?); SELECT CAST(SCOPE_IDENTITY() AS INT);",
        d.get("Nombre") or d.get("nombre"), d.get("Descripcion") or d.get("descripcion"))
    row = cur.fetchone()
    d["Id"] = row[0] if row else 0
    conn.commit()
    conn.close()
    return jsonify(d), 201


@app.route("/api/TipoAlerta/<int:tid>", methods=["PUT"])
def tipo_alerta_update(tid):
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("UPDATE dbo.TipoAlerta SET Nombre=?, Descripcion=? WHERE Id=?",
                d.get("Nombre") or d.get("nombre"), d.get("Descripcion") or d.get("descripcion"), tid)
    conn.commit()
    conn.close()
    d["Id"] = tid
    return jsonify(d)


@app.route("/api/TipoAlerta/<int:tid>", methods=["DELETE"])
def tipo_alerta_delete(tid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM dbo.TipoAlerta WHERE Id=?", tid)
    conn.commit()
    conn.close()
    return jsonify(f"TipoAlerta {tid} eliminado")


@app.route("/api/Prioridad", methods=["GET"])
def prioridad_list():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT Id, Nombre, Color, Orden FROM dbo.Prioridad ORDER BY Orden, Nombre")
    data = rows_to_list(cur)
    conn.close()
    return jsonify(data)


@app.route("/api/Prioridad", methods=["POST"])
def prioridad_create():
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO dbo.Prioridad (Nombre, Color, Orden) VALUES (?, ?, ?); SELECT CAST(SCOPE_IDENTITY() AS INT);",
        d.get("Nombre") or d.get("nombre"), d.get("Color") or d.get("color"), d.get("Orden") or d.get("orden"))
    row = cur.fetchone()
    d["Id"] = row[0] if row else 0
    conn.commit()
    conn.close()
    return jsonify(d), 201


@app.route("/api/Prioridad/<int:pid>", methods=["PUT"])
def prioridad_update(pid):
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("UPDATE dbo.Prioridad SET Nombre=?, Color=?, Orden=? WHERE Id=?",
                d.get("Nombre") or d.get("nombre"), d.get("Color") or d.get("color"),
                d.get("Orden") or d.get("orden"), pid)
    conn.commit()
    conn.close()
    d["Id"] = pid
    return jsonify(d)


@app.route("/api/Prioridad/<int:pid>", methods=["DELETE"])
def prioridad_delete(pid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM dbo.Prioridad WHERE Id=?", pid)
    conn.commit()
    conn.close()
    return jsonify(f"Prioridad {pid} eliminada")


@app.route("/api/EstadoAlerta", methods=["GET"])
def estado_alerta_list():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT Id, Nombre, Descripcion FROM dbo.EstadoAlerta ORDER BY Nombre")
    data = rows_to_list(cur)
    conn.close()
    return jsonify(data)


@app.route("/api/EstadoAlerta", methods=["POST"])
def estado_alerta_create():
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO dbo.EstadoAlerta (Nombre, Descripcion) VALUES (?, ?); SELECT CAST(SCOPE_IDENTITY() AS INT);",
        d.get("Nombre") or d.get("nombre"), d.get("Descripcion") or d.get("descripcion"))
    row = cur.fetchone()
    d["Id"] = row[0] if row else 0
    conn.commit()
    conn.close()
    return jsonify(d), 201


@app.route("/api/EstadoAlerta/<int:eid>", methods=["PUT"])
def estado_alerta_update(eid):
    d = request.get_json(force=True)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("UPDATE dbo.EstadoAlerta SET Nombre=?, Descripcion=? WHERE Id=?",
                d.get("Nombre") or d.get("nombre"), d.get("Descripcion") or d.get("descripcion"), eid)
    conn.commit()
    conn.close()
    d["Id"] = eid
    return jsonify(d)


@app.route("/api/EstadoAlerta/<int:eid>", methods=["DELETE"])
def estado_alerta_delete(eid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM dbo.EstadoAlerta WHERE Id=?", eid)
    conn.commit()
    conn.close()
    return jsonify(f"EstadoAlerta {eid} eliminado")


# ---------- Auth ----------

@app.route("/api/Auth/Login", methods=["POST"])
def auth_login():
    try:
        d = request.get_json(force=True)
        usuario = d.get("Usuario") or d.get("usuario") or ""
        password = d.get("Password") or d.get("password") or ""

        if not usuario or not password:
            return jsonify({"success": False, "error": "Usuario y contrasena son requeridos"}), 400

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT u.Id, u.Usuario, u.PasswordHash, u.Email, u.NombreCompleto,
                   u.RolId, r.Nombre AS RolNombre, r.Nivel AS RolNivel,
                   u.Activo, u.IntentosLoginFallidos
            FROM dbo.Usuario u
            INNER JOIN dbo.Rol r ON r.Id = u.RolId
            WHERE u.Usuario = ?
        """, usuario)
        row = cur.fetchone()

        if not row:
            conn.close()
            return jsonify({"success": False, "error": "Usuario o contrasena incorrectos"}), 401

        uid, uname, pw_hash, email, nombre, rol_id, rol_nombre, rol_nivel, activo, intentos = row

        if not activo:
            conn.close()
            return jsonify({"success": False, "error": "Usuario bloqueado"}), 403

        if not verify_password(password, pw_hash):
            cur.execute("UPDATE dbo.Usuario SET IntentosLoginFallidos = IntentosLoginFallidos + 1 WHERE Id = ?", uid)
            conn.commit()
            conn.close()
            return jsonify({"success": False, "error": "Usuario o contrasena incorrectos"}), 401

        cur.execute("UPDATE dbo.Usuario SET IntentosLoginFallidos = 0, UltimoAcceso = SYSDATETIME() WHERE Id = ?", uid)
        token = generate_token()
        cur.execute("EXEC SP_Sesion_Crear @UsuarioId=?, @Token=?, @DuracionMinutos=30", uid, token)
        conn.commit()
        conn.close()

        return jsonify({
            "Success": True,
            "Token": token,
            "Usuario": {
                "Id": uid,
                "Usuario": uname,
                "Email": email,
                "NombreCompleto": nombre,
                "Rol": rol_nombre,
                "RolNivel": rol_nivel,
            },
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/Auth/Logout", methods=["POST"])
def auth_logout():
    try:
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer") else ""
        if not token:
            return jsonify({"success": False, "error": "Token no proporcionado"}), 400
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Sesion_Cerrar @Token=?", token)
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Sesion cerrada correctamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/Auth/ValidateToken", methods=["GET"])
def auth_validate():
    try:
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "") if auth.startswith("Bearer") else ""
        if not token:
            return jsonify({"valid": False, "error": "Token no proporcionado"}), 401
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("EXEC SP_Sesion_Validar @Token=?", token)
        rows = cur.fetchall()
        cols = [c[0] for c in cur.description] if cur.description else []
        conn.close()
        if not rows or (cols and "Estado" in cols and rows[0][cols.index("Estado")] == "invalid"):
            return jsonify({"valid": False, "error": "Token invalido o expirado"}), 401
        r = rows[0]
        col_map = {c: i for i, c in enumerate(cols)}
        return jsonify({
            "valid": True,
            "usuario": {
                "id": r[col_map.get("UsuarioId", 0)],
                "usuario": r[col_map.get("Usuario", 1)],
                "nombreCompleto": r[col_map.get("NombreCompleto", 3)],
                "email": r[col_map.get("Email", 2)],
                "rol": r[col_map.get("RolNombre", 5)],
                "rolNivel": r[col_map.get("RolNivel", 6)],
            },
        })
    except Exception as e:
        return jsonify({"valid": False, "error": str(e)}), 500


@app.route("/api/Auth/Register", methods=["POST"])
def auth_register():
    try:
        d = request.get_json(force=True)
        usuario = d.get("Usuario") or d.get("usuario")
        password = d.get("Password") or d.get("password")
        email = d.get("Email") or d.get("email")
        nombre = d.get("NombreCompleto") or d.get("nombreCompleto")
        rol_id = d.get("RolId") or d.get("rolId") or 2

        pw_hash = hash_password(password)
        salt = pw_hash.split(":")[1]

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO dbo.Usuario (Usuario, PasswordHash, Salt, Email, NombreCompleto, RolId, Activo, IntentosLoginFallidos)
            VALUES (?, ?, ?, ?, ?, ?, 1, 0);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
        """, usuario, pw_hash, salt, email, nombre, rol_id)
        row = cur.fetchone()
        new_id = row[0] if row else 0
        conn.commit()
        conn.close()
        return jsonify({"success": True, "id": new_id, "message": "Usuario registrado correctamente"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ---------- Test ----------

@app.route("/api/Test/HashPassword", methods=["GET"])
def test_hash():
    pw = request.args.get("password", "")
    h = hash_password(pw)
    return jsonify({"success": True, "password": pw, "hash": h})


if __name__ == "__main__":
    print("Starting development API server on http://localhost:50948")
    print("Database: SQL Server on localhost:1433 (ResidenciaDB)")
    app.run(host="0.0.0.0", port=50948, debug=False)
