/*oracles*/
var oraclesI = {};
$.getJSON("https://raw.githubusercontent.com/kahar/datasworn/dataforged-format/oracles_all.json")
    .done(function(data) {
        oraclesI = data;
        for (var i = 0; i < data.length; i++) {
            var oracle = data[i];
            // parseOracle(oracles, oracle)
            oraclesI[spaceToUnderscore(getNameOrDisplayName(oracle))] = oracle;
            if (oracle["Display name"] == null) {
                oracle["Display name"] = oracle.Name;
            }
            var divToAppend = '<div id="' + toId(oracle["Display name"]) + '" ><div onclick="hideSubElements(this)">' + converter.makeHtml('##' + oracle["Display name"]) + '</div><div id="subelements"></div></div>'
            $("#oracles_I_list").append(divToAppend);
            for (var j = 0; j < oracle.Oracles.length; j++) {
                var subOracle = oracle.Oracles[j];
                parseSubOracle(oracle, subOracle);
            }
            if (oracle.Subcategories != null) {
                for (var z = 0; z < oracle.Subcategories.length; z++) {
                    var subOracle = oracle.Subcategories[z];
                    parseSubOracle(oracle, subOracle);
                }
            }
        }
    });

function parseSubOracle(oracle, subOracle) {
    oracle[spaceToUnderscore(getNameOrDisplayName(subOracle))] = subOracle;
    if (subOracle["Display name"] == null) {
        subOracle["Display name"] = subOracle.Name;
    }
    var liToAppend = '<div id="' + toId(subOracle["Display name"]) + '"><div onclick="hideSubElements(this)">' + converter.makeHtml('###' + subOracle["Display name"]) +
        '</div>' + '<div id="subelements"></div>' +
        '</div>';
    $("#" + toId(oracle["Display name"]) + " #subelements").first().append(liToAppend);
    if (subOracle.Table != null) {
        for (var z = 0; z < subOracle.Table.length; z++) {
            var tableElementToAppend = '<div>' + subOracle.Table[z].Chance + ' ' + subOracle.Table[z].Description + '</div>'
            $("#" + toId(oracle["Display name"]) +" #" + toId(subOracle["Display name"]) + " #subelements").append(tableElementToAppend);
        }
    }
    if (subOracle.Tables != null) {
        for (var z = 0; z < subOracle.Tables.length; z++) {
            var subSubOracle = subOracle.Tables[z];
            parseSubOracle(subOracle, subSubOracle);
        }
    }
    if (subOracle.Oracles != null) {
        for (var z = 0; z < subOracle.Oracles.length; z++) {
            var subSubOracle = subOracle.Oracles[z];
            parseSubOracle(subOracle, subSubOracle);
        }
    }
}

/*moves part*/
$.getJSON("https://raw.githubusercontent.com/kahar/datasworn/dataforged-format/moves.json")
    .done(function(data) {
        var moves = data.Moves;
        var movesTypes = [];
        for (var i = 0; i < moves.length; i++) {
            var move = moves[i];
            if (movesTypes[move.Category] != null) {
                movesTypes[move.Category].push(move);
            } else {
                movesTypes[move.Category] = [];
                movesTypes[move.Category].push(move);
            }
        }

        for (const category in movesTypes) {
            var moveType = movesTypes[category];
            var divToAppend = '<div id="' + toId(category) + '" ><div onclick="hideSubElements(this)">' + converter.makeHtml('##' + category) + '</div><div id="subelements"></div></div>'
            $("#moves_I_list").append(divToAppend);
            for (var i = 0; i < moveType.length; i++) {
                var move = moveType[i];
                var liToAppend = '<div id=' + toId(move.Name) + '>' + converter.makeHtml('###' + move.Name + '\n' + move.Text) + '</div>';

                $("#" + toId(category) + " #subelements").append(liToAppend);
            }
        }
    });

/*assets part*/
$.getJSON("https://raw.githubusercontent.com/kahar/datasworn/dataforged-format/assets.json")
    .done(function(data) {
        var assets = data.Assets.Assets;
        var assetsTypes = [];
        for (var i = 0; i < assets.length; i++) {
            var asset = assets[i];
            if (assetsTypes[asset.Category] != null) {
                assetsTypes[asset.Category].push(asset);
            } else {
                assetsTypes[asset.Category] = [];
                assetsTypes[asset.Category].push(asset);
            }
        }

        for (const category in assetsTypes) {
            var assetType = assetsTypes[category];
            var divToAppend = '<div id="' + toId(category) + '" ><div onclick="hideSubElements(this)">' + converter.makeHtml('##' + category) + '</div><div id="subelements"></div></div>'
            $("#assets_I_list").append(divToAppend);
            for (var i = 0; i < assetType.length; i++) {
                var asset = assetType[i];

                var liToAppend = '<div id=' + toId(asset.Name) + '>' + converter.makeHtml('###' + asset.Name +
                        (asset.Description != null ? ('\n' + asset.Description + '\n') : '\n')) +
                    '<div>' +
                    '<input type="checkbox" disabled ' + (asset.Abilities[0].Enabled == true ? 'checked' : '') + '>' + converter.makeHtml(asset.Abilities[0].Text) +
                    '<input type="checkbox" disabled ' + (asset.Abilities[1].Enabled == true ? 'checked' : '') + '>' + converter.makeHtml(asset.Abilities[1].Text) +
                    '<input type="checkbox" disabled ' + (asset.Abilities[2].Enabled == true ? 'checked' : '') + '>' + converter.makeHtml(asset.Abilities[2].Text) +
                    '</div>' +
                    '</div>';

                $("#" + toId(category) + " #subelements").append(liToAppend);
            }
        }
    });

