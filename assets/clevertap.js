(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.clevertap = factory());
})(this, (function () { 'use strict';

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
  const ACCOUNT_ID = 'WZRK_ACCOUNT_ID';
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
  const APPLICATION_SERVER_KEY_RECEIVED = 'WZRK_APPLICATION_SERVER_KEY_RECIEVED';
  const WEBPUSH_CONFIG_RECEIVED = 'WZRK_WEB_PUSH_CONFIG_RECEIVED';
  const NOTIFICATION_PUSH_METHOD_DEFERRED = 'WZRK_NOTIFICATION_PUSH_DEFERRED';
  const VAPID_MIGRATION_PROMPT_SHOWN = 'vapid_migration_prompt_shown';
  const NOTIF_LAST_TIME = 'notif_last_time';
  const TIMER_FOR_NOTIF_BADGE_UPDATE = 300;
  const OLD_SOFT_PROMPT_SELCTOR_ID = 'wzrk_wrapper';
  const NEW_SOFT_PROMPT_SELCTOR_ID = 'pnWrapper';
  const POPUP_LOADING = 'WZRK_POPUP_LOADING';
  const CUSTOM_HTML_PREVIEW = 'ctCustomHtmlPreview';
  const WEB_POPUP_PREVIEW = 'ctWebPopupPreview';
  const QUALIFIED_CAMPAIGNS = 'WZRK_QC';
  const CUSTOM_CT_ID_PREFIX = '_w_';
  const BLOCK_REQUEST_COOKIE = 'WZRK_BLOCK'; // Flag key for optional sub-domain profile isolation

  const ISOLATE_COOKIE = 'WZRK_ISOLATE_SD';
  const WEB_NATIVE_TEMPLATES = {
    KV_PAIR: 1,
    BANNER: 2,
    CAROUSEL: 3,
    VISUAL_BUILDER: 4,
    CUSTOM_HTML: 5,
    JSON: 6
  };
  const WEB_NATIVE_DISPLAY_VISUAL_EDITOR_TYPES = {
    HTML: 'html',
    FORM: 'form',
    JSON: 'json'
  };
  const WEB_POPUP_TEMPLATES = {
    BOX: 0,
    INTERSTITIAL: 1,
    BANNER: 2,
    IMAGE_ONLY: 3,
    ADVANCED_BUILDER: 4
  };
  const CAMPAIGN_TYPES = {
    EXIT_INTENT: 1,

    /* Deprecated */
    WEB_NATIVE_DISPLAY: 2,
    FOOTER_NOTIFICATION: 0,

    /* Web Popup */
    FOOTER_NOTIFICATION_2: null
    /* Web Popup */

  };
  const SYSTEM_EVENTS = ['Stayed', 'UTM Visited', 'App Launched', 'Notification Sent', NOTIFICATION_VIEWED, NOTIFICATION_CLICKED];
  const KEYS_TO_ENCRYPT = [KCOOKIE_NAME, LRU_CACHE, PR_COOKIE];
  const ACTION_TYPES = {
    OPEN_LINK: 'url',
    OPEN_LINK_AND_CLOSE: 'urlCloseNotification',
    CLOSE: 'close',
    OPEN_WEB_URL: 'open-web-url',
    SOFT_PROMPT: 'soft-prompt',
    RUN_JS: 'js'
  };

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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var cryptoJs$1 = {exports: {}};

  function commonjsRequire(path) {
  	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }

  var core$1 = {exports: {}};

  var core = core$1.exports;
  var hasRequiredCore;

  function requireCore() {
    if (hasRequiredCore) return core$1.exports;
    hasRequiredCore = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory();
        }
      })(core, function () {
        /*globals window, global, require*/

        /**
         * CryptoJS core components.
         */
        var CryptoJS = CryptoJS || function (Math, undefined$1) {
          var crypto; // Native crypto from window (Browser)

          if (typeof window !== 'undefined' && window.crypto) {
            crypto = window.crypto;
          } // Native crypto in web worker (Browser)


          if (typeof self !== 'undefined' && self.crypto) {
            crypto = self.crypto;
          } // Native crypto from worker


          if (typeof globalThis !== 'undefined' && globalThis.crypto) {
            crypto = globalThis.crypto;
          } // Native (experimental IE 11) crypto from window (Browser)


          if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
            crypto = window.msCrypto;
          } // Native crypto from global (NodeJS)


          if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
            crypto = commonjsGlobal.crypto;
          } // Native crypto import via require (NodeJS)


          if (!crypto && typeof commonjsRequire === 'function') {
            try {
              crypto = require('crypto');
            } catch (err) {}
          }
          /*
           * Cryptographically secure pseudorandom number generator
           *
           * As Math.random() is cryptographically not safe to use
           */


          var cryptoSecureRandomInt = function () {
            if (crypto) {
              // Use getRandomValues method (Browser)
              if (typeof crypto.getRandomValues === 'function') {
                try {
                  return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {}
              } // Use randomBytes method (NodeJS)


              if (typeof crypto.randomBytes === 'function') {
                try {
                  return crypto.randomBytes(4).readInt32LE();
                } catch (err) {}
              }
            }

            throw new Error('Native crypto module could not be used to get secure random number.');
          };
          /*
           * Local polyfill of Object.create
            */


          var create = Object.create || function () {
            function F() {}

            return function (obj) {
              var subtype;
              F.prototype = obj;
              subtype = new F();
              F.prototype = null;
              return subtype;
            };
          }();
          /**
           * CryptoJS namespace.
           */


          var C = {};
          /**
           * Library namespace.
           */

          var C_lib = C.lib = {};
          /**
           * Base object for prototypal inheritance.
           */

          var Base = C_lib.Base = function () {
            return {
              /**
               * Creates a new object that inherits from this object.
               *
               * @param {Object} overrides Properties to copy into the new object.
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         field: 'value',
               *
               *         method: function () {
               *         }
               *     });
               */
              extend: function (overrides) {
                // Spawn
                var subtype = create(this); // Augment

                if (overrides) {
                  subtype.mixIn(overrides);
                } // Create default initializer


                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                  subtype.init = function () {
                    subtype.$super.init.apply(this, arguments);
                  };
                } // Initializer's prototype is the subtype object


                subtype.init.prototype = subtype; // Reference supertype

                subtype.$super = this;
                return subtype;
              },

              /**
               * Extends this object and runs the init method.
               * Arguments to create() will be passed to init().
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var instance = MyType.create();
               */
              create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
              },

              /**
               * Initializes a newly created object.
               * Override this method to add some logic when your objects are created.
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         init: function () {
               *             // ...
               *         }
               *     });
               */
              init: function () {},

              /**
               * Copies properties into this object.
               *
               * @param {Object} properties The properties to mix in.
               *
               * @example
               *
               *     MyType.mixIn({
               *         field: 'value'
               *     });
               */
              mixIn: function (properties) {
                for (var propertyName in properties) {
                  if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                  }
                } // IE won't copy toString using the loop above


                if (properties.hasOwnProperty('toString')) {
                  this.toString = properties.toString;
                }
              },

              /**
               * Creates a copy of this object.
               *
               * @return {Object} The clone.
               *
               * @example
               *
               *     var clone = instance.clone();
               */
              clone: function () {
                return this.init.prototype.extend(this);
              }
            };
          }();
          /**
           * An array of 32-bit words.
           *
           * @property {Array} words The array of 32-bit words.
           * @property {number} sigBytes The number of significant bytes in this word array.
           */


          var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function (words, sigBytes) {
              words = this.words = words || [];

              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 4;
              }
            },

            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function (encoder) {
              return (encoder || Hex).stringify(this);
            },

            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function (wordArray) {
              // Shortcuts
              var thisWords = this.words;
              var thatWords = wordArray.words;
              var thisSigBytes = this.sigBytes;
              var thatSigBytes = wordArray.sigBytes; // Clamp excess bits

              this.clamp(); // Concat

              if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                  var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                  thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                }
              } else {
                // Copy one word at a time
                for (var j = 0; j < thatSigBytes; j += 4) {
                  thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
                }
              }

              this.sigBytes += thatSigBytes; // Chainable

              return this;
            },

            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function () {
              // Shortcuts
              var words = this.words;
              var sigBytes = this.sigBytes; // Clamp

              words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
              words.length = Math.ceil(sigBytes / 4);
            },

            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function () {
              var clone = Base.clone.call(this);
              clone.words = this.words.slice(0);
              return clone;
            },

            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function (nBytes) {
              var words = [];

              for (var i = 0; i < nBytes; i += 4) {
                words.push(cryptoSecureRandomInt());
              }

              return new WordArray.init(words, nBytes);
            }
          });
          /**
           * Encoder namespace.
           */

          var C_enc = C.enc = {};
          /**
           * Hex encoding strategy.
           */

          var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function (wordArray) {
              // Shortcuts
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes; // Convert

              var hexChars = [];

              for (var i = 0; i < sigBytes; i++) {
                var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
              }

              return hexChars.join('');
            },

            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function (hexStr) {
              // Shortcut
              var hexStrLength = hexStr.length; // Convert

              var words = [];

              for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
              }

              return new WordArray.init(words, hexStrLength / 2);
            }
          };
          /**
           * Latin1 encoding strategy.
           */

          var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function (wordArray) {
              // Shortcuts
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes; // Convert

              var latin1Chars = [];

              for (var i = 0; i < sigBytes; i++) {
                var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
              }

              return latin1Chars.join('');
            },

            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function (latin1Str) {
              // Shortcut
              var latin1StrLength = latin1Str.length; // Convert

              var words = [];

              for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
              }

              return new WordArray.init(words, latin1StrLength);
            }
          };
          /**
           * UTF-8 encoding strategy.
           */

          var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function (wordArray) {
              try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
              } catch (e) {
                throw new Error('Malformed UTF-8 data');
              }
            },

            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function (utf8Str) {
              return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
          };
          /**
           * Abstract buffered block algorithm template.
           *
           * The property blockSize must be implemented in a concrete subtype.
           *
           * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
           */

          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function () {
              // Initial values
              this._data = new WordArray.init();
              this._nDataBytes = 0;
            },

            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function (data) {
              // Convert string to WordArray, else assume WordArray already
              if (typeof data == 'string') {
                data = Utf8.parse(data);
              } // Append


              this._data.concat(data);

              this._nDataBytes += data.sigBytes;
            },

            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function (doFlush) {
              var processedWords; // Shortcuts

              var data = this._data;
              var dataWords = data.words;
              var dataSigBytes = data.sigBytes;
              var blockSize = this.blockSize;
              var blockSizeBytes = blockSize * 4; // Count blocks ready

              var nBlocksReady = dataSigBytes / blockSizeBytes;

              if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
              } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
              } // Count words ready


              var nWordsReady = nBlocksReady * blockSize; // Count bytes ready

              var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes); // Process blocks

              if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                  // Perform concrete-algorithm logic
                  this._doProcessBlock(dataWords, offset);
                } // Remove processed words


                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
              } // Return processed words


              return new WordArray.init(processedWords, nBytesReady);
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function () {
              var clone = Base.clone.call(this);
              clone._data = this._data.clone();
              return clone;
            },
            _minBufferSize: 0
          });
          /**
           * Abstract hasher template.
           *
           * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
           */

          C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            cfg: Base.extend(),

            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function (cfg) {
              // Apply config defaults
              this.cfg = this.cfg.extend(cfg); // Set initial values

              this.reset();
            },

            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function () {
              // Reset data buffer
              BufferedBlockAlgorithm.reset.call(this); // Perform concrete-hasher logic

              this._doReset();
            },

            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function (messageUpdate) {
              // Append
              this._append(messageUpdate); // Update the hash


              this._process(); // Chainable


              return this;
            },

            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function (messageUpdate) {
              // Final message update
              if (messageUpdate) {
                this._append(messageUpdate);
              } // Perform concrete-hasher logic


              var hash = this._doFinalize();

              return hash;
            },
            blockSize: 512 / 32,

            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function (hasher) {
              return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
              };
            },

            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function (hasher) {
              return function (message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
              };
            }
          });
          /**
           * Algorithm namespace.
           */

          var C_algo = C.algo = {};
          return C;
        }(Math);

        return CryptoJS;
      });
    })(core$1, core$1.exports);

    return core$1.exports;
  }

  var x64Core$1 = {exports: {}};

  var x64Core = x64Core$1.exports;
  var hasRequiredX64Core;

  function requireX64Core() {
    if (hasRequiredX64Core) return x64Core$1.exports;
    hasRequiredX64Core = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(x64Core, function (CryptoJS) {
        (function (undefined$1) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var X32WordArray = C_lib.WordArray;
          /**
           * x64 namespace.
           */

          var C_x64 = C.x64 = {};
          /**
           * A 64-bit word.
           */

          C_x64.Word = Base.extend({
            /**
             * Initializes a newly created 64-bit word.
             *
             * @param {number} high The high 32 bits.
             * @param {number} low The low 32 bits.
             *
             * @example
             *
             *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
             */
            init: function (high, low) {
              this.high = high;
              this.low = low;
            }
            /**
             * Bitwise NOTs this word.
             *
             * @return {X64Word} A new x64-Word object after negating.
             *
             * @example
             *
             *     var negated = x64Word.not();
             */
            // not: function () {
            // var high = ~this.high;
            // var low = ~this.low;
            // return X64Word.create(high, low);
            // },

            /**
             * Bitwise ANDs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to AND with this word.
             *
             * @return {X64Word} A new x64-Word object after ANDing.
             *
             * @example
             *
             *     var anded = x64Word.and(anotherX64Word);
             */
            // and: function (word) {
            // var high = this.high & word.high;
            // var low = this.low & word.low;
            // return X64Word.create(high, low);
            // },

            /**
             * Bitwise ORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to OR with this word.
             *
             * @return {X64Word} A new x64-Word object after ORing.
             *
             * @example
             *
             *     var ored = x64Word.or(anotherX64Word);
             */
            // or: function (word) {
            // var high = this.high | word.high;
            // var low = this.low | word.low;
            // return X64Word.create(high, low);
            // },

            /**
             * Bitwise XORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to XOR with this word.
             *
             * @return {X64Word} A new x64-Word object after XORing.
             *
             * @example
             *
             *     var xored = x64Word.xor(anotherX64Word);
             */
            // xor: function (word) {
            // var high = this.high ^ word.high;
            // var low = this.low ^ word.low;
            // return X64Word.create(high, low);
            // },

            /**
             * Shifts this word n bits to the left.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftL(25);
             */
            // shiftL: function (n) {
            // if (n < 32) {
            // var high = (this.high << n) | (this.low >>> (32 - n));
            // var low = this.low << n;
            // } else {
            // var high = this.low << (n - 32);
            // var low = 0;
            // }
            // return X64Word.create(high, low);
            // },

            /**
             * Shifts this word n bits to the right.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftR(7);
             */
            // shiftR: function (n) {
            // if (n < 32) {
            // var low = (this.low >>> n) | (this.high << (32 - n));
            // var high = this.high >>> n;
            // } else {
            // var low = this.high >>> (n - 32);
            // var high = 0;
            // }
            // return X64Word.create(high, low);
            // },

            /**
             * Rotates this word n bits to the left.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotL(25);
             */
            // rotL: function (n) {
            // return this.shiftL(n).or(this.shiftR(64 - n));
            // },

            /**
             * Rotates this word n bits to the right.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotR(7);
             */
            // rotR: function (n) {
            // return this.shiftR(n).or(this.shiftL(64 - n));
            // },

            /**
             * Adds this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to add with this word.
             *
             * @return {X64Word} A new x64-Word object after adding.
             *
             * @example
             *
             *     var added = x64Word.add(anotherX64Word);
             */
            // add: function (word) {
            // var low = (this.low + word.low) | 0;
            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
            // var high = (this.high + word.high + carry) | 0;
            // return X64Word.create(high, low);
            // }

          });
          /**
           * An array of 64-bit words.
           *
           * @property {Array} words The array of CryptoJS.x64.Word objects.
           * @property {number} sigBytes The number of significant bytes in this word array.
           */

          C_x64.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.x64.WordArray.create();
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ]);
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ], 10);
             */
            init: function (words, sigBytes) {
              words = this.words = words || [];

              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 8;
              }
            },

            /**
             * Converts this 64-bit word array to a 32-bit word array.
             *
             * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
             *
             * @example
             *
             *     var x32WordArray = x64WordArray.toX32();
             */
            toX32: function () {
              // Shortcuts
              var x64Words = this.words;
              var x64WordsLength = x64Words.length; // Convert

              var x32Words = [];

              for (var i = 0; i < x64WordsLength; i++) {
                var x64Word = x64Words[i];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
              }

              return X32WordArray.create(x32Words, this.sigBytes);
            },

            /**
             * Creates a copy of this word array.
             *
             * @return {X64WordArray} The clone.
             *
             * @example
             *
             *     var clone = x64WordArray.clone();
             */
            clone: function () {
              var clone = Base.clone.call(this); // Clone "words" array

              var words = clone.words = this.words.slice(0); // Clone each X64Word object

              var wordsLength = words.length;

              for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
              }

              return clone;
            }
          });
        })();

        return CryptoJS;
      });
    })(x64Core$1, x64Core$1.exports);

    return x64Core$1.exports;
  }

  var libTypedarrays$1 = {exports: {}};

  var libTypedarrays = libTypedarrays$1.exports;
  var hasRequiredLibTypedarrays;

  function requireLibTypedarrays() {
    if (hasRequiredLibTypedarrays) return libTypedarrays$1.exports;
    hasRequiredLibTypedarrays = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(libTypedarrays, function (CryptoJS) {
        (function () {
          // Check if typed arrays are supported
          if (typeof ArrayBuffer != 'function') {
            return;
          } // Shortcuts


          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray; // Reference original init

          var superInit = WordArray.init; // Augment WordArray.init to handle typed arrays

          var subInit = WordArray.init = function (typedArray) {
            // Convert buffers to uint8
            if (typedArray instanceof ArrayBuffer) {
              typedArray = new Uint8Array(typedArray);
            } // Convert other array views to uint8


            if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
              typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
            } // Handle Uint8Array


            if (typedArray instanceof Uint8Array) {
              // Shortcut
              var typedArrayByteLength = typedArray.byteLength; // Extract bytes

              var words = [];

              for (var i = 0; i < typedArrayByteLength; i++) {
                words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
              } // Initialize this word array


              superInit.call(this, words, typedArrayByteLength);
            } else {
              // Else call normal init
              superInit.apply(this, arguments);
            }
          };

          subInit.prototype = WordArray;
        })();

        return CryptoJS.lib.WordArray;
      });
    })(libTypedarrays$1, libTypedarrays$1.exports);

    return libTypedarrays$1.exports;
  }

  var encUtf16$1 = {exports: {}};

  var encUtf16 = encUtf16$1.exports;
  var hasRequiredEncUtf16;

  function requireEncUtf16() {
    if (hasRequiredEncUtf16) return encUtf16$1.exports;
    hasRequiredEncUtf16 = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(encUtf16, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          /**
           * UTF-16 BE encoding strategy.
           */

          C_enc.Utf16 = C_enc.Utf16BE = {
            /**
             * Converts a word array to a UTF-16 BE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 BE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
             */
            stringify: function (wordArray) {
              // Shortcuts
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes; // Convert

              var utf16Chars = [];

              for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff;
                utf16Chars.push(String.fromCharCode(codePoint));
              }

              return utf16Chars.join('');
            },

            /**
             * Converts a UTF-16 BE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 BE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
             */
            parse: function (utf16Str) {
              // Shortcut
              var utf16StrLength = utf16Str.length; // Convert

              var words = [];

              for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
              }

              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          /**
           * UTF-16 LE encoding strategy.
           */

          C_enc.Utf16LE = {
            /**
             * Converts a word array to a UTF-16 LE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 LE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
             */
            stringify: function (wordArray) {
              // Shortcuts
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes; // Convert

              var utf16Chars = [];

              for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff);
                utf16Chars.push(String.fromCharCode(codePoint));
              }

              return utf16Chars.join('');
            },

            /**
             * Converts a UTF-16 LE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 LE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
             */
            parse: function (utf16Str) {
              // Shortcut
              var utf16StrLength = utf16Str.length; // Convert

              var words = [];

              for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
              }

              return WordArray.create(words, utf16StrLength * 2);
            }
          };

          function swapEndian(word) {
            return word << 8 & 0xff00ff00 | word >>> 8 & 0x00ff00ff;
          }
        })();

        return CryptoJS.enc.Utf16;
      });
    })(encUtf16$1, encUtf16$1.exports);

    return encUtf16$1.exports;
  }

  var encBase64$1 = {exports: {}};

  var encBase64 = encBase64$1.exports;
  var hasRequiredEncBase64;

  function requireEncBase64() {
    if (hasRequiredEncBase64) return encBase64$1.exports;
    hasRequiredEncBase64 = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(encBase64, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          /**
           * Base64 encoding strategy.
           */

          C_enc.Base64 = {
            /**
             * Converts a word array to a Base64 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Base64 string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
             */
            stringify: function (wordArray) {
              // Shortcuts
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = this._map; // Clamp excess bits

              wordArray.clamp(); // Convert

              var base64Chars = [];

              for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
                var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;

                for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
                }
              } // Add padding


              var paddingChar = map.charAt(64);

              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }

              return base64Chars.join('');
            },

            /**
             * Converts a Base64 string to a word array.
             *
             * @param {string} base64Str The Base64 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
             */
            parse: function (base64Str) {
              // Shortcuts
              var base64StrLength = base64Str.length;
              var map = this._map;
              var reverseMap = this._reverseMap;

              if (!reverseMap) {
                reverseMap = this._reverseMap = [];

                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              } // Ignore padding


              var paddingChar = map.charAt(64);

              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);

                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              } // Convert


              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
          };

          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;

            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }

            return WordArray.create(words, nBytes);
          }
        })();

        return CryptoJS.enc.Base64;
      });
    })(encBase64$1, encBase64$1.exports);

    return encBase64$1.exports;
  }

  var encBase64url$1 = {exports: {}};

  var encBase64url = encBase64url$1.exports;
  var hasRequiredEncBase64url;

  function requireEncBase64url() {
    if (hasRequiredEncBase64url) return encBase64url$1.exports;
    hasRequiredEncBase64url = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(encBase64url, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          /**
           * Base64url encoding strategy.
           */

          C_enc.Base64url = {
            /**
             * Converts a word array to a Base64url string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {string} The Base64url string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
             */
            stringify: function (wordArray, urlSafe) {
              if (urlSafe === undefined) {
                urlSafe = true;
              } // Shortcuts


              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = urlSafe ? this._safe_map : this._map; // Clamp excess bits

              wordArray.clamp(); // Convert

              var base64Chars = [];

              for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
                var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;

                for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
                }
              } // Add padding


              var paddingChar = map.charAt(64);

              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }

              return base64Chars.join('');
            },

            /**
             * Converts a Base64url string to a word array.
             *
             * @param {string} base64Str The Base64url string.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
             */
            parse: function (base64Str, urlSafe) {
              if (urlSafe === undefined) {
                urlSafe = true;
              } // Shortcuts


              var base64StrLength = base64Str.length;
              var map = urlSafe ? this._safe_map : this._map;
              var reverseMap = this._reverseMap;

              if (!reverseMap) {
                reverseMap = this._reverseMap = [];

                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              } // Ignore padding


              var paddingChar = map.charAt(64);

              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);

                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              } // Convert


              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
          };

          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;

            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }

            return WordArray.create(words, nBytes);
          }
        })();

        return CryptoJS.enc.Base64url;
      });
    })(encBase64url$1, encBase64url$1.exports);

    return encBase64url$1.exports;
  }

  var md5$1 = {exports: {}};

  var md5 = md5$1.exports;
  var hasRequiredMd5;

  function requireMd5() {
    if (hasRequiredMd5) return md5$1.exports;
    hasRequiredMd5 = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(md5, function (CryptoJS) {
        (function (Math) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo; // Constants table

          var T = []; // Compute constants

          (function () {
            for (var i = 0; i < 64; i++) {
              T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
            }
          })();
          /**
           * MD5 hash algorithm.
           */


          var MD5 = C_algo.MD5 = Hasher.extend({
            _doReset: function () {
              this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
            },
            _doProcessBlock: function (M, offset) {
              // Swap endian
              for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
              } // Shortcuts


              var H = this._hash.words;
              var M_offset_0 = M[offset + 0];
              var M_offset_1 = M[offset + 1];
              var M_offset_2 = M[offset + 2];
              var M_offset_3 = M[offset + 3];
              var M_offset_4 = M[offset + 4];
              var M_offset_5 = M[offset + 5];
              var M_offset_6 = M[offset + 6];
              var M_offset_7 = M[offset + 7];
              var M_offset_8 = M[offset + 8];
              var M_offset_9 = M[offset + 9];
              var M_offset_10 = M[offset + 10];
              var M_offset_11 = M[offset + 11];
              var M_offset_12 = M[offset + 12];
              var M_offset_13 = M[offset + 13];
              var M_offset_14 = M[offset + 14];
              var M_offset_15 = M[offset + 15]; // Working variables

              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3]; // Computation

              a = FF(a, b, c, d, M_offset_0, 7, T[0]);
              d = FF(d, a, b, c, M_offset_1, 12, T[1]);
              c = FF(c, d, a, b, M_offset_2, 17, T[2]);
              b = FF(b, c, d, a, M_offset_3, 22, T[3]);
              a = FF(a, b, c, d, M_offset_4, 7, T[4]);
              d = FF(d, a, b, c, M_offset_5, 12, T[5]);
              c = FF(c, d, a, b, M_offset_6, 17, T[6]);
              b = FF(b, c, d, a, M_offset_7, 22, T[7]);
              a = FF(a, b, c, d, M_offset_8, 7, T[8]);
              d = FF(d, a, b, c, M_offset_9, 12, T[9]);
              c = FF(c, d, a, b, M_offset_10, 17, T[10]);
              b = FF(b, c, d, a, M_offset_11, 22, T[11]);
              a = FF(a, b, c, d, M_offset_12, 7, T[12]);
              d = FF(d, a, b, c, M_offset_13, 12, T[13]);
              c = FF(c, d, a, b, M_offset_14, 17, T[14]);
              b = FF(b, c, d, a, M_offset_15, 22, T[15]);
              a = GG(a, b, c, d, M_offset_1, 5, T[16]);
              d = GG(d, a, b, c, M_offset_6, 9, T[17]);
              c = GG(c, d, a, b, M_offset_11, 14, T[18]);
              b = GG(b, c, d, a, M_offset_0, 20, T[19]);
              a = GG(a, b, c, d, M_offset_5, 5, T[20]);
              d = GG(d, a, b, c, M_offset_10, 9, T[21]);
              c = GG(c, d, a, b, M_offset_15, 14, T[22]);
              b = GG(b, c, d, a, M_offset_4, 20, T[23]);
              a = GG(a, b, c, d, M_offset_9, 5, T[24]);
              d = GG(d, a, b, c, M_offset_14, 9, T[25]);
              c = GG(c, d, a, b, M_offset_3, 14, T[26]);
              b = GG(b, c, d, a, M_offset_8, 20, T[27]);
              a = GG(a, b, c, d, M_offset_13, 5, T[28]);
              d = GG(d, a, b, c, M_offset_2, 9, T[29]);
              c = GG(c, d, a, b, M_offset_7, 14, T[30]);
              b = GG(b, c, d, a, M_offset_12, 20, T[31]);
              a = HH(a, b, c, d, M_offset_5, 4, T[32]);
              d = HH(d, a, b, c, M_offset_8, 11, T[33]);
              c = HH(c, d, a, b, M_offset_11, 16, T[34]);
              b = HH(b, c, d, a, M_offset_14, 23, T[35]);
              a = HH(a, b, c, d, M_offset_1, 4, T[36]);
              d = HH(d, a, b, c, M_offset_4, 11, T[37]);
              c = HH(c, d, a, b, M_offset_7, 16, T[38]);
              b = HH(b, c, d, a, M_offset_10, 23, T[39]);
              a = HH(a, b, c, d, M_offset_13, 4, T[40]);
              d = HH(d, a, b, c, M_offset_0, 11, T[41]);
              c = HH(c, d, a, b, M_offset_3, 16, T[42]);
              b = HH(b, c, d, a, M_offset_6, 23, T[43]);
              a = HH(a, b, c, d, M_offset_9, 4, T[44]);
              d = HH(d, a, b, c, M_offset_12, 11, T[45]);
              c = HH(c, d, a, b, M_offset_15, 16, T[46]);
              b = HH(b, c, d, a, M_offset_2, 23, T[47]);
              a = II(a, b, c, d, M_offset_0, 6, T[48]);
              d = II(d, a, b, c, M_offset_7, 10, T[49]);
              c = II(c, d, a, b, M_offset_14, 15, T[50]);
              b = II(b, c, d, a, M_offset_5, 21, T[51]);
              a = II(a, b, c, d, M_offset_12, 6, T[52]);
              d = II(d, a, b, c, M_offset_3, 10, T[53]);
              c = II(c, d, a, b, M_offset_10, 15, T[54]);
              b = II(b, c, d, a, M_offset_1, 21, T[55]);
              a = II(a, b, c, d, M_offset_8, 6, T[56]);
              d = II(d, a, b, c, M_offset_15, 10, T[57]);
              c = II(c, d, a, b, M_offset_6, 15, T[58]);
              b = II(b, c, d, a, M_offset_13, 21, T[59]);
              a = II(a, b, c, d, M_offset_4, 6, T[60]);
              d = II(d, a, b, c, M_offset_11, 10, T[61]);
              c = II(c, d, a, b, M_offset_2, 15, T[62]);
              b = II(b, c, d, a, M_offset_9, 21, T[63]); // Intermediate hash value

              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
            },
            _doFinalize: function () {
              // Shortcuts
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8; // Add padding

              dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
              var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
              var nBitsTotalL = nBitsTotal;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;
              data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

              this._process(); // Shortcuts


              var hash = this._hash;
              var H = hash.words; // Swap endian

              for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];
                H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
              } // Return final computed hash


              return hash;
            },
            clone: function () {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });

          function FF(a, b, c, d, x, s, t) {
            var n = a + (b & c | ~b & d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }

          function GG(a, b, c, d, x, s, t) {
            var n = a + (b & d | c & ~d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }

          function HH(a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }

          function II(a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.MD5('message');
           *     var hash = CryptoJS.MD5(wordArray);
           */


          C.MD5 = Hasher._createHelper(MD5);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacMD5(message, key);
           */

          C.HmacMD5 = Hasher._createHmacHelper(MD5);
        })(Math);

        return CryptoJS.MD5;
      });
    })(md5$1, md5$1.exports);

    return md5$1.exports;
  }

  var sha1$1 = {exports: {}};

  var sha1 = sha1$1.exports;
  var hasRequiredSha1;

  function requireSha1() {
    if (hasRequiredSha1) return sha1$1.exports;
    hasRequiredSha1 = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(sha1, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo; // Reusable object

          var W = [];
          /**
           * SHA-1 hash algorithm.
           */

          var SHA1 = C_algo.SHA1 = Hasher.extend({
            _doReset: function () {
              this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
            },
            _doProcessBlock: function (M, offset) {
              // Shortcut
              var H = this._hash.words; // Working variables

              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              var e = H[4]; // Computation

              for (var i = 0; i < 80; i++) {
                if (i < 16) {
                  W[i] = M[offset + i] | 0;
                } else {
                  var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                  W[i] = n << 1 | n >>> 31;
                }

                var t = (a << 5 | a >>> 27) + e + W[i];

                if (i < 20) {
                  t += (b & c | ~b & d) + 0x5a827999;
                } else if (i < 40) {
                  t += (b ^ c ^ d) + 0x6ed9eba1;
                } else if (i < 60) {
                  t += (b & c | b & d | c & d) - 0x70e44324;
                } else
                  /* if (i < 80) */
                  {
                    t += (b ^ c ^ d) - 0x359d3e2a;
                  }

                e = d;
                d = c;
                c = b << 30 | b >>> 2;
                b = a;
                a = t;
              } // Intermediate hash value


              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
              H[4] = H[4] + e | 0;
            },
            _doFinalize: function () {
              // Shortcuts
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8; // Add padding

              dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4; // Hash final blocks

              this._process(); // Return final computed hash


              return this._hash;
            },
            clone: function () {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.SHA1('message');
           *     var hash = CryptoJS.SHA1(wordArray);
           */

          C.SHA1 = Hasher._createHelper(SHA1);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacSHA1(message, key);
           */

          C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
        })();

        return CryptoJS.SHA1;
      });
    })(sha1$1, sha1$1.exports);

    return sha1$1.exports;
  }

  var sha256$1 = {exports: {}};

  var sha256 = sha256$1.exports;
  var hasRequiredSha256;

  function requireSha256() {
    if (hasRequiredSha256) return sha256$1.exports;
    hasRequiredSha256 = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(sha256, function (CryptoJS) {
        (function (Math) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo; // Initialization and round constants tables

          var H = [];
          var K = []; // Compute constants

          (function () {
            function isPrime(n) {
              var sqrtN = Math.sqrt(n);

              for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                  return false;
                }
              }

              return true;
            }

            function getFractionalBits(n) {
              return (n - (n | 0)) * 0x100000000 | 0;
            }

            var n = 2;
            var nPrime = 0;

            while (nPrime < 64) {
              if (isPrime(n)) {
                if (nPrime < 8) {
                  H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }

                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
                nPrime++;
              }

              n++;
            }
          })(); // Reusable object


          var W = [];
          /**
           * SHA-256 hash algorithm.
           */

          var SHA256 = C_algo.SHA256 = Hasher.extend({
            _doReset: function () {
              this._hash = new WordArray.init(H.slice(0));
            },
            _doProcessBlock: function (M, offset) {
              // Shortcut
              var H = this._hash.words; // Working variables

              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              var e = H[4];
              var f = H[5];
              var g = H[6];
              var h = H[7]; // Computation

              for (var i = 0; i < 64; i++) {
                if (i < 16) {
                  W[i] = M[offset + i] | 0;
                } else {
                  var gamma0x = W[i - 15];
                  var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                  var gamma1x = W[i - 2];
                  var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                  W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch = e & f ^ ~e & g;
                var maj = a & b ^ a & c ^ b & c;
                var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
                var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = d + t1 | 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 | 0;
              } // Intermediate hash value


              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
              H[4] = H[4] + e | 0;
              H[5] = H[5] + f | 0;
              H[6] = H[6] + g | 0;
              H[7] = H[7] + h | 0;
            },
            _doFinalize: function () {
              // Shortcuts
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8; // Add padding

              dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4; // Hash final blocks

              this._process(); // Return final computed hash


              return this._hash;
            },
            clone: function () {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.SHA256('message');
           *     var hash = CryptoJS.SHA256(wordArray);
           */

          C.SHA256 = Hasher._createHelper(SHA256);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacSHA256(message, key);
           */

          C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        })(Math);

        return CryptoJS.SHA256;
      });
    })(sha256$1, sha256$1.exports);

    return sha256$1.exports;
  }

  var sha224$1 = {exports: {}};

  var sha224 = sha224$1.exports;
  var hasRequiredSha224;

  function requireSha224() {
    if (hasRequiredSha224) return sha224$1.exports;
    hasRequiredSha224 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireSha256());
        }
      })(sha224, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          /**
           * SHA-224 hash algorithm.
           */

          var SHA224 = C_algo.SHA224 = SHA256.extend({
            _doReset: function () {
              this._hash = new WordArray.init([0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4]);
            },
            _doFinalize: function () {
              var hash = SHA256._doFinalize.call(this);

              hash.sigBytes -= 4;
              return hash;
            }
          });
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.SHA224('message');
           *     var hash = CryptoJS.SHA224(wordArray);
           */

          C.SHA224 = SHA256._createHelper(SHA224);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacSHA224(message, key);
           */

          C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
        })();

        return CryptoJS.SHA224;
      });
    })(sha224$1, sha224$1.exports);

    return sha224$1.exports;
  }

  var sha512$1 = {exports: {}};

  var sha512 = sha512$1.exports;
  var hasRequiredSha512;

  function requireSha512() {
    if (hasRequiredSha512) return sha512$1.exports;
    hasRequiredSha512 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(sha512, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;

          function X64Word_create() {
            return X64Word.create.apply(X64Word, arguments);
          } // Constants


          var K = [X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd), X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc), X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019), X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118), X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe), X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2), X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1), X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694), X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3), X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65), X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483), X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5), X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210), X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4), X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725), X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70), X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926), X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df), X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8), X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b), X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001), X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30), X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910), X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8), X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53), X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8), X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb), X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3), X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60), X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec), X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9), X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b), X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207), X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178), X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6), X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b), X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493), X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c), X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a), X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)]; // Reusable objects

          var W = [];

          (function () {
            for (var i = 0; i < 80; i++) {
              W[i] = X64Word_create();
            }
          })();
          /**
           * SHA-512 hash algorithm.
           */


          var SHA512 = C_algo.SHA512 = Hasher.extend({
            _doReset: function () {
              this._hash = new X64WordArray.init([new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b), new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1), new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f), new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)]);
            },
            _doProcessBlock: function (M, offset) {
              // Shortcuts
              var H = this._hash.words;
              var H0 = H[0];
              var H1 = H[1];
              var H2 = H[2];
              var H3 = H[3];
              var H4 = H[4];
              var H5 = H[5];
              var H6 = H[6];
              var H7 = H[7];
              var H0h = H0.high;
              var H0l = H0.low;
              var H1h = H1.high;
              var H1l = H1.low;
              var H2h = H2.high;
              var H2l = H2.low;
              var H3h = H3.high;
              var H3l = H3.low;
              var H4h = H4.high;
              var H4l = H4.low;
              var H5h = H5.high;
              var H5l = H5.low;
              var H6h = H6.high;
              var H6l = H6.low;
              var H7h = H7.high;
              var H7l = H7.low; // Working variables

              var ah = H0h;
              var al = H0l;
              var bh = H1h;
              var bl = H1l;
              var ch = H2h;
              var cl = H2l;
              var dh = H3h;
              var dl = H3l;
              var eh = H4h;
              var el = H4l;
              var fh = H5h;
              var fl = H5l;
              var gh = H6h;
              var gl = H6l;
              var hh = H7h;
              var hl = H7l; // Rounds

              for (var i = 0; i < 80; i++) {
                var Wil;
                var Wih; // Shortcut

                var Wi = W[i]; // Extend message

                if (i < 16) {
                  Wih = Wi.high = M[offset + i * 2] | 0;
                  Wil = Wi.low = M[offset + i * 2 + 1] | 0;
                } else {
                  // Gamma0
                  var gamma0x = W[i - 15];
                  var gamma0xh = gamma0x.high;
                  var gamma0xl = gamma0x.low;
                  var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                  var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25); // Gamma1

                  var gamma1x = W[i - 2];
                  var gamma1xh = gamma1x.high;
                  var gamma1xl = gamma1x.low;
                  var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                  var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26); // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]

                  var Wi7 = W[i - 7];
                  var Wi7h = Wi7.high;
                  var Wi7l = Wi7.low;
                  var Wi16 = W[i - 16];
                  var Wi16h = Wi16.high;
                  var Wi16l = Wi16.low;
                  Wil = gamma0l + Wi7l;
                  Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                  Wil = Wil + gamma1l;
                  Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                  Wil = Wil + Wi16l;
                  Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                  Wi.high = Wih;
                  Wi.low = Wil;
                }

                var chh = eh & fh ^ ~eh & gh;
                var chl = el & fl ^ ~el & gl;
                var majh = ah & bh ^ ah & ch ^ bh & ch;
                var majl = al & bl ^ al & cl ^ bl & cl;
                var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9); // t1 = h + sigma1 + ch + K[i] + W[i]

                var Ki = K[i];
                var Kih = Ki.high;
                var Kil = Ki.low;
                var t1l = hl + sigma1l;
                var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                var t1l = t1l + chl;
                var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                var t1l = t1l + Kil;
                var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                var t1l = t1l + Wil;
                var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0); // t2 = sigma0 + maj

                var t2l = sigma0l + majl;
                var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0); // Update working variables

                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = dl + t1l | 0;
                eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = t1l + t2l | 0;
                ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
              } // Intermediate hash value


              H0l = H0.low = H0l + al;
              H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
              H1l = H1.low = H1l + bl;
              H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
              H2l = H2.low = H2l + cl;
              H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
              H3l = H3.low = H3l + dl;
              H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
              H4l = H4.low = H4l + el;
              H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
              H5l = H5.low = H5l + fl;
              H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
              H6l = H6.low = H6l + gl;
              H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
              H7l = H7.low = H7l + hl;
              H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
            },
            _doFinalize: function () {
              // Shortcuts
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8; // Add padding

              dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
              data.sigBytes = dataWords.length * 4; // Hash final blocks

              this._process(); // Convert hash to 32-bit word array before returning


              var hash = this._hash.toX32(); // Return final computed hash


              return hash;
            },
            clone: function () {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            },
            blockSize: 1024 / 32
          });
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.SHA512('message');
           *     var hash = CryptoJS.SHA512(wordArray);
           */

          C.SHA512 = Hasher._createHelper(SHA512);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacSHA512(message, key);
           */

          C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
        })();

        return CryptoJS.SHA512;
      });
    })(sha512$1, sha512$1.exports);

    return sha512$1.exports;
  }

  var sha384$1 = {exports: {}};

  var sha384 = sha384$1.exports;
  var hasRequiredSha384;

  function requireSha384() {
    if (hasRequiredSha384) return sha384$1.exports;
    hasRequiredSha384 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireX64Core(), requireSha512());
        }
      })(sha384, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          var SHA512 = C_algo.SHA512;
          /**
           * SHA-384 hash algorithm.
           */

          var SHA384 = C_algo.SHA384 = SHA512.extend({
            _doReset: function () {
              this._hash = new X64WordArray.init([new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507), new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939), new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511), new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)]);
            },
            _doFinalize: function () {
              var hash = SHA512._doFinalize.call(this);

              hash.sigBytes -= 16;
              return hash;
            }
          });
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.SHA384('message');
           *     var hash = CryptoJS.SHA384(wordArray);
           */

          C.SHA384 = SHA512._createHelper(SHA384);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacSHA384(message, key);
           */

          C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
        })();

        return CryptoJS.SHA384;
      });
    })(sha384$1, sha384$1.exports);

    return sha384$1.exports;
  }

  var sha3$1 = {exports: {}};

  var sha3 = sha3$1.exports;
  var hasRequiredSha3;

  function requireSha3() {
    if (hasRequiredSha3) return sha3$1.exports;
    hasRequiredSha3 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(sha3, function (CryptoJS) {
        (function (Math) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var C_algo = C.algo; // Constants tables

          var RHO_OFFSETS = [];
          var PI_INDEXES = [];
          var ROUND_CONSTANTS = []; // Compute Constants

          (function () {
            // Compute rho offset constants
            var x = 1,
                y = 0;

            for (var t = 0; t < 24; t++) {
              RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
              var newX = y % 5;
              var newY = (2 * x + 3 * y) % 5;
              x = newX;
              y = newY;
            } // Compute pi index constants


            for (var x = 0; x < 5; x++) {
              for (var y = 0; y < 5; y++) {
                PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
              }
            } // Compute round constants


            var LFSR = 0x01;

            for (var i = 0; i < 24; i++) {
              var roundConstantMsw = 0;
              var roundConstantLsw = 0;

              for (var j = 0; j < 7; j++) {
                if (LFSR & 0x01) {
                  var bitPosition = (1 << j) - 1;

                  if (bitPosition < 32) {
                    roundConstantLsw ^= 1 << bitPosition;
                  } else
                    /* if (bitPosition >= 32) */
                    {
                      roundConstantMsw ^= 1 << bitPosition - 32;
                    }
                } // Compute next LFSR


                if (LFSR & 0x80) {
                  // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
                  LFSR = LFSR << 1 ^ 0x71;
                } else {
                  LFSR <<= 1;
                }
              }

              ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
            }
          })(); // Reusable objects for temporary values


          var T = [];

          (function () {
            for (var i = 0; i < 25; i++) {
              T[i] = X64Word.create();
            }
          })();
          /**
           * SHA-3 hash algorithm.
           */


          var SHA3 = C_algo.SHA3 = Hasher.extend({
            /**
             * Configuration options.
             *
             * @property {number} outputLength
             *   The desired number of bits in the output hash.
             *   Only values permitted are: 224, 256, 384, 512.
             *   Default: 512
             */
            cfg: Hasher.cfg.extend({
              outputLength: 512
            }),
            _doReset: function () {
              var state = this._state = [];

              for (var i = 0; i < 25; i++) {
                state[i] = new X64Word.init();
              }

              this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            },
            _doProcessBlock: function (M, offset) {
              // Shortcuts
              var state = this._state;
              var nBlockSizeLanes = this.blockSize / 2; // Absorb

              for (var i = 0; i < nBlockSizeLanes; i++) {
                // Shortcuts
                var M2i = M[offset + 2 * i];
                var M2i1 = M[offset + 2 * i + 1]; // Swap endian

                M2i = (M2i << 8 | M2i >>> 24) & 0x00ff00ff | (M2i << 24 | M2i >>> 8) & 0xff00ff00;
                M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 0x00ff00ff | (M2i1 << 24 | M2i1 >>> 8) & 0xff00ff00; // Absorb message into state

                var lane = state[i];
                lane.high ^= M2i1;
                lane.low ^= M2i;
              } // Rounds


              for (var round = 0; round < 24; round++) {
                // Theta
                for (var x = 0; x < 5; x++) {
                  // Mix column lanes
                  var tMsw = 0,
                      tLsw = 0;

                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    tMsw ^= lane.high;
                    tLsw ^= lane.low;
                  } // Temporary values


                  var Tx = T[x];
                  Tx.high = tMsw;
                  Tx.low = tLsw;
                }

                for (var x = 0; x < 5; x++) {
                  // Shortcuts
                  var Tx4 = T[(x + 4) % 5];
                  var Tx1 = T[(x + 1) % 5];
                  var Tx1Msw = Tx1.high;
                  var Tx1Lsw = Tx1.low; // Mix surrounding columns

                  var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                  var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);

                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    lane.high ^= tMsw;
                    lane.low ^= tLsw;
                  }
                } // Rho Pi


                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                  var tMsw;
                  var tLsw; // Shortcuts

                  var lane = state[laneIndex];
                  var laneMsw = lane.high;
                  var laneLsw = lane.low;
                  var rhoOffset = RHO_OFFSETS[laneIndex]; // Rotate lanes

                  if (rhoOffset < 32) {
                    tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                    tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                  } else
                    /* if (rhoOffset >= 32) */
                    {
                      tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                      tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                    } // Transpose lanes


                  var TPiLane = T[PI_INDEXES[laneIndex]];
                  TPiLane.high = tMsw;
                  TPiLane.low = tLsw;
                } // Rho pi at x = y = 0


                var T0 = T[0];
                var state0 = state[0];
                T0.high = state0.high;
                T0.low = state0.low; // Chi

                for (var x = 0; x < 5; x++) {
                  for (var y = 0; y < 5; y++) {
                    // Shortcuts
                    var laneIndex = x + 5 * y;
                    var lane = state[laneIndex];
                    var TLane = T[laneIndex];
                    var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                    var Tx2Lane = T[(x + 2) % 5 + 5 * y]; // Mix rows

                    lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                    lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                  }
                } // Iota


                var lane = state[0];
                var roundConstant = ROUND_CONSTANTS[round];
                lane.high ^= roundConstant.high;
                lane.low ^= roundConstant.low;
              }
            },
            _doFinalize: function () {
              // Shortcuts
              var data = this._data;
              var dataWords = data.words;
              this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              var blockSizeBits = this.blockSize * 32; // Add padding

              dataWords[nBitsLeft >>> 5] |= 0x1 << 24 - nBitsLeft % 32;
              dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 0x80;
              data.sigBytes = dataWords.length * 4; // Hash final blocks

              this._process(); // Shortcuts


              var state = this._state;
              var outputLengthBytes = this.cfg.outputLength / 8;
              var outputLengthLanes = outputLengthBytes / 8; // Squeeze

              var hashWords = [];

              for (var i = 0; i < outputLengthLanes; i++) {
                // Shortcuts
                var lane = state[i];
                var laneMsw = lane.high;
                var laneLsw = lane.low; // Swap endian

                laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 0x00ff00ff | (laneMsw << 24 | laneMsw >>> 8) & 0xff00ff00;
                laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 0x00ff00ff | (laneLsw << 24 | laneLsw >>> 8) & 0xff00ff00; // Squeeze state to retrieve hash

                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
              } // Return final computed hash


              return new WordArray.init(hashWords, outputLengthBytes);
            },
            clone: function () {
              var clone = Hasher.clone.call(this);

              var state = clone._state = this._state.slice(0);

              for (var i = 0; i < 25; i++) {
                state[i] = state[i].clone();
              }

              return clone;
            }
          });
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.SHA3('message');
           *     var hash = CryptoJS.SHA3(wordArray);
           */

          C.SHA3 = Hasher._createHelper(SHA3);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacSHA3(message, key);
           */

          C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
        })(Math);

        return CryptoJS.SHA3;
      });
    })(sha3$1, sha3$1.exports);

    return sha3$1.exports;
  }

  var ripemd160$1 = {exports: {}};

  var ripemd160 = ripemd160$1.exports;
  var hasRequiredRipemd160;

  function requireRipemd160() {
    if (hasRequiredRipemd160) return ripemd160$1.exports;
    hasRequiredRipemd160 = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(ripemd160, function (CryptoJS) {
        /** @preserve
        (c) 2012 by Cédric Mesnil. All rights reserved.
        	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
        	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
            - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
        	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        */
        (function (Math) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo; // Constants table

          var _zl = WordArray.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);

          var _zr = WordArray.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);

          var _sl = WordArray.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);

          var _sr = WordArray.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

          var _hl = WordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);

          var _hr = WordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);
          /**
           * RIPEMD160 hash algorithm.
           */


          var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
            _doReset: function () {
              this._hash = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
            },
            _doProcessBlock: function (M, offset) {
              // Swap endian
              for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i]; // Swap

                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
              } // Shortcut


              var H = this._hash.words;
              var hl = _hl.words;
              var hr = _hr.words;
              var zl = _zl.words;
              var zr = _zr.words;
              var sl = _sl.words;
              var sr = _sr.words; // Working variables

              var al, bl, cl, dl, el;
              var ar, br, cr, dr, er;
              ar = al = H[0];
              br = bl = H[1];
              cr = cl = H[2];
              dr = dl = H[3];
              er = el = H[4]; // Computation

              var t;

              for (var i = 0; i < 80; i += 1) {
                t = al + M[offset + zl[i]] | 0;

                if (i < 16) {
                  t += f1(bl, cl, dl) + hl[0];
                } else if (i < 32) {
                  t += f2(bl, cl, dl) + hl[1];
                } else if (i < 48) {
                  t += f3(bl, cl, dl) + hl[2];
                } else if (i < 64) {
                  t += f4(bl, cl, dl) + hl[3];
                } else {
                  // if (i<80) {
                  t += f5(bl, cl, dl) + hl[4];
                }

                t = t | 0;
                t = rotl(t, sl[i]);
                t = t + el | 0;
                al = el;
                el = dl;
                dl = rotl(cl, 10);
                cl = bl;
                bl = t;
                t = ar + M[offset + zr[i]] | 0;

                if (i < 16) {
                  t += f5(br, cr, dr) + hr[0];
                } else if (i < 32) {
                  t += f4(br, cr, dr) + hr[1];
                } else if (i < 48) {
                  t += f3(br, cr, dr) + hr[2];
                } else if (i < 64) {
                  t += f2(br, cr, dr) + hr[3];
                } else {
                  // if (i<80) {
                  t += f1(br, cr, dr) + hr[4];
                }

                t = t | 0;
                t = rotl(t, sr[i]);
                t = t + er | 0;
                ar = er;
                er = dr;
                dr = rotl(cr, 10);
                cr = br;
                br = t;
              } // Intermediate hash value


              t = H[1] + cl + dr | 0;
              H[1] = H[2] + dl + er | 0;
              H[2] = H[3] + el + ar | 0;
              H[3] = H[4] + al + br | 0;
              H[4] = H[0] + bl + cr | 0;
              H[0] = t;
            },
            _doFinalize: function () {
              // Shortcuts
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8; // Add padding

              dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 0x00ff00ff | (nBitsTotal << 24 | nBitsTotal >>> 8) & 0xff00ff00;
              data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

              this._process(); // Shortcuts


              var hash = this._hash;
              var H = hash.words; // Swap endian

              for (var i = 0; i < 5; i++) {
                // Shortcut
                var H_i = H[i]; // Swap

                H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
              } // Return final computed hash


              return hash;
            },
            clone: function () {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });

          function f1(x, y, z) {
            return x ^ y ^ z;
          }

          function f2(x, y, z) {
            return x & y | ~x & z;
          }

          function f3(x, y, z) {
            return (x | ~y) ^ z;
          }

          function f4(x, y, z) {
            return x & z | y & ~z;
          }

          function f5(x, y, z) {
            return x ^ (y | ~z);
          }

          function rotl(x, n) {
            return x << n | x >>> 32 - n;
          }
          /**
           * Shortcut function to the hasher's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           *
           * @return {WordArray} The hash.
           *
           * @static
           *
           * @example
           *
           *     var hash = CryptoJS.RIPEMD160('message');
           *     var hash = CryptoJS.RIPEMD160(wordArray);
           */


          C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
          /**
           * Shortcut function to the HMAC's object interface.
           *
           * @param {WordArray|string} message The message to hash.
           * @param {WordArray|string} key The secret key.
           *
           * @return {WordArray} The HMAC.
           *
           * @static
           *
           * @example
           *
           *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
           */

          C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        })();

        return CryptoJS.RIPEMD160;
      });
    })(ripemd160$1, ripemd160$1.exports);

    return ripemd160$1.exports;
  }

  var hmac$1 = {exports: {}};

  var hmac = hmac$1.exports;
  var hasRequiredHmac;

  function requireHmac() {
    if (hasRequiredHmac) return hmac$1.exports;
    hasRequiredHmac = 1;

    (function (module, exports) {

      (function (root, factory) {
        {
          // CommonJS
          module.exports = factory(requireCore());
        }
      })(hmac, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var C_algo = C.algo;
          /**
           * HMAC algorithm.
           */

          C_algo.HMAC = Base.extend({
            /**
             * Initializes a newly created HMAC.
             *
             * @param {Hasher} hasher The hash algorithm to use.
             * @param {WordArray|string} key The secret key.
             *
             * @example
             *
             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
             */
            init: function (hasher, key) {
              // Init hasher
              hasher = this._hasher = new hasher.init(); // Convert string to WordArray, else assume WordArray already

              if (typeof key == 'string') {
                key = Utf8.parse(key);
              } // Shortcuts


              var hasherBlockSize = hasher.blockSize;
              var hasherBlockSizeBytes = hasherBlockSize * 4; // Allow arbitrary length keys

              if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
              } // Clamp excess bits


              key.clamp(); // Clone key for inner and outer pads

              var oKey = this._oKey = key.clone();
              var iKey = this._iKey = key.clone(); // Shortcuts

              var oKeyWords = oKey.words;
              var iKeyWords = iKey.words; // XOR keys with pad constants

              for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 0x5c5c5c5c;
                iKeyWords[i] ^= 0x36363636;
              }

              oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes; // Set initial values

              this.reset();
            },

            /**
             * Resets this HMAC to its initial state.
             *
             * @example
             *
             *     hmacHasher.reset();
             */
            reset: function () {
              // Shortcut
              var hasher = this._hasher; // Reset

              hasher.reset();
              hasher.update(this._iKey);
            },

            /**
             * Updates this HMAC with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {HMAC} This HMAC instance.
             *
             * @example
             *
             *     hmacHasher.update('message');
             *     hmacHasher.update(wordArray);
             */
            update: function (messageUpdate) {
              this._hasher.update(messageUpdate); // Chainable


              return this;
            },

            /**
             * Finalizes the HMAC computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The HMAC.
             *
             * @example
             *
             *     var hmac = hmacHasher.finalize();
             *     var hmac = hmacHasher.finalize('message');
             *     var hmac = hmacHasher.finalize(wordArray);
             */
            finalize: function (messageUpdate) {
              // Shortcut
              var hasher = this._hasher; // Compute HMAC

              var innerHash = hasher.finalize(messageUpdate);
              hasher.reset();
              var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
              return hmac;
            }
          });
        })();
      });
    })(hmac$1, hmac$1.exports);

    return hmac$1.exports;
  }

  var pbkdf2$1 = {exports: {}};

  var pbkdf2 = pbkdf2$1.exports;
  var hasRequiredPbkdf2;

  function requirePbkdf2() {
    if (hasRequiredPbkdf2) return pbkdf2$1.exports;
    hasRequiredPbkdf2 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireSha256(), requireHmac());
        }
      })(pbkdf2, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var HMAC = C_algo.HMAC;
          /**
           * Password-Based Key Derivation Function 2 algorithm.
           */

          var PBKDF2 = C_algo.PBKDF2 = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hasher to use. Default: SHA256
             * @property {number} iterations The number of iterations to perform. Default: 250000
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: SHA256,
              iterations: 250000
            }),

            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.PBKDF2.create();
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
             */
            init: function (cfg) {
              this.cfg = this.cfg.extend(cfg);
            },

            /**
             * Computes the Password-Based Key Derivation Function 2.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function (password, salt) {
              // Shortcut
              var cfg = this.cfg; // Init HMAC

              var hmac = HMAC.create(cfg.hasher, password); // Initial values

              var derivedKey = WordArray.create();
              var blockIndex = WordArray.create([0x00000001]); // Shortcuts

              var derivedKeyWords = derivedKey.words;
              var blockIndexWords = blockIndex.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations; // Generate key

              while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).finalize(blockIndex);
                hmac.reset(); // Shortcuts

                var blockWords = block.words;
                var blockWordsLength = blockWords.length; // Iterations

                var intermediate = block;

                for (var i = 1; i < iterations; i++) {
                  intermediate = hmac.finalize(intermediate);
                  hmac.reset(); // Shortcut

                  var intermediateWords = intermediate.words; // XOR intermediate with block

                  for (var j = 0; j < blockWordsLength; j++) {
                    blockWords[j] ^= intermediateWords[j];
                  }
                }

                derivedKey.concat(block);
                blockIndexWords[0]++;
              }

              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           * @param {Object} cfg (Optional) The configuration options to use for this computation.
           *
           * @return {WordArray} The derived key.
           *
           * @static
           *
           * @example
           *
           *     var key = CryptoJS.PBKDF2(password, salt);
           *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
           *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
           */

          C.PBKDF2 = function (password, salt, cfg) {
            return PBKDF2.create(cfg).compute(password, salt);
          };
        })();

        return CryptoJS.PBKDF2;
      });
    })(pbkdf2$1, pbkdf2$1.exports);

    return pbkdf2$1.exports;
  }

  var evpkdf$1 = {exports: {}};

  var evpkdf = evpkdf$1.exports;
  var hasRequiredEvpkdf;

  function requireEvpkdf() {
    if (hasRequiredEvpkdf) return evpkdf$1.exports;
    hasRequiredEvpkdf = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireSha1(), requireHmac());
        }
      })(evpkdf, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var MD5 = C_algo.MD5;
          /**
           * This key derivation function is meant to conform with EVP_BytesToKey.
           * www.openssl.org/docs/crypto/EVP_BytesToKey.html
           */

          var EvpKDF = C_algo.EvpKDF = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: MD5,
              iterations: 1
            }),

            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */
            init: function (cfg) {
              this.cfg = this.cfg.extend(cfg);
            },

            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function (password, salt) {
              var block; // Shortcut

              var cfg = this.cfg; // Init hasher

              var hasher = cfg.hasher.create(); // Initial values

              var derivedKey = WordArray.create(); // Shortcuts

              var derivedKeyWords = derivedKey.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations; // Generate key

              while (derivedKeyWords.length < keySize) {
                if (block) {
                  hasher.update(block);
                }

                block = hasher.update(password).finalize(salt);
                hasher.reset(); // Iterations

                for (var i = 1; i < iterations; i++) {
                  block = hasher.finalize(block);
                  hasher.reset();
                }

                derivedKey.concat(block);
              }

              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           * @param {Object} cfg (Optional) The configuration options to use for this computation.
           *
           * @return {WordArray} The derived key.
           *
           * @static
           *
           * @example
           *
           *     var key = CryptoJS.EvpKDF(password, salt);
           *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
           *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
           */

          C.EvpKDF = function (password, salt, cfg) {
            return EvpKDF.create(cfg).compute(password, salt);
          };
        })();

        return CryptoJS.EvpKDF;
      });
    })(evpkdf$1, evpkdf$1.exports);

    return evpkdf$1.exports;
  }

  var cipherCore$1 = {exports: {}};

  var cipherCore = cipherCore$1.exports;
  var hasRequiredCipherCore;

  function requireCipherCore() {
    if (hasRequiredCipherCore) return cipherCore$1.exports;
    hasRequiredCipherCore = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEvpkdf());
        }
      })(cipherCore, function (CryptoJS) {
        /**
         * Cipher core components.
         */
        CryptoJS.lib.Cipher || function (undefined$1) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
          var C_enc = C.enc;
          C_enc.Utf8;
          var Base64 = C_enc.Base64;
          var C_algo = C.algo;
          var EvpKDF = C_algo.EvpKDF;
          /**
           * Abstract base cipher template.
           *
           * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
           * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
           * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
           * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
           */

          var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */
            cfg: Base.extend(),

            /**
             * Creates this cipher in encryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
             */
            createEncryptor: function (key, cfg) {
              return this.create(this._ENC_XFORM_MODE, key, cfg);
            },

            /**
             * Creates this cipher in decryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
             */
            createDecryptor: function (key, cfg) {
              return this.create(this._DEC_XFORM_MODE, key, cfg);
            },

            /**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */
            init: function (xformMode, key, cfg) {
              // Apply config defaults
              this.cfg = this.cfg.extend(cfg); // Store transform mode and key

              this._xformMode = xformMode;
              this._key = key; // Set initial values

              this.reset();
            },

            /**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */
            reset: function () {
              // Reset data buffer
              BufferedBlockAlgorithm.reset.call(this); // Perform concrete-cipher logic

              this._doReset();
            },

            /**
             * Adds data to be encrypted or decrypted.
             *
             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
             *
             * @return {WordArray} The data after processing.
             *
             * @example
             *
             *     var encrypted = cipher.process('data');
             *     var encrypted = cipher.process(wordArray);
             */
            process: function (dataUpdate) {
              // Append
              this._append(dataUpdate); // Process available blocks


              return this._process();
            },

            /**
             * Finalizes the encryption or decryption process.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
             *
             * @return {WordArray} The data after final processing.
             *
             * @example
             *
             *     var encrypted = cipher.finalize();
             *     var encrypted = cipher.finalize('data');
             *     var encrypted = cipher.finalize(wordArray);
             */
            finalize: function (dataUpdate) {
              // Final data update
              if (dataUpdate) {
                this._append(dataUpdate);
              } // Perform concrete-cipher logic


              var finalProcessedData = this._doFinalize();

              return finalProcessedData;
            },
            keySize: 128 / 32,
            ivSize: 128 / 32,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,

            /**
             * Creates shortcut functions to a cipher's object interface.
             *
             * @param {Cipher} cipher The cipher to create a helper for.
             *
             * @return {Object} An object with encrypt and decrypt shortcut functions.
             *
             * @static
             *
             * @example
             *
             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
             */
            _createHelper: function () {
              function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                  return PasswordBasedCipher;
                } else {
                  return SerializableCipher;
                }
              }

              return function (cipher) {
                return {
                  encrypt: function (message, key, cfg) {
                    return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                  },
                  decrypt: function (ciphertext, key, cfg) {
                    return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                  }
                };
              };
            }()
          });
          /**
           * Abstract base stream cipher template.
           *
           * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
           */

          C_lib.StreamCipher = Cipher.extend({
            _doFinalize: function () {
              // Process partial blocks
              var finalProcessedBlocks = this._process(!!'flush');

              return finalProcessedBlocks;
            },
            blockSize: 1
          });
          /**
           * Mode namespace.
           */

          var C_mode = C.mode = {};
          /**
           * Abstract base block cipher mode template.
           */

          var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
            /**
             * Creates this mode for encryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
             */
            createEncryptor: function (cipher, iv) {
              return this.Encryptor.create(cipher, iv);
            },

            /**
             * Creates this mode for decryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
             */
            createDecryptor: function (cipher, iv) {
              return this.Decryptor.create(cipher, iv);
            },

            /**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */
            init: function (cipher, iv) {
              this._cipher = cipher;
              this._iv = iv;
            }
          });
          /**
           * Cipher Block Chaining mode.
           */

          var CBC = C_mode.CBC = function () {
            /**
             * Abstract base CBC mode.
             */
            var CBC = BlockCipherMode.extend();
            /**
             * CBC encryptor.
             */

            CBC.Encryptor = CBC.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize; // XOR and encrypt

                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset); // Remember this block to use with next block

                this._prevBlock = words.slice(offset, offset + blockSize);
              }
            });
            /**
             * CBC decryptor.
             */

            CBC.Decryptor = CBC.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize; // Remember this block to use with next block

                var thisBlock = words.slice(offset, offset + blockSize); // Decrypt and XOR

                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize); // This block becomes the previous block

                this._prevBlock = thisBlock;
              }
            });

            function xorBlock(words, offset, blockSize) {
              var block; // Shortcut

              var iv = this._iv; // Choose mixing block

              if (iv) {
                block = iv; // Remove IV for subsequent blocks

                this._iv = undefined$1;
              } else {
                block = this._prevBlock;
              } // XOR blocks


              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
              }
            }

            return CBC;
          }();
          /**
           * Padding namespace.
           */


          var C_pad = C.pad = {};
          /**
           * PKCS #5/7 padding strategy.
           */

          var Pkcs7 = C_pad.Pkcs7 = {
            /**
             * Pads data using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to pad.
             * @param {number} blockSize The multiple that the data should be padded to.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
             */
            pad: function (data, blockSize) {
              // Shortcut
              var blockSizeBytes = blockSize * 4; // Count padding bytes

              var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Create padding word

              var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes; // Create padding

              var paddingWords = [];

              for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
              }

              var padding = WordArray.create(paddingWords, nPaddingBytes); // Add padding

              data.concat(padding);
            },

            /**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */
            unpad: function (data) {
              // Get number of padding bytes from last byte
              var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

              data.sigBytes -= nPaddingBytes;
            }
          };
          /**
           * Abstract base block cipher template.
           *
           * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
           */

          C_lib.BlockCipher = Cipher.extend({
            /**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */
            cfg: Cipher.cfg.extend({
              mode: CBC,
              padding: Pkcs7
            }),
            reset: function () {
              var modeCreator; // Reset cipher

              Cipher.reset.call(this); // Shortcuts

              var cfg = this.cfg;
              var iv = cfg.iv;
              var mode = cfg.mode; // Reset block mode

              if (this._xformMode == this._ENC_XFORM_MODE) {
                modeCreator = mode.createEncryptor;
              } else
                /* if (this._xformMode == this._DEC_XFORM_MODE) */
                {
                  modeCreator = mode.createDecryptor; // Keep at least one block in the buffer for unpadding

                  this._minBufferSize = 1;
                }

              if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
              } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
              }
            },
            _doProcessBlock: function (words, offset) {
              this._mode.processBlock(words, offset);
            },
            _doFinalize: function () {
              var finalProcessedBlocks; // Shortcut

              var padding = this.cfg.padding; // Finalize

              if (this._xformMode == this._ENC_XFORM_MODE) {
                // Pad data
                padding.pad(this._data, this.blockSize); // Process final blocks

                finalProcessedBlocks = this._process(!!'flush');
              } else
                /* if (this._xformMode == this._DEC_XFORM_MODE) */
                {
                  // Process final blocks
                  finalProcessedBlocks = this._process(!!'flush'); // Unpad data

                  padding.unpad(finalProcessedBlocks);
                }

              return finalProcessedBlocks;
            },
            blockSize: 128 / 32
          });
          /**
           * A collection of cipher parameters.
           *
           * @property {WordArray} ciphertext The raw ciphertext.
           * @property {WordArray} key The key to this ciphertext.
           * @property {WordArray} iv The IV used in the ciphering operation.
           * @property {WordArray} salt The salt used with a key derivation function.
           * @property {Cipher} algorithm The cipher algorithm.
           * @property {Mode} mode The block mode used in the ciphering operation.
           * @property {Padding} padding The padding scheme used in the ciphering operation.
           * @property {number} blockSize The block size of the cipher.
           * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
           */

          var CipherParams = C_lib.CipherParams = Base.extend({
            /**
             * Initializes a newly created cipher params object.
             *
             * @param {Object} cipherParams An object with any of the possible cipher parameters.
             *
             * @example
             *
             *     var cipherParams = CryptoJS.lib.CipherParams.create({
             *         ciphertext: ciphertextWordArray,
             *         key: keyWordArray,
             *         iv: ivWordArray,
             *         salt: saltWordArray,
             *         algorithm: CryptoJS.algo.AES,
             *         mode: CryptoJS.mode.CBC,
             *         padding: CryptoJS.pad.PKCS7,
             *         blockSize: 4,
             *         formatter: CryptoJS.format.OpenSSL
             *     });
             */
            init: function (cipherParams) {
              this.mixIn(cipherParams);
            },

            /**
             * Converts this cipher params object to a string.
             *
             * @param {Format} formatter (Optional) The formatting strategy to use.
             *
             * @return {string} The stringified cipher params.
             *
             * @throws Error If neither the formatter nor the default formatter is set.
             *
             * @example
             *
             *     var string = cipherParams + '';
             *     var string = cipherParams.toString();
             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
             */
            toString: function (formatter) {
              return (formatter || this.formatter).stringify(this);
            }
          });
          /**
           * Format namespace.
           */

          var C_format = C.format = {};
          /**
           * OpenSSL formatting strategy.
           */

          var OpenSSLFormatter = C_format.OpenSSL = {
            /**
             * Converts a cipher params object to an OpenSSL-compatible string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The OpenSSL-compatible string.
             *
             * @static
             *
             * @example
             *
             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
             */
            stringify: function (cipherParams) {
              var wordArray; // Shortcuts

              var ciphertext = cipherParams.ciphertext;
              var salt = cipherParams.salt; // Format

              if (salt) {
                wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
              } else {
                wordArray = ciphertext;
              }

              return wordArray.toString(Base64);
            },

            /**
             * Converts an OpenSSL-compatible string to a cipher params object.
             *
             * @param {string} openSSLStr The OpenSSL-compatible string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
             */
            parse: function (openSSLStr) {
              var salt; // Parse base64

              var ciphertext = Base64.parse(openSSLStr); // Shortcut

              var ciphertextWords = ciphertext.words; // Test for salt

              if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                // Extract salt
                salt = WordArray.create(ciphertextWords.slice(2, 4)); // Remove salt from ciphertext

                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
              }

              return CipherParams.create({
                ciphertext: ciphertext,
                salt: salt
              });
            }
          };
          /**
           * A cipher wrapper that returns ciphertext as a serializable cipher params object.
           */

          var SerializableCipher = C_lib.SerializableCipher = Base.extend({
            /**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */
            cfg: Base.extend({
              format: OpenSSLFormatter
            }),

            /**
             * Encrypts a message.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            encrypt: function (cipher, message, key, cfg) {
              // Apply config defaults
              cfg = this.cfg.extend(cfg); // Encrypt

              var encryptor = cipher.createEncryptor(key, cfg);
              var ciphertext = encryptor.finalize(message); // Shortcut

              var cipherCfg = encryptor.cfg; // Create and return serializable cipher params

              return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
              });
            },

            /**
             * Decrypts serialized ciphertext.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            decrypt: function (cipher, ciphertext, key, cfg) {
              // Apply config defaults
              cfg = this.cfg.extend(cfg); // Convert string to CipherParams

              ciphertext = this._parse(ciphertext, cfg.format); // Decrypt

              var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
              return plaintext;
            },

            /**
             * Converts serialized ciphertext to CipherParams,
             * else assumed CipherParams already and returns ciphertext unchanged.
             *
             * @param {CipherParams|string} ciphertext The ciphertext.
             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
             *
             * @return {CipherParams} The unserialized ciphertext.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
             */
            _parse: function (ciphertext, format) {
              if (typeof ciphertext == 'string') {
                return format.parse(ciphertext, this);
              } else {
                return ciphertext;
              }
            }
          });
          /**
           * Key derivation function namespace.
           */

          var C_kdf = C.kdf = {};
          /**
           * OpenSSL key derivation function.
           */

          var OpenSSLKdf = C_kdf.OpenSSL = {
            /**
             * Derives a key and IV from a password.
             *
             * @param {string} password The password to derive from.
             * @param {number} keySize The size in words of the key to generate.
             * @param {number} ivSize The size in words of the IV to generate.
             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
             *
             * @return {CipherParams} A cipher params object with the key, IV, and salt.
             *
             * @static
             *
             * @example
             *
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
             */
            execute: function (password, keySize, ivSize, salt, hasher) {
              // Generate random salt
              if (!salt) {
                salt = WordArray.random(64 / 8);
              } // Derive key and IV


              if (!hasher) {
                var key = EvpKDF.create({
                  keySize: keySize + ivSize
                }).compute(password, salt);
              } else {
                var key = EvpKDF.create({
                  keySize: keySize + ivSize,
                  hasher: hasher
                }).compute(password, salt);
              } // Separate key and IV


              var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
              key.sigBytes = keySize * 4; // Return params

              return CipherParams.create({
                key: key,
                iv: iv,
                salt: salt
              });
            }
          };
          /**
           * A serializable cipher wrapper that derives the key from a password,
           * and returns ciphertext as a serializable cipher params object.
           */

          var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            /**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */
            cfg: SerializableCipher.cfg.extend({
              kdf: OpenSSLKdf
            }),

            /**
             * Encrypts a message using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
             */
            encrypt: function (cipher, message, password, cfg) {
              // Apply config defaults
              cfg = this.cfg.extend(cfg); // Derive key and other params

              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher); // Add IV to config

              cfg.iv = derivedParams.iv; // Encrypt

              var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg); // Mix in derived params

              ciphertext.mixIn(derivedParams);
              return ciphertext;
            },

            /**
             * Decrypts serialized ciphertext using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
             */
            decrypt: function (cipher, ciphertext, password, cfg) {
              // Apply config defaults
              cfg = this.cfg.extend(cfg); // Convert string to CipherParams

              ciphertext = this._parse(ciphertext, cfg.format); // Derive key and other params

              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher); // Add IV to config

              cfg.iv = derivedParams.iv; // Decrypt

              var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
              return plaintext;
            }
          });
        }();
      });
    })(cipherCore$1, cipherCore$1.exports);

    return cipherCore$1.exports;
  }

  var modeCfb$1 = {exports: {}};

  var modeCfb = modeCfb$1.exports;
  var hasRequiredModeCfb;

  function requireModeCfb() {
    if (hasRequiredModeCfb) return modeCfb$1.exports;
    hasRequiredModeCfb = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(modeCfb, function (CryptoJS) {
        /**
         * Cipher Feedback block mode.
         */
        CryptoJS.mode.CFB = function () {
          var CFB = CryptoJS.lib.BlockCipherMode.extend();
          CFB.Encryptor = CFB.extend({
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher); // Remember this block to use with next block

              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CFB.Decryptor = CFB.extend({
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize; // Remember this block to use with next block

              var thisBlock = words.slice(offset, offset + blockSize);
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher); // This block becomes the previous block

              this._prevBlock = thisBlock;
            }
          });

          function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
            var keystream; // Shortcut

            var iv = this._iv; // Generate keystream

            if (iv) {
              keystream = iv.slice(0); // Remove IV for subsequent blocks

              this._iv = undefined;
            } else {
              keystream = this._prevBlock;
            }

            cipher.encryptBlock(keystream, 0); // Encrypt

            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }

          return CFB;
        }();

        return CryptoJS.mode.CFB;
      });
    })(modeCfb$1, modeCfb$1.exports);

    return modeCfb$1.exports;
  }

  var modeCtr$1 = {exports: {}};

  var modeCtr = modeCtr$1.exports;
  var hasRequiredModeCtr;

  function requireModeCtr() {
    if (hasRequiredModeCtr) return modeCtr$1.exports;
    hasRequiredModeCtr = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(modeCtr, function (CryptoJS) {
        /**
         * Counter block mode.
         */
        CryptoJS.mode.CTR = function () {
          var CTR = CryptoJS.lib.BlockCipherMode.extend();
          var Encryptor = CTR.Encryptor = CTR.extend({
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter; // Generate keystream

              if (iv) {
                counter = this._counter = iv.slice(0); // Remove IV for subsequent blocks

                this._iv = undefined;
              }

              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0); // Increment counter

              counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0; // Encrypt

              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          CTR.Decryptor = Encryptor;
          return CTR;
        }();

        return CryptoJS.mode.CTR;
      });
    })(modeCtr$1, modeCtr$1.exports);

    return modeCtr$1.exports;
  }

  var modeCtrGladman$1 = {exports: {}};

  var modeCtrGladman = modeCtrGladman$1.exports;
  var hasRequiredModeCtrGladman;

  function requireModeCtrGladman() {
    if (hasRequiredModeCtrGladman) return modeCtrGladman$1.exports;
    hasRequiredModeCtrGladman = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(modeCtrGladman, function (CryptoJS) {
        /** @preserve
         * Counter block mode compatible with  Dr Brian Gladman fileenc.c
         * derived from CryptoJS.mode.CTR
         * Jan Hruby jhruby.web@gmail.com
         */
        CryptoJS.mode.CTRGladman = function () {
          var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

          function incWord(word) {
            if ((word >> 24 & 0xff) === 0xff) {
              //overflow
              var b1 = word >> 16 & 0xff;
              var b2 = word >> 8 & 0xff;
              var b3 = word & 0xff;

              if (b1 === 0xff) // overflow b1
                {
                  b1 = 0;

                  if (b2 === 0xff) {
                    b2 = 0;

                    if (b3 === 0xff) {
                      b3 = 0;
                    } else {
                      ++b3;
                    }
                  } else {
                    ++b2;
                  }
                } else {
                ++b1;
              }

              word = 0;
              word += b1 << 16;
              word += b2 << 8;
              word += b3;
            } else {
              word += 0x01 << 24;
            }

            return word;
          }

          function incCounter(counter) {
            if ((counter[0] = incWord(counter[0])) === 0) {
              // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
              counter[1] = incWord(counter[1]);
            }

            return counter;
          }

          var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter; // Generate keystream

              if (iv) {
                counter = this._counter = iv.slice(0); // Remove IV for subsequent blocks

                this._iv = undefined;
              }

              incCounter(counter);
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0); // Encrypt

              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          CTRGladman.Decryptor = Encryptor;
          return CTRGladman;
        }();

        return CryptoJS.mode.CTRGladman;
      });
    })(modeCtrGladman$1, modeCtrGladman$1.exports);

    return modeCtrGladman$1.exports;
  }

  var modeOfb$1 = {exports: {}};

  var modeOfb = modeOfb$1.exports;
  var hasRequiredModeOfb;

  function requireModeOfb() {
    if (hasRequiredModeOfb) return modeOfb$1.exports;
    hasRequiredModeOfb = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(modeOfb, function (CryptoJS) {
        /**
         * Output Feedback block mode.
         */
        CryptoJS.mode.OFB = function () {
          var OFB = CryptoJS.lib.BlockCipherMode.extend();
          var Encryptor = OFB.Encryptor = OFB.extend({
            processBlock: function (words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var keystream = this._keystream; // Generate keystream

              if (iv) {
                keystream = this._keystream = iv.slice(0); // Remove IV for subsequent blocks

                this._iv = undefined;
              }

              cipher.encryptBlock(keystream, 0); // Encrypt

              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          OFB.Decryptor = Encryptor;
          return OFB;
        }();

        return CryptoJS.mode.OFB;
      });
    })(modeOfb$1, modeOfb$1.exports);

    return modeOfb$1.exports;
  }

  var modeEcb$1 = {exports: {}};

  var modeEcb = modeEcb$1.exports;
  var hasRequiredModeEcb;

  function requireModeEcb() {
    if (hasRequiredModeEcb) return modeEcb$1.exports;
    hasRequiredModeEcb = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(modeEcb, function (CryptoJS) {
        /**
         * Electronic Codebook block mode.
         */
        CryptoJS.mode.ECB = function () {
          var ECB = CryptoJS.lib.BlockCipherMode.extend();
          ECB.Encryptor = ECB.extend({
            processBlock: function (words, offset) {
              this._cipher.encryptBlock(words, offset);
            }
          });
          ECB.Decryptor = ECB.extend({
            processBlock: function (words, offset) {
              this._cipher.decryptBlock(words, offset);
            }
          });
          return ECB;
        }();

        return CryptoJS.mode.ECB;
      });
    })(modeEcb$1, modeEcb$1.exports);

    return modeEcb$1.exports;
  }

  var padAnsix923$1 = {exports: {}};

  var padAnsix923 = padAnsix923$1.exports;
  var hasRequiredPadAnsix923;

  function requirePadAnsix923() {
    if (hasRequiredPadAnsix923) return padAnsix923$1.exports;
    hasRequiredPadAnsix923 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(padAnsix923, function (CryptoJS) {
        /**
         * ANSI X.923 padding strategy.
         */
        CryptoJS.pad.AnsiX923 = {
          pad: function (data, blockSize) {
            // Shortcuts
            var dataSigBytes = data.sigBytes;
            var blockSizeBytes = blockSize * 4; // Count padding bytes

            var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes; // Compute last byte position

            var lastBytePos = dataSigBytes + nPaddingBytes - 1; // Pad

            data.clamp();
            data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
            data.sigBytes += nPaddingBytes;
          },
          unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Ansix923;
      });
    })(padAnsix923$1, padAnsix923$1.exports);

    return padAnsix923$1.exports;
  }

  var padIso10126$1 = {exports: {}};

  var padIso10126 = padIso10126$1.exports;
  var hasRequiredPadIso10126;

  function requirePadIso10126() {
    if (hasRequiredPadIso10126) return padIso10126$1.exports;
    hasRequiredPadIso10126 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(padIso10126, function (CryptoJS) {
        /**
         * ISO 10126 padding strategy.
         */
        CryptoJS.pad.Iso10126 = {
          pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4; // Count padding bytes

            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Pad

            data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
          },
          unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Iso10126;
      });
    })(padIso10126$1, padIso10126$1.exports);

    return padIso10126$1.exports;
  }

  var padIso97971$1 = {exports: {}};

  var padIso97971 = padIso97971$1.exports;
  var hasRequiredPadIso97971;

  function requirePadIso97971() {
    if (hasRequiredPadIso97971) return padIso97971$1.exports;
    hasRequiredPadIso97971 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(padIso97971, function (CryptoJS) {
        /**
         * ISO/IEC 9797-1 Padding Method 2.
         */
        CryptoJS.pad.Iso97971 = {
          pad: function (data, blockSize) {
            // Add 0x80 byte
            data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1)); // Zero pad the rest

            CryptoJS.pad.ZeroPadding.pad(data, blockSize);
          },
          unpad: function (data) {
            // Remove zero padding
            CryptoJS.pad.ZeroPadding.unpad(data); // Remove one more byte -- the 0x80 byte

            data.sigBytes--;
          }
        };
        return CryptoJS.pad.Iso97971;
      });
    })(padIso97971$1, padIso97971$1.exports);

    return padIso97971$1.exports;
  }

  var padZeropadding$1 = {exports: {}};

  var padZeropadding = padZeropadding$1.exports;
  var hasRequiredPadZeropadding;

  function requirePadZeropadding() {
    if (hasRequiredPadZeropadding) return padZeropadding$1.exports;
    hasRequiredPadZeropadding = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(padZeropadding, function (CryptoJS) {
        /**
         * Zero padding strategy.
         */
        CryptoJS.pad.ZeroPadding = {
          pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4; // Pad

            data.clamp();
            data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
          },
          unpad: function (data) {
            // Shortcut
            var dataWords = data.words; // Unpad

            var i = data.sigBytes - 1;

            for (var i = data.sigBytes - 1; i >= 0; i--) {
              if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff) {
                data.sigBytes = i + 1;
                break;
              }
            }
          }
        };
        return CryptoJS.pad.ZeroPadding;
      });
    })(padZeropadding$1, padZeropadding$1.exports);

    return padZeropadding$1.exports;
  }

  var padNopadding$1 = {exports: {}};

  var padNopadding = padNopadding$1.exports;
  var hasRequiredPadNopadding;

  function requirePadNopadding() {
    if (hasRequiredPadNopadding) return padNopadding$1.exports;
    hasRequiredPadNopadding = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(padNopadding, function (CryptoJS) {
        /**
         * A noop padding strategy.
         */
        CryptoJS.pad.NoPadding = {
          pad: function () {},
          unpad: function () {}
        };
        return CryptoJS.pad.NoPadding;
      });
    })(padNopadding$1, padNopadding$1.exports);

    return padNopadding$1.exports;
  }

  var formatHex$1 = {exports: {}};

  var formatHex = formatHex$1.exports;
  var hasRequiredFormatHex;

  function requireFormatHex() {
    if (hasRequiredFormatHex) return formatHex$1.exports;
    hasRequiredFormatHex = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(formatHex, function (CryptoJS) {
        (function (undefined$1) {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var CipherParams = C_lib.CipherParams;
          var C_enc = C.enc;
          var Hex = C_enc.Hex;
          var C_format = C.format;
          C_format.Hex = {
            /**
             * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The hexadecimally encoded string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
             */
            stringify: function (cipherParams) {
              return cipherParams.ciphertext.toString(Hex);
            },

            /**
             * Converts a hexadecimally encoded ciphertext string to a cipher params object.
             *
             * @param {string} input The hexadecimally encoded string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
             */
            parse: function (input) {
              var ciphertext = Hex.parse(input);
              return CipherParams.create({
                ciphertext: ciphertext
              });
            }
          };
        })();

        return CryptoJS.format.Hex;
      });
    })(formatHex$1, formatHex$1.exports);

    return formatHex$1.exports;
  }

  var aes$1 = {exports: {}};

  var aes = aes$1.exports;
  var hasRequiredAes;

  function requireAes() {
    if (hasRequiredAes) return aes$1.exports;
    hasRequiredAes = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(aes, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo; // Lookup tables

          var SBOX = [];
          var INV_SBOX = [];
          var SUB_MIX_0 = [];
          var SUB_MIX_1 = [];
          var SUB_MIX_2 = [];
          var SUB_MIX_3 = [];
          var INV_SUB_MIX_0 = [];
          var INV_SUB_MIX_1 = [];
          var INV_SUB_MIX_2 = [];
          var INV_SUB_MIX_3 = []; // Compute lookup tables

          (function () {
            // Compute double table
            var d = [];

            for (var i = 0; i < 256; i++) {
              if (i < 128) {
                d[i] = i << 1;
              } else {
                d[i] = i << 1 ^ 0x11b;
              }
            } // Walk GF(2^8)


            var x = 0;
            var xi = 0;

            for (var i = 0; i < 256; i++) {
              // Compute sbox
              var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
              sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
              SBOX[x] = sx;
              INV_SBOX[sx] = x; // Compute multiplication

              var x2 = d[x];
              var x4 = d[x2];
              var x8 = d[x4]; // Compute sub bytes, mix columns tables

              var t = d[sx] * 0x101 ^ sx * 0x1010100;
              SUB_MIX_0[x] = t << 24 | t >>> 8;
              SUB_MIX_1[x] = t << 16 | t >>> 16;
              SUB_MIX_2[x] = t << 8 | t >>> 24;
              SUB_MIX_3[x] = t; // Compute inv sub bytes, inv mix columns tables

              var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
              INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
              INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
              INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
              INV_SUB_MIX_3[sx] = t; // Compute next counter

              if (!x) {
                x = xi = 1;
              } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
              }
            }
          })(); // Precomputed Rcon lookup


          var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
          /**
           * AES block cipher algorithm.
           */

          var AES = C_algo.AES = BlockCipher.extend({
            _doReset: function () {
              var t; // Skip reset of nRounds has been set before and key did not change

              if (this._nRounds && this._keyPriorReset === this._key) {
                return;
              } // Shortcuts


              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4; // Compute number of rounds

              var nRounds = this._nRounds = keySize + 6; // Compute number of key schedule rows

              var ksRows = (nRounds + 1) * 4; // Compute key schedule

              var keySchedule = this._keySchedule = [];

              for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                  keySchedule[ksRow] = keyWords[ksRow];
                } else {
                  t = keySchedule[ksRow - 1];

                  if (!(ksRow % keySize)) {
                    // Rot word
                    t = t << 8 | t >>> 24; // Sub word

                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff]; // Mix Rcon

                    t ^= RCON[ksRow / keySize | 0] << 24;
                  } else if (keySize > 6 && ksRow % keySize == 4) {
                    // Sub word
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
                  }

                  keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
              } // Compute inv key schedule


              var invKeySchedule = this._invKeySchedule = [];

              for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;

                if (invKsRow % 4) {
                  var t = keySchedule[ksRow];
                } else {
                  var t = keySchedule[ksRow - 4];
                }

                if (invKsRow < 4 || ksRow <= 4) {
                  invKeySchedule[invKsRow] = t;
                } else {
                  invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                }
              }
            },
            encryptBlock: function (M, offset) {
              this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
            },
            decryptBlock: function (M, offset) {
              // Swap 2nd and 4th rows
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;

              this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX); // Inv swap 2nd and 4th rows


              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
            },
            _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
              // Shortcut
              var nRounds = this._nRounds; // Get input, add round key

              var s0 = M[offset] ^ keySchedule[0];
              var s1 = M[offset + 1] ^ keySchedule[1];
              var s2 = M[offset + 2] ^ keySchedule[2];
              var s3 = M[offset + 3] ^ keySchedule[3]; // Key schedule row counter

              var ksRow = 4; // Rounds

              for (var round = 1; round < nRounds; round++) {
                // Shift rows, sub bytes, mix columns, add round key
                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++]; // Update state

                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
              } // Shift rows, sub bytes, add round key


              var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
              var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
              var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
              var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]; // Set output

              M[offset] = t0;
              M[offset + 1] = t1;
              M[offset + 2] = t2;
              M[offset + 3] = t3;
            },
            keySize: 256 / 32
          });
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
           */

          C.AES = BlockCipher._createHelper(AES);
        })();

        return CryptoJS.AES;
      });
    })(aes$1, aes$1.exports);

    return aes$1.exports;
  }

  var tripledes$1 = {exports: {}};

  var tripledes = tripledes$1.exports;
  var hasRequiredTripledes;

  function requireTripledes() {
    if (hasRequiredTripledes) return tripledes$1.exports;
    hasRequiredTripledes = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(tripledes, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo; // Permuted Choice 1 constants

          var PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]; // Permuted Choice 2 constants

          var PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]; // Cumulative bit shift constants

          var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]; // SBOXes and round permutation constants

          var SBOX_P = [{
            0x0: 0x808200,
            0x10000000: 0x8000,
            0x20000000: 0x808002,
            0x30000000: 0x2,
            0x40000000: 0x200,
            0x50000000: 0x808202,
            0x60000000: 0x800202,
            0x70000000: 0x800000,
            0x80000000: 0x202,
            0x90000000: 0x800200,
            0xa0000000: 0x8200,
            0xb0000000: 0x808000,
            0xc0000000: 0x8002,
            0xd0000000: 0x800002,
            0xe0000000: 0x0,
            0xf0000000: 0x8202,
            0x8000000: 0x0,
            0x18000000: 0x808202,
            0x28000000: 0x8202,
            0x38000000: 0x8000,
            0x48000000: 0x808200,
            0x58000000: 0x200,
            0x68000000: 0x808002,
            0x78000000: 0x2,
            0x88000000: 0x800200,
            0x98000000: 0x8200,
            0xa8000000: 0x808000,
            0xb8000000: 0x800202,
            0xc8000000: 0x800002,
            0xd8000000: 0x8002,
            0xe8000000: 0x202,
            0xf8000000: 0x800000,
            0x1: 0x8000,
            0x10000001: 0x2,
            0x20000001: 0x808200,
            0x30000001: 0x800000,
            0x40000001: 0x808002,
            0x50000001: 0x8200,
            0x60000001: 0x200,
            0x70000001: 0x800202,
            0x80000001: 0x808202,
            0x90000001: 0x808000,
            0xa0000001: 0x800002,
            0xb0000001: 0x8202,
            0xc0000001: 0x202,
            0xd0000001: 0x800200,
            0xe0000001: 0x8002,
            0xf0000001: 0x0,
            0x8000001: 0x808202,
            0x18000001: 0x808000,
            0x28000001: 0x800000,
            0x38000001: 0x200,
            0x48000001: 0x8000,
            0x58000001: 0x800002,
            0x68000001: 0x2,
            0x78000001: 0x8202,
            0x88000001: 0x8002,
            0x98000001: 0x800202,
            0xa8000001: 0x202,
            0xb8000001: 0x808200,
            0xc8000001: 0x800200,
            0xd8000001: 0x0,
            0xe8000001: 0x8200,
            0xf8000001: 0x808002
          }, {
            0x0: 0x40084010,
            0x1000000: 0x4000,
            0x2000000: 0x80000,
            0x3000000: 0x40080010,
            0x4000000: 0x40000010,
            0x5000000: 0x40084000,
            0x6000000: 0x40004000,
            0x7000000: 0x10,
            0x8000000: 0x84000,
            0x9000000: 0x40004010,
            0xa000000: 0x40000000,
            0xb000000: 0x84010,
            0xc000000: 0x80010,
            0xd000000: 0x0,
            0xe000000: 0x4010,
            0xf000000: 0x40080000,
            0x800000: 0x40004000,
            0x1800000: 0x84010,
            0x2800000: 0x10,
            0x3800000: 0x40004010,
            0x4800000: 0x40084010,
            0x5800000: 0x40000000,
            0x6800000: 0x80000,
            0x7800000: 0x40080010,
            0x8800000: 0x80010,
            0x9800000: 0x0,
            0xa800000: 0x4000,
            0xb800000: 0x40080000,
            0xc800000: 0x40000010,
            0xd800000: 0x84000,
            0xe800000: 0x40084000,
            0xf800000: 0x4010,
            0x10000000: 0x0,
            0x11000000: 0x40080010,
            0x12000000: 0x40004010,
            0x13000000: 0x40084000,
            0x14000000: 0x40080000,
            0x15000000: 0x10,
            0x16000000: 0x84010,
            0x17000000: 0x4000,
            0x18000000: 0x4010,
            0x19000000: 0x80000,
            0x1a000000: 0x80010,
            0x1b000000: 0x40000010,
            0x1c000000: 0x84000,
            0x1d000000: 0x40004000,
            0x1e000000: 0x40000000,
            0x1f000000: 0x40084010,
            0x10800000: 0x84010,
            0x11800000: 0x80000,
            0x12800000: 0x40080000,
            0x13800000: 0x4000,
            0x14800000: 0x40004000,
            0x15800000: 0x40084010,
            0x16800000: 0x10,
            0x17800000: 0x40000000,
            0x18800000: 0x40084000,
            0x19800000: 0x40000010,
            0x1a800000: 0x40004010,
            0x1b800000: 0x80010,
            0x1c800000: 0x0,
            0x1d800000: 0x4010,
            0x1e800000: 0x40080010,
            0x1f800000: 0x84000
          }, {
            0x0: 0x104,
            0x100000: 0x0,
            0x200000: 0x4000100,
            0x300000: 0x10104,
            0x400000: 0x10004,
            0x500000: 0x4000004,
            0x600000: 0x4010104,
            0x700000: 0x4010000,
            0x800000: 0x4000000,
            0x900000: 0x4010100,
            0xa00000: 0x10100,
            0xb00000: 0x4010004,
            0xc00000: 0x4000104,
            0xd00000: 0x10000,
            0xe00000: 0x4,
            0xf00000: 0x100,
            0x80000: 0x4010100,
            0x180000: 0x4010004,
            0x280000: 0x0,
            0x380000: 0x4000100,
            0x480000: 0x4000004,
            0x580000: 0x10000,
            0x680000: 0x10004,
            0x780000: 0x104,
            0x880000: 0x4,
            0x980000: 0x100,
            0xa80000: 0x4010000,
            0xb80000: 0x10104,
            0xc80000: 0x10100,
            0xd80000: 0x4000104,
            0xe80000: 0x4010104,
            0xf80000: 0x4000000,
            0x1000000: 0x4010100,
            0x1100000: 0x10004,
            0x1200000: 0x10000,
            0x1300000: 0x4000100,
            0x1400000: 0x100,
            0x1500000: 0x4010104,
            0x1600000: 0x4000004,
            0x1700000: 0x0,
            0x1800000: 0x4000104,
            0x1900000: 0x4000000,
            0x1a00000: 0x4,
            0x1b00000: 0x10100,
            0x1c00000: 0x4010000,
            0x1d00000: 0x104,
            0x1e00000: 0x10104,
            0x1f00000: 0x4010004,
            0x1080000: 0x4000000,
            0x1180000: 0x104,
            0x1280000: 0x4010100,
            0x1380000: 0x0,
            0x1480000: 0x10004,
            0x1580000: 0x4000100,
            0x1680000: 0x100,
            0x1780000: 0x4010004,
            0x1880000: 0x10000,
            0x1980000: 0x4010104,
            0x1a80000: 0x10104,
            0x1b80000: 0x4000004,
            0x1c80000: 0x4000104,
            0x1d80000: 0x4010000,
            0x1e80000: 0x4,
            0x1f80000: 0x10100
          }, {
            0x0: 0x80401000,
            0x10000: 0x80001040,
            0x20000: 0x401040,
            0x30000: 0x80400000,
            0x40000: 0x0,
            0x50000: 0x401000,
            0x60000: 0x80000040,
            0x70000: 0x400040,
            0x80000: 0x80000000,
            0x90000: 0x400000,
            0xa0000: 0x40,
            0xb0000: 0x80001000,
            0xc0000: 0x80400040,
            0xd0000: 0x1040,
            0xe0000: 0x1000,
            0xf0000: 0x80401040,
            0x8000: 0x80001040,
            0x18000: 0x40,
            0x28000: 0x80400040,
            0x38000: 0x80001000,
            0x48000: 0x401000,
            0x58000: 0x80401040,
            0x68000: 0x0,
            0x78000: 0x80400000,
            0x88000: 0x1000,
            0x98000: 0x80401000,
            0xa8000: 0x400000,
            0xb8000: 0x1040,
            0xc8000: 0x80000000,
            0xd8000: 0x400040,
            0xe8000: 0x401040,
            0xf8000: 0x80000040,
            0x100000: 0x400040,
            0x110000: 0x401000,
            0x120000: 0x80000040,
            0x130000: 0x0,
            0x140000: 0x1040,
            0x150000: 0x80400040,
            0x160000: 0x80401000,
            0x170000: 0x80001040,
            0x180000: 0x80401040,
            0x190000: 0x80000000,
            0x1a0000: 0x80400000,
            0x1b0000: 0x401040,
            0x1c0000: 0x80001000,
            0x1d0000: 0x400000,
            0x1e0000: 0x40,
            0x1f0000: 0x1000,
            0x108000: 0x80400000,
            0x118000: 0x80401040,
            0x128000: 0x0,
            0x138000: 0x401000,
            0x148000: 0x400040,
            0x158000: 0x80000000,
            0x168000: 0x80001040,
            0x178000: 0x40,
            0x188000: 0x80000040,
            0x198000: 0x1000,
            0x1a8000: 0x80001000,
            0x1b8000: 0x80400040,
            0x1c8000: 0x1040,
            0x1d8000: 0x80401000,
            0x1e8000: 0x400000,
            0x1f8000: 0x401040
          }, {
            0x0: 0x80,
            0x1000: 0x1040000,
            0x2000: 0x40000,
            0x3000: 0x20000000,
            0x4000: 0x20040080,
            0x5000: 0x1000080,
            0x6000: 0x21000080,
            0x7000: 0x40080,
            0x8000: 0x1000000,
            0x9000: 0x20040000,
            0xa000: 0x20000080,
            0xb000: 0x21040080,
            0xc000: 0x21040000,
            0xd000: 0x0,
            0xe000: 0x1040080,
            0xf000: 0x21000000,
            0x800: 0x1040080,
            0x1800: 0x21000080,
            0x2800: 0x80,
            0x3800: 0x1040000,
            0x4800: 0x40000,
            0x5800: 0x20040080,
            0x6800: 0x21040000,
            0x7800: 0x20000000,
            0x8800: 0x20040000,
            0x9800: 0x0,
            0xa800: 0x21040080,
            0xb800: 0x1000080,
            0xc800: 0x20000080,
            0xd800: 0x21000000,
            0xe800: 0x1000000,
            0xf800: 0x40080,
            0x10000: 0x40000,
            0x11000: 0x80,
            0x12000: 0x20000000,
            0x13000: 0x21000080,
            0x14000: 0x1000080,
            0x15000: 0x21040000,
            0x16000: 0x20040080,
            0x17000: 0x1000000,
            0x18000: 0x21040080,
            0x19000: 0x21000000,
            0x1a000: 0x1040000,
            0x1b000: 0x20040000,
            0x1c000: 0x40080,
            0x1d000: 0x20000080,
            0x1e000: 0x0,
            0x1f000: 0x1040080,
            0x10800: 0x21000080,
            0x11800: 0x1000000,
            0x12800: 0x1040000,
            0x13800: 0x20040080,
            0x14800: 0x20000000,
            0x15800: 0x1040080,
            0x16800: 0x80,
            0x17800: 0x21040000,
            0x18800: 0x40080,
            0x19800: 0x21040080,
            0x1a800: 0x0,
            0x1b800: 0x21000000,
            0x1c800: 0x1000080,
            0x1d800: 0x40000,
            0x1e800: 0x20040000,
            0x1f800: 0x20000080
          }, {
            0x0: 0x10000008,
            0x100: 0x2000,
            0x200: 0x10200000,
            0x300: 0x10202008,
            0x400: 0x10002000,
            0x500: 0x200000,
            0x600: 0x200008,
            0x700: 0x10000000,
            0x800: 0x0,
            0x900: 0x10002008,
            0xa00: 0x202000,
            0xb00: 0x8,
            0xc00: 0x10200008,
            0xd00: 0x202008,
            0xe00: 0x2008,
            0xf00: 0x10202000,
            0x80: 0x10200000,
            0x180: 0x10202008,
            0x280: 0x8,
            0x380: 0x200000,
            0x480: 0x202008,
            0x580: 0x10000008,
            0x680: 0x10002000,
            0x780: 0x2008,
            0x880: 0x200008,
            0x980: 0x2000,
            0xa80: 0x10002008,
            0xb80: 0x10200008,
            0xc80: 0x0,
            0xd80: 0x10202000,
            0xe80: 0x202000,
            0xf80: 0x10000000,
            0x1000: 0x10002000,
            0x1100: 0x10200008,
            0x1200: 0x10202008,
            0x1300: 0x2008,
            0x1400: 0x200000,
            0x1500: 0x10000000,
            0x1600: 0x10000008,
            0x1700: 0x202000,
            0x1800: 0x202008,
            0x1900: 0x0,
            0x1a00: 0x8,
            0x1b00: 0x10200000,
            0x1c00: 0x2000,
            0x1d00: 0x10002008,
            0x1e00: 0x10202000,
            0x1f00: 0x200008,
            0x1080: 0x8,
            0x1180: 0x202000,
            0x1280: 0x200000,
            0x1380: 0x10000008,
            0x1480: 0x10002000,
            0x1580: 0x2008,
            0x1680: 0x10202008,
            0x1780: 0x10200000,
            0x1880: 0x10202000,
            0x1980: 0x10200008,
            0x1a80: 0x2000,
            0x1b80: 0x202008,
            0x1c80: 0x200008,
            0x1d80: 0x0,
            0x1e80: 0x10000000,
            0x1f80: 0x10002008
          }, {
            0x0: 0x100000,
            0x10: 0x2000401,
            0x20: 0x400,
            0x30: 0x100401,
            0x40: 0x2100401,
            0x50: 0x0,
            0x60: 0x1,
            0x70: 0x2100001,
            0x80: 0x2000400,
            0x90: 0x100001,
            0xa0: 0x2000001,
            0xb0: 0x2100400,
            0xc0: 0x2100000,
            0xd0: 0x401,
            0xe0: 0x100400,
            0xf0: 0x2000000,
            0x8: 0x2100001,
            0x18: 0x0,
            0x28: 0x2000401,
            0x38: 0x2100400,
            0x48: 0x100000,
            0x58: 0x2000001,
            0x68: 0x2000000,
            0x78: 0x401,
            0x88: 0x100401,
            0x98: 0x2000400,
            0xa8: 0x2100000,
            0xb8: 0x100001,
            0xc8: 0x400,
            0xd8: 0x2100401,
            0xe8: 0x1,
            0xf8: 0x100400,
            0x100: 0x2000000,
            0x110: 0x100000,
            0x120: 0x2000401,
            0x130: 0x2100001,
            0x140: 0x100001,
            0x150: 0x2000400,
            0x160: 0x2100400,
            0x170: 0x100401,
            0x180: 0x401,
            0x190: 0x2100401,
            0x1a0: 0x100400,
            0x1b0: 0x1,
            0x1c0: 0x0,
            0x1d0: 0x2100000,
            0x1e0: 0x2000001,
            0x1f0: 0x400,
            0x108: 0x100400,
            0x118: 0x2000401,
            0x128: 0x2100001,
            0x138: 0x1,
            0x148: 0x2000000,
            0x158: 0x100000,
            0x168: 0x401,
            0x178: 0x2100400,
            0x188: 0x2000001,
            0x198: 0x2100000,
            0x1a8: 0x0,
            0x1b8: 0x2100401,
            0x1c8: 0x100401,
            0x1d8: 0x400,
            0x1e8: 0x2000400,
            0x1f8: 0x100001
          }, {
            0x0: 0x8000820,
            0x1: 0x20000,
            0x2: 0x8000000,
            0x3: 0x20,
            0x4: 0x20020,
            0x5: 0x8020820,
            0x6: 0x8020800,
            0x7: 0x800,
            0x8: 0x8020000,
            0x9: 0x8000800,
            0xa: 0x20800,
            0xb: 0x8020020,
            0xc: 0x820,
            0xd: 0x0,
            0xe: 0x8000020,
            0xf: 0x20820,
            0x80000000: 0x800,
            0x80000001: 0x8020820,
            0x80000002: 0x8000820,
            0x80000003: 0x8000000,
            0x80000004: 0x8020000,
            0x80000005: 0x20800,
            0x80000006: 0x20820,
            0x80000007: 0x20,
            0x80000008: 0x8000020,
            0x80000009: 0x820,
            0x8000000a: 0x20020,
            0x8000000b: 0x8020800,
            0x8000000c: 0x0,
            0x8000000d: 0x8020020,
            0x8000000e: 0x8000800,
            0x8000000f: 0x20000,
            0x10: 0x20820,
            0x11: 0x8020800,
            0x12: 0x20,
            0x13: 0x800,
            0x14: 0x8000800,
            0x15: 0x8000020,
            0x16: 0x8020020,
            0x17: 0x20000,
            0x18: 0x0,
            0x19: 0x20020,
            0x1a: 0x8020000,
            0x1b: 0x8000820,
            0x1c: 0x8020820,
            0x1d: 0x20800,
            0x1e: 0x820,
            0x1f: 0x8000000,
            0x80000010: 0x20000,
            0x80000011: 0x800,
            0x80000012: 0x8020020,
            0x80000013: 0x20820,
            0x80000014: 0x20,
            0x80000015: 0x8020000,
            0x80000016: 0x8000000,
            0x80000017: 0x8000820,
            0x80000018: 0x8020820,
            0x80000019: 0x8000020,
            0x8000001a: 0x8000800,
            0x8000001b: 0x0,
            0x8000001c: 0x20800,
            0x8000001d: 0x820,
            0x8000001e: 0x20020,
            0x8000001f: 0x8020800
          }]; // Masks that select the SBOX input

          var SBOX_MASK = [0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000, 0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f];
          /**
           * DES block cipher algorithm.
           */

          var DES = C_algo.DES = BlockCipher.extend({
            _doReset: function () {
              // Shortcuts
              var key = this._key;
              var keyWords = key.words; // Select 56 bits according to PC1

              var keyBits = [];

              for (var i = 0; i < 56; i++) {
                var keyBitPos = PC1[i] - 1;
                keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
              } // Assemble 16 subkeys


              var subKeys = this._subKeys = [];

              for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                // Create subkey
                var subKey = subKeys[nSubKey] = []; // Shortcut

                var bitShift = BIT_SHIFTS[nSubKey]; // Select 48 bits according to PC2

                for (var i = 0; i < 24; i++) {
                  // Select from the left 28 key bits
                  subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6; // Select from the right 28 key bits

                  subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
                } // Since each subkey is applied to an expanded 32-bit input,
                // the subkey can be broken into 8 values scaled to 32-bits,
                // which allows the key to be used without expansion


                subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;

                for (var i = 1; i < 7; i++) {
                  subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
                }

                subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
              } // Compute inverse subkeys


              var invSubKeys = this._invSubKeys = [];

              for (var i = 0; i < 16; i++) {
                invSubKeys[i] = subKeys[15 - i];
              }
            },
            encryptBlock: function (M, offset) {
              this._doCryptBlock(M, offset, this._subKeys);
            },
            decryptBlock: function (M, offset) {
              this._doCryptBlock(M, offset, this._invSubKeys);
            },
            _doCryptBlock: function (M, offset, subKeys) {
              // Get input
              this._lBlock = M[offset];
              this._rBlock = M[offset + 1]; // Initial permutation

              exchangeLR.call(this, 4, 0x0f0f0f0f);
              exchangeLR.call(this, 16, 0x0000ffff);
              exchangeRL.call(this, 2, 0x33333333);
              exchangeRL.call(this, 8, 0x00ff00ff);
              exchangeLR.call(this, 1, 0x55555555); // Rounds

              for (var round = 0; round < 16; round++) {
                // Shortcuts
                var subKey = subKeys[round];
                var lBlock = this._lBlock;
                var rBlock = this._rBlock; // Feistel function

                var f = 0;

                for (var i = 0; i < 8; i++) {
                  f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                }

                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f;
              } // Undo swap from last round


              var t = this._lBlock;
              this._lBlock = this._rBlock;
              this._rBlock = t; // Final permutation

              exchangeLR.call(this, 1, 0x55555555);
              exchangeRL.call(this, 8, 0x00ff00ff);
              exchangeRL.call(this, 2, 0x33333333);
              exchangeLR.call(this, 16, 0x0000ffff);
              exchangeLR.call(this, 4, 0x0f0f0f0f); // Set output

              M[offset] = this._lBlock;
              M[offset + 1] = this._rBlock;
            },
            keySize: 64 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          }); // Swap bits across the left and right words

          function exchangeLR(offset, mask) {
            var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
            this._rBlock ^= t;
            this._lBlock ^= t << offset;
          }

          function exchangeRL(offset, mask) {
            var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
            this._lBlock ^= t;
            this._rBlock ^= t << offset;
          }
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
           */


          C.DES = BlockCipher._createHelper(DES);
          /**
           * Triple-DES block cipher algorithm.
           */

          var TripleDES = C_algo.TripleDES = BlockCipher.extend({
            _doReset: function () {
              // Shortcuts
              var key = this._key;
              var keyWords = key.words; // Make sure the key length is valid (64, 128 or >= 192 bit)

              if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
                throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
              } // Extend the key according to the keying options defined in 3DES standard


              var key1 = keyWords.slice(0, 2);
              var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
              var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6); // Create DES instances

              this._des1 = DES.createEncryptor(WordArray.create(key1));
              this._des2 = DES.createEncryptor(WordArray.create(key2));
              this._des3 = DES.createEncryptor(WordArray.create(key3));
            },
            encryptBlock: function (M, offset) {
              this._des1.encryptBlock(M, offset);

              this._des2.decryptBlock(M, offset);

              this._des3.encryptBlock(M, offset);
            },
            decryptBlock: function (M, offset) {
              this._des3.decryptBlock(M, offset);

              this._des2.encryptBlock(M, offset);

              this._des1.decryptBlock(M, offset);
            },
            keySize: 192 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
           */

          C.TripleDES = BlockCipher._createHelper(TripleDES);
        })();

        return CryptoJS.TripleDES;
      });
    })(tripledes$1, tripledes$1.exports);

    return tripledes$1.exports;
  }

  var rc4$1 = {exports: {}};

  var rc4 = rc4$1.exports;
  var hasRequiredRc4;

  function requireRc4() {
    if (hasRequiredRc4) return rc4$1.exports;
    hasRequiredRc4 = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(rc4, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          /**
           * RC4 stream cipher algorithm.
           */

          var RC4 = C_algo.RC4 = StreamCipher.extend({
            _doReset: function () {
              // Shortcuts
              var key = this._key;
              var keyWords = key.words;
              var keySigBytes = key.sigBytes; // Init sbox

              var S = this._S = [];

              for (var i = 0; i < 256; i++) {
                S[i] = i;
              } // Key setup


              for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 0xff;
                j = (j + S[i] + keyByte) % 256; // Swap

                var t = S[i];
                S[i] = S[j];
                S[j] = t;
              } // Counters


              this._i = this._j = 0;
            },
            _doProcessBlock: function (M, offset) {
              M[offset] ^= generateKeystreamWord.call(this);
            },
            keySize: 256 / 32,
            ivSize: 0
          });

          function generateKeystreamWord() {
            // Shortcuts
            var S = this._S;
            var i = this._i;
            var j = this._j; // Generate keystream word

            var keystreamWord = 0;

            for (var n = 0; n < 4; n++) {
              i = (i + 1) % 256;
              j = (j + S[i]) % 256; // Swap

              var t = S[i];
              S[i] = S[j];
              S[j] = t;
              keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
            } // Update counters


            this._i = i;
            this._j = j;
            return keystreamWord;
          }
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
           */


          C.RC4 = StreamCipher._createHelper(RC4);
          /**
           * Modified RC4 stream cipher algorithm.
           */

          var RC4Drop = C_algo.RC4Drop = RC4.extend({
            /**
             * Configuration options.
             *
             * @property {number} drop The number of keystream words to drop. Default 192
             */
            cfg: RC4.cfg.extend({
              drop: 192
            }),
            _doReset: function () {
              RC4._doReset.call(this); // Drop


              for (var i = this.cfg.drop; i > 0; i--) {
                generateKeystreamWord.call(this);
              }
            }
          });
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
           */

          C.RC4Drop = StreamCipher._createHelper(RC4Drop);
        })();

        return CryptoJS.RC4;
      });
    })(rc4$1, rc4$1.exports);

    return rc4$1.exports;
  }

  var rabbit$1 = {exports: {}};

  var rabbit = rabbit$1.exports;
  var hasRequiredRabbit;

  function requireRabbit() {
    if (hasRequiredRabbit) return rabbit$1.exports;
    hasRequiredRabbit = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(rabbit, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo; // Reusable objects

          var S = [];
          var C_ = [];
          var G = [];
          /**
           * Rabbit stream cipher algorithm
           */

          var Rabbit = C_algo.Rabbit = StreamCipher.extend({
            _doReset: function () {
              // Shortcuts
              var K = this._key.words;
              var iv = this.cfg.iv; // Swap endian

              for (var i = 0; i < 4; i++) {
                K[i] = (K[i] << 8 | K[i] >>> 24) & 0x00ff00ff | (K[i] << 24 | K[i] >>> 8) & 0xff00ff00;
              } // Generate initial state values


              var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16]; // Generate initial counter values

              var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff]; // Carry bit

              this._b = 0; // Iterate the system four times

              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              } // Modify the counters


              for (var i = 0; i < 8; i++) {
                C[i] ^= X[i + 4 & 7];
              } // IV setup


              if (iv) {
                // Shortcuts
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1]; // Generate four subvectors

                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
                var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
                var i1 = i0 >>> 16 | i2 & 0xffff0000;
                var i3 = i2 << 16 | i0 & 0x0000ffff; // Modify counter values

                C[0] ^= i0;
                C[1] ^= i1;
                C[2] ^= i2;
                C[3] ^= i3;
                C[4] ^= i0;
                C[5] ^= i1;
                C[6] ^= i2;
                C[7] ^= i3; // Iterate the system four times

                for (var i = 0; i < 4; i++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function (M, offset) {
              // Shortcut
              var X = this._X; // Iterate the system

              nextState.call(this); // Generate four keystream words

              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

              for (var i = 0; i < 4; i++) {
                // Swap endian
                S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00; // Encrypt

                M[offset + i] ^= S[i];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });

          function nextState() {
            // Shortcuts
            var X = this._X;
            var C = this._C; // Save old counter values

            for (var i = 0; i < 8; i++) {
              C_[i] = C[i];
            } // Calculate new counter values


            C[0] = C[0] + 0x4d34d34d + this._b | 0;
            C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0; // Calculate the g-values

            for (var i = 0; i < 8; i++) {
              var gx = X[i] + C[i]; // Construct high and low argument for squaring

              var ga = gx & 0xffff;
              var gb = gx >>> 16; // Calculate high and low result of squaring

              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0); // High XOR low

              G[i] = gh ^ gl;
            } // Calculate new state values


            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
           */


          C.Rabbit = StreamCipher._createHelper(Rabbit);
        })();

        return CryptoJS.Rabbit;
      });
    })(rabbit$1, rabbit$1.exports);

    return rabbit$1.exports;
  }

  var rabbitLegacy$1 = {exports: {}};

  var rabbitLegacy = rabbitLegacy$1.exports;
  var hasRequiredRabbitLegacy;

  function requireRabbitLegacy() {
    if (hasRequiredRabbitLegacy) return rabbitLegacy$1.exports;
    hasRequiredRabbitLegacy = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(rabbitLegacy, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo; // Reusable objects

          var S = [];
          var C_ = [];
          var G = [];
          /**
           * Rabbit stream cipher algorithm.
           *
           * This is a legacy version that neglected to convert the key to little-endian.
           * This error doesn't affect the cipher's security,
           * but it does affect its compatibility with other implementations.
           */

          var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
            _doReset: function () {
              // Shortcuts
              var K = this._key.words;
              var iv = this.cfg.iv; // Generate initial state values

              var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16]; // Generate initial counter values

              var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff]; // Carry bit

              this._b = 0; // Iterate the system four times

              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              } // Modify the counters


              for (var i = 0; i < 8; i++) {
                C[i] ^= X[i + 4 & 7];
              } // IV setup


              if (iv) {
                // Shortcuts
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1]; // Generate four subvectors

                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
                var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
                var i1 = i0 >>> 16 | i2 & 0xffff0000;
                var i3 = i2 << 16 | i0 & 0x0000ffff; // Modify counter values

                C[0] ^= i0;
                C[1] ^= i1;
                C[2] ^= i2;
                C[3] ^= i3;
                C[4] ^= i0;
                C[5] ^= i1;
                C[6] ^= i2;
                C[7] ^= i3; // Iterate the system four times

                for (var i = 0; i < 4; i++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function (M, offset) {
              // Shortcut
              var X = this._X; // Iterate the system

              nextState.call(this); // Generate four keystream words

              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

              for (var i = 0; i < 4; i++) {
                // Swap endian
                S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00; // Encrypt

                M[offset + i] ^= S[i];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });

          function nextState() {
            // Shortcuts
            var X = this._X;
            var C = this._C; // Save old counter values

            for (var i = 0; i < 8; i++) {
              C_[i] = C[i];
            } // Calculate new counter values


            C[0] = C[0] + 0x4d34d34d + this._b | 0;
            C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0; // Calculate the g-values

            for (var i = 0; i < 8; i++) {
              var gx = X[i] + C[i]; // Construct high and low argument for squaring

              var ga = gx & 0xffff;
              var gb = gx >>> 16; // Calculate high and low result of squaring

              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0); // High XOR low

              G[i] = gh ^ gl;
            } // Calculate new state values


            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
           */


          C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
        })();

        return CryptoJS.RabbitLegacy;
      });
    })(rabbitLegacy$1, rabbitLegacy$1.exports);

    return rabbitLegacy$1.exports;
  }

  var blowfish$1 = {exports: {}};

  var blowfish = blowfish$1.exports;
  var hasRequiredBlowfish;

  function requireBlowfish() {
    if (hasRequiredBlowfish) return blowfish$1.exports;
    hasRequiredBlowfish = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(blowfish, function (CryptoJS) {
        (function () {
          // Shortcuts
          var C = CryptoJS;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          const N = 16; //Origin pbox and sbox, derived from PI

          const ORIG_P = [0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344, 0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89, 0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C, 0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917, 0x9216D5D9, 0x8979FB1B];
          const ORIG_S = [[0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7, 0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99, 0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16, 0x636920D8, 0x71574E69, 0xA458FEA3, 0xF4933D7E, 0x0D95748F, 0x728EB658, 0x718BCD58, 0x82154AEE, 0x7B54A41D, 0xC25A59B5, 0x9C30D539, 0x2AF26013, 0xC5D1B023, 0x286085F0, 0xCA417918, 0xB8DB38EF, 0x8E79DCB0, 0x603A180E, 0x6C9E0E8B, 0xB01E8A3E, 0xD71577C1, 0xBD314B27, 0x78AF2FDA, 0x55605C60, 0xE65525F3, 0xAA55AB94, 0x57489862, 0x63E81440, 0x55CA396A, 0x2AAB10B6, 0xB4CC5C34, 0x1141E8CE, 0xA15486AF, 0x7C72E993, 0xB3EE1411, 0x636FBC2A, 0x2BA9C55D, 0x741831F6, 0xCE5C3E16, 0x9B87931E, 0xAFD6BA33, 0x6C24CF5C, 0x7A325381, 0x28958677, 0x3B8F4898, 0x6B4BB9AF, 0xC4BFE81B, 0x66282193, 0x61D809CC, 0xFB21A991, 0x487CAC60, 0x5DEC8032, 0xEF845D5D, 0xE98575B1, 0xDC262302, 0xEB651B88, 0x23893E81, 0xD396ACC5, 0x0F6D6FF3, 0x83F44239, 0x2E0B4482, 0xA4842004, 0x69C8F04A, 0x9E1F9B5E, 0x21C66842, 0xF6E96C9A, 0x670C9C61, 0xABD388F0, 0x6A51A0D2, 0xD8542F68, 0x960FA728, 0xAB5133A3, 0x6EEF0B6C, 0x137A3BE4, 0xBA3BF050, 0x7EFB2A98, 0xA1F1651D, 0x39AF0176, 0x66CA593E, 0x82430E88, 0x8CEE8619, 0x456F9FB4, 0x7D84A5C3, 0x3B8B5EBE, 0xE06F75D8, 0x85C12073, 0x401A449F, 0x56C16AA6, 0x4ED3AA62, 0x363F7706, 0x1BFEDF72, 0x429B023D, 0x37D0D724, 0xD00A1248, 0xDB0FEAD3, 0x49F1C09B, 0x075372C9, 0x80991B7B, 0x25D479D8, 0xF6E8DEF7, 0xE3FE501A, 0xB6794C3B, 0x976CE0BD, 0x04C006BA, 0xC1A94FB6, 0x409F60C4, 0x5E5C9EC2, 0x196A2463, 0x68FB6FAF, 0x3E6C53B5, 0x1339B2EB, 0x3B52EC6F, 0x6DFC511F, 0x9B30952C, 0xCC814544, 0xAF5EBD09, 0xBEE3D004, 0xDE334AFD, 0x660F2807, 0x192E4BB3, 0xC0CBA857, 0x45C8740F, 0xD20B5F39, 0xB9D3FBDB, 0x5579C0BD, 0x1A60320A, 0xD6A100C6, 0x402C7279, 0x679F25FE, 0xFB1FA3CC, 0x8EA5E9F8, 0xDB3222F8, 0x3C7516DF, 0xFD616B15, 0x2F501EC8, 0xAD0552AB, 0x323DB5FA, 0xFD238760, 0x53317B48, 0x3E00DF82, 0x9E5C57BB, 0xCA6F8CA0, 0x1A87562E, 0xDF1769DB, 0xD542A8F6, 0x287EFFC3, 0xAC6732C6, 0x8C4F5573, 0x695B27B0, 0xBBCA58C8, 0xE1FFA35D, 0xB8F011A0, 0x10FA3D98, 0xFD2183B8, 0x4AFCB56C, 0x2DD1D35B, 0x9A53E479, 0xB6F84565, 0xD28E49BC, 0x4BFB9790, 0xE1DDF2DA, 0xA4CB7E33, 0x62FB1341, 0xCEE4C6E8, 0xEF20CADA, 0x36774C01, 0xD07E9EFE, 0x2BF11FB4, 0x95DBDA4D, 0xAE909198, 0xEAAD8E71, 0x6B93D5A0, 0xD08ED1D0, 0xAFC725E0, 0x8E3C5B2F, 0x8E7594B7, 0x8FF6E2FB, 0xF2122B64, 0x8888B812, 0x900DF01C, 0x4FAD5EA0, 0x688FC31C, 0xD1CFF191, 0xB3A8C1AD, 0x2F2F2218, 0xBE0E1777, 0xEA752DFE, 0x8B021FA1, 0xE5A0CC0F, 0xB56F74E8, 0x18ACF3D6, 0xCE89E299, 0xB4A84FE0, 0xFD13E0B7, 0x7CC43B81, 0xD2ADA8D9, 0x165FA266, 0x80957705, 0x93CC7314, 0x211A1477, 0xE6AD2065, 0x77B5FA86, 0xC75442F5, 0xFB9D35CF, 0xEBCDAF0C, 0x7B3E89A0, 0xD6411BD3, 0xAE1E7E49, 0x00250E2D, 0x2071B35E, 0x226800BB, 0x57B8E0AF, 0x2464369B, 0xF009B91E, 0x5563911D, 0x59DFA6AA, 0x78C14389, 0xD95A537F, 0x207D5BA2, 0x02E5B9C5, 0x83260376, 0x6295CFA9, 0x11C81968, 0x4E734A41, 0xB3472DCA, 0x7B14A94A, 0x1B510052, 0x9A532915, 0xD60F573F, 0xBC9BC6E4, 0x2B60A476, 0x81E67400, 0x08BA6FB5, 0x571BE91F, 0xF296EC6B, 0x2A0DD915, 0xB6636521, 0xE7B9F9B6, 0xFF34052E, 0xC5855664, 0x53B02D5D, 0xA99F8FA1, 0x08BA4799, 0x6E85076A], [0x4B7A70E9, 0xB5B32944, 0xDB75092E, 0xC4192623, 0xAD6EA6B0, 0x49A7DF7D, 0x9CEE60B8, 0x8FEDB266, 0xECAA8C71, 0x699A17FF, 0x5664526C, 0xC2B19EE1, 0x193602A5, 0x75094C29, 0xA0591340, 0xE4183A3E, 0x3F54989A, 0x5B429D65, 0x6B8FE4D6, 0x99F73FD6, 0xA1D29C07, 0xEFE830F5, 0x4D2D38E6, 0xF0255DC1, 0x4CDD2086, 0x8470EB26, 0x6382E9C6, 0x021ECC5E, 0x09686B3F, 0x3EBAEFC9, 0x3C971814, 0x6B6A70A1, 0x687F3584, 0x52A0E286, 0xB79C5305, 0xAA500737, 0x3E07841C, 0x7FDEAE5C, 0x8E7D44EC, 0x5716F2B8, 0xB03ADA37, 0xF0500C0D, 0xF01C1F04, 0x0200B3FF, 0xAE0CF51A, 0x3CB574B2, 0x25837A58, 0xDC0921BD, 0xD19113F9, 0x7CA92FF6, 0x94324773, 0x22F54701, 0x3AE5E581, 0x37C2DADC, 0xC8B57634, 0x9AF3DDA7, 0xA9446146, 0x0FD0030E, 0xECC8C73E, 0xA4751E41, 0xE238CD99, 0x3BEA0E2F, 0x3280BBA1, 0x183EB331, 0x4E548B38, 0x4F6DB908, 0x6F420D03, 0xF60A04BF, 0x2CB81290, 0x24977C79, 0x5679B072, 0xBCAF89AF, 0xDE9A771F, 0xD9930810, 0xB38BAE12, 0xDCCF3F2E, 0x5512721F, 0x2E6B7124, 0x501ADDE6, 0x9F84CD87, 0x7A584718, 0x7408DA17, 0xBC9F9ABC, 0xE94B7D8C, 0xEC7AEC3A, 0xDB851DFA, 0x63094366, 0xC464C3D2, 0xEF1C1847, 0x3215D908, 0xDD433B37, 0x24C2BA16, 0x12A14D43, 0x2A65C451, 0x50940002, 0x133AE4DD, 0x71DFF89E, 0x10314E55, 0x81AC77D6, 0x5F11199B, 0x043556F1, 0xD7A3C76B, 0x3C11183B, 0x5924A509, 0xF28FE6ED, 0x97F1FBFA, 0x9EBABF2C, 0x1E153C6E, 0x86E34570, 0xEAE96FB1, 0x860E5E0A, 0x5A3E2AB3, 0x771FE71C, 0x4E3D06FA, 0x2965DCB9, 0x99E71D0F, 0x803E89D6, 0x5266C825, 0x2E4CC978, 0x9C10B36A, 0xC6150EBA, 0x94E2EA78, 0xA5FC3C53, 0x1E0A2DF4, 0xF2F74EA7, 0x361D2B3D, 0x1939260F, 0x19C27960, 0x5223A708, 0xF71312B6, 0xEBADFE6E, 0xEAC31F66, 0xE3BC4595, 0xA67BC883, 0xB17F37D1, 0x018CFF28, 0xC332DDEF, 0xBE6C5AA5, 0x65582185, 0x68AB9802, 0xEECEA50F, 0xDB2F953B, 0x2AEF7DAD, 0x5B6E2F84, 0x1521B628, 0x29076170, 0xECDD4775, 0x619F1510, 0x13CCA830, 0xEB61BD96, 0x0334FE1E, 0xAA0363CF, 0xB5735C90, 0x4C70A239, 0xD59E9E0B, 0xCBAADE14, 0xEECC86BC, 0x60622CA7, 0x9CAB5CAB, 0xB2F3846E, 0x648B1EAF, 0x19BDF0CA, 0xA02369B9, 0x655ABB50, 0x40685A32, 0x3C2AB4B3, 0x319EE9D5, 0xC021B8F7, 0x9B540B19, 0x875FA099, 0x95F7997E, 0x623D7DA8, 0xF837889A, 0x97E32D77, 0x11ED935F, 0x16681281, 0x0E358829, 0xC7E61FD6, 0x96DEDFA1, 0x7858BA99, 0x57F584A5, 0x1B227263, 0x9B83C3FF, 0x1AC24696, 0xCDB30AEB, 0x532E3054, 0x8FD948E4, 0x6DBC3128, 0x58EBF2EF, 0x34C6FFEA, 0xFE28ED61, 0xEE7C3C73, 0x5D4A14D9, 0xE864B7E3, 0x42105D14, 0x203E13E0, 0x45EEE2B6, 0xA3AAABEA, 0xDB6C4F15, 0xFACB4FD0, 0xC742F442, 0xEF6ABBB5, 0x654F3B1D, 0x41CD2105, 0xD81E799E, 0x86854DC7, 0xE44B476A, 0x3D816250, 0xCF62A1F2, 0x5B8D2646, 0xFC8883A0, 0xC1C7B6A3, 0x7F1524C3, 0x69CB7492, 0x47848A0B, 0x5692B285, 0x095BBF00, 0xAD19489D, 0x1462B174, 0x23820E00, 0x58428D2A, 0x0C55F5EA, 0x1DADF43E, 0x233F7061, 0x3372F092, 0x8D937E41, 0xD65FECF1, 0x6C223BDB, 0x7CDE3759, 0xCBEE7460, 0x4085F2A7, 0xCE77326E, 0xA6078084, 0x19F8509E, 0xE8EFD855, 0x61D99735, 0xA969A7AA, 0xC50C06C2, 0x5A04ABFC, 0x800BCADC, 0x9E447A2E, 0xC3453484, 0xFDD56705, 0x0E1E9EC9, 0xDB73DBD3, 0x105588CD, 0x675FDA79, 0xE3674340, 0xC5C43465, 0x713E38D8, 0x3D28F89E, 0xF16DFF20, 0x153E21E7, 0x8FB03D4A, 0xE6E39F2B, 0xDB83ADF7], [0xE93D5A68, 0x948140F7, 0xF64C261C, 0x94692934, 0x411520F7, 0x7602D4F7, 0xBCF46B2E, 0xD4A20068, 0xD4082471, 0x3320F46A, 0x43B7D4B7, 0x500061AF, 0x1E39F62E, 0x97244546, 0x14214F74, 0xBF8B8840, 0x4D95FC1D, 0x96B591AF, 0x70F4DDD3, 0x66A02F45, 0xBFBC09EC, 0x03BD9785, 0x7FAC6DD0, 0x31CB8504, 0x96EB27B3, 0x55FD3941, 0xDA2547E6, 0xABCA0A9A, 0x28507825, 0x530429F4, 0x0A2C86DA, 0xE9B66DFB, 0x68DC1462, 0xD7486900, 0x680EC0A4, 0x27A18DEE, 0x4F3FFEA2, 0xE887AD8C, 0xB58CE006, 0x7AF4D6B6, 0xAACE1E7C, 0xD3375FEC, 0xCE78A399, 0x406B2A42, 0x20FE9E35, 0xD9F385B9, 0xEE39D7AB, 0x3B124E8B, 0x1DC9FAF7, 0x4B6D1856, 0x26A36631, 0xEAE397B2, 0x3A6EFA74, 0xDD5B4332, 0x6841E7F7, 0xCA7820FB, 0xFB0AF54E, 0xD8FEB397, 0x454056AC, 0xBA489527, 0x55533A3A, 0x20838D87, 0xFE6BA9B7, 0xD096954B, 0x55A867BC, 0xA1159A58, 0xCCA92963, 0x99E1DB33, 0xA62A4A56, 0x3F3125F9, 0x5EF47E1C, 0x9029317C, 0xFDF8E802, 0x04272F70, 0x80BB155C, 0x05282CE3, 0x95C11548, 0xE4C66D22, 0x48C1133F, 0xC70F86DC, 0x07F9C9EE, 0x41041F0F, 0x404779A4, 0x5D886E17, 0x325F51EB, 0xD59BC0D1, 0xF2BCC18F, 0x41113564, 0x257B7834, 0x602A9C60, 0xDFF8E8A3, 0x1F636C1B, 0x0E12B4C2, 0x02E1329E, 0xAF664FD1, 0xCAD18115, 0x6B2395E0, 0x333E92E1, 0x3B240B62, 0xEEBEB922, 0x85B2A20E, 0xE6BA0D99, 0xDE720C8C, 0x2DA2F728, 0xD0127845, 0x95B794FD, 0x647D0862, 0xE7CCF5F0, 0x5449A36F, 0x877D48FA, 0xC39DFD27, 0xF33E8D1E, 0x0A476341, 0x992EFF74, 0x3A6F6EAB, 0xF4F8FD37, 0xA812DC60, 0xA1EBDDF8, 0x991BE14C, 0xDB6E6B0D, 0xC67B5510, 0x6D672C37, 0x2765D43B, 0xDCD0E804, 0xF1290DC7, 0xCC00FFA3, 0xB5390F92, 0x690FED0B, 0x667B9FFB, 0xCEDB7D9C, 0xA091CF0B, 0xD9155EA3, 0xBB132F88, 0x515BAD24, 0x7B9479BF, 0x763BD6EB, 0x37392EB3, 0xCC115979, 0x8026E297, 0xF42E312D, 0x6842ADA7, 0xC66A2B3B, 0x12754CCC, 0x782EF11C, 0x6A124237, 0xB79251E7, 0x06A1BBE6, 0x4BFB6350, 0x1A6B1018, 0x11CAEDFA, 0x3D25BDD8, 0xE2E1C3C9, 0x44421659, 0x0A121386, 0xD90CEC6E, 0xD5ABEA2A, 0x64AF674E, 0xDA86A85F, 0xBEBFE988, 0x64E4C3FE, 0x9DBC8057, 0xF0F7C086, 0x60787BF8, 0x6003604D, 0xD1FD8346, 0xF6381FB0, 0x7745AE04, 0xD736FCCC, 0x83426B33, 0xF01EAB71, 0xB0804187, 0x3C005E5F, 0x77A057BE, 0xBDE8AE24, 0x55464299, 0xBF582E61, 0x4E58F48F, 0xF2DDFDA2, 0xF474EF38, 0x8789BDC2, 0x5366F9C3, 0xC8B38E74, 0xB475F255, 0x46FCD9B9, 0x7AEB2661, 0x8B1DDF84, 0x846A0E79, 0x915F95E2, 0x466E598E, 0x20B45770, 0x8CD55591, 0xC902DE4C, 0xB90BACE1, 0xBB8205D0, 0x11A86248, 0x7574A99E, 0xB77F19B6, 0xE0A9DC09, 0x662D09A1, 0xC4324633, 0xE85A1F02, 0x09F0BE8C, 0x4A99A025, 0x1D6EFE10, 0x1AB93D1D, 0x0BA5A4DF, 0xA186F20F, 0x2868F169, 0xDCB7DA83, 0x573906FE, 0xA1E2CE9B, 0x4FCD7F52, 0x50115E01, 0xA70683FA, 0xA002B5C4, 0x0DE6D027, 0x9AF88C27, 0x773F8641, 0xC3604C06, 0x61A806B5, 0xF0177A28, 0xC0F586E0, 0x006058AA, 0x30DC7D62, 0x11E69ED7, 0x2338EA63, 0x53C2DD94, 0xC2C21634, 0xBBCBEE56, 0x90BCB6DE, 0xEBFC7DA1, 0xCE591D76, 0x6F05E409, 0x4B7C0188, 0x39720A3D, 0x7C927C24, 0x86E3725F, 0x724D9DB9, 0x1AC15BB4, 0xD39EB8FC, 0xED545578, 0x08FCA5B5, 0xD83D7CD3, 0x4DAD0FC4, 0x1E50EF5E, 0xB161E6F8, 0xA28514D9, 0x6C51133C, 0x6FD5C7E7, 0x56E14EC4, 0x362ABFCE, 0xDDC6C837, 0xD79A3234, 0x92638212, 0x670EFA8E, 0x406000E0], [0x3A39CE37, 0xD3FAF5CF, 0xABC27737, 0x5AC52D1B, 0x5CB0679E, 0x4FA33742, 0xD3822740, 0x99BC9BBE, 0xD5118E9D, 0xBF0F7315, 0xD62D1C7E, 0xC700C47B, 0xB78C1B6B, 0x21A19045, 0xB26EB1BE, 0x6A366EB4, 0x5748AB2F, 0xBC946E79, 0xC6A376D2, 0x6549C2C8, 0x530FF8EE, 0x468DDE7D, 0xD5730A1D, 0x4CD04DC6, 0x2939BBDB, 0xA9BA4650, 0xAC9526E8, 0xBE5EE304, 0xA1FAD5F0, 0x6A2D519A, 0x63EF8CE2, 0x9A86EE22, 0xC089C2B8, 0x43242EF6, 0xA51E03AA, 0x9CF2D0A4, 0x83C061BA, 0x9BE96A4D, 0x8FE51550, 0xBA645BD6, 0x2826A2F9, 0xA73A3AE1, 0x4BA99586, 0xEF5562E9, 0xC72FEFD3, 0xF752F7DA, 0x3F046F69, 0x77FA0A59, 0x80E4A915, 0x87B08601, 0x9B09E6AD, 0x3B3EE593, 0xE990FD5A, 0x9E34D797, 0x2CF0B7D9, 0x022B8B51, 0x96D5AC3A, 0x017DA67D, 0xD1CF3ED6, 0x7C7D2D28, 0x1F9F25CF, 0xADF2B89B, 0x5AD6B472, 0x5A88F54C, 0xE029AC71, 0xE019A5E6, 0x47B0ACFD, 0xED93FA9B, 0xE8D3C48D, 0x283B57CC, 0xF8D56629, 0x79132E28, 0x785F0191, 0xED756055, 0xF7960E44, 0xE3D35E8C, 0x15056DD4, 0x88F46DBA, 0x03A16125, 0x0564F0BD, 0xC3EB9E15, 0x3C9057A2, 0x97271AEC, 0xA93A072A, 0x1B3F6D9B, 0x1E6321F5, 0xF59C66FB, 0x26DCF319, 0x7533D928, 0xB155FDF5, 0x03563482, 0x8ABA3CBB, 0x28517711, 0xC20AD9F8, 0xABCC5167, 0xCCAD925F, 0x4DE81751, 0x3830DC8E, 0x379D5862, 0x9320F991, 0xEA7A90C2, 0xFB3E7BCE, 0x5121CE64, 0x774FBE32, 0xA8B6E37E, 0xC3293D46, 0x48DE5369, 0x6413E680, 0xA2AE0810, 0xDD6DB224, 0x69852DFD, 0x09072166, 0xB39A460A, 0x6445C0DD, 0x586CDECF, 0x1C20C8AE, 0x5BBEF7DD, 0x1B588D40, 0xCCD2017F, 0x6BB4E3BB, 0xDDA26A7E, 0x3A59FF45, 0x3E350A44, 0xBCB4CDD5, 0x72EACEA8, 0xFA6484BB, 0x8D6612AE, 0xBF3C6F47, 0xD29BE463, 0x542F5D9E, 0xAEC2771B, 0xF64E6370, 0x740E0D8D, 0xE75B1357, 0xF8721671, 0xAF537D5D, 0x4040CB08, 0x4EB4E2CC, 0x34D2466A, 0x0115AF84, 0xE1B00428, 0x95983A1D, 0x06B89FB4, 0xCE6EA048, 0x6F3F3B82, 0x3520AB82, 0x011A1D4B, 0x277227F8, 0x611560B1, 0xE7933FDC, 0xBB3A792B, 0x344525BD, 0xA08839E1, 0x51CE794B, 0x2F32C9B7, 0xA01FBAC9, 0xE01CC87E, 0xBCC7D1F6, 0xCF0111C3, 0xA1E8AAC7, 0x1A908749, 0xD44FBD9A, 0xD0DADECB, 0xD50ADA38, 0x0339C32A, 0xC6913667, 0x8DF9317C, 0xE0B12B4F, 0xF79E59B7, 0x43F5BB3A, 0xF2D519FF, 0x27D9459C, 0xBF97222C, 0x15E6FC2A, 0x0F91FC71, 0x9B941525, 0xFAE59361, 0xCEB69CEB, 0xC2A86459, 0x12BAA8D1, 0xB6C1075E, 0xE3056A0C, 0x10D25065, 0xCB03A442, 0xE0EC6E0E, 0x1698DB3B, 0x4C98A0BE, 0x3278E964, 0x9F1F9532, 0xE0D392DF, 0xD3A0342B, 0x8971F21E, 0x1B0A7441, 0x4BA3348C, 0xC5BE7120, 0xC37632D8, 0xDF359F8D, 0x9B992F2E, 0xE60B6F47, 0x0FE3F11D, 0xE54CDA54, 0x1EDAD891, 0xCE6279CF, 0xCD3E7E6F, 0x1618B166, 0xFD2C1D05, 0x848FD2C5, 0xF6FB2299, 0xF523F357, 0xA6327623, 0x93A83531, 0x56CCCD02, 0xACF08162, 0x5A75EBB5, 0x6E163697, 0x88D273CC, 0xDE966292, 0x81B949D0, 0x4C50901B, 0x71C65614, 0xE6C6C7BD, 0x327A140A, 0x45E1D006, 0xC3F27B9A, 0xC9AA53FD, 0x62A80F00, 0xBB25BFE2, 0x35BDD2F6, 0x71126905, 0xB2040222, 0xB6CBCF7C, 0xCD769C2B, 0x53113EC0, 0x1640E3D3, 0x38ABBD60, 0x2547ADF0, 0xBA38209C, 0xF746CE76, 0x77AFA1C5, 0x20756060, 0x85CBFE4E, 0x8AE88DD8, 0x7AAAF9B0, 0x4CF9AA7E, 0x1948C25C, 0x02FB8A8C, 0x01C36AE4, 0xD6EBE1F9, 0x90D4F869, 0xA65CDEA0, 0x3F09252D, 0xC208E69F, 0xB74E6132, 0xCE77E25B, 0x578FDFE3, 0x3AC372E6]];
          var BLOWFISH_CTX = {
            pbox: [],
            sbox: []
          };

          function F(ctx, x) {
            let a = x >> 24 & 0xFF;
            let b = x >> 16 & 0xFF;
            let c = x >> 8 & 0xFF;
            let d = x & 0xFF;
            let y = ctx.sbox[0][a] + ctx.sbox[1][b];
            y = y ^ ctx.sbox[2][c];
            y = y + ctx.sbox[3][d];
            return y;
          }

          function BlowFish_Encrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;

            for (let i = 0; i < N; ++i) {
              Xl = Xl ^ ctx.pbox[i];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }

            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[N];
            Xl = Xl ^ ctx.pbox[N + 1];
            return {
              left: Xl,
              right: Xr
            };
          }

          function BlowFish_Decrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;

            for (let i = N + 1; i > 1; --i) {
              Xl = Xl ^ ctx.pbox[i];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }

            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[1];
            Xl = Xl ^ ctx.pbox[0];
            return {
              left: Xl,
              right: Xr
            };
          }
          /**
           * Initialization ctx's pbox and sbox.
           *
           * @param {Object} ctx The object has pbox and sbox.
           * @param {Array} key An array of 32-bit words.
           * @param {int} keysize The length of the key.
           *
           * @example
           *
           *     BlowFishInit(BLOWFISH_CTX, key, 128/32);
           */


          function BlowFishInit(ctx, key, keysize) {
            for (let Row = 0; Row < 4; Row++) {
              ctx.sbox[Row] = [];

              for (let Col = 0; Col < 256; Col++) {
                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
              }
            }

            let keyIndex = 0;

            for (let index = 0; index < N + 2; index++) {
              ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
              keyIndex++;

              if (keyIndex >= keysize) {
                keyIndex = 0;
              }
            }

            let Data1 = 0;
            let Data2 = 0;
            let res = 0;

            for (let i = 0; i < N + 2; i += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.pbox[i] = Data1;
              ctx.pbox[i + 1] = Data2;
            }

            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 256; j += 2) {
                res = BlowFish_Encrypt(ctx, Data1, Data2);
                Data1 = res.left;
                Data2 = res.right;
                ctx.sbox[i][j] = Data1;
                ctx.sbox[i][j + 1] = Data2;
              }
            }

            return true;
          }
          /**
           * Blowfish block cipher algorithm.
           */


          var Blowfish = C_algo.Blowfish = BlockCipher.extend({
            _doReset: function () {
              // Skip reset of nRounds has been set before and key did not change
              if (this._keyPriorReset === this._key) {
                return;
              } // Shortcuts


              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4; //Initialization pbox and sbox

              BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
            },
            encryptBlock: function (M, offset) {
              var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            decryptBlock: function (M, offset) {
              var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            blockSize: 64 / 32,
            keySize: 128 / 32,
            ivSize: 64 / 32
          });
          /**
           * Shortcut functions to the cipher's object interface.
           *
           * @example
           *
           *     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
           *     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
           */

          C.Blowfish = BlockCipher._createHelper(Blowfish);
        })();

        return CryptoJS.Blowfish;
      });
    })(blowfish$1, blowfish$1.exports);

    return blowfish$1.exports;
  }

  var cryptoJs = cryptoJs$1.exports;
  var hasRequiredCryptoJs;

  function requireCryptoJs() {
    if (hasRequiredCryptoJs) return cryptoJs$1.exports;
    hasRequiredCryptoJs = 1;

    (function (module, exports) {

      (function (root, factory, undef) {
        {
          // CommonJS
          module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
        }
      })(cryptoJs, function (CryptoJS) {
        return CryptoJS;
      });
    })(cryptoJs$1, cryptoJs$1.exports);

    return cryptoJs$1.exports;
  }

  var cryptoJsExports = requireCryptoJs();

  var _key = _classPrivateFieldLooseKey("key");

  var _logger$b = _classPrivateFieldLooseKey("logger");

  var _encryptLocalStorage = _classPrivateFieldLooseKey("encryptLocalStorage");

  class Encryption {
    constructor() {
      Object.defineProperty(this, _key, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$b, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _encryptLocalStorage, {
        writable: true,
        value: false
      });
    }

    set logger(classInstance) {
      _classPrivateFieldLooseBase(this, _logger$b)[_logger$b] = classInstance;
    }

    get logger() {
      return _classPrivateFieldLooseBase(this, _logger$b)[_logger$b];
    }

    set key(value) {
      _classPrivateFieldLooseBase(this, _key)[_key] = value;
    }

    get key() {
      return _classPrivateFieldLooseBase(this, _key)[_key];
    }

    set enableLocalStorageEncryption(value) {
      _classPrivateFieldLooseBase(this, _encryptLocalStorage)[_encryptLocalStorage] = value;
    }

    get enableLocalStorageEncryption() {
      return _classPrivateFieldLooseBase(this, _encryptLocalStorage)[_encryptLocalStorage];
    }

    shouldEncrypt(key) {
      return _classPrivateFieldLooseBase(this, _encryptLocalStorage)[_encryptLocalStorage] && KEYS_TO_ENCRYPT.includes(key);
    } // For backwards compatibility, we should decrypt even if encrypt is false.
    // This means someone switched it on and then off.


    shouldDecrypt(key) {
      return KEYS_TO_ENCRYPT.includes(key);
    }

    encrypt(data) {
      return cryptoJsExports.AES.encrypt(data, this.key).toString();
    }

    decrypt(data) {
      const decryptedData = cryptoJsExports.AES.decrypt(data, this.key).toString(cryptoJsExports.enc.Utf8);

      if (decryptedData === '') {
        return data;
      } else {
        return decryptedData;
      }
    }

  }

  const encryption = new Encryption();

  class StorageManager {
    static save(key, value) {
      if (!key || !value) {
        return false;
      }

      if (this._isLocalStorageSupported()) {
        if (encryption.shouldEncrypt(key)) {
          localStorage.setItem(key, encryption.encrypt(value));
          return true;
        }

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
          if (encryption.shouldDecrypt(key)) {
            data = encryption.decrypt(data);
          }

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
      /* -------------------------------------------------------------
       * Sub-domain isolation: when the global flag is set, skip the
       * broad-domain logic and write a cookie scoped to the current
       * host only.  Also remove any legacy broad-domain copy so that
       * the host-level cookie has precedence.
       * ----------------------------------------------------------- */
      const isolate = !!this.readFromLSorCookie(ISOLATE_COOKIE);

      if (isolate) {
        // remove any legacy broad-domain cookie
        if ($ct.broadDomain) {
          this.removeCookie(name, $ct.broadDomain);
        } // write host-scoped cookie and stop


        this.createCookie(name, value, seconds, domain);
        return;
      } // sets cookie on the base domain. e.g. if domain is baz.foo.bar.com, set cookie on ".bar.com"
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
    } // Add new method for OUL tracking


    static markBackupAsOUL(reqNo) {
      // Store OUL request numbers in a separate meta property
      const oulRequests = this.getMetaProp('OUL_REQUESTS') || [];

      if (!oulRequests.includes(reqNo)) {
        oulRequests.push(reqNo);
        this.setMetaProp('OUL_REQUESTS', oulRequests);
      }
    }

    static isBackupOUL(reqNo) {
      const oulRequests = this.getMetaProp('OUL_REQUESTS') || [];
      return oulRequests.includes(reqNo);
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

    // Initialize blockRequest from storage
    get blockRequest() {
      const value = StorageManager.readFromLSorCookie(BLOCK_REQUEST_COOKIE);
      return value === true;
    },

    set blockRequest(value) {
      StorageManager.saveToLSorCookie(BLOCK_REQUEST_COOKIE, value);
    },

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
    dismissSpamControl: true,
    globalUnsubscribe: true,
    flutterVersion: null,
    variableStore: {},
    pushConfig: null,
    delayEvents: false,
    intervalArray: [] // domain: window.location.hostname, url -> getHostName()
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

  var _logger$a = _classPrivateFieldLooseKey("logger");

  var _request$7 = _classPrivateFieldLooseKey("request");

  var _device$3 = _classPrivateFieldLooseKey("device");

  var _session$3 = _classPrivateFieldLooseKey("session");

  class CleverTapAPI {
    constructor(_ref) {
      let {
        logger,
        request,
        device,
        session
      } = _ref;
      Object.defineProperty(this, _logger$a, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$7, {
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
      _classPrivateFieldLooseBase(this, _logger$a)[_logger$a] = logger;
      _classPrivateFieldLooseBase(this, _request$7)[_request$7] = request;
      _classPrivateFieldLooseBase(this, _device$3)[_device$3] = device;
      _classPrivateFieldLooseBase(this, _session$3)[_session$3] = session;
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

      StorageManager.removeBackup(respNumber, _classPrivateFieldLooseBase(this, _logger$a)[_logger$a]);

      if (respNumber > $ct.globalCache.REQ_N) {
        // request for some other user so ignore
        return;
      }

      if (!isValueValid(_classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie)) {
        if (global) {
          newGuid = true;
        }
      }

      if (!isValueValid(_classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie) || resume || typeof optOutResponse === 'boolean') {
        const sessionObj = _classPrivateFieldLooseBase(this, _session$3)[_session$3].getSessionCookieObject();
        /*  If the received session is less than the session in the cookie,
            then don't update guid as it will be response for old request
        */


        if (window.isOULInProgress || sessionObj.s && session < sessionObj.s) {
          return;
        }

        _classPrivateFieldLooseBase(this, _logger$a)[_logger$a].debug("Cookie was ".concat(_classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie, " set to ").concat(global));

        _classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie = global;

        if (!isValueValid(_classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie)) {
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

            _classPrivateFieldLooseBase(this, _request$7)[_request$7].unregisterTokenForGuid(lastGUID);
          }
        }

        StorageManager.createBroadCookie(GCOOKIE_NAME, global, COOKIE_EXPIRY, window.location.hostname);
        StorageManager.saveToLSorCookie(GCOOKIE_NAME, global);
      }

      if (StorageManager._isLocalStorageSupported()) {
        _classPrivateFieldLooseBase(this, _session$3)[_session$3].manageSession(session);
      } // session cookie


      const obj = _classPrivateFieldLooseBase(this, _session$3)[_session$3].getSessionCookieObject(); // for the race-condition where two responses come back with different session ids. don't write the older session id.


      if (typeof obj.s === 'undefined' || obj.s <= session) {
        obj.s = session;
        obj.t = getNow(); // time of last response from server

        _classPrivateFieldLooseBase(this, _session$3)[_session$3].setSessionCookieObject(obj);
      } // set blockRequest to false only if the device has a valid gcookie


      if (isValueValid(_classPrivateFieldLooseBase(this, _device$3)[_device$3].gcookie)) {
        $ct.blockRequest = false;
      } // only process the backup events after an OUL request or a new guid is recieved


      if ((oulReq || newGuid) && !_classPrivateFieldLooseBase(this, _request$7)[_request$7].processingBackup) {
        _classPrivateFieldLooseBase(this, _request$7)[_request$7].processBackupEvents();
      }

      $ct.globalCache.RESP_N = respNumber;
    }

  }

  var _logger$9 = _classPrivateFieldLooseKey("logger");

  class DeviceManager {
    constructor(_ref) {
      let {
        logger,
        customId
      } = _ref;
      Object.defineProperty(this, _logger$9, {
        writable: true,
        value: void 0
      });
      this.gcookie = void 0;
      _classPrivateFieldLooseBase(this, _logger$9)[_logger$9] = logger;
      this.gcookie = this.getGuid() || customId;
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
            _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].debug('Cannot parse Gcookie from localstorage - must be encoded ' + value); // assumming guids are of size 32. supporting both formats.
            // guid can have encodedURIComponent or be without it.
            // 1.56e4078ed15749928c042479ec2b4d47 - breaks on JSON.parse(decodeURIComponent())
            // 2.%2256e4078ed15749928c042479ec2b4d47%22


            if (value.length === 32) {
              guid = value;
              StorageManager.saveToLSorCookie(GCOOKIE_NAME, value);
            } else {
              _classPrivateFieldLooseBase(this, _logger$9)[_logger$9].error('Illegal guid ' + value);
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
  const GENDER_ERROR = "".concat(CLEVERTAP_ERROR_PREFIX, " Gender value should one of the following: m,f,o,u,male,female,unknown,others (case insensitive). ").concat(DATA_NOT_SENT_TEXT);
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

  var _logger$8 = _classPrivateFieldLooseKey("logger");

  var _oldValues$4 = _classPrivateFieldLooseKey("oldValues");

  var _request$6 = _classPrivateFieldLooseKey("request");

  var _isPersonalisationActive$4 = _classPrivateFieldLooseKey("isPersonalisationActive");

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
      Object.defineProperty(this, _logger$8, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$6, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive$4, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger$8)[_logger$8] = logger;
      _classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4] = values;
      _classPrivateFieldLooseBase(this, _request$6)[_request$6] = request;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$4)[_isPersonalisationActive$4] = isPersonalisationActive;
    }

    push() {
      if (StorageManager.readFromLSorCookie(ACCOUNT_ID)) {
        for (var _len = arguments.length, eventsArr = new Array(_len), _key = 0; _key < _len; _key++) {
          eventsArr[_key] = arguments[_key];
        }

        _classPrivateFieldLooseBase(this, _processEventArray)[_processEventArray](eventsArr);

        return 0;
      } else {
        _classPrivateFieldLooseBase(this, _logger$8)[_logger$8].error('Account ID is not set');
      }
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4]) {
        _classPrivateFieldLooseBase(this, _processEventArray)[_processEventArray](_classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$4)[_oldValues$4] = null;
    }

    getDetails(evtName) {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$4)[_isPersonalisationActive$4]()) {
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
          _classPrivateFieldLooseBase(this, _logger$8)[_logger$8].error(EVENT_ERROR);

          continue;
        }

        if (eventName.length > 1024) {
          eventName = eventName.substring(0, 1024);

          _classPrivateFieldLooseBase(this, _logger$8)[_logger$8].reportError(510, eventName + '... length exceeded 1024 chars. Trimmed.');
        }

        if (SYSTEM_EVENTS.includes(eventName)) {
          _classPrivateFieldLooseBase(this, _logger$8)[_logger$8].reportError(513, eventName + ' is a restricted system event. It cannot be used as an event name.');

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
              if (!isChargedEventStructureValid(eventObj, _classPrivateFieldLooseBase(this, _logger$8)[_logger$8])) {
                _classPrivateFieldLooseBase(this, _logger$8)[_logger$8].reportError(511, 'Charged event structure invalid. Not sent.');

                continue;
              }
            } else {
              if (!isEventStructureFlat(eventObj)) {
                _classPrivateFieldLooseBase(this, _logger$8)[_logger$8].reportError(512, eventName + ' event structure invalid. Not sent.');

                continue;
              }
            }

            data.evtData = eventObj;
          }
        }

        _classPrivateFieldLooseBase(this, _request$6)[_request$6].processEvent(data);
      }
    }
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
    var _window$location$orig, _window, _window$location, _window2, _window2$location, _window$clevertap, _window$wizrocket;

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

    url = addToURL(url, 'origin', (_window$location$orig = (_window = window) === null || _window === void 0 ? void 0 : (_window$location = _window.location) === null || _window$location === void 0 ? void 0 : _window$location.origin) !== null && _window$location$orig !== void 0 ? _window$location$orig : (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$location = _window2.location) === null || _window2$location === void 0 ? void 0 : _window2$location.href); // Add origin to URL

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
  const webNativeDisplayCampaignUtils = {
    /**
     * Checks if a campaign triggers a custom event push based on its template type.
     *
     * @param {Object} campaign - The campaign object to evaluate.
     * @returns {boolean} - Returns true if the campaign pushes a custom event, otherwise false.
     */
    doesCampaignPushCustomEvent: campaign => {
      var _campaign$msgContent, _campaign$msgContent2, _campaign$display, _campaign$display$det, _campaign$display$det2, _campaign$display$det3, _campaign$display$det4;

      return [WEB_NATIVE_TEMPLATES.KV_PAIR, WEB_NATIVE_TEMPLATES.JSON].includes(campaign === null || campaign === void 0 ? void 0 : (_campaign$msgContent = campaign.msgContent) === null || _campaign$msgContent === void 0 ? void 0 : _campaign$msgContent.type) || (campaign === null || campaign === void 0 ? void 0 : (_campaign$msgContent2 = campaign.msgContent) === null || _campaign$msgContent2 === void 0 ? void 0 : _campaign$msgContent2.type) === WEB_NATIVE_TEMPLATES.VISUAL_BUILDER && (campaign === null || campaign === void 0 ? void 0 : (_campaign$display = campaign.display) === null || _campaign$display === void 0 ? void 0 : (_campaign$display$det = _campaign$display.details) === null || _campaign$display$det === void 0 ? void 0 : (_campaign$display$det2 = _campaign$display$det[0]) === null || _campaign$display$det2 === void 0 ? void 0 : (_campaign$display$det3 = _campaign$display$det2.selectorData) === null || _campaign$display$det3 === void 0 ? void 0 : (_campaign$display$det4 = _campaign$display$det3.map(s => {
        var _s$values;

        return s === null || s === void 0 ? void 0 : (_s$values = s.values) === null || _s$values === void 0 ? void 0 : _s$values.editor;
      })) === null || _campaign$display$det4 === void 0 ? void 0 : _campaign$display$det4.includes(WEB_NATIVE_DISPLAY_VISUAL_EDITOR_TYPES.JSON));
    },

    /**
     * Determines if a campaign mutates the DOM node based on its template type.
     *
     * @param {Object} campaign - The campaign object to evaluate.
     * @returns {boolean} - Returns true if the campaign mutates the DOM node, otherwise false.
     */
    doesCampaignMutateDOMNode: campaign => {
      var _campaign$msgContent3, _campaign$msgContent4, _campaign$display2, _campaign$display2$de, _campaign$display2$de2, _campaign$display2$de3;

      return [WEB_NATIVE_TEMPLATES.BANNER, WEB_NATIVE_TEMPLATES.CAROUSEL, WEB_NATIVE_TEMPLATES.CUSTOM_HTML].includes(campaign === null || campaign === void 0 ? void 0 : (_campaign$msgContent3 = campaign.msgContent) === null || _campaign$msgContent3 === void 0 ? void 0 : _campaign$msgContent3.type) || WEB_NATIVE_TEMPLATES.VISUAL_BUILDER === (campaign === null || campaign === void 0 ? void 0 : (_campaign$msgContent4 = campaign.msgContent) === null || _campaign$msgContent4 === void 0 ? void 0 : _campaign$msgContent4.type) && (campaign === null || campaign === void 0 ? void 0 : (_campaign$display2 = campaign.display) === null || _campaign$display2 === void 0 ? void 0 : (_campaign$display2$de = _campaign$display2.details) === null || _campaign$display2$de === void 0 ? void 0 : (_campaign$display2$de2 = _campaign$display2$de[0]) === null || _campaign$display2$de2 === void 0 ? void 0 : (_campaign$display2$de3 = _campaign$display2$de2.selectorData) === null || _campaign$display2$de3 === void 0 ? void 0 : _campaign$display2$de3.some(s => {
        var _s$values2;

        return [WEB_NATIVE_DISPLAY_VISUAL_EDITOR_TYPES.HTML, WEB_NATIVE_DISPLAY_VISUAL_EDITOR_TYPES.FORM].includes(s === null || s === void 0 ? void 0 : (_s$values2 = s.values) === null || _s$values2 === void 0 ? void 0 : _s$values2.editor);
      }));
    },

    /**
     * Sorts campaigns based on their priority in descending order.
     *
     * @param {Array<Object>} campaigns - The list of campaign objects.
     * @returns {Array<Object>} - A new array of campaigns sorted by priority.
     */
    sortCampaignsByPriority: campaigns => {
      return campaigns.sort((a, b) => b.priority - a.priority);
    },

    /**
     * Retrieves the DOM nodes associated with a campaign based on its template type.
     *
     * @param {Object} campaign - The campaign object to extract nodes from.
     * @returns {Array<string>} - An array of DOM node selectors or IDs associated with the campaign.
     */
    getCampaignNodes: campaign => {
      var _display$details, _display$details$, _display$details$$sel, _display$details$$sel2;

      const {
        msgContent,
        display
      } = campaign;
      const {
        type
      } = msgContent;

      switch (type) {
        case WEB_NATIVE_TEMPLATES.BANNER:
        case WEB_NATIVE_TEMPLATES.CAROUSEL:
          return [display === null || display === void 0 ? void 0 : display.divSelector];

        case WEB_NATIVE_TEMPLATES.CUSTOM_HTML:
          return [display === null || display === void 0 ? void 0 : display.divId];

        case WEB_NATIVE_TEMPLATES.VISUAL_BUILDER:
          return (display === null || display === void 0 ? void 0 : (_display$details = display.details) === null || _display$details === void 0 ? void 0 : (_display$details$ = _display$details[0]) === null || _display$details$ === void 0 ? void 0 : (_display$details$$sel = _display$details$.selectorData) === null || _display$details$$sel === void 0 ? void 0 : (_display$details$$sel2 = _display$details$$sel.filter(s => {
            var _s$values3;

            return (s === null || s === void 0 ? void 0 : (_s$values3 = s.values) === null || _s$values3 === void 0 ? void 0 : _s$values3.editor) === WEB_NATIVE_DISPLAY_VISUAL_EDITOR_TYPES.HTML;
          })) === null || _display$details$$sel2 === void 0 ? void 0 : _display$details$$sel2.map(s => s === null || s === void 0 ? void 0 : s.selector)) || [];

        default:
          return [];
      }
    },

    /**
     * Determines whether the current custom event campaign should be skipped based on existing executed targets.
     *
     * @param {Object} targetNotif - The current notification object containing campaign details.
     * @param {ExecutedTargets} executedTargets - An object holding already executed custom events.
     * @returns {boolean} - Returns true if the current custom event campaign should be skipped, false otherwise.
     */
    shouldCurrentCustomEventCampaignBeSkipped(targetNotif, executedTargets) {
      var _targetNotif$msgConte2, _currentSameTypeCampa, _targetNotif$display, _targetNotif$display$;

      const currentSameTypeCampaigns = executedTargets.customEvents.filter(customEvent => {
        var _targetNotif$msgConte;

        return customEvent.customEventType === (targetNotif === null || targetNotif === void 0 ? void 0 : (_targetNotif$msgConte = targetNotif.msgContent) === null || _targetNotif$msgConte === void 0 ? void 0 : _targetNotif$msgConte.type);
      });
      let shouldSkip = false; // If KV Pair, check for topic and type
      // if visual builder or JSON, just check for the type of event, because we do not have `topic`

      if (currentSameTypeCampaigns === null || currentSameTypeCampaigns === void 0 ? void 0 : currentSameTypeCampaigns.length) {
        switch (targetNotif === null || targetNotif === void 0 ? void 0 : (_targetNotif$msgConte2 = targetNotif.msgContent) === null || _targetNotif$msgConte2 === void 0 ? void 0 : _targetNotif$msgConte2.type) {
          case WEB_NATIVE_TEMPLATES.KV_PAIR:
            if ((_currentSameTypeCampa = currentSameTypeCampaigns.map(c => c === null || c === void 0 ? void 0 : c.eventTopic)) === null || _currentSameTypeCampa === void 0 ? void 0 : _currentSameTypeCampa.includes(targetNotif === null || targetNotif === void 0 ? void 0 : (_targetNotif$display = targetNotif.display) === null || _targetNotif$display === void 0 ? void 0 : (_targetNotif$display$ = _targetNotif$display.kv) === null || _targetNotif$display$ === void 0 ? void 0 : _targetNotif$display$.topic)) {
              shouldSkip = true;
            }

            break;

          /* TODO: Within Visual Editor : Why do we need to select a DOM node for create customEvent
          and can we inform the user the type of event they will receive in the editor
          */

          /* TODO: Can we intro a key for `topic` similar to KV_PAIR in VISUAL_EDITOR & JSON for parity and better UX */

          /* Visual Editor has all the events from different campaigns combined in single JSON within selectorData */

          /* So we can not use Separated Campaigns logic for it, Hence skipping */

          case WEB_NATIVE_TEMPLATES.VISUAL_BUILDER:
          case WEB_NATIVE_TEMPLATES.JSON:
            shouldSkip = true;
            break;
        }
      }

      return shouldSkip;
    }

  };
  const deliveryPreferenceUtils = {
    /**
     * Updates a frequency counter object based on the given array.
     * If a key from the array exists in the object, its value is incremented.
     * Otherwise, the key is added with an initial count of 1.
     *
     * @param {string[]} arr - The array of keys to process.
     * @param {Object<string, number>} [obj={}] - The existing frequency counter object (optional).
     * @returns {Object<string, number>} - The updated frequency counter object.
     *
     * @example
     * let freq = updateFrequencyCounter(["a", "b", "c"]);
     * console.log(freq); // { a: 1, b: 1, c: 1 }
     *
     * freq = updateFrequencyCounter(["a", "b"], freq);
     * console.log(freq); // { a: 2, b: 2, c: 1 }
     */
    updateFrequencyCounter(arr) {
      let obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!arr || arr.length === 0) {
        return obj;
      }

      arr.forEach(key => {
        obj[key] = (obj[key] || 0) + 1;
      });
      return obj;
    },

    /**
     * Updates a timestamp tracker object based on the given array of keys.
     * If a key exists, it appends the current timestamp; otherwise, it starts a new array with the timestamp.
     *
     * @param {string[]} arr - The array of keys to process.
     * @param {Object<string, number[]>} [obj={}] - The existing timestamp tracker object (optional).
     * @returns {Object<string, number[]>} - The updated timestamp tracker object.
     *
     * @example
     * let timestamps = updateTimestampTracker(["a", "b", "c"]);
     * console.log(timestamps);
     * // { a: [1712134567], b: [1712134567], c: [1712134567] }
     *
     * timestamps = updateTimestampTracker(["a", "b"], timestamps);
     * console.log(timestamps);
     * // { a: [1712134567, 1712134570], b: [1712134567, 1712134570], c: [1712134567] }
     */
    updateTimestampTracker(arr) {
      let obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!arr || arr.length === 0) {
        return obj;
      }

      const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds (Epoch UTC)

      arr.forEach(key => {
        if (!obj[key]) {
          obj[key] = [];
        }

        obj[key].push(now);
      });
      return obj;
    },

    /**
     * Migrates legacy TLC data to the latest WSC
     * and WFC structures.
     *
     * This function reads from `CAMP.wp`, which stores web popup data keyed by session IDs and global campaign data.
     * Each campaign ID (except for the key `tc`, which is a total count) maps to either:
     * - `1` → campaign was shown once
     * - `'dnd'` → campaign was shown and dismissed (Do Not Disturb)
     *
     * After migrating each campaign's data using `deliveryPreferenceUtils.portCampaignDetails`,
     * the old TLC data (`CAMP.wp`) is cleared from storage.
     *
     * @param {Object} _session - The current session object.
     * @param {string} _session.sessionId - The unique identifier for the session, used to access session-specific campaign data.
     */
    portTLC(_session) {
      var _existingCamp$wp, _existingCamp$wp2;

      // TODO: Add the campaignId keys which has value as `dnd` to the `dnd` array
      const existingCamp = getCampaignObject();
      const dnd = [];
      /* If no campaigns are present, then we don't need to port anything */

      if (!(existingCamp === null || existingCamp === void 0 ? void 0 : existingCamp.wp) || Object.keys(existingCamp === null || existingCamp === void 0 ? void 0 : existingCamp.wp).length === 0) {
        return;
      }

      const webPopupGlobalDetails = (existingCamp === null || existingCamp === void 0 ? void 0 : (_existingCamp$wp = existingCamp.wp) === null || _existingCamp$wp === void 0 ? void 0 : _existingCamp$wp.global) || {};
      const webPopupSessionDetails = (existingCamp === null || existingCamp === void 0 ? void 0 : (_existingCamp$wp2 = existingCamp.wp) === null || _existingCamp$wp2 === void 0 ? void 0 : _existingCamp$wp2[_session.sessionId]) || {};
      const campaignIds = Object.keys(webPopupGlobalDetails);

      for (const campaignId of campaignIds) {
        if (campaignId !== 'tc') {
          const globalCampaignCount = webPopupGlobalDetails[campaignId];
          const sessionCampaignCount = webPopupSessionDetails[campaignId];

          if (sessionCampaignCount === 'dnd') {
            dnd.push(campaignId);
          }

          const updatedCamp = deliveryPreferenceUtils.portCampaignDetails(campaignId, sessionCampaignCount, globalCampaignCount);
          saveCampaignObject(updatedCamp);
        }
      }

      const updatedCamp = getCampaignObject();
      saveCampaignObject({ ...updatedCamp,
        dnd: [...new Set([...(updatedCamp.dnd || []), ...dnd])],
        wp: {}
      });
    },

    portCampaignDetails(campaignId, sessionCount, globalCount) {
      var _campaignObj$wsc;

      /* If we have a dnd count for sesion then we will default its count to globalCount */
      const sCount = sessionCount === 'dnd' ? globalCount : sessionCount;
      const campaignObj = getCampaignObject(); // Ensure campaignObj and campaignObj.wfc exist

      campaignObj.wfc = campaignObj.wfc || {}; // Fallback to an empty array if campaignObj.wfc[campaignId] is undefined

      const existingTimestamps = Array.isArray(campaignObj.wfc[campaignId]) ? campaignObj.wfc[campaignId] : []; // Generate new timestamps safely

      let newTimestamps = [];

      try {
        newTimestamps = deliveryPreferenceUtils.generateTimestamps(globalCount, sCount);
      } catch (err) {
        console.error('Failed to generate timestamps:', err);
      } // Safely update the object


      campaignObj.wfc = { ...campaignObj.wfc,
        [campaignId]: [...existingTimestamps, ...newTimestamps]
      };
      /* Or tc can also be used to assign once */

      campaignObj.wsc = ((_campaignObj$wsc = campaignObj === null || campaignObj === void 0 ? void 0 : campaignObj.wsc) !== null && _campaignObj$wsc !== void 0 ? _campaignObj$wsc : 0) + globalCount;
      return campaignObj;
    },

    /**
     * Generates an array of timestamps.
     *
     * - The first `a` timestamps are from the current time, each 1 second apart (now, now - 1s, now - 2s, ...).
     * - The remaining `(b - a)` timestamps are from previous days (now - 1 day, now - 2 days, ...).
     *
     * @param {number} globalCount - Number of recent timestamps with 1-second gaps.
     * @param {number} sessionCount - Total number of timestamps to generate.
     * @returns {number[]} Array of timestamps in milliseconds since the Unix epoch.
     */
    generateTimestamps(globalCount, sessionCount) {
      try {
        const now = Math.floor(Date.now() / 1000);
        const oneDay = 24 * 60 * 60; // (globalCount - sessionCount) timestamps: today - 1 day + 1ms, today - 1 day + 2ms, ...

        const pastDays = Array.from({
          length: globalCount - sessionCount
        }, (_, i) => now - oneDay + (i + 1)); // a timestamps: today, today + 1ms, today + 2ms, ...

        const recentMs = Array.from({
          length: sessionCount
        }, (_, i) => now + i + 1);
        return [...recentMs, ...pastDays];
      } catch {
        return [];
      }
    },

    isPopupCampaignAlreadyShown(campaignId) {
      var _campaignObj$wfc;

      const campaignObj = getCampaignObject();
      const campaignDetails = campaignObj === null || campaignObj === void 0 ? void 0 : (_campaignObj$wfc = campaignObj.wfc) === null || _campaignObj$wfc === void 0 ? void 0 : _campaignObj$wfc[campaignId];
      return (campaignDetails === null || campaignDetails === void 0 ? void 0 : campaignDetails.length) > 0;
    },

    isCampaignAddedToDND(campaignId) {
      var _campaignObj$dnd;

      const campaignObj = getCampaignObject();
      return campaignObj === null || campaignObj === void 0 ? void 0 : (_campaignObj$dnd = campaignObj.dnd) === null || _campaignObj$dnd === void 0 ? void 0 : _campaignObj$dnd.includes(campaignId);
    },

    updateOccurenceForPopupAndNativeDisplay(msg, device, logger) {
      var _getCampaignObject$wi, _getCampaignObject, _getCampaignObject$wp, _getCampaignObject2, _getCampaignObject$ws, _getCampaignObject3, _getCampaignObject$wn, _getCampaignObject4;

      // If the guid is present in CAMP_G retain it instead of using the CAMP
      const globalCamp = JSON.parse(decodeURIComponent(StorageManager.read(CAMP_COOKIE_G)));
      const currentIdCamp = globalCamp === null || globalCamp === void 0 ? void 0 : globalCamp[device === null || device === void 0 ? void 0 : device.gcookie];
      let campaignObj = currentIdCamp || getCampaignObject();
      const woc = deliveryPreferenceUtils.updateFrequencyCounter(msg.wtq, campaignObj.woc);
      const wndoc = deliveryPreferenceUtils.updateFrequencyCounter(msg.wndtq, campaignObj.wndoc); // If we are retreiving CAMP_G data, we can not retain details on web inbox as they are only session based.

      const wi = (_getCampaignObject$wi = (_getCampaignObject = getCampaignObject()) === null || _getCampaignObject === void 0 ? void 0 : _getCampaignObject.wi) !== null && _getCampaignObject$wi !== void 0 ? _getCampaignObject$wi : {};
      const wp = (_getCampaignObject$wp = (_getCampaignObject2 = getCampaignObject()) === null || _getCampaignObject2 === void 0 ? void 0 : _getCampaignObject2.wp) !== null && _getCampaignObject$wp !== void 0 ? _getCampaignObject$wp : {};
      const wsc = (_getCampaignObject$ws = (_getCampaignObject3 = getCampaignObject()) === null || _getCampaignObject3 === void 0 ? void 0 : _getCampaignObject3.wsc) !== null && _getCampaignObject$ws !== void 0 ? _getCampaignObject$ws : 0;
      const wndsc = (_getCampaignObject$wn = (_getCampaignObject4 = getCampaignObject()) === null || _getCampaignObject4 === void 0 ? void 0 : _getCampaignObject4.wndsc) !== null && _getCampaignObject$wn !== void 0 ? _getCampaignObject$wn : 0;
      campaignObj = { ...campaignObj,
        woc,
        wndoc,
        wi,
        wp,
        wsc,
        wndsc
      };
      saveCampaignObject(campaignObj);
    },

    /**
     * Gets the daily count for a campaign, automatically resetting to 1 when date changes
     * Date tracking is done in localStorage for persistence across page reloads
     * @param {Object} campaignObj - The campaign object to store count
     * @param {string} dailyCountKey - The key to store the daily count
     * @returns {number} The new daily count (incremented from previous or reset to 1)
     */
    getDailyCount(campaignObj, dailyCountKey) {
      const DATE_TRACKER_KEY = 'ct_daily_date_tracker';
      const today = new Date().toISOString().split('T')[0];
      let storedDate = null;
      storedDate = localStorage.getItem(DATE_TRACKER_KEY); // Get current count

      const storedCount = typeof campaignObj[dailyCountKey] === 'number' ? campaignObj[dailyCountKey] : 0;
      let newDailyCount;

      if (storedDate !== today) {
        newDailyCount = 1;
        localStorage.setItem(DATE_TRACKER_KEY, today);
      } else {
        newDailyCount = storedCount + 1;
      }

      return newDailyCount;
    },

    /**
    * Clears stale campaign entries from the campaign object based on provided message data.
    *
    * @param {Object} msg - Message object containing stale campaign information
    * @param {Array<string>} [msg.native_display_stale] - Array of campaign IDs for native display campaigns to clear
    * @param {Array<string>} [msg.inbox_stale] - Array of campaign IDs for inbox campaigns to clear
    * @param {Object} logger - Logger instance for logging operations
    * @returns {void}
    *
    * @description
    * This function processes stale campaign data and removes corresponding entries:
    * - For inbox_stale campaigns: removes entries from wfc and woc
    * - For native_display_stale campaigns: removes entries from wndfc and wndoc
    *
    * The function retrieves the current campaign object, modifies it by removing
    * stale entries, and saves the updated object back to storage.
    */
    clearStaleCampaigns(msg, logger) {
      try {
        // Get current campaign object
        const campaignObject = getCampaignObject();

        if (!campaignObject) {
          logger.debug('No campaign object found');
          return;
        }

        let modified = false; // Handle inbox_stale campaigns - clear wfc and woc entries

        if (msg.inbox_stale && Array.isArray(msg.inbox_stale)) {
          logger.debug("Processing ".concat(msg.inbox_stale.length, " inbox stale campaigns"));

          for (const campaignId of msg.inbox_stale) {
            // Clear wfc entry
            if (campaignObject.wfc && campaignObject.wfc[campaignId]) {
              delete campaignObject.wfc[campaignId];
              logger.debug("Cleared wfc entry for campaign ".concat(campaignId));
              modified = true;
            } // Clear woc entry


            if (campaignObject.woc && campaignObject.woc[campaignId]) {
              delete campaignObject.woc[campaignId];
              logger.debug("Cleared woc entry for campaign ".concat(campaignId));
              modified = true;
            }
          }
        } // Handle native_display_stale campaigns - clear wndfc and wndoc entries


        if (msg.native_display_stale && Array.isArray(msg.native_display_stale)) {
          logger.debug("Processing ".concat(msg.native_display_stale.length, " native display stale campaigns"));

          for (const campaignId of msg.native_display_stale) {
            // Clear wndfc entry
            if (campaignObject.wndfc && campaignObject.wndfc[campaignId]) {
              delete campaignObject.wndfc[campaignId];
              logger.debug("Cleared wndfc entry for campaign ".concat(campaignId));
              modified = true;
            } // Clear wndoc entry


            if (campaignObject.wndoc && campaignObject.wndoc[campaignId]) {
              delete campaignObject.wndoc[campaignId];
              logger.debug("Cleared wndoc entry for campaign ".concat(campaignId));
              modified = true;
            }
          }
        } // Save updated campaign object if modifications were made


        if (modified) {
          saveCampaignObject(campaignObject);
          logger.debug('Campaign object updated with stale campaign removals');
        } else {
          logger.debug('No stale campaigns found to clear');
        }
      } catch (error) {
        logger.error('Error clearing stale campaigns:', error);
        throw error;
      }
    }

  };
  function addScriptTo(script) {
    let target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
    const targetEl = document.querySelector(target);
    if (!targetEl) return;
    const newScript = document.createElement('script');
    newScript.textContent = script.textContent;
    if (script.src) newScript.src = script.src;
    newScript.async = script.async;
    Array.from(script.attributes).forEach(attr => {
      if (attr.name !== 'src' && attr.name !== 'async') {
        newScript.setAttribute(attr.name, attr.value);
      }
    });
    targetEl.appendChild(newScript);
    script.remove();
  }
  function addCampaignToLocalStorage(campaign) {
    var _campaign$display3;

    let region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'eu1';
    let accountId = arguments.length > 2 ? arguments[2] : undefined;

    /* No Need to store campaigns in local storage in preview mode */
    if ((campaign === null || campaign === void 0 ? void 0 : (_campaign$display3 = campaign.display) === null || _campaign$display3 === void 0 ? void 0 : _campaign$display3.preview) === true) {
      return;
    }

    const campaignId = campaign.wzrk_id.split('_')[0];
    const dashboardUrl = "https://".concat(region, ".dashboard.clevertap.com/").concat(accountId, "/campaigns/campaign/").concat(campaignId, "/report/stats");
    const enrichedCampaign = { ...campaign,
      url: dashboardUrl
    };
    const storedData = StorageManager.readFromLSorCookie(QUALIFIED_CAMPAIGNS);
    const existingCampaigns = storedData ? JSON.parse(decodeURIComponent(storedData)) : [];
    const isDuplicate = existingCampaigns.some(c => c.wzrk_id === campaign.wzrk_id);

    if (!isDuplicate) {
      const updatedCampaigns = [...existingCampaigns, enrichedCampaign];
      StorageManager.saveToLSorCookie(QUALIFIED_CAMPAIGNS, encodeURIComponent(JSON.stringify(updatedCampaigns)));
    }
  }

  // CleverTap specific utilities
  const getCampaignObject = () => {
    let finalcampObj = {};

    if (StorageManager._isLocalStorageSupported()) {
      let campObj = StorageManager.read(CAMP_COOKIE_NAME);

      if (campObj != null) {
        campObj = JSON.parse(decodeURIComponent(campObj).replace(singleQuoteRegex, '\"'));
        finalcampObj = campObj;
      } else {
        finalcampObj = {};
      }
    }

    return finalcampObj;
  }; // Save Camp here

  const saveCampaignObject = campaignObj => {
    if (StorageManager._isLocalStorageSupported()) {
      const newObj = { ...getCampaignObject(),
        ...campaignObj
      };
      const campObj = JSON.stringify(newObj);
      StorageManager.save(CAMP_COOKIE_NAME, encodeURIComponent(campObj)); // Update the CAMP_COOKIE_G to be in sync with CAMP_COOKIE_NAME

      setCampaignObjectForGuid();
    }
  };
  /**
   * Updates campaign delivery preferences and tracking counters
   *
   * This function updates the campaign tracking object in the CAMP localstorage variables based on the campaign type,
   * increments appropriate show counters, and updates frequency control timestamps.
   *
   * @param {CampaignDetails} campaignDetails - The campaign information object
   * @param {any} wtq - Additional query parameters (if needed)
   * @returns {void}
   */

  const addDeliveryPreferenceDetails = (campaignDetails, logger) => {
    try {
      var _campaignDetails$disp, _campaignDetails$disp2, _campaignDetails$disp3;

      if (!campaignDetails || !campaignDetails.wzrk_id) {
        throw new Error('Invalid campaign details provided');
      }

      const campaignObj = getCampaignObject() || {};
      const campaignIdParts = campaignDetails.wzrk_id.split('_');
      const campaignId = campaignIdParts[0];
      const isCampaignExcludedFromFrequencyLimits = campaignDetails === null || campaignDetails === void 0 ? void 0 : (_campaignDetails$disp = campaignDetails.display) === null || _campaignDetails$disp === void 0 ? void 0 : _campaignDetails$disp.efc;

      if (!campaignId) {
        throw new Error('Failed to parse campaign ID');
      }

      const campaignType = campaignDetails === null || campaignDetails === void 0 ? void 0 : (_campaignDetails$disp2 = campaignDetails.display) === null || _campaignDetails$disp2 === void 0 ? void 0 : _campaignDetails$disp2.wtarget_type;
      const campaignTypeConfig = {
        [CAMPAIGN_TYPES.FOOTER_NOTIFICATION]: {
          showCountKey: 'wsc',
          frequencyControlKey: 'wfc',
          dailyCountKey: 'wmp'
        },
        [CAMPAIGN_TYPES.WEB_NATIVE_DISPLAY]: {
          showCountKey: 'wndsc',
          frequencyControlKey: 'wndfc',
          dailyCountKey: 'wndmp'
        }
      };
      const config = campaignTypeConfig[campaignType];

      if (!config) {
        throw new Error("Unsupported campaign type: ".concat(campaignType));
      }

      if (!isCampaignExcludedFromFrequencyLimits) {
        const showCountKey = config.showCountKey;
        const dailyCountKey = config.dailyCountKey;
        const currentShowCount = typeof campaignObj[showCountKey] === 'number' ? campaignObj[showCountKey] : 0;
        campaignObj[showCountKey] = currentShowCount + 1;
        campaignObj[dailyCountKey] = deliveryPreferenceUtils.getDailyCount(campaignObj, dailyCountKey);
      }

      if (campaignDetails === null || campaignDetails === void 0 ? void 0 : (_campaignDetails$disp3 = campaignDetails.display) === null || _campaignDetails$disp3 === void 0 ? void 0 : _campaignDetails$disp3.adp) {
        const frequencyControlKey = config.frequencyControlKey;
        campaignObj[frequencyControlKey] = deliveryPreferenceUtils.updateTimestampTracker([campaignId], campaignObj[frequencyControlKey] || {});
      }

      saveCampaignObject(campaignObj);
    } catch (error) {
      logger.error("Campaign delivery preference update failed: ".concat(error.message));
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
            /* TODO: Check if Webinbox needs these keys or get rid of them */

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
            finalCampObj = { ...finalCampObj,
              wsc: campObj.wsc,
              wfc: campObj.wfc,
              woc: campObj.woc,
              wmp: campObj.wmp,
              dnd: campObj.dnd,
              wndsc: campObj.wndsc,
              wndfc: campObj.wndfc,
              wndoc: campObj.wndoc,
              wndmp: campObj.wndmp
            };
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
      var _campObj$wsc, _campObj, _campObj$wfc, _campObj2, _campObj$woc, _campObj3, _campObj$wndsc, _campObj4, _campObj$wndfc, _campObj5, _campObj$wndoc, _campObj6;

      let resultObj = {};
      campObj = getCampaignObject();
      const storageValue = StorageManager.read(CAMP_COOKIE_G);
      const decodedValue = storageValue ? decodeURIComponent(storageValue) : null;
      const parsedValue = decodedValue ? JSON.parse(decodedValue) : null;
      const resultObjWI = !!guid && storageValue !== undefined && storageValue !== null && parsedValue && parsedValue[guid] && parsedValue[guid].wi ? Object.values(parsedValue[guid].wi) : [];
      const webPopupDeliveryPreferenceDeatils = {
        wsc: (_campObj$wsc = (_campObj = campObj) === null || _campObj === void 0 ? void 0 : _campObj.wsc) !== null && _campObj$wsc !== void 0 ? _campObj$wsc : 0,
        wfc: (_campObj$wfc = (_campObj2 = campObj) === null || _campObj2 === void 0 ? void 0 : _campObj2.wfc) !== null && _campObj$wfc !== void 0 ? _campObj$wfc : {},
        woc: (_campObj$woc = (_campObj3 = campObj) === null || _campObj3 === void 0 ? void 0 : _campObj3.woc) !== null && _campObj$woc !== void 0 ? _campObj$woc : {}
      };
      const webNativeDisplayDeliveryPreferenceDeatils = {
        wndsc: (_campObj$wndsc = (_campObj4 = campObj) === null || _campObj4 === void 0 ? void 0 : _campObj4.wndsc) !== null && _campObj$wndsc !== void 0 ? _campObj$wndsc : 0,
        wndfc: (_campObj$wndfc = (_campObj5 = campObj) === null || _campObj5 === void 0 ? void 0 : _campObj5.wndfc) !== null && _campObj$wndfc !== void 0 ? _campObj$wndfc : {},
        wndoc: (_campObj$wndoc = (_campObj6 = campObj) === null || _campObj6 === void 0 ? void 0 : _campObj6.wndoc) !== null && _campObj$wndoc !== void 0 ? _campObj$wndoc : {}
      };
      const today = getToday(); // let todayCwp = 0

      let todayCwi = 0;

      if (campObj.wi && campObj.wi[today] && campObj.wi[today].tc !== 'undefined') {
        todayCwi = campObj.wi[today].tc;
      } // CAMP Is generated here


      resultObj = {
        wimp: todayCwi,
        witlc: resultObjWI,
        ...webPopupDeliveryPreferenceDeatils,
        ...webNativeDisplayDeliveryPreferenceDeatils
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

          if (profileKey === 'Gender' && !profileVal.match(/\b(?:[mM](?:ale)?|[fF](?:emale)?|[oO](?:thers)?|[uU](?:nknown)?)\b/)) {
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
        var _campaignObj$dnd;

        const campaignObj = getCampaignObject(); // CurrentSesion Id is the problem

        campaignObj.dnd = [...new Set([...((_campaignObj$dnd = campaignObj.dnd) !== null && _campaignObj$dnd !== void 0 ? _campaignObj$dnd : []), campaignId])];
        saveCampaignObject(campaignObj);
      }
    }

    if ($ct.campaignDivMap != null) {
      const divId = $ct.campaignDivMap[campaignId];

      if (divId != null) {
        document.getElementById(divId).remove();

        if (divId === 'intentPreview') {
          if (document.getElementById('intentOpacityDiv') != null) {
            document.getElementById('intentOpacityDiv').remove();
          }
        } else if (divId === 'wizParDiv0') {
          if (document.getElementById('intentOpacityDiv0') != null) {
            document.getElementById('intentOpacityDiv0').remove();
          }
        } else if (divId === 'wizParDiv2') {
          if (document.getElementById('intentOpacityDiv2') != null) {
            document.getElementById('intentOpacityDiv2').remove();
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

  var _logger$7 = _classPrivateFieldLooseKey("logger");

  var _request$5 = _classPrivateFieldLooseKey("request");

  var _account$6 = _classPrivateFieldLooseKey("account");

  var _oldValues$3 = _classPrivateFieldLooseKey("oldValues");

  var _isPersonalisationActive$3 = _classPrivateFieldLooseKey("isPersonalisationActive");

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
      Object.defineProperty(this, _logger$7, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$5, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$6, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive$3, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger$7)[_logger$7] = logger;
      _classPrivateFieldLooseBase(this, _request$5)[_request$5] = request;
      _classPrivateFieldLooseBase(this, _account$6)[_account$6] = account;
      _classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3] = values;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$3)[_isPersonalisationActive$3] = isPersonalisationActive;
    }

    push() {
      if (StorageManager.readFromLSorCookie(ACCOUNT_ID)) {
        for (var _len = arguments.length, profilesArr = new Array(_len), _key = 0; _key < _len; _key++) {
          profilesArr[_key] = arguments[_key];
        }

        _classPrivateFieldLooseBase(this, _processProfileArray)[_processProfileArray](profilesArr);

        return 0;
      } else {
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].error('Account ID is not set');
      }
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3]) {
        _classPrivateFieldLooseBase(this, _processProfileArray)[_processProfileArray](_classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$3)[_oldValues$3] = null;
    }

    getAttribute(propName) {
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$3)[_isPersonalisationActive$3]()) {
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
        data = _classPrivateFieldLooseBase(this, _request$5)[_request$5].addSystemDataToObject(data, true);

        _classPrivateFieldLooseBase(this, _request$5)[_request$5].addFlags(data);

        const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]);

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

        _classPrivateFieldLooseBase(this, _request$5)[_request$5].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
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
            _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].error('Array supports only string or number type values');
          }
        });
      } else if (typeof propVal === 'string' || typeof propVal === 'number') {
        addValue(propVal);
      } else {
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].error('Unsupported value type');

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
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].error("The property ".concat(propKey, " does not exist."));

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
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].error('Unsupported propVal type');

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
        _classPrivateFieldLooseBase(this, _logger$7)[_logger$7].error("The property ".concat(propKey, " does not exist."));
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
      data = _classPrivateFieldLooseBase(this, _request$5)[_request$5].addSystemDataToObject(data, true);

      _classPrivateFieldLooseBase(this, _request$5)[_request$5].addFlags(data);

      const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]);

      let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

      pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

      _classPrivateFieldLooseBase(this, _request$5)[_request$5].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
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
              logger: _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]
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
                logger: _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]
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
            data = _classPrivateFieldLooseBase(this, _request$5)[_request$5].addSystemDataToObject(data, undefined);

            _classPrivateFieldLooseBase(this, _request$5)[_request$5].addFlags(data);

            const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$7)[_logger$7]);

            let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$6)[_account$6].dataPostURL;

            pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
            pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

            _classPrivateFieldLooseBase(this, _request$5)[_request$5].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
          }
        }
      }
    }
  };

  var _request$4 = _classPrivateFieldLooseKey("request");

  var _logger$6 = _classPrivateFieldLooseKey("logger");

  var _account$5 = _classPrivateFieldLooseKey("account");

  var _session$2 = _classPrivateFieldLooseKey("session");

  var _oldValues$2 = _classPrivateFieldLooseKey("oldValues");

  var _device$2 = _classPrivateFieldLooseKey("device");

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
      Object.defineProperty(this, _request$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$6, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$5, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _device$2, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _request$4)[_request$4] = request;
      _classPrivateFieldLooseBase(this, _account$5)[_account$5] = account;
      _classPrivateFieldLooseBase(this, _session$2)[_session$2] = session;
      _classPrivateFieldLooseBase(this, _logger$6)[_logger$6] = logger;
      _classPrivateFieldLooseBase(this, _oldValues$2)[_oldValues$2] = values;
      _classPrivateFieldLooseBase(this, _device$2)[_device$2] = device;
    } // On User Login


    clear() {
      _classPrivateFieldLooseBase(this, _logger$6)[_logger$6].debug('clear called. Reset flag has been set.');

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
          _classPrivateFieldLooseBase(this, _device$2)[_device$2].gcookie = gFromCache;
          const lastK = $ct.LRU_CACHE.getSecondLastKey();

          if (StorageManager.readFromLSorCookie(FIRE_PUSH_UNREGISTERED) && lastK !== -1) {
            // CACHED OLD USER FOUND. TRANSFER PUSH TOKEN TO THIS USER
            const lastGUID = $ct.LRU_CACHE.cache[lastK];

            _classPrivateFieldLooseBase(this, _request$4)[_request$4].unregisterTokenForGuid(lastGUID);
          }
        } else {
          if (!anonymousUser) {
            this.clear();
          } else {
            if (g != null) {
              _classPrivateFieldLooseBase(this, _device$2)[_device$2].gcookie = g;
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
              logger: _classPrivateFieldLooseBase(this, _logger$6)[_logger$6]
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
                logger: _classPrivateFieldLooseBase(this, _logger$6)[_logger$6]
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
            data = _classPrivateFieldLooseBase(this, _request$4)[_request$4].addSystemDataToObject(data, undefined);

            _classPrivateFieldLooseBase(this, _request$4)[_request$4].addFlags(data); // Adding 'isOUL' flag in true for OUL cases which.
            // This flag tells LC to create a new arp object.
            // Also we will receive the same flag in response arp which tells to delete existing arp object.


            if (sendOULFlag) {
              data[IS_OUL] = true;
            }

            const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$6)[_logger$6]);

            let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$5)[_account$5].dataPostURL;

            pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
            pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData); // Whenever sendOULFlag is true then dont send arp and gcookie (guid in memory in the request)
            // Also when this flag is set we will get another flag from LC in arp which tells us to delete arp
            // stored in the cache and replace it with the response arp.

            _classPrivateFieldLooseBase(this, _request$4)[_request$4].saveAndFireRequest(pageLoadUrl, $ct.blockRequest, sendOULFlag);
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
    StorageManager.removeCookie(_classPrivateFieldLooseBase(this, _session$2)[_session$2].cookieName, $ct.broadDomain);
    StorageManager.removeCookie(ARP_COOKIE, $ct.broadDomain);

    _classPrivateFieldLooseBase(this, _session$2)[_session$2].setSessionCookieObject('');
  };

  var _deleteUser2 = function _deleteUser2() {
    $ct.blockRequest = true;

    _classPrivateFieldLooseBase(this, _logger$6)[_logger$6].debug('Block request is true');

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
    StorageManager.removeCookie(_classPrivateFieldLooseBase(this, _session$2)[_session$2].cookieName, $ct.broadDomain);
    StorageManager.removeCookie(ARP_COOKIE, $ct.broadDomain);
    _classPrivateFieldLooseBase(this, _device$2)[_device$2].gcookie = null;

    _classPrivateFieldLooseBase(this, _session$2)[_session$2].setSessionCookieObject('');
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
          _classPrivateFieldLooseBase(this, _logger$6)[_logger$6].debug(e);
        }
      } else {
        _classPrivateFieldLooseBase(this, _logger$6)[_logger$6].error('Profile object is in incorrect format');
      }
    }
  };

  const getBoxPromptStyles = style => {
    const totalBorderWidth = style.card.borderEnabled ? style.card.border.borderWidth * 2 : 0;
    const cardPadding = 16 * 2; // Left and right padding

    const cardContentWidth = 360 - cardPadding - totalBorderWidth;
    return "\n    #pnWrapper {\n      width: 360px;\n      font-family: proxima-nova, Arial, sans-serif;\n    }\n    \n    #pnWrapper * {\n       margin: 0px;\n       padding: 0px;\n       text-align: left;\n    }\n    ".concat(style.overlay.enabled ? "#pnOverlay {\n      background-color: ".concat(style.overlay.color || 'rgba(0, 0, 0, .15)', ";\n      position: fixed;\n      left: 0;\n      right: 0;\n      top: 0;\n      bottom: 0;\n      z-index: 10000\n    }\n") : '', "\n    #pnCard {\n      background-color: ").concat(style.card.color, ";\n      border-radius: ").concat(style.card.borderRadius, "px;\n      padding: 16px;\n      width: ").concat(cardContentWidth, "px;\n      position: fixed;\n      z-index: 999999;\n      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n      ").concat(style.card.borderEnabled ? "\n        border-width: ".concat(style.card.border.borderWidth, "px;\n        border-color: ").concat(style.card.border.borderColor, ";\n        border-style: solid;\n      ") : '', "\n      height: fit-content;\n    }\n\n    #iconTitleDescWrapper {\n      display: flex;\n      align-items: center;\n      margin-bottom: 16px;\n      gap: 12px;\n    }\n\n    #iconContainer {\n      min-width: 64px;\n      max-width: 64px;\n      aspect-ratio: 1;\n      object-fit: cover;\n    }\n\n    #titleDescWrapper {\n      flex-grow: 1;\n      overflow: hidden;\n      overflow-wrap: break-word;\n    }\n\n    #title {\n      font-size: 16px;\n      font-weight: 700;\n      color: ").concat(style.text.titleColor, ";\n      margin-bottom: 4px;\n      line-height: 24px;\n    }\n\n    #description {\n      font-size: 14px;\n      font-weight: 500;\n      color: ").concat(style.text.descriptionColor, ";\n      line-height: 20px;\n    }\n\n    #buttonsContainer {\n      display: flex;\n      justify-content: space-between;\n      min-height: 32px;\n      gap: 8px;\n      align-items: center;\n    }\n\n    #primaryButton, #secondaryButton {\n      padding: 6px 24px;\n      flex: 1;\n      cursor: pointer;\n      font-weight: bold;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      height: max-content;\n      font-size: 14px;\n      font-weight: 500;\n      line-height: 20px;\n      text-align: center;\n    }\n\n    #primaryButton {\n      background-color: ").concat(style.buttons.primaryButton.buttonColor, ";\n      color: ").concat(style.buttons.primaryButton.textColor, ";\n      border-radius: ").concat(style.buttons.primaryButton.borderRadius, "px;\n      ").concat(style.buttons.primaryButton.borderEnabled ? "\n          border-width: ".concat(style.buttons.primaryButton.border.borderWidth, "px;\n          border-color: ").concat(style.buttons.primaryButton.border.borderColor, ";\n          border-style: solid;\n        ") : 'border: none;', "\n    }\n\n    #secondaryButton {\n      background-color: ").concat(style.buttons.secondaryButton.buttonColor, ";\n      color: ").concat(style.buttons.secondaryButton.textColor, ";\n      border-radius: ").concat(style.buttons.secondaryButton.borderRadius, "px;\n      ").concat(style.buttons.secondaryButton.borderEnabled ? "\n          border-width: ".concat(style.buttons.secondaryButton.border.borderWidth, "px;\n          border-color: ").concat(style.buttons.secondaryButton.border.borderColor, ";\n          border-style: solid;\n        ") : 'border: none;', "\n    }\n\n    #primaryButton:hover, #secondaryButton:hover {\n      opacity: 0.9;\n    }\n  ");
  };
  const getBellIconStyles = style => {
    return "\n    #bell_wrapper {\n      position: fixed;\n      cursor: pointer;\n      background-color: ".concat(style.card.backgroundColor, ";\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n      width: 48px;\n      height: 48px;\n      border-radius: 50%;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      z-index: 999999;\n    }\n\n    #bell_icon {\n      display: block;\n      width: 48px;\n      height: 48px;\n    }\n\n    #bell_wrapper:hover {\n      transform: scale(1.05);\n      transition: transform 0.2s ease-in-out;\n    }\n\n    #bell_tooltip {\n      display: none;\n      background-color: #2b2e3e;\n      color: #fff;\n      border-radius: 4px;\n      padding: 4px;\n      white-space: nowrap;\n      pointer-events: none;\n      font-size: 14px;\n      line-height: 1.4;\n    }\n\n    #gif_modal {\n      display: none;\n      background-color: #ffffff;\n      padding: 4px;\n      width: 400px;\n      height: 256px;\n      border-radius: 4px;\n      position: relative;\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n      cursor: default;\n    }\n\n    #gif_image {\n      object-fit: contain;\n      width: 100%;\n      height: 100%;\n    }\n\n    #close_modal {\n      position: absolute;\n      width: 24px;\n      height: 24px;\n      top: 8px;\n      right: 8px;\n      background: rgba(238, 238, 238, 0.8);\n      text-align: center;\n      line-height: 20px;\n      border-radius: 4px;\n      color: #000000;\n      font-size: 22px;\n      cursor: pointer;\n    }\n  ");
  };

  const isChrome = () => {
    const ua = navigator.userAgent;
    return ua.includes('Chrome') || ua.includes('CriOS');
  };
  const isFirefox = () => {
    const ua = navigator.userAgent;
    return ua.includes('Firefox') || ua.includes('FxiOS');
  };
  const isSafari = () => {
    const ua = navigator.userAgent; // Ignoring the False Positive of Safari on iOS devices because it gives Safari in all Browsers

    return ua.includes('Safari') && !ua.includes('CriOS') && !ua.includes('FxiOS') && !ua.includes('Chrome') && !ua.includes('Firefox');
  };
  /**
   * Recursively checks if an object contains an array or a function at any level of nesting.
   *
   * @param {Object} obj - The object to check.
   * @returns {boolean} - Returns `true` if the object contains an array or function, otherwise `false`.
   */

  const objectHasNestedArrayOrFunction = obj => {
    if (!obj || typeof obj !== 'object') return false;
    if (Array.isArray(obj)) return true;
    return Object.values(obj).some(value => typeof value === 'function' || objectHasNestedArrayOrFunction(value));
  };
  /**
   * Flattens a nested object into a single-level object using dot notation.
   * Arrays are ignored in this transformation.
   *
   * @param {Object} obj - The object to be flattened.
   * @param {string} [parentKey=""] - The parent key for recursion (used internally).
   * @returns {Object} - The transformed object with dot notation keys.
   */

  const flattenObjectToDotNotation = function (obj) {
    let parentKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const result = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newKey = parentKey ? "".concat(parentKey, ".").concat(key) : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Recursively process nested objects
          Object.assign(result, flattenObjectToDotNotation(value, newKey));
        } else if (!Array.isArray(value)) {
          // Assign non-array values directly
          result[newKey] = {
            defaultValue: value,
            type: typeof value
          };
        }
      }
    }

    return result;
  };
  /**
   * Reconstructs an object from a flat key-value structure using dot notation.
   *
   * @param {Object} payload - The input object with flat dot notation keys.
   * @returns {Object} - The reconstructed object with proper nesting.
   */

  const reconstructNestedObject = payload => {
    const result = {};

    for (const key in payload) {
      if (Object.hasOwnProperty.call(payload, key)) {
        const value = payload[key];
        const keys = key.split('.'); // Split keys on dot notation

        let current = result;
        keys.forEach((part, index) => {
          if (index === keys.length - 1) {
            // Assign value at the last key level
            current[part] = value;
          } else {
            // Ensure intermediate levels exist
            current = current[part] = current[part] || {};
          }
        });
      }
    }

    return result;
  };
  /**
   * Validates and sanitizes a custom CleverTap ID based on platform rules.
   *
   * Rules:
   * - Must be between 1 and 64 characters in length.
   * - Allowed characters: A-Z, a-z, 0-9, (, ), !, :, @, $, _, -
   * - Automatically lowercases the ID.
   *
   * @param {string} id - The custom CleverTap ID to validate.
   * @returns {{ isValid: boolean, error?: string, sanitizedId?: string }} - Validation result.
   */

  function validateCustomCleverTapID(id) {
    if (typeof id !== 'string') {
      return {
        isValid: false,
        error: 'ID must be a string.'
      };
    }

    const lowercaseId = id.toLowerCase();
    const length = lowercaseId.length;

    if (length < 1 || length > 64) {
      return {
        isValid: false,
        error: 'ID must be between 1 and 64 characters.'
      };
    }

    const allowedPattern = /^[a-z0-9()!:@$_-]+$/;

    if (!allowedPattern.test(lowercaseId)) {
      return {
        isValid: false,
        error: 'ID contains invalid characters. Only A-Z, a-z, 0-9, (, ), !, :, @, $, _, - are allowed.'
      };
    }

    return {
      isValid: true,
      sanitizedId: addWebPrefix(lowercaseId)
    };
  }
  /**
   * Adds a `_w_` prefix to a sanitized CleverTap ID for web.
   *
   * - Converts the ID to lowercase.
   * - Does not validate the characters or length — assumes the ID is already valid.
   *
   * @param {string} id - The custom CleverTap ID.
   * @returns {string} - The prefixed and lowercased CleverTap ID.
   */

  function addWebPrefix(id) {
    if (typeof id !== 'string') {
      throw new Error('ID must be a string');
    }

    return "".concat(CUSTOM_CT_ID_PREFIX).concat(id.toLowerCase());
  }

  var _oldValues$1 = _classPrivateFieldLooseKey("oldValues");

  var _logger$5 = _classPrivateFieldLooseKey("logger");

  var _request$3 = _classPrivateFieldLooseKey("request");

  var _account$4 = _classPrivateFieldLooseKey("account");

  var _wizAlertJSPath = _classPrivateFieldLooseKey("wizAlertJSPath");

  var _fcmPublicKey = _classPrivateFieldLooseKey("fcmPublicKey");

  var _setUpWebPush = _classPrivateFieldLooseKey("setUpWebPush");

  var _isNativeWebPushSupported = _classPrivateFieldLooseKey("isNativeWebPushSupported");

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
      Object.defineProperty(this, _isNativeWebPushSupported, {
        value: _isNativeWebPushSupported2
      });
      Object.defineProperty(this, _setUpWebPush, {
        value: _setUpWebPush2
      });
      Object.defineProperty(this, _oldValues$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$5, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$4, {
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
      _classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1] = values;
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5] = logger;
      _classPrivateFieldLooseBase(this, _request$3)[_request$3] = request;
      _classPrivateFieldLooseBase(this, _account$4)[_account$4] = account;
    }

    setupWebPush(displayArgs) {
      /*
        A method in notification.js which can be accessed in prompt.js file to call the
        private method this.#setUpWebPush
      */
      _classPrivateFieldLooseBase(this, _setUpWebPush)[_setUpWebPush](displayArgs);
    }

    push() {
      if (StorageManager.readFromLSorCookie(ACCOUNT_ID)) {
        /*
          To handle a potential race condition, two flags are stored in Local Storage:
          - `webPushConfigResponseReceived`: Indicates if the backend's webPushConfig has been received (set during the initial API call without a session ID).
          - `NOTIFICATION_PUSH_METHOD_DEFERRED`: Tracks if `clevertap.notifications.push` was called before receiving the webPushConfig.
           This ensures the soft prompt is rendered correctly:
          - If `webPushConfigResponseReceived` is true, the soft prompt is processed immediately.
          - Otherwise, `NOTIFICATION_PUSH_METHOD_DEFERRED` is set to true, and the rendering is deferred until the webPushConfig is received.
        */
        const isWebPushConfigPresent = StorageManager.readFromLSorCookie(WEBPUSH_CONFIG_RECEIVED);
        const isApplicationServerKeyReceived = StorageManager.readFromLSorCookie(APPLICATION_SERVER_KEY_RECEIVED);

        for (var _len = arguments.length, displayArgs = new Array(_len), _key = 0; _key < _len; _key++) {
          displayArgs[_key] = arguments[_key];
        }

        setNotificationHandlerValues({
          logger: _classPrivateFieldLooseBase(this, _logger$5)[_logger$5],
          account: _classPrivateFieldLooseBase(this, _account$4)[_account$4],
          request: _classPrivateFieldLooseBase(this, _request$3)[_request$3],
          displayArgs,
          fcmPublicKey: _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey]
        });

        if (isWebPushConfigPresent && isApplicationServerKeyReceived) {
          processSoftPrompt();
        } else {
          StorageManager.saveToLSorCookie(NOTIFICATION_PUSH_METHOD_DEFERRED, true);
        }
      } else {
        _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Account ID is not set');
      }
    }

    _processOldValues() {
      if (_classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1]) {
        if (Array.isArray(_classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1]) && _classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1].length > 0) {
          setNotificationHandlerValues({
            logger: _classPrivateFieldLooseBase(this, _logger$5)[_logger$5],
            account: _classPrivateFieldLooseBase(this, _account$4)[_account$4],
            request: _classPrivateFieldLooseBase(this, _request$3)[_request$3],
            displayArgs: _classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1].slice(),
            fcmPublicKey: _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey]
          });
          StorageManager.saveToLSorCookie(NOTIFICATION_PUSH_METHOD_DEFERRED, true);
        }

        _classPrivateFieldLooseBase(this, _setUpWebPush)[_setUpWebPush](_classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1]);
      }

      _classPrivateFieldLooseBase(this, _oldValues$1)[_oldValues$1] = null;
    }

    setUpWebPushNotifications(subscriptionCallback, serviceWorkerPath, apnsWebPushId, apnsServiceUrl) {
      if (isChrome() || isFirefox()) {
        _classPrivateFieldLooseBase(this, _setUpChromeFirefoxNotifications)[_setUpChromeFirefoxNotifications](subscriptionCallback, serviceWorkerPath);
      } else if (isSafari()) {
        _classPrivateFieldLooseBase(this, _setUpSafariNotifications)[_setUpSafariNotifications](subscriptionCallback, apnsWebPushId, apnsServiceUrl, serviceWorkerPath);
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

      const isNotificationPushCalled = StorageManager.readFromLSorCookie(NOTIFICATION_PUSH_METHOD_DEFERRED);

      if (isNotificationPushCalled) {
        return;
      }

      if ($ct.webPushEnabled && $ct.notifApi.notifEnabledFromApi) {
        _classPrivateFieldLooseBase(this, _handleNotificationRegistration)[_handleNotificationRegistration]($ct.notifApi.displayArgs);
      } else if (!$ct.webPushEnabled && $ct.notifApi.notifEnabledFromApi) ;
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

  var _isNativeWebPushSupported2 = function _isNativeWebPushSupported2() {
    return 'PushManager' in window;
  };

  var _setUpSafariNotifications2 = function _setUpSafariNotifications2(subscriptionCallback, apnsWebPushId, apnsServiceUrl, serviceWorkerPath) {
    const softPromptCard = document.getElementById('pnWrapper');
    const oldSoftPromptCard = document.getElementById('wzrk_wrapper');

    if (_classPrivateFieldLooseBase(this, _isNativeWebPushSupported)[_isNativeWebPushSupported]() && _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] != null) {
      StorageManager.setMetaProp(VAPID_MIGRATION_PROMPT_SHOWN, true);
      navigator.serviceWorker.register(serviceWorkerPath).then(registration => {
        window.Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            const subscribeObj = {
              applicationServerKey: _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey],
              userVisibleOnly: true
            };

            _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Sub Obj' + JSON.stringify(subscribeObj));

            const subscribeForPush = () => {
              registration.pushManager.subscribe(subscribeObj).then(subscription => {
                _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Service Worker registered. Endpoint: ' + subscription.endpoint);

                _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Service Data Sent: ' + JSON.stringify({
                  applicationServerKey: _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey],
                  userVisibleOnly: true
                }));

                _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Subscription Data Received: ' + JSON.stringify(subscription));

                const subscriptionData = JSON.parse(JSON.stringify(subscription));
                subscriptionData.endpoint = subscriptionData.endpoint.split('/').pop();
                StorageManager.saveToLSorCookie(PUSH_SUBSCRIPTION_DATA, subscriptionData);

                _classPrivateFieldLooseBase(this, _request$3)[_request$3].registerToken(subscriptionData);

                if (typeof subscriptionCallback !== 'undefined' && typeof subscriptionCallback === 'function') {
                  subscriptionCallback();
                }

                const existingBellWrapper = document.getElementById('bell_wrapper');

                if (existingBellWrapper) {
                  existingBellWrapper.parentNode.removeChild(existingBellWrapper);
                }

                if (softPromptCard) {
                  softPromptCard.parentNode.removeChild(softPromptCard);
                }

                if (oldSoftPromptCard) {
                  oldSoftPromptCard.parentNode.removeChild(oldSoftPromptCard);
                }
              });
            };

            const serviceWorker = registration.installing || registration.waiting || registration.active;

            if (serviceWorker && serviceWorker.state === 'activated') {
              // Already activated, proceed with subscription
              subscribeForPush();
            } else if (serviceWorker) {
              // Listen for state changes to handle activation
              serviceWorker.addEventListener('statechange', event => {
                if (event.target.state === 'activated') {
                  _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Service Worker activated. Proceeding with subscription.');

                  subscribeForPush();
                }
              });
            }
          } else if (permission === 'denied') {
            _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Error subscribing to Safari web push');

            if (softPromptCard) {
              softPromptCard.parentNode.removeChild(softPromptCard);
            }

            if (oldSoftPromptCard) {
              oldSoftPromptCard.parentNode.removeChild(oldSoftPromptCard);
            }
          }
        });
      });
    } else {
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

            _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Service Data Sent: ' + JSON.stringify({
              apnsServiceUrl,
              apnsWebPushId
            }));

            _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Subscription Data Received: ' + JSON.stringify(subscription));

            const existingBellWrapper = document.getElementById('bell_wrapper');

            if (existingBellWrapper) {
              existingBellWrapper.parentNode.removeChild(existingBellWrapper);
            }

            if (softPromptCard) {
              softPromptCard.parentNode.removeChild(softPromptCard);
            }

            if (oldSoftPromptCard) {
              oldSoftPromptCard.parentNode.removeChild(oldSoftPromptCard);
            }

            StorageManager.saveToLSorCookie(PUSH_SUBSCRIPTION_DATA, subscriptionData);

            _classPrivateFieldLooseBase(this, _request$3)[_request$3].registerToken(subscriptionData);

            _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Safari Web Push registered. Device Token: ' + subscription.deviceToken);
          } else if (subscription.permission === 'denied') {
            _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Error subscribing to Safari web push');

            if (softPromptCard) {
              softPromptCard.parentNode.removeChild(softPromptCard);
            }

            if (oldSoftPromptCard) {
              oldSoftPromptCard.parentNode.removeChild(oldSoftPromptCard);
            }
          }
        });
      }
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
          if (isChrome()) {
            return new Promise(resolve => setTimeout(() => resolve(registration), 5000));
          } else {
            return navigator.serviceWorker.getRegistrations();
          }
        }
      }).then(serviceWorkerRegistration => {
        // ITS AN ARRAY IN CASE OF FIREFOX, SO USE THE REGISTRATION WITH PROPER SCOPE
        if (isFirefox() && Array.isArray(serviceWorkerRegistration)) {
          serviceWorkerRegistration = serviceWorkerRegistration.filter(i => i.scope === registrationScope)[0];
        }

        const subscribeObj = {
          userVisibleOnly: true
        };

        if (_classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] != null) {
          subscribeObj.applicationServerKey = urlBase64ToUint8Array(_classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey]);
        }

        const softPromptCard = document.getElementById('pnWrapper');
        const oldSoftPromptCard = document.getElementById('wzrk_wrapper');
        serviceWorkerRegistration.pushManager.subscribe(subscribeObj).then(subscription => {
          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].info('Service Worker registered. Endpoint: ' + subscription.endpoint);

          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].debug('Service Data Sent: ' + JSON.stringify(subscribeObj));

          _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].debug('Subscription Data Received: ' + JSON.stringify(subscription)); // convert the subscription keys to strings; this sets it up nicely for pushing to LC


          const subscriptionData = JSON.parse(JSON.stringify(subscription)); // remove the common chrome/firefox endpoint at the beginning of the token

          if (isChrome()) {
            subscriptionData.endpoint = subscriptionData.endpoint.split('/').pop();
            subscriptionData.browser = 'Chrome';
          } else if (isFirefox()) {
            subscriptionData.endpoint = subscriptionData.endpoint.split('/').pop();
            subscriptionData.browser = 'Firefox';
          }

          StorageManager.saveToLSorCookie(PUSH_SUBSCRIPTION_DATA, subscriptionData);

          _classPrivateFieldLooseBase(this, _request$3)[_request$3].registerToken(subscriptionData);

          if (typeof subscriptionCallback !== 'undefined' && typeof subscriptionCallback === 'function') {
            subscriptionCallback();
          }

          const existingBellWrapper = document.getElementById('bell_wrapper');

          if (existingBellWrapper) {
            existingBellWrapper.parentNode.removeChild(existingBellWrapper);
          }

          if (softPromptCard) {
            softPromptCard.parentNode.removeChild(softPromptCard);
          }

          if (oldSoftPromptCard) {
            oldSoftPromptCard.parentNode.removeChild(oldSoftPromptCard);
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

          if (softPromptCard) {
            softPromptCard.parentNode.removeChild(softPromptCard);
          }

          if (oldSoftPromptCard) {
            oldSoftPromptCard.parentNode.removeChild(oldSoftPromptCard);
          }
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
    let okButtonAriaLabel;
    let rejectButtonAriaLabel;
    const vapidSupportedAndMigrated = isSafari() && 'PushManager' in window && StorageManager.getMetaProp(VAPID_MIGRATION_PROMPT_SHOWN) && _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] !== null;

    if (displayArgs.length === 1) {
      if (isObject(displayArgs[0])) {
        const notifObj = displayArgs[0];
        titleText = notifObj.titleText;
        bodyText = notifObj.bodyText;
        okButtonText = notifObj.okButtonText;
        rejectButtonText = notifObj.rejectButtonText;
        okButtonAriaLabel = notifObj.okButtonAriaLabel;
        rejectButtonAriaLabel = notifObj.rejectButtonAriaLabel;
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
    } // Used for Shopify Web Push mentioned here
    // (https://wizrocket.atlassian.net/wiki/spaces/TAMKB/pages/1824325665/Implementing+Web+Push+in+Shopify+if+not+using+the+Shopify+App+approach)


    const isHTTP = httpsPopupPath != null && httpsIframePath != null; // make sure the site is on https for chrome notifications

    if (window.location.protocol !== 'https:' && document.location.hostname !== 'localhost' && !isHTTP) {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Make sure you are https or localhost to register for notifications');

      return;
    }
    /*
       If it is chrome or firefox and the nativeWebPush is not supported then return
       For Safari the APNs route is open if nativeWebPush is not supported
    */


    if (isChrome() || isFirefox()) {
      if (!_classPrivateFieldLooseBase(this, _isNativeWebPushSupported)[_isNativeWebPushSupported]()) {
        _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Web Push Notification is not supported on this browser');

        return;
      }
    } // we check for the cookie in setUpChromeNotifications() the tokens may have changed


    if (!isHTTP) {
      const hasNotification = ('Notification' in window);

      if (!hasNotification || Notification == null) {
        _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].error('Notification not supported on this Device or Browser');

        return;
      } // handle migrations from other services -> chrome notifications may have already been asked for before


      if (Notification.permission === 'granted' && (vapidSupportedAndMigrated || isChrome() || isFirefox())) {
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

    if (StorageManager.getMetaProp(NOTIF_LAST_TIME) == null) {
      StorageManager.setMetaProp(NOTIF_LAST_TIME, now);
    } else {
      if (askAgainTimeInSeconds == null) {
        // 7 days by default
        askAgainTimeInSeconds = 7 * 24 * 60 * 60;
      }

      const notifLastTime = StorageManager.getMetaProp(NOTIF_LAST_TIME);

      if (now - notifLastTime < askAgainTimeInSeconds) {
        if (!isSafari()) {
          return;
        } // If Safari is migrated already or only APNS, then return


        if (vapidSupportedAndMigrated || _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] === null) {
          return;
        }
      } else {
        StorageManager.setMetaProp(NOTIF_LAST_TIME, now);
      }
    }

    if (isSafari() && _classPrivateFieldLooseBase(this, _isNativeWebPushSupported)[_isNativeWebPushSupported]() && _classPrivateFieldLooseBase(this, _fcmPublicKey)[_fcmPublicKey] !== null) {
      StorageManager.setMetaProp(VAPID_MIGRATION_PROMPT_SHOWN, true);
    }

    if (StorageManager.readFromLSorCookie(POPUP_LOADING) || document.getElementById(OLD_SOFT_PROMPT_SELCTOR_ID)) {
      _classPrivateFieldLooseBase(this, _logger$5)[_logger$5].debug('Soft prompt wrapper is already loading or loaded');

      return;
    }

    StorageManager.saveToLSorCookie(POPUP_LOADING, true);

    _classPrivateFieldLooseBase(this, _addWizAlertJS)[_addWizAlertJS]().onload = () => {
      StorageManager.saveToLSorCookie(POPUP_LOADING, false); // create our wizrocket popup

      window.wzrkPermissionPopup.wizAlert({
        title: titleText,
        body: bodyText,
        confirmButtonText: okButtonText,
        confirmButtonColor: okButtonColor,
        rejectButtonText: rejectButtonText,
        confirmButtonAriaLabel: okButtonAriaLabel,
        rejectButtonAriaLabel: rejectButtonAriaLabel
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
  };

  const BELL_BASE64 = 'PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi40OTYyIDUuMjQzOTVDMTIuODM5MSA1LjAzMzE3IDEzLjI4NDcgNS4xNDY4OSAxMy40OTczIDUuNDg4NjdDMTMuNzIyMyA1Ljg1MDE4IDEzLjYwMDIgNi4zMjUxOCAxMy4yMzggNi41NDkwMkM3LjM5Mzk5IDEwLjE2MDYgMy41IDE2LjYyNTcgMy41IDI0LjAwMDNDMy41IDM1LjMyMjEgMTIuNjc4MiA0NC41MDAzIDI0IDQ0LjUwMDNDMjguMDA1NSA0NC41MDAzIDMxLjc0MjYgNDMuMzUxNSAzNC45IDQxLjM2NTVDMzUuMjYwOCA0MS4xMzg1IDM1Ljc0MTYgNDEuMjM4NiAzNS45NjY4IDQxLjYwMDZDMzYuMTc5MiA0MS45NDE5IDM2LjA4NSA0Mi4zOTExIDM1Ljc0NTIgNDIuNjA2QzMyLjM0NjggNDQuNzU1OSAyOC4zMTg3IDQ2LjAwMDMgMjQgNDYuMDAwM0MxMS44NDk3IDQ2LjAwMDMgMiAzNi4xNTA1IDIgMjQuMDAwM0MyIDE2LjA2NjkgNi4xOTkyMSA5LjExNDMyIDEyLjQ5NjIgNS4yNDM5NVpNMzguOCAzOS45MDAzQzM4LjggNDAuMzk3MyAzOC4zOTcxIDQwLjgwMDMgMzcuOSA0MC44MDAzQzM3LjQwMjkgNDAuODAwMyAzNyA0MC4zOTczIDM3IDM5LjkwMDNDMzcgMzkuNDAzMiAzNy40MDI5IDM5LjAwMDMgMzcuOSAzOS4wMDAzQzM4LjM5NzEgMzkuMDAwMyAzOC44IDM5LjQwMzIgMzguOCAzOS45MDAzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAxMkMyMi44OTU0IDEyIDIyIDEyLjg5NTQgMjIgMTRWMTQuMjUyQzE4LjU0OTUgMTUuMTQwMSAxNiAxOC4yNzIzIDE2IDIyVjI5LjVIMTUuNDc2OUMxNC42NjEyIDI5LjUgMTQgMzAuMTYxMiAxNCAzMC45NzY5VjMxLjAyMzFDMTQgMzEuODM4OCAxNC42NjEyIDMyLjUgMTUuNDc2OSAzMi41SDMyLjUyMzFDMzMuMzM4OCAzMi41IDM0IDMxLjgzODggMzQgMzEuMDIzMVYzMC45NzY5QzM0IDMwLjE2MTIgMzMuMzM4OCAyOS41IDMyLjUyMzEgMjkuNUgzMlYyMkMzMiAxOC4yNzIzIDI5LjQ1MDUgMTUuMTQwMSAyNiAxNC4yNTJWMTRDMjYgMTIuODk1NCAyNS4xMDQ2IDEyIDI0IDEyWk0yNiAzNFYzMy41SDIyVjM0QzIyIDM1LjEwNDYgMjIuODk1NCAzNiAyNCAzNkMyNS4xMDQ2IDM2IDI2IDM1LjEwNDYgMjYgMzRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
  const PROMPT_BELL_BASE64 = 'PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMwMEFFQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMS45OTg2IDIwQzMwLjkxOTggMjAgMzAuMDQyOCAyMC44NzQ2IDMwLjA0MjggMjEuOTUzNEwzMC4wNDI5IDIxLjk3MzRDMjYuNTQzNCAyMi41NTM1IDIzLjg3NSAyNS41OTQzIDIzLjg3NSAyOS4yNTgyVjM4LjA5OTVIMjMuODczNUMyMy4wNTg5IDM4LjA5OTUgMjIuMzk4NCAzOC43NiAyMi4zOTg0IDM5LjU3NDZDMjIuMzk4NCA0MC4zODkzIDIzLjA1ODkgNDEuMDQ5NyAyMy44NzM1IDQxLjA0OTdIMjkuNzgxMlY0MS43ODQyQzI5Ljc4MTIgNDMuMDA3NyAzMC43NzMxIDQzLjk5OTYgMzEuOTk2NiA0My45OTk2QzMzLjIyMDIgNDMuOTk5NiAzNC4yMTIgNDMuMDA3NyAzNC4yMTIgNDEuNzg0MlY0MS4wNDk3SDQwLjEyMzNDNDAuOTM4IDQxLjA0OTcgNDEuNTk4NCA0MC4zODkzIDQxLjU5ODQgMzkuNTc0NkM0MS41OTg0IDM4Ljc2IDQwLjkzOCAzOC4wOTk1IDQwLjEyMzMgMzguMDk5NUg0MC4xMjEyVjI5LjI1ODJDNDAuMTIxMiAyNS41OTQ2IDM3LjQ1MzMgMjIuNTU0MiAzMy45NTQzIDIxLjk3MzZMMzMuOTU0NCAyMS45NTM0QzMzLjk1NDQgMjAuODc0NiAzMy4wNzc1IDIwIDMxLjk5ODYgMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCBvcGFjaXR5PSIwLjUiIHg9IjcuNSIgeT0iNy41IiB3aWR0aD0iNDkiIGhlaWdodD0iNDkiIHJ4PSIyNC41IiBzdHJva2U9IndoaXRlIi8+CjxyZWN0IG9wYWNpdHk9IjAuMyIgeD0iNC41IiB5PSI0LjUiIHdpZHRoPSI1NSIgaGVpZ2h0PSI1NSIgcng9IjI3LjUiIHN0cm9rZT0id2hpdGUiLz4KPHJlY3Qgb3BhY2l0eT0iMC44IiB4PSIxMC41IiB5PSIxMC41IiB3aWR0aD0iNDMiIGhlaWdodD0iNDMiIHJ4PSIyMS41IiBzdHJva2U9IndoaXRlIi8+Cjwvc3ZnPgo=';

  let appServerKey = null;
  let swPath = '/clevertap_sw.js';
  let notificationHandler = null;
  let logger$1 = null;
  let account = null;
  let request = null;
  let displayArgs = null;
  let fcmPublicKey = null;
  const setNotificationHandlerValues = function () {
    let notificationValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    logger$1 = notificationValues.logger;
    account = notificationValues.account;
    request = notificationValues.request;
    displayArgs = notificationValues.displayArgs;
    fcmPublicKey = notificationValues.fcmPublicKey;
  };
  const processWebPushConfig = (webPushConfig, logger, request) => {
    StorageManager.saveToLSorCookie(WEBPUSH_CONFIG_RECEIVED, true);

    const updatePushConfig = () => {
      $ct.pushConfig = webPushConfig;
      StorageManager.saveToLSorCookie(WEBPUSH_CONFIG, webPushConfig);
    };

    updatePushConfig();

    if (webPushConfig.isPreview) {
      enablePush({
        logger,
        request
      });
    }

    try {
      const isNotificationPushCalled = StorageManager.readFromLSorCookie(NOTIFICATION_PUSH_METHOD_DEFERRED);

      if (isNotificationPushCalled) {
        try {
          processSoftPrompt();
        } catch (error) {
          logger.error('processs soft prompt' + error);
        }

        return;
      }
    } catch (error) {
      logger.error('Failed to process web push config:', error); // Fallback: Attempt to process soft prompt anyway

      processSoftPrompt();
    }
  };
  const processSoftPrompt = () => {
    const webPushConfig = StorageManager.readFromLSorCookie(WEBPUSH_CONFIG) || {};
    notificationHandler = new NotificationHandler({
      logger: logger$1,
      session: {},
      request,
      account
    });

    if (webPushConfig && !(Object.keys(webPushConfig).length > 0)) {
      notificationHandler.setApplicationServerKey(appServerKey);
      notificationHandler.setupWebPush(displayArgs);
      return;
    }

    const {
      showBox,
      showBellIcon,
      boxType
    } = webPushConfig;
    const {
      serviceWorkerPath,
      skipDialog,
      okCallback,
      subscriptionCallback,
      rejectCallback,
      apnsWebPushId,
      apnsWebPushServiceUrl
    } = parseDisplayArgs(displayArgs);
    const isSoftPromptNew = showBellIcon || showBox && boxType === 'new';

    if (isSoftPromptNew) {
      const enablePushParams = {
        serviceWorkerPath,
        skipDialog,
        okCallback,
        subscriptionCallback,
        rejectCallback,
        logger: logger$1,
        request,
        account,
        fcmPublicKey,
        apnsWebPushId,
        apnsWebPushServiceUrl
      };
      enablePush(enablePushParams);
    }

    if (showBox && boxType === 'old') {
      notificationHandler.setApplicationServerKey(appServerKey);
      notificationHandler.setupWebPush(displayArgs);
    }

    StorageManager.saveToLSorCookie(NOTIFICATION_PUSH_METHOD_DEFERRED, false);
    StorageManager.saveToLSorCookie(APPLICATION_SERVER_KEY_RECEIVED, false);
  };
  const parseDisplayArgs = displayArgs => {
    if (displayArgs && displayArgs.length === 1 && isObject(displayArgs[0])) {
      const {
        serviceWorkerPath,
        skipDialog,
        okCallback,
        subscriptionCallback,
        rejectCallback,
        apnsWebPushServiceUrl,
        apnsWebPushId
      } = displayArgs[0];
      return {
        serviceWorkerPath,
        skipDialog,
        okCallback,
        subscriptionCallback,
        rejectCallback,
        apnsWebPushServiceUrl,
        apnsWebPushId
      };
    }

    return {
      serviceWorkerPath: undefined,
      skipDialog: displayArgs[5],
      okCallback: undefined,
      subscriptionCallback: undefined,
      rejectCallback: undefined,
      apnsWebPushServiceUrl: undefined,
      apnsWebPushId: undefined
    };
  };
  const enablePush = enablePushParams => {
    const {
      serviceWorkerPath: customSwPath,
      okCallback,
      subscriptionCallback,
      rejectCallback,
      logger,
      fcmPublicKey,
      apnsWebPushId,
      apnsWebPushServiceUrl
    } = enablePushParams;
    let {
      skipDialog
    } = enablePushParams;

    const _pushConfig = StorageManager.readFromLSorCookie(WEBPUSH_CONFIG) || {};

    $ct.pushConfig = _pushConfig;

    if (!$ct.pushConfig) {
      logger.error('Web Push config data not present');
      return;
    }

    if (customSwPath) {
      swPath = customSwPath;
    }

    if (skipDialog === null) {
      skipDialog = false;
    } // notificationHandler = new NotificationHandler({ logger, session: {}, request, account })


    if (skipDialog) {
      notificationHandler.setApplicationServerKey(appServerKey);
      notificationHandler.setUpWebPushNotifications(subscriptionCallback, swPath, apnsWebPushId, apnsWebPushServiceUrl);
      return;
    }

    const {
      showBox,
      boxType,
      showBellIcon,
      isPreview
    } = $ct.pushConfig;

    if (isPreview) {
      if ($ct.pushConfig.boxConfig) createNotificationBox($ct.pushConfig, fcmPublicKey);
      if ($ct.pushConfig.bellIconConfig) createBellIcon($ct.pushConfig);
    } else {
      if (showBox && boxType === 'new') createNotificationBox($ct.pushConfig, fcmPublicKey, okCallback, subscriptionCallback, rejectCallback, apnsWebPushId, apnsWebPushServiceUrl);
      if (showBellIcon) createBellIcon($ct.pushConfig, subscriptionCallback, apnsWebPushId, apnsWebPushServiceUrl);
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

  const createNotificationBox = (configData, fcmPublicKey, okCallback, subscriptionCallback, rejectCallback, apnsWebPushId, apnsWebPushServiceUrl) => {
    var _content$icon;

    if (document.getElementById(NEW_SOFT_PROMPT_SELCTOR_ID)) return;
    const {
      boxConfig: {
        content,
        style
      }
    } = configData; // Create the wrapper div

    const wrapper = createElementWithAttributes('div', {
      id: NEW_SOFT_PROMPT_SELCTOR_ID
    });
    const overlayDiv = style.overlay.enabled ? createElementWithAttributes('div', {
      id: 'pnOverlay'
    }) : '';
    const pnCard = createElementWithAttributes('div', {
      id: 'pnCard'
    });
    const iconTitleDescWrapper = createElementWithAttributes('div', {
      id: 'iconTitleDescWrapper'
    });
    const iconContainer = createElementWithAttributes('img', {
      id: 'iconContainer',
      src: content.icon.type === 'default' ? "data:image/svg+xml;base64,".concat(PROMPT_BELL_BASE64) : content.icon.url,
      alt: ((_content$icon = content.icon) === null || _content$icon === void 0 ? void 0 : _content$icon.altText) || ''
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
      textContent: content.buttons.primaryButtonText,
      ariaLabel: content.buttons.primaryButtonAriaLabel || content.buttons.primaryButtonText
    });
    const secondaryButton = createElementWithAttributes('button', {
      id: 'secondaryButton',
      textContent: content.buttons.secondaryButtonText,
      ariaLabel: content.buttons.secondaryButtonAriaLabel || content.buttons.secondaryButtonText
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

    if (overlayDiv) {
      wrapper.appendChild(overlayDiv);
    }

    setElementPosition(pnCard, style.card.position);
    const vapidSupportedAndMigrated = isSafari() && 'PushManager' in window && StorageManager.getMetaProp(VAPID_MIGRATION_PROMPT_SHOWN) && fcmPublicKey !== null;

    if (!configData.isPreview) {
      if ('Notification' in window && Notification !== null) {
        if (Notification.permission === 'granted' && (vapidSupportedAndMigrated || isChrome() || isFirefox())) {
          notificationHandler.setApplicationServerKey(appServerKey);
          notificationHandler.setUpWebPushNotifications(subscriptionCallback, swPath, apnsWebPushId, apnsWebPushServiceUrl);
          return;
        } else if (Notification.permission === 'denied') {
          return;
        }
      }
    }

    const now = new Date().getTime() / 1000;
    const lastNotifTime = StorageManager.getMetaProp('webpush_last_notif_time');
    const popupFrequency = content.popupFrequency || 7; // number of days

    const shouldShowNotification = !lastNotifTime || now - lastNotifTime >= popupFrequency * 24 * 60 * 60;

    if (shouldShowNotification) {
      document.body.insertBefore(wrapper, document.body.firstChild);

      if (!configData.isPreview) {
        StorageManager.setMetaProp('webpush_last_notif_time', now);
        addEventListeners(wrapper, okCallback, subscriptionCallback, rejectCallback, apnsWebPushId, apnsWebPushServiceUrl);

        if (isSafari() && 'PushManager' in window && fcmPublicKey != null) {
          StorageManager.setMetaProp(VAPID_MIGRATION_PROMPT_SHOWN, true);
        }
      }
    } else {
      if (isSafari()) {
        // This is for migration case for safari from apns to vapid, show popup even when timer is not expired.
        // If PushManager is not available then return
        if (vapidSupportedAndMigrated || fcmPublicKey === null || !('PushManager' in window)) {
          return;
        }

        if (!configData.isPreview) {
          document.body.appendChild(wrapper);
          addEventListeners(wrapper, okCallback, subscriptionCallback, rejectCallback, apnsWebPushId, apnsWebPushServiceUrl);
          StorageManager.setMetaProp('webpush_last_notif_time', now);
          StorageManager.setMetaProp(VAPID_MIGRATION_PROMPT_SHOWN, true);
        }
      }
    }
  };
  const createBellIcon = (configData, subscriptionCallback, apnsWebPushId, apnsWebPushServiceUrl) => {
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
      addBellEventListeners(bellWrapper, subscriptionCallback, apnsWebPushId, apnsWebPushServiceUrl);
    }

    return bellWrapper;
  };
  const setServerKey = serverKey => {
    appServerKey = serverKey;
    fcmPublicKey = serverKey;
  };
  const addEventListeners = (wrapper, okCallback, subscriptionCallback, rejectCallback, apnsWebPushId, apnsWebPushServiceUrl) => {
    const primaryButton = wrapper.querySelector('#primaryButton');
    const secondaryButton = wrapper.querySelector('#secondaryButton');

    const removeWrapper = () => {
      var _wrapper$parentNode;

      return (_wrapper$parentNode = wrapper.parentNode) === null || _wrapper$parentNode === void 0 ? void 0 : _wrapper$parentNode.removeChild(wrapper);
    };

    primaryButton.addEventListener('click', () => {
      removeWrapper();
      notificationHandler.setApplicationServerKey(appServerKey);
      notificationHandler.setUpWebPushNotifications(subscriptionCallback, swPath, apnsWebPushId, apnsWebPushServiceUrl);

      if (typeof okCallback === 'function') {
        okCallback();
      }
    });
    secondaryButton.addEventListener('click', () => {
      removeWrapper();

      if (typeof rejectCallback === 'function') {
        rejectCallback();
      }
    });
  };
  const addBellEventListeners = (bellWrapper, subscriptionCallback, apnsWebPushId, apnsWebPushServiceUrl) => {
    const bellIcon = bellWrapper.querySelector('#bell_icon');
    bellIcon.addEventListener('click', () => {
      if (Notification.permission === 'denied') {
        toggleGifModal(bellWrapper);
      } else {
        notificationHandler.setApplicationServerKey(appServerKey);
        notificationHandler.setUpWebPushNotifications(subscriptionCallback, swPath, apnsWebPushId, apnsWebPushServiceUrl);

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

  // contextManager.js
  const CampaignContext = {
    _device: null,
    _session: null,
    _request: null,
    _logger: null,
    _msg: null,
    _region: null,

    // Initialize with context objects
    update(device, session, request, logger, msg, region) {
      this._device = device;
      this._session = session;
      this._request = request;
      this._logger = logger;
      this._msg = msg;
      this._region = region;
    },

    // Getters for clean access
    get device() {
      return this._device;
    },

    get session() {
      return this._session;
    },

    get request() {
      return this._request;
    },

    get logger() {
      return this._logger;
    },

    get msg() {
      return this._msg;
    },

    get region() {
      return this._region;
    }

  };

  const OVERLAY_PATH = 'https://web-native-display-campaign.clevertap.com/production/lib-overlay/overlay.js';
  const CSS_PATH = 'https://web-native-display-campaign.clevertap.com/production/lib-overlay/style.css';
  const WVE_CLASS = {
    FLICKER_SHOW: 'wve-anti-flicker-show',
    FLICKER_HIDE: 'wve-anti-flicker-hide',
    FLICKER_ID: 'wve-flicker-style'
  };
  const WVE_QUERY_PARAMS = {
    BUILDER: 'ctBuilder',
    PREVIEW: 'ctBuilderPreview',
    SDK_CHECK: 'ctBuilderSDKCheck'
  };
  const WVE_URL_ORIGIN = {
    CLEVERTAP: 'dashboard.clevertap.com',
    LOCAL: 'localhost'
  };

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

      // Singleton pattern - return existing instance if it exists
      if (Logger.instance) {
        return Logger.instance;
      }

      _classPrivateFieldLooseBase(this, _logLevel)[_logLevel] = logLevel == null ? logLevels.INFO : logLevel;
      this.wzrkError = {};
      Logger.instance = this;
    } // Static method for explicit singleton access


    static getInstance(logLevel) {
      if (!Logger.instance) {
        Logger.instance = new Logger(logLevel);
      }

      return Logger.instance;
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
  const FULLSCREEN_STYLE = "\n  z-index: 2147483647;\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw !important;\n  height: 100vh !important;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n";
  const IFRAME_STYLE = "\n  ".concat(FULLSCREEN_STYLE, "\n  border: 0 !important;\n");
  const renderAdvancedBuilder = function (targetingMsgJson, _session, _logger) {
    let isPreview = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    const divId = 'wizAdvBuilder';
    const campaignId = targetingMsgJson.wzrk_id.split('_')[0]; // Check for existing wrapper and handle accordingly

    if (handleExistingWrapper(divId)) {
      return; // Early exit if existing wrapper should not be replaced
    }

    $ct.campaignDivMap[campaignId] = divId; // Create DOM elements

    const msgDiv = createWrapperDiv(divId);
    const iframe = createIframe(targetingMsgJson, _logger);

    if (!iframe) {
      _logger.error('Failed to create iframe for Advanced Builder');

      return;
    } // Setup event handling


    setupIframeEventListeners(iframe, targetingMsgJson, divId, _session, _logger, isPreview); // Append to DOM

    msgDiv.appendChild(iframe);
    document.body.appendChild(msgDiv); // Track notification view

    window.clevertap.renderNotificationViewed({
      msgId: targetingMsgJson.wzrk_id,
      pivotId: targetingMsgJson.wzrk_pivot
    });
  };

  const handleIframeEvent = (e, targetingMsgJson, divId, _session, _logger, isPreview) => {
    var _e$detail, _e$detail$elementDeta;

    const campaignId = targetingMsgJson.wzrk_id.split('_')[0];
    const {
      detail
    } = e;

    if (!(detail === null || detail === void 0 ? void 0 : detail.type)) {
      return _logger.debug('Empty or missing event type');
    }

    _logger.debug('Received event type:', detail);

    const payload = {
      msgId: targetingMsgJson.wzrk_id,
      pivotId: targetingMsgJson.wzrk_pivot,
      kv: {
        wzrk_c2a: (_e$detail = e.detail) === null || _e$detail === void 0 ? void 0 : (_e$detail$elementDeta = _e$detail.elementDetails) === null || _e$detail$elementDeta === void 0 ? void 0 : _e$detail$elementDeta.name
      }
    };

    switch (detail.type) {
      case ACTION_TYPES.CLOSE:
        // close Iframe
        if (!isPreview) {
          window.clevertap.renderNotificationClicked(payload);
        }

        closeIframe(campaignId, divId, _session === null || _session === void 0 ? void 0 : _session.sessionId);
        break;

      case ACTION_TYPES.OPEN_WEB_URL:
        // handle opening of url
        if (!isPreview) {
          window.clevertap.renderNotificationClicked(payload);
        }

        if (detail.openInNewTab) {
          window.open(detail.url.value.replacements, '_blank', 'noopener');

          if (detail.closeOnClick) {
            closeIframe(campaignId, divId, _session === null || _session === void 0 ? void 0 : _session.sessionId);
          }
        } else {
          window.location.href = detail.url.value.replacements;
        }

        break;

      case ACTION_TYPES.SOFT_PROMPT:
        // Handle soft prompt
        if (!isPreview) {
          window.clevertap.renderNotificationClicked(payload);
        }

        window.clevertap.notifications.push({
          skipDialog: true
        });
        break;

      case ACTION_TYPES.RUN_JS:
        // Handle JS code
        if (!isPreview) {
          window.clevertap.renderNotificationClicked(payload);
        }

        invokeExternalJs(e.detail.js.name, targetingMsgJson);
        break;

      default:
        _logger.debug('Empty event type received');

    }
  }; // Utility: Check and handle existing wrapper


  const handleExistingWrapper = divId => {
    const existingWrapper = document.getElementById(divId);

    if (existingWrapper) {
      if ($ct.dismissSpamControl) {
        existingWrapper.remove();
        return false; // Continue with creation
      } else {
          return true; // Stop execution
        }
    }

    return false; // No existing wrapper, continue
  }; // Utility: Create wrapper div


  const createWrapperDiv = divId => {
    const msgDiv = document.createElement('div');
    msgDiv.id = divId;
    msgDiv.setAttribute('style', FULLSCREEN_STYLE);
    return msgDiv;
  }; // Utility: Create iframe with attributes and content


  const createIframe = (targetingMsgJson, _logger) => {
    try {
      const staticHTML = targetingMsgJson.msgContent.html;
      const isDesktop = window.matchMedia('(min-width: 480px)').matches;
      const config = isDesktop ? targetingMsgJson.display.desktopConfig : targetingMsgJson.display.mobileConfig;
      const html = staticHTML.replace('"##Vars##"', JSON.stringify(config));
      const iframe = document.createElement('iframe');
      iframe.id = 'wiz-iframe';
      iframe.srcdoc = html;
      iframe.setAttribute('style', IFRAME_STYLE);
      return iframe;
    } catch (error) {
      _logger.error('Error creating iframe:', error);

      return null;
    }
  }; // Utility: Setup iframe event listeners


  const setupIframeEventListeners = (iframe, targetingMsgJson, divId, _session, _logger, isPreview) => {
    iframe.onload = () => {
      try {
        // Try direct document access first
        iframe.contentDocument.addEventListener('CT_custom_event', e => {
          _logger.debug('Event received ', e);

          handleIframeEvent(e, targetingMsgJson, divId, _session, _logger, isPreview);
        });
      } catch (error) {
        // Fallback to postMessage
        _logger.error('Iframe document inaccessible, using postMessage:', error);

        setupPostMessageListener(targetingMsgJson, divId, _session, _logger);
      }
    };
  }; // Utility: Setup postMessage listener as fallback


  const setupPostMessageListener = (targetingMsgJson, divId, _session, _logger) => {
    const messageHandler = event => {
      var _event$data;

      if (!event.origin.endsWith(WVE_URL_ORIGIN.CLEVERTAP)) {
        return;
      }

      if (((_event$data = event.data) === null || _event$data === void 0 ? void 0 : _event$data.type) === 'CT_custom_event') {
        _logger.debug('Event received ', event);

        handleIframeEvent({
          detail: event.data.detail
        }, targetingMsgJson, divId, _session, _logger);
      }
    };

    window.removeEventListener('message', messageHandler); // Avoid duplicate bindings

    window.addEventListener('message', messageHandler);
  };

  function handleWebPopupPreviewPostMessageEvent(event) {
    if (!event.origin.endsWith(WVE_URL_ORIGIN.CLEVERTAP) && !event.origin.endsWith(window.location.origin)) {
      return;
    }

    const logger = Logger.getInstance();

    try {
      const eventData = JSON.parse(event.data);
      const inAppNotifs = eventData.inapp_notifs;
      const msgContent = inAppNotifs[0].msgContent;

      if (eventData && msgContent && msgContent.templateType === 'advanced-web-popup-builder') {
        renderAdvancedBuilder(inAppNotifs[0], null, Logger.getInstance(), true);
      }
    } catch (error) {
      logger.error('Error parsing event data:', error);
    }
  }

  const checkWebPopupPreview = () => {
    const logger = Logger.getInstance();
    const searchParams = new URLSearchParams(window.location.search);
    const ctType = searchParams.get('ctActionMode');

    if (ctType) {
      const parentWindow = window.opener;
      const referrer = new URL(document.referrer);

      switch (ctType) {
        case WEB_POPUP_PREVIEW:
          if (parentWindow) {
            parentWindow.postMessage('ready', referrer.origin);

            const eventHandler = event => handleWebPopupPreviewPostMessageEvent(event);

            window.addEventListener('message', eventHandler, false);
          }

          break;

        default:
          logger.debug("unknown query param ".concat(ctType));
          break;
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

    get onClickAction() {
      return this.target.display.onClickAction;
    }

    get desktopAltText() {
      return this.target.display.desktopAlt;
    }

    get mobileAltText() {
      return this.target.display.mobileALt;
    }

    renderImageOnlyPopup() {
      this.shadow.innerHTML = this.getImageOnlyPopupContent();
      this.popup = this.shadowRoot.getElementById('imageOnlyPopup');
      this.container = this.shadowRoot.getElementById('container');
      this.closeIcon = this.shadowRoot.getElementById('close');
      this.container.setAttribute('role', 'dialog');
      this.container.setAttribute('aria-modal', 'true');
      this.popup.addEventListener('load', this.updateImageAndContainerWidth());
      this.resizeObserver = new ResizeObserver(() => this.handleResize(this.popup, this.container));
      this.resizeObserver.observe(this.popup);

      const closeFn = () => {
        const campaignId = this.target.wzrk_id.split('_')[0]; // const currentSessionId = this.session.sessionId

        this.resizeObserver.unobserve(this.popup);
        document.getElementById('wzrkImageOnlyDiv').style.display = 'none';
        this.remove();

        if (campaignId != null && campaignId !== '-1') {
          if (StorageManager._isLocalStorageSupported()) {
            var _campaignObj$dnd;

            const campaignObj = getCampaignObject();
            campaignObj.dnd = [...new Set([...((_campaignObj$dnd = campaignObj.dnd) !== null && _campaignObj$dnd !== void 0 ? _campaignObj$dnd : []), campaignId])];
            saveCampaignObject(campaignObj);
          }
        }
      };

      if (this.closeIcon) {
        this.closeIcon.addEventListener('click', closeFn);
      }

      if (!this.target.display.preview) {
        window.clevertap.renderNotificationViewed({
          msgId: this.msgId,
          pivotId: this.pivotId
        });
      }

      if (this.onClickAction === 'none') {
        this.popup.addEventListener('click', closeFn);
      } else if (this.onClickUrl) {
        this.popup.addEventListener('click', () => {
          if (!this.target.display.preview) {
            window.clevertap.renderNotificationClicked({
              msgId: this.msgId,
              pivotId: this.pivotId
            });
          }

          switch (this.onClickAction) {
            case ACTION_TYPES.OPEN_LINK_AND_CLOSE:
              this.target.display.window ? window.open(this.onClickUrl, '_blank') : window.parent.location.href = this.onClickUrl;

              if (this.closeIcon) {
                this.closeIcon.click();
              } else {
                closeFn();
              }

              break;

            case ACTION_TYPES.OPEN_LINK:
            default:
              this.target.display.window ? window.open(this.onClickUrl, '_blank') : window.parent.location.href = this.onClickUrl;
          }
        });
      }
    }

    handleResize(popup, container) {
      const width = this.getRenderedImageWidth(popup);
      container.style.setProperty('width', "".concat(width, "px"));

      if (window.innerWidth > 480) {
        this.popup.setAttribute('alt', this.desktopAltText);
      } else {
        this.popup.setAttribute('alt', this.mobileAltText);
      }
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

        if (this.closeIcon) {
          this.closeIcon.style.setProperty('visibility', 'visible');
        }

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
      message && this.renderMessage(message);
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
    return "\n      <style id=\"webInboxStyles\">\n        #inbox {\n          width: 100%;\n          position: fixed;\n          background-color: #fff; \n          display: none; \n          box-shadow: 0px 2px 10px 0px #d7d7d791;\n          background-color: ".concat(panelBackgroundColor, "; \n          border: 1px solid ").concat(panelBorderColor, ";\n          top: 0;\n          left: 0;\n          height: 100%;\n          overflow: auto;\n          z-index: 1;\n          box-sizing: content-box;\n          border-radius: 4px;\n        }\n  \n        #emptyInboxMsg {\n          display: block;\n          padding: 10px;\n          text-align: center;\n          color: black;\n        }\n  \n        #header {\n          height: 36px; \n          width: 100%; \n          display: flex; \n          justify-content: center; \n          align-items: center; \n          background-color: ").concat(headerBackgroundColor, "; \n          background-color: var(--card-bg, ").concat(headerBackgroundColor, ");\n          color: ").concat(headerTitleColor, ";\n          position: sticky;\n          top: 0;\n        }\n  \n        #closeInbox {\n          font-size: 20px; \n          margin-right: 12px; \n          color: ").concat(closeIconColor, "; \n          cursor: pointer;\n        }\n  \n        #headerTitle {\n          font-size: 14px; \n          line-height: 20px; \n          flex-grow: 1; \n          font-weight: 700; \n          text-align: center;\n          flex-grow: 1;\n          text-align: center;\n        }\n  \n        #categoriesContainer {\n          padding: 16px 16px 0 16px; \n          height: 32px; \n          display: flex;\n          scroll-behavior: smooth;\n          position: relative;\n          z-index: -1;\n        }\n\n        #categoriesWrapper {\n          height: 32px; \n          overflow-x: scroll;\n          display: flex;\n          white-space: nowrap;\n          scrollbar-width: none;\n        }\n\n        #categoriesWrapper::-webkit-scrollbar {\n          display: none;\n        }\n  \n        #leftArrow, #rightArrow {\n          height: 32px;\n          align-items: center;\n          font-weight: 700;\n          position: absolute;\n          z-index: 2;\n          pointer-events: auto;\n          cursor: pointer;\n          display: none;\n        }\n\n        #leftArrow {\n          left: 0;\n          padding-left: 4px;\n          padding-right: 16px;\n          background: linear-gradient(90deg, ").concat(panelBackgroundColor, " 0%, ").concat(panelBackgroundColor, "99 80%, ").concat(panelBackgroundColor, "0d 100%);\n        }\n\n        #rightArrow {\n          right: 0;\n          padding-right: 4px;\n          padding-left: 16px;\n          background: linear-gradient(-90deg, ").concat(panelBackgroundColor, " 0%, ").concat(panelBackgroundColor, "99 80%, ").concat(panelBackgroundColor, "0d 100%);\n        }\n\n        [id^=\"category-\"] {\n          display: flex; \n          flex: 1 1 0; \n          justify-content: center; \n          align-items: center; \n          font-size: 14px; \n          line-height: 20px; \n          background-color: ").concat(categoriesTabColor, "; \n          color: ").concat(categoriesTitleColor, "; \n          cursor: pointer;\n          padding: 6px 24px;\n          margin: 0 3px;\n          border-radius: 16px;\n          border: ").concat(categoriesBorderColor ? '1px solid ' + categoriesBorderColor : 'none', ";\n        }\n\n        [id^=\"category-\"][selected=\"true\"] {\n          background-color: ").concat(selectedCategoryTabColor, "; \n          color: ").concat(selectedCategoryTitleColor, "; \n          border: ").concat(selectedCategoryBorderColor ? '1px solid ' + selectedCategoryBorderColor : 'none', "\n        }\n  \n        #inboxCard {\n          padding: 0 16px 0 16px;\n          overflow-y: auto;\n          box-sizing: border-box;\n          margin-top: 16px;\n          height: 100%;\n          overflow: scroll;\n        }\n\n        @media only screen and (min-width: 480px) {\n          #inbox {\n            width: var(--inbox-width, 392px);\n            height: var(--inbox-height, 546px);\n            position: var(--inbox-position, fixed);\n            right: var(--inbox-right, unset);\n            bottom: var(--inbox-bottom, unset);\n            top: var(--inbox-top, unset);\n            left: var(--inbox-left, unset);\n          }\n  \n          #inboxCard {\n            height: calc(var(--inbox-height, 546px) - ").concat(headerCategoryHeight, "px); \n          }\n  \n        }\n      </style>\n      ");
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
          } else if (this.checkForWebInbox(e) || this.isInboxOpen) {
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
          const shouldShowUnviewedBadge = msgCount > 0 && document.getElementById(this.config.inboxSelector);
          this.unviewedBadge.style.display = shouldShowUnviewedBadge ? 'flex' : 'none';
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

      if (msgs.length > 0) {
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
          if (deleteMsgsFromUI && this.inbox) {
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

      if (this.inbox) {
        this.buildUIForMessages(incomingMsgs);
        this.updateUnviewedBadgeCounter();
      }
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
      try {
        const inboxNode = document.getElementById(this.config.inboxSelector) || this.inboxSelector;
        const {
          top,
          right
        } = inboxNode.getBoundingClientRect();
        this.unviewedBadge.style.top = "".concat(top - 8, "px");
        this.unviewedBadge.style.left = "".concat(right - 8, "px");
      } catch (error) {
        this.logger.debug('Error updating unviewed badge position:', error);
      }
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
     * Checks if the current event target is part of the stored inboxSelector or the inboxSelector in the document.
     *
     * @param {Event} e - The event object to check.
     * @returns {boolean} - Returns true if the event target is within the inboxSelector, otherwise false.
     */
    checkForWebInbox(e) {
      var _this$inboxSelector;

      const config = StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};
      const inboxElement = document.getElementById(config.inboxSelector);
      return ((_this$inboxSelector = this.inboxSelector) === null || _this$inboxSelector === void 0 ? void 0 : _this$inboxSelector.contains(e.target)) || (inboxElement === null || inboxElement === void 0 ? void 0 : inboxElement.contains(e.target));
    }
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
     * Only show this badge if the current document has the inboxNode
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
      const retryUntil = function (condition) {
        let interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
        let maxRetries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const retry = setInterval(() => {
            logger.debug("Retry attempt: ".concat(attempts + 1));

            if (condition()) {
              clearInterval(retry);
              resolve(); // Success
            } else if ($ct.inbox !== null) {
              clearInterval(retry);
              resolve(); // Inbox already initialized
            } else if (attempts >= maxRetries) {
              clearInterval(retry);
              reject(new Error('Condition not met within max retries'));
            }

            attempts++;
          }, interval);
        });
      };

      const addInboxSafely = () => {
        if ($ct.inbox === null) {
          addWebInbox(logger);
        }
      };

      const checkElementCondition = () => {
        const config = StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};
        return document.getElementById(config.inboxSelector) && $ct.inbox === null;
      };

      const onFailure = () => {
        logger.debug('Failed to add inbox');
      };

      let retryStarted = false; // Guard flag

      const startRetry = () => {
        const config = StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};

        if (!config.inboxSelector) {
          logger.debug('Web Inbox Retry Skipped, Inbox selector is not configured');
          return false;
        }

        if (!retryStarted) {
          retryStarted = true;
          retryUntil(checkElementCondition, 500, 20).then(() => {
            addInboxSafely();
            resolve();
          }).catch(onFailure);
        }
      };

      const setupEventListeners = () => {
        if (document.readyState === 'complete') {
          startRetry();
        } else {
          window.addEventListener('load', startRetry);
          document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
              startRetry();
            }
          });
        }
      };

      setupEventListeners();
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

  const updateFormData = function (element, formStyle, payload) {
    let isPreview = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (formStyle !== undefined) {
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
        element.innerText = isPreview ? formStyle.text.text : formStyle.text;
      } // Handle element onClick


      if (formStyle.clickDetails !== undefined) {
        const url = formStyle.clickDetails.clickUrl;
        element.onclick = formStyle.clickDetails.newTab ? () => {
          if (!isPreview) {
            window.clevertap.raiseNotificationClicked(payload);
          }

          window.open(url, '_blank').focus();
        } : () => {
          if (!isPreview) {
            window.clevertap.raiseNotificationClicked(payload);
          }

          window.location.href = url;
        };
      } // Set the image source


      if (formStyle.imgURL !== undefined && element.tagName.toLowerCase() === 'img') {
        element.src = formStyle.imgURL;
      }
    }
  };
  const updateElementCSS = element => {
    // Handle elementCss
    if (element.elementCSS !== undefined) {
      const style = document.createElement('style');
      style.innerHTML = element.elementCSS;
      document.head.appendChild(style);
    }
  };

  let logger = null;
  const handleActionMode = (_logger, accountId) => {
    const searchParams = new URLSearchParams(window.location.search);
    const ctType = searchParams.get('ctActionMode');
    logger = _logger;

    if (ctType) {
      const parentWindow = window.opener;

      switch (ctType) {
        case WVE_QUERY_PARAMS.BUILDER:
          logger.debug('open in visual builder mode');
          window.addEventListener('message', handleMessageEvent, false);

          if (parentWindow) {
            parentWindow.postMessage({
              message: 'builder',
              originUrl: window.location.href
            }, '*');
          }

          break;

        case WVE_QUERY_PARAMS.PREVIEW:
          logger.debug('preview of visual editor');
          window.addEventListener('message', handleMessageEvent, false);

          if (parentWindow) {
            parentWindow.postMessage({
              message: 'preview',
              originUrl: window.location.href
            }, '*');
          }

          break;

        case WVE_QUERY_PARAMS.SDK_CHECK:
          if (parentWindow) {
            logger.debug('SDK version check');
            const sdkVersion = '2.3.0';
            parentWindow.postMessage({
              message: 'SDKVersion',
              accountId,
              originUrl: window.location.href,
              sdkVersion
            }, '*');
          }

          break;

        default:
          logger.debug("unknown query param ".concat(ctType));
          break;
      }
    }
  };

  const handleMessageEvent = event => {
    if (event.data && isValidUrl(event.data.originUrl)) {
      // Visual Editor is opened from only dashboard, while preview can be opened from both dashboard & Visual Editor
      // therefore adding check for self origin
      // Visual Editor can only be opened in their domain not inside dashboard
      if (!event.origin.endsWith(WVE_URL_ORIGIN.CLEVERTAP) && !event.origin.endsWith(window.location.origin)) {
        return;
      }
    } else {
      return;
    }

    if (event.data.message === 'Dashboard') {
      var _event$data$variant, _event$data$details;

      // handle personalisation
      window.evtMaster = event.data.personalisation.evtMaster;
      initialiseCTBuilder(event.data.url, (_event$data$variant = event.data.variant) !== null && _event$data$variant !== void 0 ? _event$data$variant : null, (_event$data$details = event.data.details) !== null && _event$data$details !== void 0 ? _event$data$details : {}, event.data.personalisation);
    } else if (event.data.message === 'Overlay') {
      renderVisualBuilder(event.data, true);
    }
  };
  /**
   * Initializes the Clevertap builder.
   * @param {string} url - The URL to initialize the builder.
   * @param {string} variant - The variant of the builder.
   * @param {Object} details - The details object.
   * @param {Object} personalisation - The personalisation object
   */


  const initialiseCTBuilder = (url, variant, details, personalisation) => {
    if (document.readyState === 'complete') {
      onContentLoad(url, variant, details, personalisation);
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          onContentLoad(url, variant, details, personalisation);
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

  function onContentLoad(url, variant, details, personalisation) {
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
      loadOverlayScript(OVERLAY_PATH, url, variant, details, personalisation).then(() => {
        logger.debug('Overlay script loaded successfully.');
        contentLoaded = true;
      }).catch(error => {
        logger.debug('Error loading overlay script:', error);
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
   * @param {Object} personalisation
   * @returns {Promise} A promise.
   */


  function loadOverlayScript(overlayPath, url, variant, details, personalisation) {
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
            isShopify,
            personalisation
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
   * @param _logger - instance of logger class
   */


  const renderVisualBuilder = (targetingMsgJson, isPreview, _logger) => {
    if (_logger) {
      logger = _logger;
    }

    if (isPreview) {
      sessionStorage.setItem('visualEditorData', JSON.stringify(targetingMsgJson));
    }

    const insertedElements = [];
    const reorderingOptions = []; // Collect reordering operations to execute at the end

    const details = isPreview ? targetingMsgJson.details : targetingMsgJson.display.details;
    let notificationViewed = false;
    let pendingElements = 0; // Track elements being processed by tryFindingElement

    const payload = {
      msgId: targetingMsgJson.wzrk_id,
      pivotId: targetingMsgJson.wzrk_pivot
    };

    const raiseViewed = () => {
      if (!isPreview && !notificationViewed) {
        notificationViewed = true;
        window.clevertap.renderNotificationViewed(payload);
      }
    };

    const raiseClicked = payload => {
      window.clevertap.renderNotificationClicked(payload);
    };

    const processElement = (element, selector) => {
      var _selector$reorderingO, _selector$isTrackingC;

      pendingElements--; // Decrement when processing element

      if (selector === null || selector === void 0 ? void 0 : (_selector$reorderingO = selector.reorderingOptions) === null || _selector$reorderingO === void 0 ? void 0 : _selector$reorderingO.positionsChanged) {
        // Collect drag operation to execute later (after all elements are processed)
        reorderingOptions.push({
          element,
          selector
        });
      }

      if (selector.elementCSS) {
        updateElementCSS(selector);
      }

      if ((_selector$isTrackingC = selector.isTrackingClicks) === null || _selector$isTrackingC === void 0 ? void 0 : _selector$isTrackingC.name) {
        element.addEventListener('click', () => {
          const clickedPayload = {
            msgId: targetingMsgJson.wzrk_id,
            pivotId: targetingMsgJson.wzrk_pivot,
            msgCTkv: {
              wzrk_selector: selector.isTrackingClicks.name
            }
          };
          raiseClicked(clickedPayload);
        });
      }

      if (selector.values) {
        switch (selector.values.editor) {
          case 'html':
            if (isPreview) {
              element.outerHTML = selector.values.html.text;
            } else {
              element.outerHTML = selector.values.html;
            }

            executeScripts(selector.selector);
            break;

          case 'json':
            dispatchJsonData(targetingMsgJson, selector.values, isPreview);
            break;

          case 'form':
            payload.msgCTkv = {
              wzrk_selector: selector.selector
            };
            updateFormData(element, selector.values.form, payload, isPreview);
            break;
        }
      }
    };

    const tryFindingElement = selector => {
      let count = 0;
      const intervalId = setInterval(() => {
        let retryElement;

        try {
          retryElement = document.querySelector(selector.selector);
        } catch (_) {}

        if (retryElement) {
          raiseViewed();
          processElement(retryElement, selector);
          clearInterval(intervalId);
          checkAndApplyReorder(); // Check if we can apply reordering now
        } else if (++count >= 20) {
          logger.debug("No element present on DOM with selector '".concat(selector, "'."));
          clearInterval(intervalId);
        }
      }, 500);
      $ct.intervalArray.push(intervalId);
    };

    details.forEach(d => {
      pendingElements = d.selectorData.length;
      d.selectorData.forEach(s => {
        if ((s.selector.includes('-afterend-') || s.selector.includes('-beforebegin-')) && s.values.initialHtml) {
          insertedElements.push(s);
        } else {
          let element;

          try {
            element = document.querySelector(s.selector);
          } catch (_) {}

          if (element) {
            raiseViewed();
            processElement(element, s);
          } else {
            tryFindingElement(s);
          }
        }
      });
    });

    const addNewEl = selector => {
      const {
        pos,
        sibling
      } = findSiblingSelector(selector.selector);
      let count = 0;
      const intervalId = setInterval(() => {
        let element = null;

        try {
          const siblingEl = document.querySelector(sibling);
          const ctEl = document.querySelector("[ct-selector=\"".concat(sibling, "\"]"));
          element = ctEl || siblingEl;
        } catch (_) {
          element = document.querySelector("[ct-selector=\"".concat(sibling, "\"]"));
        }

        if (element) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = selector.values.initialHtml;
          const newElement = tempDiv.firstElementChild;
          element.insertAdjacentElement(pos, newElement);

          if (!element.getAttribute('ct-selector')) {
            element.setAttribute('ct-selector', sibling);
          }

          const insertedElement = document.querySelector("[ct-selector=\"".concat(selector.selector, "\"]"));
          raiseViewed();
          processElement(insertedElement, selector);
          clearInterval(intervalId);
          checkAndApplyReorder(); // Check if we can apply reordering now
        } else if (++count >= 20) {
          logger.debug("No element present on DOM with selector '".concat(sibling, "'."));
          clearInterval(intervalId);
        }
      }, 500);
      $ct.intervalArray.push(intervalId);
    };

    if (insertedElements.length > 0) {
      const sortedArr = insertedElements.sort((a, b) => {
        const numA = parseInt(a.selector.split('-')[0], 10);
        const numB = parseInt(b.selector.split('-')[0], 10);
        return numA - numB;
      });
      sortedArr.forEach(addNewEl);
    } // Check if all elements are processed and apply reordering if ready


    const checkAndApplyReorder = () => {
      if (pendingElements === 0 && reorderingOptions.length > 0) {
        applyReorder(reorderingOptions);
      }
    }; // Execute all reordering operations after all elements have been processed


    const applyReorder = reorderingOptions => {
      reorderingOptions.forEach((_ref) => {
        let {
          element,
          selector
        } = _ref;
        // ensure DOM matches layout (safety sync)
        // newOrder contains ALL child elements in their desired order
        // First, collect all elements before any DOM manipulation
        // This prevents nth-child selectors from becoming invalid during reordering
        const orderedChildren = [];
        selector.reorderingOptions.newOrder.forEach(cssSelector => {
          if (cssSelector.includes('-afterend-') || cssSelector.includes('-beforebegin-')) {
            cssSelector = "[ct-selector=\"".concat(cssSelector, "\"]");
          }

          const child = document.querySelector(cssSelector);

          if (child && element.contains(child)) {
            orderedChildren.push(child);
          }
        }); // Now reorder using insertBefore with index-based positioning

        orderedChildren.forEach((child, targetIndex) => {
          const currentIndex = Array.from(element.children).indexOf(child);

          if (currentIndex !== targetIndex) {
            // Insert child at the correct position
            const referenceChild = element.children[targetIndex];

            if (referenceChild) {
              element.insertBefore(child, referenceChild);
            } else {
              element.appendChild(child);
            }
          }
        });
      });
    }; // Apply reordering immediately if no elements are pending


    checkAndApplyReorder();
  };

  function findSiblingSelector(input) {
    const regex = /^(\d+)-(afterend|beforebegin)-(.+)$/;
    const match = input.match(regex);

    if (match) {
      return {
        pos: match[2],
        sibling: match[3]
      };
    }

    return {
      pos: 'beforebegin',
      sibling: ''
    };
  }
  /**
   * Dispatches JSON data.
   * @param {Object} targetingMsgJson - The point and click campaign JSON object.
   * @param {Object} selector - The selector object.
   * @param {boolean} isPreview - If preview different handling
   */


  function dispatchJsonData(targetingMsgJson, selector) {
    let isPreview = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const inaObj = {};
    inaObj.msgId = targetingMsgJson.wzrk_id;

    if (targetingMsgJson.wzrk_pivot) {
      inaObj.pivotId = targetingMsgJson.wzrk_pivot;
    }

    if (selector.json != null) {
      if (isPreview) {
        inaObj.json = selector.json.text;
      } else {
        inaObj.json = selector.json;
      }
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
      const styleContent = "\n      .wve-anti-flicker-hide {\n        opacity: 0 !important;\n      }\n      .wve-anti-flicker-show {\n        transition: opacity 0.5s, filter 0.5s !important;\n      }\n    "; // Create and append the style element if it doesn't exist

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

    window.addEventListener('DOMContentLoaded', () => {
      observeUrlChange();
    });
    applyAntiFlicker(personalizedSelectors);
  }
  function executeScripts(selector) {
    try {
      let newElement;

      if (selector.includes('-afterend-') || selector.includes('-beforebegin-')) {
        // doing this because inserted elements saved selectors do not follow normal conventions
        // they start with numbers ex. 0-beforebegin-div#titleContainer
        newElement = document.querySelector("[ct-selector=\"".concat(selector, "\"]"));
      } else {
        newElement = document.querySelector(selector);
      }

      if (!newElement) return;
      const scripts = newElement.querySelectorAll('script');
      scripts.forEach(script => {
        addScriptTo(script);
      });
    } catch (error) {
      logger.debug('Error loading script', error);
    }
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
    commonCampaignUtils.doCampHouseKeeping(targetingMsgJson, Logger.getInstance());
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
    commonCampaignUtils.doCampHouseKeeping(targetingMsgJson, Logger.getInstance());
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
    commonCampaignUtils.doCampHouseKeeping(targetingMsgJson, Logger.getInstance());
  };
  const renderCustomHtml = (targetingMsgJson, logger) => {
    const {
      display,
      wzrk_id: wzrkId,
      wzrk_pivot: wzrkPivot
    } = targetingMsgJson || {};
    const {
      divId
    } = display || {};
    const details = display.details[0];
    let html = details.html;

    if (!divId || !html) {
      logger.error('No div Id or no html found');
      return;
    }

    if (display['custom-html-click-track']) {
      html = appendScriptForCustomEvent(targetingMsgJson, html);
    }

    let notificationViewed = false;
    const payload = {
      msgId: wzrkId,
      pivotId: wzrkPivot
    };

    const raiseViewed = () => {
      if (!notificationViewed) {
        notificationViewed = true;
        window.clevertap.renderNotificationViewed(payload);
      }
    };

    const tryFindingElement = divId => {
      let count = 0;
      const intervalId = setInterval(() => {
        const retryElement = document.querySelector(divId);

        if (retryElement) {
          raiseViewed();
          retryElement.innerHTML = html;
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          const scripts = wrapper.querySelectorAll('script');
          scripts.forEach(script => {
            addScriptTo(script);
          });
          commonCampaignUtils.doCampHouseKeeping(targetingMsgJson, Logger.getInstance());
          clearInterval(intervalId);
        } else if (++count >= 20) {
          logger.error("No element present on DOM with divId '".concat(divId, "'."));
          clearInterval(intervalId);
        }
      }, 500);
    };

    tryFindingElement(divId);
  };
  const handleJson = targetingMsgJson => {
    const inaObj = {};
    inaObj.msgId = targetingMsgJson.wzrk_id;
    const details = targetingMsgJson.display.details[0];
    const json = details.json;

    if (targetingMsgJson.wzrk_pivot) {
      inaObj.pivotId = targetingMsgJson.wzrk_pivot;
    }

    if (targetingMsgJson.display.json != null) {
      inaObj.json = json;
    }

    const jsonEvent = new CustomEvent('CT_web_native_display_json', {
      detail: inaObj
    });
    document.dispatchEvent(jsonEvent);
    commonCampaignUtils.doCampHouseKeeping(targetingMsgJson, Logger.getInstance());
  };

  function handleCustomHtmlPreviewPostMessageEvent(event, logger) {
    if (!event.origin.endsWith(WVE_URL_ORIGIN.CLEVERTAP)) {
      return;
    }

    const eventData = JSON.parse(event.data);
    const inAppNotifs = eventData.inapp_notifs;
    const msgContent = inAppNotifs[0].msgContent;

    if (eventData && msgContent && msgContent.templateType === 'custom-html' && msgContent.type === 5) {
      renderCustomHtml(inAppNotifs[0], logger);
    }
  }

  const checkCustomHtmlNativeDisplayPreview = logger => {
    const searchParams = new URLSearchParams(window.location.search);
    const ctType = searchParams.get('ctActionMode');

    if (ctType) {
      const parentWindow = window.opener;

      switch (ctType) {
        case CUSTOM_HTML_PREVIEW:
          if (parentWindow) {
            parentWindow.postMessage('ready', '*');

            const eventHandler = event => handleCustomHtmlPreviewPostMessageEvent(event, logger);

            window.addEventListener('message', eventHandler, false);
          }

          break;

        default:
          logger.debug("unknown query param ".concat(ctType));
          break;
      }
    }
  };
  const renderWebNativeDisplayBanner = (targetNotif, logger, arrInAppNotifs) => {
    let count = 0;
    const intervalId = setInterval(() => {
      const element = targetNotif.display.divId ? document.getElementById(targetNotif.display.divId) : document.querySelector(targetNotif.display.divSelector);

      if (element !== null) {
        targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.BANNER ? renderPersonalisationBanner(targetNotif) : renderPersonalisationCarousel(targetNotif);
        clearInterval(intervalId);
      } else if (++count >= 20) {
        logger.debug("No element present on DOM with selector '".concat(targetNotif.display.divId || targetNotif.display.divSelector, "'."));
        arrInAppNotifs[targetNotif.wzrk_id.split('_')[0]] = targetNotif; // Add targetNotif to object

        clearInterval(intervalId);
      }
    }, 500);
  };

  const commonCampaignUtils = {
    /*
      This function is used to increment the counters for session, daily, and global objects
    */
    incrCount(obj, campaignId, excludeFromFreqCaps) {
      let currentCount = 0;
      let totalCount = 0;

      if (obj[campaignId] != null) {
        // Current count for this campaign
        currentCount = obj[campaignId];
      }

      currentCount++;

      if (obj.tc != null) {
        // Total count across all campaigns
        totalCount = obj.tc;
      } // If campaign is excluded from frequency caps, don't increment total count


      if (excludeFromFreqCaps < 0) {
        totalCount++;
      }

      obj.tc = totalCount;
      obj[campaignId] = currentCount;
    },

    /**
     * Creates a reusable mouse leave handler for exit intent campaigns
     * @param {Object} targetingMsgJson - Campaign configuration
     * @param {Object} exitintentObj - Exit intent object
     * @returns {Function} - Mouse leave event handler
     */
    createExitIntentMouseLeaveHandler(targetingMsgJson, exitintentObj) {
      const handleMouseLeave = event => {
        const wasRendered = this.showExitIntent(event, targetingMsgJson, null, exitintentObj);

        if (wasRendered) {
          window.document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };

      return handleMouseLeave;
    },

    /*
       * @param {Object} campTypeObj - Campaign type object to check/modify
       * @param {string} campaignId - Current campaign ID
       * @param {Object} targetingMsgJson - Campaign configuration
       * @param {Object} capSettings - Frequency capping settings
       * @returns {boolean|Object} - false if cap exceeded, session object otherwise
       */
    checkSessionCapping(campTypeObj, campaignId, targetingMsgJson, capSettings) {
      // Session-level capping: Checks if campaign exceeds session limits
      const sessionId = CampaignContext.session.sessionId;
      let sessionObj = campTypeObj[sessionId];

      if (sessionObj) {
        const campaignSessionCount = sessionObj[campaignId];
        const totalSessionCount = sessionObj.tc; // For web inbox campaigns

        if (targetingMsgJson[DISPLAY].wtarget_type === 3) {
          // Inbox session limit check
          if (capSettings.totalInboxSessionLimit > 0 && totalSessionCount >= capSettings.totalInboxSessionLimit && capSettings.excludeFromFreqCaps < 0) {
            return false;
          }
        } else {
          // Web popup session limit check
          if (capSettings.totalSessionLimit > 0 && totalSessionCount >= capSettings.totalSessionLimit && capSettings.excludeFromFreqCaps < 0) {
            return false;
          }
        } // Campaign-specific session limit check


        if (capSettings.campaignSessionLimit > 0 && campaignSessionCount >= capSettings.campaignSessionLimit) {
          return false;
        }
      } else {
        // Initializes session object if not present
        sessionObj = {};
        campTypeObj[sessionId] = sessionObj;
      }

      return sessionObj;
    },

    /**
       * Checks daily-level capping and initializes daily object if needed
       * Mutates campTypeObj reference
       *
       * @param {Object} campTypeObj - Campaign type object to check/modify
       * @param {string} campaignId - Current campaign ID
       * @param {string} today - Today's date string
       * @param {Object} capSettings - Frequency capping settings
       * @returns {boolean|Object} - false if cap exceeded, daily object otherwise
       */
    checkDailyCapping(campTypeObj, campaignId, today, capSettings) {
      // Daily-level capping: Checks if campaign exceeds daily limits
      let dailyObj = campTypeObj[today];

      if (dailyObj != null) {
        const campaignDailyCount = dailyObj[campaignId];
        const totalDailyCount = dailyObj.tc; // Total daily limit check

        if (capSettings.totalDailyLimit > 0 && totalDailyCount >= capSettings.totalDailyLimit && capSettings.excludeFromFreqCaps < 0) {
          return false;
        } // Campaign-specific daily limit check


        if (capSettings.campaignDailyLimit > 0 && campaignDailyCount >= capSettings.campaignDailyLimit) {
          return false;
        }
      } else {
        // Initializes daily object if not present
        dailyObj = {};
        campTypeObj[today] = dailyObj;
      }

      return dailyObj;
    },

    /**
       * Checks global-level (lifetime) capping and initializes global object if needed
       * Mutates campTypeObj reference
       *
       * @param {Object} campTypeObj - Campaign type object to check/modify
       * @param {string} campaignId - Current campaign ID
       * @param {number} campaignTotalLimit - Campaign lifetime limit
       * @returns {boolean|Object} - false if cap exceeded, global object otherwise
       */
    checkGlobalCapping(campTypeObj, campaignId, campaignTotalLimit) {
      // Global-level capping: Checks lifetime limit for the campaign
      let globalObj = campTypeObj[GLOBAL];

      if (globalObj != null) {
        const campaignTotalCount = globalObj[campaignId]; // Campaign lifetime limit check

        if (campaignTotalLimit > 0 && campaignTotalCount >= campaignTotalLimit) {
          return false;
        }
      } else {
        // Initializes global object if not present
        globalObj = {};
        campTypeObj[GLOBAL] = globalObj;
      }

      return globalObj;
    },

    /**
       * Extracts frequency capping settings from campaign configuration
       * @param {Object} targetingMsgJson - Campaign configuration
       * @returns {Object} - Object containing all frequency capping settings
       */
    extractFrequencyCappingSettings(targetingMsgJson) {
      // Variables to store campaign frequency capping settings
      var excludeFromFreqCaps = -1; // efc - Exclude from frequency caps (-1 means not excluded)

      let campaignSessionLimit = -1; // mdc - Once per session

      let campaignDailyLimit = -1; // tdc - Once per day

      let campaignTotalLimit = -1; // tlc - Once per user for the duration of campaign

      let totalDailyLimit = -1;
      let totalSessionLimit = -1; // wmc - Web Popup Global Session Limit

      let totalInboxSessionLimit = -1; // wimc - Web Inbox Global Session Limit
      // Parses frequency capping settings from the message

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
      }

      return {
        excludeFromFreqCaps,
        // efc - Exclude from frequency caps (-1 means not excluded)
        campaignSessionLimit,
        // mdc - Once per session
        campaignDailyLimit,
        // tdc - Once per day per campaign
        campaignTotalLimit,
        // tlc - Once per user for the duration of campaign
        totalDailyLimit,
        // wmp - No of campaigns per day
        totalSessionLimit,
        // wmc - Web Popup Global Session Limit
        totalInboxSessionLimit // wimc - Web Inbox Global Session Limit

      };
    },

    doCampHouseKeeping(targetingMsgJson, logger) {
      // Extracts campaign ID from wzrk_id (e.g., "123_456" -> "123")
      const campaignId = targetingMsgJson.wzrk_id.split('_')[0]; // Gets current date for daily capping

      const today = getToday();

      if (deliveryPreferenceUtils.isCampaignAddedToDND(campaignId) && !$ct.dismissSpamControl) {
        return false;
      }

      if (StorageManager._isLocalStorageSupported()) {
        // Clears old session storage for campaigns
        delete sessionStorage[CAMP_COOKIE_NAME];
        var campTypeObj = {}; // Retrieves stored campaign data from local storage

        const campObj = getCampaignObject(); // Determines campaign type (web inbox or web popup) and fetches corresponding data

        if (targetingMsgJson.display.wtarget_type === 3 && campObj.hasOwnProperty('wi')) {
          // Web inbox campaigns
          campTypeObj = campObj.wi;
        } else if ((targetingMsgJson.display.wtarget_type === 0 || targetingMsgJson.display.wtarget_type === 1) && campObj.hasOwnProperty('wp')) ; else {
          campTypeObj = {};
        }

        if (campObj.hasOwnProperty('global')) ; // Sets default global session limits if not specified


        if (targetingMsgJson[DISPLAY].wmc == null) {
          // Default web popup session limit
          targetingMsgJson[DISPLAY].wmc = 1;
        } // Sets default global session limit for web inbox if not specified


        if (targetingMsgJson[DISPLAY].wimc == null) {
          // Default web inbox session limit
          targetingMsgJson[DISPLAY].wimc = 1;
        }

        const capSettings = this.extractFrequencyCappingSettings(targetingMsgJson); // Session-level capping: Checks if campaign exceeds session limits

        const sessionObj = this.checkSessionCapping(campTypeObj, campaignId, targetingMsgJson, capSettings);
        if (sessionObj === false) return false; // Daily-level capping: Checks if campaign exceeds daily limits

        const dailyObj = this.checkDailyCapping(campTypeObj, campaignId, today, capSettings);
        if (dailyObj === false) return false; // Global-level capping: Checks lifetime limit for the campaign

        const globalObj = this.checkGlobalCapping(campTypeObj, campaignId, capSettings.campaignTotalLimit);
        if (globalObj === false) return false; // Handles delay in displaying the campaign

        const displayObj = targetingMsgJson.display;

        if (displayObj.delay != null && displayObj.delay > 0) {
          const delay = displayObj.delay; // Resets delay to prevent re-triggering

          displayObj.delay = 0;
          setTimeout(_tr, delay * 1000, CampaignContext.msg, {
            device: CampaignContext.device,
            session: CampaignContext.session,
            request: CampaignContext.request,
            logger: logger
          }); // Delays execution, skips immediate rendering

          return false;
        } // Increments counters for session, daily, and global objects


        this.incrCount(sessionObj, campaignId, capSettings.excludeFromFreqCaps);
        this.incrCount(dailyObj, campaignId, capSettings.excludeFromFreqCaps);
        this.incrCount(globalObj, campaignId, capSettings.excludeFromFreqCaps); // Determines storage key based on campaign type (web popup or inbox)

        let campKey;

        if (targetingMsgJson[DISPLAY].wtarget_type === 3) {
          campKey = 'wi';
        }

        if (campKey === 'wi') {
          // Updates campaign object with new counts and saves to storage
          const newCampObj = {};
          newCampObj[CampaignContext.session.sessionId] = sessionObj;
          newCampObj[today] = dailyObj;
          newCampObj[GLOBAL] = globalObj; // Save CAMP to localstorage here

          saveCampaignObject({
            [campKey]: newCampObj
          });
        } else {
          /* For Web Native Display and Web Popup */
          addDeliveryPreferenceDetails(targetingMsgJson, logger);
        }
      }
    },

    // Sets up click tracking and impression increment for a campaign
    setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, isLegacy) {
      // Records an impression
      incrementImpression(targetingMsgJson, CampaignContext.request); // Sets up click event listener

      setupClickEvent(onClick, targetingMsgJson, contentDiv, divId, isLegacy, CampaignContext.device, CampaignContext.session);
    },

    // Handles rendering of image-only popup campaigns
    handleImageOnlyPopup(targetingMsgJson) {
      const divId = 'wzrkImageOnlyDiv'; // Skips if frequency limits are exceeded

      if (this.doCampHouseKeeping(targetingMsgJson, Logger.getInstance()) === false) {
        return;
      } // Removes existing popup if spam control is active


      if ($ct.dismissSpamControl && document.getElementById(divId) != null) {
        const element = document.getElementById(divId);
        element.remove();
      } // Prevents coexistence with other popups (e.g., exit intent)


      if (document.getElementById(divId) != null || document.getElementById('intentPreview') != null) {
        return;
      }

      const msgDiv = document.createElement('div');
      msgDiv.id = divId;
      document.body.appendChild(msgDiv); // Registers custom element for image-only popup if not already defined

      if (customElements.get('ct-web-popup-imageonly') === undefined) {
        customElements.define('ct-web-popup-imageonly', CTWebPopupImageOnly);
      } // Renders the popup


      return renderPopUpImageOnly(targetingMsgJson, CampaignContext.session);
    },

    // Checks if a campaign is already rendered in an iframe
    isExistingCampaign(campaignId) {
      const testIframe = document.getElementById('wiz-iframe-intent') || document.getElementById('wiz-iframe');

      if (testIframe) {
        const iframeDocument = testIframe.contentDocument || testIframe.contentWindow.document;
        return iframeDocument.documentElement.innerHTML.includes(campaignId);
      }

      return false;
    },

    // Creates and renders campaign templates (e.g., exit intent, banners, popups)
    createTemplate(targetingMsgJson, isExitIntent, wtq) {
      const campaignId = targetingMsgJson.wzrk_id.split('_')[0];
      const displayObj = targetingMsgJson.display; // Handles specific layout types

      if (displayObj.layout === WEB_POPUP_TEMPLATES.INTERSTITIAL) {
        // Handling Web Exit Intent
        return this.showExitIntent(undefined, targetingMsgJson, wtq);
      }

      if (displayObj.layout === WEB_POPUP_TEMPLATES.IMAGE_ONLY) {
        // Handling Web Popup Image Only
        this.handleImageOnlyPopup(targetingMsgJson);
        return;
      } // Skips if frequency limits are exceeded


      if (this.doCampHouseKeeping(targetingMsgJson, Logger.getInstance()) === false) {
        return;
      }

      if (displayObj.layout === WEB_POPUP_TEMPLATES.ADVANCED_BUILDER) {
        renderAdvancedBuilder(targetingMsgJson, CampaignContext.session, Logger.getInstance());
        return;
      }

      const divId = 'wizParDiv' + displayObj.layout;
      const opacityDivId = 'intentOpacityDiv' + displayObj.layout; // Removes existing elements if spam control is active

      if ($ct.dismissSpamControl && document.getElementById(divId) != null) {
        const element = document.getElementById(divId);
        const opacityElement = document.getElementById(opacityDivId);

        if (element) {
          element.remove();
        }

        if (opacityElement) {
          opacityElement.remove();
        }
      } // Skips if campaign is already rendered


      if (this.isExistingCampaign(campaignId)) return;

      if (document.getElementById(divId) != null) {
        // Skips if div already exists
        return;
      } // Maps campaign ID to div ID


      $ct.campaignDivMap[campaignId] = divId;
      const isBanner = displayObj.layout === WEB_POPUP_TEMPLATES.BANNER; // Adds opacity layer for exit intent campaigns

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
      let legacy = false; // Sets styling based on device type and layout

      if (!isBanner) {
        const marginBottom = viewHeight * 5 / 100;
        var contentHeight = 10;
        let right = viewWidth * 5 / 100;
        let bottomPosition = contentHeight + marginBottom;
        let width = viewWidth * 30 / 100 + 20;
        let widthPerct = 'width:30%;'; // Adjusts for mobile devices

        if ((/mobile/i.test(navigator.userAgent) || /mini/i.test(navigator.userAgent)) && /iPad/i.test(navigator.userAgent) === false) {
          width = viewWidth * 85 / 100 + 20;
          right = viewWidth * 5 / 100;
          bottomPosition = viewHeight * 5 / 100;
          widthPerct = 'width:80%;'; // Adjusts for tablets
        } else if ('ontouchstart' in window || /tablet/i.test(navigator.userAgent)) {
          width = viewWidth * 50 / 100 + 20;
          right = viewWidth * 5 / 100;
          bottomPosition = viewHeight * 5 / 100;
          widthPerct = 'width:50%;';
        } // Applies legacy styling if proto is absent


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

      if (displayObj.preview) {
        iframe.sandbox = 'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin';
      }

      let html; // Direct HTML content

      if (targetingMsgJson.msgContent.type === 1) {
        html = targetingMsgJson.msgContent.html;
        html = html.replace(/##campaignId##/g, campaignId);
        html = html.replace(/##campaignId_batchId##/g, targetingMsgJson.wzrk_id);
      } else {
        // Generated HTML with styling
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

      iframe.setAttribute('style', 'color-scheme: none; z-index: 2147483647; display:block; width: 100% !important; border:0px !important; border-color:none !important;');
      msgDiv.appendChild(iframe); // Dispatches event to signal campaign rendering

      const closeCampaign = new Event('CT_campaign_rendered');
      document.dispatchEvent(closeCampaign);

      if (displayObj['custom-editor']) {
        // Adds custom event scripts if needed
        html = appendScriptForCustomEvent(targetingMsgJson, html);
      }

      iframe.srcdoc = html; // Adjusts iframe height based on content

      const adjustIFrameHeight = () => {
        // Gets scroll height of content div inside iframe
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
            this.setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, legacy);
          };
        } else {
          let inDoc = iframe.contentDocument || iframe.contentWindow;
          if (inDoc.document) inDoc = inDoc.document; // safari iphone 7+ needs this.

          const _timer = setInterval(() => {
            if (inDoc.readyState === 'complete') {
              clearInterval(_timer); // adjust iframe and body height of html inside correctly

              adjustIFrameHeight();
              const contentDiv = document.getElementById('wiz-iframe').contentDocument.getElementById('contentDiv');
              this.setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, legacy);
            }
          }, 300);
        }
      } else {
        iframe.onload = () => {
          // adjust iframe and body height of html inside correctly
          adjustIFrameHeight();
          const contentDiv = document.getElementById('wiz-iframe').contentDocument.getElementById('contentDiv');
          this.setupClickUrl(onClick, targetingMsgJson, contentDiv, divId, legacy);
        };
      }
    },

    // Renders footer notification
    renderFooterNotification(targetingMsgJson, exitintentObj) {
      this.createTemplate(targetingMsgJson, false);
    },

    // Displays footer notification with callback handling
    showFooterNotification(targetingMsgJson, _callBackCalled, exitintentObj) {
      let onClick = targetingMsgJson.display.onClick;
      const displayObj = targetingMsgJson.display; // Checks for custom notification callback from CleverTap

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
          } // If present add delivery triggers to callback


          if (targetingMsgJson.display.deliveryTrigger) {
            inaObj.deliveryTrigger = targetingMsgJson.display.deliveryTrigger;
          }

          window.clevertap.raiseNotificationClicked = () => {
            if (onClick !== '' && onClick != null) {
              const jsFunc = targetingMsgJson.display.jsFunc;
              onClick += getCookieParams(CampaignContext.device, CampaignContext.session); // Invokes JS function or redirects based on click action

              if (jsFunc != null) {
                // Tracks notification clicked event
                RequestDispatcher.fireRequest(onClick);
                invokeExternalJs(jsFunc, targetingMsgJson);
                return;
              } // Opens link in new tab or redirects current page


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
        window.clevertap.popupCurrentWzrkId = targetingMsgJson.wzrk_id; // Handles delivery triggers (inactivity, scroll, exit intent, delay)

        if (displayObj.deliveryTrigger) {
          if (displayObj.deliveryTrigger.inactive) {
            this.triggerByInactivity(targetingMsgJson);
          }

          if (displayObj.deliveryTrigger.scroll) {
            this.triggerByScroll(targetingMsgJson);
          }

          if (displayObj.deliveryTrigger.isExitIntent) {
            exitintentObj = targetingMsgJson;
            /* Show it only once per callback */

            const handleMouseLeave = this.createExitIntentMouseLeaveHandler(targetingMsgJson, exitintentObj);
            window.document.addEventListener('mouseleave', handleMouseLeave);
          }

          const delay = displayObj.delay || displayObj.deliveryTrigger.deliveryDelayed;

          if (delay != null && delay > 0) {
            setTimeout(() => {
              this.renderFooterNotification(targetingMsgJson, exitintentObj);
            }, delay * 1000);
          }
        } else {
          this.renderFooterNotification(targetingMsgJson, exitintentObj);
        } // Handles popup-specific callbacks


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
            // Adds WZRK prefix key-value pairs to callback data
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
          } // Public API to record clicked event


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
            } // Adds WZRK prefix key-value pairs to event data


            if (notificationData.msgCTkv) {
              for (var wzrkPrefixObj of notificationData.msgCTkv) {
                eventData.evtData = { ...eventData.evtData,
                  ...wzrkPrefixObj
                };
              }
            }

            CampaignContext.request.processEvent(eventData);
          };

          popupCallback(inaObj);
        }
      }
    },

    // Triggers campaign based on user inactivity
    triggerByInactivity(targetNotif) {
      const IDLE_TIME_THRESHOLD = targetNotif.display.deliveryTrigger.inactive * 1000; // Convert to milliseconds

      let idleTimer;
      const events = ['mousemove', 'keypress', 'scroll', 'mousedown', 'touchmove', 'click'];

      const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          this.renderFooterNotification(targetNotif);
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
      resetIdleTimer(); // Returns cleanup function

      return removeEventListeners;
    },

    // Triggers campaign based on scroll percentage
    triggerByScroll(targetNotif) {
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
          this.renderFooterNotification(targetNotif);
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
      }); // Returns cleanup function

      return () => window.removeEventListener('scroll', throttledScrollListener);
    },

    // Handles exit intent campaigns (triggered when mouse leaves window)
    showExitIntent(event, targetObj, wtq, exitintentObj) {
      // Only triggers when mouse moves upward out of window
      if ((event === null || event === void 0 ? void 0 : event.clientY) > 0) return;
      const targetingMsgJson = targetObj || exitintentObj;
      const campaignId = targetingMsgJson.wzrk_id.split('_')[0];
      const layout = targetingMsgJson.display.layout; // Skips if campaign is already rendered

      if (this.isExistingCampaign(campaignId)) return;

      if (targetingMsgJson.display.wtarget_type === 0 && (layout === WEB_POPUP_TEMPLATES.BOX || layout === WEB_POPUP_TEMPLATES.BANNER || layout === WEB_POPUP_TEMPLATES.IMAGE_ONLY)) {
        this.createTemplate(targetingMsgJson, true);
        return true;
      } // Skips if frequency limits are exceeded


      if (this.doCampHouseKeeping(targetingMsgJson, Logger.getInstance()) === false) {
        return;
      } // Removes existing exit intent elements if spam control is active


      if ($ct.dismissSpamControl && targetingMsgJson.display.wtarget_type === 0) {
        const intentPreview = document.getElementById('intentPreview');
        const intentOpacityDiv = document.getElementById('intentOpacityDiv');

        if (intentPreview && intentOpacityDiv) {
          intentPreview.remove();
          intentOpacityDiv.remove();
        }
      } // Prevents coexistence with other popups


      if (document.getElementById('intentPreview') != null || document.getElementById('wzrkImageOnlyDiv') != null) {
        return;
      } // Skips exit intent on mobile/tablet devices


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

      let html; // Direct HTML content

      if (targetingMsgJson.msgContent.type === 1) {
        html = targetingMsgJson.msgContent.html;
        html = html.replace(/##campaignId##/g, campaignId);
        html = html.replace(/##campaignId_batchId##/g, targetingMsgJson.wzrk_id);
      } else {
        // Generated HTML with styling
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

      iframe.setAttribute('style', 'color-scheme: none; z-index: 2147483647; display:block; height: 100% !important; width: 100% !important;min-height:80px !important;border:0px !important; border-color:none !important;');
      msgDiv.appendChild(iframe); // Dispatches event for interstitial/exit intent close

      const closeCampaign = new Event('CT_campaign_rendered');
      document.dispatchEvent(closeCampaign);

      if (targetingMsgJson.display['custom-editor']) {
        html = appendScriptForCustomEvent(targetingMsgJson, html);
      }

      iframe.srcdoc = html;

      iframe.onload = () => {
        const contentDiv = document.getElementById('wiz-iframe-intent').contentDocument.getElementById('contentDiv');
        this.setupClickUrl(onClick, targetingMsgJson, contentDiv, 'intentPreview', legacy);
      };

      return true;
    },

    // Processes native display campaigns (e.g., banners, carousels)
    processNativeDisplayArr(arrInAppNotifs) {
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
          arrInAppNotifs[key].msgContent.type === 2 ? renderPersonalisationBanner(arrInAppNotifs[key]) : renderPersonalisationCarousel(arrInAppNotifs[key]); // Removes processed campaign

          delete arrInAppNotifs[key];
        }
      });
    },

    // Adds listener to process native displays after page load
    addLoadListener(arrInAppNotifs) {
      window.addEventListener('load', () => {
        let count = 0;

        if (count < 20) {
          const t = setInterval(() => {
            this.processNativeDisplayArr(arrInAppNotifs);

            if (Object.keys(arrInAppNotifs).length === 0 || count === 20) {
              clearInterval(t);
              arrInAppNotifs = {};
            }

            count++;
          }, 500);
        }
      });
    },

    // Processes web inbox notifications
    handleInboxNotifications(msg) {
      if (msg.inbox_preview) {
        processInboxNotifs(msg);
        return;
      }

      if (msg.inbox_notifs) {
        const msgArr = [];

        for (let index = 0; index < msg.inbox_notifs.length; index++) {
          var _CampaignContext$msg, _CampaignContext$msg$;

          addCampaignToLocalStorage(msg.inbox_notifs[index], CampaignContext.region, (_CampaignContext$msg = CampaignContext.msg) === null || _CampaignContext$msg === void 0 ? void 0 : (_CampaignContext$msg$ = _CampaignContext$msg.arp) === null || _CampaignContext$msg$ === void 0 ? void 0 : _CampaignContext$msg$.id);

          if (this.doCampHouseKeeping(msg.inbox_notifs[index], Logger.getInstance()) !== false) {
            msgArr.push(msg.inbox_notifs[index]);
          }
        }

        processInboxNotifs(msgArr);
      }
    },

    processCampaigns(msg, _callBackCalled, exitintentObj, logger) {
      const arrInAppNotifs = {};
      const sortedCampaigns = webNativeDisplayCampaignUtils.sortCampaignsByPriority(msg.inapp_notifs);
      const executedTargets = {
        nodes: [],
        customEvents: []
      };

      for (let index = 0; index < sortedCampaigns.length; index++) {
        var _CampaignContext$msg2, _CampaignContext$msg3;

        addCampaignToLocalStorage(sortedCampaigns[index], CampaignContext.region, (_CampaignContext$msg2 = CampaignContext.msg) === null || _CampaignContext$msg2 === void 0 ? void 0 : (_CampaignContext$msg3 = _CampaignContext$msg2.arp) === null || _CampaignContext$msg3 === void 0 ? void 0 : _CampaignContext$msg3.id);
        const targetNotif = sortedCampaigns[index];

        if (targetNotif.display.wtarget_type === CAMPAIGN_TYPES.FOOTER_NOTIFICATION || targetNotif.display.wtarget_type === CAMPAIGN_TYPES.FOOTER_NOTIFICATION_2) {
          this.showFooterNotification(targetNotif, _callBackCalled, exitintentObj);
        } else if (targetNotif.display.wtarget_type === CAMPAIGN_TYPES.EXIT_INTENT) {
          // if display['wtarget_type']==1 then exit intent
          exitintentObj = targetNotif;
          /* Show it only once per callback */

          const handleMouseLeave = this.createExitIntentMouseLeaveHandler(targetNotif, exitintentObj);
          window.document.addEventListener('mouseleave', handleMouseLeave);
        } else if (targetNotif.display.wtarget_type === CAMPAIGN_TYPES.WEB_NATIVE_DISPLAY) {
          // if display['wtarget_type']==2 then web native display
          // Skips duplicate custom event campaigns
          if (webNativeDisplayCampaignUtils.doesCampaignPushCustomEvent(targetNotif) && executedTargets.customEvents.length > 0 && webNativeDisplayCampaignUtils.shouldCurrentCustomEventCampaignBeSkipped(targetNotif, executedTargets)) {
            logger.debug('Custom Event Campaign Skipped with id :: ' + (targetNotif === null || targetNotif === void 0 ? void 0 : targetNotif.wzrk_id));
            continue;
          } // Skips duplicate DOM node campaigns


          if (webNativeDisplayCampaignUtils.doesCampaignMutateDOMNode(targetNotif) && executedTargets.nodes.some(node => {
            var _webNativeDisplayCamp;

            return (_webNativeDisplayCamp = webNativeDisplayCampaignUtils.getCampaignNodes(targetNotif)) === null || _webNativeDisplayCamp === void 0 ? void 0 : _webNativeDisplayCamp.includes(node);
          })) {
            logger.debug('DOM Campaign Skipped with id :: ' + (targetNotif === null || targetNotif === void 0 ? void 0 : targetNotif.wzrk_id));
            continue;
          } // Tracks executed custom events


          if (webNativeDisplayCampaignUtils.doesCampaignPushCustomEvent(targetNotif)) {
            /*
                This basically stores the CustomEvents with their type that we will push so that
                the next time we receive a CustomEvent with the same type we can skip it
              */
            const eventTopic = targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.KV_PAIR ? targetNotif.display.kv.topic : null;
            executedTargets.customEvents.push({
              customEventType: targetNotif.msgContent.type,
              eventTopic
            });
          } else if (webNativeDisplayCampaignUtils.doesCampaignMutateDOMNode(targetNotif)) {
            // Tracks executed DOM nodes
            const nodes = webNativeDisplayCampaignUtils.getCampaignNodes(targetNotif);
            executedTargets.nodes.push(...nodes);
          } // Handles different native display types


          if (targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.KV_PAIR) {
            handleKVpairCampaign(targetNotif);
          } else if (targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.BANNER || targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.CAROUSEL) {
            renderWebNativeDisplayBanner(targetNotif, logger, arrInAppNotifs);
          } else if (targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.VISUAL_BUILDER) {
            renderVisualBuilder(targetNotif, false);
          } else if (targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.CUSTOM_HTML) {
            renderCustomHtml(targetNotif, logger);
          } else if (targetNotif.msgContent.type === WEB_NATIVE_TEMPLATES.JSON) {
            handleJson(targetNotif);
          } else {
            this.showFooterNotification(targetNotif, _callBackCalled, exitintentObj);
          }
        }
      } // Processes banner or carousel campaign array


      if (Object.keys(arrInAppNotifs).length) {
        if (document.readyState === 'complete') {
          this.processNativeDisplayArr(arrInAppNotifs);
        } else {
          this.addLoadListener(arrInAppNotifs);
        }
      }
    },

    handleWebInbox(msg, logger) {
      if (hasWebInboxSettingsInLS()) {
        checkAndRegisterWebInboxElements();
      }

      if ($ct.inbox === null) {
        msg.webInboxSetting && processWebInboxSettings(msg.webInboxSetting);
        initializeWebInbox(logger).then(() => {
          this.handleInboxNotifications(msg);
        }).catch(e => {});
      } else {
        this.handleInboxNotifications(msg);
      }
    },

    persistsEventsAndProfileData(msg, logger) {
      // Persists events and profile data to local storage
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
            // Updates stale web popup data
            staleDataUpdate(msg.inapp_stale, 'wp');
          }

          if (msg.inbox_stale != null && msg.inbox_stale.length > 0) {
            // Updates stale web inbox data
            staleDataUpdate(msg.inbox_stale, 'wi');
          }
        } catch (e) {
          logger.error('Unable to persist evrp/arp: ' + e);
        }
      }
    },

    handleVariables(msg) {
      // Merges variables into storage
      if (msg.vars) {
        $ct.variableStore.mergeVariables(msg.vars);
      }
    }

  };

  const _tr = (msg, _ref) => {
    let {
      device,
      session,
      request,
      logger,
      region
    } = _ref;
    const _device = device;
    const _session = session;
    const _request = request;
    const _logger = logger;
    let _wizCounter = 0; // Campaign House keeping

    CampaignContext.update(device, session, request, logger, msg, region);
    deliveryPreferenceUtils.clearStaleCampaigns(msg, logger);
    deliveryPreferenceUtils.updateOccurenceForPopupAndNativeDisplay(msg, device, logger);
    deliveryPreferenceUtils.portTLC(_session, logger);
    const _callBackCalled = false;
    let exitintentObj; // Retries processing if document.body isn't ready (up to 6 attempts)

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
    } // Processes in-app notifications (e.g., footers, exit intents, native displays)


    if (msg.inapp_notifs != null) {
      commonCampaignUtils.processCampaigns(msg, _callBackCalled, exitintentObj, logger);
    } // Initializes and processes web inbox settings and notifications


    if (msg.webInboxSetting || msg.inbox_notifs != null) {
      /**
       * When the user visits a website for the 1st time after web inbox channel is setup,
       * we need to initialise the inbox here because the initializeWebInbox method within init will not be executed
       * as we would not have any entry related to webInboxSettings in the LS
       */
      commonCampaignUtils.handleWebInbox(msg, logger);
    } // Processes web push configuration


    if (msg.webPushConfig) {
      processWebPushConfig(msg.webPushConfig, logger, request);
    }

    commonCampaignUtils.handleVariables(msg);
    commonCampaignUtils.persistsEventsAndProfileData(msg, logger);
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

  var _logger$4 = _classPrivateFieldLooseKey("logger");

  var _sessionId = _classPrivateFieldLooseKey("sessionId");

  var _isPersonalisationActive$1 = _classPrivateFieldLooseKey("isPersonalisationActive");

  class SessionManager {
    // SCOOKIE_NAME
    constructor(_ref) {
      let {
        logger,
        isPersonalisationActive
      } = _ref;
      Object.defineProperty(this, _logger$4, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _sessionId, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive$1, {
        writable: true,
        value: void 0
      });
      this.cookieName = void 0;
      this.scookieObj = void 0;
      this.sessionId = StorageManager.getMetaProp('cs');
      _classPrivateFieldLooseBase(this, _logger$4)[_logger$4] = logger;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive$1)[_isPersonalisationActive$1] = isPersonalisationActive;
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
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$1)[_isPersonalisationActive$1]()) {
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
      if (!_classPrivateFieldLooseBase(this, _isPersonalisationActive$1)[_isPersonalisationActive$1]()) {
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

  var _logger$3 = _classPrivateFieldLooseKey("logger");

  var _account$3 = _classPrivateFieldLooseKey("account");

  var _device$1 = _classPrivateFieldLooseKey("device");

  var _session$1 = _classPrivateFieldLooseKey("session");

  var _isPersonalisationActive = _classPrivateFieldLooseKey("isPersonalisationActive");

  var _clearCookie = _classPrivateFieldLooseKey("clearCookie");

  var _getNextAvailableReqN = _classPrivateFieldLooseKey("getNextAvailableReqN");

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
      Object.defineProperty(this, _getNextAvailableReqN, {
        value: _getNextAvailableReqN2
      });
      Object.defineProperty(this, _logger$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$3, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _device$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _isPersonalisationActive, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _clearCookie, {
        writable: true,
        value: false
      });
      this.processingBackup = false;
      _classPrivateFieldLooseBase(this, _logger$3)[_logger$3] = logger;
      _classPrivateFieldLooseBase(this, _account$3)[_account$3] = account;
      _classPrivateFieldLooseBase(this, _device$1)[_device$1] = device;
      _classPrivateFieldLooseBase(this, _session$1)[_session$1] = session;
      _classPrivateFieldLooseBase(this, _isPersonalisationActive)[_isPersonalisationActive] = isPersonalisationActive;
      RequestDispatcher.logger = logger;
      RequestDispatcher.device = device;
      RequestDispatcher.account = account;
    }
    /**
    * Unified backup processing method
    * @param {boolean} oulOnly - If true, process only OUL requests. If false, process all non-fired requests.
    */


    processBackupEvents() {
      let oulOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const backupMap = StorageManager.readFromLSorCookie(LCOOKIE_NAME);

      if (typeof backupMap === 'undefined' || backupMap === null) {
        return;
      }

      this.processingBackup = true;

      for (const idx in backupMap) {
        if (backupMap.hasOwnProperty(idx)) {
          const backupEvent = backupMap[idx];

          if (typeof backupEvent.fired !== 'undefined') {
            continue;
          }

          const isOULRequest = StorageManager.isBackupOUL(parseInt(idx));
          const shouldProcess = oulOnly ? isOULRequest : true;

          if (shouldProcess) {
            _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug("Processing ".concat(isOULRequest ? 'OUL' : 'regular', " backup event : ").concat(backupEvent.q));

            if (typeof backupEvent.q !== 'undefined') {
              const session = JSON.parse(StorageManager.readCookie(SCOOKIE_PREFIX + '_' + _classPrivateFieldLooseBase(this, _account$3)[_account$3].id));

              if (session === null || session === void 0 ? void 0 : session.s) {
                backupEvent.q = backupEvent.q + '&s=' + session.s;
              }

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
        dataObject = removeUnsupportedChars(dataObject, _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]);
      }

      if (!isObjectEmpty(_classPrivateFieldLooseBase(this, _logger$3)[_logger$3].wzrkError)) {
        dataObject.wzrk_error = _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].wzrkError;
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].wzrkError = {};
      }

      dataObject.id = _classPrivateFieldLooseBase(this, _account$3)[_account$3].id;

      if (isValueValid(_classPrivateFieldLooseBase(this, _device$1)[_device$1].gcookie)) {
        dataObject.g = _classPrivateFieldLooseBase(this, _device$1)[_device$1].gcookie;
      }

      const obj = _classPrivateFieldLooseBase(this, _session$1)[_session$1].getSessionCookieObject();

      dataObject.s = obj.s; // session cookie

      dataObject.pg = typeof obj.p === 'undefined' ? 1 : obj.p; // Page count

      let proto = document.location.protocol;
      proto = proto.replace(':', '');
      dataObject.af = { ...dataObject.af,
        lib: 'web-sdk-v2.3.0',
        protocol: proto,
        ...$ct.flutterVersion
      }; // app fields

      try {
        if (sessionStorage.hasOwnProperty('WZRK_D') || sessionStorage.getItem('WZRK_D')) {
          dataObject.debug = true;
        }
      } catch (e) {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug('Error in reading WZRK_D from session storage');
      }

      return dataObject;
    }

    addFlags(data) {
      // check if cookie should be cleared.
      _classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie] = StorageManager.getAndClearMetaProp(CLEAR);

      if (_classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie] !== undefined && _classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie]) {
        data.rc = true;

        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug('reset cookie sent in request and cleared from meta for future requests.');
      }

      if (_classPrivateFieldLooseBase(this, _isPersonalisationActive)[_isPersonalisationActive]()) {
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
      const now = getNow(); // Get the next available request number that doesn't conflict with existing backups

      const nextReqN = _classPrivateFieldLooseBase(this, _getNextAvailableReqN)[_getNextAvailableReqN]();

      $ct.globalCache.REQ_N = nextReqN;
      url = addToURL(url, 'rn', nextReqN);
      const data = url + '&i=' + now + '&sn=' + seqNo;
      StorageManager.backupEvent(data, nextReqN, _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]); // Mark as OUL if it's an OUL request

      if (sendOULFlag) {
        StorageManager.markBackupAsOUL(nextReqN);
      } // if offline is set to true, save the request in backup and return


      if ($ct.offline || $ct.delayEvents) return; // if there is no override
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

        window.oulReqN = nextReqN;
        RequestDispatcher.fireRequest(data, false, sendOULFlag, evtName);
      } else {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug("Not fired due to override - ".concat($ct.blockRequest, " or clearCookie - ").concat(_classPrivateFieldLooseBase(this, _clearCookie)[_clearCookie], " or OUL request in progress - ").concat(window.isOULInProgress));
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

        const obj = _classPrivateFieldLooseBase(this, _session$1)[_session$1].getSessionCookieObject();

        data.s = obj.s; // session cookie

        const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]);

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
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(payload, _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]));
      RequestDispatcher.fireRequest(pageLoadUrl); // set in localstorage

      StorageManager.save(WEBPUSH_LS_KEY, 'ok');
    }

    processEvent(data) {
      _classPrivateFieldLooseBase(this, _addToLocalEventMap)[_addToLocalEventMap](data.evtName);

      data = this.addSystemDataToObject(data, undefined);
      this.addFlags(data);
      data[CAMP_COOKIE_NAME] = getCampaignObjForLc();
      const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$3)[_logger$3]);

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
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug('Sync data successful', data);

        return data;
      }).catch(e => {
        _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug('Error in syncing variables', e);

        throw e;
      });
    }

  }

  var _getNextAvailableReqN2 = function _getNextAvailableReqN2() {
    // Read existing backup data to check for conflicts
    const backupMap = StorageManager.readFromLSorCookie(LCOOKIE_NAME); // Start from the current REQ_N + 1

    let candidateReqN = $ct.globalCache.REQ_N + 1; // If no backup data exists, use the candidate

    if (!backupMap || typeof backupMap !== 'object') {
      return candidateReqN;
    } // Keep incrementing until we find a request number that doesn't exist in backup


    while (backupMap.hasOwnProperty(candidateReqN.toString())) {
      candidateReqN++;

      _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug("Request number ".concat(candidateReqN - 1, " already exists in backup, trying ").concat(candidateReqN));
    }

    _classPrivateFieldLooseBase(this, _logger$3)[_logger$3].debug("Using request number: ".concat(candidateReqN));

    return candidateReqN;
  };

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

  var _request$2 = _classPrivateFieldLooseKey("request");

  var _account$2 = _classPrivateFieldLooseKey("account");

  var _oldValues = _classPrivateFieldLooseKey("oldValues");

  var _logger$2 = _classPrivateFieldLooseKey("logger");

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
      Object.defineProperty(this, _request$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$2, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _oldValues, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _logger$2, {
        writable: true,
        value: void 0
      });
      _classPrivateFieldLooseBase(this, _logger$2)[_logger$2] = logger;
      _classPrivateFieldLooseBase(this, _request$2)[_request$2] = request;
      _classPrivateFieldLooseBase(this, _account$2)[_account$2] = account;
      _classPrivateFieldLooseBase(this, _oldValues)[_oldValues] = values;
    } // TODO : Do we need to check if account id is set or not here?


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
      if (_classPrivateFieldLooseBase(this, _oldValues)[_oldValues]) {
        _classPrivateFieldLooseBase(this, _processPrivacyArray)[_processPrivacyArray](_classPrivateFieldLooseBase(this, _oldValues)[_oldValues]);
      }

      _classPrivateFieldLooseBase(this, _oldValues)[_oldValues] = null;
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
        data = _classPrivateFieldLooseBase(this, _request$2)[_request$2].addSystemDataToObject(data, undefined);
        const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger$2)[_logger$2]);

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account$2)[_account$2].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);
        pageLoadUrl = addToURL(pageLoadUrl, OPTOUT_KEY, optOut ? 'true' : 'false');

        _classPrivateFieldLooseBase(this, _request$2)[_request$2].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);

        privacyArr.splice(0, privacyArr.length);
      }
    }
  };

  var _variableStore$1 = _classPrivateFieldLooseKey("variableStore");

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
      Object.defineProperty(this, _variableStore$1, {
        writable: true,
        value: void 0
      });
      this.name = null;
      this.defaultValue = null;
      this.value = null;
      this.type = null;
      this.hadStarted = false;
      this.valueChangedCallbacks = [];
      _classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1] = variableStore;
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


    static define(name, defaultValue, variableStore, logger) {
      if (!name || typeof name !== 'string') {
        logger.error('Empty or invalid name parameter provided.');
        return null;
      }

      if (name.startsWith('.') || name.endsWith('.')) {
        logger.error('Variable name starts or ends with a `.` which is not allowed: ' + name);
        return null;
      }

      const typeOfDefaultValue = typeof defaultValue;

      if (typeOfDefaultValue !== 'string' && typeOfDefaultValue !== 'number' && typeOfDefaultValue !== 'boolean' && typeOfDefaultValue !== 'object') {
        logger.error('Only (string, number, boolean, objects) are accepted as value');
        return null;
      }

      if (typeOfDefaultValue === 'object' && objectHasNestedArrayOrFunction(defaultValue)) {
        logger.error('Nested arrays/functions are not supported in JSON variables');
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
        logger.error(error);
      }

      return varInstance;
    }

    static defineFileVar(name, variableStore, logger) {
      if (!name || typeof name !== 'string' || name.startsWith('.') || name.endsWith('.')) {
        logger.error('Empty or invalid name parameter provided.');
        return null;
      }

      const varInstance = new Variable({
        variableStore
      });

      try {
        varInstance.name = name;
        varInstance.defaultValue = '';
        varInstance.type = 'file';
        variableStore.registerVariable(varInstance);
        varInstance.update(varInstance.defaultValue);
      } catch (error) {
        logger.error(error);
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

      if (_classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1].hasVarsRequestCompleted()) {
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


    addValueChangedCallback(onValueChanged, logger) {
      if (!onValueChanged) {
        logger.log('Invalid callback parameter provided.');
        return;
      }

      this.valueChangedCallbacks.push(onValueChanged);

      if (_classPrivateFieldLooseBase(this, _variableStore$1)[_variableStore$1].hasVarsRequestCompleted()) {
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

  var _logger$1 = _classPrivateFieldLooseKey("logger");

  var _account$1 = _classPrivateFieldLooseKey("account");

  var _request$1 = _classPrivateFieldLooseKey("request");

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
      Object.defineProperty(this, _logger$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account$1, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request$1, {
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
      _classPrivateFieldLooseBase(this, _logger$1)[_logger$1] = logger;
      _classPrivateFieldLooseBase(this, _account$1)[_account$1] = account;
      _classPrivateFieldLooseBase(this, _request$1)[_request$1] = request;
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

      _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].debug('registerVariable', _classPrivateFieldLooseBase(this, _variables)[_variables]);
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
      if (!_classPrivateFieldLooseBase(this, _account$1)[_account$1].token) {
        const m = 'Account token is missing.';

        _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error(m);

        return Promise.reject(new Error(m));
      }

      const payload = {
        type: 'varsPayload',
        vars: {}
      };

      for (const name in _classPrivateFieldLooseBase(this, _variables)[_variables]) {
        if (typeof _classPrivateFieldLooseBase(this, _variables)[_variables][name].defaultValue === 'object') {
          var _classPrivateFieldLoo;

          const flattenedPayload = flattenObjectToDotNotation({
            [(_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _variables)[_variables][name]) === null || _classPrivateFieldLoo === void 0 ? void 0 : _classPrivateFieldLoo.name]: _classPrivateFieldLooseBase(this, _variables)[_variables][name].defaultValue
          });

          for (const key in flattenedPayload) {
            payload.vars[key] = {
              defaultValue: flattenedPayload[key].defaultValue,
              type: flattenedPayload[key].type
            };
          }
        } else if (_classPrivateFieldLooseBase(this, _variables)[_variables][name].type === 'file') {
          payload.vars[name] = {
            type: _classPrivateFieldLooseBase(this, _variables)[_variables][name].type
          };
        } else {
          payload.vars[name] = {
            defaultValue: _classPrivateFieldLooseBase(this, _variables)[_variables][name].defaultValue,
            type: _classPrivateFieldLooseBase(this, _variables)[_variables][name].type
          };
        }
      } // Check if payload.vars is empty


      if (Object.keys(payload.vars).length === 0) {
        const m = 'No variables are defined.';

        _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error(m);

        return Promise.reject(new Error(m));
      }

      let meta = {};
      meta = _classPrivateFieldLooseBase(this, _request$1)[_request$1].addSystemDataToObject(meta, undefined);
      meta.tk = _classPrivateFieldLooseBase(this, _account$1)[_account$1].token;
      meta.type = 'meta';
      const body = JSON.stringify([meta, payload]);

      const url = _classPrivateFieldLooseBase(this, _account$1)[_account$1].dataPostPEURL;

      return _classPrivateFieldLooseBase(this, _request$1)[_request$1].post(url, body).then(r => {
        if (onSyncSuccess && typeof onSyncSuccess === 'function') {
          onSyncSuccess(r);
        }

        return r;
      }).catch(e => {
        if (onSyncFailure && typeof onSyncFailure === 'function') {
          onSyncFailure(e);
        }

        if (e.status === 400) {
          _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error('Invalid sync payload or clear the existing draft');
        } else if (e.status === 401) {
          _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error('This is not a test profile');
        } else {
          _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error('Sync variable failed');
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
      _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].debug('msg vars is ', vars);

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
        _classPrivateFieldLooseBase(this, _logger$1)[_logger$1].error('callback is not a function');
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

  var _logger = _classPrivateFieldLooseKey("logger");

  var _api = _classPrivateFieldLooseKey("api");

  var _onloadcalled = _classPrivateFieldLooseKey("onloadcalled");

  var _device = _classPrivateFieldLooseKey("device");

  var _session = _classPrivateFieldLooseKey("session");

  var _account = _classPrivateFieldLooseKey("account");

  var _request = _classPrivateFieldLooseKey("request");

  var _variableStore = _classPrivateFieldLooseKey("variableStore");

  var _isSpa = _classPrivateFieldLooseKey("isSpa");

  var _previousUrl = _classPrivateFieldLooseKey("previousUrl");

  var _boundCheckPageChanged = _classPrivateFieldLooseKey("boundCheckPageChanged");

  var _dismissSpamControl = _classPrivateFieldLooseKey("dismissSpamControl");

  var _pageChangeTimeoutId = _classPrivateFieldLooseKey("pageChangeTimeoutId");

  var _processOldValues = _classPrivateFieldLooseKey("processOldValues");

  var _debounce = _classPrivateFieldLooseKey("debounce");

  var _checkPageChanged = _classPrivateFieldLooseKey("checkPageChanged");

  var _updateUnviewedBadgePosition = _classPrivateFieldLooseKey("updateUnviewedBadgePosition");

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
      var _clevertap$account, _clevertap$account2, _clevertap$account3, _clevertap$account4, _clevertap$account5, _clevertap$config, _clevertap$config2, _clevertap$dismissSpa, _clevertap$dismissSpa2, _clevertap$account6;

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
      Object.defineProperty(this, _updateUnviewedBadgePosition, {
        value: _updateUnviewedBadgePosition2
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
      Object.defineProperty(this, _logger, {
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
      Object.defineProperty(this, _device, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _session, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _account, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _request, {
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, _variableStore, {
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
      Object.defineProperty(this, _pageChangeTimeoutId, {
        writable: true,
        value: void 0
      });
      this.popupCallbacks = {};
      this.popupCurrentWzrkId = '';
      _classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] = 0;
      this._isPersonalisationActive = this._isPersonalisationActive.bind(this);

      this.raiseNotificationClicked = () => {};

      _classPrivateFieldLooseBase(this, _logger)[_logger] = new Logger(logLevels.INFO);
      _classPrivateFieldLooseBase(this, _account)[_account] = new Account((_clevertap$account = clevertap.account) === null || _clevertap$account === void 0 ? void 0 : _clevertap$account[0], clevertap.region || ((_clevertap$account2 = clevertap.account) === null || _clevertap$account2 === void 0 ? void 0 : _clevertap$account2[1]), clevertap.targetDomain || ((_clevertap$account3 = clevertap.account) === null || _clevertap$account3 === void 0 ? void 0 : _clevertap$account3[2]), clevertap.token || ((_clevertap$account4 = clevertap.account) === null || _clevertap$account4 === void 0 ? void 0 : _clevertap$account4[3]));
      encryption.key = (_clevertap$account5 = clevertap.account) === null || _clevertap$account5 === void 0 ? void 0 : _clevertap$account5[0].id; // Custom Guid will be set here

      const result = validateCustomCleverTapID(clevertap === null || clevertap === void 0 ? void 0 : (_clevertap$config = clevertap.config) === null || _clevertap$config === void 0 ? void 0 : _clevertap$config.customId);

      if (!result.isValid && (clevertap === null || clevertap === void 0 ? void 0 : (_clevertap$config2 = clevertap.config) === null || _clevertap$config2 === void 0 ? void 0 : _clevertap$config2.customId)) {
        _classPrivateFieldLooseBase(this, _logger)[_logger].error(result.error);
      }

      _classPrivateFieldLooseBase(this, _device)[_device] = new DeviceManager({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        customId: (result === null || result === void 0 ? void 0 : result.isValid) ? result === null || result === void 0 ? void 0 : result.sanitizedId : null
      });
      _classPrivateFieldLooseBase(this, _dismissSpamControl)[_dismissSpamControl] = (_clevertap$dismissSpa = clevertap.dismissSpamControl) !== null && _clevertap$dismissSpa !== void 0 ? _clevertap$dismissSpa : true;
      this.shpfyProxyPath = clevertap.shpfyProxyPath || '';
      _classPrivateFieldLooseBase(this, _session)[_session] = new SessionManager({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        isPersonalisationActive: this._isPersonalisationActive
      });
      _classPrivateFieldLooseBase(this, _request)[_request] = new RequestManager({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        account: _classPrivateFieldLooseBase(this, _account)[_account],
        device: _classPrivateFieldLooseBase(this, _device)[_device],
        session: _classPrivateFieldLooseBase(this, _session)[_session],
        isPersonalisationActive: this._isPersonalisationActive
      });
      this.enablePersonalization = clevertap.enablePersonalization || false;
      this.event = new EventHandler({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        isPersonalisationActive: this._isPersonalisationActive
      }, clevertap.event);
      this.profile = new ProfileHandler({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        account: _classPrivateFieldLooseBase(this, _account)[_account],
        isPersonalisationActive: this._isPersonalisationActive
      }, clevertap.profile);
      this.onUserLogin = new UserLoginHandler({
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        account: _classPrivateFieldLooseBase(this, _account)[_account],
        session: _classPrivateFieldLooseBase(this, _session)[_session],
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        device: _classPrivateFieldLooseBase(this, _device)[_device]
      }, clevertap.onUserLogin);
      this.privacy = new Privacy({
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        account: _classPrivateFieldLooseBase(this, _account)[_account],
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger]
      }, clevertap.privacy);
      this.notifications = new NotificationHandler({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        account: _classPrivateFieldLooseBase(this, _account)[_account]
      }, clevertap.notifications);
      _classPrivateFieldLooseBase(this, _variableStore)[_variableStore] = new VariableStore({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        account: _classPrivateFieldLooseBase(this, _account)[_account],
        event: this.event
      });
      _classPrivateFieldLooseBase(this, _api)[_api] = new CleverTapAPI({
        logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
        request: _classPrivateFieldLooseBase(this, _request)[_request],
        device: _classPrivateFieldLooseBase(this, _device)[_device],
        session: _classPrivateFieldLooseBase(this, _session)[_session]
      });
      this.spa = clevertap.spa;
      this.dismissSpamControl = (_clevertap$dismissSpa2 = clevertap.dismissSpamControl) !== null && _clevertap$dismissSpa2 !== void 0 ? _clevertap$dismissSpa2 : true;
      this.user = new User({
        isPersonalisationActive: this._isPersonalisationActive
      });
      encryption.logger = _classPrivateFieldLooseBase(this, _logger)[_logger];
      this.session = {
        getTimeElapsed: () => {
          return _classPrivateFieldLooseBase(this, _session)[_session].getTimeElapsed();
        },
        getPageCount: () => {
          return _classPrivateFieldLooseBase(this, _session)[_session].getPageCount();
        }
      };

      this.logout = () => {
        _classPrivateFieldLooseBase(this, _logger)[_logger].debug('logout called');

        StorageManager.setInstantDeleteFlagInK();
      };

      this.clear = () => {
        this.onUserLogin.clear();
      };

      this.getCleverTapID = () => {
        return _classPrivateFieldLooseBase(this, _device)[_device].getGuid();
      };

      this.getAccountID = () => {
        return _classPrivateFieldLooseBase(this, _account)[_account].id;
      };

      this.getSCDomain = () => {
        return _classPrivateFieldLooseBase(this, _account)[_account].finalTargetDomain;
      };

      this.setLibrary = (libName, libVersion) => {
        $ct.flutterVersion = {
          [libName]: libVersion
        };
      }; // Set the Signed Call sdk version and fire request


      this.setSCSDKVersion = ver => {
        _classPrivateFieldLooseBase(this, _account)[_account].scSDKVersion = ver;
        const data = {};
        data.af = {
          scv: 'sc-sdk-v' + _classPrivateFieldLooseBase(this, _account)[_account].scSDKVersion
        };

        let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

        pageLoadUrl = addToURL(pageLoadUrl, 'type', 'page');
        pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger)[_logger]));

        _classPrivateFieldLooseBase(this, _request)[_request].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
      };

      if (hasWebInboxSettingsInLS()) {
        checkAndRegisterWebInboxElements();
        initializeWebInbox(_classPrivateFieldLooseBase(this, _logger)[_logger]);
      } // Get Inbox Message Count


      this.getInboxMessageCount = () => {
        const msgCount = getInboxMessages();
        return Object.keys(msgCount).length;
      }; // Get Inbox Unread Message Count


      this.getInboxMessageUnreadCount = () => {
        try {
          const unreadMessages = this.getUnreadInboxMessages();
          const result = Object.keys(unreadMessages).length;
          return result;
        } catch (e) {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error('Error in getInboxMessageUnreadCount' + e);
        }
      }; // Get All Inbox messages


      this.getAllInboxMessages = () => {
        return getInboxMessages();
      }; // Get only Unread messages


      this.getUnreadInboxMessages = () => {
        try {
          const messages = getInboxMessages();
          const result = {};

          if (Object.keys(messages).length > 0) {
            for (const message in messages) {
              if (messages[message].viewed === 0) {
                result[message] = messages[message];
              }
            }
          }

          return result;
        } catch (e) {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error('Error in getUnreadInboxMessages' + e);
        }
      }; // Get message object belonging to the given message id only. Message id should be a String


      this.getInboxMessageForId = messageId => {
        const messages = getInboxMessages();

        if ((messageId !== null || messageId !== '') && messages.hasOwnProperty(messageId)) {
          return messages[messageId];
        } else {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error('No message available for message Id ' + messageId);
        }
      }; // Delete message from the Inbox. Message id should be a String
      // If the message to be deleted is unviewed then decrement the badge count, delete the message from unviewedMessages list
      // Then remove the message from local storage and update cookie


      this.deleteInboxMessage = messageId => {
        const messages = getInboxMessages();

        if ((messageId !== null || messageId !== '') && messages.hasOwnProperty(messageId)) {
          if (messages[messageId].viewed === 0) {
            if ($ct.inbox) {
              $ct.inbox.unviewedCounter--;
              delete $ct.inbox.unviewedMessages[messageId];
            }

            const unViewedBadge = document.getElementById('unviewedBadge');

            if (unViewedBadge) {
              unViewedBadge.innerText = $ct.inbox.unviewedCounter;
              unViewedBadge.style.display = $ct.inbox.unviewedCounter > 0 ? 'flex' : 'none';
            }
          }

          const ctInbox = document.querySelector('ct-web-inbox');

          if (ctInbox) {
            const el = ctInbox.shadowRoot.getElementById(messageId);
            el && el.remove();
          }

          delete messages[messageId];
          saveInboxMessages(messages);
        } else {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error('No message available for message Id ' + messageId);
        }
      };
      /* Mark Message as Read. Message id should be a String
       - Check if the message Id exist in the unread message list
       - Remove the unread marker, update the viewed flag, decrement the bage Count
       - renderNotificationViewed */


      this.markReadInboxMessage = messageId => {
        const messages = getInboxMessages();

        if ((messageId !== null || messageId !== '') && messages.hasOwnProperty(messageId)) {
          if (messages[messageId].viewed === 1) {
            return _classPrivateFieldLooseBase(this, _logger)[_logger].error('Message already viewed' + messageId);
          }

          const ctInbox = document.querySelector('ct-web-inbox');

          if (ctInbox) {
            const el = ctInbox.shadowRoot.getElementById(messageId);

            if (el !== null) {
              el.shadowRoot.getElementById('unreadMarker').style.display = 'none';
            }
          }

          messages[messageId].viewed = 1;
          const unViewedBadge = document.getElementById('unviewedBadge');

          if (unViewedBadge) {
            var counter = parseInt(unViewedBadge.innerText) - 1;
            unViewedBadge.innerText = counter;
            unViewedBadge.style.display = counter > 0 ? 'flex' : 'none';
          }

          window.clevertap.renderNotificationViewed({
            msgId: messages[messageId].wzrk_id,
            pivotId: messages[messageId].pivotId
          });

          if ($ct.inbox) {
            $ct.inbox.unviewedCounter--;
            delete $ct.inbox.unviewedMessages[messageId];
          }

          saveInboxMessages(messages);
        } else {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error('No message available for message Id ' + messageId);
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
        const messages = getInboxMessages();
        const unreadMsg = this.getUnreadInboxMessages();

        if (Object.keys(unreadMsg).length > 0) {
          const msgIds = Object.keys(unreadMsg);
          msgIds.forEach(key => {
            const ctInbox = document.querySelector('ct-web-inbox');

            if (ctInbox) {
              const el = ctInbox.shadowRoot.getElementById(key);

              if (el !== null) {
                el.shadowRoot.getElementById('unreadMarker').style.display = 'none';
              }
            }

            messages[key].viewed = 1;
            window.clevertap.renderNotificationViewed({
              msgId: messages[key].wzrk_id,
              pivotId: messages[key].wzrk_pivot
            });
          });
          const unViewedBadge = document.getElementById('unviewedBadge');

          if (unViewedBadge) {
            unViewedBadge.innerText = 0;
            unViewedBadge.style.display = 'none';
          }

          saveInboxMessages(messages);
          $ct.inbox.unviewedCounter = 0;
          $ct.inbox.unviewedMessages = {};
        } else {
          _classPrivateFieldLooseBase(this, _logger)[_logger].debug('All messages are already read');
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

        _classPrivateFieldLooseBase(this, _request)[_request].processEvent(data);
      };

      this.setLogLevel = l => {
        _classPrivateFieldLooseBase(this, _logger)[_logger].logLevel = Number(l);

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

      this.enableLocalStorageEncryption = value => {
        encryption.enableLocalStorageEncryption = value;
      };

      this.isLocalStorageEncryptionEnabled = () => {
        return encryption.enableLocalStorageEncryption;
      };

      const _handleEmailSubscription = (subscription, reEncoded, fetchGroups) => {
        handleEmailSubscription(subscription, reEncoded, fetchGroups, _classPrivateFieldLooseBase(this, _account)[_account], _classPrivateFieldLooseBase(this, _logger)[_logger]);
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
        closeIframe(campaignId, divIdIgnored, _classPrivateFieldLooseBase(this, _session)[_session].sessionId);
      };

      api.enableWebPush = (enabled, applicationServerKey) => {
        setServerKey(applicationServerKey);

        this.notifications._enableWebPush(enabled, applicationServerKey);

        try {
          StorageManager.saveToLSorCookie(APPLICATION_SERVER_KEY_RECEIVED, true);
        } catch (error) {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error('Could not read value from local storage', error);
        }
      };

      api.tr = msg => {
        _tr(msg, {
          device: _classPrivateFieldLooseBase(this, _device)[_device],
          session: _classPrivateFieldLooseBase(this, _session)[_session],
          request: _classPrivateFieldLooseBase(this, _request)[_request],
          logger: _classPrivateFieldLooseBase(this, _logger)[_logger],
          region: _classPrivateFieldLooseBase(this, _account)[_account].region
        });
      };

      api.setEnum = enumVal => {
        setEnum(enumVal, _classPrivateFieldLooseBase(this, _logger)[_logger]);
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

      if ((_clevertap$account6 = clevertap.account) === null || _clevertap$account6 === void 0 ? void 0 : _clevertap$account6[0].id) {
        var _clevertap$account7;

        // The accountId is present so can init with empty values.
        // Needed to maintain backward compatability with legacy implementations.
        // Npm imports/require will need to call init explictly with accountId
        StorageManager.saveToLSorCookie(ACCOUNT_ID, (_clevertap$account7 = clevertap.account) === null || _clevertap$account7 === void 0 ? void 0 : _clevertap$account7[0].id);
        this.init();
      }
    }

    createCustomIdIfValid(customId) {
      const result = validateCustomCleverTapID(customId);

      if (!result.isValid) {
        _classPrivateFieldLooseBase(this, _logger)[_logger].error(result.error);
      }
      /* Only add Custom Id if no existing id is present */


      if (_classPrivateFieldLooseBase(this, _device)[_device].gcookie) {
        return;
      }

      if (result.isValid) {
        _classPrivateFieldLooseBase(this, _device)[_device].gcookie = result === null || result === void 0 ? void 0 : result.sanitizedId;
        StorageManager.saveToLSorCookie(GCOOKIE_NAME, result === null || result === void 0 ? void 0 : result.sanitizedId);

        _classPrivateFieldLooseBase(this, _logger)[_logger].debug('CT Initialized with customId:: ' + (result === null || result === void 0 ? void 0 : result.sanitizedId));
      } else {
        _classPrivateFieldLooseBase(this, _logger)[_logger].error('Invalid customId');
      }
    }

    init(accountId, region, targetDomain, token) {
      let config = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        antiFlicker: {},
        customId: null,
        isolateSubdomain: false
      };

      if ((config === null || config === void 0 ? void 0 : config.antiFlicker) && Object.keys(config === null || config === void 0 ? void 0 : config.antiFlicker).length > 0) {
        addAntiFlicker(config.antiFlicker);
      }

      if (config === null || config === void 0 ? void 0 : config.isolateSubdomain) {
        StorageManager.saveToLSorCookie(ISOLATE_COOKIE, true);
      }

      if (_classPrivateFieldLooseBase(this, _onloadcalled)[_onloadcalled] === 1) {
        // already initailsed
        return;
      }

      if (accountId) {
        encryption.key = accountId;
      }

      StorageManager.removeCookie('WZRK_P', window.location.hostname);

      if (!_classPrivateFieldLooseBase(this, _account)[_account].id) {
        if (!accountId) {
          _classPrivateFieldLooseBase(this, _logger)[_logger].error(EMBED_ERROR);

          return;
        }

        _classPrivateFieldLooseBase(this, _account)[_account].id = accountId;
        StorageManager.saveToLSorCookie(ACCOUNT_ID, accountId);

        _classPrivateFieldLooseBase(this, _logger)[_logger].debug('CT Initialized with Account ID: ' + _classPrivateFieldLooseBase(this, _account)[_account].id);
      }

      handleActionMode(_classPrivateFieldLooseBase(this, _logger)[_logger], _classPrivateFieldLooseBase(this, _account)[_account].id);
      checkCustomHtmlNativeDisplayPreview(_classPrivateFieldLooseBase(this, _logger)[_logger]);
      checkWebPopupPreview();
      _classPrivateFieldLooseBase(this, _session)[_session].cookieName = SCOOKIE_PREFIX + '_' + _classPrivateFieldLooseBase(this, _account)[_account].id;

      if (region) {
        _classPrivateFieldLooseBase(this, _account)[_account].region = region;
      }

      if (targetDomain) {
        _classPrivateFieldLooseBase(this, _account)[_account].targetDomain = targetDomain;
      }

      if (token) {
        _classPrivateFieldLooseBase(this, _account)[_account].token = token;
      }

      if (config === null || config === void 0 ? void 0 : config.customId) {
        this.createCustomIdIfValid(config.customId);
      } // Only process OUL backup events if BLOCK_REQUEST_COOKIE is set
      // This ensures user identity is established before other events


      if (StorageManager.readFromLSorCookie(BLOCK_REQUEST_COOKIE) === true) {
        _classPrivateFieldLooseBase(this, _logger)[_logger].debug('Processing OUL backup events first to establish user identity');

        _classPrivateFieldLooseBase(this, _request)[_request].processBackupEvents(true);
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
        if (_classPrivateFieldLooseBase(this, _device)[_device].gcookie) {
          clearInterval(backupInterval);

          _classPrivateFieldLooseBase(this, _request)[_request].processBackupEvents();
        }
      }, 3000);

      if (_classPrivateFieldLooseBase(this, _isSpa)[_isSpa]) {
        // listen to click on the document and check if URL has changed.
        document.addEventListener('click', _classPrivateFieldLooseBase(this, _boundCheckPageChanged)[_boundCheckPageChanged]);
        /* Listen for the Back and Forward buttons */

        window.addEventListener('popstate', _classPrivateFieldLooseBase(this, _boundCheckPageChanged)[_boundCheckPageChanged]);
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

      const obj = _classPrivateFieldLooseBase(this, _session)[_session].getSessionCookieObject();

      let pgCount = typeof obj.p === 'undefined' ? 0 : obj.p;
      obj.p = ++pgCount;

      _classPrivateFieldLooseBase(this, _session)[_session].setSessionCookieObject(obj); // -- update page count


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

      data = _classPrivateFieldLooseBase(this, _request)[_request].addSystemDataToObject(data, undefined);
      data.cpg = currLocation;
      data[CAMP_COOKIE_NAME] = getCampaignObjForLc();

      let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

      _classPrivateFieldLooseBase(this, _request)[_request].addFlags(data); // send dsync flag when page = 1


      if (parseInt(data.pg) === 1) {
        _classPrivateFieldLooseBase(this, _overrideDSyncFlag)[_overrideDSyncFlag](data);
      }

      pageLoadUrl = addToURL(pageLoadUrl, 'type', 'page');
      pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger)[_logger]));

      _classPrivateFieldLooseBase(this, _request)[_request].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);

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

      _classPrivateFieldLooseBase(this, _updateUnviewedBadgePosition)[_updateUnviewedBadgePosition]();

      this._handleVisualEditorPreview();
    }

    _handleVisualEditorPreview() {
      if ($ct.intervalArray.length) {
        $ct.intervalArray.forEach(interval => {
          clearInterval(interval);
        });
      }

      const storedData = sessionStorage.getItem('visualEditorData');
      const targetJson = storedData ? JSON.parse(storedData) : null;

      if (targetJson) {
        renderVisualBuilder(targetJson, true, _classPrivateFieldLooseBase(this, _logger)[_logger]);
      }
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
      } // Check if the offline state is changing from true to false
      // If offline is being disabled (arg is false), process any cached events


      if ($ct.offline !== arg && !arg) {
        _classPrivateFieldLooseBase(this, _request)[_request].processBackupEvents();
      }

      $ct.offline = arg;
    }

    delayEvents(arg) {
      if (typeof arg !== 'boolean') {
        console.error('delayEvents should be called with a value of type boolean');
        return;
      }

      $ct.delayEvents = arg;
    }

    getSDKVersion() {
      return 'web-sdk-v2.3.0';
    }

    defineVariable(name, defaultValue) {
      return Variable.define(name, defaultValue, _classPrivateFieldLooseBase(this, _variableStore)[_variableStore], _classPrivateFieldLooseBase(this, _logger)[_logger]);
    }

    defineFileVariable(name) {
      return Variable.defineFileVar(name, _classPrivateFieldLooseBase(this, _variableStore)[_variableStore], _classPrivateFieldLooseBase(this, _logger)[_logger]);
    }

    syncVariables(onSyncSuccess, onSyncFailure) {
      if (_classPrivateFieldLooseBase(this, _logger)[_logger].logLevel === 4) {
        return _classPrivateFieldLooseBase(this, _variableStore)[_variableStore].syncVariables(onSyncSuccess, onSyncFailure);
      } else {
        const m = 'App log level is not set to 4';

        _classPrivateFieldLooseBase(this, _logger)[_logger].error(m);

        return Promise.reject(new Error(m));
      }
    }

    fetchVariables(onFetchCallback) {
      _classPrivateFieldLooseBase(this, _variableStore)[_variableStore].fetchVariables(onFetchCallback);
    }

    getVariables() {
      return reconstructNestedObject(StorageManager.readFromLSorCookie(VARIABLES));
    }

    getVariableValue(variableName) {
      const variables = StorageManager.readFromLSorCookie(VARIABLES);
      const reconstructedVariables = reconstructNestedObject(variables);

      if (variables.hasOwnProperty(variableName)) {
        return variables[variableName];
      } else if (reconstructedVariables.hasOwnProperty(variableName)) {
        return reconstructedVariables[variableName];
      }
    }

    addVariablesChangedCallback(callback) {
      _classPrivateFieldLooseBase(this, _variableStore)[_variableStore].addVariablesChangedCallback(callback);
    }

    addOneTimeVariablesChangedCallback(callback) {
      _classPrivateFieldLooseBase(this, _variableStore)[_variableStore].addOneTimeVariablesChangedCallback(callback);
    }
    /*
       This function is used for debugging and getting the details of all the campaigns
       that were qualified and rendered for the current user
    */


    getAllQualifiedCampaignDetails() {
      const existingCampaign = StorageManager.readFromLSorCookie(QUALIFIED_CAMPAIGNS) && JSON.parse(decodeURIComponent(StorageManager.readFromLSorCookie(QUALIFIED_CAMPAIGNS)));
      return existingCampaign;
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
    let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
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

  var _updateUnviewedBadgePosition2 = function _updateUnviewedBadgePosition2() {
    try {
      if (_classPrivateFieldLooseBase(this, _pageChangeTimeoutId)[_pageChangeTimeoutId]) {
        clearTimeout(_classPrivateFieldLooseBase(this, _pageChangeTimeoutId)[_pageChangeTimeoutId]);
      }

      const unViewedBadge = document.getElementById('unviewedBadge');

      if (!unViewedBadge) {
        _classPrivateFieldLooseBase(this, _logger)[_logger].debug('unViewedBadge not found');

        return;
      }
      /* Reset to None */


      unViewedBadge.style.display = 'none';
      /* Set Timeout to let the page load and then update the position and display the badge */

      _classPrivateFieldLooseBase(this, _pageChangeTimeoutId)[_pageChangeTimeoutId] = setTimeout(() => {
        const config = StorageManager.readFromLSorCookie(WEBINBOX_CONFIG) || {};
        const inboxNode = document.getElementById(config === null || config === void 0 ? void 0 : config.inboxSelector);
        /* Creating a Local Variable to avoid reference to stale DOM Node */

        const unViewedBadge = document.getElementById('unviewedBadge');

        if (!unViewedBadge) {
          _classPrivateFieldLooseBase(this, _logger)[_logger].debug('unViewedBadge not found');

          return;
        }

        if (inboxNode) {
          const {
            top,
            right
          } = inboxNode.getBoundingClientRect();

          if (Number(unViewedBadge.innerText) > 0 || unViewedBadge.innerText === '9+') {
            unViewedBadge.style.display = 'flex';
          }

          unViewedBadge.style.top = "".concat(top - 8, "px");
          unViewedBadge.style.left = "".concat(right - 8, "px");
        }
      }, TIMER_FOR_NOTIF_BADGE_UPDATE);
    } catch (error) {
      _classPrivateFieldLooseBase(this, _logger)[_logger].debug('Error updating unviewed badge position:', error);
    }
  };

  var _pingRequest2 = function _pingRequest2() {
    let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

    let data = {};
    data = _classPrivateFieldLooseBase(this, _request)[_request].addSystemDataToObject(data, undefined);
    pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PING);
    pageLoadUrl = addToURL(pageLoadUrl, 'd', compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger)[_logger]));

    _classPrivateFieldLooseBase(this, _request)[_request].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
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

    data = _classPrivateFieldLooseBase(this, _request)[_request].addSystemDataToObject(data, true);

    _classPrivateFieldLooseBase(this, _request)[_request].addFlags(data);

    const compressedData = compressData(JSON.stringify(data), _classPrivateFieldLooseBase(this, _logger)[_logger]);

    let pageLoadUrl = _classPrivateFieldLooseBase(this, _account)[_account].dataPostURL;

    pageLoadUrl = addToURL(pageLoadUrl, 'type', EVT_PUSH);
    pageLoadUrl = addToURL(pageLoadUrl, 'd', compressedData);

    _classPrivateFieldLooseBase(this, _request)[_request].saveAndFireRequest(pageLoadUrl, $ct.blockRequest);
  };

  const clevertap = new CleverTap(window.clevertap);
  window.clevertap = window.wizrocket = clevertap;

  return clevertap;

}));
//# sourceMappingURL=clevertap.js.map

// Support functions
const variables = {};

clevertap.defineVariables = (vars) => {
  for (var v in vars) {
    variables[v] = clevertap.defineVariable(v, vars[v]);
  }
}

clevertap.defineFileVariable_ = (vars) => {
  variables[vars] = clevertap.defineFileVariable(vars);
  return;
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
