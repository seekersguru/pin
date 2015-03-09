var user = require('./user.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pin-dev');
UserSchema = user.UserSchema;
User  = user.User ;
uo=UserSchema.methods.get_user({"email":"nishu.saxena@gmail.com"})

// Test case create User 
uo  =UserSchema.methods.create_user(
		{"status":"email_verification_pending" , 
			"password":"nishu" , 
			"address.country":"coun","family_office":"my famile" ,
			"address.city":"city address" ,
			"real_name":"real_namess" ,
			"email":"isit@gm.com"});

//Test case get User 
uo=UserSchema.methods.get_user({"email":"nishu.saxena@gmail.com"})



uo  =UserSchema.methods.create_user({})


User = user.User;
userObj= new  User({	"email":"sbb","real_name":"Nishant","family_office":"The familly office name "});
var onerror = function (err) {console.log(err);}
userObj.save(onerror);

//function new_user(){
//	
//	user= new  User({"family_office":"The familly office name "});
//	user.save()
//}
//
//new_user();


//var query = {'family_office':"The familly office name "};
//User.findOneAndUpdate(query, 
//		{'family_office':"The familly office name changed "}, {upsert:true}, function(err, doc){
//    if (err) return {"error":"Some unexpected error "};
//    
//    
//    return {"success":"Record succesfully updated" };
//});
//
//
//function add_record(model,values){
//	var model_instance = model(values);
//	model_instance.save();
//}




> onerror=function (err) {console.log(err);}
[Function]
> var onerror=function (err) {console.log(err);}
undefined
> userObj.save(onerror);
undefined
> { message: 'Validation failed',
  name: 'ValidationError',
  errors: 
   { email: 
      { message: 'Path `email` (sbb) is not an email.',
        name: 'ValidatorError',
        path: 'email',
        type: 'email',
        value: 'sbb' } } }

undefined
> 
undefined
> userObj= new  User({"email":"F1@gm.com","real_name":"Nishant","family_office":"The familly office name "});
{ email: 'F1@gm.com',
  real_name: 'Nishant',
  family_office: 'The familly office name ',
  _id: 54fafde76aceebe61549cb9f }
> userObj.save(onerror);
undefined
> null

undefined
> userObj= new  User({"email":"F1@gm.com","real_name":"Nishant","family_office":"The familly office name "});
{ email: 'F1@gm.com',
  real_name: 'Nishant',
  family_office: 'The familly office name ',
  _id: 54fafe186aceebe61549cba0 }
> userObj.save(onerror);
undefined
> null

undefined
> 
undefined
> userObj.save(onerror);
undefined
> null

undefined
> userObj= new  User({"email":"F1@gm.com","real_name":"Nishant","family_office":"The familly office name "});
{ email: 'F1@gm.com',
  real_name: 'Nishant',
  family_office: 'The familly office name ',
  _id: 54fafe2f6aceebe61549cba1 }
> userObj.save(onerror);
undefined
> { [MongoError: E11000 duplicate key error index: api.users.$email_1  dup key: { : "f1@gm.com" }]
  name: 'MongoError',
  err: 'E11000 duplicate key error index: api.users.$email_1  dup key: { : "f1@gm.com" }',
  code: 11000,
  n: 0,
  connectionId: 57,
  ok: 1 }

undefined
> userObj= new  User({"email":"F2@gm.com","real_name":"Nishant","fam":"The familly office name "});
{ email: 'F2@gm.com',
  real_name: 'Nishant',
  _id: 54fafe726aceebe61549cba2 }
> userObj.save(onerror);
undefined
> { message: 'Validation failed',
  name: 'ValidationError',
  errors: 
   { family_office: 
      { message: 'Path `family_office` is required.',
        name: 'ValidatorError',
        path: 'family_office',
        type: 'required',
        value: undefined } } }

undefined
> userObj= new  User({"email":"F1@gm.com","real_name":"Nishant","family_office":"Th"});
{ email: 'F1@gm.com',
  real_name: 'Nishant',
  family_office: 'Th',
  _id: 54fafe866aceebe61549cba3 }
> userObj.save(onerror);
undefined
> { message: 'Validation failed',
  name: 'ValidationError',
  errors: 
   { family_office: 
      { message: 'Path `family_office` (Th) has invalid length.',
        name: 'ValidatorError',
        path: 'family_office',
        type: 'length',
        value: 'Th' } } }

undefined
> Types
ReferenceError: Types is not defined
    at repl:1:2
    at REPLServer.self.eval (repl.js:110:21)
    at Interface.<anonymous> (repl.js:239:12)
    at Interface.EventEmitter.emit (events.js:95:17)
    at Interface._onLine (readline.js:202:10)
    at Interface._line (readline.js:531:8)
    at Interface._ttyWrite (readline.js:760:14)
    at ReadStream.onkeypress (readline.js:99:10)
    at ReadStream.EventEmitter.emit (events.js:98:17)
    at emitKey (readline.js:1095:12)
> UserSchema
ReferenceError: UserSchema is not defined
    at repl:1:2
    at REPLServer.self.eval (repl.js:110:21)
    at Interface.<anonymous> (repl.js:239:12)
    at Interface.EventEmitter.emit (events.js:95:17)
    at Interface._onLine (readline.js:202:10)
    at Interface._line (readline.js:531:8)
    at Interface._ttyWrite (readline.js:760:14)
    at ReadStream.onkeypress (readline.js:99:10)
    at ReadStream.EventEmitter.emit (events.js:98:17)
    at emitKey (readline.js:1095:12)
> 
