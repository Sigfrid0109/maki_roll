from flask import Flask, request, jsonify, session
import mysql.connector
from flask_cors import CORS
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True)  # para manejar cookies entre frontend y backend
app.secret_key = "clave_super_segura_123"  # necesaria para usar sesiones

# Conexión a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="dexter",
    database="maki_roll_samr",
    port=3306
)

cursor = db.cursor(dictionary=True)
#registro
@app.route("/registrar", methods=["POST"])
def registrar():
    data = request.json
    nombre = data.get("usuario")
    correo = data.get("correo")
    contraseña = data.get("contraseña")
    rol = data.get("rol", "usuario")  # por defecto 'usuario'

    # Verificamos que el rol sea válido
    if rol not in ["administrador", "editor", "consultor", "usuario"]:
        return jsonify({"exito": False, "error": "Rol no válido"})

    # Hash de la contraseña
    contraseña_hash = hashlib.sha256(contraseña.encode()).hexdigest()

    try:
        cursor.execute("""
            INSERT INTO usuarios (usuario, correo, contraseña, rol)
            VALUES (%s, %s, %s, %s)
        """, (nombre, correo, contraseña_hash, rol))
        db.commit()
        return jsonify({"exito": True})
    except mysql.connector.Error as err:
        return jsonify({"exito": False, "error": str(err)}) 

# 🔹 Inicio de sesión
cursor = db.cursor(dictionary=True)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    usuario = data.get("usuario")
    contraseña = data.get("contraseña")
    contraseña_hash = hashlib.sha256(contraseña.encode()).hexdigest()

    cursor.execute("""
        SELECT id_usuario, rol
        FROM usuarios
        WHERE usuario=%s AND contraseña=%s
    """, (usuario, contraseña_hash))

    result = cursor.fetchone()

    if result:
        rol = result['rol']  # accedemos por clave
        id_usuario = result['id_usuario']
        rol = rol.strip().lower()  # quita espacios y minúsculas
        print("ROL desde DB:", repr(rol))
        return jsonify({
            "exito": True,
            "id_usuario": id_usuario,
            "rol": rol
        })
    else:
        return jsonify({"exito": False, "mensaje": "Usuario o contraseña incorrectos"})
    # Cerrar sesión
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"exito": True, "mensaje": "Sesión cerrada correctamente."})


if __name__ == "__main__":
    app.run(debug=True)