/*roll on oracles*/

function rollOnTableI(table) {

    var randResult = Math.floor(Math.random() * 100) + 1;
    if (enforceOneRoll) {
        randResult = enforcedResult;
        enforceOneRoll = false;
    }
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        if (randResult <= row.Chance) {
            var result = row.Description;
            if (row.Details != null) {
                result = result + " Details: " + row.Details;
            }
            if (row.Thumbnail != null) {
                result = result + "<br><img src='" + row.Thumbnail + ".jpg'><br>"
            }
            //            if (row.Suggest != null && row.Suggest[0] != null && row.Suggest[0].Oracles != null) {
            //                result = result + "<div style='background-color: " + BACKGROUND_COLOR_SUGGESTIONS + "; margin: 10px;'> Suggestions:";
            //                var suggestions = row.Suggest[0].Oracles;
            //                for (var j = 0; j < suggestions.length; j++) {
            //                    var suggestion = suggestions[j];
            //                    if (j == 0) {
            //                        result = result + " " + rollOnOracleI(oraclesI[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
            //                    } else {
            //                        result = result + "," + rollOnOracleI(oraclesI[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
            //                    }
            //                }
            //                result = result + "</div>"
            //            }
            if (row.Oracles != null) {
                result = result + "<div style='background-color: " + BACKGROUND_COLOR_ORACLES + "; margin: 10px;'> Oracles:";
                var suggestions = row.Oracles;
                for (var j = 0; j < suggestions.length; j++) {
                    var suggestion = suggestions[j];
                    if (j == 0) {
                        result = result + " " + rollOnOracleI(oraclesI[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
                    } else {
                        result = result + "," + rollOnOracleI(oraclesI[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
                    }
                }
                result = result + "</div>"
            }
            if (row["Multiple rolls"] != null) {
                var multipleRolls = row["Multiple rolls"];
                result = result + "<div style='background-color: " + BACKGROUND_COLOR_MULTIPLE_ROLLS + "; margin: 10px;'> Multiple rolls result:";
                for (var j = 0; j < multipleRolls.Amount; j++) {
                    if (j == 0) {
                        result = result + " " + rollOnTableI(table);
                    } else {
                        result = result + "," + rollOnTableI(table);
                    }
                }
                result = result + "</div>"
            }
            if (row.Assets != null) {
                result = result + " Assets:" + row.Assets;
            }
            if (row["Game object"] != null) { //TODO add amount
                result = result + "<div style='background-color: " + BACKGROUND_COLOR_GAME_OBJECT + "; margin: 10px;'> Game object:";
                var gameObject = row["Game object"];
                if (gameObject["Object type"] != null) {
                    var gameObjectType = gameObject["Object type"];
                    //                    if (gameObjectType == "Starship") {
                    //                        result = result + " Starship: [ <br> " + createStarshipSF(false) + "<br>]"
                    //                    }
                    if (gameObjectType == "Character") {
                        result = result + " Character: [ <br> " + createCharacterI(false) + "<br>]"
                    }
                    if (gameObjectType == "Settlement") {
                        result = result + " Settlement: [ <br> " + createSettlementI(false) + "<br>]"
                    }
                    //                    if (gameObjectType == "Planet") {
                    //                        result = result + " Planet: [ <br> " + createPlanetSF(false) + "<br>]"
                    //                    }
                    //                    if (gameObjectType == "Precursor Vault") {
                    //                        result = result + " Precursor Vault: [ <br> " + createPrecursorVaultSF(false) + "<br>]"
                    //                    }
                    //                    if (gameObjectType == "Creature") {
                    //                        result = result + " Creature    : [ <br> " + createCreatureSF(false) + "<br>]"
                    //                    }

                    result = result + "</div>"
                }
            }
            if (row["Add template"] != null) {
                var template = row["Add template"];
                var templateType = template["Template type"];
                var attributes = template.Attributes;
                var derelictType = attributes["Derelict Type"];
                result = result + " Derelict: [ <br> " + createDerelictSF() + "<br>]"
            }
            return result;
        }
    }
}

function rollOnOracleI(oracle) {
    var result = "";
    if (oracle.Tables != null) {
        for (var i = 0; i < oracle.Tables.length; i++) {
            var subResult = rollOnOracleI(oracle.Tables[i]);
            result = result + "<br>" + "For " + oracle.Tables[i].Name + ": " + subResult;
        }
    } else {
        result = rollOnTableI(oracle.Table);
    }
    return result;
}

function createCharacterI(display) {
    var txt = rollOnOracleI(oraclesI.Name.Ironlander_Names) + " jest " +
        rollOnOracleI(oraclesI.Turning_Point.Rank) + " " +
        rollOnOracleI(oraclesI.Character.Descriptor) + " " +
        rollOnOracleI(oraclesI.Character.Role) +
        "<br>" +
        "Jego/jej obecnym celem jest: " + rollOnOracleI(oraclesI.Character.Goal) +
        "<br>" +
        "Obecnie on/ona jest: " + rollOnOracleI(oraclesI.Character.Disposition) +
        "<br>" +
        "Obecnie jego/jej zajęciem jest: " + rollOnOracleI(oraclesI.Character.Activity)

    if (display == null || display) {
        displayInModal(txt);
    }
    return txt;
}

function createSettlementI(display) {
    var txt =
        "Nazwa osady:" + "<br>" + rollOnOracleI(oraclesI.Settlement.Settlement_Name) +
        "<br>" +
        "Alternatywna krótka nazwa:" +
        "<br>" + rollOnOracleI(oraclesI.Settlement.Quick_Settlement_Name_Prefix) + " " + rollOnOracleI(oraclesI.Settlement.Quick_Settlement_Name_Suffix) + "<br>" +
        "Opis:" + "<br>" +
        rollOnOracleI(oraclesI.Place_Oracles.Description) +
        "<br>" +
        "Problem:" + "<br>" +
        rollOnOracleI(oraclesI.Settlement.Settlement_Trouble) +
        "<br>" +
        "Przywódca:" + "<br>" +
        createCharacterI(false) + "<br>" + "<br>" +
        "Inni mieszkańcy:" + "<br>" +
        createCharacterI(false) + "<br>" + "<br>" +
        createCharacterI(false) + "<br>" + "<br>" +
        createCharacterI(false) + "<br>"

    if (display == null || display) {
        displayInModal(txt);
    }
    return txt;
}

function createMonstrosityI(display) {
    var txt =
        "Potworność:" + "<br>" +
        "rozmiar:" + rollOnOracleI(oraclesI.Monstrosity.Size) +
        "<br>" +
        "Ogólna postać:" + rollOnOracleI(oraclesI.Monstrosity.Primary_Form) +
        "<br>" +

        "Charakterystyka:" + rollOnOracleI(oraclesI.Monstrosity.Characteristics) + " i/lub " + rollOnOracleI(oraclesI.Monstrosity.Characteristics) +
        "<br>" +
        "Umiejętności:" + rollOnOracleI(oraclesI.Monstrosity.Abilities) + " i/lub " + rollOnOracleI(oraclesI.Monstrosity.Abilities) +
        "<br>"



    if (display == null || display) {
        displayInModal(txt);
    }
    return txt;
}

function createAimI(display) {
var txt =
        "Cel którego szukasz znajduje się w:" +rollOnOracleI(oraclesI.Place_Oracles.Region) +
        ", a dokładniej w: " +rollOnOracleI(oraclesI.Place_Oracles.Description) +
        " " + rollOnOracleI(oraclesI.Place_Oracles.Location) + " ( lub przy wodzie:" + rollOnOracleI(oraclesI.Place_Oracles.Coastal_Waters_Location)  +")";

    if (display == null || display) {
        displayInModal(txt);
    }
    return txt;

    displayInModal(getRandElement(data.lokacja.srodladowa))

}

function createWaypointI(display) {
var txt = "";
var result = Math.floor(Math.random() * 10) + 1;
          if(result >= 1 && result <=6){
            txt = txt+ "Po dniu podróży docierasz do: <br>"
            +rollOnOracleI(oraclesI.Place_Oracles.Description)
            + " "
            + rollOnOracleI(oraclesI.Place_Oracles.Location)
            + " ( lub przy wodzie:"
            + rollOnOracleI(oraclesI.Place_Oracles.Coastal_Waters_Location)
            +")";
          } else if(result >= 7 && result <=9){
            txt = txt+ "Po dniu podróży docierasz do: <br>"
                                   +rollOnOracleI(oraclesI.Place_Oracles.Description)
                                   + " "
                                   + rollOnOracleI(oraclesI.Place_Oracles.Location)
                                   + " ( lub przy wodzie:"
                                   + rollOnOracleI(oraclesI.Place_Oracles.Coastal_Waters_Location)
                                   +")"
                                    + "<br>"
            +"i spotykasz podróżnika:<br>"
            +createCharacterI(false);
          } if(result == 10){
            txt = txt+ "Po dniu podróży docierasz do: <br>"
                                               +rollOnOracleI(oraclesI.Place_Oracles.Description)
                                               + " "
                                               + rollOnOracleI(oraclesI.Place_Oracles.Location)
                                               + " ( lub przy wodzie:"
                                               + rollOnOracleI(oraclesI.Place_Oracles.Coastal_Waters_Location)
                                               +")"
                                                + "<br>"
            +"i napotykasz osadę:<br>"
            +createSettlementI(false);
          }
    if (display == null || display) {
        displayInModal(txt);
    }
    return txt;
}