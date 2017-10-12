var Imagen = require("../models/imagenes");

module.exports= function(imagen,req,res)
{
  //true = Tiene permisos
  //Falso = Si no tiene permiso
  if (req.method === "GET" && req.path.indexOf("edit") < 0) {
    //ver la imagen
    return true;
  }

  if (typeof imagen.creator == "undefined") {
    return false;
  }

  if (imagen.creator._id.toString() == res.locals.user._id) {
    // Esta imagen yo la subi
    return true;
  }
  return false;

}
