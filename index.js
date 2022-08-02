const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const SettingsBill = require("./settings-Bill");
const app = express();
const settingsBill = SettingsBill();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handlebars
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
  }));


const port = process.env.PORT || 5000;
app.listen(port);
console.log(`listen to server: http://localhost:${port}`);

// landing
app.get("/", (req, res) => {
  res.render("index", {settings: settingsBill.getSettings(),
         totals: settingsBill.totals(),
         critical: settingsBill.hasReachedWarningLevel(), 
  });

});

app.post("/settings", (req, res) => {
  settingsBill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel,
  });

  // console.log(greetApp.setSettings());

  res.redirect("/");
});

app.post("/action", (req, res) => {

   settingsBill.recordAction(req.body.actionType)
  res.redirect("/");
});

app.get("/actions", (req, res) => {
  res.render('actions', {actions: settingsBill.actions()} );
});

app.get("/actions/:type", (req, res) => {
  let type = req.params.type;
  res.render('actions',{actions: settingsBill.actionsFor(type)} );
});
