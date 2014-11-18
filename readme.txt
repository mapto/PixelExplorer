Thank you for taking the time to do this project.
We believe in giving developers the freedom to express themselves, so with that in mind please complete this task
exactly how you want to, don't feel constricted by the initial files.

You will find in this folder a python web server and api, it gives you access to three entities:
Advertiser, Pixel and Pixel Fires.

"Advertisers" own "Pixels", and "Pixels" have "Pixel Fires".

The task is to create a UI that uses this API to display and manipulate these entities.
You have the freedom to display the information how you choose.

You will need the following Python PIP libraries to run the API:

- SQLite
- Python 2.7
-- Bottle
-- SQLAlchemy

To fill the database with dummy data run "python setup_db.py"
Then to start the API run "python main.py"

The API will give you access to the following endpoints:

GET
/pixels
/pixels/{pixel_id}
/advertisers
/advertisers/{advertiser_id}

POST
/pixels
/advertisers

PUT
/pixels/{pixel_id}
/advertisers/{advertiser_id}

DELETE
/pixels/{pixel_id}
/advertisers/{advertiser_id}

visit http://localhost:8080/pixels/1 and http://localhost:8080/advertisers/1 to get started.

We suggest spending a couple of evenings on this project, if you prefer to use a public repository like GitHub
to do your work this would be very useful for us.
