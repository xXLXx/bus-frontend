import React, { useCallback, useState, useEffect, useContext, useRef, memo } from 'react';
import { GoogleMap, InfoBox, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

import './styles.scss';
import Loader from 'components/loader/loader';
import BusStopMarker from 'components/busStopMarker/busStopMarker';
import { getCurrentLocation } from 'utils';
import { StoreContext } from 'store';
import Config from 'config';

const BusStopsMap = () => {
  const { state, actions } = useContext(StoreContext);
  const { setBusStopsFilter, getBusStops } = actions;
  const { busStops, errorMessage, isLoading } = state.busStops;

  const infoWindow = useRef(null);

  const [map, setMap] = useState(null);
  const [mapDimens, setMapDimens] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [isInit, setIsInit] = useState(false);
  const [infoWindowInfo, setInfoWindowInfo] = useState(null);
  const [mapCenter, setMapCenter] = useState(Config.maps.defaultCenter);
  const { isLoaded } = useJsApiLoader({
    id: 'bus-stops-map',
    googleMapsApiKey: Config.maps.apiKey
  });

  useEffect(() => {
    initMapDimensions();
    initUserLocation();

    window.addEventListener('resize', initMapDimensions);

    return () => {
      window.removeEventListener('resize', initMapDimensions);
    }
  }, []);

  useEffect(() => {
    if (map && userLocation) {
      setBusStopsFilter({
        filters: { near: `${userLocation.lat},${userLocation.lng}` },
        reset: true
      });
      getBusStops();

      map.setCenter(userLocation);
    }
  }, [userLocation, map]);

  // useEffect(() => {
  //   infoWindow?.current && infoWindow.current.close();
  //   console.log('close');
  // }, [isLoading]);

  const initMapDimensions = () => {
    setMapDimens({
      width:`${window.innerWidth}px`,
      height:`${window.innerHeight}px`,
    });
  };

  const initUserLocation = async () => {
    try {
      const { coords } = await getCurrentLocation();
      setUserLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    } catch (_) {
      // Just ignore the error we just use the default center
      setUserLocation(Config.maps.defaultCenter);
    } finally {
      setIsInit(true);
    }
  };

  const onLoad = useCallback((loadedMap) => {
    setMap(loadedMap);
  }, [setMap]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, [setMap]);

  const onCenterChanged = useCallback(() => {
    if (map) {
      const center = map.getCenter();
      setMapCenter({
        lat: center.lat(),
        lng: center.lng()
      });
    }
  }, [setMapCenter, map]);

  const onInfoChanged = useCallback((info) => {
    if (infoWindow?.current && map) {
      infoWindow.current.open(map);
    }
    setInfoWindowInfo(info);
  }, [setInfoWindowInfo, map]);

  return isLoaded ? (
    <div className='bus-stops-map-wrapper'>
      {(isLoading || !isInit) && <Loader absolute />}
      <GoogleMap
        mapContainerStyle={mapDimens}
        center={Config.maps.defaultCenter}
        zoom={Config.maps.defaultZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onCenterChanged={onCenterChanged}
      >
        {infoWindowInfo?.position && (
          <InfoWindow
            position={infoWindowInfo.position}
            options={infoWindowInfo.options || {}}
            onLoad={(ele) => infoWindow.current = ele}
          >
            {infoWindowInfo?.info || <div className='info-window-placeholder' />}
          </InfoWindow>
        )}
        {busStops.map((busStop, key) => (
          <BusStopMarker
            key={key}
            busStopIndex={key}
            onInfoChanged={onInfoChanged}
          />
        ))}
        {errorMessage && (
          <InfoBox position={mapCenter}>
            <h1 className='error'>{errorMessage}</h1>
          </InfoBox>
        )}
      </GoogleMap>
    </div>
  ) : <Loader fixed />
}

export default memo(BusStopsMap);
