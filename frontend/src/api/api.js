const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

const doFetch = async (url = '', args = {}, parseType = 'JSON') => {
  const {
    body,
    headers,
    method = 'POST',
    stringify = true,
    credentials = 'include',
  } = args;

  const options = {
    method,
    headers: !headers ? { 'Content-Type': 'application/json' } : headers,
    credentials,
  };

  if (body) {
    options.body = !stringify ? body : JSON.stringify(body);
  }

  const req = await fetch(`${baseURL}${url}`, options);

  const res = parseType === 'JSON' ? await req.json() : await req.text();

  if (res.errors || res.error) {
    return { error: res.errors?.[0]?.msg || res?.error };
  }

  return res;
};

export const signIn = async (username = '', password = '') => {
  const url = '/users/login';
  const body = { user: { username, password } };

  const data = await doFetch(url, { body });

  return data;
};

export const signUp = async (email = '', username = '', password = '') => {
  const url = '/users';
  const body = { user: { email, username, password } };

  const data = await doFetch(url, { body });

  return data;
};

export const getGroups = async (page = 1, limit = 2) => {
  const url = `/group/list?page=${page}&limit=${limit}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const uploadImage = async (file) => {
  const url = '/image';

  const formData = new FormData();

  formData.append('image', file);

  const body = formData;
  const headers = {};
  const stringify = false;

  const data = await doFetch(url, { body, headers, stringify });

  return data;
};

export const search = async (by = '', q = '', page = 1, limit = 10) => {
  const url = `/search?q=${q}&by=${by}&page=${page}&limit=${limit}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const getGroup = async (slug = '') => {
  const url = `/group/${slug}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const joinGroup = async (slug = '') => {
  const url = `/group/${slug}/join`;

  const data = await doFetch(url);

  return data;
};

export const unjoinGroup = async (slug = '') => {
  const url = `/group/${slug}/unjoin`;

  const data = await doFetch(url);

  return data;
};

export const isGroupMember = async (slug = '') => {
  const url = `/group/${slug}/isMember`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const searchUserGroups = async (q = '') => {
  const url = `/group/user/search?q=${decodeURI(q)}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const getPost = async (slug = '') => {
  const url = `/post/${slug}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const getPostUserData = async (slug = '') => {
  const url = `/post/${slug}/user`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const votePost = async (slug = '', vote = 0) => {
  const url = `/post/${slug}/${vote}`;
  const method = 'PUT';

  const data = await doFetch(url, { method });

  return data;
};

export const getGroupPosts = async (groupSlug = '', page = 1, limit = 3) => {
  const url = `/group/${groupSlug}/posts?page=${page}&limit=${limit}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const getUserData = async (username = '') => {
  const url = `/users/${username}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const getPosts = async (page = 1, limit = 10) => {
  const url = `/post/list?page${page}&limit=${limit}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const voteComment = async (slug = '', commentId = '', vote = 0) => {
  const url = `/comments/${slug}/${commentId}/${vote}`;
  const method = 'PUT';

  const data = await doFetch(url, { method });

  return data;
};

export const submitComplaint = async (type = '', id = '', reason = '') => {
  const url = '/complaint';
  const method = 'POST';

  const body = {
    complaint: { type, id, reason },
  };

  const data = await doFetch(url, { method, body });

  return data;
};

export const uploadImageByUrl = async (imageUrl = '') => {
  const url = '/image/byUrl';
  const method = 'POST';

  const body = {
    image: { url: imageUrl },
  };

  const data = await doFetch(url, { method, body });

  return data;
};

export const changeAvatar = async (file) => {
  const url = '/users/avatar';
  const method = 'PUT';

  const formData = new FormData();

  formData.append('image', file);

  const body = formData;
  const headers = {};
  const stringify = false;

  const data = await doFetch(url, { method, body, headers, stringify });

  return data;
};

export const userLogout = async () => {
  const url = `/users/logout`;
  const method = 'POST';

  const data = await doFetch(url, { method });

  return data;
};

export const getTopGroups = async (page = 1, limit = 5) => {
  const url = `/group/top?page=${page}&limit=${limit}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const requestSocketConnection = async (type = '') => {
  const url = `/request-socket-connection?type=${type}`;
  const method = 'GET';

  const data = await doFetch(url, { method });

  return data;
};

export const getSitemap = async () => {
  const url = `/interaction/sitemap.xml`;
  const method = 'GET';

  const data = await doFetch(url, { method }, 'text');

  return data;
};
