import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Verifies the Dart -> native contract: for each public method, the exact
/// native method name and argument map that is sent over the channel.
/// Native code is not exercised; the channel is mocked.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const channel = MethodChannel('clevertap_plugin/dart_to_native');

  final List<MethodCall> calls = [];
  dynamic Function(MethodCall call)? responder;

  setUp(() {
    calls.clear();
    responder = null;
    channel.setMockMethodCallHandler((MethodCall call) async {
      calls.add(call);
      return responder?.call(call);
    });
  });

  tearDown(() => channel.setMockMethodCallHandler(null));

  /// Asserts exactly one call was made with the given method and arguments.
  void expectCall(String method, dynamic arguments) {
    expect(calls, hasLength(1), reason: 'expected exactly one native call');
    expect(calls.single.method, method);
    expect(calls.single.arguments, arguments);
  }

  group('events', () {
    test('recordEvent sends eventName and eventData', () async {
      await CleverTapPlugin.recordEvent('Product Viewed', {'id': 7, 'x': 'y'});
      expectCall('recordEvent', {
        'eventName': 'Product Viewed',
        'eventData': {'id': 7, 'x': 'y'},
      });
    });

    test('recordEvent with empty properties still sends an empty map',
        () async {
      await CleverTapPlugin.recordEvent('Ping', {});
      expectCall('recordEvent', {'eventName': 'Ping', 'eventData': {}});
    });

    test('recordChargedEvent sends chargeDetails and items', () async {
      final details = {'Amount': 300, 'Payment Mode': 'Credit card'};
      final items = [
        {'Category': 'books', 'Quantity': 1},
        {'Category': 'toys', 'Quantity': 2},
      ];
      await CleverTapPlugin.recordChargedEvent(details, items);
      expectCall('recordChargedEvent',
          {'chargeDetails': details, 'items': items});
    });

    test('recordScreenView sends screenName', () async {
      await CleverTapPlugin.recordScreenView('Home');
      expectCall('recordScreenView', {'screenName': 'Home'});
    });
  });

  group('user profile', () {
    test('onUserLogin wraps the map under "profile"', () async {
      await CleverTapPlugin.onUserLogin({'Identity': '42', 'Email': 'a@b.c'});
      expectCall('onUserLogin', {
        'profile': {'Identity': '42', 'Email': 'a@b.c'},
      });
    });

    test('profileSet wraps the map under "profile"', () async {
      await CleverTapPlugin.profileSet({'Name': 'Jack'});
      expectCall('profileSet', {
        'profile': {'Name': 'Jack'},
      });
    });

    test('profileRemoveValueForKey sends key', () async {
      await CleverTapPlugin.profileRemoveValueForKey('Name');
      expectCall('profileRemoveValueForKey', {'key': 'Name'});
    });

    test('profileSetMultiValues sends key and values', () async {
      await CleverTapPlugin.profileSetMultiValues('Tags', ['a', 'b']);
      expectCall('profileSetMultiValues', {
        'key': 'Tags',
        'values': ['a', 'b'],
      });
    });

    test('profileAddMultiValue sends key and single value', () async {
      await CleverTapPlugin.profileAddMultiValue('Tags', 'a');
      expectCall('profileAddMultiValue', {'key': 'Tags', 'value': 'a'});
    });

    test('profileAddMultiValues sends key and list', () async {
      await CleverTapPlugin.profileAddMultiValues('Tags', ['a', 'b']);
      expectCall('profileAddMultiValues', {
        'key': 'Tags',
        'values': ['a', 'b'],
      });
    });

    test('profileRemoveMultiValue sends key and single value', () async {
      await CleverTapPlugin.profileRemoveMultiValue('Tags', 'a');
      expectCall('profileRemoveMultiValue', {'key': 'Tags', 'value': 'a'});
    });

    test('profileRemoveMultiValues sends key and list', () async {
      await CleverTapPlugin.profileRemoveMultiValues('Tags', ['a']);
      expectCall('profileRemoveMultiValues', {
        'key': 'Tags',
        'values': ['a'],
      });
    });

    test('profileIncrementValue keeps int and double types', () async {
      await CleverTapPlugin.profileIncrementValue('Score', 5);
      expectCall('profileIncrementValue', {'key': 'Score', 'value': 5});
      calls.clear();
      await CleverTapPlugin.profileIncrementValue('Score', 1.5);
      expectCall('profileIncrementValue', {'key': 'Score', 'value': 1.5});
    });

    test('profileDecrementValue sends key and value', () async {
      await CleverTapPlugin.profileDecrementValue('Score', 3);
      expectCall('profileDecrementValue', {'key': 'Score', 'value': 3});
    });
  });

  group('privacy / config flags', () {
    test('setOptOut omits allowSystemEvents when not provided', () async {
      await CleverTapPlugin.setOptOut(true);
      expectCall('setOptOut', {'value': true});
    });

    test('setOptOut includes allowSystemEvents when provided', () async {
      await CleverTapPlugin.setOptOut(true, false);
      expectCall('setOptOut', {'value': true, 'allowSystemEvents': false});
    });

    test('setOffline sends value', () async {
      await CleverTapPlugin.setOffline(true);
      expectCall('setOffline', {'value': true});
    });

    test('enableDeviceNetworkInfoReporting sends value', () async {
      await CleverTapPlugin.enableDeviceNetworkInfoReporting(false);
      expectCall('enableDeviceNetworkInfoReporting', {'value': false});
    });

    test('enable/disablePersonalization send empty args', () async {
      await CleverTapPlugin.enablePersonalization();
      expectCall('enablePersonalization', {});
      calls.clear();
      await CleverTapPlugin.disablePersonalization();
      expectCall('disablePersonalization', {});
    });
  });

  group('in-app', () {
    test('discardInAppNotifications omits flag by default', () async {
      await CleverTapPlugin.discardInAppNotifications();
      expectCall('discardInAppNotifications', {});
    });

    test('discardInAppNotifications sends dismissInAppIfVisible', () async {
      await CleverTapPlugin.discardInAppNotifications(
          dismissInAppIfVisible: true);
      expectCall(
          'discardInAppNotifications', {'dismissInAppIfVisible': true});
    });
  });

  group('push', () {
    test('pushNotificationClickedEvent wraps extras', () async {
      await CleverTapPlugin.pushNotificationClickedEvent({'wzrk_id': '1'});
      expectCall('pushNotificationClickedEvent', {
        'notificationData': {'wzrk_id': '1'},
      });
    });

    test('pushNotificationViewedEvent wraps extras', () async {
      await CleverTapPlugin.pushNotificationViewedEvent({'wzrk_id': '1'});
      expectCall('pushNotificationViewedEvent', {
        'notificationData': {'wzrk_id': '1'},
      });
    });
  });

  group('app inbox', () {
    test('deleteInboxMessageForId sends messageId', () async {
      await CleverTapPlugin.deleteInboxMessageForId('m1');
      expectCall('deleteInboxMessageForId', {'messageId': 'm1'});
    });

    test('deleteInboxMessagesForIds sends messageIds', () async {
      await CleverTapPlugin.deleteInboxMessagesForIds(['m1', 'm2']);
      expectCall('deleteInboxMessagesForIds', {
        'messageIds': ['m1', 'm2'],
      });
    });

    test('markReadInboxMessageForId sends messageId', () async {
      await CleverTapPlugin.markReadInboxMessageForId('m1');
      expectCall('markReadInboxMessageForId', {'messageId': 'm1'});
    });

    test('markReadInboxMessagesForIds sends messageIds', () async {
      await CleverTapPlugin.markReadInboxMessagesForIds(['m1', 'm2']);
      expectCall('markReadInboxMessagesForIds', {
        'messageIds': ['m1', 'm2'],
      });
    });

    test('inbox clicked / viewed events send messageId', () async {
      await CleverTapPlugin.pushInboxNotificationClickedEventForId('m1');
      expectCall(
          'pushInboxNotificationClickedEventForId', {'messageId': 'm1'});
      calls.clear();
      await CleverTapPlugin.pushInboxNotificationViewedEventForId('m1');
      expectCall(
          'pushInboxNotificationViewedEventForId', {'messageId': 'm1'});
    });
  });

  group('return value handling', () {
    test('getInboxMessageForId casts native map to Map<String, dynamic>',
        () async {
      // Native channels return Map<Object?, Object?>.
      responder = (_) => <Object?, Object?>{'id': 'm1', 'isRead': false};
      final result = await CleverTapPlugin.getInboxMessageForId('m1');
      expect(result, isA<Map<String, dynamic>>());
      expect(result['id'], 'm1');
      expect(calls.single.arguments, {'messageId': 'm1'});
    });

    test('getDisplayUnitForId casts native map to Map<String, dynamic>',
        () async {
      responder = (_) => <Object?, Object?>{'unitId': 'u1'};
      final result = await CleverTapPlugin.getDisplayUnitForId('u1');
      expect(result, isA<Map<String, dynamic>>());
      expect(result['unitId'], 'u1');
      expect(calls.single.arguments, {'unitId': 'u1'});
    });

    test('eventGetOccurrences returns the int from native', () async {
      responder = (_) => 3;
      expect(await CleverTapPlugin.eventGetOccurrences('E'), 3);
      expect(calls.single.arguments, {'eventName': 'E'});
    });
  });

  group('errors', () {
    test('PlatformException from native propagates to the caller', () async {
      responder = (_) => throw PlatformException(code: 'ERR', message: 'boom');
      expect(
        () => CleverTapPlugin.recordEvent('E', {}),
        throwsA(isA<PlatformException>()
            .having((e) => e.code, 'code', 'ERR')
            .having((e) => e.message, 'message', 'boom')),
      );
    });
  });

  group('helpers', () {
    test('getCleverTapDate formats epoch seconds with \$D_ prefix', () {
      final date = DateTime.fromMillisecondsSinceEpoch(1700000000123);
      expect(CleverTapPlugin.getCleverTapDate(date), r'$D_1700000000');
    });
  });
}
