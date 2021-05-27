import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// TODO: Add localizer to get the user locales and adapt the translation

const resources = {
  en: {
    boxSettings: {
      boxName: 'Box Name',
      information: 'Information',
      settings: 'Box Settings',
      random: 'Pick Videos at Random',
      randomHelp: 'Videos will be played randomly from the queue',
      loop: 'Loop Queue',
      loopHelp: 'Played videos will be automatically requeued.',
      berries: 'Berries System',
      berriesHelp: 'Your users will be able to collect Berries while they are in your box. They will then be able to spend the berries to skip a video or select the next video to play.',
      private: 'Access Restriction',
      privateHelp: 'Your box will not appear publicly. You may grant access by sharing invite links.',
      durationRestriction: 'Duration Restriction',
      durationRestrictionHelp: 'Videos that exceed the set limit (in minutes) will not be accepted into the queue. Specifying 0 or nothing will disable this restriction.',
    },
    userSettings: {
      settings: 'Settings',
    },
    acl: {
      moderation: 'Moderation',
      helpPrompt: 'Need some help? Tap me!',
      customizableRoles: 'Customizable Roles',
      specialRoles: 'Special Roles',
      moderators: 'Moderators',
      moderatorsDescription: 'Use this role for users you trust. Moderators should be able to enforce your rules when you are not present in one of your boxes',
      vips: 'VIPs',
      vipDescription: 'Give this role to special users of your community',
      communityMembers: 'Community Members',
      communityDescription: 'This role is the default role automatically given to every member of your communities',
      boxCreator: 'Box Creator',
      boxDescription: 'THis role is the one you will have when youc reate a box. you cannot take it off ant it gives you all privileges at all times',
      staff: 'Staff',
      staffDescription: 'Staff members will always have all privileges. They will usually help you and your moderators',
      queueActions: 'Queue Actions',
      boxActions: 'Box Actions',
      userActions: 'User Actions',
      addVideo: 'Add video',
      addVideoDescription: 'Adds a video to the playing queue',
      bypassDurationRestriction: 'Bypass Duration Restriction',
      removeVideo: 'Remove video',
      skipVideo: 'Skip video',
      forceNext: 'Add video to Priority Queue',
      forcePlay: 'Force play a video',
      setVIP: 'Give VIP privileges',
      unsetVIP: 'Remove VIP privileges',
      inviteUser: 'Invite users to the box',
    },
    home: {
      boxes: 'Boxes',
      featured: 'Featured',
      communities: 'Communities',
      joinBox: 'Join a Box',
      joinBoxHelp: 'Have an invite link? Then come here!',
      createBox: 'Create a Box',
      createBoxHelp: 'Invite your friends and let the music play!',
      inviteLink: 'Paste your invite link here',
      inviteHelp: 'Invites look like this',
    },
    auth: {
      signupCTA: 'Sign up or login to create your own boxes, chat with users and more!',
      signup: 'Sign up',
      login: 'Log in',
      logout: 'Log out',
      welcomeBack: 'Welcome back!',
      emailAddress: 'Email address',
      password: 'Password',
      username: 'Username',
      newToBerrybox: 'New to Berrybox?',
      createAccount: 'Create your account',
    },
    queue: {
      search: 'Search',
      skip: 'Skip',
      playNext: 'Next',
      playNow: 'Now',
      remove: 'Remove',
      queueHelp: 'Tap a video for more info',
      queueEmpty: 'The queue is empty',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
