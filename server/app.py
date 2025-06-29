from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from models import db, Users, Preferences, Matches, Messages, Reports
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_restful import Api, Resource
from werkzeug.security import check_password_hash, generate_password_hash 
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity
)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
jwt = JWTManager(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///twyne.db"
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False

migrate = Migrate(app,db)

db.init_app(app)

api = Api(app)


CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return make_response({'error': 'Email and password are required'}, 400)

        user = Users.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return make_response({'error': 'Invalid email or password'}, 401)

        access_token = create_access_token(identity={"id": user.id})
        return make_response({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }, 200)
        
class Home(Resource):
    def get(self):
        return make_response("<h1>Twyne</h1>")
    
class User(Resource):

    def get(self):
        users = Users.query.all()
        #return make_response(jsonify([u.to_dict() for u in users]), 200)
        return [user.to_dict() for user in users], 200

    def post(self):
        data = request.get_json()
        required_fields = ['name', 'email', 'password_hash', 'age', 'gender', 'location', 'bio']

        if not all(field in data for field in required_fields):
            return make_response({'error': 'Missing required fields'}, 400)

        if Users.query.filter_by(email=data['email']).first():
            return make_response({'error': 'Email already exists'}, 409)

        hashed_password = generate_password_hash(data['password_hash'])

        new_user = Users(
            name=data['name'], email=data['email'], password_hash=hashed_password,
            age=data['age'], gender=data['gender'], location=data['location'], bio=data['bio']
        )
        db.session.add(new_user)
        db.session.commit()

        return make_response({'message': 'User created', 'data': new_user.to_dict()}, 201)

        
class UserById(Resource):
    @jwt_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        if current_user['id'] != id:
            return make_response({'error': 'Unauthorized'}, 403)

        data = request.get_json()
        user = Users.query.get(id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        for field in ['name', 'email', 'age', 'gender', 'location', 'bio']:
            setattr(user, field, data.get(field, getattr(user, field)))

        if 'password_hash' in data:
            user.password_hash = generate_password_hash(data['password_hash'])

        db.session.commit()
        return make_response(f"{user.name} updated", 200)

    @jwt_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return make_response({'error': 'Admin only'}, 403)

        user = Users.query.get(id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        db.session.delete(user)
        db.session.commit()
        return make_response(f"User {user.name} deleted", 200)

class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = Users.query.get(current_user['id'])
        if not user:
            return make_response({'error': 'User not found'}, 404)
        return make_response(user.to_dict(), 200)
    
class Preference(Resource):
    @jwt_required()
    def get(self):
        return make_response(jsonify([p.to_dict() for p in Preferences.query.all()]), 200)

    @jwt_required()
    def post(self):
        data = request.get_json()
        required = ['preferred_age', 'preferred_gender', 'user_id']

        if not all(field in data for field in required):
            return make_response({'error': 'Missing fields'}, 400)

        new_preference = Preferences(**data)
        db.session.add(new_preference)
        db.session.commit()

        return make_response({'message': 'Preferences created', 'data': new_preference.to_dict()}, 201)

class PreferenceById(Resource):
    @jwt_required()
    def patch(self, id):
        data = request.get_json()
        preference = Preferences.query.get(id)
        if not preference:
            return make_response({'error': 'Preference not found'}, 404)

        preference.preferred_age = data.get('preferred_age', preference.preferred_age)
        preference.preferred_gender = data.get('preferred_gender', preference.preferred_gender)
        db.session.commit()
        return make_response('Preference updated', 200)

    @jwt_required()
    def delete(self, id):
        preference = Preferences.query.get(id)
        if not preference:
            return make_response({'error': 'Preference not found'}, 404)

        db.session.delete(preference)
        db.session.commit()
        return make_response('Preference deleted', 200)
    
class Message(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        if not all(k in data for k in ['message_body', 'sender_id', 'match_id']):
            return make_response({'error': 'Missing message fields'}, 400)

        message = Messages(**data)
        db.session.add(message)
        db.session.commit()
        return make_response(message.to_dict(), 201)

class MessageById(Resource):
    @jwt_required()
    def get(self, id):
        message = Messages.query.get(id)
        if not message:
            return make_response({'error': 'Message not found'}, 404)
        return make_response(message.to_dict(), 200)
    
    @jwt_required()
    def delete(self, id):
        message = Messages.query.get(id)
        if not message:
            return make_response({'error': 'Message not found'}, 404)

        db.session.delete(message)
        db.session.commit()
        return make_response('Message deleted', 200)

class Report(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        if not all(k in data for k in ['reason', 'reporter_id', 'reported_id']):
            return make_response({'error': 'Missing report fields'}, 400)

        report = Reports(**data)
        db.session.add(report)
        db.session.commit()
        return make_response(report.to_dict(), 201)

class ReportById(Resource):
    @jwt_required()
    def get(self, id):
        report = Reports.query.get(id)
        if not report:
            return make_response({'error': 'Report not found'}, 404)
        return make_response(report.to_dict(), 200)

    @jwt_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return make_response({'error': 'Admin only'}, 403)

        report = Reports.query.get(id)
        if not report:
            return make_response({'error': 'Report not found'}, 404)

        db.session.delete(report)
        db.session.commit()
        return make_response('Report deleted', 200)
    
class Match(Resource):
    @jwt_required()
    def get(self):
        return make_response([m.to_dict() for m in Matches.query.all()], 200)

    @jwt_required()
    def post(self):
        data = request.get_json()
        if not all(k in data for k in ['user_1_id', 'user_2_id']):
            return make_response({'error': 'Missing match fields'}, 400)

        match = Matches(**data)
        db.session.add(match)
        db.session.commit()
        return make_response(match.to_dict(), 201)
    
class MatchById(Resource):
    @jwt_required()
    def get(self, id):
        match = Matches.query.get(id)
        if not match:
            return make_response({'error': 'Match not found'}, 404)
        return make_response(match.to_dict(), 200)

    @jwt_required()
    def delete(self, id):
        match = Matches.query.get(id)
        if not match:
            return make_response({'error': 'Match not found'}, 404)
        db.session.delete(match)
        db.session.commit()
        return make_response('Match deleted', 200)
    
api.add_resource(Home, '/')
api.add_resource(Login, '/login')
api.add_resource(User, '/users')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(UserProfile, '/profile')
api.add_resource(Preference, '/preference')
api.add_resource(PreferenceById, '/preference/<int:id>')
api.add_resource(Message, '/message')
api.add_resource(MessageById, '/message/<int:id>')
api.add_resource(Report, '/report')
api.add_resource(ReportById, '/report/<int:id>')
api.add_resource(Match, '/match')
api.add_resource(MatchById, '/match/<int:id>')
 
if __name__ == '__main__':
    app.run(port=5555, debug=True)