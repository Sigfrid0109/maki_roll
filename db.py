import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="makiroll-restaurantemaki.k.aivencloud.com",
        user="avnadmin",
        password="AVNS_LdNXgEsqQmTBRwJGAeq",
        database="defaultdb",
        port=25304,
        ssl_disabled=False
    )
