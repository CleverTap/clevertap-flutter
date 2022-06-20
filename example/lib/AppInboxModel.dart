
class AppInboxModel {
  AppInboxModel({
    required this.type,
    required this.bg,
    required this.orientation,
    required this.content,
    required this.enableTags,
    this.isExpanded = false,
//    required this.tags,
  });

  String type;
  String bg;
  String orientation;
  List<Content> content;
  bool enableTags;
  bool isExpanded;
//  List<dynamic> tags;

  factory AppInboxModel.fromJson(Map<String,dynamic> json) {

    return AppInboxModel(
      type: json["type"],
      bg: json["bg"],
      orientation: json["orientation"],
      content: json["content"] != null  ?
      List<Content>.from(json["content"].map((x) => Content.fromJson(x))) :
      List<Content>.from(json["content"].map((x) => Content.fromJson(x))),
      enableTags: json["enableTags"],
    );
  }

  Map<String, dynamic> toJson() => {
    "type": type,
    "bg": bg,
    "orientation": orientation,
    "content": content,
    "enableTags": enableTags,
//        "tags": List<dynamic>.from(tags.map((x) => x)),
  };
}

class Content {
  Content({
    // required this.key,
    required this.message,
    required this.title,
    required this.action,
    required this.media,
    required this.icon,
  });

  // int key;
  Message? message;
  Title? title;
  Action? action;
  Media? media;
  AppInboxIcon? icon;

  factory Content.fromJson(Map<String, dynamic> json) => Content(
    // key: json["key"],
    message: json["message"] == null ?  null : Message.fromJson(json["message"]),
    title: json["title"] == null ? null : Title.fromJson(json["title"]),
    action: json["action"] == null ? null : Action.fromJson(json["action"]),
    media: json["media"] == null ? null : Media.fromJson(json["media"]),
    icon: json["icon"] == null ? null : AppInboxIcon.fromJson(json["icon"]),
  );

  Map<String, dynamic> toJson() => {
    // "key": key,
    "message": message?.toJson(),
    "title": title?.toJson(),
    "action": action?.toJson(),
    "media": media?.toJson(),
    "icon": icon?.toJson(),
  };
}

class Action {
  Action({
    required this.hasUrl,
    required this.hasLinks,
    required this.url,
    required this.links,
  });

  bool hasUrl;
  bool hasLinks;
  Url? url;
  List<Link> links;

