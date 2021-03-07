import React, { useCallback, useContext, useEffect } from 'react';
import { Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import moment from 'moment';

import { StoreContext } from 'store';

const BusStopMarker = ({
  busStopIndex,
  onInfoChanged
}) => {
  const { state, actions } = useContext(StoreContext);
  const { setSelectedBusStop, getBusStop } = actions;
  const { busStops, selectedBusStopIndex } = state.busStops;
  const busStop = busStops[busStopIndex];

  const getBusStopDetail = useCallback(() => (
    busStop ? (
      <div className="bus-stop-detail-wrapper">
        <h3>{busStop.name}</h3>
        <ul>
          {(busStop.details?.nextArrivals || []).map((schedule, key) => {
            const time = schedule.time.split(':');
            const utcDate = moment().utc();
            // Adjust this date to the schedule
            utcDate.date(utcDate.date() + (schedule.day - utcDate.day()));
            utcDate.hours(Number(time[0]));
            utcDate.minutes(Number(time[1]));

            const scheduleDate = utcDate.local();

            return (
              <li key={key}>
                <strong>{schedule.bus?.name}</strong>: {scheduleDate.format('h:mm a')} ({scheduleDate.from(new Date())})
              </li>
            );
          })}
        </ul>
      </div>
    ) : <h3>We cannot find that bus stop.</h3>
  ), [busStop]);

  const onMarkerClick = useCallback(() => {
    setSelectedBusStop(busStopIndex);
    getBusStop();
  }, []);

  useEffect(() => {
    if (selectedBusStopIndex === busStopIndex) {
      onInfoChanged({
        position: busStop.position,
        options: {
          pixelOffset: {
            height: -50,
            width: 0
          }
        },
        info: busStop ? getBusStopDetail() : <h3>Sorry! we cannot find that bus stop.</h3>
      });
    }
  }, [busStop, onInfoChanged, selectedBusStopIndex]);

  return (
    <div>
      <Marker
        position={busStop.position}
        onClick={onMarkerClick}
      />
    </div>
  );
}

export default BusStopMarker;

BusStopMarker.propTypes = {
  busStopIndex: PropTypes.number.isRequired,
  onInfoChanged: PropTypes.func
};
