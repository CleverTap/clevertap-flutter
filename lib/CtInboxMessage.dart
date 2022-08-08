// To parse this JSON data, do
//
//     final ctInboxMessage = ctInboxMessageFromJson(jsonString);

import 'dart:convert';

CtInboxMessage ctInboxMessageFromJson(String str) => CtInboxMessage.fromJson(json.decode(str));

String ctInboxMessageToJson(CtInboxMessage data) => json.encode(data.toJson());

class CtInboxMessage {
  CtInboxMessage({
    required this.id,
    required this.isRead,
    required this.date,
    required this.wzrkTtl,
    required this.tags,
    required this.wzrkId,
    required this.wzrkParams,
  });

  String id;
  bool isRead;
  int date;
  int wzrkTtl;
  List<String> tags;
  String wzrkId;
  WzrkParams wzrkParams;

  factory CtInboxMessage.fromJson(Map<String, dynamic> json) => CtInboxMessage(
    id: json["id"],
    isRead: json["isRead"],
    date: json["date"],
    wzrkTtl: json["wzrk_ttl"],
    tags: List<String>.from(json["tags"].map((x) => x)),
    wzrkId: json["wzrk_id"],
    wzrkParams: WzrkParams.fromJson(json["wzrkParams"]),
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "isRead": isRead,
    "date": date,
    "wzrk_ttl": wzrkTtl,
    "tags": List<dynamic>.from(tags.map((x) => x)),
    "wzrk_id": wzrkId,
    "wzrkParams": wzrkParams.toJson(),
  };
}

class WzrkParams {
  WzrkParams({
    required this.wzrkTtl,
    required this.wzrkId,
    required this.wzrkPivot,
  });

  int wzrkTtl;
  String wzrkId;
  String wzrkPivot;

  factory WzrkParams.fromJson(Map<String, dynamic> json) => WzrkParams(
    wzrkTtl: json["wzrk_ttl"],
    wzrkId: json["wzrk_id"],
    wzrkPivot: json["wzrk_pivot"],
  );

  Map<String, dynamic> toJson() => {
    "wzrk_ttl": wzrkTtl,
    "wzrk_id": wzrkId,
    "wzrk_pivot": wzrkPivot,
  };
}
