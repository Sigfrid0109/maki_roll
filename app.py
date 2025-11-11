from flask import Flask, request, jsonify, session
from flask_cors import CORS
import hashlib
from datetime import datetime
from db import get_db

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "clave_super_segura_123"

# ----------------------------
# 🔹 REGISTRO DE USUARIOS
# ----------------------------
@app.route("/registrar", methods=["POST"])
def registrar():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.json
    nombre = data.get("usuario")
    correo = data.get("correo")
    contraseña = data.get("contraseña")
    rol = data.get("rol", "usuario")  # Por defecto será "usuario"

    if not nombre or not correo or not contraseña:
        return jsonify({"exito": False, "error": "Faltan campos requeridos"})

    if rol not in ["administrador", "editor", "consultor", "usuario"]:
        return jsonify({"exito": False, "error": "Rol no válido"})

    contraseña_hash = hashlib.sha256(contraseña.encode()).hexdigest()

    try:
        cursor.execute("""
            INSERT INTO cliente (usuario, correo, contraseña, rol)
            VALUES (%s, %s, %s, %s)
        """, (nombre, correo, contraseña_hash, rol))
        db.commit()
        return jsonify({"exito": True, "mensaje": "Usuario registrado exitosamente"})
    finally:
        cursor.close()
        db.close()

# ----------------------------
# 🔹 LOGIN DE USUARIOS
# ----------------------------
@app.route("/login", methods=["POST"])
def login():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.json
    usuario = data.get("usuario")
    contraseña = data.get("contraseña")

    if not usuario or not contraseña:
        return jsonify({"exito": False, "mensaje": "Faltan datos"})

    contraseña_hash = hashlib.sha256(contraseña.encode()).hexdigest()

    cursor.execute("""
        SELECT id_usuario, usuario, rol
        FROM cliente
        WHERE usuario = %s AND contraseña = %s
    """, (usuario, contraseña_hash))

    result = cursor.fetchone()
    cursor.close()
    db.close()

    if result:
        # Guardar sesión
        session["id_usuario"] = result["id_usuario"]
        session["usuario"] = result["usuario"]
        session["rol"] = result["rol"]

        return jsonify({
            "exito": True,
            "mensaje": "Inicio de sesión exitoso",
            "id_usuario": result["id_usuario"],
            "rol": result["rol"]
        })
    else:
        return jsonify({"exito": False, "mensaje": "Usuario o contraseña incorrectos"})

# ----------------------------
# 🔹 LOGOUT
# ----------------------------
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"exito": True, "mensaje": "Sesión cerrada correctamente"})

# ---------------- RULETA: PREMIOS ----------------
@app.route("/api/premios", methods=["GET"])
def obtener_premios():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id_premio, nombre FROM premios")
    return jsonify(cursor.fetchall())


@app.route("/api/premios", methods=["POST"])
def actualizar_premios():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.json
    # Limpia la tabla
    cursor.execute("DELETE FROM premios")

    # Inserta los premios recibidos
    for premio in data.get("premios", []):
        cursor.execute("INSERT INTO premios (nombre) VALUES (%s)", (premio,))

    db.commit()
    return jsonify({"mensaje": "Premios actualizados correctamente"})


@app.route("/api/resultados", methods=["POST"])
def guardar_resultado():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.json

    id_usuario = data.get("id_usuario")
    id_premio = data.get("id_premio")

    # Validación
    if not id_usuario or not id_premio:
        return jsonify({"exito": False, "error": "Faltan datos: id_usuario o id_premio"}), 400

    try:
        cursor.execute("""
            INSERT INTO resultados (id_usuario, id_premio)
            VALUES (%s, %s)
        """, (id_usuario, id_premio))

        db.commit()
        return jsonify({"exito": True, "mensaje": "Resultado guardado"})

    except Exception as err:
        return jsonify({"exito": False, "error": str(err)}), 500

@app.route("/api/resultados", methods=["GET"])
def obtener_resultados():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.id_resultado, u.usuario, p.nombre AS premio, r.fecha
        FROM resultados r
        LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
        LEFT JOIN premios p ON r.id_premio = p.id_premio
        ORDER BY r.fecha DESC
    """)
    return jsonify(cursor.fetchall())


# ---------------- PEDIDOS (DEL ARCHIVO 3) ----------------
@app.route("/enviar_pedido", methods=["POST"])
def enviar_pedido():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    datos = request.get_json()

    # Insertar pedido base
    cursor.execute("INSERT INTO pedidos (platillo) VALUES (%s)", (datos["platillo"],))
    db.commit()
    id_pedido = cursor.lastrowid

    # Insertar detalles
    cursor.execute("""
        INSERT INTO pedido_detalles (
            id_pedido, nombre_cliente, nombre_usuario, direccion, telefono, codigo_postal,
            tipo_vivienda, referencia, comentarios, fecha_hora
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        id_pedido,
        datos["nombre"],
        datos["nombre"],
        datos["direccion"],
        datos["telefono"],
        datos["codigo_postal"],
        datos["tipo_vivienda"],
        datos["referencia"],
        datos["comentarios"],
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    db.commit()

    return jsonify({"mensaje": "Pedido guardado correctamente"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
