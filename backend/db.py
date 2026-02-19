import click
import psycopg
from psycopg.rows import dict_row
from flask import current_app, g
# from psycopg_pool import ConnectionPool

# Create connection pool
# pool = ConnectionPool(conninfo=os.environ.get("DB_URL"), kwargs={"row_factory":dict_row}, open=True, min_size=1, max_size=10)

# Change this to a pool
def get_db():
    if 'db' not in g:
        g.db = psycopg.connect(
            current_app.config["DATABASE_URL"],
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
    with db.cursosr() as cur:
        with current_app.open_resource('sql/schema.sql') as f:
            cur.execute(f.read().decode('utf8'))

    db.commit()

def load_dummy_data():
    db = get_db()

    with db.cursor() as cur:
        with current_app.open_resource('sql/dummyData.sql') as f:
            cur.execute(f.read().decode('utf8'))

    db.commit()

# Make something so we dont nuke our database
@click.command('init-db')
def init_db_command():
    init_db()
    click.echo('Initialized the database.')

# Make something so it can only be run on dev
@click.command('load-dummy-data')
def load_dummy_data_command():
    load_dummy_data()
    click.echo('Loading dummy data')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(load_dummy_data_command)
