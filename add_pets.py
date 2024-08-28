from backend.app import app, db
from backend.app import Pet

def add_pets():
    pets = [
        Pet(name='Max', species='Dog', breed='Labrador Retriever', age=3.5, weight=30.2),
        Pet(name='Luna', species='Cat', breed='Siamese', age=2.0, weight=4.5),
        Pet(name='Charlie', species='Dog', breed='Golden Retriever', age=5.0, weight=32.1),
        Pet(name='Bella', species='Cat', breed='Maine Coon', age=4.5, weight=6.8),
        Pet(name='Rocky', species='Dog', breed='German Shepherd', age=2.5, weight=28.7)
    ]

    with app.app_context():
        db.session.add_all(pets)
        db.session.commit()
        print("5 pets have been added to the database.")

        all_pets = Pet.query.all()
        for pet in all_pets:
            print(f"ID: {pet.id}, Name: {pet.name}, Species: {pet.species}, Breed: {pet.breed}, Age: {pet.age}, Weight: {pet.weight}")

if __name__ == "__main__":
    add_pets()