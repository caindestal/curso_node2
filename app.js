// se requiere el modulo de express
var express = require("express");
//var bodyParser = require("body-parser");
var app = express();// guardamos en la variable app el framework express
var cookieSession = require("cookie-session");
var User = require("./models/user").User;
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var formidable = require("express-formidable");
var methodOverride = require("method-override");
//mongoose
// declaracion de Middlewares
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(express.static('public'));
// vamos aver que tal
/* /dashboard */

/* /    */
app.use(methodOverride("_method"));

app.use(formidable({
  keepExtensions : true,
}));

app.use(cookieSession({
  name: "session",
  keys: ["llave-1","llave-2"]
}));


/**
    Verbos Http
    get es recibir
    post es enviar sobretodo en formularios
    put
    patch
    options
    headers
    delete
    arquitectura REST
**/

/** app.set es par obtener y definir como el motor de vistas a jade
 y poder mandar a renderizar cualquier archivo **/

app.set("view engine","jade");


app.get("/",function(req , res) {// para que se pueda acceder al path con la funcion get (/ , funcion (peticion , respuesta))

 // siempre recordar que hay que crear una carpeta que se llame views donde iran
 // nuestras vistas
  console.log(req.session.user_id);
  res.render("index");// para obtener la respuesta del servidor en la variable respuesta y se llama al metodo send de express que manda la peticion recibe la respuesta y cierra la coneccion con el servidor

});
app.get("/signup",function(req , res) {// para que se pueda acceder al path con la funcion get (/ , funcion (peticion , respuesta))
 // siempre recordar que hay que crear una carpeta que se llame views donde iran
 // nuestras vistas
  User.find(function(err,doc) {
    console.log(doc);
      res.render("signup");// para obtener la respuesta del servidor en la variable respuesta y se llama al metodo send de express que manda la peticion recibe la respuesta y cierra la coneccion con el servidor
  });


});
app.get("/login",function(req , res) {// para que se pueda acceder al path con la funcion get (/ , funcion (peticion , respuesta))
 // siempre recordar que hay que crear una carpeta que se llame views donde iran
 // nuestras vistas
      res.render("login");// para obtener la respuesta del servidor en la variable respuesta y se llama al metodo send de express que manda la peticion recibe la respuesta y cierra la coneccion con el servidor
  });

app.post("/users",function(req,res){ // action donde se mandara el formulario


    var user = new User({
      email: req.fields.email,
      password: req.fields.password,
      password_confirmation: req.fields.password_confirmation,
      username: req.fields.username});
      console.log(user.password_confirmation);

    user.save().then(function(us){
      res.send("Guardamos el usuario exitosamente");

    },function(err){
      console.log(String(err));
      res.send("Hubo un error al guardar el usuario");
    });
      res.render("index");
});
app.post("/sessions",function(req,res){
User.findOne({username: req.fields.username , password: req.fields.password},function(err,user)
{
 req.session.user_id = user._id;
 res.redirect("/app");
});

});
app.use("/app",session_middleware);
app.use("/app",router_app);

app.listen(8080);// se llama el metodo listen que manda el puerto por parametro al servidor express
