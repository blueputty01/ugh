from distutils.util import execute
from multiprocessing import connection
import sqlite3
from sqlite3 import Error
import argparse

parser = argparse.ArgumentParser(
    description= "connect and manage sqlite database"
)

# default = default=['Costco','40 Fischer Crossings Dr Sharpsburg, GA 30277 ','01/12/2022',1, 32.09, 1010, 1]

# add receipt meta data ^^
parser.add_argument("--addRec", help="add meta receipt data to database",nargs="*")
# add specific product info
parser.add_argument("--addProd", help="add specific product info to database", nargs="*", default=['Console Controller', '59.99', 1010, 1]) 
args = parser.parse_args()

# clean up args given
def preproccess(lst):
    for i in range(len(lst)):
        if lst[i].isnumeric():
            if "." in lst[i]:
                lst[i] = float(list[i])
            else:
                lst[i] = int(lst[i])
            
        elif "_" in lst[i]:
            lst[i] = lst[i].replace("_", " ")
    return lst

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

    def insertReceiptData(self, lst, conn):
        # lst = (store, address, date, numItems, total, receiptID, userID)
        conn.execute("""INSERT INTO receipts VALUES(?, ?, ?, ?, ?, ?, ?)""", tuple(lst))
        conn.commit()
    
    def insertReceiptItemData(self, item, conn):
        conn.execute("""INSERT INTO receiptsItems VALUES(?, ?, ?, ?)""", tuple(item))
        conn.commit()

    def deleteItemsFromUser(self,conn, userid):
        sql = 'DELETE FROM receipts WHERE userID=?'
        cur = conn.cursor()
        cur.execute(sql, (userid,))
        conn.commit()

mySQL = sql()
sqllite_conn = mySQL.create_connection('server/src/uber_hack_app1.sqlite') 

# example insertion
# mySQL.insertReceiptData(['Walmart','49 Fischer Crossings Dr Sharpsburg, GA 30277 ','01/18/2022',1, 142.09, 1011, 8], sqllite_conn)

# user gives add receipt param
if args.addRec != None:
    args.addRec = preproccess(list(args.addRec))
    # print("here", args.addRec)
    mySQL.insertReceiptData(args.addRec, sqllite_conn)

# user gives add product info param
elif args.addProd:
    args.addRec = preproccess(list(args.addProd))
    mySQL.insertReceiptItemData(args.addProd, sqllite_conn)

# prints table
# for row in sqllite_conn.execute('SELECT * FROM receiptsItems'):
#     print(row)

sqllite_conn.close()
