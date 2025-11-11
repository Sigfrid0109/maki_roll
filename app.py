from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_cors import CORS
import hashlib
from datetime import datetime
from db import get_db

# ---------------------------------------------------
# CONFIGURACIÓN DE LA APLICACIÓN
# ---------------------------------------------------
app = Flask(
    __name__,
    template_folder="Inicio_de_sesión",  
    static_folder="Inicio_de_sesión"
)
CORS(app, supports_credentials=True)
app.secret_key = "clave_super_segura_123"

# ---------------------------------------------------
# RUTAS PARA ARCHIVOS ESTÁTICOS (CSS, JS, IMG)
# ---------------------------------------------------
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory('Inicio_de_sesión/css', filename)

@app.route('/js/<path:filename>')
def js(filename):
    return send_from_directory('Inicio_de_sesión/js', filename)

@app.route('/img/<path:filename>')
def img(filename):
    return send_from_directory('Inicio_de_sesión/img', filename)

# ---------------------------------------------------
# RUTAS VISUALES PARA PÁGINAS HTML
# ---------------------------------------------------
@app.route("/")
def inicio():
    return render_template("inicio_sesion.html")

@app.route("/registro")
def registro():
    return render_template("Registro.html")

# ---------------------------------------------------
# REGISTRO DE USUARIOS
# ---------------------------------------------------
@app.route("/registrar", methods=["POST"])
def registrar():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.get_json()
    nombre = data.get("usuario")
    correo = data.get("correo")
    contraseña = data.get("contraseña")
    rol = data.get("rol", "usuario")

    if not nombre or not correo or not contraseña:
        return jsonify({"exito": False, "error": "Faltan campos requeridos"}), 400

    if rol not in ["administrador", "editor", "consultor", "usuario"]:
        return jsonify({"exito": False, "error": "Rol no válido"}), 400

    contraseña_hash = hashlib.sha256(contraseña.encode()).hexdigest()

    try:
        cursor.execute("""
            INSERT INTO clientes (usuario, correo, contraseña, rol)
            VALUES (%s, %s, %s, %s)
        """, (nombre, correo, contraseña_hash, rol))
        db.commit()
        return jsonify({"exito": True, "mensaje": "Usuario registrado exitosamente"})
    except Exception as e:
        return jsonify({"exito": False, "error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# ---------------------------------------------------
# LOGIN DE USUARIOS
# ---------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.get_json()
    usuario = data.get("usuario")
    contraseña = data.get("contraseña")

    if not usuario or not contraseña:
        return jsonify({"exito": False, "mensaje": "Faltan datos"}), 400

    contraseña_hash = hashlib.sha256(contraseña.encode()).hexdigest()

    cursor.execute("""
        SELECT id_usuario, usuario, rol
        FROM clientes
        WHERE usuario = %s AND contraseña = %s
    """, (usuario, contraseña_hash))

    result = cursor.fetchone()
    cursor.close()
    db.close()

    if result:
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

# ---------------------------------------------------
# LOGOUT
# ---------------------------------------------------
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"exito": True, "mensaje": "Sesión cerrada correctamente"})

# ---------------------------------------------------
# RULETA: PREMIOS
# ---------------------------------------------------
@app.route("/api/premios", methods=["GET"])
def obtener_premios():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id_premio, nombre FROM premios")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)

@app.route("/api/premios", methods=["POST"])
def actualizar_premios():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    data = request.get_json()

    cursor.execute("DELETE FROM premios")

    for premio in data.get("premios", []):
        cursor.execute("INSERT INTO premios (nombre) VALUES (%s)", (premio,))

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"mensaje": "Premios actualizados correctamente"})

@app.route("/api/resultados", methods=["POST"])
def guardar_resultado():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.get_json()
    id_usuario = data.get("id_usuario")
    id_premio = data.get("id_premio")

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
    finally:
        cursor.close()
        db.close()

@app.route("/api/resultados", methods=["GET"])
def obtener_resultados():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.id_resultado, u.usuario, p.nombre AS premio, r.fecha
        FROM resultados r
        LEFT JOIN clientes u ON r.id_usuario = u.id_usuario
        LEFT JOIN premios p ON r.id_premio = p.id_premio
        ORDER BY r.fecha DESC
    """)
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)

# ---------------------------------------------------
# PEDIDOS
# ---------------------------------------------------
@app.route("/enviar_pedido", methods=["POST"])
def enviar_pedido():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    datos = request.get_json()

    cursor.execute("INSERT INTO pedidos (platillo) VALUES (%s)", (datos["platillo"],))
    db.commit()
    id_pedido = cursor.lastrowid

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

    cursor.close()
    db.close()
    return jsonify({"mensaje": "Pedido guardado correctamente"})

# ---------------------------------------------------
# EJECUCIÓN
# ---------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
