from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20))
    avatar = db.Column(db.String(200))
    driving_license = db.Column(db.String(50))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'avatar': self.avatar,
            'driving_license': self.driving_license,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'zip_code': self.zip_code
        }

class Car(db.Model):
    __tablename__ = 'car'
    id = db.Column(db.String(50), primary_key=True)
    make = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(50))
    fuel_type = db.Column(db.String(50))
    transmission = db.Column(db.String(50))
    seats = db.Column(db.Integer)
    price_per_day = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(100))
    rating = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    images = db.Column(db.JSON)
    features = db.Column(db.JSON)
    available = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)


class Booking(db.Model):
    __tablename__ = 'booking'
    id = db.Column(db.String(50), primary_key=True)
    car_id = db.Column(db.String(50), db.ForeignKey('car.id'), nullable=False)
    user_id = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)