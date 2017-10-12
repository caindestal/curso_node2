var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://127.0.0.1/proyecto_codigofacilito");
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/,"Email No valido"];
var password_validation = {
  validator: function (p) {
    return this.password_confirmation == p;},
    message: "Las Contraseñas no son iguales"
}
var user_schema = new Schema({
  username:{type: String,required: "Username Es obligatorio", maxlength: [50,"su username es muy extenso"] , minlength: [3,"su username es muy corto"]},
  password:{type: String,required: "Password obligatorio", minlength: [8,"contraseña debe ser mayor a 8 caracteres"],
  validate: password_validation},
//  age: {type: Number,min:[5,"La edad no puede ser menor de 5"],max: [100,"La edad no puede ser mayor de 100"], require: "El Correo es obligatorio"},
  email: {type: String,required: "El Correo es obligatorio",match:email_match},
//  date_of_birth: Date
});

user_schema.virtual("password_confirmation").get(function()
{
  return this.p_c;
}).set(function(password)
{
this.p_c = password;
});

var User = mongoose.model("User",user_schema);

module.exports.User = User;
/*
String
Number
Date
Buffer
Boolean
Mixed
Objectid
Array
*/
