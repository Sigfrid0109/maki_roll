import os
import mysql.connector

def get_db():
    return mysql.connector.connect(

        host=os.getenv("MYSQL_HOST", "makiroll-restaurantemaki.k.aivencloud.com"),
        user=os.getenv("MYSQL_USER", "avnadmin"),
        password=os.getenv("MYSQL_PASSWORD", ""),  # se leerá desde variables de entorno
        database=os.getenv("MYSQL_DB", "defaultdb"),
        port=int(os.getenv("MYSQL_PORT", 25304)),

        host="makiroll-restaurantemaki.k.aivencloud.com",
        user="avnadmin",
        password="AVNS_LdNXgEsqQmTBRwJGAeq",
        database="defaultdb",
        port=25304,

        ssl_disabled=False
    )

