
from werkzeug.security import generate_password_hash
from app import app
from models import db, Users, Preferences, Matches, Messages, Reports
from datetime import datetime
from faker import Faker
import random

with app.app_context():
    print("Resetting database...")

    db.drop_all()
    db.create_all()

    print(" Seeding data...")

    fake = Faker()

    
    users = []

    
    print("Seeding Users...")
    for _ in range(20): 
        gender = random.choice(["male", "female", "other"])
        user = Users(
            name=fake.name(),
            image_url=fake.image_url(),
            email=fake.unique.email(),
            password_hash=generate_password_hash('password123'), 
            age=random.randint(18, 60),
            gender=gender,
            location=fake.city(),
            bio=fake.sentence(nb_words=10)
        )
        users.append(user)
        db.session.add(user)
    db.session.commit()
    print(f"Seeded {len(users)} users.")

    
    print("Seeding Preferences...")
    preferences = []
    for user in users:
        
        preferred_gender = random.choice([g for g in ["male", "female", "other"] if g != user.gender] + [user.gender]) 
        pref = Preferences(
            user_id=user.id,
            preferred_age=random.randint(max(18, user.age - 5), min(60, user.age + 10)), 
            preferred_gender=preferred_gender
        )
        preferences.append(pref)
        db.session.add(pref)
    db.session.commit()
    print(f"Seeded {len(preferences)} preferences.")

    
    print("Seeding Matches...")
    matches = []
   
    num_matches = min(30, len(users) * (len(users) - 1) // 2)
    for _ in range(num_matches):
        user_1, user_2 = random.sample(users, 2)
       
        existing_match = db.session.query(Matches).filter(
            ((Matches.user_1_id == user_1.id) & (Matches.user_2_id == user_2.id)) |
            ((Matches.user_1_id == user_2.id) & (Matches.user_2_id == user_1.id))
        ).first()

        if not existing_match:
            match = Matches(user_1_id=user_1.id, user_2_id=user_2.id, match_date=fake.date_time_this_year())
            matches.append(match)
            db.session.add(match)
    db.session.commit()
    print(f"Seeded {len(matches)} matches.")

    
    print("Seeding Messages...")
    messages = []
    for match in matches:
        
        num_messages = random.randint(1, 5)
        for _ in range(num_messages):
            sender = random.choice([match.user_1, match.user_2])
            msg = Messages(
                sender_id=sender.id,
                match_id=match.id,
                message_body=fake.sentence(),
                timestamp=fake.date_time_between(start_date=match.match_date, end_date="now")
            )
            messages.append(msg)
            db.session.add(msg)
    db.session.commit()
    print(f"Seeded {len(messages)} messages.")


    
    print("Seeding Reports...")
    reports = []
    
    for _ in range(5):
        reporter, reported = random.sample(users, 2)
        if reporter.id != reported.id: 
            report = Reports(
                reporter_id=reporter.id,
                reported_id=reported.id,
                reason=fake.paragraph(nb_sentences=2),
                timestamp=fake.date_time_this_year()
            )
            reports.append(report)
            db.session.add(report)
    db.session.commit()
    print(f"Seeded {len(reports)} reports.")

    print(" Done seeding.")