import geoip2.database
# from check_ip import is_network_ip

reader = geoip2.database.Reader('../../database/GeoLite2-City.mmdb')


def ip2geo(ipstr):
    '''
        Converts IP addresses to geographical address
    '''
    response = reader.city(ipstr)
    result = {}
    result['country_name_en'] = response.country.names['en']
    result['country_name_zh'] = response.country.names['zh-CN']
    result['city_name'] = response.city.name
    result['location_longitude'] = response.location.longitude
    result['location_latitude'] = response.location.latitude
    return result
