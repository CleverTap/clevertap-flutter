(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.clevertap = factory());
}(this, (function () { 'use strict';

  var id = 0;

  function _classPrivateFieldLooseKey(name) {
    return "__private_" + id++ + "_" + name;
  }

  function _classPrivateFieldLooseBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError("attempted to use private field on non-instance");
    }

    return receiver;
  }

  const TARGET_DOMAIN = 'clevertap-prod.com';
  const TARGET_PROTOCOL = 'https:';
  const DEFAULT_REGION = 'eu1';

  var _accountId = _classPrivateFieldLooseKey("accountId");

  var _region = _classPrivateFieldLooseKey("region");

  var _targetDomain = _classPrivateFieldLooseKey("targetDomain");

  var _dcSdkversion = _classPrivateFieldLooseKey("dcSdkversion");

  var _token = _classPrivateFieldLooseKey("token");

  class Account {
    constructor() {
      let {
        id
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      let targetDomain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TARGET_DOMAIN;
      let token = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      Object.defineProperty(this, _accountId, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _region, {
        writable: true,
        value: ''
      });
      Object.defineProperty(this, _targetDomain, {
        writable: true,
        value: TARGET_DOMAIN
      });
      Object.defineProperty(this, _dcSdkversion, {
        writable: true,
        value: ''
      });
      Object.defineProperty(this, _token, {
        writable: true,
        value: ''
      });
      this.id = id;

      if (region) {
        this.region = region;
      }

      if (targetDomain) {
        this.targetDomain = targetDomain;
      }

      if (token) {
        this.token = token;
      }
    }

    get id() {
      return _classPrivateFieldLooseBase(this, _accountId)[_accountId];
    }

    set id(accountId) {
      _classPrivateFieldLooseBase(this, _accountId)[_accountId] = accountId;
    }

    get region() {
      return _classPrivateFieldLooseBase(this, _region)[_region];
    }

    set region(region) {
      _classPrivateFieldLooseBase(this, _region)[_region] = region;
    }

    get dcSDKVersion() {
      return _classPrivateFieldLooseBase(this, _dcSdkversion)[_dcSdkversion];
    }

    set dcSDKVersion(dcSDKVersion) {
      _classPrivateFieldLooseBase(this, _dcSdkversion)[_dcSdkversion] = dcSDKVersion;
    }

    get targetDomain() {
      return _classPrivateFieldLooseBase(this, _targetDomain)[_targetDomain];
    }

    set targetDomain(targetDomain) {
      _classPrivateFieldLooseBase(this, _targetDomain)[_targetDomain] = targetDomain;
    }

    get token() {
      return _classPrivateFieldLooseBase(this, _token)[_token];
    }

    set token(token) {
      _classPrivateFieldLooseBase(this, _token)[_token] = token;
    }

    get finalTargetDomain() {
      if (this.region) {
        return "".concat(this.region, ".").concat(this.targetDomain);
      } else {
        if (this.targetDomain === TARGET_DOMAIN) {
          return "".concat(DEFAULT_REGION, ".").concat(this.targetDomain);
        }

        return this.targetDomain;
      }
    }

    get dataPostPEURL() {
      return "".concat(TARGET_PROTOCOL, "//").concat(this.finalTargetDomain, "/defineVars");
    }

    get dataPostURL() {
      return "".concat(TARGET_PROTOCOL, "//").concat(this.finalTargetDomain, "/a?t=96");
    }

    get recorderURL() {
      return "".concat(TARGET_PROTOCOL, "//").concat(this.finalTargetDomain, "/r?r=1");
    }

    get emailURL() {
      return "".concat(TARGET_PROTOCOL, "//").concat(this.finalTargetDomain, "/e?r=1");
    }

  }

  const unsupportedKeyCharRegex = new RegExp('^\\s+|\\\.|\:|\\\$|\'|\"|\\\\|\\s+$', 'g');
  const unsupportedValueCharRegex = new RegExp("^\\s+|\'|\"|\\\\|\\s+$", 'g');
  const singleQuoteRegex = new RegExp('\'', 'g');
  const CLEAR = 'clear';
  const CHARGED_ID = 'Charged ID';
  const CHARGEDID_COOKIE_NAME = 'WZRK_CHARGED_ID';
  const GCOOKIE_NAME = 'WZRK_G';
  const KCOOKIE_NAME = 'WZRK_K';
  const CAMP_COOKIE_NAME = 'WZRK_CAMP';
  const CAMP_COOKIE_G = 'WZRK_CAMP_G'; // cookie for storing campaign details against guid

  const SCOOKIE_PREFIX = 'WZRK_S';
  const SCOOKIE_EXP_TIME_IN_SECS = 60 * 20; // 20 mins

  const EV_COOKIE = 'WZRK_EV';
  const META_COOKIE = 'WZRK_META';
  const PR_COOKIE = 'WZRK_PR';
  const ARP_COOKIE = 'WZRK_ARP';
  const LCOOKIE_NAME = 'WZRK_L';
  const GLOBAL = 'global'; // used for email unsubscribe also
  const DISPLAY = 'display';
  const WEBPUSH_LS_KEY = 'WZRK_WPR';
  const OPTOUT_KEY = 'optOut';
  const CT_OPTOUT_KEY = 'ct_optout';
  const OPTOUT_COOKIE_ENDSWITH = ':OO';
  const USEIP_KEY = 'useIP';
  const LRU_CACHE = 'WZRK_X';
  const LRU_CACHE_SIZE = 100;
  const IS_OUL = 'isOUL';
  const EVT_PUSH = 'push';
  const EVT_PING = 'ping';
  const COOKIE_EXPIRY = 86400 * 365; // 1 Year in seconds

  const MAX_TRIES = 200; // API tries

  const FIRST_PING_FREQ_IN_MILLIS = 2 * 60 * 1000; // 2 mins

  const CONTINUOUS_PING_FREQ_IN_MILLIS = 5 * 60 * 1000; // 5 mins

  const GROUP_SUBSCRIPTION_REQUEST_ID = '2';
  const categoryLongKey = 'cUsY';
  const WZRK_PREFIX = 'wzrk_';
  const WZRK_ID = 'wzrk_id';
  const NOTIFICATION_VIEWED = 'Notification Viewed';
  const NOTIFICATION_CLICKED = 'Notification Clicked';
  const FIRE_PUSH_UNREGISTERED = 'WZRK_FPU';
  const PUSH_SUBSCRIPTION_DATA = 'WZRK_PSD'; // PUSH SUBSCRIPTION DATA FOR REGISTER/UNREGISTER TOKEN

  const COMMAND_INCREMENT = '$incr';
  const COMMAND_DECREMENT = '$decr';
  const COMMAND_SET = '$set';
  const COMMAND_ADD = '$add';
  const COMMAND_REMOVE = '$remove';
  const COMMAND_DELETE = '$delete';
  const WEBINBOX_CONFIG = 'WZRK_INBOX_CONFIG';
  const WEBINBOX = 'WZRK_INBOX';
  const MAX_INBOX_MSG = 15;
  const VARIABLES = 'WZRK_PE';
  const PUSH_DELAY_MS = 1000;
  const MAX_DELAY_FREQUENCY = 1000 * 60 * 10;
  const WZRK_FETCH = 'wzrk_fetch';
  const WEBPUSH_CONFIG = 'WZRK_PUSH_CONFIG';
  const SYSTEM_EVENTS = ['Stayed', 'UTM Visited', 'App Launched', 'Notification Sent', NOTIFICATION_VIEWED, NOTIFICATION_CLICKED];

  const isString = input => {
    return typeof input === 'string' || input instanceof String;
  };
  const isObject = input => {
    // TODO: refine
    return Object.prototype.toString.call(input) === '[object Object]';
  };
  const isDateObject = input => {
    return typeof input === 'object' && input instanceof Date;
  };
  const isObjectEmpty = obj => {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  };
  const isConvertibleToNumber = n => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  const isNumber = n => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n) && typeof n === 'number';
  };
  const isValueValid = value => {
    if (value === null || value === undefined || value === 'undefined') {
      return false;
    }

    return true;
  };
  const removeUnsupportedChars = (o, logger) => {
    // keys can't be greater than 1024 chars, values can't be greater than 1024 chars
    if (typeof o === 'object') {
      for (const key in o) {
        if (o.hasOwnProperty(key)) {
          const sanitizedVal = removeUnsupportedChars(o[key], logger);
          let sanitizedKey;
          sanitizedKey = sanitize(key, unsupportedKeyCharRegex);

          if (sanitizedKey.length > 1024) {
            sanitizedKey = sanitizedKey.substring(0, 1024);
            logger.reportError(520, sanitizedKey + '... length exceeded 1024 chars. Trimmed.');
          }

          delete o[key];
          o[sanitizedKey] = sanitizedVal;
        }
      }
    } else {
      let val;

      if (isString(o)) {
        val = sanitize(o, unsupportedValueCharRegex);

        if (val.length > 1024) {
          val = val.substring(0, 1024);
          logger.reportError(521, val + '... length exceeded 1024 chars. Trimmed.');
        }
      } else {
        val = o;
      }

      return val;
    }

    return o;
  };
  const sanitize = (input, regex) => {
    return input.replace(regex, '');
  };

  const getToday = () => {
    const today = new Date();
    return today.getFullYear() + '' + today.getMonth() + '' + today.getDay();
  };
  const getNow = () => {
    return Math.floor(new Date().getTime() / 1000);
  };
  const convertToWZRKDate = dateObj => {
    return '$D_' + Math.round(dateObj.getTime() / 1000);
  };
  const setDate = dt => {
    // expecting  yyyymmdd format either as a number or a string
    if (isDateValid(dt)) {
      return '$D_' + dt;
    }
  };
  const isDateValid = date => {
    const matches = /^(\d{4})(\d{2})(\d{2})$/.exec(date);
    if (matches == null) return false;
    const d = matches[3];
    const m = matches[2] - 1;
    const y = matches[1];
    const composedDate = new Date(y, m, d); // eslint-disable-next-line eqeqeq

    return composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
  };

  class StorageManager {
    static save(key, value) {
      if (!key || !value) {
        return false;
      }

      if (this._isLocalStorageSupported()) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return true;
      }
    }

    static read(key) {
      if (!key) {
        return false;
      }

      let data = null;

      if (this._isLocalStorageSupported()) {
        data = localStorage.getItem(key);
      }

      if (data != null) {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }

      return data;
    }

    static remove(key) {
      if (!key) {
        return false;
      }

      if (this._isLocalStorageSupported()) {
        localStorage.removeItem(key);
        return true;
      }
    }

    static removeCookie(name, domain) {
      let cookieStr = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      if (domain) {
        cookieStr = cookieStr + ' domain=' + domain + '; path=/';
      }

      document.cookie = cookieStr;
    }

    static createCookie(name, value, seconds, domain) {
      let expires = '';
      let domainStr = '';

      if (seconds) {
        const date = new Date();
        date.setTime(date.getTime() + seconds * 1000);
        expires = '; expires=' + date.toGMTString();
      }

      if (domain) {
        domainStr = '; domain=' + domain;
      }

      value = encodeURIComponent(value);
      document.cookie = name + '=' + value + expires + domainStr + '; path=/';
    }

    static readCookie(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');

      for (let idx = 0; idx < ca.length; idx++) {
        let c = ca[idx];

        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        } // eslint-disable-next-line eqeqeq


        if (c.indexOf(nameEQ) == 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }

      return null;
    }

    static _isLocalStorageSupported() {
      return 'localStorage' in window && window.localStorage !== null && typeof window.localStorage.setItem === 'function';
    }

    static saveToLSorCookie(property, value) {
      if (value == null) {
        return;
      }

      try {
        if (this._isLocalStorageSupported()) {
          this.save(property, encodeURIComponent(JSON.stringify(value)));
        } else {
          if (property === GCOOKIE_NAME) {
            this.createCookie(property, encodeURIComponent(value), 0, window.location.hostname);
          } else {
            this.createCookie(property, encodeURIComponent(JSON.stringify(value)), 0, window.location.hostname);
          }
        }

        $ct.globalCache[property] = value;
      } catch (e) {}
    }

    static readFromLSorCookie(property) {
      let data;

      if ($ct.globalCache.hasOwnProperty(property)) {
        return $ct.globalCache[property];
      }

      if (this._isLocalStorageSupported()) {
        data = this.read(property);
      } else {
        data = this.readCookie(property);
      }

      if (data !== null && data !== undefined && !(typeof data.trim === 'function' && data.trim() === '')) {
        let value;

        try {
          value = JSON.parse(decodeURIComponent(data));
        } catch (err) {
          value = decodeURIComponent(data);
        }

        $ct.globalCache[property] = value;
        return value;
      }
    }

    static createBroadCookie(name, value, seconds, domain) {
      // sets cookie on the base domain. e.g. if domain is baz.foo.bar.com, set cookie on ".bar.com"
      // To update an existing "broad domain" cookie, we need to know what domain it was actually set on.
      // since a retrieved cookie never tells which domain it was set on, we need to set another test cookie
      // to find out which "broadest" domain the cookie was set on. Then delete the test cookie, and use that domain
      // for updating the actual cookie.
      if (domain) {
        let broadDomain = $ct.broadDomain;

        if (broadDomain == null) {
          // if we don't know the broadDomain yet, then find out
          const domainParts = domain.split('.');
          let testBroadDomain = '';

          for (let idx = domainParts.length - 1; idx >= 0; idx--) {
            if (idx === 0) {
              testBroadDomain = domainParts[idx] + testBroadDomain;
            } else {
              testBroadDomain = '.' + domainParts[idx] + testBroadDomain;
            } // only needed if the cookie already exists and needs to be updated. See note above.


            if (this.readCookie(name)) {
              // no guarantee that browser will delete cookie, hence create short lived cookies
              var testCookieName = 'test_' + name + idx;
              this.createCookie(testCookieName, value, 10, testBroadDomain); // self-destruct after 10 seconds

              if (!this.readCookie(testCookieName)) {
                // if test cookie not set, then the actual cookie wouldn't have been set on this domain either.
                continue;
              } else {
                // else if cookie set, then delete the test and the original cookie
                this.removeCookie(testCookieName, testBroadDomain);
              }
            }

            this.createCookie(name, value, seconds, testBroadDomain);
            const tempCookie = this.readCookie(name); // eslint-disable-next-line eqeqeq

            if (tempCookie == value) {
              broadDomain = testBroadDomain;
              $ct.broadDomain = broadDomain;
              break;
            }
          }
        } else {
          this.createCookie(name, value, seconds, broadDomain);
        }
      } else {
        this.createCookie(name, value, seconds, domain);
      }
    }

    static getMetaProp(property) {
      const metaObj = this.readFromLSorCookie(META_COOKIE);

      if (metaObj != null) {
        return metaObj[property];
      }
    }

    static setMetaProp(property, value) {
      if (this._isLocalStorageSupported()) {
        let wzrkMetaObj = this.readFromLSorCookie(META_COOKIE);

        if (wzrkMetaObj == null) {
          wzrkMetaObj = {};
        }

        if (value === undefined) {
          delete wzrkMetaObj[property];
        } else {
          wzrkMetaObj[property] = value;
        }

        this.saveToLSorCookie(META_COOKIE, wzrkMetaObj);
      }
    }

    static getAndClearMetaProp(property) {
      const value = this.getMetaProp(property);
      this.setMetaProp(property, undefined);
      return value;
    }

    static setInstantDeleteFlagInK() {
      let k = this.readFromLSorCookie(KCOOKIE_NAME);

      if (k == null) {
        k = {};
      }

      k.flag = true;
      this.saveToLSorCookie(KCOOKIE_NAME, k);
    }

    static backupEvent(data, reqNo, logger) {
      let backupArr = this.readFromLSorCookie(LCOOKIE_NAME);

      if (typeof backupArr === 'undefined') {
        backupArr = {};
      }

      backupArr[reqNo] = {
        q: data
      };
      this.saveToLSorCookie(LCOOKIE_NAME, backupArr);
      logger.debug("stored in ".concat(LCOOKIE_NAME, " reqNo : ").concat(reqNo, " -> ").concat(data));
    }

    static removeBackup(respNo, logger) {
      const backupMap = this.readFromLSorCookie(LCOOKIE_NAME);

      if (typeof backupMap !== 'undefined' && backupMap !== null && typeof backupMap[respNo] !== 'undefined') {
        logger.debug("del event: ".concat(respNo, " data-> ").concat(backupMap[respNo].q));
        delete backupMap[respNo];
        this.saveToLSorCookie(LCOOKIE_NAME, backupMap);
      }
    }

  }
  const $ct = {
    globalCache: {
      gcookie: null,
      REQ_N: 0,
      RESP_N: 0
    },
    LRU_CACHE: null,
    globalProfileMap: undefined,
    globalEventsMap: undefined,
    blockRequest: false,
    isOptInRequest: false,
    broadDomain: null,
    webPushEnabled: null,
    campaignDivMap: {},
    currentSessionId: null,
    wiz_counter: 0,
    // to keep track of number of times we load the body
    notifApi: {
      notifEnabledFromApi: false
    },
    // helper variable to handle race condition and check when notifications were called
    unsubGroups: [],
    updatedCategoryLong: null,
    inbox: null,
    isPrivacyArrPushed: false,
    privacyArray: [],
    offline: false,
    location: null,
    dismissSpamControl: false,
    globalUnsubscribe: true,
    flutterVersion: null,
    variableStore: {},
    pushConfig: null // domain: window.location.hostname, url -> getHostName()
    // gcookie: -> device

  };

  var _keyOrder = _classPrivateFieldLooseKey("keyOrder");

  var _deleteFromObject = _classPrivateFieldLooseKey("deleteFromObject");

  class LRUCache {
    constructor(max) {
      Object.defineProperty(this, _deleteFromObject, {
        value: _deleteFromObject2
      });
      Object.defineProperty(this, _keyOrder, {
        writable: true,
        value: void 0
      });
      this.max = max;
      let lruCache = StorageManager.readFromLSorCookie(LRU_CACHE);

      if (lruCache) {
        const tempLruCache = {};
        _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder] = [];
        lruCache = lruCache.cache;

        for (const entry in lruCache) {
          if (lruCache.hasOwnProperty(entry)) {
            tempLruCache[lruCache[entry][0]] = lruCache[entry][1];

            _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder].push(lruCache[entry][0]);
          }
        }

        this.cache = tempLruCache;
      } else {
        this.cache = {};
        _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder] = [];
      }
    }

    get(key) {
      const item = this.cache[key];

      if (item) {
        this.cache = _classPrivateFieldLooseBase(this, _deleteFromObject)[_deleteFromObject](key, this.cache);
        this.cache[key] = item;

        _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder].push(key);
      }

      this.saveCacheToLS(this.cache);
      return item;
    }

    set(key, value) {
      const item = this.cache[key];

      const allKeys = _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder];

      if (item != null) {
        this.cache = _classPrivateFieldLooseBase(this, _deleteFromObject)[_deleteFromObject](key, this.cache);
      } else if (allKeys.length === this.max) {
        this.cache = _classPrivateFieldLooseBase(this, _deleteFromObject)[_deleteFromObject](allKeys[0], this.cache);
      }

      this.cache[key] = value;

      if (_classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder][_classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder] - 1] !== key) {
        _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder].push(key);
      }

      this.saveCacheToLS(this.cache);
    }

    saveCacheToLS(cache) {
      const objToArray = [];

      const allKeys = _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder];

      for (const index in allKeys) {
        if (allKeys.hasOwnProperty(index)) {
          const temp = [];
          temp.push(allKeys[index]);
          temp.push(cache[allKeys[index]]);
          objToArray.push(temp);
        }
      }

      StorageManager.saveToLSorCookie(LRU_CACHE, {
        cache: objToArray
      });
    }

    getKey(value) {
      if (value === null) {
        return null;
      }

      const allKeys = _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder];

      for (const index in allKeys) {
        if (allKeys.hasOwnProperty(index)) {
          if (this.cache[allKeys[index]] === value) {
            return allKeys[index];
          }
        }
      }

      return null;
    }

    getSecondLastKey() {
      const keysArr = _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder];

      if (keysArr != null && keysArr.length > 1) {
        return keysArr[keysArr.length - 2];
      }

      return -1;
    }

    getLastKey() {
      const keysLength = _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder].length;

      if (keysLength) {
        return _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder][keysLength - 1];
      }
    }

  }

  var _deleteFromObject2 = function _deleteFromObject2(key, obj) {
    const allKeys = JSON.parse(JSON.stringify(_classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder]));
    const newCache = {};
    let indexToDelete;

    for (const index in allKeys) {
      if (allKeys.hasOwnProperty(index)) {
        if (allKeys[index] !== key) {
          newCache[allKeys[index]] = obj[allKeys[index]];
        } else {
          indexToDelete = index;
        }
      }
    }

    allKeys.splice(indexToDelete, 1);
    _classPrivateFieldLooseBase(this, _keyOrder)[_keyOrder] = JSON.parse(JSON.stringify(allKeys));
    return newCache;
  };

  var _logger = _classPrivateFieldLooseKey("logger");

  var _request = _classPrivateFieldLooseKey("request");

  var _device = _classPrivateFieldLooseKey("device");

  var _session = _classPrivateFieldLooseKey("session");

  class CleverTapAPI {
    constructor(_ref) {
      let {
        logger,
        request,
        device,
        session
      } = _ref;
      Object.defineProperty(this, _logger, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _device, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger)[_logger] = logger;
      _classPrivateFieldLooseBase(this, _request)[_request] = request;
      _classPrivateFieldLooseBase(this, _device)[_device] = device;
      _classPrivateFieldLooseBase(this, _session)[_session] = session;
    }
    /**
     *
     * @param {string} global gcookie
     * @param {string} session
     * @param {boolean} resume sent true in case of an OUL request from client side, which is returned as it is by server
     * @param {number} respNumber the index of the request in backupmanager
     * @param {boolean} optOutResponse
     * @returns
     */


    s(global, session, resume, respNumber, optOutResponse) {
      let oulReq = false;
      let newGuid = false; // for a scenario when OUL request is true from client side
      // but resume is returned as false from server end
      // we maintan a OulReqN var in the window object
      // and compare with respNumber to determine the response of an OUL request

      if (window.isOULInProgress) {
        if (resume || respNumber !== 'undefined' && respNumber === window.oulReqN) {
          window.isOULInProgress = false;
          oulReq = true;
        }
      } // call back function used to store global and session ids for the user


      if (typeof respNumber === 'undefined') {
        respNumber = 0;
      }

      StorageManager.removeBackup(respNumber, _classPrivateFieldLooseBase(this, _logger)[_logger]);

      if (respNumber > $ct.globalCache.REQ_N) {
        // request for some other user so ignore
        return;
      }

      if (!isValueValid(_classPrivateFieldLooseBase(this, _device)[_device].gcookie)) {
        if (global) {
          newGuid = true;
        }
      }

      if (!isValueValid(_classPrivateFieldLooseBase(this, _device)[_device].gcookie) || resume || typeof optOutResponse === 'boolean') {
        const sessionObj = _classPrivateFieldLooseBase(this, _session)[_session].getSessionCookieObject();
        /*  If the received session is less than the session in the cookie,
            then don't update guid as it will be response for old request
        */


        if (window.isOULInProgress || sessionObj.s && session < sessionObj.s) {
          return;
        }

        _classPrivateFieldLooseBase(this, _logger)[_logger].debug("Cookie was ".concat(_classPrivateFieldLooseBase(this, _device)[_device].gcookie, " set to ").concat(global));

        _classPrivateFieldLooseBase(this, _device)[_device].gcookie = global;

        if (!isValueValid(_classPrivateFieldLooseBase(this, _device)[_device].gcookie)) {
          // clear useIP meta prop
          StorageManager.getAndClearMetaProp(USEIP_KEY);
        }

        if (global && StorageManager._isLocalStorageSupported()) {
          if ($ct.LRU_CACHE == null) {
            $ct.LRU_CACHE = new LRUCache(LRU_CACHE_SIZE);
          }

          const kIdFromLS = StorageManager.readFromLSorCookie(KCOOKIE_NAME);
          let guidFromLRUCache;

          if (kIdFromLS != null && kIdFromLS.id) {
            guidFromLRUCache = $ct.LRU_CACHE.cache[kIdFromLS.id];

            if (resume) {
              if (!guidFromLRUCache) {
                StorageManager.saveToLSorCookie(FIRE_PUSH_UNREGISTERED, true); // replace login identity in OUL request
                // with the gcookie returned in exchange

                $ct.LRU_CACHE.set(kIdFromLS.id, global);
              }
            }
          }

          StorageManager.saveToLSorCookie(GCOOKIE_NAME, global); // lastk provides the guid

          const lastK = $ct.LRU_CACHE.getSecondLastKey();

          if (StorageManager.readFromLSorCookie(FIRE_PUSH_UNREGISTERED) && lastK !== -1) {
            const lastGUID = $ct.LRU_CACHE.cache[lastK]; // fire the request directly via fireRequest to unregister the token
            // then other requests with the updated guid should follow

            _classPrivateFieldLooseBase(this, _request)[_request].unregisterTokenForGuid(lastGUID);
          }
        }

        StorageManager.createBroadCookie(GCOOKIE_NAME, global, COOKIE_EXPIRY, window.location.hostname);
        StorageManager.saveToLSorCookie(GCOOKIE_NAME, global);
      }

      if (StorageManager._isLocalStorageSupported()) {
        _classPrivateFieldLooseBase(this, _session)[_session].manageSession(session);
      } // session cookie


      const obj = _classPrivateFieldLooseBase(this, _session)[_session].getSessionCookieObject(); // for the race-condition where two responses come back with different session ids. don't write the older session id.


      if (typeof obj.s === 'undefined' || obj.s <= session) {
        obj.s = session;
        obj.t = getNow(); // time of last response from server

        _classPrivateFieldLooseBase(this, _session)[_session].setSessionCookieObject(obj);
      } // set blockRequest to false only if the device has a valid gcookie


      if (isValueValid(_classPrivateFieldLooseBase(this, _device)[_device].gcookie)) {
        $ct.blockRequest = false;
      } // only process the backup events after an OUL request or a new guid is recieved


      if ((oulReq || newGuid) && !_classPrivateFieldLooseBase(this, _request)[_request].processingBackup) {
        _classPrivateFieldLooseBase(this, _request)[_request].processBackupEvents();
      }

      $ct.globalCache.RESP_N = respNumber;
    }

  }

  var _logger$1 = _classPrivateFieldLooseKey("logger");

  class DeviceManager {
    constructor(_ref) {
      let {
        logger
      } = _ref;
      Object.defineProperty(this, _logger$1, {
        writable: true,
        value: void 0
      });
      this.gcookie = void 0;
      _classPrivateFieldLooseBase(this, _logger$1)[_logger$1] = logger;
      this.gcookie = this.getGuid();
    }

    getGuid() {
      let guid = null;

      if (isValueValid(this.gcookie)) {
        return this.gcookie;
      }

      if (StorageManager._isLocalStorageSupported()) {
        const value = StorageManager.read(GCOOKIE_NAME);

        if (isValueValid(value)) {
          try {
            guid = JSON.parse(decodeURIComponent(value));
          } catch (e) {
            _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].debug('Cannot parse Gcookie from localstorage - must be encoded ' + value); // assumming guids are of size 32. supporting both formats.
            // guid can have encodedURIComponent or be without it.
            // 1.56e4078ed15749928c042479ec2b4d47 - breaks on JSON.parse(decodeURIComponent())
            // 2.%2256e4078ed15749928c042479ec2b4d47%22


            if (value.length === 32) {
              guid = value;
              StorageManager.saveToLSorCookie(GCOOKIE_NAME, value);
            } else {
              _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error('Illegal guid ' + value);
            }
          } // Persist to cookie storage if not present there.


          if (isValueValid(guid)) {
            StorageManager.createBroadCookie(GCOOKIE_NAME, guid, COOKIE_EXPIRY, window.location.hostname);
          }
        }
      }

      if (!isValueValid(guid)) {
        guid = StorageManager.readCookie(GCOOKIE_NAME);

        if (isValueValid(guid) && (guid.indexOf('%') === 0 || guid.indexOf('\'') === 0 || guid.indexOf('"') === 0)) {
          guid = null;
        }

        if (isValueValid(guid)) {
          StorageManager.saveToLSorCookie(GCOOKIE_NAME, guid);
        }
      }

      return guid;
    }

  }

  const DATA_NOT_SENT_TEXT = 'This property has been ignored.';
  const CLEVERTAP_ERROR_PREFIX = 'CleverTap error:'; // Formerly wzrk_error_txt

  const EMBED_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Incorrect embed script.");
  const EVENT_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Event structure not valid. ").concat(DATA_NOT_SENT_TEXT);
  const GENDER_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Gender value should be either M or F. ").concat(DATA_NOT_SENT_TEXT);
  const EMPLOYED_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Employed value should be either Y or N. ").concat(DATA_NOT_SENT_TEXT);
  const MARRIED_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Married value should be either Y or N. ").concat(DATA_NOT_SENT_TEXT);
  const EDUCATION_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Education value should be either School, College or Graduate. ").concat(DATA_NOT_SENT_TEXT);
  const AGE_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Age value should be a number. ").concat(DATA_NOT_SENT_TEXT);
  const DOB_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " DOB value should be a Date Object");
  const ENUM_FORMAT_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " setEnum(value). value should be a string or a number");
  const PHONE_FORMAT_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Phone number should be formatted as +[country code][number]");

  let _globalChargedId;

  const isEventStructureFlat = eventObj => {
    // Events cannot have nested structure or Arrays
    if (isObject(eventObj)) {
      for (var key in eventObj) {
        if (eventObj.hasOwnProperty(key)) {
          if (isObject(eventObj[key]) || Array.isArray(eventObj[key])) {
            return false;
          } else if (isDateObject(eventObj[key])) {
            eventObj[key] = convertToWZRKDate(eventObj[key]);
          }
        }
      }

      return true;
    }

    return false;
  };
  const isChargedEventStructureValid = (chargedObj, logger) => {
    if (isObject(chargedObj)) {
      for (var key in chargedObj) {
        if (chargedObj.hasOwnProperty(key)) {
          if (key === 'Items') {
            if (!Array.isArray(chargedObj[key])) {
              return false;
            }

            if (chargedObj[key].length > 50) {
              logger.reportError(522, 'Charged Items exceed 50 limit. Actual count: ' + chargedObj[key].length);
            }

            for (var itemKey in chargedObj[key]) {
              if (chargedObj[key].hasOwnProperty(itemKey)) {
                // since default array implementation could be overridden - e.g. Teabox site
                if (!isObject(chargedObj[key][itemKey]) || !isEventStructureFlat(chargedObj[key][itemKey])) {
                  return false;
                }
              }
            }
          } else {
            if (isObject(chargedObj[key]) || Array.isArray(chargedObj[key])) {
              return false;
            } else if (isDateObject(chargedObj[key])) {
              chargedObj[key] = convertToWZRKDate(chargedObj[key]);
            }
          }
        }
      }

      if (isString(chargedObj[CHARGED_ID]) || isNumber(chargedObj[CHARGED_ID])) {
        // save charged Id
        const chargedId = chargedObj[CHARGED_ID] + ''; // casting chargedId to string

        if (typeof _globalChargedId === 'undefined') {
          _globalChargedId = StorageManager.readFromLSorCookie(CHARGEDID_COOKIE_NAME);
        }

        if (typeof _globalChargedId !== 'undefined' && _globalChargedId.trim() === chargedId.trim()) {
          // drop event- duplicate charged id
          logger.error('Duplicate charged Id - Dropped' + chargedObj);
          return false;
        }

        _globalChargedId = chargedId;
        StorageManager.saveToLSorCookie(CHARGEDID_COOKIE_NAME, chargedId);
      }

      return true;
    } // if object (chargedObject)


    return false;
  };

  var _logger$2 = _classPrivateFieldLooseKey("logger");

  var _oldValues = _classPrivateFieldLooseKey("oldValues");

  var _request$1 = _classPrivateFieldLooseKey("request");

  var _isPersonalisationActive = _classPrivateFieldLooseKey("isPersonalisationActive");

  var _processEventArray = _classPrivateFieldLooseKey("processEventArray");

  class EventHandler extends Array {
    constructor(_ref, values) {
      let {
        logger,
        request,
        isPersonalisationActive
      } = _ref;
      super();
      Object.defineProperty(this, _processEventArray, {
        value: _processEventArray2
      });
      Object.defineProperty(this, _logger$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger$2)[_logger$2] = logger;
      _classPrivateFieldLooseBase(this, _oldValues)[_oldValues] = values;
      _classPrivateFieldLooseBase(this, _request$1)[_request$1] = request;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive)[_isPersonalisationActive] = isPersonalisationActive;
    }

    push() {
      for (var _len = arguments.length, eventsArr = new Array(_len), _key = 0; _key < _len; _key++) {
        eventsArr[_key] = arguments[_key];
      }

      _classPrivateFieldLooseBase(this, _processEventArray)[_processEventArray](eventsArr);

      return 0;
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues)[_oldValues]) {
        _classPrivateFieldLooseBase(this, _processEventArray)[_processEventArray](_classPrivateFieldLooseBase(this, _oldValues)[_oldValues]);
      }

      _classPrivateFieldLooseBase(this, _oldValues)[_oldValues] = null;
    }

    getDetails(evtName) {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive)[_isPersonalisationActive]()) {
        return;
      }

      if (typeof $ct.globalEventsMap === 'undefined') {
        $ct.globalEventsMap = StorageManager.readFromLSorCookie(EV_COOKIE);
      }

      if (typeof $ct.globalEventsMap === 'undefined') {
        return;
      }

      const evtObj = $ct.globalEventsMap[evtName];
      const respObj = {};

      if (typeof evtObj !== 'undefined') {
        respObj.firstTime = new Date(evtObj[1] * 1000);
        respObj.lastTime = new Date(evtObj[2] * 1000);
        respObj.count = evtObj[0];
        return respObj;
      }
    }

  }

  var _processEventArray2 = function _processEventArray2(eventsArr) {
    if (Array.isArray(eventsArr)) {
      while (eventsArr.length > 0) {
        var eventName = eventsArr.shift();

        if (!isString(eventName)) {
          _classPrivateFieldLooseBase(this, _logger$2)[_logger$2].error(EVENT_ERROR);

          continue;
        }

        if (eventName.length > 1024) {
          eventName = eventName.substring(0, 1024);

          _classPrivateFieldLooseBase(this, _logger$2)[_logger$2].reportError(510, eventName + '... length exceeded 1024 chars. Trimmed.');
        }

        if (SYSTEM_EVENTS.includes(eventName)) {
          _classPrivateFieldLooseBase(this, _logger$2)[_logger$2].reportError(513, eventName + ' is a restricted system event. It cannot be used as an event name.');

          continue;
        }

        const data = {};
        data.type = 'event';
        data.evtName = sanitize(eventName, unsupportedKeyCharRegex);

        if (eventsArr.length !== 0) {
          const eventObj = eventsArr.shift();

          if (!isObject(eventObj)) {
            // put it back if it is not an object
            eventsArr.unshift(eventObj);
          } else {
            // check Charged Event vs. other events.
            if (eventName === 'Charged') {
              if (!isChargedEventStructureValid(eventObj, _classPrivateFieldLooseBase(this, _logger$2)[_logger$2])) {
                _classPrivateFieldLooseBase(this, _logger$2)[_logger$2].reportError(511, 'Charged event structure invalid. Not sent.');

                continue;
              }
            } else {
              if (!isEventStructureFlat(eventObj)) {
                _classPrivateFieldLooseBase(this, _logger$2)[_logger$2].reportError(512, eventName + ' event structure invalid. Not sent.');

                continue;
              }
            }

            data.evtData = eventObj;
          }
        }

        _classPrivateFieldLooseBase(this, _request$1)[_request$1].processEvent(data);
      }
    }
  };

  const getURLParams = url => {
    const urlParams = {};
    const idx = url.indexOf('?');

    if (idx > 1) {
      const uri = url.substring(idx + 1);
      let match;
      const pl = /\+/g; // Regex for replacing addition symbol with a space

      const search = /([^&=]+)=?([^&]*)/g;

      const decode = function (s) {
        let replacement = s.replace(pl, ' ');

        try {
          replacement = decodeURIComponent(replacement);
        } catch (e) {// eat
        }

        return replacement;
      };

      match = search.exec(uri);

      while (match) {
        urlParams[decode(match[1])] = decode(match[2]);
        match = search.exec(uri);
      }
    }

    return urlParams;
  };
  const getDomain = url => {
    if (url === '') return '';
    var a = document.createElement('a');
    a.href = url;
    return a.hostname;
  };
  const addToURL = (url, k, v) => {
    return url + '&' + k + '=' + encodeURIComponent(v);
  };
  const getHostName = () => {
    return window.location.hostname;
  };

  /* eslint-disable */
  const urlBase64ToUint8Array = base64String => {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    let rawData = window.atob(base64);
    let processedData = [];

    for (let i = 0; i < rawData.length; i++) {
      processedData.push(rawData.charCodeAt(i));
    }

    return new Uint8Array(processedData);
  };
  const compressData = (dataObject, logger) => {
    logger && typeof logger.debug === 'function' && logger.debug('dobj:' + dataObject);
    return compressToBase64(dataObject);
  };
  const compress = uncompressed => {
    if (uncompressed == null) return '';
    let i,
        value,
        context_dictionary = {},
        context_dictionaryToCreate = {},
        context_c = '',
        context_wc = '',
        context_w = '',
        context_enlargeIn = 2,
        // Compensate for the first entry which should not count
    context_dictSize = 3,
        context_numBits = 2,
        context_data_string = '',
        context_data_val = 0,
        context_data_position = 0,
        ii,
        f = String.fromCharCode;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);

      if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;

      if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;

              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }

            value = context_w.charCodeAt(0);

            for (i = 0; i < 8; i++) {
              context_data_val = context_data_val << 1 | value & 1;

              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }

              value = value >> 1;
            }
          } else {
            value = 1;

            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value;

              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }

              value = 0;
            }

            value = context_w.charCodeAt(0);

            for (i = 0; i < 16; i++) {
              context_data_val = context_data_val << 1 | value & 1;

              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }

              value = value >> 1;
            }
          }

          context_enlargeIn--;

          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }

          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];

          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = value >> 1;
          }
        }

        context_enlargeIn--;

        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        } // Add wc to the dictionary.


        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    } // Output the code for w.


    if (context_w !== '') {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;

            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }

          value = context_w.charCodeAt(0);

          for (i = 0; i < 8; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = value >> 1;
          }
        } else {
          value = 1;

          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value;

            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = 0;
          }

          value = context_w.charCodeAt(0);

          for (i = 0; i < 16; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = value >> 1;
          }
        }

        context_enlargeIn--;

        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }

        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];

        for (i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1 | value & 1;

          if (context_data_position == 15) {
            context_data_position = 0;
            context_data_string += f(context_data_val);
            context_data_val = 0;
          } else {
            context_data_position++;
          }

          value = value >> 1;
        }
      }

      context_enlargeIn--;

      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    } // Mark the end of the stream


    value = 2;

    for (i = 0; i < context_numBits; i++) {
      context_data_val = context_data_val << 1 | value & 1;

      if (context_data_position == 15) {
        context_data_position = 0;
        context_data_string += f(context_data_val);
        context_data_val = 0;
      } else {
        context_data_position++;
      }

      value = value >> 1;
    } // Flush the last char


    while (true) {
      context_data_val = context_data_val << 1;

      if (context_data_position == 15) {
        context_data_string += f(context_data_val);
        break;
      } else context_data_position++;
    }

    return context_data_string;
  };
  const getKeyStr = () => {
    let key = '';
    let i = 0;

    for (i = 0; i <= 25; i++) {
      key = key + String.fromCharCode(i + 65);
    }

    for (i = 0; i <= 25; i++) {
      key = key + String.fromCharCode(i + 97);
    }

    for (i = 0; i < 10; i++) {
      key = key + i;
    }

    return key + '+/=';
  };

  const _keyStr = getKeyStr();
  const compressToBase64 = input => {
    if (input == null) return '';
    var output = '';
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = compress(input);

    while (i < input.length * 2) {
      if (i % 2 == 0) {
        chr1 = input.charCodeAt(i / 2) >> 8;
        chr2 = input.charCodeAt(i / 2) & 255;
        if (i / 2 + 1 < input.length) chr3 = input.charCodeAt(i / 2 + 1) >> 8;else chr3 = NaN;
      } else {
        chr1 = input.charCodeAt((i - 1) / 2) & 255;

        if ((i + 1) / 2 < input.length) {
          chr2 = input.charCodeAt((i + 1) / 2) >> 8;
          chr3 = input.charCodeAt((i + 1) / 2) & 255;
        } else chr2 = chr3 = NaN;
      }

      i += 3;
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }

    return output;
  };

  var _fireRequest = _classPrivateFieldLooseKey("fireRequest");

  var _dropRequestDueToOptOut = _classPrivateFieldLooseKey("dropRequestDueToOptOut");

  var _addUseIPToRequest = _classPrivateFieldLooseKey("addUseIPToRequest");

  var _addARPToRequest = _classPrivateFieldLooseKey("addARPToRequest");

  class RequestDispatcher {
    constructor() {
      this.networkRetryCount = 0;
      this.minDelayFrequency = 0;
    }

    /**
     *
     * @param {string} url
     * @param {*} skipARP
     * @param {boolean} sendOULFlag
     */
    static fireRequest(url, skipARP, sendOULFlag, evtName) {
      _classPrivateFieldLooseBase(this, _fireRequest)[_fireRequest](url, 1, skipARP, sendOULFlag, evtName);
    }

    getDelayFrequency() {
      this.logger.debug('Network retry #' + this.networkRetryCount); // Retry with delay as 1s for first 10 retries

      if (this.networkRetryCount < 10) {
        this.logger.debug(this.account.id, 'Failure count is ' + this.networkRetryCount + '. Setting delay frequency to 1s');
        this.minDelayFrequency = PUSH_DELAY_MS; // Reset minimum delay to 1s

        return this.minDelayFrequency;
      }

      if (this.account.region == null) {
        // Retry with delay as 1s if region is null in case of eu1
        this.logger.debug(this.account.id, 'Setting delay frequency to 1s');
        return PUSH_DELAY_MS;
      } else {
        // Retry with delay as minimum delay frequency and add random number of seconds to scatter traffic
        const randomDelay = (Math.floor(Math.random() * 10) + 1) * 1000;
        this.minDelayFrequency += randomDelay;

        if (this.minDelayFrequency < MAX_DELAY_FREQUENCY) {
          this.logger.debug(this.account.id, 'Setting delay frequency to ' + this.minDelayFrequency);
          return this.minDelayFrequency;
        } else {
          this.minDelayFrequency = PUSH_DELAY_MS;
        }

        this.logger.debug(this.account.id, 'Setting delay frequency to ' + this.minDelayFrequency);
        return this.minDelayFrequency;
      }
    }

  }

  var _addARPToRequest2 = function _addARPToRequest2(url, skipResARP) {
    if (skipResARP === true) {
      const _arp = {};
      _arp.skipResARP = true;
      return addToURL(url, 'arp', compressData(JSON.stringify(_arp), this.logger));
    }

    if (StorageManager._isLocalStorageSupported() && typeof localStorage.getItem(ARP_COOKIE) !== 'undefined' && localStorage.getItem(ARP_COOKIE) !== null) {
      return addToURL(url, 'arp', compressData(JSON.stringify(StorageManager.readFromLSorCookie(ARP_COOKIE)), this.logger));
    }

    return url;
  };

  var _addUseIPToRequest2 = function _addUseIPToRequest2(pageLoadUrl) {
    var useIP = StorageManager.getMetaProp(USEIP_KEY);

    if (typeof useIP !== 'boolean') {
      useIP = false;
    }

    return addToURL(pageLoadUrl, USEIP_KEY, useIP ? 'true' : 'false');
  };

  var _dropRequestDueToOptOut2 = function _dropRequestDueToOptOut2() {
    if ($ct.isOptInRequest || !isValueValid(this.device.gcookie) || !isString(this.device.gcookie)) {
      $ct.isOptInRequest = false;
      return false;
    }

    return this.device.gcookie.slice(-3) === OPTOUT_COOKIE_ENDSWITH;
  };

  var _fireRequest2 = function _fireRequest2(url, tries, skipARP, sendOULFlag, evtName) {
    var _window$clevertap, _window$wizrocket;

    if (_classPrivateFieldLooseBase(this, _dropRequestDueToOptOut)[_dropRequestDueToOptOut]()) {
      this.logger.debug('req dropped due to optout cookie: ' + this.device.gcookie);
      return;
    } // set a request in progress
    // so that if gcookie is not present, no other request can be made asynchronusly


    if (!isValueValid(this.device.gcookie)) {
      $ct.blockRequest = true;
    }
    /**
     * if the gcookie is null
     * and the request is not the first request
     * and the tries are less than max tries
     * keep retrying
     */


    if (evtName && evtName === WZRK_FETCH) {
      // New retry mechanism
      if (!isValueValid(this.device.gcookie) && $ct.globalCache.RESP_N < $ct.globalCache.REQ_N - 1) {
        setTimeout(() => {
          this.logger.debug("retrying fire request for url: ".concat(url, ", tries: ").concat(this.networkRetryCount));

          _classPrivateFieldLooseBase(this, _fireRequest)[_fireRequest](url, undefined, skipARP, sendOULFlag);
        }, this.getDelayFrequency());
      }
    } else {
      if (!isValueValid(this.device.gcookie) && $ct.globalCache.RESP_N < $ct.globalCache.REQ_N - 1 && tries < MAX_TRIES) {
        // if ongoing First Request is in progress, initiate retry
        setTimeout(() => {
          this.logger.debug("retrying fire request for url: ".concat(url, ", tries: ").concat(tries));

          _classPrivateFieldLooseBase(this, _fireRequest)[_fireRequest](url, tries + 1, skipARP, sendOULFlag);
        }, 50);
        return;
      }
    } // set isOULInProgress to true
    // when sendOULFlag is set to true


    if (!sendOULFlag) {
      if (isValueValid(this.device.gcookie)) {
        // add gcookie to url
        url = addToURL(url, 'gc', this.device.gcookie);
      }

      url = _classPrivateFieldLooseBase(this, _addARPToRequest)[_addARPToRequest](url, skipARP);
    } else {
      window.isOULInProgress = true;
    }

    url = addToURL(url, 'tries', tries); // Add tries to URL

    url = _classPrivateFieldLooseBase(this, _addUseIPToRequest)[_addUseIPToRequest](url);
    url = addToURL(url, 'r', new Date().getTime()); // add epoch to beat caching of the URL
    // TODO: Figure out a better way to handle plugin check

    if (((_window$clevertap = window.clevertap) === null || _window$clevertap === void 0 ? void 0 : _window$clevertap.hasOwnProperty('plugin')) || ((_window$wizrocket = window.wizrocket) === null || _window$wizrocket === void 0 ? void 0 : _window$wizrocket.hasOwnProperty('plugin'))) {
      // used to add plugin name in request parameter
      const plugin = window.clevertap.plugin || window.wizrocket.plugin;
      url = addToURL(url, 'ct_pl', plugin);
    }

    if (url.indexOf('chrome-extension:') !== -1) {
      url = url.replace('chrome-extension:', 'https:');
    } // TODO: Try using Function constructor instead of appending script.


    var ctCbScripts = document.getElementsByClassName('ct-jp-cb');

    while (ctCbScripts[0] && ctCbScripts[0].parentNode) {
      ctCbScripts[0].parentNode.removeChild(ctCbScripts[0]);
    }

    const s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', url);
    s.setAttribute('class', 'ct-jp-cb');
    s.setAttribute('rel', 'nofollow');
    s.async = true;
    document.getElementsByTagName('head')[0].appendChild(s);
    this.logger.debug('req snt -> url: ' + url);
  };

  RequestDispatcher.logger = void 0;
  RequestDispatcher.device = void 0;
  RequestDispatcher.account = void 0;
  Object.defineProperty(RequestDispatcher, _fireRequest, {
    value: _fireRequest2
  });
  Object.defineProperty(RequestDispatcher, _dropRequestDueToOptOut, {
    value: _dropRequestDueToOptOut2
  });
  Object.defineProperty(RequestDispatcher, _addUseIPToRequest, {
    value: _addUseIPToRequest2
  });
  Object.defineProperty(RequestDispatcher, _addARPToRequest, {
    value: _addARPToRequest2
  });

  // CleverTap specific utilities
  const getCampaignObject = () => {
    let finalcampObj = {};

    if (StorageManager._isLocalStorageSupported()) {
      let campObj = StorageManager.read(CAMP_COOKIE_NAME);

      if (campObj != null) {
        campObj = JSON.parse(decodeURIComponent(campObj).replace(singleQuoteRegex, '\"'));

        if (campObj.hasOwnProperty('global')) {
          finalcampObj.wp = campObj;
        } else {
          finalcampObj = campObj;
        }
      } else {
        finalcampObj = {};
      }
    }

    return finalcampObj;
  };
  const saveCampaignObject = campaignObj => {
    if (StorageManager._isLocalStorageSupported()) {
      const newObj = { ...getCampaignObject(),
        ...campaignObj
      };
      const campObj = JSON.stringify(newObj);
      StorageManager.save(CAMP_COOKIE_NAME, encodeURIComponent(campObj)); // Update the CAMP_COOKIE_G to be in sync with CAMP_COOKIE_NAME

      setCampaignObjectForGuid();
    }
  }; // set Campaign Object against the guid, with daily count and total count details

  const setCampaignObjectForGuid = () => {
    if (StorageManager._isLocalStorageSupported()) {
      let guid = StorageManager.read(GCOOKIE_NAME);

      if (isValueValid(guid)) {
        try {
          guid = JSON.parse(decodeURIComponent(StorageManager.read(GCOOKIE_NAME)));
          const guidCampObj = StorageManager.read(CAMP_COOKIE_G) ? JSON.parse(decodeURIComponent(StorageManager.read(CAMP_COOKIE_G))) : {};

          if (guid && StorageManager._isLocalStorageSupported()) {
            var finalCampObj = {};
            var campObj = getCampaignObject();
            Object.keys(campObj).forEach(key => {
              const campKeyObj = guid in guidCampObj && Object.keys(guidCampObj[guid]).length && guidCampObj[guid][key] ? guidCampObj[guid][key] : {};
              const globalObj = campObj[key].global;
              const today = getToday();
              const dailyObj = campObj[key][today];

              if (typeof globalObj !== 'undefined') {
                const campaignIdArray = Object.keys(globalObj);

                for (const index in campaignIdArray) {
                  let resultObj = [];

                  if (campaignIdArray.hasOwnProperty(index)) {
                    let dailyC = 0;
                    let totalC = 0;
                    const campaignId = campaignIdArray[index];

                    if (campaignId === 'tc') {
                      continue;
                    }

                    if (typeof dailyObj !== 'undefined' && typeof dailyObj[campaignId] !== 'undefined') {
                      dailyC = dailyObj[campaignId];
                    }

                    if (typeof globalObj !== 'undefined' && typeof globalObj[campaignId] !== 'undefined') {
                      totalC = globalObj[campaignId];
                    }

                    resultObj = [campaignId, dailyC, totalC];
                    campKeyObj[campaignId] = resultObj;
                  }
                }
              }

              finalCampObj = { ...finalCampObj,
                [key]: campKeyObj
              };
            });
            guidCampObj[guid] = finalCampObj;
            StorageManager.save(CAMP_COOKIE_G, encodeURIComponent(JSON.stringify(guidCampObj)));
          }
        } catch (e) {
          console.error('Invalid clevertap Id ' + e);
        }
      }
    }
  };
  const getCampaignObjForLc = () => {
    // before preparing data to send to LC , check if the entry for the guid is already there in CAMP_COOKIE_G
    const guid = JSON.parse(decodeURIComponent(StorageManager.read(GCOOKIE_NAME)));
    let campObj = {};

    if (StorageManager._isLocalStorageSupported()) {
      let resultObj = {};
      campObj = getCampaignObject();
      const storageValue = StorageManager.read(CAMP_COOKIE_G);
      const decodedValue = storageValue ? decodeURIComponent(storageValue) : null;
      const parsedValue = decodedValue ? JSON.parse(decodedValue) : null;
      const resultObjWP = !!guid && storageValue !== undefined && storageValue !== null && parsedValue && parsedValue[guid] && parsedValue[guid].wp ? Object.values(parsedValue[guid].wp) : [];
      const resultObjWI = !!guid && storageValue !== undefined && storageValue !== null && parsedValue && parsedValue[guid] && parsedValue[guid].wi ? Object.values(parsedValue[guid].wi) : [];
      const today = getToday();
      let todayCwp = 0;
      let todayCwi = 0;

      if (campObj.wp && campObj.wp[today] && campObj.wp[today].tc !== 'undefined') {
        todayCwp = campObj.wp[today].tc;
      }

      if (campObj.wi && campObj.wi[today] && campObj.wi[today].tc !== 'undefined') {
        todayCwi = campObj.wi[today].tc;
      }

      resultObj = {
        wmp: todayCwp,
        wimp: todayCwi,
        tlc: resultObjWP,
        witlc: resultObjWI
      };
      return resultObj;
    }
  };
  const isProfileValid = (profileObj, _ref) => {
    let {
      logger
    } = _ref;
    let valid = false;

    if (isObject(profileObj)) {
      for (const profileKey in profileObj) {
        if (profileObj.hasOwnProperty(profileKey)) {
          valid = true;
          let profileVal = profileObj[profileKey];

          if (profileVal == null) {
            delete profileObj[profileKey];
            continue;
          }

          if (profileKey === 'Gender' && !profileVal.match(/^M$|^F$/)) {
            valid = false;
            logger.error(GENDER_ERROR);
          }

          if (profileKey === 'Employed' && !profileVal.match(/^Y$|^N$/)) {
            valid = false;
            logger.error(EMPLOYED_ERROR);
          }

          if (profileKey === 'Married' && !profileVal.match(/^Y$|^N$/)) {
            valid = false;
            logger.error(MARRIED_ERROR);
          }

          if (profileKey === 'Education' && !profileVal.match(/^School$|^College$|^Graduate$/)) {
            valid = false;
            logger.error(EDUCATION_ERROR);
          }

          if (profileKey === 'Age' && profileVal != null) {
            if (isConvertibleToNumber(profileVal)) {
              profileObj.Age = +profileVal;
            } else {
              valid = false;
              logger.error(AGE_ERROR);
            }
          } // dob will come in like this - $dt_19470815 or dateObject


          if (profileKey === 'DOB') {
            if ((!/^\$D_/.test(profileVal) || (profileVal + '').length !== 11) && !isDateObject(profileVal)) {
              valid = false;
              logger.error(DOB_ERROR);
            }

            if (isDateObject(profileVal)) {
              profileObj[profileKey] = convertToWZRKDate(profileVal);
            }
          } else if (isDateObject(profileVal)) {
            profileObj[profileKey] = convertToWZRKDate(profileVal);
          }

          if (profileKey === 'Phone' && !isObjectEmpty(profileVal)) {
            if (profileVal.length > 8 && profileVal.charAt(0) === '+') {
              // valid phone number
              profileVal = profileVal.substring(1, profileVal.length);

              if (isConvertibleToNumber(profileVal)) {
                profileObj.Phone = +profileVal;
              } else {
                valid = false;
                logger.error(PHONE_FORMAT_ERROR + '. Removed.');
              }
            } else {
              valid = false;
              logger.error(PHONE_FORMAT_ERROR + '. Removed.');
            }
          }

          if (!valid) {
            delete profileObj[profileKey];
          }
        }
      }
    }

    return valid;
  };
  const processFBUserObj = user => {
    const profileData = {};
    profileData.Name = user.name;

    if (user.id != null) {
      profileData.FBID = user.id + '';
    } // Feb 2014 - FB announced over 58 gender options, hence we specifically look for male or female. Rest we don't care.


    if (user.gender === 'male') {
      profileData.Gender = 'M';
    } else if (user.gender === 'female') {
      profileData.Gender = 'F';
    } else {
      profileData.Gender = 'O';
    }

    const getHighestEducation = function (eduArr) {
      if (eduArr != null) {
        let college = '';
        let highschool = '';

        for (let i = 0; i < eduArr.length; i++) {
          const edu = eduArr[i];

          if (edu.type != null) {
            const type = edu.type;

            if (type === 'Graduate School') {
              return 'Graduate';
            } else if (type === 'College') {
              college = '1';
            } else if (type === 'High School') {
              highschool = '1';
            }
          }
        }

        if (college === '1') {
          return 'College';
        } else if (highschool === '1') {
          return 'School';
        }
      }
    };

    if (user.relationship_status != null) {
      profileData.Married = 'N';

      if (user.relationship_status === 'Married') {
        profileData.Married = 'Y';
      }
    }

    const edu = getHighestEducation(user.education);

    if (edu != null) {
      profileData.Education = edu;
    }

    const work = user.work != null ? user.work.length : 0;

    if (work > 0) {
      profileData.Employed = 'Y';
    } else {
      profileData.Employed = 'N';
    }

    if (user.email != null) {
      profileData.Email = user.email;
    }

    if (user.birthday != null) {
      const mmddyy = user.birthday.split('/'); // comes in as "08/15/1947"

      profileData.DOB = setDate(mmddyy[2] + mmddyy[0] + mmddyy[1]);
    }

    return profileData;
  };
  const processGPlusUserObj = (user, _ref2) => {
    let {
      logger
    } = _ref2;
    const profileData = {};

    if (user.displayName != null) {
      profileData.Name = user.displayName;
    }

    if (user.id != null) {
      profileData.GPID = user.id + '';
    }

    if (user.gender != null) {
      if (user.gender === 'male') {
        profileData.Gender = 'M';
      } else if (user.gender === 'female') {
        profileData.Gender = 'F';
      } else if (user.gender === 'other') {
        profileData.Gender = 'O';
      }
    }

    if (user.image != null) {
      if (user.image.isDefault === false) {
        profileData.Photo = user.image.url.split('?sz')[0];
      }
    }

    if (user.emails != null) {
      for (let emailIdx = 0; emailIdx < user.emails.length; emailIdx++) {
        const emailObj = user.emails[emailIdx];

        if (emailObj.type === 'account') {
          profileData.Email = emailObj.value;
        }
      }
    }

    if (user.organizations != null) {
      profileData.Employed = 'N';

      for (let i = 0; i < user.organizations.length; i++) {
        const orgObj = user.organizations[i];

        if (orgObj.type === 'work') {
          profileData.Employed = 'Y';
        }
      }
    }

    if (user.birthday != null) {
      const yyyymmdd = user.birthday.split('-'); // comes in as "1976-07-27"

      profileData.DOB = setDate(yyyymmdd[0] + yyyymmdd[1] + yyyymmdd[2]);
    }

    if (user.relationshipStatus != null) {
      profileData.Married = 'N';

      if (user.relationshipStatus === 'married') {
        profileData.Married = 'Y';
      }
    }

    logger.debug('gplus usr profile ' + JSON.stringify(profileData));
    return profileData;
  };
  const addToLocalProfileMap = (profileObj, override) => {
    if (StorageManager._isLocalStorageSupported()) {
      if ($ct.globalProfileMap == null) {
        $ct.globalProfileMap = StorageManager.readFromLSorCookie(PR_COOKIE);

        if ($ct.globalProfileMap == null) {
          $ct.globalProfileMap = {};
        }
      } // Move props from custom bucket to outside.


      if (profileObj._custom != null) {
        const keys = profileObj._custom;

        for (const key in keys) {
          if (keys.hasOwnProperty(key)) {
            profileObj[key] = keys[key];
          }
        }

        delete profileObj._custom;
      }

      for (const prop in profileObj) {
        if (profileObj.hasOwnProperty(prop)) {
          if ($ct.globalProfileMap.hasOwnProperty(prop) && !override) {
            continue;
          }

          $ct.globalProfileMap[prop] = profileObj[prop];
        }
      }

      if ($ct.globalProfileMap._custom != null) {
        delete $ct.globalProfileMap._custom;
      }

      StorageManager.saveToLSorCookie(PR_COOKIE, $ct.globalProfileMap);
    }
  };
  const closeIframe = (campaignId, divIdIgnored, currentSessionId) => {
    if (campaignId != null && campaignId !== '-1') {
      if (StorageManager._isLocalStorageSupported()) {
        const campaignObj = getCampaignObject();
        let sessionCampaignObj = campaignObj.wp[currentSessionId];

        if (sessionCampaignObj == null) {
          sessionCampaignObj = {};
          campaignObj[currentSessionId] = sessionCampaignObj;
        }

        sessionCampaignObj[campaignId] = 'dnd';
        saveCampaignObject(campaignObj);
      }
    }

    if ($ct.campaignDivMap != null) {
      const divId = $ct.campaignDivMap[campaignId];

      if (divId != null) {
        document.getElementById(divId).style.display = 'none';

        if (divId === 'intentPreview') {
          if (document.getElementById('intentOpacityDiv') != null) {
            document.getElementById('intentOpacityDiv').style.display = 'none';
          }
        } else if (divId === 'wizParDiv0') {
          if (document.getElementById('intentOpacityDiv0') != null) {
            document.getElementById('intentOpacityDiv0').style.display = 'none';
          }
        } else if (divId === 'wizParDiv2') {
          if (document.getElementById('intentOpacityDiv2') != null) {
            document.getElementById('intentOpacityDiv2').style.display = 'none';
          }
        }
      }
    }
  };
  const arp = jsonMap => {
    // For unregister calls dont set arp in LS
    if (jsonMap.skipResARP != null && jsonMap.skipResARP) {
      console.debug('Update ARP Request rejected', jsonMap);
      return null;
    }

    const isOULARP = jsonMap[IS_OUL] === true;

    if (StorageManager._isLocalStorageSupported()) {
      // Update arp only if it is null or an oul request
      try {
        let arpFromStorage = StorageManager.readFromLSorCookie(ARP_COOKIE);

        if (arpFromStorage == null || isOULARP) {
          arpFromStorage = {};

          for (const key in jsonMap) {
            if (jsonMap.hasOwnProperty(key)) {
              if (jsonMap[key] === -1) {
                delete arpFromStorage[key];
              } else {
                arpFromStorage[key] = jsonMap[key];
              }
            }
          }

          StorageManager.saveToLSorCookie(ARP_COOKIE, arpFromStorage);
        }
      } catch (e) {
        console.error('Unable to parse ARP JSON: ' + e);
      }
    }
  };
  const setEnum = (enumVal, logger) => {
    if (isString(enumVal) || isNumber(enumVal)) {
      return '$E_' + enumVal;
    }

    logger.error(ENUM_FORMAT_ERROR);
  };
  const handleEmailSubscription = (subscription, reEncoded, fetchGroups, account, logger) => {
    const urlParamsAsIs = getURLParams(location.href); // can't use url_params as it is in lowercase above

    const encodedEmailId = urlParamsAsIs.e;
    const encodedProfileProps = urlParamsAsIs.p;
    const pageType = urlParamsAsIs.page_type;

    if (typeof encodedEmailId !== 'undefined') {
      const data = {};
      data.id = account.id; // accountId

      data.unsubGroups = $ct.unsubGroups; // unsubscribe groups

      if ($ct.updatedCategoryLong) {
        data[categoryLongKey] = $ct.updatedCategoryLong;
      }

      let url = account.emailURL;

      if (fetchGroups) {
        url = addToURL(url, 'fetchGroups', fetchGroups);
      }

      if (reEncoded) {
        url = addToURL(url, 'encoded', reEncoded);
      }

      url = addToURL(url, 'e', encodedEmailId);
      url = addToURL(url, 'd', compressData(JSON.stringify(data), logger));

      if (encodedProfileProps) {
        url = addToURL(url, 'p', encodedProfileProps);
      }

      if (subscription !== '-1') {
        url = addToURL(url, 'sub', subscription);
      }

      if (pageType) {
        $ct.globalUnsubscribe = pageType === GLOBAL;
        url = addToURL(url, 'page_type', pageType);
      }

      RequestDispatcher.fireRequest(url);
    }
  };

  var _logger$3 = _classPrivateFieldLooseKey("logger");

  var _request$2 = _classPrivateFieldLooseKey("request");

  var _account = _classPrivateFieldLooseKey("account");

  var _oldValues$1 = _classPrivateFieldLooseKey("oldValues");

  var _isPersonalisationActive$1 = _classPrivateFieldLooseKey("isPersonalisationActive");

  var _processProfileArray = _classPrivateFieldLooseKey("processProfileArray");

  class ProfileHandler extends Array {
    constructor(_ref, values) {
      let {
        logger,
        request,
        account,
        isPersonalisationActive
      } = _ref;
      super();
      Object.defineProperty(this, _processProfileArray, {
        value: _processProfileArray2
      });
      Object.defineProperty(this, _logger$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive$1, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger$3)[_logger$3] = logger;
      _classPrivateFieldLooseBase(this, _request$2)[_request$2] = request;
      _classPrivateFieldLooseBase(this, _account)[_account] = account;
      _classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1] = values;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$1)[_isPersonalisationActive$1] = isPersonalisationActive;
    }

    push() {
      for (var _len = arguments.length, profilesArr = new Array(_len), _key = 0; _key < _len; _key++) {
        profilesArr[_key] = arguments[_key];
      }

      _classPrivateFieldLooseBase(this, _processProfileArray)[_processProfileArray](profilesArr);

      return 0;
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1]) {
        _classPrivateFieldLooseBase(this, _processProfileArray)[_processProfileArray](_classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1] = null;
    }

    getAttribute(propName) {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$1)[_isPersonalisationActive$1]()) {
        return;
      }

      if ($ct.globalProfileMap == null) {
        $ct.globalProfileMap = StorageManager.readFromLSorCookie(PR_COOKIE);
      }

      if ($ct.globalProfileMap != null) {
        return $ct.globalProfileMap[propName];
      }
    }

    /**
     *
     * @param {any} key
     * @param {number} value
     * @param {string} command
     * increases or decreases value of the number type properties in profile object
     */
    _handleIncrementDecrementValue(key, value, command) {
      var _$ct$globalProfileMap;

      // Check if the value is greater than 0
      if ($ct.globalProfileMap == null) {
        $ct.globalProfileMap = StorageManager.readFromLSorCookie(PR_COOKIE);
      }

      if ($ct.globalProfileMap == null && !((_$ct$globalProfileMap = $ct.globalProfileMap) === null || _$ct$globalProfileMap === void 0 ? void 0 : _$ct$globalProfileMap.hasOwnProperty(key))) {
        // Check if the profile map already has the propery defined
        console.error('Kindly create profile with required proprty to increment/decrement.');
      } else if (!value || typeof value !== 'number' || value <= 0) {
        console.error('Value should be a number greater than 0');
      } else {
        // Update the profile property in local storage
        if (command === COMMAND_INCREMENT) {
          $ct.globalProfileMap[key] = $ct.globalProfileMap[key] + value;
        } else {
          $ct.globalProfileMap[key] = $ct.globalProfileMap[key] - value;
        }

        StorageManager.saveToLSorCookie(PR_COOKIE, $ct.globalProfileMap); // Send the updated value to LC

        let data = {};
        const profileObj = {};
        data.type = 'profile';
        profileObj[key] = {
          [command]: value
        };

        if (profileObj.tz == null) {
          // try to auto capture user timezone if not present
          profileObj.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
        }

        data.profile = profileObj;
        data = _classPrivateFieldLooseBase(this, _request$2)[_request$2].addSystemDataToObject(data, true);

        _classPrivateFieldLooseBase(this, _request$2)[_request$2].addFlags(data);

        const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]);

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

        _classPrivateFieldLooseBase(this, _request$2)[_request$2].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
      }
    }
    /**
     *
     * @param {any} key
     * @param {array} arrayVal
     * @param {string} command
     * overwrites/sets new value(s) against a key/property in profile object
     */


    _handleMultiValueSet(key, arrayVal, command) {
      const array = [];

      for (let i = 0; i < arrayVal.length; i++) {
        if (typeof arrayVal[i] === 'number' && !array.includes(arrayVal[i])) {
          array.push(arrayVal[i]);
        } else if (typeof arrayVal[i] === 'string' && !array.includes(arrayVal[i].toLowerCase())) {
          array.push(arrayVal[i].toLowerCase());
        } else {
          console.error('array supports only string or number type values');
        }
      }

      if ($ct.globalProfileMap == null) {
        var _StorageManager$readF;

        $ct.globalProfileMap = (_StorageManager$readF = StorageManager.readFromLSorCookie(PR_COOKIE)) !== null && _StorageManager$readF !== void 0 ? _StorageManager$readF : {};
      }

      $ct.globalProfileMap[key] = array;
      StorageManager.saveToLSorCookie(PR_COOKIE, $ct.globalProfileMap);
      this.sendMultiValueData(key, arrayVal, command);
    }
    /**
     *
     * @param {any} propKey - the property name to be added in the profile object
     * @param {string, number, array} propVal - the property value to be added against the @propkey key
     * @param {string} command
     * Adds array or single value against a key/property in profile object
     */


    _handleMultiValueAdd(propKey, propVal, command) {
      if ($ct.globalProfileMap == null) {
        $ct.globalProfileMap = StorageManager.readFromLSorCookie(PR_COOKIE) || {};
      }

      const existingValue = $ct.globalProfileMap[propKey];
      const array = Array.isArray(existingValue) ? existingValue : existingValue != null ? [existingValue] : [];

      const addValue = value => {
        const normalizedValue = typeof value === 'number' ? value : value.toLowerCase();

        if (!array.includes(normalizedValue)) {
          array.push(normalizedValue);
        }
      };

      if (Array.isArray(propVal)) {
        propVal.forEach(value => {
          if (typeof value === 'string' || typeof value === 'number') {
            addValue(value);
          } else {
            _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].error('Array supports only string or number type values');
          }
        });
      } else if (typeof propVal === 'string' || typeof propVal === 'number') {
        addValue(propVal);
      } else {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].error('Unsupported value type');

        return;
      }

      $ct.globalProfileMap[propKey] = array;
      StorageManager.saveToLSorCookie(PR_COOKIE, $ct.globalProfileMap);
      this.sendMultiValueData(propKey, propVal, command);
    }
    /**
     *
     * @param {any} propKey
     * @param {string, number, array} propVal
     * @param {string} command
     * removes value(s) against a key/property in profile object
     */


    _handleMultiValueRemove(propKey, propVal, command) {
      if ($ct.globalProfileMap == null) {
        $ct.globalProfileMap = StorageManager.readFromLSorCookie(PR_COOKIE) || {};
      }

      if (!$ct.globalProfileMap.hasOwnProperty(propKey)) {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].error("The property ".concat(propKey, " does not exist."));

        return;
      }

      const removeValue = value => {
        const index = $ct.globalProfileMap[propKey].indexOf(value);

        if (index !== -1) {
          $ct.globalProfileMap[propKey].splice(index, 1);
        }
      };

      if (Array.isArray(propVal)) {
        propVal.forEach(removeValue);
      } else if (typeof propVal === 'string' || typeof propVal === 'number') {
        removeValue(propVal);
      } else {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].error('Unsupported propVal type');

        return;
      } // Remove the key if the array is empty


      if ($ct.globalProfileMap[propKey].length === 0) {
        delete $ct.globalProfileMap[propKey];
      }

      StorageManager.saveToLSorCookie(PR_COOKIE, $ct.globalProfileMap);
      this.sendMultiValueData(propKey, propVal, command);
    }
    /**
     *
     * @param {any} propKey
     * @param {string} command
     * deletes a key value pair from the profile object
     */


    _handleMultiValueDelete(propKey, command) {
      var _$ct$globalProfileMap2;

      if ($ct.globalProfileMap == null) {
        $ct.globalProfileMap = StorageManager.readFromLSorCookie(PR_COOKIE);
      }

      if (!($ct === null || $ct === void 0 ? void 0 : (_$ct$globalProfileMap2 = $ct.globalProfileMap) === null || _$ct$globalProfileMap2 === void 0 ? void 0 : _$ct$globalProfileMap2.hasOwnProperty(propKey))) {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].error("The property ".concat(propKey, " does not exist."));
      } else {
        delete $ct.globalProfileMap[propKey];
      }

      StorageManager.saveToLSorCookie(PR_COOKIE, $ct.globalProfileMap);
      this.sendMultiValueData(propKey, null, command);
    }

    sendMultiValueData(propKey, propVal, command) {
      // Send the updated value to LC
      let data = {};
      const profileObj = {};
      data.type = 'profile'; // this removes the property at backend

      profileObj[propKey] = {
        [command]: command === COMMAND_DELETE ? true : propVal
      };

      if (profileObj.tz == null) {
        profileObj.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
      }

      data.profile = profileObj;
      data = _classPrivateFieldLooseBase(this, _request$2)[_request$2].addSystemDataToObject(data, true);

      _classPrivateFieldLooseBase(this, _request$2)[_request$2].addFlags(data);

      const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]);

      let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

      pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

      _classPrivateFieldLooseBase(this, _request$2)[_request$2].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
    }

  }

  var _processProfileArray2 = function _processProfileArray2(profileArr) {
    if (Array.isArray(profileArr) && profileArr.length > 0) {
      for (const index in profileArr) {
        if (profileArr.hasOwnProperty(index)) {
          const outerObj = profileArr[index];
          let data = {};
          let profileObj;

          if (outerObj.Site != null) {
            // organic data from the site
            profileObj = outerObj.Site;

            if (isObjectEmpty(profileObj) || !isProfileValid(profileObj, {
              logger: _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]
            })) {
              return;
            }
          } else if (outerObj.Facebook != null) {
            // fb connect data
            const FbProfileObj = outerObj.Facebook; // make sure that the object contains any data at all

            if (!isObjectEmpty(FbProfileObj) && !FbProfileObj.error) {
              profileObj = processFBUserObj(FbProfileObj);
            }
          } else if (outerObj['Google Plus'] != null) {
            const GPlusProfileObj = outerObj['Google Plus'];

            if (!isObjectEmpty(GPlusProfileObj) && !GPlusProfileObj.error) {
              profileObj = processGPlusUserObj(GPlusProfileObj, {
                logger: _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]
              });
            }
          }

          if (profileObj != null && !isObjectEmpty(profileObj)) {
            // profile got set from above
            data.type = 'profile';

            if (profileObj.tz == null) {
              // try to auto capture user timezone if not present
              profileObj.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
            }

            data.profile = profileObj;
            addToLocalProfileMap(profileObj, true);
            data = _classPrivateFieldLooseBase(this, _request$2)[_request$2].addSystemDataToObject(data, undefined);

            _classPrivateFieldLooseBase(this, _request$2)[_request$2].addFlags(data);

            const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]);

            let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

            pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
            pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

            _classPrivateFieldLooseBase(this, _request$2)[_request$2].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
          }
        }
      }
    }
  };

  var _request$3 = _classPrivateFieldLooseKey("request");

  var _logger$4 = _classPrivateFieldLooseKey("logger");

  var _account$1 = _classPrivateFieldLooseKey("account");

  var _session$1 = _classPrivateFieldLooseKey("session");

  var _oldValues$2 = _classPrivateFieldLooseKey("oldValues");

  var _device$1 = _classPrivateFieldLooseKey("device");

  var _processOUL = _classPrivateFieldLooseKey("processOUL");

  var _handleCookieFromCache = _classPrivateFieldLooseKey("handleCookieFromCache");

  var _deleteUser = _classPrivateFieldLooseKey("deleteUser");

  var _processLoginArray = _classPrivateFieldLooseKey("processLoginArray");

  class UserLoginHandler extends Array {
    constructor(_ref, values) {
      let {
        request,
        account,
        session,
        logger,
        device
      } = _ref;
      super();
      Object.defineProperty(this, _processLoginArray, {
        value: _processLoginArray2
      });
      Object.defineProperty(this, _deleteUser, {
        value: _deleteUser2
      });
      Object.defineProperty(this, _handleCookieFromCache, {
        value: _handleCookieFromCache2
      });
      Object.defineProperty(this, _processOUL, {
        value: _processOUL2
      });
      Object.defineProperty(this, _request$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _device$1, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _request$3)[_request$3] = request;
      _classPrivateFieldLooseBase(this, _account$1)[_account$1] = account;
      _classPrivateFieldLooseBase(this, _session$1)[_session$1] = session;
      _classPrivateFieldLooseBase(this, _logger$4)[_logger$4] = logger;
      _classPrivateFieldLooseBase(this, _oldValues$2)[_oldValues$2] = values;
      _classPrivateFieldLooseBase(this, _device$1)[_device$1] = device;
    } // On User Login


    clear() {
      _classPrivateFieldLooseBase(this, _logger$4)[_logger$4].debug('clear called. Reset flag has been set.');

      _classPrivateFieldLooseBase(this, _deleteUser)[_deleteUser]();

      StorageManager.setMetaProp(CLEAR, true);
    }

    push() {
      for (var _len = arguments.length, profilesArr = new Array(_len), _key = 0; _key < _len; _key++) {
        profilesArr[_key] = arguments[_key];
      }

      _classPrivateFieldLooseBase(this, _processLoginArray)[_processLoginArray](profilesArr);

      return 0;
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$2)[_oldValues$2]) {
        _classPrivateFieldLooseBase(this, _processLoginArray)[_processLoginArray](_classPrivateFieldLooseBase(this, _oldValues$2)[_oldValues$2]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$2)[_oldValues$2] = null;
    }

  }

  var _processOUL2 = function _processOUL2(profileArr) {
    let sendOULFlag = true;
    StorageManager.saveToLSorCookie(FIRE_PUSH_UNREGISTERED, sendOULFlag);

    const addToK = ids => {
      let k = StorageManager.readFromLSorCookie(KCOOKIE_NAME);
      const g = StorageManager.readFromLSorCookie(GCOOKIE_NAME);
      let kId;

      if (k == null) {
        k = {};
        kId = ids;
      } else {
        /* check if already exists */
        kId = k.id;
        let anonymousUser = false;
        let foundInCache = false;

        if (kId == null) {
          kId = ids[0];
          anonymousUser = true;
        }

        if ($ct.LRU_CACHE == null && StorageManager._isLocalStorageSupported()) {
          $ct.LRU_CACHE = new LRUCache(LRU_CACHE_SIZE);
        }

        if (anonymousUser) {
          if (g != null) {
            // if have gcookie
            $ct.LRU_CACHE.set(kId, g);
            $ct.blockRequest = false;
          }
        } else {
          // check if the id is present in the cache
          // set foundInCache to true
          for (const idx in ids) {
            if (ids.hasOwnProperty(idx)) {
              const id = ids[idx];

              if ($ct.LRU_CACHE.cache[id]) {
                kId = id;
                foundInCache = true;
                break;
              }
            }
          }
        }

        if (foundInCache) {
          if (kId !== $ct.LRU_CACHE.getLastKey()) {
            // New User found
            // remove the entire cache
            _classPrivateFieldLooseBase(this, _handleCookieFromCache)[_handleCookieFromCache]();
          } else {
            sendOULFlag = false;
            StorageManager.saveToLSorCookie(FIRE_PUSH_UNREGISTERED, sendOULFlag);
          }

          const gFromCache = $ct.LRU_CACHE.get(kId);
          $ct.LRU_CACHE.set(kId, gFromCache);
          StorageManager.saveToLSorCookie(GCOOKIE_NAME, gFromCache);
          _classPrivateFieldLooseBase(this, _device$1)[_device$1].gcookie = gFromCache;
          const lastK = $ct.LRU_CACHE.getSecondLastKey();

          if (StorageManager.readFromLSorCookie(FIRE_PUSH_UNREGISTERED) && lastK !== -1) {
            // CACHED OLD USER FOUND. TRANSFER PUSH TOKEN TO THIS USER
            const lastGUID = $ct.LRU_CACHE.cache[lastK];

            _classPrivateFieldLooseBase(this, _request$3)[_request$3].unregisterTokenForGuid(lastGUID);
          }
        } else {
          if (!anonymousUser) {
            this.clear();
          } else {
            if (g != null) {
              _classPrivateFieldLooseBase(this, _device$1)[_device$1].gcookie = g;
              StorageManager.saveToLSorCookie(GCOOKIE_NAME, g);
              sendOULFlag = false;
            }
          }

          StorageManager.saveToLSorCookie(FIRE_PUSH_UNREGISTERED, false);
          kId = ids[0];
        }
      }

      k.id = kId;
      StorageManager.saveToLSorCookie(KCOOKIE_NAME, k);
    };

    if (Array.isArray(profileArr) && profileArr.length > 0) {
      for (const index in profileArr) {
        if (profileArr.hasOwnProperty(index)) {
          const outerObj = profileArr[index];
          let data = {};
          let profileObj;

          if (outerObj.Site != null) {
            // organic data from the site
            profileObj = outerObj.Site;

            if (isObjectEmpty(profileObj) || !isProfileValid(profileObj, {
              logger: _classPrivateFieldLooseBase(this, _logger$4)[_logger$4]
            })) {
              return;
            }
          } else if (outerObj.Facebook != null) {
            // fb connect data
            const FbProfileObj = outerObj.Facebook; // make sure that the object contains any data at all

            if (!isObjectEmpty(FbProfileObj) && !FbProfileObj.error) {
              profileObj = processFBUserObj(FbProfileObj);
            }
          } else if (outerObj['Google Plus'] != null) {
            const GPlusProfileObj = outerObj['Google Plus'];

            if (isObjectEmpty(GPlusProfileObj) && !GPlusProfileObj.error) {
              profileObj = processGPlusUserObj(GPlusProfileObj, {
                logger: _classPrivateFieldLooseBase(this, _logger$4)[_logger$4]
              });
            }
          }

          if (profileObj != null && !isObjectEmpty(profileObj)) {
            // profile got set from above
            data.type = 'profile';

            if (profileObj.tz == null) {
              // try to auto capture user timezone if not present
              profileObj.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
            }

            data.profile = profileObj;
            const ids = [];

            if (StorageManager._isLocalStorageSupported()) {
              if (profileObj.Identity) {
                ids.push(profileObj.Identity);
              }

              if (profileObj.Email) {
                ids.push(profileObj.Email);
              }

              if (profileObj.GPID) {
                ids.push('GP:' + profileObj.GPID);
              }

              if (profileObj.FBID) {
                ids.push('FB:' + profileObj.FBID);
              }

              if (ids.length > 0) {
                addToK(ids);
              }
            }

            addToLocalProfileMap(profileObj, true);
            data = _classPrivateFieldLooseBase(this, _request$3)[_request$3].addSystemDataToObject(data, undefined);

            _classPrivateFieldLooseBase(this, _request$3)[_request$3].addFlags(data); // Adding 'isOUL' flag in true for OUL cases which.
            // This flag tells LC to create a new arp object.
            // Also we will receive the same flag in response arp which tells to delete existing arp object.


            if (sendOULFlag) {
              data[IS_OUL] = true;
            }

            const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$4)[_logger$4]);

            let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$1)[_account$1].dataPostURL;

            pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
            pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData); // Whenever sendOULFlag is true then dont send arp and gcookie (guid in memory in the request)
            // Also when this flag is set we will get another flag from LC in arp which tells us to delete arp
            // stored in the cache and replace it with the response arp.

            _classPrivateFieldLooseBase(this, _request$3)[_request$3].saveAndFireRequest(pageLoadUrl, $ct.blockRequest, sendOULFlag);
          }
        }
      }
    }
  };

  var _handleCookieFromCache2 = function _handleCookieFromCache2() {
    $ct.blockRequest = false;
    console.debug('Block request is false');

    if (StorageManager._isLocalStorageSupported()) {
      delete localStorage[PR_COOKIE];
      delete localStorage[EV_COOKIE];
      delete localStorage[META_COOKIE];
      delete localStorage[ARP_COOKIE];
      delete localStorage[CAMP_COOKIE_NAME];
      delete localStorage[CHARGEDID_COOKIE_NAME];
    }

    StorageManager.removeCookie(CAMP_COOKIE_NAME, getHostName());
    StorageManager.removeCookie(_classPrivateFieldLooseBase(this, _session$1)[_session$1].cookieName, $ct.broadDomain);
    StorageManager.removeCookie(ARP_COOKIE, $ct.broadDomain);

    _classPrivateFieldLooseBase(this, _session$1)[_session$1].setSessionCookieObject('');
  };

  var _deleteUser2 = function _deleteUser2() {
    $ct.blockRequest = true;

    _classPrivateFieldLooseBase(this, _logger$4)[_logger$4].debug('Block request is true');

    $ct.globalCache = {
      gcookie: null,
      REQ_N: 0,
      RESP_N: 0
    };

    if (StorageManager._isLocalStorageSupported()) {
      delete localStorage[GCOOKIE_NAME];
      delete localStorage[KCOOKIE_NAME];
      delete localStorage[PR_COOKIE];
      delete localStorage[EV_COOKIE];
      delete localStorage[META_COOKIE];
      delete localStorage[ARP_COOKIE];
      delete localStorage[CAMP_COOKIE_NAME];
      delete localStorage[CHARGEDID_COOKIE_NAME];
    }

    StorageManager.removeCookie(GCOOKIE_NAME, $ct.broadDomain);
    StorageManager.removeCookie(CAMP_COOKIE_NAME, getHostName());
    StorageManager.removeCookie(KCOOKIE_NAME, getHostName());
    StorageManager.removeCookie(_classPrivateFieldLooseBase(this, _session$1)[_session$1].cookieName, $ct.broadDomain);
    StorageManager.removeCookie(ARP_COOKIE, $ct.broadDomain);
    _classPrivateFieldLooseBase(this, _device$1)[_device$1].gcookie = null;

    _classPrivateFieldLooseBase(this, _session$1)[_session$1].setSessionCookieObject('');
  };

  var _processLoginArray2 = function _processLoginArray2(loginArr) {
    if (Array.isArray(loginArr) && loginArr.length > 0) {
      const profileObj = loginArr.pop();
      const processProfile = profileObj != null && isObject(profileObj) && (profileObj.Site != null && Object.keys(profileObj.Site).length > 0 || profileObj.Facebook != null && Object.keys(profileObj.Facebook).length > 0 || profileObj['Google Plus'] != null && Object.keys(profileObj['Google Plus']).length > 0);

      if (processProfile) {
        StorageManager.setInstantDeleteFlagInK();

        try {
          _classPrivateFieldLooseBase(this, _processOUL)[_processOUL]([profileObj]);
        } catch (e) {
          _classPrivateFieldLooseBase(this, _logger$4)[_logger$4].debug(e);
        }
      } else {
        _classPrivateFieldLooseBase(this, _logger$4)[_logger$4].error('Profile object is in incorrect format');
      }
    }
  };

  class CTWebPopupImageOnly extends HTMLElement {
    constructor() {
      super();
      this._target = null;
      this._session = null;
      this.shadow = null;
      this.popup = null;
      this.container = null;
      this.resizeObserver = null;
      this.shadow = this.attachShadow({
        mode: 'open'
      });
    }

    get target() {
      return this._target || '';
    }

    set target(val) {
      if (this._target === null) {
        this._target = val;
        this.renderImageOnlyPopup();
      }
    }

    get session() {
      return this._session || '';
    }

    set session(val) {
      this._session = val;
    }

    get msgId() {
      return this.target.wzrk_id;
    }

    get pivotId() {
      return this.target.wzrk_pivot;
    }

    get onClickUrl() {
      return this.target.display.onClickUrl;
    }

    renderImageOnlyPopup() {
      const campaignId = this.target.wzrk_id.split('_')[0];
      const currentSessionId = this.session.sessionId;
      this.shadow.innerHTML = this.getImageOnlyPopupContent();
      this.popup = this.shadowRoot.getElementById('imageOnlyPopup');
      this.container = this.shadowRoot.getElementById('container');
      this.closeIcon = this.shadowRoot.getElementById('close');
      this.popup.addEventListener('load', this.updateImageAndContainerWidth());
      this.resizeObserver = new ResizeObserver(() => this.handleResize(this.popup, this.container));
      this.resizeObserver.observe(this.popup);
      this.closeIcon.addEventListener('click', () => {
        this.resizeObserver.unobserve(this.popup);
        document.getElementById('wzrkImageOnlyDiv').style.display = 'none';
        this.remove();

        if (campaignId != null && campaignId !== '-1') {
          if (StorageManager._isLocalStorageSupported()) {
            const campaignObj = getCampaignObject();
            let sessionCampaignObj = campaignObj.wp[currentSessionId];

            if (sessionCampaignObj == null) {
              sessionCampaignObj = {};
              campaignObj[currentSessionId] = sessionCampaignObj;
            }

            sessionCampaignObj[campaignId] = 'dnd';
            saveCampaignObject(campaignObj);
          }
        }
      });
      window.clevertap.renderNotificationViewed({
        msgId: this.msgId,
        pivotId: this.pivotId
      });

      if (this.onClickUrl) {
        this.popup.addEventListener('click', () => {
          this.target.display.window ? window.open(this.onClickUrl, '_blank') : window.parent.location.href = this.onClickUrl;
          window.clevertap.renderNotificationClicked({
            msgId: this.msgId,
            pivotId: this.pivotId
          });
        });
      }
    }

    handleResize(popup, container) {
      const width = this.getRenderedImageWidth(popup);
      container.style.setProperty('width', "".concat(width, "px"));
    }

    getImageOnlyPopupContent() {
      return "\n        ".concat(this.target.msgContent.css, "\n        ").concat(this.target.msgContent.html, "\n      ");
    }

    updateImageAndContainerWidth() {
      return () => {
        const width = this.getRenderedImageWidth(this.popup);
        this.popup.style.setProperty('width', "".concat(width, "px"));
        this.container.style.setProperty('width', "".concat(width, "px"));
        this.container.style.setProperty('height', 'auto');
        this.container.style.setProperty('position', 'fixed');
        this.popup.style.setProperty('visibility', 'visible');
        this.closeIcon.style.setProperty('visibility', 'visible');
        document.getElementById('wzrkImageOnlyDiv').style.visibility = 'visible';
      };
    }

    getRenderedImageWidth(img) {
      const ratio = img.naturalWidth / img.naturalHeight;
      return img.height * ratio;
    }

  }

  class Message extends HTMLElement {
    constructor(config, message) {
      super();
      this.wrapper = null;
      this.snackBar = null;
      this.shadow = this.attachShadow({
        mode: 'open'
      });
      this.config = config;
      this.message = message;
      this.renderMessage(message);
    }

    get pivotId() {
      return this.message.wzrk_pivot;
    }

    get campaignId() {
      return this.message.wzrk_id;
    }

    createEl(type, id, part) {
      const _el = document.createElement(type);

      _el.setAttribute('id', id);

      _el.setAttribute('part', part || id);

      return _el;
    }

    renderMessage(msg) {
      this.wrapper = this.createEl('div', 'messageWrapper');

      switch (msg.templateType) {
        case 'text-only':
        case 'text-with-icon':
        case 'text-with-icon-and-image':
          {
            const message = this.prepareBasicMessage(msg.msg[0]);
            this.wrapper.appendChild(message);
          }
      }

      const timeStamp = this.createEl('div', 'timeStamp');
      timeStamp.innerHTML = "<span>".concat(determineTimeStampText(msg.id.split('_')[1]), "<span>");

      if (!msg.viewed) {
        const unreadMarker = this.createEl('span', 'unreadMarker');
        timeStamp.appendChild(unreadMarker);
      }

      this.wrapper.appendChild(timeStamp);
      this.shadow.appendChild(this.wrapper);
    }

    prepareBasicMessage(msg) {
      const message = this.createEl('div', 'message');

      if (msg.imageUrl) {
        const imageContainer = this.addImage(msg.imageUrl, 'mainImg');
        message.appendChild(imageContainer);
      }

      const iconTitleDescWrapper = this.createEl('div', 'iconTitleDescWrapper');

      if (msg.iconUrl) {
        const iconContainer = this.addImage(msg.iconUrl, 'iconImg');
        iconTitleDescWrapper.appendChild(iconContainer);
      }

      const titleDescWrapper = this.createEl('div', 'titleDescWrapper');

      if (msg.title) {
        const title = this.createEl('div', 'title');
        title.innerText = msg.title;
        titleDescWrapper.appendChild(title);
      }

      if (msg.description) {
        const description = this.createEl('div', 'description');
        description.innerText = msg.description;
        titleDescWrapper.appendChild(description);
      }

      if (msg.title || msg.description) {
        iconTitleDescWrapper.appendChild(titleDescWrapper);
      }

      if (msg.iconUrl || msg.title || msg.description) {
        message.appendChild(iconTitleDescWrapper);
      }

      if (msg.buttons && msg.buttons.length) {
        const buttonsContainer = this.addButtons(msg.buttons);
        message.appendChild(buttonsContainer);
      }

      return message;
    }

    addButtons() {
      let buttons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const buttonsContainer = this.createEl('div', 'buttonsContainer');
      let hasCopyAction = false;
      buttons.forEach((b, i) => {
        const button = this.createEl('button', "button-".concat(i), 'button');
        button.innerText = b.text;

        if (i > 0) {
          button.style.cssText += 'margin-left: 2px;';
        }

        if (b.action === 'copy') {
          hasCopyAction = true;
        }

        buttonsContainer.appendChild(button);
      });

      if (hasCopyAction) {
        this.addSnackbar(buttonsContainer);
      }

      return buttonsContainer;
    }

    addSnackbar(buttonsContainer) {
      this.snackBar = this.createEl('div', "snackbar-".concat(this.campaignId), 'snackbar');
      this.snackBar.innerHTML = greenTickSvg;
      const clipboardMsg = this.createEl('span', "snackbar-msg-".concat(this.campaignId), 'snackbar-msg');
      clipboardMsg.innerText = 'Copied to clipboard';
      this.snackBar.appendChild(clipboardMsg);
      buttonsContainer.appendChild(this.snackBar);
    }

    addImage(url, type) {
      const imageContainer = this.createEl('div', "".concat(type, "Container"));
      const image = this.createEl('img', type);
      image.setAttribute('src', url); // images will be fetched as and when the element comes into the viewport

      image.setAttribute('loading', 'lazy');
      imageContainer.appendChild(image);
      return imageContainer;
    }

    raiseClickedEvent(path, isPreview) {
      switch (this.message.templateType) {
        case 'text-only':
        case 'text-with-icon':
        case 'text-with-icon-and-image':
          {
            this.raiseClickedForBasicTemplates(path, isPreview);
          }
      }
    }

    raiseClickedForBasicTemplates(path, isPreview) {
      const msg = this.message.msg[0];
      const payload = {
        msgId: this.campaignId,
        pivotId: this.pivotId
      };

      if (path.tagName === 'BUTTON') {
        const id = path.id.split('-')[1];
        const button = msg.buttons[id];
        payload.kv = {
          wzrk_c2a: button.text
        };

        if (button.action === 'url') {
          button.openUrlInNewTab ? window.open(button.url, '_blank') : window.location = button.url;
        } else if (button.action === 'copy') {
          window.focus();
          navigator.clipboard.writeText(button.clipboardText);
          this.snackBar.style.setProperty('display', 'flex', 'important');
          setTimeout(() => {
            this.snackBar.style.setProperty('display', 'none', 'important');
          }, 2000);
        }
      } else if (path.tagName === 'CT-INBOX-MESSAGE' && msg.onClickUrl) {
        msg.openUrlInNewTab ? window.open(msg.onClickUrl, '_blank') : window.location = msg.onClickUrl;
      }

      if (isPreview) {
        console.log('Notifiction clicked event will be raised at run time with payload ::', payload);
      } else {
        window.clevertap.renderNotificationClicked(payload);
      }
    }

  }

  const messageStyles = (_ref) => {
    let {
      backgroundColor,
      borderColor,
      titleColor,
      descriptionColor,
      buttonColor,
      buttonTextColor,
      unreadMarkerColor
    } = _ref;
    return "\n    <style id=\"messageStyles\">\n      ct-inbox-message::part(messageWrapper) {\n        margin-bottom: 16px; \n      }\n      ct-inbox-message::part(message) {\n        background-color: ".concat(backgroundColor, "; \n        border: 1px solid ").concat(borderColor, ";\n        border-radius: 4px; \n        overflow: hidden;\n        min-height: 40px;\n      }\n      ct-inbox-message::part(message):hover {\n        box-shadow: 0px 4px 8px rgb(0 0 0 / 10%);\n        cursor: pointer;\n      }\n      ct-inbox-message::part(iconTitleDescWrapper) {\n        display: flex; \n        padding: 16px;\n      }\n      ct-inbox-message::part(titleDescWrapper) {\n        display: flex; \n        flex-direction: column;\n      }\n      ct-inbox-message::part(iconImgContainer) {\n        display: flex; \n        margin-right: 16px;\n      }\n      ct-inbox-message::part(mainImgContainer) {\n        line-height: 0;\n      }\n      ct-inbox-message::part(mainImg) {\n        width: 100%; \n        background: #b2b1ae;\n      }\n      ct-inbox-message::part(iconImg) {\n        height: 40px; \n        width: 40px;\n      }\n      ct-inbox-message::part(title) {\n        font-size: 14px !important; \n        line-height: 20px; \n        font-weight: 600; \n        color: ").concat(titleColor, "\n      }\n      ct-inbox-message::part(description) {\n        font-size: 14px !important; \n        line-height: 20px; \n        font-weight: 400; \n        color: ").concat(descriptionColor, "\n      }\n      ct-inbox-message::part(button) {\n        background-color: ").concat(buttonColor, "; \n        color: ").concat(buttonTextColor, "; \n        padding: 8px 16px; \n        font-size: 12px; \n        line-height: 16px; \n        font-weight: 600; \n        flex: 1; \n        border-radius: 0px; \n        text-transform: capitalize; \n        cursor: pointer; \n        border: none;\n      }\n      ct-inbox-message::part(buttonsContainer) {\n        display: flex;\n        position: relative;\n      }\n      ct-inbox-message::part(snackbar) {\n        position: absolute;\n        top: calc(-100% - 12px);\n        left: 50%;\n        transform: translate(-50%, 0px);\n        font-size: 14px;\n        font-weight: 400;\n        background: #FFFFFF;\n        border: 1px solid #ECEDF2;\n        box-shadow: 0px 4px 8px rgb(0 0 0 / 6%), 0px 0px 2px rgb(0 0 0 / 4%);\n        border-radius: 4px;\n        z-index: 2;\n        display: none;\n        width: max-content;\n        align-items: center;\n        padding: 8px 16px;\n        justify-content: center;\n      }\n\n      ct-inbox-message::part(snackbar-msg) {\n        color: black;\n        margin-left: 8px;\n      }\n\n      ct-inbox-message::part(timeStamp) {\n        display: flex; \n        justify-content: end; \n        align-items: center; \n        margin-top: 4px; \n        font-size: 12px !important; \n        line-height: 16px; \n        color: black;\n      }\n      ct-inbox-message::part(unreadMarker) {\n        height: 8px; \n        width: 8px; \n        border-radius: 50%; \n        background-color: ").concat(unreadMarkerColor, "; \n        margin-left: 8px;\n      }\n      @media only screen and (min-width: 420px) {\n        ct-inbox-message::part(mainImg) {\n          height: 180px;\n        }\n      }\n    </style>\n  ");
  };
  const inboxContainerStyles = (_ref2) => {
    let {
      panelBackgroundColor,
      panelBorderColor,
      headerBackgroundColor,
      headerTitleColor,
      closeIconColor,
      categoriesTabColor,
      categoriesTitleColor,
      categoriesBorderColor,
      selectedCategoryTabColor,
      selectedCategoryTitleColor,
      selectedCategoryBorderColor,
      headerCategoryHeight
    } = _ref2;
    return "\n      <style id=\"webInboxStyles\">\n        #inbox {\n          width: 100%;\n          position: fixed;\n          background-color: #fff; \n          display: none; \n          box-shadow: 0px 2px 10px 0px #d7d7d791;\n          background-color: ".concat(panelBackgroundColor, "; \n          border: 1px solid ").concat(panelBorderColor, ";\n          top: 0;\n          left: 0;\n          height: 100%;\n          overflow: auto;\n          z-index: 1;\n          box-sizing: content-box;\n          border-radius: 4px;\n        }\n  \n        #emptyInboxMsg {\n          display: block;\n          padding: 10px;\n          text-align: center;\n          color: black;\n        }\n  \n        #header {\n          height: 36px; \n          width: 100%; \n          display: flex; \n          justify-content: center; \n          align-items: center; \n          background-color: ").concat(headerBackgroundColor, "; \n          background-color: var(--card-bg, ").concat(headerBackgroundColor, ");\n          color: ").concat(headerTitleColor, "\n        }\n  \n        #closeInbox {\n          font-size: 20px; \n          margin-right: 12px; \n          color: ").concat(closeIconColor, "; \n          cursor: pointer;\n        }\n  \n        #headerTitle {\n          font-size: 14px; \n          line-height: 20px; \n          flex-grow: 1; \n          font-weight: 700; \n          text-align: center;\n          flex-grow: 1;\n          text-align: center;\n        }\n  \n        #categoriesContainer {\n          padding: 16px 16px 0 16px; \n          height: 32px; \n          display: flex;\n          scroll-behavior: smooth;\n          position: relative;\n        }\n\n        #categoriesWrapper {\n          height: 32px; \n          overflow-x: scroll;\n          display: flex;\n          white-space: nowrap;\n          scrollbar-width: none;\n        }\n\n        #categoriesWrapper::-webkit-scrollbar {\n          display: none;\n        }\n  \n        #leftArrow, #rightArrow {\n          height: 32px;\n          align-items: center;\n          font-weight: 700;\n          position: absolute;\n          z-index: 2;\n          pointer-events: auto;\n          cursor: pointer;\n          display: none;\n        }\n\n        #leftArrow {\n          left: 0;\n          padding-left: 4px;\n          padding-right: 16px;\n          background: linear-gradient(90deg, ").concat(panelBackgroundColor, " 0%, ").concat(panelBackgroundColor, "99 80%, ").concat(panelBackgroundColor, "0d 100%);\n        }\n\n        #rightArrow {\n          right: 0;\n          padding-right: 4px;\n          padding-left: 16px;\n          background: linear-gradient(-90deg, ").concat(panelBackgroundColor, " 0%, ").concat(panelBackgroundColor, "99 80%, ").concat(panelBackgroundColor, "0d 100%);\n        }\n\n        [id^=\"category-\"] {\n          display: flex; \n          flex: 1 1 0; \n          justify-content: center; \n          align-items: center; \n          font-size: 14px; \n          line-height: 20px; \n          background-color: ").concat(categoriesTabColor, "; \n          color: ").concat(categoriesTitleColor, "; \n          cursor: pointer;\n          padding: 6px 24px;\n          margin: 0 3px;\n          border-radius: 16px;\n          border: ").concat(categoriesBorderColor ? '1px solid ' + categoriesBorderColor : 'none', ";\n        }\n\n        [id^=\"category-\"][selected=\"true\"] {\n          background-color: ").concat(selectedCategoryTabColor, "; \n          color: ").concat(selectedCategoryTitleColor, "; \n          border: ").concat(selectedCategoryBorderColor ? '1px solid ' + selectedCategoryBorderColor : 'none', "\n        }\n  \n        #inboxCard {\n          padding: 0 16px 0 16px;\n          overflow-y: auto;\n          box-sizing: border-box;\n          margin-top: 16px;\n        }\n\n        @media only screen and (min-width: 480px) {\n          #inbox {\n            width: var(--inbox-width, 392px);\n            height: var(--inbox-height, 546px);\n            position: var(--inbox-position, fixed);\n            right: var(--inbox-right, unset);\n            bottom: var(--inbox-bottom, unset);\n            top: var(--inbox-top, unset);\n            left: var(--inbox-left, unset);\n          }\n  \n          #inboxCard {\n            height: calc(var(--inbox-height, 546px) - ").concat(headerCategoryHeight, "px); \n          }\n  \n        }\n      </style>\n      ");
  };

  class Inbox extends HTMLElement {
    constructor(logger) {
      super();
      this.isInboxOpen = false;
      this.isInboxFromFlutter = false;
      this.selectedCategory = null;
      this.unviewedMessages = {};
      this.unviewedCounter = 0;
      this.isPreview = false;
      this.inboxConfigForPreview = {};
      this.inboxSelector = null;
      this.inbox = null;
      this.emptyInboxMsg = null;
      this.inboxCard = null;
      this.unviewedBadge = null;
      this.observer = null;
      this.selectedCategoryRef = null;

      this.addClickListenerOnDocument = (() => {
        return e => {
          if (e.composedPath().includes(this.inbox)) {
            // path is not supported on FF. So we fallback to e.composedPath
            const path = e.path || e.composedPath && e.composedPath();

            if (path.length) {
              const id = path[0].id;

              if (id === 'closeInbox') {
                this.toggleInbox();
              } else if (id.startsWith('category-')) {
                this.prevCategoryRef = this.selectedCategoryRef;
                this.selectedCategoryRef = path[0];
                this.updateActiveCategory(path[0].innerText);
              } else {
                const _path = path.filter(p => {
                  var _p$id;

                  return ((_p$id = p.id) === null || _p$id === void 0 ? void 0 : _p$id.startsWith('button-')) || p.tagName === 'CT-INBOX-MESSAGE';
                });

                if (_path.length) {
                  const messageEl = _path[_path.length - 1];
                  messageEl.raiseClickedEvent(_path[0], this.isPreview);
                }
              }
            }
          } else if (this.inboxSelector.contains(e.target) || this.isInboxOpen) {
            if (this.isInboxFromFlutter) {
              this.isInboxFromFlutter = false;
            } else {
              this.toggleInbox(e);
            }
          }
        };
      })();

      this.setBadgeStyle = msgCount => {
        if (this.unviewedBadge !== null) {
          this.unviewedBadge.innerText = msgCount > 9 ? '9+' : msgCount;
          this.unviewedBadge.style.display = msgCount > 0 ? 'flex' : 'none';
        }
      };

      this.logger = logger;
      this.shadow = this.attachShadow({
        mode: 'open'
      });
    }

    get incomingMessages() {
      return [];
    }

    set incomingMessages(msgs) {
      if (msgs === void 0) {
        msgs = [];
      }

      if (msgs.length > 0 && this.inbox) {
        this.updateInboxMessages(msgs);
      }
    }

    get incomingMessagesForPreview() {
      return [];
    }

    set incomingMessagesForPreview(msgs) {
      if (msgs === void 0) {
        msgs = [];
      }

      const previewMsgs = {};

      if (msgs.length > 0 && this.inbox) {
        this.isPreview = true;
        this.unviewedCounter = 0;
        msgs.forEach(m => {
          const key = "".concat(m.wzrk_id.split('_')[0], "_").concat(Date.now());
          m.id = key;
          previewMsgs[key] = m;
          this.unviewedMessages[key] = m;
          this.unviewedCounter++;
        });
        this.buildUIForMessages(previewMsgs);
        this.updateUnviewedBadgeCounter();
      }
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.config = this.isPreview ? this.inboxConfigForPreview : StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};

      if (Object.keys(this.config).length === 0) {
        return;
      }

      this.inboxSelector = document.getElementById(this.config.inboxSelector);

      if (this.inboxSelector === null) {
        return;
      }

      if (this.config.styles.notificationsBadge) {
        this.addUnviewedBadge();
      } else if (this.unviewedBadge) {
        this.unviewedBadge.remove();
      }

      this.createinbox();
      /**
       * We need to remove the listener as there could be a scenario where init would be called when
       * we get updated web inbox settings from LC after the inbox has been initialised.
       * It can so happen that the inbox-selector would have changed.
       */

      document.removeEventListener('click', this.addClickListenerOnDocument);
      document.addEventListener('click', this.addClickListenerOnDocument);
      this.config.categories.length && this.updateActiveCategory(this.selectedCategoryRef.innerText);
      this.shadow.innerHTML = this.getInboxStyles();
      this.shadow.appendChild(this.inbox);
    }

    addMsgsToInboxFromLS() {
      const messages = this.deleteExpiredAndGetUnexpiredMsgs(false);
      const msgIds = messages ? Object.keys(messages) : [];

      if (msgIds.length === 0) {
        return;
      }

      msgIds.forEach(m => {
        if (!messages[m].viewed) {
          this.unviewedMessages[m] = messages[m];
          this.unviewedCounter++;
        }
      });
      this.buildUIForMessages(messages);
      this.updateUnviewedBadgeCounter();
    }
    /**
     * @param {*} deleteMsgsFromUI - If this param is true, then we'll have to check the UI and delete expired messages from the DOM
     * It'll be false when you are building the inbox layout for the very first time.
     *
     * This method reads the inbox messages from LS,
     * based on the deleteMsgsFromUI flag deletes the expired messages from UI and decrements the unviewed counter if the message was not viewed,
     * sorts the messages based on the date,
     * saves the unexpired messages to LS
     * and returns the sorted unexpired messages
     *
     * Scenarios when we encounter expired messages -
     * 1. building ui for the 1st time, no need to decrement the unviewed counter as the correct count will be set at the time of rendering
     * 2. UI is already built (deleteMsgsFromUI = true) and you open the inbox
     *    a. You'll find the expired msg in inbox
     *    b. You'll not find the expired msg in inbox.
     *       This happens when we receive new messages from LC, increment unviewed counter, save it in LS. (We build the UI only when the user opens inbox.)
     *  In both the above scenarios, we'll still have to decrement the unviewed counter if the message was not viewed.
     */


    deleteExpiredAndGetUnexpiredMsgs() {
      let deleteMsgsFromUI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      let messages = getInboxMessages();
      const now = Math.floor(Date.now() / 1000);

      for (const msg in messages) {
        if (messages[msg].wzrk_ttl && messages[msg].wzrk_ttl > 0 && messages[msg].wzrk_ttl < now) {
          if (deleteMsgsFromUI) {
            const el = this.shadowRoot.getElementById(messages[msg].id);
            el && el.remove();

            if (!messages[msg].viewed) {
              this.unviewedCounter--;
              this.updateUnviewedBadgeCounter();
            }
          }

          delete messages[msg];
        }
      }

      if (messages && messages.length > 0) {
        messages = Object.values(messages).sort((a, b) => b.date - a.date).reduce((acc, m) => {
          acc[m.id] = m;
          return acc;
        }, {});
      }

      saveInboxMessages(messages);
      return messages;
    }

    updateInboxMessages() {
      let msgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      const inboxMsgs = this.deleteExpiredAndGetUnexpiredMsgs();
      const date = Date.now();
      const incomingMsgs = {};
      msgs.forEach((m, i) => {
        const key = "".concat(m.wzrk_id.split('_')[0], "_").concat(Date.now());
        m.id = key; // We are doing this to preserve the order of the messages

        m.date = date - i;
        m.viewed = 0;
        inboxMsgs[key] = m;
        incomingMsgs[key] = m;
        this.unviewedMessages[key] = m;
        this.unviewedCounter++;
      });
      saveInboxMessages(inboxMsgs);
      this.buildUIForMessages(incomingMsgs);
      this.updateUnviewedBadgeCounter();
    }

    createEl(type, id, part) {
      const _el = document.createElement(type);

      _el.setAttribute('id', id);

      _el.setAttribute('part', part || id);

      return _el;
    }

    addUnviewedBadge() {
      if (!this.unviewedBadge) {
        this.unviewedBadge = this.createEl('div', 'unviewedBadge'); // As this unviewedBadge element will be directly added to the DOM, we are defining inline styles

        this.unviewedBadge.style.cssText = "display: none; position: absolute; height: 16px; width: 26px; border-radius: 8px; background-color: ".concat(this.config.styles.notificationsBadge.backgroundColor, "; font-size: 12px; color: ").concat(this.config.styles.notificationsBadge.textColor, "; font-weight: bold; align-items: center; justify-content: center;");
        document.body.appendChild(this.unviewedBadge);
      }

      this.updateUnviewedBadgePosition(); // called when user switches b/w portrait and landscape mode.

      window.addEventListener('resize', () => {
        this.updateUnviewedBadgePosition();
      });
    }

    updateUnviewedBadgePosition() {
      const {
        top,
        right
      } = this.inboxSelector.getBoundingClientRect();
      this.unviewedBadge.style.top = "".concat(top - 8, "px");
      this.unviewedBadge.style.left = "".concat(right - 8, "px");
    }

    createinbox() {
      this.inbox = this.createEl('div', 'inbox');
      const header = this.createEl('div', 'header');
      const headerTitle = this.createEl('div', 'headerTitle');
      headerTitle.innerText = this.config.title;
      const closeIcon = this.createEl('div', 'closeInbox');
      closeIcon.innerHTML = '&times';
      header.appendChild(headerTitle);
      header.appendChild(closeIcon);
      this.inbox.appendChild(header);

      if (this.config.categories.length) {
        const categories = this.createCategories();
        this.inbox.appendChild(categories);
      }

      this.inboxCard = this.createEl('div', 'inboxCard');
      this.inbox.appendChild(this.inboxCard);
      this.emptyInboxMsg = this.createEl('div', 'emptyInboxMsg');
      this.emptyInboxMsg.innerText = 'All messages will be displayed here.';
      this.inboxCard.appendChild(this.emptyInboxMsg); // Intersection observer for notification viewed

      const options = {
        root: this.inboxCard,
        rootMargin: '0px',
        threshold: 0.5
      };
      this.observer = new IntersectionObserver((entries, observer) => {
        this.handleMessageViewed(entries);
      }, options);
      this.addMsgsToInboxFromLS();
    }

    createCategories() {
      const categoriesContainer = this.createEl('div', 'categoriesContainer');
      const leftArrow = this.createEl('div', 'leftArrow');
      leftArrow.innerHTML = arrowSvg;
      leftArrow.children[0].style = 'transform: rotate(180deg)';
      leftArrow.addEventListener('click', () => {
        this.shadowRoot.getElementById('categoriesWrapper').scrollBy(-70, 0);
      });
      categoriesContainer.appendChild(leftArrow);
      const categoriesWrapper = this.createEl('div', 'categoriesWrapper');
      const _categories = ['All', ...this.config.categories];

      _categories.forEach((c, i) => {
        const category = this.createEl('div', "category-".concat(i), 'category');
        category.innerText = c;

        if (i === 0) {
          this.selectedCategoryRef = category;
        }

        categoriesWrapper.appendChild(category);
      });

      categoriesContainer.appendChild(categoriesWrapper);
      const rightArrow = this.createEl('div', 'rightArrow');
      rightArrow.innerHTML = arrowSvg;
      rightArrow.addEventListener('click', () => {
        this.shadowRoot.getElementById('categoriesWrapper').scrollBy(70, 0);
      });
      categoriesContainer.appendChild(rightArrow);
      const options = {
        root: categoriesContainer,
        threshold: 0.9
      };
      const firstCategory = categoriesWrapper.children[0];
      const lastCategory = categoriesWrapper.children[this.config.categories.length];
      const firstCategoryObserver = new IntersectionObserver(e => {
        this.categoryObserverCb(leftArrow, e[0].intersectionRatio >= 0.9);
      }, options);
      firstCategoryObserver.observe(firstCategory);
      const lastCategoryObserver = new IntersectionObserver(e => {
        this.categoryObserverCb(rightArrow, e[0].intersectionRatio >= 0.9);
      }, options);
      lastCategoryObserver.observe(lastCategory);
      return categoriesContainer;
    }

    categoryObserverCb(el, hide) {
      if (!el) {
        return;
      }

      el.style.display = hide ? 'none' : 'flex';
    }

    updateActiveCategory(activeCategory) {
      this.selectedCategory = activeCategory;
      this.inboxCard.scrollTop = 0;
      let counter = 0;
      this.prevCategoryRef && this.prevCategoryRef.setAttribute('selected', 'false');
      this.selectedCategoryRef.setAttribute('selected', 'true');
      this.inboxCard.childNodes.forEach(c => {
        if (c.getAttribute('id') !== 'emptyInboxMsg') {
          c.style.display = this.selectedCategory === 'All' || c.getAttribute('category') === this.selectedCategory ? 'block' : 'none';

          if (c.style.display === 'block') {
            counter++;
          }
        }
      });

      if (counter === 0) {
        this.emptyInboxMsg.innerText = "".concat(activeCategory, " messages will be displayed here.");
        this.emptyInboxMsg.style.display = 'block';
      } else {
        this.emptyInboxMsg.style.display = 'none';
      }
    }

    buildUIForMessages() {
      var _this$config$maxMsgsI;

      let messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      !this.isPreview && this.updateTSForRenderedMsgs();
      this.inboxCard.scrollTop = 0;
      const maxMsgsInInbox = (_this$config$maxMsgsI = this.config.maxMsgsInInbox) !== null && _this$config$maxMsgsI !== void 0 ? _this$config$maxMsgsI : MAX_INBOX_MSG;
      const firstChild = this.inboxCard.firstChild;
      const sortedMsgs = Object.values(messages).sort((a, b) => b.date - a.date).map(m => m.id);

      for (const m of sortedMsgs) {
        const item = new Message(this.config, messages[m]);
        item.setAttribute('id', messages[m].id);
        item.setAttribute('pivot', messages[m].wzrk_pivot);
        item.setAttribute('part', 'ct-inbox-message');

        if (this.config.categories.length > 0) {
          item.setAttribute('category', messages[m].tags[0] || '');
          item.style.display = this.selectedCategory === 'All' || messages[m].category === this.selectedCategory ? 'block' : 'none';
        } else {
          item.style.display = 'block';
        }

        this.inboxCard.insertBefore(item, firstChild);
        this.observer.observe(item);
      }

      let msgTotalCount = this.inboxCard.querySelectorAll('ct-inbox-message').length;

      while (msgTotalCount > maxMsgsInInbox) {
        const ctInboxMsgs = this.inboxCard.querySelectorAll('ct-inbox-message');

        if (ctInboxMsgs.length > 0) {
          ctInboxMsgs[ctInboxMsgs.length - 1].remove();
        }

        msgTotalCount--;
      }

      const hasMessages = this.inboxCard.querySelectorAll('ct-inbox-message[style*="display: block"]').length;
      this.emptyInboxMsg.style.display = hasMessages ? 'none' : 'block';
    }
    /**
     * Adds a click listener on the document. For every click we check
     * 1. if the click has happenned within the inbox
     *    - on close button, we close the inbox
     *    - on any of the category, we set that as the activeCategory
     *    - on any of the message, we mark raise notification clicked event. To identify the clicks on a button, we have p.id.startsWith('button-')
     * 2. if the user has clicked on the inboxSelector, we toggle inbox
     * 3. if the click is anywhere else on the UI and the inbox is open, we simply close it
     */


    /**
     * This function will be called every time when a message comes into the inbox viewport and it's visibility increases to 50% or drops below 50%
     * If a msg is 50% visible in the UI, we need to mark the message as viewed in LS and raise notification viewed event
     */
    handleMessageViewed(entries) {
      const raiseViewedEvent = !this.isPreview;

      if (this.isInboxOpen) {
        entries.forEach(e => {
          if (e.isIntersecting && this.unviewedMessages.hasOwnProperty(e.target.id) && e.target.message.viewed === 0) {
            e.target.message.viewed = 1;

            if (raiseViewedEvent) {
              window.clevertap.renderNotificationViewed({
                msgId: e.target.campaignId,
                pivotId: e.target.pivotId
              });
              this.updateMessageInLS(e.target.id, { ...e.target.message,
                viewed: 1
              });
              setTimeout(() => {
                e.target.shadowRoot.getElementById('unreadMarker').style.display = 'none';
              }, 1000);
            } else {
              console.log('Notifiction viewed event will be raised at run time with payload ::', {
                msgId: e.target.campaignId,
                pivotId: e.target.pivotId
              });
            }

            this.unviewedCounter--;
            this.updateUnviewedBadgeCounter();
            delete this.unviewedMessages[e.target.id];
          }
        });
      }
    }

    updateMessageInLS(key, value) {
      if (!this.isPreview) {
        const messages = getInboxMessages();
        messages[key] = value;
        saveInboxMessages(messages);
      }
    } // create a separte fn fro refactoring


    toggleInbox(e) {
      this.isInboxOpen = !this.isInboxOpen;
      this.isInboxFromFlutter = !!(e === null || e === void 0 ? void 0 : e.rect);

      if (this.isInboxOpen) {
        this.inboxCard.scrollTop = 0;
        !this.isPreview && this.deleteExpiredAndGetUnexpiredMsgs();
        this.inbox.style.display = 'block';
        this.inbox.style.zIndex = '2147483647'; // zIndex should be max for the inbox to be rendered on top of all elements

        if (this.config.categories.length) {
          this.selectedCategoryRef.setAttribute('selected', 'false');
          this.selectedCategoryRef = this.shadowRoot.getElementById('category-0');
          this.updateActiveCategory(this.selectedCategoryRef.innerText);
          this.shadowRoot.getElementById('categoriesWrapper').scrollLeft -= this.shadowRoot.getElementById('categoriesWrapper').scrollWidth;
        }

        this.setInboxPosition(e);
      } else {
        this.inbox.style.display = 'none';
      }
    }

    setInboxPosition(e) {
      const windowWidth = window.outerWidth;
      const customInboxStyles = getComputedStyle($ct.inbox);
      const top = customInboxStyles.getPropertyValue('--inbox-top');
      const bottom = customInboxStyles.getPropertyValue('--inbox-bottom');
      const left = customInboxStyles.getPropertyValue('--inbox-left');
      const right = customInboxStyles.getPropertyValue('--inbox-right');
      const hasPositionDefined = top || bottom || left || right;

      if (windowWidth > 481 && !hasPositionDefined) {
        const res = getInboxPosition(e, this.inbox.clientHeight, this.inbox.clientWidth);
        const xPos = res.xPos;
        const yPos = res.yPos;
        this.inbox.style.top = yPos + 'px';
        this.inbox.style.left = xPos + 'px';
      }
    }
    /**
     * Updates the UI with the number of unviewed messages
     * If there are more than 9 unviewed messages, we show the count as 9+
     */


    updateUnviewedBadgeCounter() {
      if (this.isPreview) {
        this.setBadgeStyle(this.unviewedCounter);
        return;
      }

      let counter = 0;
      this.inboxCard.querySelectorAll('ct-inbox-message').forEach(m => {
        const messages = getInboxMessages();

        if (messages[m.id] && messages[m.id].viewed === 0) {
          counter++;
        }
      });
      this.setBadgeStyle(counter);
    }

    updateTSForRenderedMsgs() {
      this.inboxCard.querySelectorAll('ct-inbox-message').forEach(m => {
        const ts = m.id.split('_')[1];
        m.shadow.getElementById('timeStamp').firstChild.innerText = determineTimeStampText(ts);
      });
    }

    getInboxStyles() {
      const headerHeight = 36;
      const categoriesHeight = this.config.categories.length ? 64 : 16;
      const styles = {
        panelBackgroundColor: this.config.styles.panelBackgroundColor,
        panelBorderColor: this.config.styles.panelBorderColor,
        headerBackgroundColor: this.config.styles.header.backgroundColor,
        headerTitleColor: this.config.styles.header.titleColor,
        closeIconColor: this.config.styles.closeIconColor,
        categoriesTabColor: this.config.styles.categories.tabColor,
        categoriesTitleColor: this.config.styles.categories.titleColor,
        selectedCategoryTabColor: this.config.styles.categories.selectedTab.tabColor,
        selectedCategoryTitleColor: this.config.styles.categories.selectedTab.titleColor,
        headerCategoryHeight: headerHeight + categoriesHeight
      };

      if (this.config.styles.categories.borderColor) {
        styles.categoriesBorderColor = this.config.styles.categories.borderColor;
      }

      if (this.config.styles.categories.selectedTab.borderColor) {
        styles.selectedCategoryBorderColor = this.config.styles.categories.selectedTab.borderColor;
      }

      const inboxStyles = inboxContainerStyles(styles);
      const cardStyles = this.config.styles.cards;
      const msgStyles = messageStyles({
        backgroundColor: cardStyles.backgroundColor,
        borderColor: cardStyles.borderColor,
        titleColor: cardStyles.titleColor,
        descriptionColor: cardStyles.descriptionColor,
        buttonColor: cardStyles.buttonColor,
        buttonTextColor: cardStyles.buttonTextColor,
        unreadMarkerColor: cardStyles.unreadMarkerColor
      });
      return inboxStyles + msgStyles;
    }

  }

  const processWebInboxSettings = function (webInboxSetting) {
    let isPreview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    const _settings = StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};

    if (isPreview) {
      $ct.inbox.inboxConfigForPreview = webInboxSetting;
      $ct.inbox.isPreview = true;
      $ct.inbox && $ct.inbox.init();
    } else if (JSON.stringify(_settings) !== JSON.stringify(webInboxSetting)) {
      StorageManager.saveToLSorCookie(WEBINBOX_CONFIG, webInboxSetting);
      $ct.inbox && $ct.inbox.init();
    }
  };
  const processInboxNotifs = msg => {
    if (msg.inbox_preview) {
      $ct.inbox.incomingMessagesForPreview = msg.inbox_notifs;
    } else {
      $ct.inbox.incomingMessages = msg;
    }
  };
  const addWebInbox = logger => {
    checkAndRegisterWebInboxElements();
    $ct.inbox = new Inbox({
      logger
    });
    document.body.appendChild($ct.inbox);
  };

  const getAndMigrateInboxMessages = guid => {
    const messages = StorageManager.readFromLSorCookie(WEBINBOX) || {}; // Doing this to migrate message to guid level

    if (Object.keys(messages).length > 0 && Object.keys(messages)[0].includes('_')) {
      const gudInboxObj = {};
      gudInboxObj[guid] = messages;
      StorageManager.saveToLSorCookie(WEBINBOX, gudInboxObj);
      return gudInboxObj;
    }

    return messages;
  };

  const getInboxMessages = () => {
    const guid = JSON.parse(decodeURIComponent(StorageManager.read(GCOOKIE_NAME)));

    if (!isValueValid(guid)) {
      return {};
    }

    const messages = getAndMigrateInboxMessages(guid);
    return messages.hasOwnProperty(guid) ? messages[guid] : {};
  };
  const saveInboxMessages = messages => {
    const guid = JSON.parse(decodeURIComponent(StorageManager.read(GCOOKIE_NAME)));

    if (!isValueValid(guid)) {
      return;
    }

    const storedInboxObj = getAndMigrateInboxMessages(guid);
    const newObj = { ...storedInboxObj,
      [guid]: messages
    };
    StorageManager.saveToLSorCookie(WEBINBOX, newObj);
  };
  const initializeWebInbox = logger => {
    return new Promise((resolve, reject) => {
      if (document.readyState === 'complete') {
        addWebInbox(logger);
        resolve();
      } else {
        const config = StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};

        const onLoaded = () => {
          /**
           * We need this null check here because $ct.inbox could be initialised via init method too on document load.
           * In that case we don't need to call addWebInbox method
           */
          if ($ct.inbox === null) {
            addWebInbox(logger);
          }

          resolve();
        };

        window.addEventListener('load', () => {
          /**
           * Scripts can be loaded layzily, we may not get element from dom as it may not be mounted yet
           * We will to check element for 10 seconds and give up
           */
          if (document.getElementById(config.inboxSelector)) {
            onLoaded();
          } else {
            // check for element for next 10 seconds
            let count = 0;

            if (count < 20) {
              const t = setInterval(() => {
                if (document.getElementById(config.inboxSelector)) {
                  onLoaded();
                  clearInterval(t);
                  resolve();
                } else if (count >= 20) {
                  clearInterval(t);
                  logger.debug('Failed to add inbox');
                }

                count++;
              }, 500);
            }
          }
        });
      }
    });
  };
  const checkAndRegisterWebInboxElements = () => {
    if (customElements.get('ct-web-inbox') === undefined) {
      customElements.define('ct-web-inbox', Inbox);
      customElements.define('ct-inbox-message', Message);
    }
  };
  const getInboxPosition = (e, inboxHeight, inboxWidth) => {
    const horizontalScroll = document.scrollingElement.scrollLeft;
    const verticalScroll = document.scrollingElement.scrollTop;
    const windowWidth = window.innerWidth + horizontalScroll;
    const windowHeight = window.innerHeight + verticalScroll;
    const selectorRect = e.rect || e.target.getBoundingClientRect();
    const selectorX = selectorRect.x + horizontalScroll;
    const selectorY = selectorRect.y + verticalScroll;
    const selectorLeft = selectorRect.left + horizontalScroll;
    const selectorRight = selectorRect.right + horizontalScroll;
    const selectorTop = selectorRect.top + verticalScroll; // const selectorBottom = selectorRect.bottom + verticalScroll

    const selectorBottom = selectorRect.bottom;
    const selectorHeight = selectorRect.height;
    const selectorWidth = selectorRect.width;
    const selectorCenter = {
      x: selectorX + selectorWidth / 2,
      y: selectorY + selectorHeight / 2
    };
    const halfOfInboxHeight = inboxHeight / 2;
    const halfOfInboxWidth = inboxWidth / 2;
    let inboxOnSide = false;
    let xPos, yPos;
    const padding = 16;
    /**
     * y co-ordinates:
     * Try to push the card downwards
     * if that's not possible, push it upwards
     * if that too is not possible, then the card will be placed on the side. Add some padding.
     *
     * x co-ordinates:
     * If the card is on the side,
     *    try to place it to the right. If it's not possible,
     *    place it to the left
     * If the card is either on top/ bottom, set the x co-ordinate such that the selector center and the inbox card center become the same
     * Now,
     *  if the left of the inbox card is < 0,
     *    try to get the left aligned to the selectorLeft.
     *    if that's not possible, simply set left to 0
     *  if the right of the inbox card > windowWidth,
     *    try to get the right of rhe inbox card aligned with the selectorRight
     *    if that's not possible, simply set the inbox right to the window Right
     */

    if (selectorBottom + inboxHeight <= windowHeight) {
      // try to place the card down
      const availableHeight = windowHeight - (selectorBottom + inboxHeight);
      yPos = availableHeight >= padding ? selectorBottom + padding : selectorBottom + availableHeight;
    } else if (selectorTop - inboxHeight >= verticalScroll) {
      // try to place the card up
      const availableHeight = selectorTop - inboxHeight;
      yPos = availableHeight >= padding ? selectorTop - inboxHeight - padding : selectorTop - inboxHeight - availableHeight;
    } else {
      inboxOnSide = true;
      yPos = selectorCenter.y - halfOfInboxHeight; // with this the y co-ordinate of the selector center and the inbox card center become the same

      if (yPos < verticalScroll) {
        yPos = verticalScroll;
      } else if (yPos + inboxHeight > windowHeight) {
        yPos = windowHeight - inboxHeight;
      }
    }

    if (inboxOnSide) {
      // See if we can place the card to the right of the selector
      const inboxRight = selectorRight + inboxWidth;

      if (inboxRight <= windowWidth) {
        const availableWidth = inboxRight + padding <= windowWidth ? padding : windowWidth - inboxRight;
        xPos = selectorRight + availableWidth;
      } else {
        const inboxLeft = selectorLeft - inboxWidth;
        const availableWidth = inboxLeft - padding >= horizontalScroll ? padding : inboxLeft - horizontalScroll;
        xPos = inboxLeft - availableWidth;
      }
    } else {
      xPos = selectorCenter.x - halfOfInboxWidth;

      if (xPos < horizontalScroll) {
        if (selectorLeft + inboxWidth <= windowWidth) {
          xPos = selectorLeft;
        } else {
          xPos = horizontalScroll;
        }
      } else if (xPos + inboxWidth > windowWidth) {
        if (selectorRight - inboxWidth >= horizontalScroll) {
          xPos = selectorRight - inboxWidth;
        } else {
          xPos = windowWidth - inboxWidth;
        }
      }
    }

    return {
      xPos,
      yPos
    };
  };
  const determineTimeStampText = ts => {
    const now = Date.now();
    let diff = Math.floor((now - ts) / 60000);

    if (diff < 5) {
      return 'Just now';
    }

    if (diff < 60) {
      return "".concat(diff, " minute").concat(diff > 1 ? 's' : '', " ago");
    }

    diff = Math.floor(diff / 60);

    if (diff < 24) {
      return "".concat(diff, " hour").concat(diff > 1 ? 's' : '', " ago");
    }

    diff = Math.floor(diff / 24);
    return "".concat(diff, " day").concat(diff > 1 ? 's' : '', " ago");
  };
  const hasWebInboxSettingsInLS = () => {
    return Object.keys(StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {}).length > 0;
  };
  const arrowSvg = "<svg width=\"6\" height=\"10\" viewBox=\"0 0 6 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M0.258435 9.74751C-0.0478584 9.44825 -0.081891 8.98373 0.156337 8.64775L0.258435 8.52836L3.87106 5L0.258435 1.47164C-0.0478588 1.17239 -0.0818914 0.707867 0.156337 0.371887L0.258435 0.252494C0.564728 -0.0467585 1.04018 -0.0800085 1.38407 0.152743L1.50627 0.252494L5.74156 4.39042C6.04786 4.68968 6.08189 5.1542 5.84366 5.49018L5.74156 5.60957L1.50627 9.74751C1.16169 10.0842 0.603015 10.0842 0.258435 9.74751Z\" fill=\"#63698F\"/>\n</svg>\n";
  const greenTickSvg = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8ZM9.6839 5.93602C9.97083 5.55698 10.503 5.48833 10.8725 5.78269C11.2135 6.0544 11.2968 6.54044 11.0819 6.91173L11.0219 7.00198L8.09831 10.864C7.80581 11.2504 7.26654 11.3086 6.90323 11.0122L6.82822 10.9433L5.04597 9.10191C4.71635 8.76136 4.71826 8.21117 5.05023 7.87303C5.35666 7.5609 5.83722 7.53855 6.16859 7.80482L6.24814 7.87739L7.35133 9.01717L9.6839 5.93602Z\" fill=\"#03A387\"/>\n</svg>\n";

  const OVERLAY_PATH = 'https://web-native-display-campaign.clevertap.com/production/lib-overlay/overlay.js';
  const CSS_PATH = 'https://web-native-display-campaign.clevertap.com/production/lib-overlay/style.css';
  const WVE_CLASS = {
    FLICKER_SHOW: 'wve-anti-flicker-show',
    FLICKER_HIDE: 'wve-anti-flicker-hide',
    FLICKER_ID: 'wve-flicker-style'
  };

  const updateFormData = (element, formStyle) => {
    // Update the element style
    if (formStyle.style !== undefined) {
      Object.keys(formStyle.style).forEach(property => {
        element.style.setProperty(property, formStyle.style[property]);
      });
    } // Update underline for element


    if (formStyle.underline !== undefined) {
      const curTextDecoration = element.style.textDecoration;

      if (formStyle.underline) {
        element.style.textDecoration = "".concat(curTextDecoration, " underline").trim();
      } else {
        element.style.textDecoration = curTextDecoration.replace('underline', '').trim();
      }
    } // Update element text


    if (formStyle.text !== undefined) {
      element.innerText = formStyle.text;
    } // Handle element onClick


    if (formStyle.clickDetails !== undefined) {
      const url = formStyle.clickDetails.clickUrl;
      element.onclick = formStyle.clickDetails.newTab ? () => window.open(url, '_blank').focus() : () => {
        window.location.href = url;
      };
    } // Set the image source


    if (formStyle.imgURL !== undefined && element.tagName.toLowerCase() === 'img') {
      element.src = formStyle.imgURL;
    } // Handle elementCss


    if (formStyle.elementCss !== undefined) {
      const style = document.createElement('style');
      style.innerHTML = formStyle.elementCss;
      document.head.appendChild(style);
    }
  };

  const versionCompare = currentVersion => {
    const requiredVersion = '1.9.2';
    if (requiredVersion === currentVersion) return true;
    const splitRequiredVersion = requiredVersion.split('.');
    const splitCurrentVersion = currentVersion.split('.');
    let p1 = 0;
    let isWebsiteVersionHigher = false;

    while (p1 < splitRequiredVersion.length && !isWebsiteVersionHigher) {
      if (parseInt(splitRequiredVersion[p1]) < parseInt(splitCurrentVersion[p1])) {
        isWebsiteVersionHigher = true;
      }

      p1++;
    }

    return isWebsiteVersionHigher;
  };

  const checkBuilder = (logger, accountId) => {
    const search = window.location.search;
    const parentWindow = window.opener;

    if (search === '?ctBuilder') {
      // open in visual builder mode
      logger.debug('open in visual builder mode');
      window.addEventListener('message', handleMessageEvent, false);

      if (parentWindow) {
        parentWindow.postMessage({
          message: 'builder',
          originUrl: window.location.href
        }, '*');
      }

      return;
    }

    if (search === '?ctBuilderPreview') {
      window.addEventListener('message', handleMessageEvent, false);

      if (parentWindow) {
        parentWindow.postMessage({
          message: 'preview',
          originUrl: window.location.href
        }, '*');
      }
    }

    if (search === '?ctBuilderSDKCheck') {
      if (parentWindow) {
        const sdkVersion = '1.11.2';
        const isRequiredVersion = versionCompare(sdkVersion);
        parentWindow.postMessage({
          message: 'SDKVersion',
          accountId,
          originUrl: window.location.href,
          sdkVersion: isRequiredVersion ? '1.9.3' : sdkVersion
        }, '*');
      }
    }
  };

  const handleMessageEvent = event => {
    if (event.data && isValidUrl(event.data.originUrl)) {
      const msgOrigin = new URL(event.data.originUrl).origin;

      if (event.origin !== msgOrigin) {
        return;
      }
    } else {
      return;
    }

    if (event.data.message === 'Dashboard') {
      var _event$data$variant, _event$data$details;

      initialiseCTBuilder(event.data.url, (_event$data$variant = event.data.variant) !== null && _event$data$variant !== void 0 ? _event$data$variant : null, (_event$data$details = event.data.details) !== null && _event$data$details !== void 0 ? _event$data$details : {});
    } else if (event.data.message === 'Overlay') {
      renderVisualBuilder(event.data, true);
    }
  };
  /**
   * Initializes the Clevertap builder.
   * @param {string} url - The URL to initialize the builder.
   * @param {string} variant - The variant of the builder.
   * @param {Object} details - The details object.
   */


  const initialiseCTBuilder = (url, variant, details) => {
    if (document.readyState === 'complete') {
      onContentLoad(url, variant, details);
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          onContentLoad(url, variant, details);
        }
      });
    }
  };

  let container;
  let contentLoaded = false;
  let isShopify = false;
  /**
   * Handles content load for Clevertap builder.
   */

  function onContentLoad(url, variant, details) {
    if (!contentLoaded) {
      if (window.Shopify) {
        isShopify = true;
      }

      document.body.innerHTML = '';
      document.head.innerHTML = '';
      document.documentElement.innerHTML = '';
      container = document.createElement('div');
      container.id = 'overlayDiv';
      container.style.position = 'relative'; // Ensure relative positioning for absolute positioning of form

      container.style.display = 'flex';
      document.body.appendChild(container);
      const overlayPath = OVERLAY_PATH;
      loadOverlayScript(overlayPath, url, variant, details).then(() => {
        console.log('Overlay script loaded successfully.');
        contentLoaded = true;
      }).catch(error => {
        console.error('Error loading overlay script:', error);
      });
      loadCSS();
    }
  }
  /**
   * Loads CSS file.
   */


  function loadCSS() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = CSS_PATH;
    document.head.appendChild(link);
  }
  /**
   * Loads the overlay script.
   * @param {string} overlayPath - The path to overlay script.
   * @param {string} url - The URL.
   * @param {string} variant - The variant.
   * @param {Object} details - The details object.
   * @returns {Promise} A promise.
   */


  function loadOverlayScript(overlayPath, url, variant, details) {
    return new Promise((resolve, reject) => {
      var script = document.createElement('script');
      script.type = 'module';
      script.src = overlayPath;

      script.onload = function () {
        if (typeof window.Overlay === 'function') {
          window.Overlay({
            id: '#overlayDiv',
            url,
            variant,
            details,
            isShopify
          });
          resolve();
        } else {
          reject(new Error('ContentLayout not found in overlay.js'));
        }
      };

      script.onerror = function (error) {
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
  /**
   * Renders the visual builder.
   * @param {Object} targetingMsgJson - The point and click campaign JSON object.
   * @param {boolean} isPreview - Indicates if it's a preview.
   */


  const renderVisualBuilder = (targetingMsgJson, isPreview) => {
    const details = isPreview ? targetingMsgJson.details[0] : targetingMsgJson.display.details[0];
    const siteUrl = Object.keys(details)[0];
    const selectors = details[siteUrl];
    let elementDisplayed = false;
    if (siteUrl !== window.location.href.split('?')[0]) return;

    const processElement = (element, selector) => {
      if (selectors[selector].html) {
        element.outerHTML = selectors[selector].html;
      } else if (selectors[selector].json) {
        dispatchJsonData(targetingMsgJson, selectors[selector]);
      } else {
        updateFormData(element, selectors[selector].form);
      }
    };

    const tryFindingElement = selector => {
      let count = 0;
      const intervalId = setInterval(() => {
        const retryElement = document.querySelector(selector);

        if (retryElement) {
          processElement(retryElement, selector);
          clearInterval(intervalId);
        } else if (++count >= 20) {
          console.log("No element present on DOM with selector '".concat(selector, "'."));
          clearInterval(intervalId);
        }
      }, 500);
    };

    Object.keys(selectors).forEach(selector => {
      const element = document.querySelector(selector);

      if (element) {
        processElement(element, selector);
        elementDisplayed = true;
      } else {
        tryFindingElement(selector);
      }
    });

    if (elementDisplayed && !isPreview) {
      window.clevertap.renderNotificationViewed({
        msgId: targetingMsgJson.wzrk_id,
        pivotId: targetingMsgJson.wzrk_pivot
      });
    }
  };
  /**
   * Dispatches JSON data.
   * @param {Object} targetingMsgJson - The point and click campaign JSON object.
   * @param {Object} selector - The selector object.
   */

  function dispatchJsonData(targetingMsgJson, selector) {
    const inaObj = {};
    inaObj.msgId = targetingMsgJson.wzrk_id;

    if (targetingMsgJson.wzrk_pivot) {
      inaObj.pivotId = targetingMsgJson.wzrk_pivot;
    }

    if (selector.json != null) {
      inaObj.json = selector.json;
    }

    const kvPairsEvent = new CustomEvent('CT_web_native_display_buider', {
      detail: inaObj
    });
    document.dispatchEvent(kvPairsEvent);
  }

  function isValidUrl(string) {
    try {
      const url = new URL(string);
      return Boolean(url);
    } catch (_err) {
      return false;
    }
  }

  function addAntiFlicker(antiFlicker) {
    const {
      personalizedSelectors = [],
      delayTime = 2000
    } = antiFlicker;
    const retryElements = {}; // Track selectors that need retry

    let retryCount = 0; // Counter for retries

    let retryInterval;

    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const {
        innerHeight: windowHeight,
        innerWidth: windowWidth
      } = window;
      return rect.bottom > 0 && rect.right > 0 && rect.top < windowHeight && rect.left < windowWidth;
    }

    (function () {
      const styleContent = "\n      .wve-anti-flicker-hide {\n        opacity: 0 !important\n      }\n      .wve-anti-flicker-show {\n        transition: opacity 0.5s, filter 0.5s !important\n      }\n    "; // Create and append the style element if it doesn't exist

      const styleId = WVE_CLASS.FLICKER_ID;

      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styleContent;
        document.head.appendChild(styleElement);
      }
    })();

    function applyAntiFlicker(selectors) {
      function processSelectors(selectorElements) {
        const elements = [];
        selectorElements.forEach(selector => {
          const matchedElements = document.querySelectorAll(selector);

          if (matchedElements.length) {
            matchedElements.forEach(el => {
              if (isInViewport(el)) {
                elements.push(el);
              }
            });
            delete retryElements[selector]; // Successfully processed, remove from retry list
          } else {
            retryElements[selector] = false; // Add to retry list if not found
          }
        });
        applyStyles(elements);
      }

      function retryProcessing() {
        processSelectors(Object.keys(retryElements));
        retryCount++;

        if (Object.keys(retryElements).length === 0 || retryCount > 20) {
          retryCount = 0;
          clearInterval(retryInterval);
        }
      }

      processSelectors(selectors);

      if (Object.keys(retryElements).length) {
        retryInterval = setInterval(retryProcessing, 100);
      }
    }

    function applyStyles(elements) {
      elements.forEach(el => el.classList.add(WVE_CLASS.FLICKER_HIDE));
      setTimeout(() => {
        elements.forEach(el => {
          el.classList.remove(WVE_CLASS.FLICKER_HIDE);
          el.classList.add(WVE_CLASS.FLICKER_SHOW);
        });
      }, delayTime); // Apply styles after maxRenderTime
    }

    function observeUrlChange() {
      let previousHref = document.location.href;
      const observer = new MutationObserver(() => {
        if (previousHref !== document.location.href) {
          previousHref = document.location.href;
          applyAntiFlicker(personalizedSelectors);
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    window.addEventListener('load', () => {
      observeUrlChange();
      applyAntiFlicker(personalizedSelectors);
    });
  }

  class CTWebPersonalisationBanner extends HTMLElement {
    constructor() {
      super();
      this._details = null;
      this.shadow = null;
      this.shadow = this.attachShadow({
        mode: 'open'
      });
    }

    get details() {
      return this._details || '';
    }

    set details(val) {
      if (this._details === null) {
        this._details = val;
        this.renderBanner();
      }
    }

    renderBanner() {
      this.shadow.innerHTML = this.getBannerContent();

      if (this.trackClick !== false) {
        this.addEventListener('click', () => {
          const onClickUrl = this.details.onClick;

          if (onClickUrl) {
            this.details.window ? window.open(onClickUrl, '_blank') : window.parent.location.href = onClickUrl;
          }

          window.clevertap.renderNotificationClicked({
            msgId: this.msgId,
            pivotId: this.pivotId
          });
        });
      }

      window.clevertap.renderNotificationViewed({
        msgId: this.msgId,
        pivotId: this.pivotId
      });
    }

    getBannerContent() {
      return "\n      <style type=\"text/css\">\n        .banner {\n          position: relative;\n          cursor: ".concat(this.details.onClick ? 'pointer' : '', "\n        }\n        img {\n          height: ").concat(this.divHeight ? this.divHeight : 'auto', ";\n          width: 100%;\n        }\n        .wrapper:is(.left, .right, .center) {\n          display: flex;\n          justify-content: center;\n          flex-direction: column;\n          align-items: center;\n          position: absolute;\n          width: 100%;\n          height: 100%;\n          overflow: auto;\n          top: 0;\n        }\n        ").concat(this.details.css ? this.details.css : '', "\n      </style>\n      <div class=\"banner\">\n        <picture>\n          <source media=\"(min-width:480px)\" srcset=\"").concat(this.details.desktopImageURL, "\">\n          <source srcset=\"").concat(this.details.mobileImageURL, "\">\n          <img src=\"").concat(this.details.desktopImageURL, "\" alt=\"Please upload a picture\" style=\"width:100%;\" part=\"banner__img\">\n        </picture>\n        ").concat(this.details.html ? this.details.html : '', "\n      </div>\n    ");
    }

  }

  class CTWebPersonalisationCarousel extends HTMLElement {
    constructor() {
      super();
      this._target = null;
      this._carousel = null;
      this.shadow = null;
      this.slides = 0;
      this.previouslySelectedItem = -1;
      this.selectedItem = 1;
      this.autoSlide = null;
      this.stopAutoSlideTimeout = null;
      this.shadow = this.attachShadow({
        mode: 'open'
      });

      if (customElements.get('ct-web-personalisation-banner') === undefined) {
        customElements.define('ct-web-personalisation-banner', CTWebPersonalisationBanner);
      }
    }

    get target() {
      return this._target || '';
    }

    set target(val) {
      if (this._target === null) {
        this._target = val;
        this.renderCarousel();
      }
    }

    get details() {
      return this.target.display.details;
    }

    get display() {
      return this.target.display;
    }

    renderCarousel() {
      this.slides = this.details.length;
      this.shadow.innerHTML = this.getStyles();
      const carousel = this.getCarouselContent();

      if (this.display.showNavBtns) {
        carousel.insertAdjacentHTML('beforeend', this.display.navBtnsHtml);
      }

      if (this.display.showNavArrows) {
        carousel.insertAdjacentHTML('beforeend', this.display.leftNavArrowHtml);
        carousel.insertAdjacentHTML('beforeend', this.display.rightNavArrowHtml);
      }

      this._carousel = carousel;
      this.shadow.appendChild(carousel);
      this.setupClick();
      this.updateSelectedItem(); // TODO: enable conditionally

      this.startAutoSlide();
      this.setupOnHover();
      window.clevertap.renderNotificationViewed({
        msgId: this.target.wzrk_id,
        pivotId: this.target.wzrk_pivot
      });
    }

    setupClick() {
      this._carousel.addEventListener('click', event => {
        const eventID = event.target.id;

        if (eventID.startsWith('carousel__button')) {
          const selected = +eventID.split('-')[1];

          if (selected !== this.selectedItem) {
            this.previouslySelectedItem = this.selectedItem;
            this.selectedItem = selected;
            this.updateSelectedItem();
            this.startAutoSlide();
          }
        } else if (eventID.startsWith('carousel__arrow')) {
          eventID.endsWith('right') ? this.goToNext() : this.goToPrev();
          this.startAutoSlide();
        } else if (eventID.indexOf('-') > -1) {
          const item = +eventID.split('-')[1];
          const index = item - 1;

          if (window.parent.clevertap) {
            window.clevertap.renderNotificationClicked({
              msgId: this.target.wzrk_id,
              pivotId: this.target.wzrk_pivot,
              wzrk_slideNo: item
            });
          }

          const url = this.details[index].onClick;

          if (url !== '') {
            this.details[index].window ? window.open(url, '_blank') : window.location.href = url;
          }
        }
      });
    }

    setupOnHover() {
      this._carousel.addEventListener('mouseenter', event => {
        this.stopAutoSlideTimeout = setTimeout(() => {
          this.autoSlide = clearInterval(this.autoSlide);
        }, 500);
      });

      this._carousel.addEventListener('mouseleave', event => {
        clearTimeout(this.stopAutoSlideTimeout);

        if (this.autoSlide === undefined) {
          this.startAutoSlide();
        }
      });
    }

    getCarouselContent() {
      const carousel = document.createElement('div');
      carousel.setAttribute('class', 'carousel');
      this.details.forEach((detail, i) => {
        const banner = document.createElement('ct-web-personalisation-banner');
        banner.classList.add('carousel__item');
        banner.trackClick = false;
        banner.setAttribute('id', "carousel__item-".concat(i + 1));
        banner.details = detail;
        carousel.appendChild(banner);
      });
      return carousel;
    }

    getStyles() {
      var _this$target, _this$target$display;

      return "\n      <style>\n      .carousel {\n        position: relative;\n      }\n\n      .carousel__item {\n        display: none;\n        background-repeat: no-repeat;\n        background-size: cover;\n      }\n\n      ct-web-personalisation-banner::part(banner__img) {\n        height: ".concat((this === null || this === void 0 ? void 0 : (_this$target = this.target) === null || _this$target === void 0 ? void 0 : (_this$target$display = _this$target.display) === null || _this$target$display === void 0 ? void 0 : _this$target$display.divHeight) ? this.target.display.divHeight : 'auto', ";\n        width: 100%;\n        transition: 2s;\n      }\n\n      .carousel__item--selected {\n        display: block;\n      }\n      ").concat(this.display.navBtnsCss, "\n      ").concat(this.display.navArrowsCss, "\n      </style>\n  ");
    }

    updateSelectedItem() {
      if (this.previouslySelectedItem !== -1) {
        const prevItem = this.shadow.getElementById("carousel__item-".concat(this.previouslySelectedItem));
        const prevButton = this.shadow.getElementById("carousel__button-".concat(this.previouslySelectedItem));
        prevItem.classList.remove('carousel__item--selected');

        if (prevButton) {
          prevButton.classList.remove('carousel__button--selected');
        }
      }

      const item = this.shadow.getElementById("carousel__item-".concat(this.selectedItem));
      const button = this.shadow.getElementById("carousel__button-".concat(this.selectedItem));
      item.classList.add('carousel__item--selected');

      if (button) {
        button.classList.add('carousel__button--selected');
      }
    }

    startAutoSlide() {
      clearInterval(this.autoSlide);
      this.autoSlide = setInterval(() => {
        this.goToNext();
      }, this.display.sliderTime ? this.display.sliderTime * 1000 : 3000);
    }

    goToNext() {
      this.goTo(this.selectedItem, (this.selectedItem + 1) % this.slides);
    }

    goToPrev() {
      this.goTo(this.selectedItem, this.selectedItem - 1);
    }

    goTo(prev, cur) {
      this.previouslySelectedItem = prev;
      this.selectedItem = cur;

      if (cur === 0) {
        this.selectedItem = this.slides;
      }

      this.updateSelectedItem();
    }

  }

  const renderPersonalisationBanner = targetingMsgJson => {
    var _targetingMsgJson$dis;

    if (customElements.get('ct-web-personalisation-banner') === undefined) {
      customElements.define('ct-web-personalisation-banner', CTWebPersonalisationBanner);
    }

    const divId = (_targetingMsgJson$dis = targetingMsgJson.display.divId) !== null && _targetingMsgJson$dis !== void 0 ? _targetingMsgJson$dis : targetingMsgJson.display.divSelector;
    const bannerEl = document.createElement('ct-web-personalisation-banner');
    bannerEl.msgId = targetingMsgJson.wzrk_id;
    bannerEl.pivotId = targetingMsgJson.wzrk_pivot;
    bannerEl.divHeight = targetingMsgJson.display.divHeight;
    bannerEl.details = targetingMsgJson.display.details[0];
    const containerEl = targetingMsgJson.display.divId ? document.getElementById(divId) : document.querySelector(divId);
    containerEl.innerHTML = '';
    containerEl.appendChild(bannerEl);
  };
  const renderPersonalisationCarousel = targetingMsgJson => {
    var _targetingMsgJson$dis2;

    if (customElements.get('ct-web-personalisation-carousel') === undefined) {
      customElements.define('ct-web-personalisation-carousel', CTWebPersonalisationCarousel);
    }

    const divId = (_targetingMsgJson$dis2 = targetingMsgJson.display.divId) !== null && _targetingMsgJson$dis2 !== void 0 ? _targetingMsgJson$dis2 : targetingMsgJson.display.divSelector;
    const carousel = document.createElement('ct-web-personalisation-carousel');
    carousel.target = targetingMsgJson;
    const container = targetingMsgJson.display.divId ? document.getElementById(divId) : document.querySelector(divId);
    container.innerHTML = '';
    container.appendChild(carousel);
  };
  const handleKVpairCampaign = targetingMsgJson => {
    const inaObj = {};
    inaObj.msgId = targetingMsgJson.wzrk_id;

    if (targetingMsgJson.wzrk_pivot) {
      inaObj.pivotId = targetingMsgJson.wzrk_pivot;
    }

    if (targetingMsgJson.msgContent.kv != null) {
      inaObj.kv = targetingMsgJson.msgContent.kv;
    }

    const kvPairsEvent = new CustomEvent('CT_web_native_display', {
      detail: inaObj
    });
    document.dispatchEvent(kvPairsEvent);
  };

  const invokeExternalJs = (jsFunc, targetingMsgJson) => {
    const func = window.parent[jsFunc];

    if (typeof func === 'function') {
      if (targetingMsgJson.display.kv != null) {
        func(targetingMsgJson.display.kv);
      } else {
        func();
      }
    }
  };
  const appendScriptForCustomEvent = (targetingMsgJson, html) => {
    const script = "<script>\n      const ct__camapignId = '".concat(targetingMsgJson.wzrk_id, "';\n      const ct__formatVal = (v) => {\n          return v && v.trim().substring(0, 20);\n      }\n      const ct__parentOrigin =  window.parent.origin;\n      document.body.addEventListener('click', (event) => {\n        const elem = event.target.closest?.('a[wzrk_c2a], button[wzrk_c2a]');\n        if (elem) {\n            const {innerText, id, name, value, href} = elem;\n            const clickAttr = elem.getAttribute('onclick') || elem.getAttribute('click');\n            const onclickURL = clickAttr?.match(/(window.open)[(](\"|')(.*)(\"|',)/)?.[3] || clickAttr?.match(/(location.href *= *)(\"|')(.*)(\"|')/)?.[3];\n            const props = {innerText, id, name, value};\n            let msgCTkv = Object.keys(props).reduce((acc, c) => {\n                const formattedVal = ct__formatVal(props[c]);\n                formattedVal && (acc['wzrk_click_' + c] = formattedVal);\n                return acc;\n            }, {});\n            if(onclickURL) { msgCTkv['wzrk_click_' + 'url'] = onclickURL; }\n            if(href) { msgCTkv['wzrk_click_' + 'c2a'] = href; }\n            const notifData = { msgId: ct__camapignId, msgCTkv, pivotId: '").concat(targetingMsgJson.wzrk_pivot, "' };\n            window.parent.clevertap.renderNotificationClicked(notifData);\n        }\n      });\n      </script>\n    ");
    return html.replace(/(<\s*\/\s*body)/, "".concat(script, "\n$1"));
  };
  const staleDataUpdate = (staledata, campType) => {
    const campObj = getCampaignObject();
    const globalObj = campObj[campType].global;

    if (globalObj != null && campType) {
      for (const idx in staledata) {
        if (staledata.hasOwnProperty(idx)) {
          delete globalObj[staledata[idx]];

          if (StorageManager.read(CAMP_COOKIE_G)) {
            const guidCampObj = JSON.parse(decodeURIComponent(StorageManager.read(CAMP_COOKIE_G)));
            const guid = JSON.parse(decodeURIComponent(StorageManager.read(GCOOKIE_NAME)));

            if (guidCampObj[guid] && guidCampObj[guid][campType] && guidCampObj[guid][campType][staledata[idx]]) {
              delete guidCampObj[guid][campType][staledata[idx]];
              StorageManager.save(CAMP_COOKIE_G, encodeURIComponent(JSON.stringify(guidCampObj)));
            }
          }
        }
      }
    }

    saveCampaignObject(campObj);
  };
  const mergeEventMap = newEvtMap => {
    if ($ct.globalEventsMap == null) {
      $ct.globalEventsMap = StorageManager.readFromLSorCookie(EV_COOKIE);

      if ($ct.globalEventsMap == null) {
        $ct.globalEventsMap = newEvtMap;
        return;
      }
    }

    for (const key in newEvtMap) {
      if (newEvtMap.hasOwnProperty(key)) {
        const oldEvtObj = $ct.globalEventsMap[key];
        const newEvtObj = newEvtMap[key];

        if ($ct.globalEventsMap[key] != null) {
          if (newEvtObj[0] != null && newEvtObj[0] > oldEvtObj[0]) {
            $ct.globalEventsMap[key] = newEvtObj;
          }
        } else {
          $ct.globalEventsMap[key] = newEvtObj;
        }
      }
    }
  };
  const incrementImpression = (targetingMsgJson, _request) => {
    const data = {};
    data.type = 'event';
    data.evtName = NOTIFICATION_VIEWED;
    data.evtData = {
      [WZRK_ID]: targetingMsgJson.wzrk_id
    };

    if (targetingMsgJson.wzrk_pivot) {
      data.evtData = { ...data.evtData,
        wzrk_pivot: targetingMsgJson.wzrk_pivot
      };
    }

    _request.processEvent(data);
  };
  const setupClickEvent = (onClick, targetingMsgJson, contentDiv, divId, isLegacy, _device, _session) => {
    if (onClick !== '' && onClick != null) {
      let ctaElement;
      let jsCTAElements;

      if (isLegacy) {
        ctaElement = contentDiv;
      } else if (contentDiv !== null) {
        jsCTAElements = contentDiv.getElementsByClassName('jsCT_CTA');

        if (jsCTAElements != null && jsCTAElements.length === 1) {
          ctaElement = jsCTAElements[0];
        }
      }

      const jsFunc = targetingMsgJson.display.jsFunc;
      const isPreview = targetingMsgJson.display.preview;

      if (isPreview == null) {
        onClick += getCookieParams(_device, _session);
      }

      if (ctaElement != null) {
        ctaElement.onclick = () => {
          // invoke js function call
          if (jsFunc != null) {
            // track notification clicked event
            if (isPreview == null) {
              RequestDispatcher.fireRequest(onClick);
            }

            invokeExternalJs(jsFunc, targetingMsgJson); // close iframe. using -1 for no campaignId

            closeIframe('-1', divId, _session.sessionId);
          } else {
            const rValue = targetingMsgJson.display.preview ? targetingMsgJson.display.onClick : new URL(targetingMsgJson.display.onClick).searchParams.get('r');
            const campaignId = targetingMsgJson.wzrk_id.split('_')[0];

            if (rValue === 'pushPrompt') {
              if (!targetingMsgJson.display.preview) {
                window.parent.clevertap.renderNotificationClicked({
                  msgId: targetingMsgJson.wzrk_id,
                  pivotId: targetingMsgJson.wzrk_pivot
                });
              } // Open Web Push Soft prompt


              window.clevertap.notifications.push({
                skipDialog: true
              });
              closeIframe(campaignId, divId, _session.sessionId);
            } else if (rValue === 'none') {
              // Close notification
              closeIframe(campaignId, divId, _session.sessionId);
            } else {
              // Will get the url to open
              if (targetingMsgJson.display.window === 1) {
                window.open(onClick, '_blank');

                if (targetingMsgJson.display['close-popup']) {
                  closeIframe(campaignId, divId, _session.sessionId);
                }

                if (!targetingMsgJson.display.preview) {
                  window.parent.clevertap.renderNotificationClicked({
                    msgId: targetingMsgJson.wzrk_id,
                    pivotId: targetingMsgJson.wzrk_pivot
                  });
                }
              } else {
                window.location = onClick;
              }
            }
          }
        };
      }
    }
  };
  const getCookieParams = (_device, _session) => {
    const gcookie = _device.getGuid();

    const scookieObj = _session.getSessionCookieObject();

    return '&t=wc&d=' + encodeURIComponent(compressToBase64(gcookie + '|' + scookieObj.p + '|' + scookieObj.s));
  };

  const renderPopUpImageOnly = (targetingMsgJson, _session) => {
    const divId = 'wzrkImageOnlyDiv';
    const popupImageOnly = document.createElement('ct-web-popup-imageonly');
    popupImageOnly.session = _session;
    popupImageOnly.target = targetingMsgJson;
    const containerEl = document.getElementById(divId);
    containerEl.innerHTML = '';
    containerEl.style.visibility = 'hidden';
    containerEl.appendChild(popupImageOnly);
  };

  const getBoxPromptStyles = style => {
    const totalBorderWidth = style.card.borderEnabled ? style.card.border.borderWidth * 2 : 0;
    const cardPadding = 16 * 2; // Left and right padding

    const cardContentWidth = 360 - cardPadding - totalBorderWidth;
    return "\n    #pnWrapper {\n      width: 360px;\n    }\n\n    #pnOverlay {\n      background-color: ".concat(style.overlay.color || 'rgba(0, 0, 0, .15)', ";\n      position: fixed;\n      left: 0;\n      right: 0;\n      top: 0;\n      bottom: 0;\n      z-index: 10000\n    }\n\n    #pnCard {\n      background-color: ").concat(style.card.color, ";\n      border-radius: ").concat(style.card.borderRadius, "px;\n      padding: 16px;\n      width: ").concat(cardContentWidth, "px;\n      position: fixed;\n      z-index: 999999;\n      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n      ").concat(style.card.borderEnabled ? "\n        border-width: ".concat(style.card.border.borderWidth, "px;\n        border-color: ").concat(style.card.border.borderColor, ";\n        border-style: solid;\n      ") : '', "\n      height: fit-content;\n    }\n\n    #iconTitleDescWrapper {\n      display: flex;\n      align-items: center;\n      margin-bottom: 16px;\n      gap: 12px;\n    }\n\n    #iconContainer {\n      min-width: 64px;\n      max-width: 64px;\n      aspect-ratio: 1;\n      object-fit: cover;\n    }\n\n    #titleDescWrapper {\n      flex-grow: 1;\n      overflow: hidden;\n      overflow-wrap: break-word;\n    }\n\n    #title {\n      font-size: 16px;\n      font-weight: 700;\n      color: ").concat(style.text.titleColor, ";\n      margin-bottom: 4px;\n      line-height: 24px;\n    }\n\n    #description {\n      font-size: 14px;\n      font-weight: 500;\n      color: ").concat(style.text.descriptionColor, ";\n      line-height: 20px;\n    }\n\n    #buttonsContainer {\n      display: flex;\n      justify-content: space-between;\n      min-height: 32px;\n      gap: 8px;\n      align-items: center;\n    }\n\n    #primaryButton, #secondaryButton {\n      padding: 6px 24px;\n      flex: 1;\n      cursor: pointer;\n      font-weight: bold;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      height: max-content;\n      font-size: 14px;\n      font-weight: 500;\n      line-height: 20px;\n    }\n\n    #primaryButton {\n      background-color: ").concat(style.buttons.primaryButton.buttonColor, ";\n      color: ").concat(style.buttons.primaryButton.textColor, ";\n      border-radius: ").concat(style.buttons.primaryButton.borderRadius, "px;\n      ").concat(style.buttons.primaryButton.borderEnabled ? "\n          border-width: ".concat(style.buttons.primaryButton.border.borderWidth, "px;\n          border-color: ").concat(style.buttons.primaryButton.border.borderColor, ";\n          border-style: solid;\n        ") : 'border: none;', "\n    }\n\n    #secondaryButton {\n      background-color: ").concat(style.buttons.secondaryButton.buttonColor, ";\n      color: ").concat(style.buttons.secondaryButton.textColor, ";\n      border-radius: ").concat(style.buttons.secondaryButton.borderRadius, "px;\n      ").concat(style.buttons.secondaryButton.borderEnabled ? "\n          border-width: ".concat(style.buttons.secondaryButton.border.borderWidth, "px;\n          border-color: ").concat(style.buttons.secondaryButton.border.borderColor, ";\n          border-style: solid;\n        ") : 'border: none;', "\n    }\n\n    #primaryButton:hover, #secondaryButton:hover {\n      opacity: 0.9;\n    }\n  ");
  };
  const getBellIconStyles = style => {
    return "\n    #bell_wrapper {\n      position: fixed;\n      cursor: pointer;\n      background-color: ".concat(style.card.backgroundColor, ";\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n      width: 48px;\n      height: 48px;\n      border-radius: 50%;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      z-index: 999999;\n    }\n\n    #bell_icon {\n      display: block;\n      width: 48px;\n      height: 48px;\n    }\n\n    #bell_wrapper:hover {\n      transform: scale(1.05);\n      transition: transform 0.2s ease-in-out;\n    }\n\n    #bell_tooltip {\n      display: none;\n      background-color: #2b2e3e;\n      color: #fff;\n      border-radius: 4px;\n      padding: 4px;\n      white-space: nowrap;\n      pointer-events: none;\n      font-size: 14px;\n      line-height: 1.4;\n    }\n\n    #gif_modal {\n      display: none;\n      background-color: #ffffff;\n      padding: 4px;\n      width: 400px;\n      height: 256px;\n      border-radius: 4px;\n      position: relative;\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n      cursor: default;\n    }\n\n    #gif_image {\n      object-fit: contain;\n      width: 100%;\n      height: 100%;\n    }\n\n    #close_modal {\n      position: absolute;\n      width: 24px;\n      height: 24px;\n      top: 8px;\n      right: 8px;\n      background: rgba(238, 238, 238, 0.8);\n      text-align: center;\n      line-height: 20px;\n      border-radius: 4px;\n      color: #000000;\n      font-size: 22px;\n      cursor: pointer;\n    }\n  ");
  };

  var _oldValues$3 = _classPrivateFieldLooseKey("oldValues");

  var _logger$5 = _classPrivateFieldLooseKey("logger");

  var _request$4 = _classPrivateFieldLooseKey("request");

  var _account$2 = _classPrivateFieldLooseKey("account");

  var _wizAlertJSPath = _classPrivateFieldLooseKey("wizAlertJSPath");

  var _fcmPublicKey = _classPrivateFieldLooseKey("fcmPublicKey");

  var _setUpWebPush = _classPrivateFieldLooseKey("setUpWebPush");

  var _setUpSafariNotifications = _classPrivateFieldLooseKey("setUpSafariNotifications");

  var _setUpChromeFirefoxNotifications = _classPrivateFieldLooseKey("setUpChromeFirefoxNotifications");

  var _addWizAlertJS = _classPrivateFieldLooseKey("addWizAlertJS");

  var _removeWizAlertJS = _classPrivateFieldLooseKey("removeWizAlertJS");

  var _handleNotificationRegistration = _classPrivateFieldLooseKey("handleNotificationRegistration");

  class NotificationHandler extends Array {
    constructor(_ref, values) {
      let {
        logger,
        session,
        request,
        account
      } = _ref;
      super();
      Object.defineProperty(this, _handleNotificationRegistration, {
        value: _handleNotificationRegistration2
      });
      Object.defineProperty(this, _removeWizAlertJS, {
        value: _removeWizAlertJS2
      });
      Object.defineProperty(this, _addWizAlertJS, {
        value: _addWizAlertJS2
      });
      Object.defineProperty(this, _setUpChromeFirefoxNotifications, {
        value: _setUpChromeFirefoxNotifications2
      });
      Object.defineProperty(this, _setUpSafariNotifications, {
        value: _setUpSafariNotifications2
      });
      Object.defineProperty(this, _setUpWebPush, {
        value: _setUpWebPush2
      });
      Object.defineProperty(this, _oldValues$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$5, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _wizAlertJSPath, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _fcmPublicKey, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _wizAlertJSPath)[_wizAlertJSPath] = 'https://d2r1yp2w7bby2u.cloudfront.net/js/wzrk_dialog.min.js';
      _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] = null;
      _classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3] = values;
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5] = logger;
      _classPrivateFieldLooseBase(this, _request$4)[_request$4] = request;
      _classPrivateFieldLooseBase(this, _account$2)[_account$2] = account;
    }

    push() {
      for (var _len = arguments.length, displayArgs = new Array(_len), _key = 0; _key < _len; _key++) {
        displayArgs[_key] = arguments[_key];
      }

      _classPrivateFieldLooseBase(this, _setUpWebPush)[_setUpWebPush](displayArgs);

      return 0;
    }

    enable() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const {
        swPath
      } = options;
      enablePush(_classPrivateFieldLooseBase(this, _logger$5)[_logger$5], _classPrivateFieldLooseBase(this, _account$2)[_account$2], _classPrivateFieldLooseBase(this, _request$4)[_request$4], swPath);
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3]) {
        _classPrivateFieldLooseBase(this, _setUpWebPush)[_setUpWebPush](_classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3] = null;
    }

    setUpWebPushNotifications(subscriptionCallback, serviceWorkerPath, apnsWebPushId, apnsServiceUrl) {
      if (navigator.userAgent.indexOf('Chrome') !== -1 || navigator.userAgent.indexOf('Firefox') !== -1) {
        _classPrivateFieldLooseBase(this, _setUpChromeFirefoxNotifications)[_setUpChromeFirefoxNotifications](subscriptionCallback, serviceWorkerPath);
      } else if (navigator.userAgent.indexOf('Safari') !== -1) {
        _classPrivateFieldLooseBase(this, _setUpSafariNotifications)[_setUpSafariNotifications](subscriptionCallback, apnsWebPushId, apnsServiceUrl);
      }
    }

    setApplicationServerKey(applicationServerKey) {
      _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] = applicationServerKey;
    }

    _enableWebPush(enabled, applicationServerKey) {
      $ct.webPushEnabled = enabled;

      if (applicationServerKey != null) {
        this.setApplicationServerKey(applicationServerKey);
      }

      if ($ct.webPushEnabled && $ct.notifApi.notifEnabledFromApi) {
        _classPrivateFieldLooseBase(this, _handleNotificationRegistration)[_handleNotificationRegistration]($ct.notifApi.displayArgs);
      } else if (!$ct.webPushEnabled && $ct.notifApi.notifEnabledFromApi) {
        _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Ensure that web push notifications are fully enabled and integrated before requesting them');
      }
    }

  }

  var _setUpWebPush2 = function _setUpWebPush2(displayArgs) {
    if ($ct.webPushEnabled && displayArgs.length > 0) {
      _classPrivateFieldLooseBase(this, _handleNotificationRegistration)[_handleNotificationRegistration](displayArgs);
    } else if ($ct.webPushEnabled == null && displayArgs.length > 0) {
      $ct.notifApi.notifEnabledFromApi = true;
      $ct.notifApi.displayArgs = displayArgs.slice();
    } else if ($ct.webPushEnabled === false && displayArgs.length > 0) {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Make sure push notifications are fully enabled and integrated');
    }
  };

  var _setUpSafariNotifications2 = function _setUpSafariNotifications2(subscriptionCallback, apnsWebPushId, apnsServiceUrl) {
    // ensure that proper arguments are passed
    if (typeof apnsWebPushId === 'undefined') {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Ensure that APNS Web Push ID is supplied');
    }

    if (typeof apnsServiceUrl === 'undefined') {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Ensure that APNS Web Push service path is supplied');
    }

    if ('safari' in window && 'pushNotification' in window.safari) {
      window.safari.pushNotification.requestPermission(apnsServiceUrl, apnsWebPushId, {}, subscription => {
        if (subscription.permission === 'granted') {
          const subscriptionData = JSON.parse(JSON.stringify(subscription));
          subscriptionData.endpoint = subscription.deviceToken;
          subscriptionData.browser = 'Safari';
          StorageManager.saveToLSorCookie(PUSH_SUBSCRIPTION_DATA, subscriptionData);

          _classPrivateFieldLooseBase(this, _request$4)[_request$4].registerToken(subscriptionData);

          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Safari Web Push registered. Device Token: ' + subscription.deviceToken);
        } else if (subscription.permission === 'denied') {
          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Error subscribing to Safari web push');
        }
      });
    }
  };

  var _setUpChromeFirefoxNotifications2 = function _setUpChromeFirefoxNotifications2(subscriptionCallback, serviceWorkerPath) {
    let registrationScope = '';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath).then(registration => {
        if (typeof __wzrk_account_id !== 'undefined') {
          // eslint-disable-line
          // shopify accounts , since the service worker is not at root, serviceWorker.ready is never resolved.
          // hence add a timeout and hope serviceWroker is ready within that time.
          return new Promise(resolve => setTimeout(() => resolve(registration), 5000));
        }

        registrationScope = registration.scope; // IF SERVICE WORKER IS AT ROOT, RETURN THE READY PROMISE
        // ELSE IF CHROME RETURN PROMISE AFTER 5 SECONDS
        // OR getRegistrations PROMISE IF ITS FIREFOX

        const rootDirRegex = /^(\.?)(\/?)([^/]*).js$/;
        const isServiceWorkerAtRoot = rootDirRegex.test(serviceWorkerPath);

        if (isServiceWorkerAtRoot) {
          return navigator.serviceWorker.ready;
        } else {
          if (navigator.userAgent.indexOf('Chrome') !== -1) {
            return new Promise(resolve => setTimeout(() => resolve(registration), 5000));
          } else {
            return navigator.serviceWorker.getRegistrations();
          }
        }
      }).then(serviceWorkerRegistration => {
        // ITS AN ARRAY IN CASE OF FIREFOX, SO USE THE REGISTRATION WITH PROPER SCOPE
        if (navigator.userAgent.indexOf('Firefox') !== -1 && Array.isArray(serviceWorkerRegistration)) {
          serviceWorkerRegistration = serviceWorkerRegistration.filter(i => i.scope === registrationScope)[0];
        }

        const subscribeObj = {
          userVisibleOnly: true
        };

        if (_classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] != null) {
          subscribeObj.applicationServerKey = urlBase64ToUint8Array(_classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey]);
        }

        serviceWorkerRegistration.pushManager.subscribe(subscribeObj).then(subscription => {
          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Service Worker registered. Endpoint: ' + subscription.endpoint); // convert the subscription keys to strings; this sets it up nicely for pushing to LC


          const subscriptionData = JSON.parse(JSON.stringify(subscription)); // remove the common chrome/firefox endpoint at the beginning of the token

          if (navigator.userAgent.indexOf('Chrome') !== -1) {
            subscriptionData.endpoint = subscriptionData.endpoint.split('/').pop();
            subscriptionData.browser = 'Chrome';
          } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            subscriptionData.endpoint = subscriptionData.endpoint.split('/').pop();
            subscriptionData.browser = 'Firefox';
          }

          StorageManager.saveToLSorCookie(PUSH_SUBSCRIPTION_DATA, subscriptionData);

          _classPrivateFieldLooseBase(this, _request$4)[_request$4].registerToken(subscriptionData);

          if (typeof subscriptionCallback !== 'undefined' && typeof subscriptionCallback === 'function') {
            subscriptionCallback();
          }

          const existingBellWrapper = document.getElementById('bell_wrapper');

          if (existingBellWrapper) {
            existingBellWrapper.parentNode.removeChild(existingBellWrapper);
          }
        }).catch(error => {
          // unsubscribe from webpush if error
          serviceWorkerRegistration.pushManager.getSubscription().then(subscription => {
            if (subscription !== null) {
              subscription.unsubscribe().then(successful => {
                // You've successfully unsubscribed
                _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Unsubscription successful');

                window.clevertap.notifications.push({
                  skipDialog: true
                });
              }).catch(e => {
                // Unsubscription failed
                _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Error unsubscribing: ' + e);
              });
            }
          });

          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Error subscribing: ' + error);
        });
      }).catch(err => {
        _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('error registering service worker: ' + err);
      });
    }
  };

  var _addWizAlertJS2 = function _addWizAlertJS2() {
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('id', 'wzrk-alert-js');
    scriptTag.setAttribute('src', _classPrivateFieldLooseBase(this, _wizAlertJSPath)[_wizAlertJSPath]); // add the script tag to the end of the body

    document.getElementsByTagName('body')[0].appendChild(scriptTag);
    return scriptTag;
  };

  var _removeWizAlertJS2 = function _removeWizAlertJS2() {
    const scriptTag = document.getElementById('wzrk-alert-js');
    scriptTag.parentNode.removeChild(scriptTag);
  };

  var _handleNotificationRegistration2 = function _handleNotificationRegistration2(displayArgs) {
    // make sure everything is specified
    let titleText;
    let bodyText;
    let okButtonText;
    let rejectButtonText;
    let okButtonColor;
    let skipDialog;
    let askAgainTimeInSeconds;
    let okCallback;
    let rejectCallback;
    let subscriptionCallback;
    let serviceWorkerPath;
    let httpsPopupPath;
    let httpsIframePath;
    let apnsWebPushId;
    let apnsWebPushServiceUrl;

    if (displayArgs.length === 1) {
      if (isObject(displayArgs[0])) {
        const notifObj = displayArgs[0];
        titleText = notifObj.titleText;
        bodyText = notifObj.bodyText;
        okButtonText = notifObj.okButtonText;
        rejectButtonText = notifObj.rejectButtonText;
        okButtonColor = notifObj.okButtonColor;
        skipDialog = notifObj.skipDialog;
        askAgainTimeInSeconds = notifObj.askAgainTimeInSeconds;
        okCallback = notifObj.okCallback;
        rejectCallback = notifObj.rejectCallback;
        subscriptionCallback = notifObj.subscriptionCallback;
        serviceWorkerPath = notifObj.serviceWorkerPath;
        httpsPopupPath = notifObj.httpsPopupPath;
        httpsIframePath = notifObj.httpsIframePath;
        apnsWebPushId = notifObj.apnsWebPushId;
        apnsWebPushServiceUrl = notifObj.apnsWebPushServiceUrl;
      }
    } else {
      titleText = displayArgs[0];
      bodyText = displayArgs[1];
      okButtonText = displayArgs[2];
      rejectButtonText = displayArgs[3];
      okButtonColor = displayArgs[4];
      skipDialog = displayArgs[5];
      askAgainTimeInSeconds = displayArgs[6];
    }

    if (skipDialog == null) {
      skipDialog = false;
    }

    if (serviceWorkerPath == null) {
      serviceWorkerPath = '/clevertap_sw.js';
    } // ensure that the browser supports notifications


    if (typeof navigator.serviceWorker === 'undefined') {
      return;
    }

    const isHTTP = httpsPopupPath != null && httpsIframePath != null; // make sure the site is on https for chrome notifications

    if (window.location.protocol !== 'https:' && document.location.hostname !== 'localhost' && !isHTTP) {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Make sure you are https or localhost to register for notifications');

      return;
    } // right now, we only support Chrome V50 & higher & Firefox


    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      const chromeAgent = navigator.userAgent.match(/Chrome\/(\d+)/);

      if (chromeAgent == null || parseInt(chromeAgent[1], 10) < 50) {
        return;
      }
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
      const firefoxAgent = navigator.userAgent.match(/Firefox\/(\d+)/);

      if (firefoxAgent == null || parseInt(firefoxAgent[1], 10) < 50) {
        return;
      }
    } else if (navigator.userAgent.indexOf('Safari') !== -1) {
      const safariAgent = navigator.userAgent.match(/Safari\/(\d+)/);

      if (safariAgent == null || parseInt(safariAgent[1], 10) < 50) {
        return;
      }
    } else {
      return;
    } // we check for the cookie in setUpChromeNotifications() the tokens may have changed


    if (!isHTTP) {
      if (Notification == null) {
        return;
      } // handle migrations from other services -> chrome notifications may have already been asked for before


      if (Notification.permission === 'granted') {
        // skip the dialog and register
        this.setUpWebPushNotifications(subscriptionCallback, serviceWorkerPath, apnsWebPushId, apnsWebPushServiceUrl);
        return;
      } else if (Notification.permission === 'denied') {
        // we've lost this profile :'(
        return;
      }

      if (skipDialog) {
        this.setUpWebPushNotifications(subscriptionCallback, serviceWorkerPath, apnsWebPushId, apnsWebPushServiceUrl);
        return;
      }
    } // make sure the right parameters are passed


    if (!titleText || !bodyText || !okButtonText || !rejectButtonText) {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Missing input parameters; please specify title, body, ok button and cancel button text');

      return;
    } // make sure okButtonColor is formatted properly


    if (okButtonColor == null || !okButtonColor.match(/^#[a-f\d]{6}$/i)) {
      okButtonColor = '#f28046'; // default color for positive button
    } // make sure the user isn't asked for notifications more than askAgainTimeInSeconds


    const now = new Date().getTime() / 1000;

    if (StorageManager.getMetaProp('notif_last_time') == null) {
      StorageManager.setMetaProp('notif_last_time', now);
    } else {
      if (askAgainTimeInSeconds == null) {
        // 7 days by default
        askAgainTimeInSeconds = 7 * 24 * 60 * 60;
      }

      if (now - StorageManager.getMetaProp('notif_last_time') < askAgainTimeInSeconds) {
        return;
      } else {
        // continue asking
        StorageManager.setMetaProp('notif_last_time', now);
      }
    }

    if (isHTTP) {
      // add the https iframe
      const httpsIframe = document.createElement('iframe');
      httpsIframe.setAttribute('style', 'display:none;');
      httpsIframe.setAttribute('src', httpsIframePath);
      document.body.appendChild(httpsIframe);
      window.addEventListener('message', event => {
        if (event.data != null) {
          let obj = {};

          try {
            obj = JSON.parse(event.data);
          } catch (e) {
            // not a call from our iframe
            return;
          }

          if (obj.state != null) {
            if (obj.from === 'ct' && obj.state === 'not') {
              _classPrivateFieldLooseBase(this, _addWizAlertJS)[_addWizAlertJS]().onload = () => {
                // create our wizrocket popup
                window.wzrkPermissionPopup.wizAlert({
                  title: titleText,
                  body: bodyText,
                  confirmButtonText: okButtonText,
                  confirmButtonColor: okButtonColor,
                  rejectButtonText: rejectButtonText
                }, enabled => {
                  // callback function
                  if (enabled) {
                    // the user accepted on the dialog box
                    if (typeof okCallback === 'function') {
                      okCallback();
                    } // redirect to popup.html


                    window.open(httpsPopupPath);
                  } else {
                    if (typeof rejectCallback === 'function') {
                      rejectCallback();
                    }
                  }

                  _classPrivateFieldLooseBase(this, _removeWizAlertJS)[_removeWizAlertJS]();
                });
              };
            }
          }
        }
      }, false);
    } else {
      _classPrivateFieldLooseBase(this, _addWizAlertJS)[_addWizAlertJS]().onload = () => {
        // create our wizrocket popup
        window.wzrkPermissionPopup.wizAlert({
          title: titleText,
          body: bodyText,
          confirmButtonText: okButtonText,
          confirmButtonColor: okButtonColor,
          rejectButtonText: rejectButtonText
        }, enabled => {
          // callback function
          if (enabled) {
            // the user accepted on the dialog box
            if (typeof okCallback === 'function') {
              okCallback();
            }

            this.setUpWebPushNotifications(subscriptionCallback, serviceWorkerPath, apnsWebPushId, apnsWebPushServiceUrl);
          } else {
            if (typeof rejectCallback === 'function') {
              rejectCallback();
            }
          }

          _classPrivateFieldLooseBase(this, _removeWizAlertJS)[_removeWizAlertJS]();
        });
      };
    }
  };

  const BELL_BASE64 = 'PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi40OTYyIDUuMjQzOTVDMTIuODM5MSA1LjAzMzE3IDEzLjI4NDcgNS4xNDY4OSAxMy40OTczIDUuNDg4NjdDMTMuNzIyMyA1Ljg1MDE4IDEzLjYwMDIgNi4zMjUxOCAxMy4yMzggNi41NDkwMkM3LjM5Mzk5IDEwLjE2MDYgMy41IDE2LjYyNTcgMy41IDI0LjAwMDNDMy41IDM1LjMyMjEgMTIuNjc4MiA0NC41MDAzIDI0IDQ0LjUwMDNDMjguMDA1NSA0NC41MDAzIDMxLjc0MjYgNDMuMzUxNSAzNC45IDQxLjM2NTVDMzUuMjYwOCA0MS4xMzg1IDM1Ljc0MTYgNDEuMjM4NiAzNS45NjY4IDQxLjYwMDZDMzYuMTc5MiA0MS45NDE5IDM2LjA4NSA0Mi4zOTExIDM1Ljc0NTIgNDIuNjA2QzMyLjM0NjggNDQuNzU1OSAyOC4zMTg3IDQ2LjAwMDMgMjQgNDYuMDAwM0MxMS44NDk3IDQ2LjAwMDMgMiAzNi4xNTA1IDIgMjQuMDAwM0MyIDE2LjA2NjkgNi4xOTkyMSA5LjExNDMyIDEyLjQ5NjIgNS4yNDM5NVpNMzguOCAzOS45MDAzQzM4LjggNDAuMzk3MyAzOC4zOTcxIDQwLjgwMDMgMzcuOSA0MC44MDAzQzM3LjQwMjkgNDAuODAwMyAzNyA0MC4zOTczIDM3IDM5LjkwMDNDMzcgMzkuNDAzMiAzNy40MDI5IDM5LjAwMDMgMzcuOSAzOS4wMDAzQzM4LjM5NzEgMzkuMDAwMyAzOC44IDM5LjQwMzIgMzguOCAzOS45MDAzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAxMkMyMi44OTU0IDEyIDIyIDEyLjg5NTQgMjIgMTRWMTQuMjUyQzE4LjU0OTUgMTUuMTQwMSAxNiAxOC4yNzIzIDE2IDIyVjI5LjVIMTUuNDc2OUMxNC42NjEyIDI5LjUgMTQgMzAuMTYxMiAxNCAzMC45NzY5VjMxLjAyMzFDMTQgMzEuODM4OCAxNC42NjEyIDMyLjUgMTUuNDc2OSAzMi41SDMyLjUyMzFDMzMuMzM4OCAzMi41IDM0IDMxLjgzODggMzQgMzEuMDIzMVYzMC45NzY5QzM0IDMwLjE2MTIgMzMuMzM4OCAyOS41IDMyLjUyMzEgMjkuNUgzMlYyMkMzMiAxOC4yNzIzIDI5LjQ1MDUgMTUuMTQwMSAyNiAxNC4yNTJWMTRDMjYgMTIuODk1NCAyNS4xMDQ2IDEyIDI0IDEyWk0yNiAzNFYzMy41SDIyVjM0QzIyIDM1LjEwNDYgMjIuODk1NCAzNiAyNCAzNkMyNS4xMDQ2IDM2IDI2IDM1LjEwNDYgMjYgMzRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
  const PROMPT_BELL_BASE64 = 'PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMwMEFFQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMS45OTg2IDIwQzMwLjkxOTggMjAgMzAuMDQyOCAyMC44NzQ2IDMwLjA0MjggMjEuOTUzNEwzMC4wNDI5IDIxLjk3MzRDMjYuNTQzNCAyMi41NTM1IDIzLjg3NSAyNS41OTQzIDIzLjg3NSAyOS4yNTgyVjM4LjA5OTVIMjMuODczNUMyMy4wNTg5IDM4LjA5OTUgMjIuMzk4NCAzOC43NiAyMi4zOTg0IDM5LjU3NDZDMjIuMzk4NCA0MC4zODkzIDIzLjA1ODkgNDEuMDQ5NyAyMy44NzM1IDQxLjA0OTdIMjkuNzgxMlY0MS43ODQyQzI5Ljc4MTIgNDMuMDA3NyAzMC43NzMxIDQzLjk5OTYgMzEuOTk2NiA0My45OTk2QzMzLjIyMDIgNDMuOTk5NiAzNC4yMTIgNDMuMDA3NyAzNC4yMTIgNDEuNzg0MlY0MS4wNDk3SDQwLjEyMzNDNDAuOTM4IDQxLjA0OTcgNDEuNTk4NCA0MC4zODkzIDQxLjU5ODQgMzkuNTc0NkM0MS41OTg0IDM4Ljc2IDQwLjkzOCAzOC4wOTk1IDQwLjEyMzMgMzguMDk5NUg0MC4xMjEyVjI5LjI1ODJDNDAuMTIxMiAyNS41OTQ2IDM3LjQ1MzMgMjIuNTU0MiAzMy45NTQzIDIxLjk3MzZMMzMuOTU0NCAyMS45NTM0QzMzLjk1NDQgMjAuODc0NiAzMy4wNzc1IDIwIDMxLjk5ODYgMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCBvcGFjaXR5PSIwLjUiIHg9IjcuNSIgeT0iNy41IiB3aWR0aD0iNDkiIGhlaWdodD0iNDkiIHJ4PSIyNC41IiBzdHJva2U9IndoaXRlIi8+CjxyZWN0IG9wYWNpdHk9IjAuMyIgeD0iNC41IiB5PSI0LjUiIHdpZHRoPSI1NSIgaGVpZ2h0PSI1NSIgcng9IjI3LjUiIHN0cm9rZT0id2hpdGUiLz4KPHJlY3Qgb3BhY2l0eT0iMC44IiB4PSIxMC41IiB5PSIxMC41IiB3aWR0aD0iNDMiIGhlaWdodD0iNDMiIHJ4PSIyMS41IiBzdHJva2U9IndoaXRlIi8+Cjwvc3ZnPgo=';

  let appServerKey = null;
  let swPath = '/clevertap_sw.js';
  let notificationHandler = null;
  const processWebPushConfig = (webPushConfig, logger, request) => {
    const _pushConfig = StorageManager.readFromLSorCookie(WEBPUSH_CONFIG) || {};

    const updatePushConfig = () => {
      $ct.pushConfig = webPushConfig;
      StorageManager.saveToLSorCookie(WEBPUSH_CONFIG, webPushConfig);
    };

    if (webPushConfig.isPreview) {
      updatePushConfig();
      enablePush(logger, null, request);
    } else if (JSON.stringify(_pushConfig) !== JSON.stringify(webPushConfig)) {
      updatePushConfig();
    }
  };
  const enablePush = (logger, account, request, customSwPath) => {
    const _pushConfig = StorageManager.readFromLSorCookie(WEBPUSH_CONFIG) || {};

    $ct.pushConfig = _pushConfig;

    if (!$ct.pushConfig) {
      logger.error('Web Push config data not present');
      return;
    }

    if (customSwPath) {
      swPath = customSwPath;
    }

    notificationHandler = new NotificationHandler({
      logger,
      session: {},
      request,
      account
    });
    const {
      showBox,
      boxType,
      showBellIcon,
      isPreview
    } = $ct.pushConfig;

    if (isPreview) {
      if ($ct.pushConfig.boxConfig) createNotificationBox($ct.pushConfig);
      if ($ct.pushConfig.bellIconConfig) createBellIcon($ct.pushConfig);
    } else {
      if (showBox && boxType === 'new') createNotificationBox($ct.pushConfig);
      if (showBellIcon) createBellIcon($ct.pushConfig);
    }
  };

  const createElementWithAttributes = function (tag) {
    let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const element = document.createElement(tag);
    Object.entries(attributes).forEach((_ref) => {
      let [key, value] = _ref;
      element[key] = value;
    });
    return element;
  };

  const createNotificationBox = configData => {
    if (document.getElementById('pnWrapper')) return;
    const {
      boxConfig: {
        content,
        style
      }
    } = configData; // Create the wrapper div

    const wrapper = createElementWithAttributes('div', {
      id: 'pnWrapper'
    });
    const overlayDiv = createElementWithAttributes('div', {
      id: 'pnOverlay'
    });
    const pnCard = createElementWithAttributes('div', {
      id: 'pnCard'
    });
    const iconTitleDescWrapper = createElementWithAttributes('div', {
      id: 'iconTitleDescWrapper'
    });
    const iconContainer = createElementWithAttributes('img', {
      id: 'iconContainer',
      src: content.icon.type === 'default' ? "data:image/svg+xml;base64,".concat(PROMPT_BELL_BASE64) : content.icon.url
    });
    iconTitleDescWrapper.appendChild(iconContainer);
    const titleDescWrapper = createElementWithAttributes('div', {
      id: 'titleDescWrapper'
    });
    titleDescWrapper.appendChild(createElementWithAttributes('div', {
      id: 'title',
      textContent: content.title
    }));
    titleDescWrapper.appendChild(createElementWithAttributes('div', {
      id: 'description',
      textContent: content.description
    }));
    iconTitleDescWrapper.appendChild(titleDescWrapper);
    const buttonsContainer = createElementWithAttributes('div', {
      id: 'buttonsContainer'
    });
    const primaryButton = createElementWithAttributes('button', {
      id: 'primaryButton',
      textContent: content.buttons.primaryButtonText
    });
    const secondaryButton = createElementWithAttributes('button', {
      id: 'secondaryButton',
      textContent: content.buttons.secondaryButtonText
    });
    buttonsContainer.appendChild(secondaryButton);
    buttonsContainer.appendChild(primaryButton);
    pnCard.appendChild(iconTitleDescWrapper);
    pnCard.appendChild(buttonsContainer); // Apply styles

    const styleElement = createElementWithAttributes('style', {
      textContent: getBoxPromptStyles(style)
    });
    wrapper.appendChild(styleElement);
    wrapper.appendChild(pnCard);
    wrapper.appendChild(overlayDiv);
    setElementPosition(pnCard, style.card.position);
    const now = new Date().getTime() / 1000;
    const lastNotifTime = StorageManager.getMetaProp('webpush_last_notif_time');
    const popupFrequency = content.popupFrequency || 7 * 24 * 60 * 60;

    if (!lastNotifTime || now - lastNotifTime >= popupFrequency * 24 * 60 * 60) {
      document.body.appendChild(wrapper);

      if (!configData.isPreview) {
        addEventListeners(wrapper);
      }
    }
  };
  const createBellIcon = configData => {
    if (document.getElementById('bell_wrapper') || Notification.permission === 'granted') return;
    const {
      bellIconConfig: {
        content,
        style
      }
    } = configData;
    const bellWrapper = createElementWithAttributes('div', {
      id: 'bell_wrapper'
    });
    const bellIcon = createElementWithAttributes('img', {
      id: 'bell_icon',
      src: content.icon.type === 'default' ? "data:image/svg+xml;base64,".concat(BELL_BASE64) : content.icon.url
    }); // For playing gif

    const gifModal = createElementWithAttributes('div', {
      id: 'gif_modal',
      style: 'display: none;'
    });
    const gifImage = createElementWithAttributes('img', {
      id: 'gif_image',
      src: 'https://d2r1yp2w7bby2u.cloudfront.net/js/permission_grant.gif'
    });
    const closeModal = createElementWithAttributes('div', {
      id: 'close_modal',
      innerHTML: '&times;'
    });
    gifModal.appendChild(gifImage);
    gifModal.appendChild(closeModal);
    bellWrapper.appendChild(bellIcon);
    bellWrapper.appendChild(gifModal);

    if (content.hoverText.enabled) {
      const tooltip = createElementWithAttributes('div', {
        id: 'bell_tooltip',
        textContent: content.hoverText.text
      });
      bellWrapper.appendChild(tooltip);
    }

    setElementPosition(bellWrapper, style.card.position); // Apply styles

    const styleElement = createElementWithAttributes('style', {
      textContent: getBellIconStyles(style)
    });
    document.head.appendChild(styleElement);
    document.body.appendChild(bellWrapper);

    if (!configData.isPreview) {
      addBellEventListeners(bellWrapper);
    }

    return bellWrapper;
  };
  const setServerKey = serverKey => {
    appServerKey = serverKey;
  };
  const addEventListeners = wrapper => {
    const primaryButton = wrapper.querySelector('#primaryButton');
    const secondaryButton = wrapper.querySelector('#secondaryButton');

    const removeWrapper = () => {
      var _wrapper$parentNode;

      return (_wrapper$parentNode = wrapper.parentNode) === null || _wrapper$parentNode === void 0 ? void 0 : _wrapper$parentNode.removeChild(wrapper);
    };

    primaryButton.addEventListener('click', () => {
      removeWrapper();
      notificationHandler.setApplicationServerKey(appServerKey);
      notificationHandler.setUpWebPushNotifications(null, swPath, null, null);
    });
    secondaryButton.addEventListener('click', () => {
      StorageManager.setMetaProp('webpush_last_notif_time', Date.now() / 1000);
      removeWrapper();
    });
  };
  const addBellEventListeners = bellWrapper => {
    const bellIcon = bellWrapper.querySelector('#bell_icon');
    bellIcon.addEventListener('click', () => {
      if (Notification.permission === 'denied') {
        toggleGifModal(bellWrapper);
      } else {
        notificationHandler.setApplicationServerKey(appServerKey);
        notificationHandler.setUpWebPushNotifications(null, swPath, null, null);

        if (Notification.permission === 'granted') {
          bellWrapper.remove();
        }
      }
    });
    bellIcon.addEventListener('mouseenter', () => displayTooltip(bellWrapper));
    bellIcon.addEventListener('mouseleave', () => clearTooltip(bellWrapper));
    bellWrapper.querySelector('#close_modal').addEventListener('click', () => toggleGifModal(bellWrapper));
  };
  const setElementPosition = (element, position) => {
    Object.assign(element.style, {
      inset: 'auto',
      transform: 'none'
    });
    const positions = {
      'Top Right': {
        inset: '16px 16px auto auto'
      },
      'Top Left': {
        inset: '16px auto auto 16px'
      },
      'Bottom Right': {
        inset: 'auto 16px 16px auto'
      },
      'Bottom Left': {
        inset: 'auto auto 16px 16px'
      },
      Center: {
        inset: '50%',
        transform: 'translate(-50%, -50%)'
      },
      Top: {
        inset: '16px auto auto 50%',
        transform: 'translateX(-50%)'
      },
      Bottom: {
        inset: 'auto auto 16px 50%',
        transform: 'translateX(-50%)'
      }
    };
    Object.assign(element.style, positions[position] || positions['top-right']);
  };

  const displayTooltip = bellWrapper => {
    const gifModal = bellWrapper.querySelector('#gif_modal');

    if (gifModal.style.display === 'flex') {
      return;
    }

    const tooltip = bellWrapper.querySelector('#bell_tooltip');

    if (tooltip) {
      tooltip.style.display = 'flex';
    }

    const bellIcon = bellWrapper.querySelector('#bell_icon');
    const bellRect = bellIcon.getBoundingClientRect();
    var midX = window.innerWidth / 2;
    var midY = window.innerHeight / 2;
    bellWrapper.style['flex-direction'] = bellRect.y > midY ? 'column-reverse' : 'column';
    bellWrapper.style['align-items'] = bellRect.x > midX ? 'flex-end' : 'flex-start';
  };

  const clearTooltip = bellWrapper => {
    const tooltip = bellWrapper.querySelector('#bell_tooltip');

    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  const toggleGifModal = bellWrapper => {
    clearTooltip(bellWrapper);
    const gifModal = bellWrapper.querySelector('#gif_modal');
    gifModal.style.display = gifModal.style.display === 'none' ? 'flex' : 'none';
  };

  const _tr = (msg, _ref) => {
    let {
      device,
      session,
      request,
      logger
    } = _ref;
    const _device = device;
    const _session = session;
    const _request = request;
    const _logger = logger;
    let _wizCounter = 0; // Campaign House keeping

    const doCampHouseKeeping = targetingMsgJson => {
      const campaignId = targetingMsgJson.wzrk_id.split('_')[0];
      const today = getToday();

      const incrCount = (obj, campaignId, excludeFromFreqCaps) => {
        let currentCount = 0;
        let totalCount = 0;

        if (obj[campaignId] != null) {
          currentCount = obj[campaignId];
        }

        currentCount++;

        if (obj.tc != null) {
          totalCount = obj.tc;
        } // if exclude from caps then dont add to total counts


        if (excludeFromFreqCaps < 0) {
          totalCount++;
        }

        obj.tc = totalCount;
        obj[campaignId] = currentCount;
      };

      if (StorageManager._isLocalStorageSupported()) {
        delete sessionStorage[CAMP_COOKIE_NAME];
        var campTypeObj = {};
        const campObj = getCampaignObject();

        if (targetingMsgJson.display.wtarget_type === 3 && campObj.hasOwnProperty('wi')) {
          campTypeObj = campObj.wi;
        } else if ((targetingMsgJson.display.wtarget_type === 0 || targetingMsgJson.display.wtarget_type === 1) && campObj.hasOwnProperty('wp')) {
          campTypeObj = campObj.wp;
        } else {
          campTypeObj = {};
        }

        if (campObj.hasOwnProperty('global')) {
          campTypeObj.wp = campObj;
        } // global session limit. default is 1


        if (targetingMsgJson[DISPLAY].wmc == null) {
          targetingMsgJson[DISPLAY].wmc = 1;
        } // global session limit for web inbox. default is 1


        if (targetingMsgJson[DISPLAY].wimc == null) {
          targetingMsgJson[DISPLAY].wimc = 1;
        }

        var excludeFromFreqCaps = -1; // efc - Exclude from frequency caps

        let campaignSessionLimit = -1; // mdc - Once per session

        let campaignDailyLimit = -1; // tdc - Once per day

        let campaignTotalLimit = -1; // tlc - Once per user for the duration of campaign

        let totalDailyLimit = -1;
        let totalSessionLimit = -1; // wmc - Web Popup Global Session Limit

        let totalInboxSessionLimit = -1; // wimc - Web Inbox Global Session Limit

        if (targetingMsgJson[DISPLAY].efc != null) {
          // exclude from frequency cap
          excludeFromFreqCaps = parseInt(targetingMsgJson[DISPLAY].efc, 10);
        }

        if (targetingMsgJson[DISPLAY].mdc != null) {
          // Campaign Session Limit
          campaignSessionLimit = parseInt(targetingMsgJson[DISPLAY].mdc, 10);
        }

        if (targetingMsgJson[DISPLAY].tdc != null) {
          // No of web popups in a day per campaign
          campaignDailyLimit = parseInt(targetingMsgJson[DISPLAY].tdc, 10);
        }

        if (targetingMsgJson[DISPLAY].tlc != null) {
          // Total lifetime count
          campaignTotalLimit = parseInt(targetingMsgJson[DISPLAY].tlc, 10);
        }

        if (targetingMsgJson[DISPLAY].wmp != null) {
          // No of campaigns per day
          totalDailyLimit = parseInt(targetingMsgJson[DISPLAY].wmp, 10);
        }

        if (targetingMsgJson[DISPLAY].wmc != null) {
          // No of campaigns per session
          totalSessionLimit = parseInt(targetingMsgJson[DISPLAY].wmc, 10);
        }

        if (targetingMsgJson[DISPLAY].wimc != null) {
          // No of inbox campaigns per session
          totalInboxSessionLimit = parseInt(targetingMsgJson[DISPLAY].wimc, 10);
        } // session level capping


        var sessionObj = campTypeObj[_session.sessionId];

        if (sessionObj) {
          const campaignSessionCount = sessionObj[campaignId];
          const totalSessionCount = sessionObj.tc; // dnd

          if (campaignSessionCount === 'dnd' && !$ct.dismissSpamControl) {
            return false;
          }

          if (targetingMsgJson[DISPLAY].wtarget_type === 3) {
            // Inbox session
            if (totalInboxSessionLimit > 0 && totalSessionCount >= totalInboxSessionLimit && excludeFromFreqCaps < 0) {
              return false;
            }
          } else {
            // session
            if (totalSessionLimit > 0 && totalSessionCount >= totalSessionLimit && excludeFromFreqCaps < 0) {
              return false;
            }
          } // campaign session


          if (campaignSessionLimit > 0 && campaignSessionCount >= campaignSessionLimit) {
            return false;
          }
        } else {
          sessionObj = {};
          campTypeObj[_session.sessionId] = sessionObj;
        } // daily level capping


        var dailyObj = campTypeObj[today];

        if (dailyObj != null) {
          const campaignDailyCount = dailyObj[campaignId];
          const totalDailyCount = dailyObj.tc; // daily

          if (totalDailyLimit > 0 && totalDailyCount >= totalDailyLimit && excludeFromFreqCaps < 0) {
            return false;
          } // campaign daily


          if (campaignDailyLimit > 0 && campaignDailyCount >= campaignDailyLimit) {
            return false;
          }
        } else {
          dailyObj = {};
          campTypeObj[today] = dailyObj;
        }

        var globalObj = campTypeObj[GLOBAL];

        if (globalObj != null) {
          const campaignTotalCount = globalObj[campaignId]; // campaign total

          if (campaignTotalLimit > 0 && campaignTotalCount >= campaignTotalLimit) {
            return false;
          }
        } else {
          globalObj = {};
          campTypeObj[GLOBAL] = globalObj;
        }
      } // delay


      const displayObj = targetingMsgJson.display;

      if (displayObj.delay != null && displayObj.delay > 0) {
        const delay = displayObj.delay;
        displayObj.delay = 0;
        setTimeout(_tr, delay * 1000, msg, {
          device: _device,
          session: _session,
          request: _request,
          logger: _logger
        });
        return false;
      }

      incrCount(sessionObj, campaignId, excludeFromFreqCaps);
      incrCount(dailyObj, campaignId, excludeFromFreqCaps);
      incrCount(globalObj, campaignId, excludeFromFreqCaps);
      let campKey = 'wp';

      if (targetingMsgJson[DISPLAY].wtarget_type === 3) {
        campKey = 'wi';
      } // get ride of stale sessions and day entries


      const newCampObj = {};
      newCampObj[_session.sessionId] = sessionObj;
      newCampObj[today] = dailyObj;
      newCampObj[GLOBAL] = globalObj;
      saveCampaignObject({
        [campKey]: newCampObj
      });
    };

    const setupClickUrl = (onClick, targetingMsgJson, contentDiv, divId, isLegacy) => {
      incrementImpression(targetingMsgJson, _request);
      setupClickEvent(onClick, targetingMsgJson, contentDiv, divId, isLegacy, _device, _session);
    };

    const handleImageOnlyPopup = targetingMsgJson => {
      const divId = 'wzrkImageOnlyDiv';

      if (doCampHouseKeeping(targetingMsgJson) === false) {
        return;
      }

      if ($ct.dismissSpamControl && document.getElementById(divId) != null) {
        const element = document.getElementById(divId);
        element.remove();
      } // ImageOnly campaign and Interstitial/Exit Intent shouldn't coexist


      if (document.getElementById(divId) != null || document.getElementById('intentPreview') != null) {
        return;
      }

      const msgDiv = document.createElement('div');
      msgDiv.id = divId;
      document.body.appendChild(msgDiv);

      if (customElements.get('ct-web-popup-imageonly') === undefined) {
        customElements.define('ct-web-popup-imageonly', CTWebPopupImageOnly);
      }

      return renderPopUpImageOnly(targetingMsgJson, _session);
    };

    const isExistingCampaign = campaignId => {
      const testIframe = document.getElementById('wiz-iframe-intent') || document.getElementById('wiz-iframe');

      if (testIframe) {
        const iframeDocument = testIframe.contentDocument || testIframe.contentWindow.document;
        return iframeDocument.documentElement.innerHTML.includes(campaignId);
      }

      return false;
    };

    const createTemplate = (targetingMsgJson, isExitIntent) => {
      const campaignId = targetingMsgJson.wzrk_id.split('_')[0];
      const displayObj = targetingMsgJson.display;

      if (displayObj.layout === 1) {
        // Handling Web Exit Intent
        return showExitIntent(undefined, targetingMsgJson);
      }

      if (displayObj.layout === 3) {
        // Handling Web Popup Image Only
        handleImageOnlyPopup(targetingMsgJson);
        return;
      }

      if (doCampHouseKeeping(targetingMsgJson) === false) {
        return;
      }

      const divId = 'wizParDiv' + displayObj.layout;
      const opacityDivId = 'intentOpacityDiv' + displayObj.layout;

      if ($ct.dismissSpamControl && document.getElementById(divId) != null) {
        const element = document.getElementById(divId);
        const opacityElement = document.getElementById(opacityDivId);

        if (element) {
          element.remove();
        }

        if (opacityElement) {
          opacityElement.remove();
        }
      }

      if (isExistingCampaign(campaignId)) return;

      if (document.getElementById(divId) != null) {
        return;
      }

      $ct.campaignDivMap[campaignId] = divId;
      const isBanner = displayObj.layout === 2;

      if (isExitIntent) {
        const opacityDiv = document.createElement('div');
        opacityDiv.id = opacityDivId;
        const opacity = targetingMsgJson.display.opacity || 0.7;
        const rgbaColor = "rgba(0,0,0,".concat(opacity, ")");
        opacityDiv.setAttribute('style', "position: fixed;top: 0;bottom: 0;left: 0;width: 100%;height: 100%;z-index: 2147483646;background: ".concat(rgbaColor, ";"));
        document.body.appendChild(opacityDiv);
      }

      const msgDiv = document.createElement('div');
      msgDiv.id = divId;
      const viewHeight = window.innerHeight;
      const viewWidth = window.innerWidth;
      let legacy = false;

      if (!isBanner) {
        const marginBottom = viewHeight * 5 / 100;
        var contentHeight = 10;
        let right = viewWidth * 5 / 100;
        let bottomPosition = contentHeight + marginBottom;
        let width = viewWidth * 30 / 100 + 20;
        let widthPerct = 'width:30%;'; // for small devices  - mobile phones

        if ((/mobile/i.test(navigator.userAgent) || /mini/i.test(navigator.userAgent)) && /iPad/i.test(navigator.userAgent) === false) {
          width = viewWidth * 85 / 100 + 20;
          right = viewWidth * 5 / 100;
          bottomPosition = viewHeight * 5 / 100;
          widthPerct = 'width:80%;'; // medium devices - tablets
        } else if ('ontouchstart' in window || /tablet/i.test(navigator.userAgent)) {
          width = viewWidth * 50 / 100 + 20;
          right = viewWidth * 5 / 100;
          bottomPosition = viewHeight * 5 / 100;
          widthPerct = 'width:50%;';
        } // legacy footer notif


        if (displayObj.proto == null) {
          legacy = true;
          msgDiv.setAttribute('style', 'display:block;overflow:hidden; bottom:' + bottomPosition + 'px !important;width:' + width + 'px !important;right:' + right + 'px !important;position:fixed;z-index:2147483647;');
        } else {
          msgDiv.setAttribute('style', widthPerct + displayObj.iFrameStyle);
        }
      } else {
        msgDiv.setAttribute('style', displayObj.iFrameStyle);
      }

      document.body.appendChild(msgDiv);
      const iframe = document.createElement('iframe');
      const borderRadius = displayObj.br === false ? '0' : '8';
      iframe.frameborder = '0px';
      iframe.marginheight = '0px';
      iframe.marginwidth = '0px';
      iframe.scrolling = 'no';
      iframe.id = 'wiz-iframe';
      const onClick = targetingMsgJson.display.onClick;
      let pointerCss = '';

      if (onClick !== '' && onClick != null) {
        pointerCss = 'cursor:pointer;';
      }

      if (displayObj.preview && displayObj['custom-editor']) {
        iframe.sandbox = 'allow-scripts allow-popups allow-popups-to-escape-sandbox';
      }

      let html; // direct html

      if (targetingMsgJson.msgContent.type === 1) {
        html = targetingMsgJson.msgContent.html;
        html = html.replace(/##campaignId##/g, campaignId);
        html = html.replace(/##campaignId_batchId##/g, targetingMsgJson.wzrk_id);
      } else {
        const css = '' + '<style type="text/css">' + 'body{margin:0;padding:0;}' + '#contentDiv.wzrk{overflow:hidden;padding:0;text-align:center;' + pointerCss + '}' + '#contentDiv.wzrk td{padding:15px 10px;}' + '.wzrkPPtitle{font-weight: bold;font-size: 16px;font-family:arial;padding-bottom:10px;word-break: break-word;}' + '.wzrkPPdscr{font-size: 14px;font-family:arial;line-height:16px;word-break: break-word;display:inline-block;}' + '.PL15{padding-left:15px;}' + '.wzrkPPwarp{margin:20px 20px 0 5px;padding:0px;border-radius: ' + borderRadius + 'px;box-shadow: 1px 1px 5px #888888;}' + 'a.wzrkClose{cursor:pointer;position: absolute;top: 11px;right: 11px;z-index: 2147483647;font-size:19px;font-family:arial;font-weight:bold;text-decoration: none;width: 25px;/*height: 25px;*/text-align: center; -webkit-appearance: none; line-height: 25px;' + 'background: #353535;border: #fff 2px solid;border-radius: 100%;box-shadow: #777 2px 2px 2px;color:#fff;}' + 'a:hover.wzrkClose{background-color:#d1914a !important;color:#fff !important; -webkit-appearance: none;}' + 'td{vertical-align:top;}' + 'td.imgTd{border-top-left-radius:8px;border-bottom-left-radius:8px;}' + '</style>';
        let bgColor, textColor, btnBg, leftTd, btColor;

        if (targetingMsgJson.display.theme === 'dark') {
          bgColor = '#2d2d2e';
          textColor = '#eaeaea';
          btnBg = '#353535';
          leftTd = '#353535';
          btColor = '#ffffff';
        } else {
          bgColor = '#ffffff';
          textColor = '#000000';
          leftTd = '#f4f4f4';
          btnBg = '#a5a6a6';
          btColor = '#ffffff';
        }

        const titleText = targetingMsgJson.msgContent.title;
        const descriptionText = targetingMsgJson.msgContent.description;
        let imageTd = '';

        if (targetingMsgJson.msgContent.imageUrl != null && targetingMsgJson.msgContent.imageUrl !== '') {
          imageTd = "<td class='imgTd' style='background-color:" + leftTd + "'><img src='" + targetingMsgJson.msgContent.imageUrl + "' height='60' width='60'></td>";
        }

        const onClickStr = 'parent.$WZRK_WR.closeIframe(' + campaignId + ",'" + divId + "');";
        const title = "<div class='wzrkPPwarp' style='color:" + textColor + ';background-color:' + bgColor + ";'>" + "<a href='javascript:void(0);' onclick=" + onClickStr + " class='wzrkClose' style='background-color:" + btnBg + ';color:' + btColor + "'>&times;</a>" + "<div id='contentDiv' class='wzrk'>" + "<table cellpadding='0' cellspacing='0' border='0'>" + // "<tr><td colspan='2'></td></tr>"+
        '<tr>' + imageTd + "<td style='vertical-align:top;'>" + "<div class='wzrkPPtitle' style='color:" + textColor + "'>" + titleText + '</div>';
        const body = "<div class='wzrkPPdscr' style='color:" + textColor + "'>" + descriptionText + '<div></td></tr></table></div>';
        html = css + title + body;
      }

      iframe.setAttribute('style', 'z-index: 2147483647; display:block; width: 100% !important; border:0px !important; border-color:none !important;');
      msgDiv.appendChild(iframe); // Dispatch event for popup box/banner close

      const closeCampaign = new Event('CT_campaign_rendered');
      document.dispatchEvent(closeCampaign);

      if (displayObj['custom-editor']) {
        html = appendScriptForCustomEvent(targetingMsgJson, html);
      }

      iframe.srcdoc = html;

      const adjustIFrameHeight = () => {
        // adjust iframe and body height of html inside correctly
        contentHeight = document.getElementById('wiz-iframe').contentDocument.getElementById('contentDiv').scrollHeight;

        if (displayObj['custom-editor'] !== true && !isBanner) {
          contentHeight += 25;
        }

        document.getElementById('wiz-iframe').contentDocument.body.style.margin = '0px';
        document.getElementById('wiz-iframe').style.height = contentHeight + 'px';
      };

      const ua = navigator.userAgent.toLowerCase();

      if (ua.indexOf('safari') !== -1) {
        if (ua.indexOf('chrome') > -1) {
          iframe.onload = () => {
            adjustIFrameHeight();
            const contentDiv = document.getElementById('wiz-iframe').contentDocument.getElementById('contentDiv');
            setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, legacy);
          };
        } else {
          let inDoc = iframe.contentDocument || iframe.contentWindow;
          if (inDoc.document) inDoc = inDoc.document; // safari iphone 7+ needs this.

          const _timer = setInterval(() => {
            if (inDoc.readyState === 'complete') {
              clearInterval(_timer); // adjust iframe and body height of html inside correctly

              adjustIFrameHeight();
              const contentDiv = document.getElementById('wiz-iframe').contentDocument.getElementById('contentDiv');
              setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, legacy);
            }
          }, 300);
        }
      } else {
        iframe.onload = () => {
          // adjust iframe and body height of html inside correctly
          adjustIFrameHeight();
          const contentDiv = document.getElementById('wiz-iframe').contentDocument.getElementById('contentDiv');
          setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, legacy);
        };
      }
    };

    const renderFooterNotification = targetingMsgJson => {
      createTemplate(targetingMsgJson, false);
    };

    let _callBackCalled = false;

    const showFooterNotification = targetingMsgJson => {
      let onClick = targetingMsgJson.display.onClick;
      const displayObj = targetingMsgJson.display; // TODO: Needs wizrocket as a global variable

      if (window.clevertap.hasOwnProperty('notificationCallback') && typeof window.clevertap.notificationCallback !== 'undefined' && typeof window.clevertap.notificationCallback === 'function') {
        const notificationCallback = window.clevertap.notificationCallback;

        if (!_callBackCalled) {
          const inaObj = {};
          inaObj.msgContent = targetingMsgJson.msgContent;
          inaObj.msgId = targetingMsgJson.wzrk_id;

          if (targetingMsgJson.wzrk_pivot) {
            inaObj.pivotId = targetingMsgJson.wzrk_pivot;
          }

          if (targetingMsgJson.display.kv != null) {
            inaObj.kv = targetingMsgJson.display.kv;
          }

          window.clevertap.raiseNotificationClicked = () => {
            if (onClick !== '' && onClick != null) {
              const jsFunc = targetingMsgJson.display.jsFunc;
              onClick += getCookieParams(_device, _session); // invoke js function call

              if (jsFunc != null) {
                // track notification clicked event
                RequestDispatcher.fireRequest(onClick);
                invokeExternalJs(jsFunc, targetingMsgJson);
                return;
              } // pass on the gcookie|page|scookieId for capturing the click event


              if (targetingMsgJson.display.window === 1) {
                window.open(onClick, '_blank');
              } else {
                window.location = onClick;
              }
            }
          };

          window.clevertap.raiseNotificationViewed = () => {
            incrementImpression(targetingMsgJson);
          };

          notificationCallback(inaObj);
          _callBackCalled = true;
        }
      } else {
        window.clevertap.popupCurrentWzrkId = targetingMsgJson.wzrk_id;

        if (displayObj.deliveryTrigger) {
          if (displayObj.deliveryTrigger.inactive) {
            triggerByInactivity(targetingMsgJson);
          }

          if (displayObj.deliveryTrigger.scroll) {
            triggerByScroll(targetingMsgJson);
          }

          if (displayObj.deliveryTrigger.isExitIntent) {
            exitintentObj = targetingMsgJson;
            window.document.body.onmouseleave = showExitIntent;
          } // delay


          const delay = displayObj.delay || displayObj.deliveryTrigger.deliveryDelayed;

          if (delay != null && delay > 0) {
            setTimeout(() => {
              renderFooterNotification(targetingMsgJson);
            }, delay * 1000);
          }
        } else {
          renderFooterNotification(targetingMsgJson);
        }

        if (window.clevertap.hasOwnProperty('popupCallbacks') && typeof window.clevertap.popupCallbacks !== 'undefined' && typeof window.clevertap.popupCallbacks[targetingMsgJson.wzrk_id] === 'function') {
          const popupCallback = window.clevertap.popupCallbacks[targetingMsgJson.wzrk_id];
          const inaObj = {};
          inaObj.msgContent = targetingMsgJson.msgContent;
          inaObj.msgId = targetingMsgJson.wzrk_id;

          if (targetingMsgJson.wzrk_pivot) {
            inaObj.pivotId = targetingMsgJson.wzrk_pivot;
          }

          var msgCTkv = [];

          for (var wzrkPrefixKey in targetingMsgJson) {
            // ADD WZRK PREFIX KEY VALUE PAIRS
            if (wzrkPrefixKey.startsWith(WZRK_PREFIX) && wzrkPrefixKey !== WZRK_ID) {
              const wzrkJson = {
                [wzrkPrefixKey]: targetingMsgJson[wzrkPrefixKey]
              };
              msgCTkv.push(wzrkJson);
            }
          }

          if (msgCTkv.length > 0) {
            inaObj.msgCTkv = msgCTkv;
          }

          if (targetingMsgJson.display.kv != null) {
            inaObj.kv = targetingMsgJson.display.kv;
          } // PUBLIC API TO RECORD CLICKED EVENT


          window.clevertap.raisePopupNotificationClicked = notificationData => {
            if (!notificationData || !notificationData.msgId) {
              return;
            }

            const eventData = {};
            eventData.type = 'event';
            eventData.evtName = NOTIFICATION_CLICKED;
            eventData.evtData = {
              [WZRK_ID]: notificationData.msgId
            };

            if (targetingMsgJson.wzrk_pivot) {
              eventData.evtData = { ...eventData.evtData,
                wzrk_pivot: notificationData.pivotId
              };
            } // WZRK PREFIX KEY VALUE PAIRS


            if (notificationData.msgCTkv) {
              for (var wzrkPrefixObj of notificationData.msgCTkv) {
                eventData.evtData = { ...eventData.evtData,
                  ...wzrkPrefixObj
                };
              }
            }

            _request.processEvent(eventData);
          };

          popupCallback(inaObj);
        }
      }
    };

    const triggerByInactivity = targetNotif => {
      const IDLE_TIME_THRESHOLD = targetNotif.display.deliveryTrigger.inactive * 1000; // Convert to milliseconds

      let idleTimer;
      const events = ['mousemove', 'keypress', 'scroll', 'mousedown', 'touchmove', 'click'];

      const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          renderFooterNotification(targetNotif);
          removeEventListeners();
        }, IDLE_TIME_THRESHOLD);
      };

      const eventHandler = () => {
        resetIdleTimer();
      };

      const setupEventListeners = () => {
        events.forEach(eventType => window.addEventListener(eventType, eventHandler, {
          passive: true
        }));
      };

      const removeEventListeners = () => {
        events.forEach(eventType => window.removeEventListener(eventType, eventHandler));
      };

      setupEventListeners();
      resetIdleTimer();
      return removeEventListeners; // Return a cleanup function
    };

    const triggerByScroll = targetNotif => {
      const calculateScrollPercentage = () => {
        const {
          scrollHeight,
          clientHeight,
          scrollTop
        } = document.documentElement;
        return scrollTop / (scrollHeight - clientHeight) * 100;
      };

      const scrollListener = () => {
        const scrollPercentage = calculateScrollPercentage();

        if (scrollPercentage >= targetNotif.display.deliveryTrigger.scroll) {
          renderFooterNotification(targetNotif);
          window.removeEventListener('scroll', throttledScrollListener);
        }
      };

      const throttle = (func, limit) => {
        let inThrottle = false;
        return function () {
          const context = this;

          if (!inThrottle) {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => {
              inThrottle = false;
            }, limit);
          }
        };
      };

      const throttledScrollListener = throttle(scrollListener, 200);
      window.addEventListener('scroll', throttledScrollListener, {
        passive: true
      });
      return () => window.removeEventListener('scroll', throttledScrollListener); // Return a cleanup function
    };

    let exitintentObj;

    const showExitIntent = (event, targetObj) => {
      if ((event === null || event === void 0 ? void 0 : event.clientY) > 0) return;
      const targetingMsgJson = targetObj || exitintentObj;
      const campaignId = targetingMsgJson.wzrk_id.split('_')[0];
      const layout = targetingMsgJson.display.layout;
      if (isExistingCampaign(campaignId)) return;

      if (targetingMsgJson.display.wtarget_type === 0 && (layout === 0 || layout === 2 || layout === 3)) {
        createTemplate(targetingMsgJson, true);
        return;
      }

      if (doCampHouseKeeping(targetingMsgJson) === false) {
        return;
      }

      if ($ct.dismissSpamControl && targetingMsgJson.display.wtarget_type === 0) {
        const intentPreview = document.getElementById('intentPreview');
        const intentOpacityDiv = document.getElementById('intentOpacityDiv');

        if (intentPreview && intentOpacityDiv) {
          intentPreview.remove();
          intentOpacityDiv.remove();
        }
      } // ImageOnly campaign and Interstitial/Exit Intent shouldn't coexist`


      if (document.getElementById('intentPreview') != null || document.getElementById('wzrkImageOnlyDiv') != null) {
        return;
      } // dont show exit intent on tablet/mobile - only on desktop


      if (targetingMsgJson.display.layout == null && (/mobile/i.test(navigator.userAgent) || /mini/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) || 'ontouchstart' in window || /tablet/i.test(navigator.userAgent))) {
        return;
      }

      $ct.campaignDivMap[campaignId] = 'intentPreview';
      let legacy = false;
      const opacityDiv = document.createElement('div');
      opacityDiv.id = 'intentOpacityDiv';
      const opacity = targetingMsgJson.display.opacity || 0.7;
      const rgbaColor = "rgba(0,0,0,".concat(opacity, ")");
      opacityDiv.setAttribute('style', "position: fixed;top: 0;bottom: 0;left: 0;width: 100%;height: 100%;z-index: 2147483646;background: ".concat(rgbaColor, ";"));
      document.body.appendChild(opacityDiv);
      const msgDiv = document.createElement('div');
      msgDiv.id = 'intentPreview';

      if (targetingMsgJson.display.proto == null) {
        legacy = true;
        msgDiv.setAttribute('style', 'display:block;overflow:hidden;top:55% !important;left:50% !important;position:fixed;z-index:2147483647;width:600px !important;height:600px !important;margin:-300px 0 0 -300px !important;');
      } else {
        msgDiv.setAttribute('style', targetingMsgJson.display.iFrameStyle);
      }

      document.body.appendChild(msgDiv);
      const iframe = document.createElement('iframe');
      const borderRadius = targetingMsgJson.display.br === false ? '0' : '8';
      iframe.frameborder = '0px';
      iframe.marginheight = '0px';
      iframe.marginwidth = '0px';
      iframe.scrolling = 'no';
      iframe.id = 'wiz-iframe-intent';
      const onClick = targetingMsgJson.display.onClick;
      let pointerCss = '';

      if (onClick !== '' && onClick != null) {
        pointerCss = 'cursor:pointer;';
      }

      if (targetingMsgJson.display.preview && targetingMsgJson.display['custom-editor']) {
        iframe.sandbox = 'allow-scripts allow-popups allow-popups-to-escape-sandbox';
      }

      let html; // direct html

      if (targetingMsgJson.msgContent.type === 1) {
        html = targetingMsgJson.msgContent.html;
        html = html.replace(/##campaignId##/g, campaignId);
        html = html.replace(/##campaignId_batchId##/g, targetingMsgJson.wzrk_id);
      } else {
        const css = '' + '<style type="text/css">' + 'body{margin:0;padding:0;}' + '#contentDiv.wzrk{overflow:hidden;padding:0 0 20px 0;text-align:center;' + pointerCss + '}' + '#contentDiv.wzrk td{padding:15px 10px;}' + '.wzrkPPtitle{font-weight: bold;font-size: 24px;font-family:arial;word-break: break-word;padding-top:20px;}' + '.wzrkPPdscr{font-size: 14px;font-family:arial;line-height:16px;word-break: break-word;display:inline-block;padding:20px 20px 0 20px;line-height:20px;}' + '.PL15{padding-left:15px;}' + '.wzrkPPwarp{margin:20px 20px 0 5px;padding:0px;border-radius: ' + borderRadius + 'px;box-shadow: 1px 1px 5px #888888;}' + 'a.wzrkClose{cursor:pointer;position: absolute;top: 11px;right: 11px;z-index: 2147483647;font-size:19px;font-family:arial;font-weight:bold;text-decoration: none;width: 25px;/*height: 25px;*/text-align: center; -webkit-appearance: none; line-height: 25px;' + 'background: #353535;border: #fff 2px solid;border-radius: 100%;box-shadow: #777 2px 2px 2px;color:#fff;}' + 'a:hover.wzrkClose{background-color:#d1914a !important;color:#fff !important; -webkit-appearance: none;}' + '#contentDiv .button{padding-top:20px;}' + '#contentDiv .button a{font-size: 14px;font-weight:bold;font-family:arial;text-align:center;display:inline-block;text-decoration:none;padding:0 30px;height:40px;line-height:40px;background:#ea693b;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;}' + '</style>';
        let bgColor, textColor, btnBg, btColor;

        if (targetingMsgJson.display.theme === 'dark') {
          bgColor = '#2d2d2e';
          textColor = '#eaeaea';
          btnBg = '#353535';
          btColor = '#ffffff';
        } else {
          bgColor = '#ffffff';
          textColor = '#000000';
          btnBg = '#a5a6a6';
          btColor = '#ffffff';
        }

        const titleText = targetingMsgJson.msgContent.title;
        const descriptionText = targetingMsgJson.msgContent.description;
        let ctaText = '';

        if (targetingMsgJson.msgContent.ctaText != null && targetingMsgJson.msgContent.ctaText !== '') {
          ctaText = "<div class='button'><a href='#'>" + targetingMsgJson.msgContent.ctaText + '</a></div>';
        }

        let imageTd = '';

        if (targetingMsgJson.msgContent.imageUrl != null && targetingMsgJson.msgContent.imageUrl !== '') {
          imageTd = "<div style='padding-top:20px;'><img src='" + targetingMsgJson.msgContent.imageUrl + "' width='500' alt=" + titleText + ' /></div>';
        }

        const onClickStr = 'parent.$WZRK_WR.closeIframe(' + campaignId + ",'intentPreview');";
        const title = "<div class='wzrkPPwarp' style='color:" + textColor + ';background-color:' + bgColor + ";'>" + "<a href='javascript:void(0);' onclick=" + onClickStr + " class='wzrkClose' style='background-color:" + btnBg + ';color:' + btColor + "'>&times;</a>" + "<div id='contentDiv' class='wzrk'>" + "<div class='wzrkPPtitle' style='color:" + textColor + "'>" + titleText + '</div>';
        const body = "<div class='wzrkPPdscr' style='color:" + textColor + "'>" + descriptionText + '</div>' + imageTd + ctaText + '</div></div>';
        html = css + title + body;
      }

      iframe.setAttribute('style', 'z-index: 2147483647; display:block; height: 100% !important; width: 100% !important;min-height:80px !important;border:0px !important; border-color:none !important;');
      msgDiv.appendChild(iframe); // Dispatch event for interstitial/exit intent close

      const closeCampaign = new Event('CT_campaign_rendered');
      document.dispatchEvent(closeCampaign);

      if (targetingMsgJson.display['custom-editor']) {
        html = appendScriptForCustomEvent(targetingMsgJson, html);
      }

      iframe.srcdoc = html;

      iframe.onload = () => {
        const contentDiv = document.getElementById('wiz-iframe-intent').contentDocument.getElementById('contentDiv');
        setupClickUrl(onClick, targetingMsgJson, contentDiv, 'intentPreview', legacy);
      };
    };

    if (!document.body) {
      if (_wizCounter < 6) {
        _wizCounter++;
        setTimeout(_tr, 1000, msg, {
          device: _device,
          session: _session,
          request: _request,
          logger: _logger
        });
      }

      return;
    }

    const processNativeDisplayArr = arrInAppNotifs => {
      Object.keys(arrInAppNotifs).map(key => {
        var elementId, id;

        if (arrInAppNotifs[key].display.divId) {
          elementId = arrInAppNotifs[key].display.divId;
          id = document.getElementById(elementId);
        } else {
          elementId = arrInAppNotifs[key].display.divSelector;
          id = document.querySelector(elementId);
        }

        if (id !== null) {
          arrInAppNotifs[key].msgContent.type === 2 ? renderPersonalisationBanner(arrInAppNotifs[key]) : renderPersonalisationCarousel(arrInAppNotifs[key]);
          delete arrInAppNotifs[key];
        }
      });
    };

    const addLoadListener = arrInAppNotifs => {
      window.addEventListener('load', () => {
        let count = 0;

        if (count < 20) {
          const t = setInterval(() => {
            processNativeDisplayArr(arrInAppNotifs);

            if (Object.keys(arrInAppNotifs).length === 0 || count === 20) {
              clearInterval(t);
              arrInAppNotifs = {};
            }

            count++;
          }, 500);
        }
      });
    };

    if (msg.inapp_notifs != null) {
      const arrInAppNotifs = {};

      for (let index = 0; index < msg.inapp_notifs.length; index++) {
        const targetNotif = msg.inapp_notifs[index];

        if (targetNotif.display.wtarget_type == null || targetNotif.display.wtarget_type === 0) {
          showFooterNotification(targetNotif);
        } else if (targetNotif.display.wtarget_type === 1) {
          // if display['wtarget_type']==1 then exit intent
          exitintentObj = targetNotif;
          window.document.body.onmouseleave = showExitIntent;
        } else if (targetNotif.display.wtarget_type === 2) {
          // if display['wtarget_type']==2 then web native display
          if (targetNotif.msgContent.type === 1) {
            handleKVpairCampaign(targetNotif);
          } else if (targetNotif.msgContent.type === 2 || targetNotif.msgContent.type === 3) {
            // Check for banner and carousel
            const element = targetNotif.display.divId ? document.getElementById(targetNotif.display.divId) : document.querySelector(targetNotif.display.divSelector);

            if (element !== null) {
              targetNotif.msgContent.type === 2 ? renderPersonalisationBanner(targetNotif) : renderPersonalisationCarousel(targetNotif);
            } else {
              arrInAppNotifs[targetNotif.wzrk_id.split('_')[0]] = targetNotif; // Add targetNotif to object
            }
          } else if (targetNotif.msgContent.type === 4) {
            renderVisualBuilder(targetNotif, false);
          } else {
            showFooterNotification(targetNotif);
          }
        }
      } // Process banner or carousel campaign array


      if (Object.keys(arrInAppNotifs).length) {
        if (document.readyState === 'complete') {
          processNativeDisplayArr(arrInAppNotifs);
        } else {
          addLoadListener(arrInAppNotifs);
        }
      }
    }

    const handleInboxNotifications = () => {
      if (msg.inbox_preview) {
        processInboxNotifs(msg);
        return;
      }

      if (msg.inbox_notifs) {
        const msgArr = [];

        for (let index = 0; index < msg.inbox_notifs.length; index++) {
          if (doCampHouseKeeping(msg.inbox_notifs[index]) !== false) {
            msgArr.push(msg.inbox_notifs[index]);
          }
        }

        processInboxNotifs(msgArr);
      }
    };

    if (msg.webInboxSetting || msg.inbox_notifs != null) {
      /**
       * When the user visits a website for the 1st time after web inbox channel is setup,
       * we need to initialise the inbox here because the initializeWebInbox method within init will not be executed
       * as we would not have any entry related to webInboxSettings in the LS
       */
      if (hasWebInboxSettingsInLS()) {
        checkAndRegisterWebInboxElements();
      }

      if ($ct.inbox === null) {
        msg.webInboxSetting && processWebInboxSettings(msg.webInboxSetting);
        initializeWebInbox(_logger).then(() => {
          handleInboxNotifications();
        }).catch(e => {});
      } else {
        handleInboxNotifications();
      }
    }

    if (msg.webPushConfig) {
      processWebPushConfig(msg.webPushConfig, logger, request);
    }

    if (msg.vars) {
      $ct.variableStore.mergeVariables(msg.vars);
      return;
    }

    if (StorageManager._isLocalStorageSupported()) {
      try {
        if (msg.evpr != null) {
          const eventsMap = msg.evpr.events;
          const profileMap = msg.evpr.profile;
          const syncExpiry = msg.evpr.expires_in;
          const now = getNow();
          StorageManager.setMetaProp('lsTime', now);
          StorageManager.setMetaProp('exTs', syncExpiry);
          mergeEventMap(eventsMap);
          StorageManager.saveToLSorCookie(EV_COOKIE, $ct.globalEventsMap);

          if ($ct.globalProfileMap == null) {
            addToLocalProfileMap(profileMap, true);
          } else {
            addToLocalProfileMap(profileMap, false);
          }
        }

        if (msg.arp != null) {
          arp(msg.arp);
        }

        if (msg.inapp_stale != null && msg.inapp_stale.length > 0) {
          // web popup stale
          staleDataUpdate(msg.inapp_stale, 'wp');
        }

        if (msg.inbox_stale != null && msg.inbox_stale.length > 0) {
          // web inbox stale
          staleDataUpdate(msg.inbox_stale, 'wi');
        }
      } catch (e) {
        _logger.error('Unable to persist evrp/arp: ' + e);
      }
    }
  };

  var _isPersonalisationActive$2 = _classPrivateFieldLooseKey("isPersonalisationActive");

  class User {
    constructor(_ref) {
      let {
        isPersonalisationActive
      } = _ref;
      Object.defineProperty(this, _isPersonalisationActive$2, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$2)[_isPersonalisationActive$2] = isPersonalisationActive;
    }

    getTotalVisits() {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$2)[_isPersonalisationActive$2]()) {
        return;
      }

      let visitCount = StorageManager.getMetaProp('sc');

      if (visitCount == null) {
        visitCount = 1;
      }

      return visitCount;
    }

    getLastVisit() {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$2)[_isPersonalisationActive$2]()) {
        return;
      }

      const prevSession = StorageManager.getMetaProp('ps');

      if (prevSession != null) {
        return new Date(prevSession * 1000);
      }
    }

  }

  const logLevels = {
    DISABLE: 0,
    ERROR: 1,
    INFO: 2,
    DEBUG: 3,
    DEBUG_PE: 4
  };

  var _logLevel = _classPrivateFieldLooseKey("logLevel");

  var _log = _classPrivateFieldLooseKey("log");

  var _isLegacyDebug = _classPrivateFieldLooseKey("isLegacyDebug");

  class Logger {
    constructor(logLevel) {
      Object.defineProperty(this, _isLegacyDebug, {
        get: _get_isLegacyDebug,
        set: void 0
      });
      Object.defineProperty(this, _log, {
        value: _log2
      });
      Object.defineProperty(this, _logLevel, {
        writable: true,
        value: void 0
      });
      this.wzrkError = {};
      _classPrivateFieldLooseBase(this, _logLevel)[_logLevel] = logLevel == null ? logLevel : logLevels.INFO;
      this.wzrkError = {};
    }

    get logLevel() {
      return _classPrivateFieldLooseBase(this, _logLevel)[_logLevel];
    }

    set logLevel(logLevel) {
      _classPrivateFieldLooseBase(this, _logLevel)[_logLevel] = logLevel;
    }

    error(message) {
      if (_classPrivateFieldLooseBase(this, _logLevel)[_logLevel] >= logLevels.ERROR) {
        _classPrivateFieldLooseBase(this, _log)[_log]('error', message);
      }
    }

    info(message) {
      if (_classPrivateFieldLooseBase(this, _logLevel)[_logLevel] >= logLevels.INFO) {
        _classPrivateFieldLooseBase(this, _log)[_log]('log', message);
      }
    }

    debug(message) {
      if (_classPrivateFieldLooseBase(this, _logLevel)[_logLevel] >= logLevels.DEBUG || _classPrivateFieldLooseBase(this, _isLegacyDebug)[_isLegacyDebug]) {
        _classPrivateFieldLooseBase(this, _log)[_log]('debug', message);
      }
    }

    debugPE(message) {
      if (_classPrivateFieldLooseBase(this, _logLevel)[_logLevel] >= logLevels.DEBUG_PE) {
        _classPrivateFieldLooseBase(this, _log)[_log]('debug_pe', message);
      }
    }

    reportError(code, description) {
      this.wzrkError.c = code;
      this.wzrkError.d = description;
      this.error("".concat(CLEVERTAP_ERROR_PREFIX, " ").concat(code, ": ").concat(description));
    }

  }

  var _log2 = function _log2(level, message) {
    if (window.console) {
      try {
        const ts = new Date().getTime();
        console[level]("CleverTap [".concat(ts, "]: ").concat(message));
      } catch (e) {}
    }
  };

  var _get_isLegacyDebug = function () {
    return typeof sessionStorage !== 'undefined' && sessionStorage.WZRK_D === '';
  };

  var _logger$6 = _classPrivateFieldLooseKey("logger");

  var _sessionId = _classPrivateFieldLooseKey("sessionId");

  var _isPersonalisationActive$3 = _classPrivateFieldLooseKey("isPersonalisationActive");

  class SessionManager {
    // SCOOKIE_NAME
    constructor(_ref) {
      let {
        logger,
        isPersonalisationActive
      } = _ref;
      Object.defineProperty(this, _logger$6, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _sessionId, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive$3, {
        writable: true,
        value: void 0
      });
      this.cookieName = void 0;
      this.scookieObj = void 0;
      this.sessionId = StorageManager.getMetaProp('cs');
      _classPrivateFieldLooseBase(this, _logger$6)[_logger$6] = logger;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$3)[_isPersonalisationActive$3] = isPersonalisationActive;
    }

    get sessionId() {
      return _classPrivateFieldLooseBase(this, _sessionId)[_sessionId];
    }

    set sessionId(sessionId) {
      _classPrivateFieldLooseBase(this, _sessionId)[_sessionId] = sessionId;
    }

    getSessionCookieObject() {
      let scookieStr = StorageManager.readCookie(this.cookieName);
      let obj = {};

      if (scookieStr != null) {
        // converting back single quotes to double for JSON parsing - http://www.iandevlin.com/blog/2012/04/html5/cookies-json-localstorage-and-opera
        scookieStr = scookieStr.replace(singleQuoteRegex, '"');
        obj = JSON.parse(scookieStr);

        if (!isObject(obj)) {
          obj = {};
        } else {
          if (typeof obj.t !== 'undefined') {
            // check time elapsed since last request
            const lastTime = obj.t;
            const now = getNow();

            if (now - lastTime > SCOOKIE_EXP_TIME_IN_SECS + 60) {
              // adding 60 seconds to compensate for in-journey requests
              // ideally the cookie should've died after SCOOKIE_EXP_TIME_IN_SECS but it's still around as we can read
              // hence we shouldn't use it.
              obj = {};
            }
          }
        }
      }

      this.scookieObj = obj;
      return obj;
    }

    setSessionCookieObject(obj) {
      const objStr = JSON.stringify(obj);
      StorageManager.createBroadCookie(this.cookieName, objStr, SCOOKIE_EXP_TIME_IN_SECS, getHostName());
    }

    manageSession(session) {
      // first time. check if current session id in localstorage is same
      // if not same then prev = current and current = this new session
      if (typeof this.sessionId === 'undefined' || this.sessionId !== session) {
        const currentSessionInLS = StorageManager.getMetaProp('cs'); // if sessionId in meta is undefined - set current to both

        if (typeof currentSessionInLS === 'undefined') {
          StorageManager.setMetaProp('ps', session);
          StorageManager.setMetaProp('cs', session);
          StorageManager.setMetaProp('sc', 1);
        } else if (currentSessionInLS !== session) {
          // not same as session in local storage. new session
          StorageManager.setMetaProp('ps', currentSessionInLS);
          StorageManager.setMetaProp('cs', session);
          let sessionCount = StorageManager.getMetaProp('sc');

          if (typeof sessionCount === 'undefined') {
            sessionCount = 0;
          }

          StorageManager.setMetaProp('sc', sessionCount + 1);
        }

        this.sessionId = session;
      }
    }

    getTimeElapsed() {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$3)[_isPersonalisationActive$3]()) {
        return;
      }

      if (this.scookieObj != null) {
        // TODO: check logic?
        this.scookieObj = this.getSessionCookieObject();
      }

      const sessionStart = this.scookieObj.s;

      if (sessionStart != null) {
        const ts = getNow();
        return Math.floor(ts - sessionStart);
      }
    }

    getPageCount() {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$3)[_isPersonalisationActive$3]()) {
        return;
      }

      if (this.scookieObj != null) {
        // TODO: check logic
        this.scookieObj = this.getSessionCookieObject();
      }

      return this.scookieObj.p;
    }

  }

  let seqNo = 0;
  let requestTime = 0;

  var _logger$7 = _classPrivateFieldLooseKey("logger");

  var _account$3 = _classPrivateFieldLooseKey("account");

  var _device$2 = _classPrivateFieldLooseKey("device");

  var _session$2 = _classPrivateFieldLooseKey("session");

  var _isPersonalisationActive$4 = _classPrivateFieldLooseKey("isPersonalisationActive");

  var _clearCookie = _classPrivateFieldLooseKey("clearCookie");

  var _addToLocalEventMap = _classPrivateFieldLooseKey("addToLocalEventMap");

  class RequestManager {
    constructor(_ref) {
      let {
        logger,
        account,
        device,
        session,
        isPersonalisationActive
      } = _ref;
      Object.defineProperty(this, _addToLocalEventMap, {
        value: _addToLocalEventMap2
      });
      Object.defineProperty(this, _logger$7, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _device$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _clearCookie, {
        writable: true,
        value: false
      });
      this.processingBackup = false;
      _classPrivateFieldLooseBase(this, _logger$7)[_logger$7] = logger;
      _classPrivateFieldLooseBase(this, _account$3)[_account$3] = account;
      _classPrivateFieldLooseBase(this, _device$2)[_device$2] = device;
      _classPrivateFieldLooseBase(this, _session$2)[_session$2] = session;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$4)[_isPersonalisationActive$4] = isPersonalisationActive;
      RequestDispatcher.logger = logger;
      RequestDispatcher.device = device;
      RequestDispatcher.account = account;
    }

    processBackupEvents() {
      const backupMap = StorageManager.readFromLSorCookie(LCOOKIE_NAME);

      if (typeof backupMap === 'undefined' || backupMap === null) {
        return;
      }

      this.processingBackup = true;

      for (const idx in backupMap) {
        if (backupMap.hasOwnProperty(idx)) {
          const backupEvent = backupMap[idx];

          if (typeof backupEvent.fired === 'undefined') {
            _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].debug('Processing backup event : ' + backupEvent.q);

            if (typeof backupEvent.q !== 'undefined') {
              RequestDispatcher.fireRequest(backupEvent.q);
            }

            backupEvent.fired = true;
          }
        }
      }

      StorageManager.saveToLSorCookie(LCOOKIE_NAME, backupMap);
      this.processingBackup = false;
    }

    addSystemDataToObject(dataObject, ignoreTrim) {
      // ignore trim for chrome notifications; undefined everywhere else
      if (typeof ignoreTrim === 'undefined') {
        dataObject = removeUnsupportedChars(dataObject, _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]);
      }

      if (!isObjectEmpty(_classPrivateFieldLooseBase(this, _logger$7)[_logger$7].wzrkError)) {
        dataObject.wzrk_error = _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].wzrkError;
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].wzrkError = {};
      }

      dataObject.id = _classPrivateFieldLooseBase(this, _account$3)[_account$3].id;

      if (isValueValid(_classPrivateFieldLooseBase(this, _device$2)[_device$2].gcookie)) {
        dataObject.g = _classPrivateFieldLooseBase(this, _device$2)[_device$2].gcookie;
      }

      const obj = _classPrivateFieldLooseBase(this, _session$2)[_session$2].getSessionCookieObject();

      dataObject.s = obj.s; // session cookie

      dataObject.pg = typeof obj.p === 'undefined' ? 1 : obj.p; // Page count

      let proto = document.location.protocol;
      proto = proto.replace(':', '');
      dataObject.af = { ...dataObject.af,
        lib: 'web-sdk-v1.11.2',
        protocol: proto,
        ...$ct.flutterVersion
      }; // app fields

      if (sessionStorage.hasOwnProperty('WZRK_D')) {
        dataObject.debug = true;
      }

      return dataObject;
    }

    addFlags(data) {
      // check if cookie should be cleared.
      _classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie] = StorageManager.getAndClearMetaProp(CLEAR);

      if (_classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie] !== undefined && _classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie]) {
        data.rc = true;

        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].debug('reset cookie sent in request and cleared from meta for future requests.');
      }

      if (_classPrivateFieldLooseBase(this, _isPersonalisationActive$4)[_isPersonalisationActive$4]()) {
        const lastSyncTime = StorageManager.getMetaProp('lsTime');
        const expirySeconds = StorageManager.getMetaProp('exTs'); // dsync not found in local storage - get data from server

        if (typeof lastSyncTime === 'undefined' || typeof expirySeconds === 'undefined') {
          data.dsync = true;
          return;
        }

        const now = getNow(); // last sync time has expired - get fresh data from server

        if (lastSyncTime + expirySeconds < now) {
          data.dsync = true;
        }
      }
    } // saves url to backup cache and fires the request

    /**
     *
     * @param {string} url
     * @param {boolean} override whether the request can go through or not
     * @param {Boolean} sendOULFlag - true in case of a On User Login request
     */


    saveAndFireRequest(url, override, sendOULFlag, evtName) {
      const now = getNow();
      url = addToURL(url, 'rn', ++$ct.globalCache.REQ_N);
      const data = url + '&i=' + now + '&sn=' + seqNo;
      StorageManager.backupEvent(data, $ct.globalCache.REQ_N, _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]); // if offline is set to true, save the request in backup and return

      if ($ct.offline) return; // if there is no override
      // and an OUL request is not in progress
      // then process the request as it is
      // else block the request
      // note - $ct.blockRequest should ideally be used for override

      if ((!override || _classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie] !== undefined && _classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie]) && !window.isOULInProgress) {
        if (now === requestTime) {
          seqNo++;
        } else {
          requestTime = now;
          seqNo = 0;
        }

        window.oulReqN = $ct.globalCache.REQ_N;
        RequestDispatcher.fireRequest(data, false, sendOULFlag, evtName);
      } else {
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].debug("Not fired due to override - ".concat($ct.blockRequest, " or clearCookie - ").concat(_classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie], " or OUL request in progress - ").concat(window.isOULInProgress));
      }
    }

    unregisterTokenForGuid(givenGUID) {
      const payload = StorageManager.readFromLSorCookie(PUSH_SUBSCRIPTION_DATA); // Send unregister event only when token is available

      if (payload) {
        const data = {};
        data.type = 'data';

        if (isValueValid(givenGUID)) {
          data.g = givenGUID;
        }

        data.action = 'unregister';
        data.id = _classPrivateFieldLooseBase(this, _account$3)[_account$3].id;

        const obj = _classPrivateFieldLooseBase(this, _session$2)[_session$2].getSessionCookieObject();

        data.s = obj.s; // session cookie

        const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]);

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$3)[_account$3].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', 'data');
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);
        RequestDispatcher.fireRequest(pageLoadUrl, true);
        StorageManager.saveToLSorCookie(FIRE_PUSH_UNREGISTERED, false);
      } // REGISTER TOKEN


      this.registerToken(payload);
    }

    registerToken(payload) {
      if (!payload) return; // add gcookie etc to the payload

      payload = this.addSystemDataToObject(payload, true);
      payload = JSON.stringify(payload);

      let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$3)[_account$3].dataPostURL;

      pageLoadUrl = addToURL(pageLoadUrl, 'type', 'data');
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(payload, _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]));
      RequestDispatcher.fireRequest(pageLoadUrl); // set in localstorage

      StorageManager.save(WEBPUSH_LS_KEY, 'ok');
    }

    processEvent(data) {
      _classPrivateFieldLooseBase(this, _addToLocalEventMap)[_addToLocalEventMap](data.evtName);

      data = this.addSystemDataToObject(data, undefined);
      this.addFlags(data);
      data[CAMP_COOKIE_NAME] = getCampaignObjForLc();
      const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]);

      let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$3)[_account$3].dataPostURL;

      pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);
      this.saveAndFireRequest(pageLoadUrl, $ct.blockRequest, false, data.evtName);
    }

    post(url, body) {
      return fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      }).then(response => {
        if (response.ok) {
          return response.json();
        }

        throw response;
      }).then(data => {
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].debug('Sync data successful', data);

        return data;
      }).catch(e => {
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].debug('Error in syncing variables', e);

        throw e;
      });
    }

  }

  var _addToLocalEventMap2 = function _addToLocalEventMap2(evtName) {
    if (StorageManager._isLocalStorageSupported()) {
      if (typeof $ct.globalEventsMap === 'undefined') {
        $ct.globalEventsMap = StorageManager.readFromLSorCookie(EV_COOKIE);

        if (typeof $ct.globalEventsMap === 'undefined') {
          $ct.globalEventsMap = {};
        }
      }

      const nowTs = getNow();
      let evtDetail = $ct.globalEventsMap[evtName];

      if (typeof evtDetail !== 'undefined') {
        evtDetail[2] = nowTs;
        evtDetail[0]++;
      } else {
        evtDetail = [];
        evtDetail.push(1);
        evtDetail.push(nowTs);
        evtDetail.push(nowTs);
      }

      $ct.globalEventsMap[evtName] = evtDetail;
      StorageManager.saveToLSorCookie(EV_COOKIE, $ct.globalEventsMap);
    }
  };

  var _request$5 = _classPrivateFieldLooseKey("request");

  var _account$4 = _classPrivateFieldLooseKey("account");

  var _oldValues$4 = _classPrivateFieldLooseKey("oldValues");

  var _logger$8 = _classPrivateFieldLooseKey("logger");

  var _processPrivacyArray = _classPrivateFieldLooseKey("processPrivacyArray");

  class Privacy extends Array {
    constructor(_ref, values) {
      let {
        request,
        account,
        logger
      } = _ref;
      super();
      Object.defineProperty(this, _processPrivacyArray, {
        value: _processPrivacyArray2
      });
      Object.defineProperty(this, _request$5, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$8, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger$8)[_logger$8] = logger;
      _classPrivateFieldLooseBase(this, _request$5)[_request$5] = request;
      _classPrivateFieldLooseBase(this, _account$4)[_account$4] = account;
      _classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4] = values;
    }

    push() {
      for (var _len = arguments.length, privacyArr = new Array(_len), _key = 0; _key < _len; _key++) {
        privacyArr[_key] = arguments[_key];
      }

      if ($ct.isPrivacyArrPushed) {
        _classPrivateFieldLooseBase(this, _processPrivacyArray)[_processPrivacyArray]($ct.privacyArray.length > 0 ? $ct.privacyArray : privacyArr);
      } else {
        $ct.privacyArray.push(...privacyArr);
      }

      return 0;
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4]) {
        _classPrivateFieldLooseBase(this, _processPrivacyArray)[_processPrivacyArray](_classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4] = null;
    }

  }

  var _processPrivacyArray2 = function _processPrivacyArray2(privacyArr) {
    if (Array.isArray(privacyArr) && privacyArr.length > 0) {
      const privacyObj = privacyArr.reduce((prev, curr) => ({ ...prev,
        ...curr
      }), {});
      let data = {};
      const profileObj = {};
      var optOut = false;

      if (privacyObj.hasOwnProperty(OPTOUT_KEY)) {
        optOut = privacyObj[OPTOUT_KEY];

        if (typeof optOut === 'boolean') {
          profileObj[CT_OPTOUT_KEY] = optOut; // should be true when user wants to opt in

          $ct.isOptInRequest = !optOut;
        }
      }

      if (privacyObj.hasOwnProperty(USEIP_KEY)) {
        const useIP = privacyObj[USEIP_KEY];
        const shouldUseIP = typeof useIP === 'boolean' ? useIP : false;
        StorageManager.setMetaProp(USEIP_KEY, shouldUseIP);
      }

      if (!isObjectEmpty(profileObj)) {
        data.type = 'profile';
        data.profile = profileObj;
        data = _classPrivateFieldLooseBase(this, _request$5)[_request$5].addSystemDataToObject(data, undefined);
        const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$8)[_logger$8]);

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$4)[_account$4].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);
        pageLoadUrl = addToURL(pageLoadUrl, OPTOUT_KEY, optOut ? 'true' : 'false');

        _classPrivateFieldLooseBase(this, _request$5)[_request$5].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);

        privacyArr.splice(0, privacyArr.length);
      }
    }
  };

  var _variableStore = _classPrivateFieldLooseKey("variableStore");

  class Variable {
    /**
     * Creates an instance of the Variable class.
     *
     * @constructor
     * @param {VariableStore} options.variableStore - The VariableStore instance for registration.
     * @param {string|null} options.name - The name of the variable.
     * @param {*} options.defaultValue - The default value of the variable.
     * @param {*} options.value - The current value of the variable.
     * @param {string|null} options.type - The type of the variable (string, number, boolean).
     * @param {boolean} options.hadStarted - A flag indicating whether the variable has started (used internally).
     * @param {Function[]} options.valueChangedCallbacks - Array to store callbacks to be executed when the variable value changes.
     */
    constructor(_ref) {
      let {
        variableStore
      } = _ref;
      Object.defineProperty(this, _variableStore, {
        writable: true,
        value: void 0
      });
      this.name = null;
      this.defaultValue = null;
      this.value = null;
      this.type = null;
      this.hadStarted = false;
      this.valueChangedCallbacks = [];
      _classPrivateFieldLooseBase(this, _variableStore)[_variableStore] = variableStore;
    }

    getValue() {
      return this.value;
    }

    getdefaultValue() {
      return this.defaultValue;
    }
    /**
     * Defines a new variable with the provided name, default value, and variable store.
     * @static
     * @param {string} name - The name of the variable.
     * @param {*} defaultValue - The default value of the variable.
     * @param {VariableStore} variableStore - The VariableStore instance for registration.
     * @returns {Variable|null} - The created Variable instance or null if invalid parameters are provided.
     */


    static define(name, defaultValue, variableStore) {
      if (!name || typeof name !== 'string') {
        console.error('Empty or invalid name parameter provided.');
        return null;
      }

      if (name.startsWith('.') || name.endsWith('.')) {
        console.error('Variable name starts or ends with a `.` which is not allowed: ' + name);
        return null;
      }

      const typeOfDefaultValue = typeof defaultValue;

      if (typeOfDefaultValue !== 'string' && typeOfDefaultValue !== 'number' && typeOfDefaultValue !== 'boolean') {
        console.error('Only primitive types (string, number, boolean) are accepted as value');
        return null;
      }

      const existing = variableStore.getVariable(name);

      if (existing) {
        return existing;
      }

      const varInstance = new Variable({
        variableStore
      });

      try {
        varInstance.name = name;
        varInstance.defaultValue = defaultValue;
        varInstance.value = defaultValue;
        varInstance.type = typeOfDefaultValue;
        variableStore.registerVariable(varInstance);
        varInstance.update(defaultValue);
      } catch (error) {
        console.error(error);
      }

      return varInstance;
    }
    /**
     * Updates the variable's value, triggering callbacks if hasVarsRequestCompleted is returned true.
     * @param {*} newValue - The new value to be assigned to the variable.
     */


    update(newValue) {
      const oldValue = this.value;
      this.value = newValue;

      if (newValue === null && oldValue === null) {
        return;
      }

      if (newValue !== null && newValue === oldValue && this.hadStarted) {
        return;
      }

      if (_classPrivateFieldLooseBase(this, _variableStore)[_variableStore].hasVarsRequestCompleted()) {
        this.hadStarted = true;
        this.triggerValueChanged();
      }
    }
    /**
     * Invokes all registered callbacks when the variable value changes.
     */


    triggerValueChanged() {
      this.valueChangedCallbacks.forEach(onValueChanged => {
        onValueChanged(this);
      });
    }
    /**
     * Adds a callback function to the array and triggers it immediately if variable requests have completed.
     * @param {Function} onValueChanged - The callback function to be added.
     */


    addValueChangedCallback(onValueChanged) {
      if (!onValueChanged) {
        console.log('Invalid callback parameter provided.');
        return;
      }

      this.valueChangedCallbacks.push(onValueChanged);

      if (_classPrivateFieldLooseBase(this, _variableStore)[_variableStore].hasVarsRequestCompleted()) {
        onValueChanged(this);
      }
    }
    /**
     * Removes a callback function from the array.
     * @param {Function} onValueChanged - The callback function to be removed.
     */


    removeValueChangedCallback(onValueChanged) {
      const index = this.valueChangedCallbacks.indexOf(onValueChanged);

      if (index !== -1) {
        this.valueChangedCallbacks.splice(index, 1);
      }
    }
    /**
     * Resets the `hadStarted` flag to false.
     */


    clearStartFlag() {
      this.hadStarted = false;
    }

  }

  var _logger$9 = _classPrivateFieldLooseKey("logger");

  var _account$5 = _classPrivateFieldLooseKey("account");

  var _request$6 = _classPrivateFieldLooseKey("request");

  var _event = _classPrivateFieldLooseKey("event");

  var _variables = _classPrivateFieldLooseKey("variables");

  var _remoteVariables = _classPrivateFieldLooseKey("remoteVariables");

  var _fetchCallback = _classPrivateFieldLooseKey("fetchCallback");

  var _variablesChangedCallbacks = _classPrivateFieldLooseKey("variablesChangedCallbacks");

  var _oneTimeVariablesChangedCallbacks = _classPrivateFieldLooseKey("oneTimeVariablesChangedCallbacks");

  var _hasVarsRequestCompleted = _classPrivateFieldLooseKey("hasVarsRequestCompleted");

  var _runVariablesChangedCallback = _classPrivateFieldLooseKey("runVariablesChangedCallback");

  class VariableStore {
    constructor(_ref) {
      let {
        logger,
        request,
        account,
        event
      } = _ref;
      Object.defineProperty(this, _runVariablesChangedCallback, {
        value: _runVariablesChangedCallback2
      });
      Object.defineProperty(this, _logger$9, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$5, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$6, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _event, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _variables, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _remoteVariables, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _fetchCallback, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _variablesChangedCallbacks, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oneTimeVariablesChangedCallbacks, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _hasVarsRequestCompleted, {
        writable: true,
        value: false
      });
      _classPrivateFieldLooseBase(this, _logger$9)[_logger$9] = logger;
      _classPrivateFieldLooseBase(this, _account$5)[_account$5] = account;
      _classPrivateFieldLooseBase(this, _request$6)[_request$6] = request;
      _classPrivateFieldLooseBase(this, _event)[_event] = event;
      _classPrivateFieldLooseBase(this, _variables)[_variables] = {};
      _classPrivateFieldLooseBase(this, _remoteVariables)[_remoteVariables] = {};
      _classPrivateFieldLooseBase(this, _variablesChangedCallbacks)[_variablesChangedCallbacks] = [];
      _classPrivateFieldLooseBase(this, _oneTimeVariablesChangedCallbacks)[_oneTimeVariablesChangedCallbacks] = [];
      $ct.variableStore = this;
    }
    /**
     * Registers a variable instance in the store.
     * @param {Object} varInstance - The variable instance to be registered.
     */


    registerVariable(varInstance) {
      const {
        name
      } = varInstance;
      _classPrivateFieldLooseBase(this, _variables)[_variables][name] = varInstance;
      console.log('registerVariable', _classPrivateFieldLooseBase(this, _variables)[_variables]);
    }
    /**
     * Retrieves a variable by its name.
     * @param {string} name - The name of the variable to retrieve.
     * @returns {Object} - The variable instance.
     */


    getVariable(name) {
      return _classPrivateFieldLooseBase(this, _variables)[_variables][name];
    }

    hasVarsRequestCompleted() {
      return _classPrivateFieldLooseBase(this, _hasVarsRequestCompleted)[_hasVarsRequestCompleted];
    }
    /**
     * Synchronizes variables with the server.
     * @param {Function} onSyncSuccess - Callback function on successful synchronization.
     * @param {Function} onSyncFailure - Callback function on synchronization failure.
     * @throws Will throw an error if the account token is missing.
     * @returns {Promise} - The result of the synchronization request.
     */


    syncVariables(onSyncSuccess, onSyncFailure) {
      if (!_classPrivateFieldLooseBase(this, _account$5)[_account$5].token) {
        const m = 'Account token is missing.';

        _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error(m);

        return Promise.reject(new Error(m));
      }

      const payload = {
        type: 'varsPayload',
        vars: {}
      };

      for (const name in _classPrivateFieldLooseBase(this, _variables)[_variables]) {
        payload.vars[name] = {
          defaultValue: _classPrivateFieldLooseBase(this, _variables)[_variables][name].defaultValue,
          type: _classPrivateFieldLooseBase(this, _variables)[_variables][name].type
        };
      } // Check if payload.vars is empty


      if (Object.keys(payload.vars).length === 0) {
        const m = 'No variables are defined.';

        _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error(m);

        return Promise.reject(new Error(m));
      }

      let meta = {};
      meta = _classPrivateFieldLooseBase(this, _request$6)[_request$6].addSystemDataToObject(meta, undefined);
      meta.tk = _classPrivateFieldLooseBase(this, _account$5)[_account$5].token;
      meta.type = 'meta';
      const body = JSON.stringify([meta, payload]);

      const url = _classPrivateFieldLooseBase(this, _account$5)[_account$5].dataPostPEURL;

      return _classPrivateFieldLooseBase(this, _request$6)[_request$6].post(url, body).then(r => {
        if (onSyncSuccess && typeof onSyncSuccess === 'function') {
          onSyncSuccess(r);
        }

        return r;
      }).catch(e => {
        if (onSyncFailure && typeof onSyncFailure === 'function') {
          onSyncFailure(e);
        }

        if (e.status === 400) {
          _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error('Invalid sync payload or clear the existing draft');
        } else if (e.status === 401) {
          _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error('This is not a test profile');
        } else {
          _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error('Sync variable failed');
        }

        throw e;
      });
    }
    /**
     * Fetches variables from the server.
     * @param {Function} onFetchCallback - Callback function on fetch completion.
     */


    fetchVariables(onFetchCallback) {
      _classPrivateFieldLooseBase(this, _event)[_event].push(WZRK_FETCH, {
        t: 4
      });

      if (onFetchCallback && typeof onFetchCallback === 'function') {
        _classPrivateFieldLooseBase(this, _fetchCallback)[_fetchCallback] = onFetchCallback;
      }
    }

    mergeVariables(vars) {
      console.log('msg vars is ', vars);
      _classPrivateFieldLooseBase(this, _hasVarsRequestCompleted)[_hasVarsRequestCompleted] = true;
      StorageManager.saveToLSorCookie(VARIABLES, vars);
      _classPrivateFieldLooseBase(this, _remoteVariables)[_remoteVariables] = vars;

      for (const name in _classPrivateFieldLooseBase(this, _variables)[_variables]) {
        if (vars.hasOwnProperty(name)) {
          _classPrivateFieldLooseBase(this, _variables)[_variables][name].update(vars[name]);
        }
      }

      if (_classPrivateFieldLooseBase(this, _fetchCallback)[_fetchCallback]) {
        _classPrivateFieldLooseBase(this, _fetchCallback)[_fetchCallback]();
      }

      _classPrivateFieldLooseBase(this, _runVariablesChangedCallback)[_runVariablesChangedCallback]();
    }

    addVariablesChangedCallback(callback) {
      if (callback && typeof callback === 'function') {
        _classPrivateFieldLooseBase(this, _variablesChangedCallbacks)[_variablesChangedCallbacks].push(callback);

        if (this.hasVarsRequestCompleted()) {
          callback();
        }
      } else {
        _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error('callback is not a function');
      }
    }

    addOneTimeVariablesChangedCallback(callback) {
      if (callback && typeof callback === 'function') {
        if (this.hasVarsRequestCompleted()) {
          callback();
        } else {
          _classPrivateFieldLooseBase(this, _oneTimeVariablesChangedCallbacks)[_oneTimeVariablesChangedCallbacks].push(callback);
        }
      }
    }

    removeVariablesChangedCallback(callback) {
      const index = _classPrivateFieldLooseBase(this, _variablesChangedCallbacks)[_variablesChangedCallbacks].indexOf(callback);

      if (index !== -1) {
        _classPrivateFieldLooseBase(this, _variablesChangedCallbacks)[_variablesChangedCallbacks].splice(index, 1);
      }
    }

    removeOneTimeVariablesChangedCallback(callback) {
      const index = _classPrivateFieldLooseBase(this, _oneTimeVariablesChangedCallbacks)[_oneTimeVariablesChangedCallbacks].indexOf(callback);

      if (index !== -1) {
        _classPrivateFieldLooseBase(this, _oneTimeVariablesChangedCallbacks)[_oneTimeVariablesChangedCallbacks].splice(index, 1);
      }
    }

  }

  var _runVariablesChangedCallback2 = function _runVariablesChangedCallback2() {
    for (var callback of _classPrivateFieldLooseBase(this, _variablesChangedCallbacks)[_variablesChangedCallbacks]) {
      callback();
    }

    for (var callBack of _classPrivateFieldLooseBase(this, _oneTimeVariablesChangedCallbacks)[_oneTimeVariablesChangedCallbacks]) {
      callBack();
    }

    _classPrivateFieldLooseBase(this, _oneTimeVariablesChangedCallbacks)[_oneTimeVariablesChangedCallbacks].length = 0;
  };

  var _logger$a = _classPrivateFieldLooseKey("logger");

  var _api = _classPrivateFieldLooseKey("api");

  var _onloadcalled = _classPrivateFieldLooseKey("onloadcalled");

  var _device$3 = _classPrivateFieldLooseKey("device");

  var _session$3 = _classPrivateFieldLooseKey("session");

  var _account$6 = _classPrivateFieldLooseKey("account");

  var _request$7 = _classPrivateFieldLooseKey("request");

  var _variableStore$1 = _classPrivateFieldLooseKey("variableStore");

  var _isSpa = _classPrivateFieldLooseKey("isSpa");

  var _previousUrl = _classPrivateFieldLooseKey("previousUrl");

  var _boundCheckPageChanged = _classPrivateFieldLooseKey("boundCheckPageChanged");

  var _dismissSpamControl = _classPrivateFieldLooseKey("dismissSpamControl");

  var _processOldValues = _classPrivateFieldLooseKey("processOldValues");

  var _debounce = _classPrivateFieldLooseKey("debounce");

  var _checkPageChanged = _classPrivateFieldLooseKey("checkPageChanged");

  var _pingRequest = _classPrivateFieldLooseKey("pingRequest");

  var _isPingContinuous = _classPrivateFieldLooseKey("isPingContinuous");

  var _overrideDSyncFlag = _classPrivateFieldLooseKey("overrideDSyncFlag");

  var _sendLocationData = _classPrivateFieldLooseKey("sendLocationData");

  class CleverTap {
    get spa() {
      return _classPrivateFieldLooseBase(this, _isSpa)[_isSpa];
    }

    set spa(value) {
      const isSpa = value === true;

      if (_classPrivateFieldLooseBase(this, _isSpa)[_isSpa] !== isSpa && _classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] === 1) {
        // if clevertap.spa is changed after init has been called then update the click listeners
        if (isSpa) {
          document.addEventListener('click', _classPrivateFieldLooseBase(this, _boundCheckPageChanged)[_boundCheckPageChanged]);
        } else {
          document.removeEventListener('click', _classPrivateFieldLooseBase(this, _boundCheckPageChanged)[_boundCheckPageChanged]);
        }
      }

      _classPrivateFieldLooseBase(this, _isSpa)[_isSpa] = isSpa;
    }

    get dismissSpamControl() {
      return _classPrivateFieldLooseBase(this, _dismissSpamControl)[_dismissSpamControl];
    }

    set dismissSpamControl(value) {
      const dismissSpamControl = value === true;
      _classPrivateFieldLooseBase(this, _dismissSpamControl)[_dismissSpamControl] = dismissSpamControl;
      $ct.dismissSpamControl = dismissSpamControl;
    }

    constructor() {
      var _clevertap$account, _clevertap$account2, _clevertap$account3, _clevertap$account4, _clevertap$account5;

      let clevertap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Object.defineProperty(this, _sendLocationData, {
        value: _sendLocationData2
      });
      Object.defineProperty(this, _overrideDSyncFlag, {
        value: _overrideDSyncFlag2
      });
      Object.defineProperty(this, _isPingContinuous, {
        value: _isPingContinuous2
      });
      Object.defineProperty(this, _pingRequest, {
        value: _pingRequest2
      });
      Object.defineProperty(this, _checkPageChanged, {
        value: _checkPageChanged2
      });
      Object.defineProperty(this, _debounce, {
        value: _debounce2
      });
      Object.defineProperty(this, _processOldValues, {
        value: _processOldValues2
      });
      Object.defineProperty(this, _logger$a, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _api, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _onloadcalled, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _device$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$6, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$7, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _variableStore$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isSpa, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _previousUrl, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _boundCheckPageChanged, {
        writable: true,
        value: _classPrivateFieldLooseBase(this, _checkPageChanged)[_checkPageChanged].bind(this)
      });
      Object.defineProperty(this, _dismissSpamControl, {
        writable: true,
        value: void 0
      });
      this.enablePersonalization = void 0;
      this.popupCallbacks = {};
      this.popupCurrentWzrkId = '';
      _classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] = 0;
      this._isPersonalisationActive = this._isPersonalisationActive.bind(this);

      this.raiseNotificationClicked = () => {};

      _classPrivateFieldLooseBase(this, _logger$a)[_logger$a] = new Logger(logLevels.INFO);
      _classPrivateFieldLooseBase(this, _account$6)[_account$6] = new Account((_clevertap$account = clevertap.account) === null || _clevertap$account === void 0 ? void 0 : _clevertap$account[0], clevertap.region || ((_clevertap$account2 = clevertap.account) === null || _clevertap$account2 === void 0 ? void 0 : _clevertap$account2[1]), clevertap.targetDomain || ((_clevertap$account3 = clevertap.account) === null || _clevertap$account3 === void 0 ? void 0 : _clevertap$account3[2]), clevertap.token || ((_clevertap$account4 = clevertap.account) === null || _clevertap$account4 === void 0 ? void 0 : _clevertap$account4[3]));
      _classPrivateFieldLooseBase(this, _device$3)[_device$3] = new DeviceManager({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]
      });
      _classPrivateFieldLooseBase(this, _dismissSpamControl)[_dismissSpamControl] = clevertap.dismissSpamControl || false;
      this.shpfyProxyPath = clevertap.shpfyProxyPath || '';
      _classPrivateFieldLooseBase(this, _session$3)[_session$3] = new SessionManager({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        isPersonalisationActive: this._isPersonalisationActive
      });
      _classPrivateFieldLooseBase(this, _request$7)[_request$7] = new RequestManager({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        account: _classPrivateFieldLooseBase(this, _account$6)[_account$6],
        device: _classPrivateFieldLooseBase(this, _device$3)[_device$3],
        session: _classPrivateFieldLooseBase(this, _session$3)[_session$3],
        isPersonalisationActive: this._isPersonalisationActive
      });
      this.enablePersonalization = clevertap.enablePersonalization || false;
      this.event = new EventHandler({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        isPersonalisationActive: this._isPersonalisationActive
      }, clevertap.event);
      this.profile = new ProfileHandler({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        account: _classPrivateFieldLooseBase(this, _account$6)[_account$6],
        isPersonalisationActive: this._isPersonalisationActive
      }, clevertap.profile);
      this.onUserLogin = new UserLoginHandler({
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        account: _classPrivateFieldLooseBase(this, _account$6)[_account$6],
        session: _classPrivateFieldLooseBase(this, _session$3)[_session$3],
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        device: _classPrivateFieldLooseBase(this, _device$3)[_device$3]
      }, clevertap.onUserLogin);
      this.privacy = new Privacy({
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        account: _classPrivateFieldLooseBase(this, _account$6)[_account$6],
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]
      }, clevertap.privacy);
      this.notifications = new NotificationHandler({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        account: _classPrivateFieldLooseBase(this, _account$6)[_account$6]
      }, clevertap.notifications);
      _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1] = new VariableStore({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        account: _classPrivateFieldLooseBase(this, _account$6)[_account$6],
        event: this.event
      });
      _classPrivateFieldLooseBase(this, _api)[_api] = new CleverTapAPI({
        logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a],
        request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
        device: _classPrivateFieldLooseBase(this, _device$3)[_device$3],
        session: _classPrivateFieldLooseBase(this, _session$3)[_session$3]
      });
      this.spa = clevertap.spa;
      this.dismissSpamControl = clevertap.dismissSpamControl;
      this.user = new User({
        isPersonalisationActive: this._isPersonalisationActive
      });
      this.session = {
        getTimeElapsed: () => {
          return _classPrivateFieldLooseBase(this, _session$3)[_session$3].getTimeElapsed();
        },
        getPageCount: () => {
          return _classPrivateFieldLooseBase(this, _session$3)[_session$3].getPageCount();
        }
      };

      this.logout = () => {
        _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].debug('logout called');

        StorageManager.setInstantDeleteFlagInK();
      };

      this.clear = () => {
        this.onUserLogin.clear();
      };

      this.getCleverTapID = () => {
        return _classPrivateFieldLooseBase(this, _device$3)[_device$3].getGuid();
      };

      this.getAccountID = () => {
        return _classPrivateFieldLooseBase(this, _account$6)[_account$6].id;
      };

      this.getSCDomain = () => {
        return _classPrivateFieldLooseBase(this, _account$6)[_account$6].finalTargetDomain;
      };

      this.setLibrary = (libName, libVersion) => {
        $ct.flutterVersion = {
          [libName]: libVersion
        };
      }; // Set the Signed Call sdk version and fire request


      this.setSCSDKVersion = ver => {
        _classPrivateFieldLooseBase(this, _account$6)[_account$6].scSDKVersion = ver;
        const data = {};
        data.af = {
          scv: 'sc-sdk-v' + _classPrivateFieldLooseBase(this, _account$6)[_account$6].scSDKVersion
        };

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', 'page');
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]));

        _classPrivateFieldLooseBase(this, _request$7)[_request$7].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
      };

      if (hasWebInboxSettingsInLS()) {
        checkAndRegisterWebInboxElements();
        initializeWebInbox(_classPrivateFieldLooseBase(this, _logger$a)[_logger$a]);
      } // Get Inbox Message Count


      this.getInboxMessageCount = () => {
        const msgCount = getInboxMessages();
        return Object.keys(msgCount).length;
      }; // Get Inbox Unread Message Count


      this.getInboxMessageUnreadCount = () => {
        if ($ct.inbox) {
          return $ct.inbox.unviewedCounter;
        } else {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].debug('No unread messages');
        }
      }; // Get All Inbox messages


      this.getAllInboxMessages = () => {
        return getInboxMessages();
      }; // Get only Unread messages


      this.getUnreadInboxMessages = () => {
        if ($ct.inbox) {
          return $ct.inbox.unviewedMessages;
        } else {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].debug('No unread messages');
        }
      }; // Get message object belonging to the given message id only. Message id should be a String


      this.getInboxMessageForId = messageId => {
        const messages = getInboxMessages();

        if ((messageId !== null || messageId !== '') && messages.hasOwnProperty(messageId)) {
          return messages[messageId];
        } else {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].error('No message available for message Id ' + messageId);
        }
      }; // Delete message from the Inbox. Message id should be a String
      // If the message to be deleted is unviewed then decrement the badge count, delete the message from unviewedMessages list
      // Then remove the message from local storage and update cookie


      this.deleteInboxMessage = messageId => {
        const messages = getInboxMessages();

        if ((messageId !== null || messageId !== '') && messages.hasOwnProperty(messageId)) {
          const el = document.querySelector('ct-web-inbox').shadowRoot.getElementById(messageId);

          if (messages[messageId].viewed === 0) {
            $ct.inbox.unviewedCounter--;
            delete $ct.inbox.unviewedMessages[messageId];
            document.getElementById('unviewedBadge').innerText = $ct.inbox.unviewedCounter;
            document.getElementById('unviewedBadge').style.display = $ct.inbox.unviewedCounter > 0 ? 'flex' : 'none';
          }

          el && el.remove();
          delete messages[messageId];
          saveInboxMessages(messages);
        } else {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].error('No message available for message Id ' + messageId);
        }
      };
      /* Mark Message as Read. Message id should be a String
       - Check if the message Id exist in the unread message list
       - Remove the unread marker, update the viewed flag, decrement the bage Count
       - renderNotificationViewed */


      this.markReadInboxMessage = messageId => {
        const unreadMsg = $ct.inbox.unviewedMessages;
        const messages = getInboxMessages();

        if ((messageId !== null || messageId !== '') && unreadMsg.hasOwnProperty(messageId)) {
          const el = document.querySelector('ct-web-inbox').shadowRoot.getElementById(messageId);

          if (el !== null) {
            el.shadowRoot.getElementById('unreadMarker').style.display = 'none';
          }

          messages[messageId].viewed = 1;

          if (document.getElementById('unviewedBadge')) {
            var counter = parseInt(document.getElementById('unviewedBadge').innerText) - 1;
            document.getElementById('unviewedBadge').innerText = counter;
            document.getElementById('unviewedBadge').style.display = counter > 0 ? 'flex' : 'none';
          }

          window.clevertap.renderNotificationViewed({
            msgId: messages[messageId].wzrk_id,
            pivotId: messages[messageId].pivotId
          });
          $ct.inbox.unviewedCounter--;
          delete $ct.inbox.unviewedMessages[messageId];
          saveInboxMessages(messages);
        } else {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].error('No message available for message Id ' + messageId);
        }
      };
      /* Mark Message as Read. messageIds should be a an array of string */


      this.markReadInboxMessagesForIds = messageIds => {
        if (Array.isArray(messageIds)) {
          for (var id = 0; id < messageIds.length; id++) {
            this.markReadInboxMessage(messageIds[id]);
          }
        }
      };
      /* Mark all messages as read
        - Get the count of unread messages, update unread marker style
        - renderNotificationViewed, update the badge count and style
      */


      this.markReadAllInboxMessage = () => {
        const unreadMsg = $ct.inbox.unviewedMessages;
        const messages = getInboxMessages();

        if (Object.keys(unreadMsg).length > 0) {
          const msgIds = Object.keys(unreadMsg);
          msgIds.forEach(key => {
            const el = document.querySelector('ct-web-inbox').shadowRoot.getElementById(key);

            if (el !== null) {
              el.shadowRoot.getElementById('unreadMarker').style.display = 'none';
            }

            messages[key].viewed = 1;
            window.clevertap.renderNotificationViewed({
              msgId: messages[key].wzrk_id,
              pivotId: messages[key].wzrk_pivot
            });
          });
          document.getElementById('unviewedBadge').innerText = 0;
          document.getElementById('unviewedBadge').style.display = 'none';
          saveInboxMessages(messages);
          $ct.inbox.unviewedCounter = 0;
          $ct.inbox.unviewedMessages = {};
        } else {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].debug('All messages are already read');
        }
      };

      this.toggleInbox = e => {
        var _$ct$inbox;

        return (_$ct$inbox = $ct.inbox) === null || _$ct$inbox === void 0 ? void 0 : _$ct$inbox.toggleInbox(e);
      }; // method for notification viewed


      this.renderNotificationViewed = detail => {
        processNotificationEvent(NOTIFICATION_VIEWED, detail);
      }; // method for notification clicked


      this.renderNotificationClicked = detail => {
        processNotificationEvent(NOTIFICATION_CLICKED, detail);
      };

      const processNotificationEvent = (eventName, eventDetail) => {
        if (!eventDetail || !eventDetail.msgId) {
          return;
        }

        const data = {};
        data.type = 'event';
        data.evtName = eventName;
        data.evtData = {
          [WZRK_ID]: eventDetail.msgId
        };

        if (eventDetail.pivotId) {
          data.evtData = { ...data.evtData,
            wzrk_pivot: eventDetail.pivotId
          };
        }

        if (eventDetail.wzrk_slideNo) {
          data.evtData = { ...data.evtData,
            wzrk_slideNo: eventDetail.wzrk_slideNo
          };
        } // Adding kv pair to event data


        if (eventDetail.kv && eventDetail.kv !== null && eventDetail.kv !== undefined) {
          for (const key in eventDetail.kv) {
            if (key.startsWith(WZRK_PREFIX)) {
              data.evtData = { ...data.evtData,
                [key]: eventDetail.kv[key]
              };
            }
          }
        } // Adding msgCTkv to event data


        if (eventDetail.msgCTkv && eventDetail.msgCTkv !== null && eventDetail.msgCTkv !== undefined) {
          for (const key in eventDetail.msgCTkv) {
            if (key.startsWith(WZRK_PREFIX)) {
              data.evtData = { ...data.evtData,
                [key]: eventDetail.msgCTkv[key]
              };
            }
          }
        }

        _classPrivateFieldLooseBase(this, _request$7)[_request$7].processEvent(data);
      };

      this.setLogLevel = l => {
        _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].logLevel = Number(l);

        if (l === 3) {
          sessionStorage.WZRK_D = '';
        } else {
          delete sessionStorage.WZRK_D;
        }
      };
      /**
      * @param {} key
      * @param {*} value
      */


      this.handleIncrementValue = (key, value) => {
        this.profile._handleIncrementDecrementValue(key, value, COMMAND_INCREMENT);
      };

      this.handleDecrementValue = (key, value) => {
        this.profile._handleIncrementDecrementValue(key, value, COMMAND_DECREMENT);
      };

      this.setMultiValuesForKey = (key, value) => {
        if (Array.isArray(value)) {
          this.profile._handleMultiValueSet(key, value, COMMAND_SET);
        } else {
          console.error('setMultiValuesForKey should be called with a value of type array');
        }
      };

      this.addMultiValueForKey = (key, value) => {
        if (typeof value === 'string' || typeof value === 'number') {
          this.profile._handleMultiValueAdd(key, value, COMMAND_ADD);
        } else {
          console.error('addMultiValueForKey should be called with a value of type string or number.');
        }
      };

      this.addMultiValuesForKey = (key, value) => {
        if (Array.isArray(value)) {
          this.profile._handleMultiValueAdd(key, value, COMMAND_ADD);
        } else {
          console.error('addMultiValuesForKey should be called with a value of type array.');
        }
      };

      this.removeMultiValueForKey = (key, value) => {
        if (typeof value === 'string' || typeof value === 'number') {
          this.profile._handleMultiValueRemove(key, value, COMMAND_REMOVE);
        } else {
          console.error('removeMultiValueForKey should be called with a value of type string or number.');
        }
      };

      this.removeMultiValuesForKey = (key, value) => {
        if (Array.isArray(value)) {
          this.profile._handleMultiValueRemove(key, value, COMMAND_REMOVE);
        } else {
          console.error('removeMultiValuesForKey should be called with a value of type array.');
        }
      };

      this.removeValueForKey = key => {
        this.profile._handleMultiValueDelete(key, COMMAND_DELETE);
      };

      const _handleEmailSubscription = (subscription, reEncoded, fetchGroups) => {
        handleEmailSubscription(subscription, reEncoded, fetchGroups, _classPrivateFieldLooseBase(this, _account$6)[_account$6], _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]);
      };
      /**
       *
       * @param {number} lat
       * @param {number} lng
       * @param {callback function} handleCoordinates
       * @returns
      */


      this.getLocation = function (lat, lng) {
        // latitude and longitude should be number type
        if (lat && typeof lat !== 'number' || lng && typeof lng !== 'number') {
          console.log('Latitude and Longitude must be of number type');
          return;
        }

        if (lat && lng) {
          // valid latitude ranges bw +-90
          if (lat <= -90 || lat > 90) {
            console.log('A vaid latitude must range between -90 and 90');
            return;
          } // valid longitude ranges bw +-180


          if (lng <= -180 || lng > 180) {
            console.log('A valid longitude must range between -180 and 180');
            return;
          }

          $ct.location = {
            Latitude: lat,
            Longitude: lng
          };

          _classPrivateFieldLooseBase(this, _sendLocationData)[_sendLocationData]({
            Latitude: lat,
            Longitude: lng
          });
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition.bind(this), showError);
          } else {
            console.log('Geolocation is not supported by this browser.');
          }
        }
      };

      function showPosition(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $ct.location = {
          Latitude: lat,
          Longitude: lng
        };

        _classPrivateFieldLooseBase(this, _sendLocationData)[_sendLocationData]({
          Latitude: lat,
          Longitude: lng
        });
      }

      function showError(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log('User denied the request for Geolocation.');
            break;

          case error.POSITION_UNAVAILABLE:
            console.log('Location information is unavailable.');
            break;

          case error.TIMEOUT:
            console.log('The request to get user location timed out.');
            break;

          case error.UNKNOWN_ERROR:
            console.log('An unknown error occurred.');
            break;
        }
      }

      const api = _classPrivateFieldLooseBase(this, _api)[_api];

      api.logout = this.logout;
      api.clear = this.clear;

      api.closeIframe = (campaignId, divIdIgnored) => {
        closeIframe(campaignId, divIdIgnored, _classPrivateFieldLooseBase(this, _session$3)[_session$3].sessionId);
      };

      api.enableWebPush = (enabled, applicationServerKey) => {
        setServerKey(applicationServerKey);

        this.notifications._enableWebPush(enabled, applicationServerKey);
      };

      api.tr = msg => {
        _tr(msg, {
          device: _classPrivateFieldLooseBase(this, _device$3)[_device$3],
          session: _classPrivateFieldLooseBase(this, _session$3)[_session$3],
          request: _classPrivateFieldLooseBase(this, _request$7)[_request$7],
          logger: _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]
        });
      };

      api.setEnum = enumVal => {
        setEnum(enumVal, _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]);
      };

      api.is_onloadcalled = () => {
        return _classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] === 1;
      };

      api.subEmail = reEncoded => {
        _handleEmailSubscription('1', reEncoded);
      };

      api.getEmail = (reEncoded, withGroups) => {
        _handleEmailSubscription('-1', reEncoded, withGroups);
      };

      api.unSubEmail = reEncoded => {
        _handleEmailSubscription('0', reEncoded);
      };

      api.unsubEmailGroups = reEncoded => {
        $ct.unsubGroups = [];
        const elements = document.getElementsByClassName('ct-unsub-group-input-item');

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];

          if (element.name) {
            const data = {
              name: element.name,
              isUnsubscribed: element.checked
            };
            $ct.unsubGroups.push(data);
          }
        }

        _handleEmailSubscription(GROUP_SUBSCRIPTION_REQUEST_ID, reEncoded);
      };

      api.setSubscriptionGroups = value => {
        $ct.unsubGroups = value;
      };

      api.getSubscriptionGroups = () => {
        return $ct.unsubGroups;
      };

      api.changeSubscriptionGroups = (reEncoded, updatedGroups) => {
        api.setSubscriptionGroups(updatedGroups);

        _handleEmailSubscription(GROUP_SUBSCRIPTION_REQUEST_ID, reEncoded);
      };

      api.isGlobalUnsubscribe = () => {
        return $ct.globalUnsubscribe;
      };

      api.setIsGlobalUnsubscribe = value => {
        $ct.globalUnsubscribe = value;
      };

      api.setUpdatedCategoryLong = profile => {
        if (profile[categoryLongKey]) {
          $ct.updatedCategoryLong = profile[categoryLongKey];
        }
      };

      window.$CLTP_WR = window.$WZRK_WR = api;

      if ((_clevertap$account5 = clevertap.account) === null || _clevertap$account5 === void 0 ? void 0 : _clevertap$account5[0].id) {
        // The accountId is present so can init with empty values.
        // Needed to maintain backward compatability with legacy implementations.
        // Npm imports/require will need to call init explictly with accountId
        this.init();
      }
    } // starts here


    init(accountId, region, targetDomain, token) {
      let antiFlicker = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      if (Object.keys(antiFlicker).length > 0) {
        addAntiFlicker(antiFlicker);
      }

      if (_classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] === 1) {
        // already initailsed
        return;
      }

      StorageManager.removeCookie('WZRK_P', window.location.hostname);

      if (!_classPrivateFieldLooseBase(this, _account$6)[_account$6].id) {
        if (!accountId) {
          _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].error(EMBED_ERROR);

          return;
        }

        _classPrivateFieldLooseBase(this, _account$6)[_account$6].id = accountId;
      }

      checkBuilder(_classPrivateFieldLooseBase(this, _logger$a)[_logger$a], _classPrivateFieldLooseBase(this, _account$6)[_account$6].id);
      _classPrivateFieldLooseBase(this, _session$3)[_session$3].cookieName = SCOOKIE_PREFIX + '_' + _classPrivateFieldLooseBase(this, _account$6)[_account$6].id;

      if (region) {
        _classPrivateFieldLooseBase(this, _account$6)[_account$6].region = region;
      }

      if (targetDomain) {
        _classPrivateFieldLooseBase(this, _account$6)[_account$6].targetDomain = targetDomain;
      }

      if (token) {
        _classPrivateFieldLooseBase(this, _account$6)[_account$6].token = token;
      }

      const currLocation = location.href;
      const urlParams = getURLParams(currLocation.toLowerCase()); // eslint-disable-next-line eqeqeq

      if (typeof urlParams.e !== 'undefined' && urlParams.wzrk_ex == '0') {
        return;
      }

      $ct.isPrivacyArrPushed = true;

      if ($ct.privacyArray.length > 0) {
        this.privacy.push($ct.privacyArray);
      }

      _classPrivateFieldLooseBase(this, _processOldValues)[_processOldValues]();

      this.pageChanged();
      const backupInterval = setInterval(() => {
        if (_classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie) {
          clearInterval(backupInterval);

          _classPrivateFieldLooseBase(this, _request$7)[_request$7].processBackupEvents();
        }
      }, 3000);

      if (_classPrivateFieldLooseBase(this, _isSpa)[_isSpa]) {
        // listen to click on the document and check if URL has changed.
        document.addEventListener('click', _classPrivateFieldLooseBase(this, _boundCheckPageChanged)[_boundCheckPageChanged]);
      } else {
        // remove existing click listeners if any
        document.removeEventListener('click', _classPrivateFieldLooseBase(this, _boundCheckPageChanged)[_boundCheckPageChanged]);
      }

      _classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] = 1;
    } // process the option array provided to the clevertap object
    // after its been initialized


    pageChanged() {
      const currLocation = window.location.href;
      const urlParams = getURLParams(currLocation.toLowerCase()); // -- update page count

      const obj = _classPrivateFieldLooseBase(this, _session$3)[_session$3].getSessionCookieObject();

      let pgCount = typeof obj.p === 'undefined' ? 0 : obj.p;
      obj.p = ++pgCount;

      _classPrivateFieldLooseBase(this, _session$3)[_session$3].setSessionCookieObject(obj); // -- update page count


      let data = {};
      let referrerDomain = getDomain(document.referrer);

      if (window.location.hostname !== referrerDomain) {
        const maxLen = 120;

        if (referrerDomain !== '') {
          referrerDomain = referrerDomain.length > maxLen ? referrerDomain.substring(0, maxLen) : referrerDomain;
          data.referrer = referrerDomain;
        }

        let utmSource = urlParams.utm_source || urlParams.wzrk_source;

        if (typeof utmSource !== 'undefined') {
          utmSource = utmSource.length > maxLen ? utmSource.substring(0, maxLen) : utmSource;
          data.us = utmSource; // utm_source
        }

        let utmMedium = urlParams.utm_medium || urlParams.wzrk_medium;

        if (typeof utmMedium !== 'undefined') {
          utmMedium = utmMedium.length > maxLen ? utmMedium.substring(0, maxLen) : utmMedium;
          data.um = utmMedium; // utm_medium
        }

        let utmCampaign = urlParams.utm_campaign || urlParams.wzrk_campaign;

        if (typeof utmCampaign !== 'undefined') {
          utmCampaign = utmCampaign.length > maxLen ? utmCampaign.substring(0, maxLen) : utmCampaign;
          data.uc = utmCampaign; // utm_campaign
        } // also independently send wzrk_medium to the backend


        if (typeof urlParams.wzrk_medium !== 'undefined') {
          const wm = urlParams.wzrk_medium;

          if (wm.match(/^email$|^social$|^search$/)) {
            data.wm = wm; // wzrk_medium
          }
        }
      }

      data = _classPrivateFieldLooseBase(this, _request$7)[_request$7].addSystemDataToObject(data, undefined);
      data.cpg = currLocation;
      data[CAMP_COOKIE_NAME] = getCampaignObjForLc();

      let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

      _classPrivateFieldLooseBase(this, _request$7)[_request$7].addFlags(data); // send dsync flag when page = 1


      if (parseInt(data.pg) === 1) {
        _classPrivateFieldLooseBase(this, _overrideDSyncFlag)[_overrideDSyncFlag](data);
      }

      pageLoadUrl = addToURL(pageLoadUrl, 'type', 'page');
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]));

      _classPrivateFieldLooseBase(this, _request$7)[_request$7].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);

      if (parseInt(data.pg) === 1) {
        this.event.push(WZRK_FETCH, {
          t: 4
        });
      }

      _classPrivateFieldLooseBase(this, _previousUrl)[_previousUrl] = currLocation;
      setTimeout(() => {
        if (pgCount <= 3) {
          // send ping for up to 3 pages
          _classPrivateFieldLooseBase(this, _pingRequest)[_pingRequest]();
        }

        if (_classPrivateFieldLooseBase(this, _isPingContinuous)[_isPingContinuous]()) {
          setInterval(() => {
            _classPrivateFieldLooseBase(this, _pingRequest)[_pingRequest]();
          }, CONTINUOUS_PING_FREQ_IN_MILLIS);
        }
      }, FIRST_PING_FREQ_IN_MILLIS);
    }

    _isPersonalisationActive() {
      return StorageManager._isLocalStorageSupported() && this.enablePersonalization;
    }

    // eslint-disable-next-line accessor-pairs
    set popupCallback(callback) {
      this.popupCallbacks[this.popupCurrentWzrkId] = callback;
    }
    /**
     *
     * @param {object} payload
     */


    // offline mode

    /**
     * events will be recorded and queued locally when passed with true
     * but will not be sent to the server until offline is disabled by passing false
     * @param {boolean} arg
     */
    setOffline(arg) {
      if (typeof arg !== 'boolean') {
        console.error('setOffline should be called with a value of type boolean');
        return;
      }

      $ct.offline = arg; // if offline is disabled
      // process events from cache

      if (!arg) {
        _classPrivateFieldLooseBase(this, _request$7)[_request$7].processBackupEvents();
      }
    }

    getSDKVersion() {
      return 'web-sdk-v1.11.2';
    }

    defineVariable(name, defaultValue) {
      return Variable.define(name, defaultValue, _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1]);
    }

    syncVariables(onSyncSuccess, onSyncFailure) {
      if (_classPrivateFieldLooseBase(this, _logger$a)[_logger$a].logLevel === 4) {
        return _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1].syncVariables(onSyncSuccess, onSyncFailure);
      } else {
        const m = 'App log level is not set to 4';

        _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].error(m);

        return Promise.reject(new Error(m));
      }
    }

    fetchVariables(onFetchCallback) {
      _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1].fetchVariables(onFetchCallback);
    }

    addVariablesChangedCallback(callback) {
      _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1].addVariablesChangedCallback(callback);
    }

    addOneTimeVariablesChangedCallback(callback) {
      _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1].addOneTimeVariablesChangedCallback(callback);
    }

  }

  var _processOldValues2 = function _processOldValues2() {
    this.onUserLogin._processOldValues();

    this.privacy._processOldValues();

    this.event._processOldValues();

    this.profile._processOldValues();

    this.notifications._processOldValues();
  };

  var _debounce2 = function _debounce2(func) {
    let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  };

  var _checkPageChanged2 = function _checkPageChanged2() {
    const debouncedPageChanged = _classPrivateFieldLooseBase(this, _debounce)[_debounce](() => {
      if (_classPrivateFieldLooseBase(this, _previousUrl)[_previousUrl] !== location.href) {
        this.pageChanged();
      }
    });

    debouncedPageChanged();
  };

  var _pingRequest2 = function _pingRequest2() {
    let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

    let data = {};
    data = _classPrivateFieldLooseBase(this, _request$7)[_request$7].addSystemDataToObject(data, undefined);
    pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PING);
    pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]));

    _classPrivateFieldLooseBase(this, _request$7)[_request$7].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
  };

  var _isPingContinuous2 = function _isPingContinuous2() {
    return typeof window.wzrk_d !== 'undefined' && window.wzrk_d.ping === 'continuous';
  };

  var _overrideDSyncFlag2 = function _overrideDSyncFlag2(data) {
    if (this._isPersonalisationActive()) {
      data.dsync = true;
    }
  };

  var _sendLocationData2 = function _sendLocationData2(payload) {
    // Send the updated value to LC
    let data = {};
    data.af = {};
    const profileObj = {};
    data.type = 'profile';

    if (profileObj.tz == null) {
      profileObj.tz = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
    }

    data.profile = profileObj;

    if (payload) {
      const keys = Object.keys(payload);
      keys.forEach(key => {
        data.af[key] = payload[key];
      });
    }

    if ($ct.location) {
      data.af = { ...data.af,
        ...$ct.location
      };
    }

    data = _classPrivateFieldLooseBase(this, _request$7)[_request$7].addSystemDataToObject(data, true);

    _classPrivateFieldLooseBase(this, _request$7)[_request$7].addFlags(data);

    const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]);

    let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

    pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
    pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

    _classPrivateFieldLooseBase(this, _request$7)[_request$7].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
  };

  const clevertap = new CleverTap(window.clevertap);
  window.clevertap = window.wizrocket = clevertap;

  return clevertap;

})));
//# sourceMappingURL=clevertap.js.map

// Support functions
const variables = {};

clevertap.defineVariables = (vars) => {
  for (var v in vars) {
    variables[v] = clevertap.defineVariable(v, vars[v]);
  }
}

clevertap.onVariablesChanged = (callback) => {
  clevertap.addVariablesChangedCallback(() => {
    const vars = {}
    for (const name in variables) {
      vars[name] = variables[name].value
    }
    console.log('sending to callback', JSON.stringify(vars))
    callback(vars)
  })
}

clevertap.onValueChanged = (key, callback) => {
  variables[key].addValueChangedCallback((v) => callback({ [key]: v.value }));
}

clevertap.getVariables = (callback) => {
  const vars = {}
  console.log({variables})
  for (const name in variables) {
    vars[name] = variables[name].value
  }
  callback(vars)
}

clevertap.getVariable = (name, callback) => {
  callback(variables[name].value)
}

clevertap.addDocumentEventListener = (name, callback) => {
  document.addEventListener(name, (e) => {
    callback(e.detail)
  })
}
