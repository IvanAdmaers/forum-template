import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  FormGroup,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { changeColorTheme } from 'actions/settingsActions';

import MyLink from 'components/MyLink';
import Notifications from './Notifications';
import Search from './Search';
import { Avatar } from 'components/UserUI';

import { useNotifications } from 'hooks';
import { getSiteName } from 'utills';

import { USER_MODERATOR_ROLE, USER_BOSS_ROLE } from 'constants/user';

const siteName = getSiteName();

const Header = () => {
  const notification = useNotifications();

  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector(({ user }) => user);
  const { roles: userRoles, username, image } = user || {};
  const unreadChatsCount = useSelector(
    ({ personal }) => personal.unreadChats
  ).length;

  const theme = useSelector(({ settings }) => settings.theme);

  const menuAvatarElement =
    isLoggedIn && user ? (
      <Avatar image={image} username={username} />
    ) : (
      <AccountCircleIcon />
    );

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [navbarEl, setNavbarEl] = useState(null);
  const [darkTheme, setDarkTheme] = useState(theme === 'dark');

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNavbarOpen = Boolean(navbarEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavarOpen = (event) => {
    setNavbarEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleNavbarClose = () => {
    setNavbarEl(null);
  };

  const handleMobileMenuOpen = ({ currentTarget }) => {
    setMobileMoreAnchorEl(currentTarget);
  };

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim().length) {
      return notification('An empty search term has been set', 'error');
    }

    const url = `/search?q=${decodeURI(searchQuery)}`;

    return router.push(url);
  };

  const handleModeChange = ({ target }) => {
    dispatch(changeColorTheme());
    setDarkTheme(target.checked);
  };

  const menuId = 'primary-search-account-menu';

  const profileMenu = [
    { href: `/user/${username}`, label: 'Profile', loggedIn: true },
    { href: '/settings', label: 'Settings', loggedIn: true },
    { href: '/logout', label: 'Logout', loggedIn: true },
    { href: '/sign-up', label: 'Sign up', loggedIn: false },
    { href: '/login', label: 'Login', loggedIn: false },
  ];

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {profileMenu
        .filter(({ loggedIn }) => loggedIn === isLoggedIn)
        .map(({ label, href }, key) => {
          return (
            <li key={`menu-${key}`}>
              <MenuItem
                component={MyLink}
                href={href}
                onClick={handleMenuClose}
              >
                {label}
              </MenuItem>
            </li>
          );
        })}
      <MenuItem>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={darkTheme}
                onChange={handleModeChange}
                aria-label="login switch"
              />
            }
            label="Dark"
          />
        </FormGroup>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isLoggedIn && <Notifications mobile messages count={unreadChatsCount} />}
      {isLoggedIn && <Notifications mobile count={0} />}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          size="large"
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const navbarMenuId = 'primary-nav-menu';

  const navbarMenuItems = [
    {
      href: '/',
      text: 'Home',
    },
    {
      href: '/groups/top/1',
      text: 'Groups',
    },
  ];

  if (isLoggedIn) {
    const actionsForUsers = [
      {
        href: '/global-chat',
        text: 'General chat',
      },
      {
        href: '/post/create',
        text: 'Create post',
      },
      {
        href: '/group/create',
        text: 'Create group',
      },
    ];

    navbarMenuItems.push(...actionsForUsers);
  }

  if (isLoggedIn && userRoles?.includes(USER_MODERATOR_ROLE)) {
    const moderatorNavbarMenuItems = [
      {
        href: '/moderation/posts',
        text: 'Post moderation',
      },
      {
        href: '/moderation/comments',
        text: 'Comment moderation',
      },
    ];

    navbarMenuItems.push(...moderatorNavbarMenuItems);
  }

  if (isLoggedIn && userRoles?.includes(USER_BOSS_ROLE)) {
    const bossNavbarMenuItems = [
      {
        href: '/panel/premium-usernames',
        text: 'Premium usernames',
      },
    ];

    navbarMenuItems.push(...bossNavbarMenuItems);
  }

  const renderNavbar = (
    <Menu
      anchorEl={navbarEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={navbarMenuId}
      keepMounted
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={isNavbarOpen}
      onClose={handleNavbarClose}
    >
      <nav>
        {navbarMenuItems.map(({ href, text }, index) => {
          return (
            <MenuItem
              key={`header-navbar-menu-item-${index}`}
              component={MyLink}
              href={href}
              onClick={handleNavbarClose}
            >
              {text}
            </MenuItem>
          );
        })}
      </nav>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ marginRight: 2 }}
            color="inherit"
            aria-label="open drawer"
            onClick={handleNavarOpen}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={MyLink}
            href="/"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            variant="h6"
            noWrap
          >
            {siteName}
          </Typography>
          <Search
            value={searchQuery}
            onChange={handleSearchQuery}
            onSubmit={handleSearchSubmit}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isLoggedIn && <Notifications messages count={unreadChatsCount} />}
            {isLoggedIn && <Notifications count={0} />}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              size="large"
            >
              {menuAvatarElement}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              size="large"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderNavbar}
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;
