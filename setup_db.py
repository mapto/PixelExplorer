from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime


date_format = "%d/%m/%Y"

'''
Declare Tables
'''
Base = declarative_base()
engine = create_engine('sqlite:///test.db', echo=False)


class Advertisers(Base):
    __tablename__ = 'Advertisers'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    address = Column(String)
    city = Column(String)
    post_code = Column(String)
    tel = Column(String)


class Pixels(Base):
    __tablename__ = 'Pixels'

    id = Column(Integer, primary_key=True)
    advertiser_id = Column(Integer)
    name = Column(String)


class PixelFires(Base):
    __tablename__ = 'Pixel_fires'

    id = Column(Integer, primary_key=True)
    pixel_id = Column(Integer)
    fires = Column(Integer)
    date = Column(DateTime)

'''
Create all our declared tables
'''
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

'''
Prefill the DB
'''


'''
Create session
'''
session = Session()

'''
Create a entries in the Advertisers table
'''
sony_advertiser = Advertisers(name='Sony', address='550 Madison Avenue', city='New York')
apple_advertiser = Advertisers(name='Apple', address='1 Infinite Loop', city='San Francisco')
nike_advertiser = Advertisers(name='Nike', address='14 Neal St', city='London', tel='020 7836 6460')

session.add_all([sony_advertiser, apple_advertiser, nike_advertiser])
'''
Create a entries in the Pixels table
'''
sony_advertiser = session.query(Advertisers).filter_by(name='Sony').first()
sony_pixel = Pixels(advertiser_id=sony_advertiser.id, name='Conversion')

session.add(sony_pixel)
'''
Create a entries in the PixelFires table
'''
sony_advertiser = session.query(Advertisers).filter_by(name='Sony').first()
sony_pixel = session.query(Pixels).filter_by(advertiser_id=sony_advertiser.id).first()
sony_pixel_fire_1 = PixelFires(pixel_id=sony_pixel.id, fires=35, date=datetime.strptime("07/04/2014", date_format))
sony_pixel_fire_2 = PixelFires(pixel_id=sony_pixel.id, fires=31, date=datetime.strptime("08/04/2014", date_format))
sony_pixel_fire_3 = PixelFires(pixel_id=sony_pixel.id, fires=44, date=datetime.strptime("09/04/2014", date_format))

session.add_all([sony_pixel_fire_1, sony_pixel_fire_2, sony_pixel_fire_3])
'''
Commit to the DB
'''
session.commit()