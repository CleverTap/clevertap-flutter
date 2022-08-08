class CtInboxMessageNew {
  String? id;
  Msg? msg;
  bool? isRead;
  int? date;
  int? wzrkTtl;
  List<String>? tags;
  String? wzrkId;
  WzrkParams? wzrkParams;

  CtInboxMessageNew({this.id, this.msg, this.isRead, this.date, this.wzrkTtl, this.tags, this.wzrkId, this.wzrkParams});

  CtInboxMessageNew.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    msg = json['msg'] != null ? new Msg.fromJson(json['msg']) : null;
    isRead = json['isRead'];
    date = json['date'];
    wzrkTtl = json['wzrk_ttl'];
    tags = json['tags'].cast<String>();
    wzrkId = json['wzrk_id'];
    wzrkParams = json['wzrkParams'] != null ? new WzrkParams.fromJson(json['wzrkParams']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    if (this.msg != null) {
      data['msg'] = this.msg!.toJson();
    }
    data['isRead'] = this.isRead;
    data['date'] = this.date;
    data['wzrk_ttl'] = this.wzrkTtl;
    data['tags'] = this.tags;
    data['wzrk_id'] = this.wzrkId;
    if (this.wzrkParams != null) {
      data['wzrkParams'] = this.wzrkParams!.toJson();
    }
    return data;
  }
}

class Msg {
  String? type;
  String? bg;
  String? orientation;
  List<Content>? content;
  List<Null>? tags;
  bool? enableTags;

  Msg({this.type, this.bg, this.orientation, this.content, this.tags, this.enableTags});

  Msg.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    bg = json['bg'];
    orientation = json['orientation'];
    if (json['content'] != null) {
      content = <Content>[];
      json['content'].forEach((v) { content!.add(new Content.fromJson(v)); });
    }
    if (json['tags'] != null) {
      tags = <Null>[];
      // json['tags'].forEach((v) { tags!.add(new Null.fromJson(v)); });
    }
    enableTags = json['enableTags'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['bg'] = this.bg;
    data['orientation'] = this.orientation;
    if (this.content != null) {
      data['content'] = this.content!.map((v) => v.toJson()).toList();
    }
    if (this.tags != null) {
      // data['tags'] = this.tags!.map((v) => v.toJson()).toList();
    }
    data['enableTags'] = this.enableTags;
    return data;
  }
}

class Content {
  Message? message;
  Title? title;
  Action? action;
  // Df? media;
  // Df? icon;

  Content({this.message, this.title, this.action/*, this.media, this.icon*/});

  Content.fromJson(Map<String, dynamic> json) {
    message = json['message'] != null ? new Message.fromJson(json['message']) : null;
    title = json['title'] != null ? new Title.fromJson(json['title']) : null;
    action = json['action'] != null ? new Action.fromJson(json['action']) : null;
    // media = json['media'] != null ? new Df.fromJson(json['media']) : null;
    // icon = json['icon'] != null ? new Df.fromJson(json['icon']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.message != null) {
      data['message'] = this.message!.toJson();
    }
    if (this.title != null) {
      data['title'] = this.title!.toJson();
    }
    if (this.action != null) {
      data['action'] = this.action!.toJson();
    }
    // if (this.media != null) {
    //   data['media'] = this.media!.toJson();
    // }
    // if (this.icon != null) {
    //   data['icon'] = this.icon!.toJson();
    // }
    return data;
  }
}

class Message {
  String? text;
  String? color;
  String? replacements;
  String? og;

  Message({this.text, this.color, this.replacements, this.og});

  Message.fromJson(Map<String, dynamic> json) {
    text = json['text'];
    color = json['color'];
    replacements = json['replacements'];
    og = json['og'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['text'] = this.text;
    data['color'] = this.color;
    data['replacements'] = this.replacements;
    data['og'] = this.og;
    return data;
  }
}

class Title {
  String? text;
  String? color;
  String? og;
  String? replacements;
  // Df? df;
  DefaultValuesSet? defaultValuesSet;

  Title({this.text, this.color, this.og, this.replacements/*, this.df*/, this.defaultValuesSet});

