import random
import uuid

from flask import Flask, jsonify, request
from models import db, User, Car, Booking
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurarea MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:199914@localhost/car_rental_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Helper method to convert SQLAlchemy objects to dictionaries
def to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

# Initialize the database
with app.app_context():
    db.create_all()

# ============================
# USER ROUTES
# ============================

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(
        id=str(uuid.uuid4()),
        name=data['name'],
        email=data['email'],
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200


@app.route('/users/current', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(to_dict(user)), 200

@app.route('/users/current', methods=['PUT'])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    for field in ['name', 'email', 'phone', 'avatar', 'driving_license', 'address', 'city', 'country', 'zip_code']:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({"message": "User updated successfully", "user": to_dict(user)}), 200


# ============================
# CAR ROUTES
# ============================

@app.route('/cars/<string:car_id>', methods=['GET'])
def get_car_by_id(car_id):
    car = Car.query.get(car_id)
    if not car:
        return jsonify({"message": "Car not found"}), 404
    return jsonify(to_dict(car)), 200


@app.route('/cars/type/<string:type>', methods=['GET'])
def get_cars_by_type(type):
    cars = Car.query.filter_by(type=type).all()
    return jsonify([to_dict(car) for car in cars]), 200


@app.route('/cars/popular', methods=['GET'])
def get_popular_cars():
    cars = Car.query.filter(Car.rating >= 4.8).limit(5).all()
    return jsonify([to_dict(car) for car in cars]), 200


@app.route('/cars/recommended', methods=['GET'])
def get_recommended_cars():
    cars = Car.query.all()
    recommended = sorted(cars, key=lambda x: 0.5 - random.random())[:4]
    return jsonify([to_dict(car) for car in recommended]), 200


@app.route('/cars/filter', methods=['POST'])
def filter_cars():
    filters = request.get_json()
    query = Car.query

    if filters.get('type'):
        query = query.filter_by(type=filters['type'])
    if filters.get('priceRange'):
        min_price, max_price = filters['priceRange']
        query = query.filter(Car.price_per_day.between(min_price, max_price))
    if filters.get('transmission'):
        query = query.filter_by(transmission=filters['transmission'])
    if filters.get('fuelType'):
        query = query.filter_by(fuel_type=filters['fuelType'])
    if filters.get('seats'):
        query = query.filter(Car.seats >= filters['seats'])
    if filters.get('searchQuery'):
        search_query = filters['searchQuery'].lower()
        query = query.filter(
            (Car.make.ilike(f"%{search_query}%")) |
            (Car.model.ilike(f"%{search_query}%")) |
            (Car.location.ilike(f"%{search_query}%")) |
            (Car.type.ilike(f"%{search_query}%")) |
            (Car.fuel_type.ilike(f"%{search_query}%"))
        )

    filtered_cars = query.all()
    return jsonify([to_dict(car) for car in filtered_cars]), 200


# ============================
# BOOKING ROUTES
# ============================

@app.route('/bookings/user/<string:user_id>', methods=['GET'])
@jwt_required()
def get_bookings_by_user(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([to_dict(booking) for booking in bookings]), 200


@app.route('/bookings/<string:booking_id>', methods=['GET'])
@jwt_required()
def get_booking_by_id(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"message": "Booking not found"}), 404
    return jsonify(to_dict(booking)), 200


@app.route('/bookings/active/<string:user_id>', methods=['GET'])
@jwt_required()
def get_active_bookings(user_id):
    bookings = Booking.query.filter(
        Booking.user_id == user_id,
        Booking.status.in_(["confirmed", "active"])
    ).all()
    return jsonify([to_dict(booking) for booking in bookings]), 200


@app.route('/bookings/past/<string:user_id>', methods=['GET'])
@jwt_required()
def get_past_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id, status="completed").all()
    return jsonify([to_dict(booking) for booking in bookings]), 200


@app.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    new_booking = Booking(
        id=data['id'],
        car_id=data['carId'],
        user_id=data['userId'],
        start_date=datetime.strptime(data['startDate'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['endDate'], '%Y-%m-%d').date(),
        total_price=data['totalPrice'],
        status=data['status']
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({"message": "Booking created successfully"}), 201


if __name__ == '__main__':
    app.run(debug=True)