from flask import Flask, request, jsonify
import mysql.connector
from datetime import datetime
from flask_cors import CORS  #para permitir conexión desde el HTML (puerto 5500)

app = Flask(__name__)
CORS(app)  # habilita peticiones desde otras direcciones, como tu localhost:5500

# --- Configuración de la base de datos ---
conexion = mysql.connector.connect(
    host="localhost",
    user="root",            # tu usuario de MySQL
    password="admin",   # tu contraseña de MySQL
    database="pedido"   # el nombre de tu base de datos
)


@app.route("/enviar_pedido", methods=["POST"])
def enviar_pedido():
    datos = request.get_json()
    
    # Insertar el pedido en la tabla "pedidos"
    cursor = conexion.cursor()
    sql_pedido = "INSERT INTO pedidos (platillo) VALUES (%s)"
    valores_pedido = (datos["platillo"],)
    cursor.execute(sql_pedido, valores_pedido)
    conexion.commit()
    
    # Obtener el ID del pedido recién creado
    id_pedido = cursor.lastrowid

    # --- Insertar los detalles en "pedido_detalles" ---
    sql_detalles = """
        INSERT INTO pedido_detalles (
            pedido_id, nombre_cliente, nombre_usuario, direccion, telefono, codigo_postal,
            tipo_vivienda, referencia, comentarios, fecha_hora
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    valores_detalles = (
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
    )
    cursor.execute(sql_detalles, valores_detalles)
    conexion.commit()

    cursor.close()
    return jsonify({"mensaje": "Pedido guardado exitosamente"})


if __name__ == "__main__":
    app.run(debug=True)
