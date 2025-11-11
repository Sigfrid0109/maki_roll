from flask import Flask, render_template, request, jsonify
import mysql.connector
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

# ----------------------------
# 🔹 CONEXIÓN CON MYSQL
# ----------------------------
def conectar_bd():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="dexter",   # cambia por tu contraseña
        database="menu"
    )

# ----------------------------
# 🔹 RUTAS PRINCIPALES
# ----------------------------
@app.route('/')
def menu():
    conexion = conectar_bd()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute("SELECT * FROM platillos WHERE activo = 1")
    platillos = cursor.fetchall()
    cursor.close()
    conexion.close()
    return render_template('menu.html', platillos=platillos)

@app.route('/menu_admin')
def menu_admin():
    conexion = conectar_bd()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute("SELECT * FROM platillos")
    platillos = cursor.fetchall()
    cursor.close()
    conexion.close()
    return render_template('menu_admin.html', platillos=platillos)

# ----------------------------
# 🔹 API CRUD (ADMIN)
# ----------------------------
@app.route('/api/platillos', methods=['GET'])
def obtener_platillos():
    conexion = conectar_bd()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute("SELECT * FROM platillos")
    datos = cursor.fetchall()
    cursor.close()
    conexion.close()
    return jsonify(datos)

@app.route('/api/platillos', methods=['POST'])
def agregar_platillo():
    data = request.json
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("""
        INSERT INTO platillos (nombre, descripcion, precio, categoria, imagen, activo)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (data['nombre'], data['descripcion'], data['precio'], data['categoria'], data['imagen'], data['activo']))
    conexion.commit()
    cursor.close()
    conexion.close()
    return jsonify({'mensaje': 'Platillo agregado con éxito'})

@app.route('/api/platillos/<int:id>', methods=['PUT'])
def editar_platillo(id):
    data = request.json
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("""
        UPDATE platillos
        SET nombre=%s, descripcion=%s, precio=%s, categoria=%s, imagen=%s, activo=%s
        WHERE id=%s
    """, (data['nombre'], data['descripcion'], data['precio'], data['categoria'], data['imagen'], data['activo'], id))
    conexion.commit()
    cursor.close()
    conexion.close()
    return jsonify({'mensaje': 'Platillo actualizado'})

@app.route('/api/platillos/<int:id>', methods=['DELETE'])
def eliminar_platillo(id):
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM platillos WHERE id=%s", (id,))
    conexion.commit()
    cursor.close()
    conexion.close()
    return jsonify({'mensaje': 'Platillo eliminado'})

# ----------------------------
# 🔹 EJECUTAR SERVIDOR
# ----------------------------
if __name__ == '__main__':
    app.run(debug=True)
