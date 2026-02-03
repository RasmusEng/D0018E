import click
import psycopg 
import os
from dotenv import load_dotenv
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from flask import current_app, g

load_dotenv()

# Create connection pool
pool = ConnectionPool(conninfo=os.environ.get("DB_URL"), kwargs={"row_factory":dict_row}, open=True, min_size=1, max_size=10)

# Change this to a pool
def get_db():
    if 'db' not in g:
        g.db = psycopg.connect(
            conninfo=os.environ.get("DB_URL"),
            row_factory=dict_row
        )
    return g.db

# Change this to a pool
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
        
def init_db():
    db = get_db()
    cur = db.cursor()

    with current_app.open_resource('schema.sql') as f:
        cur.execute(f.read().decode('utf8'))

    db.commit()

def load_dummy_data():
    print(232)

# Make something so we dont nuke our database
@click.command('init-db')
def init_db_command():
    init_db()
    click.echo('Initialized the database.')

# Make something so it can only be run on dev
@click.command('load-dummy-data')
def load_dummy_data_command():
    load_dummy_data()

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(load_dummy_data_command)
    

    
