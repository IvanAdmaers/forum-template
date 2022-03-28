import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setUser, logoutUser } from 'actions/userActions';

import { USER_LOCAL_STORAGE_VARIABLE } from 'constants/user';

import { useFetch } from 'hooks';

import * as socket from 'sockets/personalSocket';

import { setUnreadChats } from 'actions/personalActions';

const UserInitialization = () => {
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const isUserLoggedIn = useSelector(({ user }) => user.isLoggedIn);

  const [{ error, response }, doFetch] = useFetch(`/users/${username}`);
  const [
    { response: requestSocketConnectionResponse },
    doRequestSocketConnectionFetch,
  ] = useFetch('/request-socket-connection?type=personal');

  const dispatch = useDispatch();

  useEffect(() => {
    const browser = typeof window !== 'undefined';

    if (!browser || checked) return;

    setChecked(true);

    const userLocalStorageData = localStorage.getItem(
      USER_LOCAL_STORAGE_VARIABLE
    );

    if (!userLocalStorageData) {
      return null;
    }

    const userData = JSON.parse(userLocalStorageData);

    dispatch(setUser(userData));

    setUsername(userData.username);
  }, [dispatch, checked]);

  // Request socket connection
  useEffect(() => {
    if (!isUserLoggedIn) {
      return;
    }

    const method = 'GET';

    doRequestSocketConnectionFetch({ method });
  }, [isUserLoggedIn, doRequestSocketConnectionFetch]);

  // Personal socket
  useEffect(() => {
    if (!requestSocketConnectionResponse) {
      return;
    }

    socket.connectSocket();

    const handleSocketConnected = () => {
      // Request for messages when first connect
      socket.getUnreadChats();
    };

    socket.socketConneced(handleSocketConnected);

    // Handle getting a unread chats
    const unreadChatsCallback = (unreadChats = []) => {
      return dispatch(setUnreadChats(unreadChats));
    };

    socket.unreadChats(unreadChatsCallback);

    const handleUnreadChatsUpdateTrigger = () => {
      socket.getUnreadChats();
    };

    socket.unreadChatsUpdateTrigger(handleUnreadChatsUpdateTrigger);
  }, [requestSocketConnectionResponse, dispatch]);

  useEffect(() => {
    if (!username) return;

    const method = 'GET';

    doFetch({ method });
  }, [username, doFetch]);

  useEffect(() => {
    if (!error) return;

    dispatch(logoutUser());
  }, [error, dispatch]);

  useEffect(() => {
    if (!response) return;

    const { user, authenticated } = response;

    if (!authenticated) {
      return dispatch(logoutUser());
    }

    dispatch(setUser(user));
  }, [response, dispatch]);

  return null;
};

export default UserInitialization;
