import json
import os
from pathlib import Path
import sqlite3
from sqlite3 import Error
import argparse

parser = argparse.ArgumentParser(
    description="connect and manage sqlite database"
)

# default = default=['Costco','40 Fischer Crossings Dr Sharpsburg, GA 30277 ','01/12/2022',1, 32.09, 1010, 1]

# add receipt meta data ^^
parser.add_argument(
    "--addRec", help="add meta receipt data to database", nargs="*")
# add specific product info
parser.add_argument("--addProd", help="add specific product info to database",
                    nargs="*")
parser.add_argument("print", nargs="*")
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
        conn.execute(
            """INSERT INTO receipts VALUES(?, ?, ?, ?, ?, ?, ?)""", tuple(lst))
        conn.commit()

    def insertReceiptItemData(self, item, conn):
        conn.execute(
            """INSERT INTO receiptsItems VALUES(?, ?, ?, ?)""", tuple(item))
        conn.commit()

    def deleteItemsFromUser(self, conn, userid):
        sql = 'DELETE FROM receipts WHERE userID=?'
        cur = conn.cursor()
        cur.execute(sql, (userid,))
        conn.commit()


mySQL = sql()
dir_path = Path(os.path.dirname(os.path.realpath(__file__)))
dir_path = dir_path / 'uber_hack_app1.sqlite'
sqllite_conn = mySQL.create_connection(dir_path.resolve())
# mySQL.create_tables(sqllite_conn)


def printTable():
    data = []
    name = "receiptsItems"
    exists = sqllite_conn.execute(
        f"SELECT name FROM sqlite_master WHERE type='table' AND name='{name}'")
    if exists.fetchone() is not None:
        for row in sqllite_conn.execute(f"SELECT * FROM {name}"):
            name = row[0]
            price = row[1]
            receiptID = row[2]
            obj = {'name': name, 'price': price, 'receiptID': receiptID}
            data.append(obj)
    json_print = json.dumps(data, indent=2)
    print(json_print)

# example insertion
# mySQL.insertReceiptData(['Walmart','49 Fischer Crossings Dr Sharpsburg, GA 30277 ','01/18/2022',1, 142.09, 1011, 8], sqllite_conn)


# user gives add receipt param
if args.addRec != None:
    args.addRec = preproccess(list(args.addRec))
    # print("here", args.addRec)
    mySQL.insertReceiptData(args.addRec, sqllite_conn)

# user gives add product info param
elif args.addProd:
    a = list(args.addProd)
    while(len(a) < 4):
        a.append(0)
    print(a)
    args.addRec = preproccess(a)
    mySQL.insertReceiptItemData(args.addProd, sqllite_conn)

elif args.print:
    printTable()

# prints table

sqllite_conn.close()
