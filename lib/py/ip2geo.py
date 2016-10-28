import geoip2.database
import check_ip

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


def add_geo(kou_result):
    """
        add src_longitude, src_latitude, dst_longitude and dst_latitude to ip level
    """
    IP_dst = kou_result['result']['IP_dst']
    IP_src = kou_result['result']['IP_src']
    
    kou_result['result']['src_longitude'] = None
    kou_result['result']['src_latitude'] = None
    kou_result['result']['dst_longitude'] = None
    kou_result['result']['dst_latitude'] = None

    IP_dst_isnet = check_ip.is_network_ip(IP_dst)
    IP_src_isnet = check_ip.is_network_ip(IP_src)

    if IP_src_isnet and IP_dst_isnet:
        return kou_result

    if IP_dst_isnet:
        temp = ip2geo(IP_dst)
        kou_result['result']['dst_latitude'] = temp['location_latitude']
        kou_result['result']['dst_longitude'] = temp['location_longitude']
    if IP_src_isnet:
        temp = ip2geo(IP_src)
        kou_result['result']['src_latitude'] = temp['location_latitude']
        kou_result['result']['src_longitude'] = temp['location_longitude']

    return kou_result


# b = add_geo(a)
# print "b['result']['src_longitude']:", b['result']['src_longitude']
# print "b['result']['src_latitude']:", b['result']['src_latitude']
# print "b['result']['dst_longitude']:", b['result']['dst_longitude']
# print "b['result']['dst_latitude']:",b['result']['dst_latitude']
