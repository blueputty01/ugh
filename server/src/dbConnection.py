from distutils.util import execute
from multiprocessing import connection
import sqlite3
from sqlite3 import Error
class sql:
    def create_connection(self, path):
        connection = None
        try:
            connection = sqlite3.connect(path)
            print("Connection to SQLite DB successful")
        except Error as e:
            print(f"The error '{e}' occurred")

        return connection

    def create_tables(self, conn):
        conn.execute("""CREATE TABLE users(
                    username TEXT,
                    pswd TEXT,
                    userID INTEGER
                    )""")
        conn.execute("""CREATE TABLE receipts(
                    store TEXT,
                    addres TEXT,
                    dates TEXT,
                    numItems INTEGER,
                    total REAL,
                    receiptID INTEGER,
                    userID INTEGER
                    )""")
        conn.execute("""CREATE TABLE receiptsItems(
                    itemName TEXT,
                    itemPrice REAL,
                    receiptID INTEGER,
                    userID INTEGER
                    )""")
        conn.commit()

    def insertReceiptData(self, store, address, date, numItems, total, receiptID, userID, conn):
        lst = (store, address, date, numItems, total, receiptID, userID)
        conn.execute("""INSERT INTO receipts VALUES(?, ?, ?, ?, ?, ?, ?)""", lst)
        conn.commit()
    
    def insertReceiptItemData(self, item, conn):
        # items = [
        # (item_name_1, price1, receiptid, userid)
        # (item_name_2, price2, receiptid, userid)
        # ]
        conn.execute("""INSERT INTO receiptsItems VALUES(?, ?, ?, ?)""", item)
        conn.commit()

    def deleteItemsFromUser(self,conn, userid):
        sql = 'DELETE FROM receiptsItems WHERE userID=?'
        cur = conn.cursor()
        cur.execute(sql, (userid,))
        conn.commit()




mySQL = sql()
sqllite_conn = mySQL.create_connection('server/src/uber_hack_app1.sqlite') 
# mySQL.create_tables(sqllite_conn)

# example insertion
# mySQL.insertReceiptData('Costco','40 Fischer Crossings Dr Sharpsburg, GA 30277 ','01/12/2022',1, 32.09, 1010, 1, sqllite_conn)
# mySQL.insertReceiptData('Walmart','49 Fischer Crossings Dr Sharpsburg, GA 30277 ','01/18/2022',1, 142.09, 1011, 8, sqllite_conn)

# example data
item_data = [("Halo Infinite", 49.09, 1010, 1), 
             ("Console Controller", 59.99, 1010, 1)]

# for item in item_data:
#     mySQL.insertReceiptItemData(item, sqllite_conn)

# print out items from table
for row in sqllite_conn.execute('SELECT * FROM receipts'):
    print(row)

sqllite_conn.close()
