@JS("clevertap")
library clevertap;

import 'package:js/js.dart';

@JS('init')
external void init(String accountId, String? region, String? targetDomain);

@JS('event.push')
external void event_push(String event, Object? object);
