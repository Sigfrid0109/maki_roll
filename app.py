from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import hashlib
from datetime import datetime
from db import get_db

# ---------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "clave_super_segura_123"

# ---------------------------------------------------
# RUTAS HTML
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

@app.route("/ruleta")
def vista_ruleta():
    return render_template("ruleta.html")

@app.route("/menu_admin")
def vista_menu_admin():
    return render_template("menu_admin.html")

# ---------------------------------------------------
# RUTAS HTML DE CADA ROL
# ---------------------------------------------------
@app.route("/inicio_admin")
def inicio_admin():
    return render_template("admin.html")

@app.route("/inicio_editor")
def inicio_editor():
    return render_template("editor.html")

@app.route("/inicio_consultor")
def inicio_consultor():
    return render_template("consultor.html")

@app.route("/inicio_usuario")
def inicio_usuario():
    return render_template("cliente.html")

@app.route("/graficas_ventas")
def graficas_ventas():
    return render_template("graficas_ventas.html")

@app.route("/ver_pedidos")
def ver_pedidos():
    return render_template("ver_pedidos.html")

@app.route("/resultados")
def resultados():
    return render_template("resultados.html")

@app.route("/ruleta_config")
def ruleta_config():
    return render_template("ruleta_config.html")


# 🟩 Ruta del menú principal (con platillos de la BD)
@app.route("/menu")
def vista_menu():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM item_menu WHERE activo = 1")
    platillos = cursor.fetchall()
    cursor.close()
    db.close()
    print("Platillos cargados:", len(platillos))
    return render_template("menu.html", platillos=platillos)

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
    try:
        cursor.execute("SELECT id_premio, nombre FROM ruleta_premios ORDER BY id_premio ASC")
        data = cursor.fetchall()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()