  Title.fromJson(Map<String, dynamic> json) {
    text = json['text'];
    color = json['color'];
    og = json['og'];
    replacements = json['replacements'];
    // df = json['df'] != null ? new Df.fromJson(json['df']) : null;
    defaultValuesSet = json['defaultValuesSet'] != null ? new DefaultValuesSet.fromJson(json['defaultValuesSet']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['text'] = this.text;
    data['color'] = this.color;
    data['og'] = this.og;
    data['replacements'] = this.replacements;
    // if (this.df != null) {
    //   data['df'] = this.df!.toJson();
    // }
    if (this.defaultValuesSet != null) {
      data['defaultValuesSet'] = this.defaultValuesSet!.toJson();
    }
    return data;
  }
}

// class Df {
//
//
//   Df({});
//
// Df.fromJson(Map<String, dynamic> json) {
// }

Map<String, dynamic> toJson() {
  final Map<String, dynamic> data = new Map<String, dynamic>();
  return data;

}

class DefaultValuesSet {
  bool? value;
  bool? strict;
  String? errorMessage;

  DefaultValuesSet({this.value, this.strict, this.errorMessage});

  DefaultValuesSet.fromJson(Map<String, dynamic> json) {
    value = json['value'];
    strict = json['strict'];
    errorMessage = json['errorMessage'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['value'] = this.value;
    data['strict'] = this.strict;
    data['errorMessage'] = this.errorMessage;
    return data;
  }
}

class Action {
  bool? hasUrl;
  bool? hasLinks;
  Url? url;
  List<Links>? links;

  Action({this.hasUrl, this.hasLinks, this.url, this.links});

  Action.fromJson(Map<String, dynamic> json) {
    hasUrl = json['hasUrl'];
    hasLinks = json['hasLinks'];
    url = json['url'] != null ? new Url.fromJson(json['url']) : null;
    if (json['links'] != null) {
      links = <Links>[];
      json['links'].forEach((v) { links!.add(new Links.fromJson(v)); });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['hasUrl'] = this.hasUrl;
    data['hasLinks'] = this.hasLinks;
    if (this.url != null) {
      data['url'] = this.url!.toJson();
    }
    if (this.links != null) {
      data['links'] = this.links!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Url {
  Android? android;
  Android? ios;

  Url({this.android, this.ios});

  Url.fromJson(Map<String, dynamic> json) {
    android = json['android'] != null ? new Android.fromJson(json['android']) : null;
    ios = json['ios'] != null ? new Android.fromJson(json['ios']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.android != null) {
      data['android'] = this.android!.toJson();
    }
    if (this.ios != null) {
      data['ios'] = this.ios!.toJson();
    }
    return data;
  }
}

class Android {
  String? text;
  String? replacements;
  String? og;

  Android({this.text, this.replacements, this.og});

  Android.fromJson(Map<String, dynamic> json) {
    text = json['text'];
    replacements = json['replacements'];
    og = json['og'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['text'] = this.text;
    data['replacements'] = this.replacements;
    data['og'] = this.og;
    return data;
  }
}

class Links {
  String? type;
  String? text;
  String? color;
  String? bg;
  Android? copyText;
  Url? url;
  Kv? kv;

  Links({this.type, this.text, this.color, this.bg, this.copyText, this.url, this.kv});

  Links.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    text = json['text'];
    color = json['color'];
    bg = json['bg'];
    copyText = json['copyText'] != null ? new Android.fromJson(json['copyText']) : null;
    url = json['url'] != null ? new Url.fromJson(json['url']) : null;
    kv = json['kv'] != null ? new Kv.fromJson(json['kv']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['text'] = this.text;
    data['color'] = this.color;
    data['bg'] = this.bg;
    if (this.copyText != null) {
      data['copyText'] = this.copyText!.toJson();
    }
    if (this.url != null) {
      data['url'] = this.url!.toJson();
    }
    if (this.kv != null) {
      data['kv'] = this.kv!.toJson();
    }
    return data;
  }
}

class Kv {
  String? key1;
  String? key2;

  Kv({this.key1, this.key2});

  Kv.fromJson(Map<String, dynamic> json) {
    key1 = json['key1'];
    key2 = json['key2'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['key1'] = this.key1;
    data['key2'] = this.key2;
    return data;
  }
}

class WzrkParams {
  int? wzrkTtl;
  String? wzrkId;
  String? wzrkPivot;

  WzrkParams({this.wzrkTtl, this.wzrkId, this.wzrkPivot});

  WzrkParams.fromJson(Map<String, dynamic> json) {
    wzrkTtl = json['wzrk_ttl'];
    wzrkId = json['wzrk_id'];
    wzrkPivot = json['wzrk_pivot'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['wzrk_ttl'] = this.wzrkTtl;
    data['wzrk_id'] = this.wzrkId;
    data['wzrk_pivot'] = this.wzrkPivot;
    return data;
  }
}
