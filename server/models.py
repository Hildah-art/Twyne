from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin 
from datetime import datetime

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class Users(db.Model, SerializerMixin):
    _tablename_ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    #image_url = db.Column(db.String)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    age = db.Column(db.Integer)
    gender = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    bio = db.Column(db.Text)

    preferences = db.relationship('Preferences', back_populates='user', cascade='all, delete-orphan')
    messages = db.relationship('Messages', back_populates='sender', cascade='all, delete-orphan')
    reports_made = db.relationship('Reports', foreign_keys='Reports.reporter_id', back_populates='reporter', cascade='all, delete-orphan')
    reports_received = db.relationship('Reports', foreign_keys='Reports.reported_id', back_populates='reported', cascade='all, delete-orphan')
    
    matches_as_user1 = db.relationship('Matches', foreign_keys='Matches.user_1_id', back_populates='user_1', cascade='all, delete-orphan')
    matches_as_user2 = db.relationship('Matches', foreign_keys='Matches.user_2_id', back_populates='user_2', cascade='all, delete-orphan')
    
    def to_dict(self):
        return{
           'id':self.id,
            'name':self.name,
            'email':self.email,
            'password_hash':self.password_hash,
            'age':self.age,
            'gender':self.gender,
            'location':self.location,
            'bio':self.bio
            
        }

class Preferences(db.Model, SerializerMixin):
    _tablename_ = 'preferences'

    id = db.Column(db.Integer, primary_key=True)
    preferred_age = db.Column(db.Integer, nullable=False)
    preferred_gender = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('Users', back_populates='preferences')
    
    def to_dict(self):
        return{
           'id':self.id,
            'preferred_age':self.preferred_age,
            'preferred_gender':self.preferred_gender,
            'user_id':self.user_id
        }

class Matches(db.Model, SerializerMixin):
    _tablename_ = 'matches'

    id = db.Column(db.Integer, primary_key=True)
    match_date = db.Column(db.DateTime, default=datetime.utcnow)
    user_1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_2_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user_1 = db.relationship('Users', foreign_keys=[user_1_id], back_populates='matches_as_user1')
    user_2 = db.relationship('Users', foreign_keys=[user_2_id], back_populates='matches_as_user2')
    messages = db.relationship('Messages', back_populates='match', cascade='all, delete-orphan')

class Messages(db.Model, SerializerMixin):
    _tablename_ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    message_body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    match_id = db.Column(db.Integer, db.ForeignKey('matches.id'))

    sender = db.relationship('Users', back_populates='messages')
    match = db.relationship('Matches', back_populates='messages')

class Reports(db.Model, SerializerMixin):
    _tablename_ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    reason = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    reported_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    reporter = db.relationship('Users', foreign_keys=[reporter_id], back_populates='reports_made')
    reported = db.relationship('Users', foreign_keys=[reported_id], back_populates='reports_received')