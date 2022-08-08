

class TestInboxMessage{

  TestInboxMessage({
    required this.id,
    required this.isRead,
    required this.date,
    required this.wzrkTtl,
    required this.tags,
    required this.wzrkId,
  });

  String id;
  bool isRead;
  int date;
  int wzrkTtl;
  List<String> tags;
  String wzrkId;


 factory TestInboxMessage.fromList(List<Object?> inboxListObj) {


   // var myListIter = inboxListObj.iterator;
   // var currentElement;
   //
   // while(myListIter.moveNext()){
   //   currentElement = myListIter.current;
   //   print(currentElement);
   // }

  //  var map1 = Map.fromIterable(inboxListObj,
  //      key: (e) => e.toString(), value: (e) => e.toString());
  //
  //
  // var test = map1['id'];
  // var test2 = map1['isRead'];
  //
  //
  // print(test);
  // print(test2);


   inboxListObj.forEach((element) {
     print("Inside loop");
     print(element);

     var msg = element;
   });







   return TestInboxMessage(
       id: "",
       isRead: false,
       date: -1,
       wzrkTtl: -1,
       tags: [],
       wzrkId: "");
 }
}