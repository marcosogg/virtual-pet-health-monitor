# models.py

```py

```

# config.py

```py

```

# app.py

```py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta, timezone
import paho.mqtt.client as mqtt
import json
import threading
import time

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pet_health.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    species = db.Column(db.String(50), nullable=False)
    readings = db.relationship('HealthReading', backref='pet', lazy=True)

class HealthReading(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    heart_rate = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    activity_level = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)

# Data processing
def smooth_data(data, window_size=3):
    return [sum(data[i:i+window_size])/window_size for i in range(len(data)-window_size+1)]

# MQTT setup
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"Connected with result code {rc}")
    client.subscribe("pet/health")

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload}")
    data = json.loads(msg.payload)
    new_reading = HealthReading(
        heart_rate=data['heart_rate'],
        temperature=data['temperature'],
        activity_level=data['activity_level'],
        latitude=data['gps_location']['latitude'],
        longitude=data['gps_location']['longitude'],
        pet_id=data['pet_id']
    )
    with app.app_context():
        db.session.add(new_reading)
        db.session.commit()
    print(f"Saved new reading for pet {data['pet_id']}")

mqtt_client = mqtt.Client(protocol=mqtt.MQTTv5, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect("localhost", 1883, 60)
mqtt_client.loop_start()

# Routes
@app.route('/pet', methods=['POST'])
def add_pet():
    data = request.json
    new_pet = Pet(name=data['name'], species=data['species'])
    db.session.add(new_pet)
    db.session.commit()
    print(f"Added new pet: {new_pet.name} (ID: {new_pet.id})")
    return jsonify({"message": "Pet added successfully", "pet_id": new_pet.id, "name": new_pet.name}), 201

@app.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify([{"id": pet.id, "name": pet.name, "species": pet.species} for pet in pets])

@app.route('/pet/<int:pet_id>/readings', methods=['GET'])
def get_pet_readings(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    readings = HealthReading.query.filter_by(pet_id=pet_id).order_by(HealthReading.timestamp.desc()).limit(100).all()
    
    heart_rates = [r.heart_rate for r in readings]
    temperatures = [r.temperature for r in readings]
    activity_levels = [r.activity_level for r in readings]
    
    smoothed_heart_rates = smooth_data(heart_rates)
    smoothed_temperatures = smooth_data(temperatures)
    smoothed_activity_levels = smooth_data(activity_levels)
    
    return jsonify([
        {
            "id": reading.id,
            "timestamp": reading.timestamp.isoformat(),
            "heart_rate": reading.heart_rate,
            "temperature": reading.temperature,
            "activity_level": reading.activity_level,
            "latitude": reading.latitude,
            "longitude": reading.longitude,
            "smoothed_heart_rate": smoothed_heart_rates[i] if i < len(smoothed_heart_rates) else None,
            "smoothed_temperature": smoothed_temperatures[i] if i < len(smoothed_temperatures) else None,
            "smoothed_activity_level": smoothed_activity_levels[i] if i < len(smoothed_activity_levels) else None
        } for i, reading in enumerate(readings)
    ])

def cleanup_old_data():
    while True:
        with app.app_context():
            one_month_ago = datetime.now(timezone.utc) - timedelta(days=30)
            old_readings = HealthReading.query.filter(HealthReading.timestamp < one_month_ago).all()
            for reading in old_readings:
                db.session.delete(reading)
            db.session.commit()
        time.sleep(86400)  # Run once a day

cleanup_thread = threading.Thread(target=cleanup_old_data)
cleanup_thread.start()


if __name__ == '__main__':
    app.run(debug=True)


```

# migrations\script.py.mako

```mako
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}


def downgrade():
    ${downgrades if downgrades else "pass"}

```

# migrations\README

```
Single-database configuration for Flask.

```

# migrations\env.py

```py
import logging
from logging.config import fileConfig

from flask import current_app

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')


def get_engine():
    try:
        # this works with Flask-SQLAlchemy<3 and Alchemical
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        # this works with Flask-SQLAlchemy>=3
        return current_app.extensions['migrate'].db.engine


def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace(
            '%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')


# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
config.set_main_option('sqlalchemy.url', get_engine_url())
target_db = current_app.extensions['migrate'].db

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=get_metadata(), literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    conf_args = current_app.extensions['migrate'].configure_args
    if conf_args.get("process_revision_directives") is None:
        conf_args["process_revision_directives"] = process_revision_directives

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            **conf_args
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

```

# migrations\alembic.ini

```ini
# A generic, single database configuration.

[alembic]
# template used to generate migration files
# file_template = %%(rev)s_%%(slug)s

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false


# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic,flask_migrate

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[logger_flask_migrate]
level = INFO
handlers =
qualname = flask_migrate

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S

```

# instance\pet_health.db

This is a binary file of the type: Binary

# migrations\versions\eb0757b7d037_initial_migration.py

```py
"""Initial migration

Revision ID: eb0757b7d037
Revises: 
Create Date: 2024-08-03 17:13:34.707082

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eb0757b7d037'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('pet',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('species', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('health_reading',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.Column('heart_rate', sa.Float(), nullable=False),
    sa.Column('temperature', sa.Float(), nullable=False),
    sa.Column('activity_level', sa.Float(), nullable=False),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('pet_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['pet_id'], ['pet.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('health_reading')
    op.drop_table('pet')
    # ### end Alembic commands ###

```

