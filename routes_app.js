var express = require("express");
var Imagen = require("./models/imagenes");
var router = express.Router();
var image_finder_middleware = require("./middlewares/find_image");
var fs = require("fs");
//app/home
router.get("/", function(req,res){
  /* Buscar el usuario */
  res.render("app/home")
});

/* REST  Lo principal son los recursos
  GET = solicitar un archivo y mostrarlo
  PUT = para actualizar
  DELETE = para eliminar
  POST = para crear
*/

router.get("/imagenes/new",function(req,res)
{
  res.render("app/imagenes/new")
});

router.all("/imagenes/:id*",image_finder_middleware);

router.get("/imagenes/:id/edit",function(req,res)
{
   res.render("app/imagenes/edit");
});

router.route("/imagenes/:id")
.get(function(req,res)
{
    res.render("app/imagenes/show");
})

.put(function(req,res)
{
  res.locals.imagen.title= req.fields.title;
  res.locals.imagen.article= req.fields.article;
  res.locals.imagen.save(function(err){
      if (!err) {
      res.render("app/imagenes/show");
      }
      else {
      res.render("app/imagenes/"+req.params.id+"/edit");
      }
  res.render("app/imagenes/show");
  })
})
.delete(function(req,res)
{
 // eliminar articulos
 Imagen.findOneAndRemove({_id: req.params.id},function(err){
    if (!err) {
      res.redirect("/app/imagenes");
    }
    else {
      console.log(err);
      res.redirect("/app/imagenes"+req.params.id);
    }
 });

});

router.route("/imagenes")
.get(function(req,res)
{
  Imagen.find({creator: res.locals.user._id},function(err,imagenes)
  {
    if(err)
    {
      res.redirect("/app");
      return;
    }
    res.render("app/imagenes/index",{imagenes: imagenes});
  });
})
.post(function(req,res) // para obtener los datos que mando el usuario
{
  var extension = req.files.archivo.name.split(".").pop();//devuelve un arreglo donde se el nombre de la imagen para saber su extension
  // manda a guardar//manda a imprimir el archivo
    var data = { // objeto para mandarlo a la base de datos
    title:req.fields.title, // title es una propiedad del modelo imagenes
    article:req.fields.article,// article es una propiedad del modelo imagenes
    creator:res.locals.user._id,
    extension: extension,
  }

  var imagen = new Imagen(data);// se guarda en una variable el objeto que arrojo

  imagen.save(function(err)// se manda a guardar con el metodo save y se llama al callback
  {
    if (!err) {
      fs.rename(req.files.archivo.path, "public/images/"+imagen._id+"."+extension)
      res.redirect("/app/imagenes/"+imagen._id)
    }
    else {
      console.log(imagen);
      res.render(err);
    }

  })

});

module.exports = router;
