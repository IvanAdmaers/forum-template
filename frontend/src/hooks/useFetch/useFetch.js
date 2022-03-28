import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

const useFetch = (url) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});

  const doFetch = useCallback((optionsObj = {}) => {
    if (!optionsObj.method) {
      optionsObj.method = 'POST';
    }

    optionsObj.headers = {
      ...optionsObj.headers,
    };

    if (optionsObj.body) {
      optionsObj.headers = {
        'Content-Type': 'application/json',
        ...optionsObj.headers,
      };

      if (!optionsObj.headers['Content-Type']) {
        delete optionsObj.headers['Content-Type'];
      }
    }

    if (optionsObj.body) {
      optionsObj.body =
        optionsObj.headers['Content-Type'] === 'application/json'
          ? JSON.stringify(optionsObj.body)
          : optionsObj.body;
    }

    if (!optionsObj.credentials) {
      optionsObj.credentials = 'include';
    }

    setOptions(optionsObj);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    let stopGettingResponseAfterDestroy = false;

    if (!isLoading) return;

    setError(null);

    fetch(`${baseUrl}${url}`, options)
      .then((res) => res.json())
      .then((data) => {
        if (stopGettingResponseAfterDestroy) return;

        if (data.errors) {
          return setError(data.errors[0].msg);
        }

        setResponse(data);
        setError(null);
      })
      .catch((err) => {
        if (stopGettingResponseAfterDestroy) return;

        setError(err);
      })
      .finally(() => {
        if (stopGettingResponseAfterDestroy) return;
        setIsLoading(false);
      });

    return () => {
      stopGettingResponseAfterDestroy = true;
    };
  }, [url, isLoading, options, baseUrl]);

  return [{ isLoading, response, error }, doFetch];
};

useFetch.propTypes = {
  url: PropTypes.string.isRequired,
};

export default useFetch;
