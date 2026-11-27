/// Log level for an account created with [CleverTapInstanceConfig].
///
/// iOS has no verbose level and uses its debug level for [verbose].
enum CleverTapLogLevel { off, info, debug, verbose }

/// How much of an account's stored data is encrypted on the device.
enum CleverTapEncryptionLevel {
  /// No encryption.
  none,

  /// Personally identifiable information only (for example Email, Name, Identity).
  medium,

  /// All data.
  high,
}

/// An extra Android push provider, beyond Firebase Cloud Messaging.
///
/// The four parts are the same as the `CLEVERTAP_PROVIDER_1` manifest entry. All are required.
class CleverTapPushProvider {
  final String type;
  final String prefKey;
  final String className;
  final String messagingSDKClassName;

  const CleverTapPushProvider({
    required this.type,
    required this.prefKey,
    required this.className,
    required this.messagingSDKClassName,
  });

  Map<String, dynamic> toMap() => {
        'type': type,
        'prefKey': prefKey,
        'className': className,
        'messagingSDKClassName': messagingSDKClassName,
      };
}

/// Android-only settings for [CleverTapInstanceConfig]. Ignored on iOS.
class CleverTapAndroidConfig {
  /// Allow this account to collect the Google Advertising ID.
  final bool? useGoogleAdId;

  /// Enable background (pull) notification sync for this account.
  final bool? backgroundSync;

  /// Extra push providers beyond Firebase Cloud Messaging.
  final List<CleverTapPushProvider>? pushProviders;

  const CleverTapAndroidConfig(
      {this.useGoogleAdId, this.backgroundSync, this.pushProviders});

  Map<String, dynamic> toMap() => _withoutNulls({
        'useGoogleAdId': useGoogleAdId,
        'backgroundSync': backgroundSync,
        'pushProviders': pushProviders?.map((p) => p.toMap()).toList(),
      });
}

/// iOS-only settings for [CleverTapInstanceConfig]. Ignored on Android.
class CleverTapIosConfig {
  /// Do not derive the device ID from identifierForVendor (IDFV).
  final bool? disableIDFV;

  /// Apply iOS complete file protection to the files the SDK stores.
  final bool? enableFileProtection;

  const CleverTapIosConfig({this.disableIDFV, this.enableFileProtection});

  Map<String, dynamic> toMap() => _withoutNulls({
        'disableIDFV': disableIDFV,
        'enableFileProtection': enableFileProtection,
      });
}

/// The settings for an additional CleverTap account, passed to `CleverTapPlugin.createInstance`.
///
/// Only [accountId] and [accountToken] are required. Any setting left `null` keeps the SDK's
/// default. On Android that default comes from `AndroidManifest.xml`; on iOS it is the SDK's
/// built-in default.
///
/// ```dart
/// final insurance = await CleverTapPlugin.createInstance(
///   CleverTapInstanceConfig(accountId: 'INS-ID', accountToken: 'INS-TOKEN', region: 'eu1'),
/// );
/// ```
///
/// The config is used once per account per app run. Calling `createInstance` again for the same
/// [accountId] returns the same account and ignores the new config.
class CleverTapInstanceConfig {
  final String accountId;
  final String accountToken;

  /// The account's region, for example `'eu1'`, `'in1'` or `'us1'`.
  ///
  /// On iOS a region cannot be combined with [proxyDomain] or [spikyProxyDomain]: the region is
  /// used and the proxy settings are ignored with a warning. Android applies both.
  final String? region;
  final String? proxyDomain;
  final String? spikyProxyDomain;

  /// Custom domain for the SDK's first (handshake) request.
  final String? handshakeDomain;

  /// Which profile keys identify a user, for example `['Email', 'Phone']`.
  final List<String>? identityKeys;
  final CleverTapLogLevel? logLevel;

  /// Use this account for analytics only (no in-app messages or other engagement).
  final bool? analyticsOnly;

  /// Enable reading profile and event properties back on the device.
  final bool? enablePersonalization;

  /// Do not record the automatic "App Launched" event for this account.
  final bool? disableAppLaunchedEvent;
  final CleverTapEncryptionLevel? encryptionLevel;
  final bool? encryptionInTransit;

  /// Set to `true` when you supply [cleverTapId]. The two must be given together, or both left
  /// out; otherwise `createInstance` fails with `EINVALID`. The native SDKs would otherwise
  /// ignore the ID (flag missing) or give the account an error device ID (ID missing).
  final bool? useCustomCleverTapId;

  /// Your own CleverTap ID for this account's user. Only used at creation.
  final String? cleverTapId;
  final CleverTapAndroidConfig? android;
  final CleverTapIosConfig? ios;

  const CleverTapInstanceConfig({
    required this.accountId,
    required this.accountToken,
    this.region,
    this.proxyDomain,
    this.spikyProxyDomain,
    this.handshakeDomain,
    this.identityKeys,
    this.logLevel,
    this.analyticsOnly,
    this.enablePersonalization,
    this.disableAppLaunchedEvent,
    this.encryptionLevel,
    this.encryptionInTransit,
    this.useCustomCleverTapId,
    this.cleverTapId,
    this.android,
    this.ios,
  });

  /// The map sent to native. `null` settings are left out, which native reads as "not given".
  Map<String, dynamic> toMap() => _withoutNulls({
        'accountId': accountId,
        'accountToken': accountToken,
        'region': region,
        'proxyDomain': proxyDomain,
        'spikyProxyDomain': spikyProxyDomain,
        'handshakeDomain': handshakeDomain,
        'identityKeys': identityKeys,
        'logLevel': logLevel == null ? null : _logLevelWord(logLevel!),
        'analyticsOnly': analyticsOnly,
        'enablePersonalization': enablePersonalization,
        'disableAppLaunchedEvent': disableAppLaunchedEvent,
        'encryptionLevel':
            encryptionLevel == null ? null : _encryptionWord(encryptionLevel!),
        'encryptionInTransit': encryptionInTransit,
        'useCustomCleverTapId': useCustomCleverTapId,
        'cleverTapId': cleverTapId,
        'android': android?.toMap(),
        'ios': ios?.toMap(),
      });

  // The exact words native accepts. Written out (not enum.name, which needs Dart 2.15) so that
  // renaming an enum value can never change what is sent.
  static String _logLevelWord(CleverTapLogLevel level) {
    switch (level) {
      case CleverTapLogLevel.off:
        return 'off';
      case CleverTapLogLevel.info:
        return 'info';
      case CleverTapLogLevel.debug:
        return 'debug';
      case CleverTapLogLevel.verbose:
        return 'verbose';
    }
  }

  static String _encryptionWord(CleverTapEncryptionLevel level) {
    switch (level) {
      case CleverTapEncryptionLevel.none:
        return 'none';
      case CleverTapEncryptionLevel.medium:
        return 'medium';
      case CleverTapEncryptionLevel.high:
        return 'high';
    }
  }
}

Map<String, dynamic> _withoutNulls(Map<String, dynamic> map) =>
    map..removeWhere((key, value) => value == null);