  factory Action.fromJson(Map<String, dynamic> json) => Action(
    hasUrl: json["hasUrl"],
    hasLinks: json["hasLinks"],
    url: json["url"] == null ? null : Url.fromJson(json["url"]),
    links: json["links"] == null ? [] : List<Link>.from(json["links"].map((x) => Link.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "hasUrl": hasUrl,
    "hasLinks": hasLinks,
    "url": url?.toJson(),
    "links": List<dynamic>.from(links.map((x) => x.toJson())),
  };
}

class Link {
  Link({
    required this.type,
    required this.text,
    required this.color,
    required this.bg,
    required this.copyText,
    required this.url,
    required this.kv,
  });

  String type;
  String text;
  String color;
  String bg;
  CopyText copyText;
  Url url;
  AppInboxIcon kv;

  factory Link.fromJson(Map<String, dynamic> json) => Link(
    type: json["type"],
    text: json["text"],
    color: json["color"],
    bg: json["bg"],
    copyText: CopyText.fromJson(json["copyText"]),
    url: Url.fromJson(json["url"]),
    kv: AppInboxIcon.fromJson(json["kv"]),
  );

  Map<String, dynamic> toJson() => {
    "type": type,
    "text": text,
    "color": color,
    "bg": bg,
    "copyText": copyText.toJson(),
    "url": url.toJson(),
    "kv": kv.toJson(),
  };
}

class Android {
  Android({
    required this.og,
    required this.text,
    required this.replacements,
  });

  String og;
  String text;
  String replacements;

  factory Android.fromJson(Map<String, dynamic> json) => Android(
    og: json["og"] == null ? '' : json["og"],
    text: json["text"] == null ? '' : json["text"],
    replacements: json["replacements"] == null ? '' : json["replacements"],
  );

  Map<String, dynamic> toJson() => {
    "og": og,
    "text": text,
    "replacements": replacements,
  };
}

class IOS {
  IOS({
    required this.og,
    required this.text,
    required this.replacements,
  });

  String og;
  String text;
  String replacements;

  factory IOS.fromJson(Map<String, dynamic> json) => IOS(
    og: json["og"] == null ? '' : json["og"],
    text: json["text"] == null ? '' : json["text"],
    replacements: json["replacements"] == null ? '' : json["replacements"],
  );

  Map<String, dynamic> toJson() => {
    "og": og,
    "text": text,
    "replacements": replacements,
  };
}

class CopyText {
  CopyText({
    required this.og,
    required this.text,
    required this.replacements,
  });

  String og;
  String text;
  String replacements;

  factory CopyText.fromJson(Map<String, dynamic> json) => CopyText(
    og: json["og"] == null ? '' : json["og"],
    text: json["text"] == null ? '' : json["text"],
    replacements: json["replacements"] == null ? '' : json["replacements"],
  );

  Map<String, dynamic> toJson() => {
    "og": og,
    "text": text,
    "replacements": replacements,
  };
}

class AppInboxIcon {
  AppInboxIcon();

  factory AppInboxIcon.fromJson(Map<String, dynamic> json) => AppInboxIcon();

  Map<String, dynamic> toJson() => {};
}

class Url {
  Url({
    required this.android,
    required this.ios,
  });

  Android android;
  IOS ios;

  factory Url.fromJson(Map<String, dynamic> json) => Url(
    android: Android.fromJson(json["android"]),
    ios: IOS.fromJson(json["ios"]),
  );

  Map<String, dynamic> toJson() => {
    "android": android.toJson(),
    "ios": ios.toJson(),
  };
}

class Media {
  Media({
    required this.url,
    required this.poster,
    required this.key,
    required this.contentType,
    required this.processing,
  });

  String url;
  String poster;
  String key;
  String contentType;
  bool processing;

  factory Media.fromJson(Map<String, dynamic> json) => Media(
    url: json["url"] == null ? '' : json["url"],
    poster: json["poster"] == null ? '' : json["poster"],
    key: json["key"] == null ? '' : json["key"],
    contentType: json["contentType"] == null ? '' : json["contentType"],
    processing: json["processing"] == null ? false : json["processing"],
  );

  Map<String, dynamic> toJson() => {
    "url": url,
    "poster": poster,
    "key": key,
    "content_type": contentType,
    "processing": processing,
  };
}

class Message {
  Message({
    required this.text,
    required this.color,
    required this.replacements,
    required this.og,
    required this.df,
    required this.defaultValuesSet,
  });

  String text;
  String color;
  String replacements;
  String og;
  AppInboxIcon? df;
  DefaultValuesSet? defaultValuesSet;

  factory Message.fromJson(Map<String, dynamic> json) => Message(
    text: json["text"],
    color: json["color"],
    replacements: json["replacements"],
    og: json["og"] == null ? '' : json["og"],
    df: json["df"] == null ? null : AppInboxIcon.fromJson(json["df"]),
    defaultValuesSet: json["defaultValuesSet"] == null ? null :  DefaultValuesSet.fromJson(json["defaultValuesSet"]),
  );

  Map<String, dynamic> toJson() => {
    "text": text,
    "color": color,
    "replacements": replacements,
    "df": df?.toJson(),
    "defaultValuesSet": defaultValuesSet?.toJson(),
  };
}

class Title {
  Title({
    required this.text,
    required this.color,
    required this.replacements,
    required this.og,
    required this.df,
    required this.defaultValuesSet,
  });

  String text;
  String color;
  String replacements;
  String og;
  AppInboxIcon? df;
  DefaultValuesSet? defaultValuesSet;

  factory Title.fromJson(Map<String, dynamic> json) => Title(
    text: json["text"],
    color: json["color"],
    replacements: json["replacements"],
    og: json["og"] == null ? '' : json["og"],
    df: json["df"] == null ? null : AppInboxIcon.fromJson(json["df"]),
    defaultValuesSet: json["defaultValuesSet"] == null ? null :  DefaultValuesSet.fromJson(json["defaultValuesSet"]),
  );

  Map<String, dynamic> toJson() => {
    "text": text,
    "color": color,
    "replacements": replacements,
    "df": df?.toJson(),
    "defaultValuesSet": defaultValuesSet?.toJson(),
  };
}

class DefaultValuesSet {
  DefaultValuesSet({
    required this.value,
    required this.strict,
    required this.errorMessage,
  });

  bool value;
  bool strict;
  String errorMessage;

  factory DefaultValuesSet.fromJson(Map<String, dynamic> json) =>
      DefaultValuesSet(
          value: json["value"],
          strict: json["strict"],
          errorMessage: json["errorMessage"] == null ? '' : json["errorMessage"]
      );

  Map<String, dynamic> toJson() => {
    "value": value,
    "strict": strict,
    "errorMessage": errorMessage
  };
}