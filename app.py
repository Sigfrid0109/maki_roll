from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import hashlib
from datetime import datetime
from db import get_db

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "clave_super_segura_123"

# ---------------------------------------------------
# RUTAS DE PÁGINAS HTML
# ---------------------------------------------------
@app.route("/")
def inicio():
    return render_template("inicio_sesion.html")

@app.route("/registro")
def registro():
    return render_template("Registro.html")

@app.route("/vista/<nombre_pagina>")
def vista(nombre_pagina):
    try:
        return render_template(f"{nombre_pagina}.html")
    except:
        return "Página no encontrada", 404

@app.route("/menu")
def vista_menu():
    return render_template("menu.html")

@app.route("/ruleta")
def vista_ruleta():
    return render_template("ruleta.html")

@app.route("/menu_admin")
def vista_menu_admin():
    return render_template("menu_admin.html")

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
# LOGIN / LOGOUT
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
        session.update(result)
        return jsonify({"exito": True, "mensaje": "Inicio de sesión exitoso", **result})
    else:
        return jsonify({"exito": False, "mensaje": "Usuario o contraseña incorrectos"})

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"exito": True, "mensaje": "Sesión cerrada correctamente"})

# ---------------------------------------------------
# RULETA DE PREMIOS
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
        return jsonify({"exito": False, "error": "Faltan datos"}), 400

    cursor.execute("INSERT INTO resultados (id_usuario, id_premio) VALUES (%s, %s)", (id_usuario, id_premio))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"exito": True, "mensaje": "Resultado guardado"})

# ---------------------------------------------------
# API CRUD DE PLATILLOS (MENÚ)
# ---------------------------------------------------
@app.route("/api/platillos", methods=["GET"])
def obtener_platillos():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM item_menu")
    datos = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(datos)

@app.route("/api/platillos", methods=["POST"])
def agregar_platillo():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO item_menu (nombre, descripcion, precio, categoria, imagen, activo)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (data['nombre'], data['descripcion'], data['precio'], data['categoria'], data['imagen'], data['activo']))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({'mensaje': 'Platillo agregado con éxito'})

@app.route("/api/platillos/<int:id>", methods=["PUT"])
def editar_platillo(id):
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE item_menu
        SET nombre=%s, descripcion=%s, precio=%s, categoria=%s, imagen=%s, activo=%s
        WHERE id_item=%s
    """, (data['nombre'], data['descripcion'], data['precio'], data['categoria'], data['imagen'], data['activo'], id))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({'mensaje': 'Platillo actualizado'})

@app.route("/api/platillos/<int:id>", methods=["DELETE"])
def eliminar_platillo(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM item_menu WHERE id_item=%s", (id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({'mensaje': 'Platillo eliminado'})


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
# EJECUCIÓN LOCAL
# ---------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
