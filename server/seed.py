# seed.py
from werkzeug.security import generate_password_hash
from app import app  # make sure app.py has db.init_app(app)
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

    # Create a list to store users to ensure we have them for relationships
    users = []

    # Users
    print("Seeding Users...")
    for _ in range(20):  # Create 20 fake users
        gender = random.choice(["male", "female", "other"])
        user = Users(
            name=fake.name(),
            image_url=fake.image_url(),
            email=fake.unique.email(),
            password_hash=generate_password_hash('password123'), # All users have 'password123' for easy testing
            age=random.randint(18, 60),
            gender=gender,
            location=fake.city(),
            bio=fake.sentence(nb_words=10)
        )
        users.append(user)
        db.session.add(user)
    db.session.commit()
    print(f"Seeded {len(users)} users.")

    # Preferences
    print("Seeding Preferences...")
    preferences = []
    for user in users:
        # Each user gets one preference
        preferred_gender = random.choice([g for g in ["male", "female", "other"] if g != user.gender] + [user.gender]) # Try to make it diverse
        pref = Preferences(
            user_id=user.id,
            preferred_age=random.randint(max(18, user.age - 5), min(60, user.age + 10)), # Preferred age around user's age
            preferred_gender=preferred_gender
        )
        preferences.append(pref)
        db.session.add(pref)
    db.session.commit()
    print(f"Seeded {len(preferences)} preferences.")

    # Matches
    print("Seeding Matches...")
    matches = []
    # Create some random matches between existing users
    num_matches = min(30, len(users) * (len(users) - 1) // 2) # Max possible unique pairs
    for _ in range(num_matches):
        user_1, user_2 = random.sample(users, 2) # Get two unique users
        # Ensure no duplicate matches (user_1, user_2) or (user_2, user_1)
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

    # Messages
    print("Seeding Messages...")
    messages = []
    for match in matches:
        # Create a few messages for each match
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


    # Reports
    print("Seeding Reports...")
    reports = []
    # Create some random reports
    for _ in range(5):
        reporter, reported = random.sample(users, 2)
        if reporter.id != reported.id: # Ensure reporter and reported are different
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