"use strict";
(function(){
    console.info("Up and running!");

    var Buttons = {
        _getAndSaveButton: function(buttonname){
            if(this["btn" + buttonname]===undefined) {
                this["btn" + buttonname] = document.getElementById(buttonname);
            }
            return this["btn" + buttonname];
        },
        get addSmall(){
            return this._getAndSaveButton("addSmall");
        },
        get addMedium(){
        return this._getAndSaveButton("addMedium");
        },
        get addLarge(){
        return this._getAndSaveButton("addLarge");
        },
        get addExtraLarge(){
        return this._getAndSaveButton("addExtraLarge");
        },
        get subtractSmall(){
            return this._getAndSaveButton("subtractSmall");
        },
        get subtractMedium(){
        return this._getAndSaveButton("subtractMedium");
        },
        get subtractLarge(){
        return this._getAndSaveButton("subtractLarge");
        },
        get subtractExtraLarge(){
        return this._getAndSaveButton("subtractExtraLarge");
        },
        get submit(){
        return this._getAndSaveButton("submit");
        },
        get settings(){
        return this._getAndSaveButton("settings");
        }
    };

    Buttons.addSmall.addEventListener("click", x => WaterDrinkApp.addCup(0.125));
    Buttons.addMedium.addEventListener("click", x => WaterDrinkApp.addCup(0.25));
    Buttons.addLarge.addEventListener("click", x => WaterDrinkApp.addCup(0.33));
    Buttons.addExtraLarge.addEventListener("click", x => WaterDrinkApp.addCup(0.5));
    Buttons.subtractSmall.addEventListener("click", x => WaterDrinkApp.addCup(-0.125));
    Buttons.subtractMedium.addEventListener("click", x => WaterDrinkApp.addCup(-0.25));
    Buttons.subtractLarge.addEventListener("click", x => WaterDrinkApp.addCup(-0.33));
    Buttons.subtractExtraLarge.addEventListener("click", x => WaterDrinkApp.addCup(-0.5));
    Buttons.submit.addEventListener("click", x=> WaterDrinkApp.startNextDay());

    var WaterDrinkApp = {
        currentIntake: 0,
        currentKey: (new Date()).toISOString().substring(0,10),
        setNewDay: function(){
            var nextDate = new Date(Date.parse(this.currentKey));
            nextDate.setDate(nextDate.getDate()+1);
            this.currentKey = this.createKey(nextDate);
            this.currentDay = this.getCurrentDayValue();
        },
        createKey: function(date){
            return date.toISOString().substring(0,10);
        },
        loadData:function(){
            this.data = JSON.parse(localStorage.getItem("water-data")||"{}");
        },
        getCurrentDayValue: function(){
            return {"intake": (this.data[this.currentKey] !== undefined ? this.data[this.currentKey].intake : 0)} ;
        },
        initialize: function(renderer){
            this.renderer = renderer;
            this.loadData();
            this.currentKey = this.createKey(new Date());
            this.currentDay = this.getCurrentDayValue();
            this.updateDisplayOfIntake();
        },
        addCup: function(value){
            this.currentDay.intake += value;
            this.updateDisplayOfIntake();
        },
        updateDisplayOfIntake: function(){
            this.renderer.setValue(this.currentDay.intake.toFixed(3) + " liter");
        },
        startNextDay: function(){
            this.data[this.currentKey] = this.currentDay;
            localStorage.setItem("water-data", JSON.stringify(this.data));
            this.setNewDay();
            this.updateDisplayOfIntake();
        }
    };

    WaterDrinkApp.initialize({
        setValue: value => document.getElementById("currentIntake").innerHTML=value
    });
}());

window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
      console.info("NOTHING");
    }
  }, false);

}, false);