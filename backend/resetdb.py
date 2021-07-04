"""
    This file reset the whole database to its original version
    with one pre-set admin (account name: admin, password: admin)
    and ~45 pre-set products (import from /csv_files/prod.csv)
"""

from database import clear_db
from product import add_prod_from_csv


if __name__ == "__main__":
    clear_db()
    add_prod_from_csv("./csv_files/prod.csv")
