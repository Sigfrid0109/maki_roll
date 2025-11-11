from flask import Flask, request, jsonify, render_template
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Conexión a MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="dexter",
    database="restaurante_maki_roll",
    port=3306
)
cursor = db.cursor(dictionary=True)

# --- Obtener lista de premios ---
@app.route("/api/premios", methods=["GET"])
def obtener_premios():
    cursor.execute("SELECT * FROM premios")
    return jsonify(cursor.fetchall())

# --- Actualizar premios ---
@app.route("/api/premios", methods=["POST"])
def actualizar_premios():
    data = request.json
    cursor.execute("DELETE FROM premios")
    for premio in data.get("premios", []):
        cursor.execute("INSERT INTO premios (nombre) VALUES (%s)", (premio,))
    db.commit()
    return jsonify({"mensaje": "Premios actualizados correctamente"})

# --- Guardar resultado de giro ---
@app.route("/api/resultado", methods=["POST"])
def guardar_resultado():
    data = request.json
    usuario = data.get("usuario", "Invitado")
    premio = data.get("premio")
    cursor.execute("INSERT INTO resultados (usuario, premio) VALUES (%s, %s)", (usuario, premio))
    db.commit()
    return jsonify({"mensaje": "Resultado guardado"})

# --- Obtener resultados ---
@app.route("/api/resultados", methods=["GET"])
def obtener_resultados():
    cursor.execute("SELECT * FROM resultados ORDER BY fecha DESC")
    return jsonify(cursor.fetchall())

if __name__ == "__main__":
    app.run(debug=True, port=5000)
