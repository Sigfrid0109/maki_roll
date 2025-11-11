import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="dexter",
        database="maki_roll_samr",
        port=3306
    )