@app.route("/api/premios", methods=["POST"])
def actualizar_premios():
    db = get_db()
    cursor = db.cursor()
    data = request.get_json()
    try:
        cursor.execute("DELETE FROM ruleta_premios")
        for premio in data.get("premios", []):
            cursor.execute("INSERT INTO ruleta_premios (nombre) VALUES (%s)", (premio,))
        db.commit()
        return jsonify({"mensaje": "Premios actualizados correctamente ✅"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()


# ---------------------------------------------------
# GUARDAR RESULTADO DE LA RULETA 
# ---------------------------------------------------
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
            INSERT INTO ruleta_giros (id_usuario, id_premio, fecha)
            VALUES (%s, %s, NOW())
        """, (id_usuario, id_premio))
        db.commit()
        return jsonify({"exito": True, "mensaje": "Resultado guardado"}), 201
    except Exception as e:
        db.rollback()
        print("❌ Error al guardar resultado:", e)
        return jsonify({"exito": False, "error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/api/resultados", methods=["GET"])
def obtener_resultados():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                g.id_resultado,
                c.usuario AS usuario,
                p.nombre AS premio,
                g.fecha
            FROM ruleta_giros g
            LEFT JOIN clientes c ON g.id_usuario = c.id_usuario
            LEFT JOIN ruleta_premios p ON g.id_premio = p.id_premio
            ORDER BY g.fecha DESC
        """)
        data = cursor.fetchall()
        return jsonify(data)
    except Exception as e:
        print("Error en obtener_resultados:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()





# ---------------------------------------------------
# CRUD DE PLATILLOS (MENÚ)
# ---------------------------------------------------
@app.route("/api/platillos", methods=["GET"])
def obtener_platillos():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM item_menu")
        datos = cursor.fetchall()
        return jsonify(datos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/api/platillos", methods=["POST"])
def agregar_platillo():
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO item_menu (nombre, descripcion, precio, categoria, imagen, activo)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data.get("nombre"),
            data.get("descripcion"),
            data.get("precio"),
            data.get("categoria"),
            data.get("imagen"),
            data.get("activo", True)
        ))
        db.commit()
        return jsonify({"mensaje": "Platillo agregado con éxito"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/api/platillos/<int:id>", methods=["PUT"])
def editar_platillo(id):
    data = request.get_json()
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            UPDATE item_menu
            SET nombre=%s, descripcion=%s, precio=%s, categoria=%s, imagen=%s, activo=%s
            WHERE id_item=%s
        """, (
            data.get("nombre"),
            data.get("descripcion"),
            data.get("precio"),
            data.get("categoria"),
            data.get("imagen"),
            data.get("activo", True),
            id
        ))
        db.commit()
        return jsonify({"mensaje": "Platillo actualizado correctamente"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/api/platillos/<int:id>", methods=["DELETE"])
def eliminar_platillo(id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM item_menu WHERE id_item = %s", (id,))
        db.commit()
        return jsonify({"mensaje": "Platillo eliminado correctamente"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

# ---------------------------------------------------
# PEDIDOS
# ---------------------------------------------------
from datetime import datetime
from flask import jsonify, request
from db import get_db

@app.route("/enviar_pedido", methods=["POST"])
def enviar_pedido():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    datos = request.get_json()

    # ---------------------------------------------
    # Obtener el platillo (compatible con carrito o pedido simple)
    # ---------------------------------------------
    if "platillo" in datos:
        platillo = datos["platillo"]
    elif "productos" in datos and len(datos["productos"]) > 0:
        # Si el pedido viene del carrito, tomamos el primer producto como principal
        platillo = datos["productos"][0].get("producto", "Sin especificar")
    else:
        platillo = "Sin especificar"

    # ---------------------------------------------
    # Insertar en la tabla 'pedidos'
    # ---------------------------------------------
    try:
        cursor.execute("INSERT INTO pedidos (platillo) VALUES (%s)", (platillo,))
        db.commit()
        id_pedido = cursor.lastrowid
    except Exception as e:
        print("❌ Error al insertar en pedidos:", e)
        db.rollback()
        cursor.close()
        db.close()
        return jsonify({"error": "Error al guardar el pedido"}), 500

    # ---------------------------------------------
    # Insertar en la tabla 'pedido_detalles'
    # ---------------------------------------------
    try:
        cursor.execute("""
            INSERT INTO pedido_detalles (
                id_pedido, nombre_cliente, nombre_usuario, direccion, telefono, codigo_postal,
                tipo_vivienda, referencia, comentarios, fecha_hora
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            id_pedido,
            datos.get("nombre"),
            datos.get("usuario"),
            datos.get("direccion"),
            datos.get("telefono"),
            datos.get("codigo_postal"),
            datos.get("tipo_vivienda"),
            datos.get("referencia"),
            datos.get("comentarios"),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        db.commit()
    except Exception as e:
        print("❌ Error al insertar en pedido_detalles:", e)
        db.rollback()
        cursor.close()
        db.close()
        return jsonify({"error": "Error al guardar detalles del pedido"}), 500

    # Cerrar conexión correctamente
    cursor.close()
    db.close()

    return jsonify({"mensaje": "✅ Pedido guardado correctamente"})


# ---------------------------------------------------
# OBTENER PEDIDOS
# ---------------------------------------------------
@app.route("/obtener_pedidos", methods=["GET"])
def obtener_pedidos():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.id_pedido,
            pd.nombre_cliente,
            pd.nombre_usuario,
            p.platillo,
            pd.direccion,
            pd.telefono,
            pd.codigo_postal,
            pd.tipo_vivienda,
            pd.referencia,
            pd.comentarios,
            pd.fecha_hora
        FROM pedidos p
        INNER JOIN pedido_detalles pd ON p.id_pedido = pd.id_pedido
        ORDER BY pd.fecha_hora DESC
    """)

    datos = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(datos)


# ---------------------------------------------------
# EJECUCIÓN LOCAL
# ---------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)

