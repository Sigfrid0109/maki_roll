import os
import shutil

# Carpetas nuevas
os.makedirs("templates", exist_ok=True)
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
os.makedirs("static/img", exist_ok=True)

# Extensiones por tipo
HTML_EXT = ".html"
CSS_EXT = ".css"
JS_EXT = ".js"
IMG_EXT = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico")

def mover_archivos(origen):
    for root, _, files in os.walk(origen):
        for file in files:
            ruta_original = os.path.join(root, file)
            if file.endswith(HTML_EXT):
                shutil.move(ruta_original, os.path.join("templates", file))
            elif file.endswith(CSS_EXT):
                shutil.move(ruta_original, os.path.join("static/css", file))
            elif file.endswith(JS_EXT):
                shutil.move(ruta_original, os.path.join("static/js", file))
            elif file.lower().endswith(IMG_EXT):
                shutil.move(ruta_original, os.path.join("static/img", file))

# Carpetas de origen a procesar
carpetas = [
    "Inicio_de_sesión",
    "Vistas_de_inicio",
    "Menu",
    "Ruleta_vista_general",
    "Graficas_de_venta",
    "Pedidos_adm_consu_edt"
]

for carpeta in carpetas:
    if os.path.exists(carpeta):
        print(f"Moviendo archivos desde {carpeta}...")
        mover_archivos(carpeta)

print("✅ Organización completada. Archivos movidos a /templates y /static/")
