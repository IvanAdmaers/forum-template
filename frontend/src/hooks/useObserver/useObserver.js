import { useEffect, useRef } from 'react';

const useObserver = (ref, callback, options, shouldWorks = null) => {
  const observer = useRef();

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    const observerOptions = {
      // with these options doesn't work in safari 13.1.3
      // root: document,
      // rootMargin: '0px',
      // threshold: 0,
      ...options,
    };

    const cb = (entries) => {
      if (!entries[0].isIntersecting || shouldWorks === false) return;

      callback();
    };

    observer.current = new IntersectionObserver(cb, observerOptions);
    observer.current.observe(ref.current);
  }, [callback, ref, options, shouldWorks]);
};

export default useObserver;
