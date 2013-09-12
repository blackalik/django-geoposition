from decimal import Decimal

VERSION = (0, 1, 4)
__version__ = '.'.join(map(str, VERSION))


class Geoposition(object):
    def __init__(self, latitude, longitude, path):
        if isinstance(latitude, float) or isinstance(latitude, int):
            latitude = str(latitude)
        if isinstance(longitude, float) or isinstance(longitude, int):
            longitude = str(longitude)

        self.latitude = Decimal(latitude)
        self.longitude = Decimal(longitude)
        self.path = path

    def __unicode__(self):
        return "%s,%s,%s" % (self.latitude, self.longitude, self.path)

    def __repr__(self):
        return "Geoposition(%s)" % unicode(self)

    def __len__(self):
        return len(unicode(self))
