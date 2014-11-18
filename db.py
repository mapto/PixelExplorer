from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime


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

Session = sessionmaker(bind=engine)
