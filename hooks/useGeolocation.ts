import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

interface GeolocationState {
    loading: boolean;
    error: GeolocationPositionError | { message: string } | null;
    location: Coordinates | null;
}

const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        loading: true,
        error: null,
        location: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                loading: false,
                error: { message: "Geolocation is not supported by your browser." },
                location: null,
            });
            return;
        }

        const onSuccess = (position: GeolocationPosition) => {
            setState({
                loading: false,
                error: null,
                location: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
            });
        };

        const onError = (error: GeolocationPositionError) => {
            setState({
                loading: false,
                error,
                location: null,
            });
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        
    }, []);

    return state;
};

export default useGeolocation;
