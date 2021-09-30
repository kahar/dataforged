/*oracles*/
var oraclesSF = {};
$.getJSON("https://raw.githubusercontent.com/kahar/dataforged/display/oracles.json")
    .done(function(data) {
        oraclesSF = data;
        for (var i = 0; i < data.length; i++) {
            var oracle = data[i];
            oraclesSF[spaceToUnderscore(getNameOrDisplayName(oracle))] = oracle;
            if (oracle["Display name"] == null) {
                oracle["Display name"] = oracle.Name;
            }
            var divToAppend = '<div id="' + toId(oracle["Display name"]) + '" ><div onclick="hideSubElements(this)">' + converter.makeHtml('##' + oracle["Display name"]) + '</div><div id="subelements"></div></div>'
            $("#oracles_SF_list").append(divToAppend);
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
            var tableElementToAppend = '<div>' + /*TODO uncomment subOracle.Table[z].Chance + ' ' +*/ subOracle.Table[z].Description + (subOracle.Table[z].Assets != null ? (" "+subOracle.Table[z].Assets) :"") + '</div>'
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

/*roll oracles*/
function rollOnTableSF(table) {

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
            if (row.Suggest != null && row.Suggest[0] != null && row.Suggest[0].Oracles != null) {
                result = result + "<div style='background-color: " + BACKGROUND_COLOR_SUGGESTIONS + "; margin: 10px;'> Suggestions:";
                var suggestions = row.Suggest[0].Oracles;
                for (var j = 0; j < suggestions.length; j++) {
                    var suggestion = suggestions[j];
                    if (j == 0) {
                        result = result + " " + rollOnOracleSF(oraclesSF[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
                    } else {
                        result = result + "," + rollOnOracleSF(oraclesSF[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
                    }
                }
                result = result + "</div>"
            }
            if (row.Oracles != null) {
                result = result + "<div style='background-color: " + BACKGROUND_COLOR_ORACLES + "; margin: 10px;'> Oracles:";
                var suggestions = row.Oracles;
                for (var j = 0; j < suggestions.length; j++) {
                    var suggestion = suggestions[j];
                    if (j == 0) {
                        result = result + " " + rollOnOracleSF(oraclesSF[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
                    } else {
                        result = result + "," + rollOnOracleSF(oraclesSF[suggestion.Category][spaceToUnderscore(suggestion.Name)]);
                    }
                }
                result = result + "</div>"
            }
            if (row["Multiple rolls"] != null) {
                var multipleRolls = row["Multiple rolls"];
                result = result + "<div style='background-color: " + BACKGROUND_COLOR_MULTIPLE_ROLLS + "; margin: 10px;'> Multiple rolls result:";
                for (var j = 0; j < multipleRolls.Amount; j++) {
                    if (j == 0) {
                        result = result + " " + rollOnTableSF(table);
                    } else {
                        result = result + "," + rollOnTableSF(table);
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
                    if (gameObjectType == "Starship") {
                        result = result + " Starship: [ <br> " + createStarshipSF(false) + "<br>]"
                    }
                    if (gameObjectType == "Character") {
                        result = result + " Character: [ <br> " + createCharacterSF(false) + "<br>]"
                    }
                    if (gameObjectType == "Settlement") {
                        result = result + " Settlement: [ <br> " + createSettlementSF(false) + "<br>]"
                    }
                    if (gameObjectType == "Planet") {
                        result = result + " Planet: [ <br> " + createPlanetSF(false) + "<br>]"
                    }
                    if (gameObjectType == "Precursor Vault") {
                        result = result + " Precursor Vault: [ <br> " + createPrecursorVaultSF(false) + "<br>]"
                    }
                    if (gameObjectType == "Creature") {
                        result = result + " Creature    : [ <br> " + createCreatureSF(false) + "<br>]"
                    }

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

function rollOnOracleSF(oracle) {
    var result = "";
    if (oracle.Tables != null) {
        for (var i = 0; i < oracle.Tables.length; i++) {
            var subResult = rollOnOracleSF(oracle.Tables[i]);
            result = result + "<br>" + "For " + oracle.Tables[i].Name + ": " + subResult;
        }
    } else {
        result = rollOnTableSF(oracle.Table);
    }
    return result;
}

/*moves part*/
$.getJSON("https://raw.githubusercontent.com/kahar/dataforged/display/moves.json")
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
            $("#moves_SF_list").append(divToAppend);
            for (var i = 0; i < moveType.length; i++) {
                var move = moveType[i];
                var liToAppend = '<div id=' + toId(move.Name) + '>' + converter.makeHtml('###' + move.Name + '\n' + move.Text) + '</div>';

                $("#" + toId(category) + " #subelements").append(liToAppend);
            }
        }
    });

    /*assets part*/
    $.getJSON("https://raw.githubusercontent.com/kahar/dataforged/display/assets.json")
        .done(function(data) {
            var assets = data.Assets;
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
                $("#assets_SF_list").append(divToAppend);
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

        function createLocationFeaturesByThemeSF(theme) {
            return "Feature:" + rollOnOracleSF(oraclesSF.Location_Theme[theme].Feature) + "<br>" +
                "Peril:" + rollOnOracleSF(oraclesSF.Location_Theme[theme].Peril) + "<br>" +
                "Opportunity:" + rollOnOracleSF(oraclesSF.Location_Theme[theme].Opportunity) + "<br>";
        }

        function createLocationSF(display) {
            var themeText = rollOnOracleSF(oraclesSF.Location_Theme.Theme_Type);
            var theme = themeText.replace(/ .*/, '');

            var txt = "Theme " + themeText + "<br>" +
                createLocationFeaturesByThemeSF(theme);
            ""
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createCharacterSF(display) {
            var txt = rollOnOracleSF(oraclesSF.Character.Given_Name) +
                " \"" +
                rollOnOracleSF(oraclesSF.Character.Callsign) +
                "\" " +
                rollOnOracleSF(oraclesSF.Character.Family_Name) +
                "<br>" +
                "First look: " + rollOnOracleSF(oraclesSF.Character.First_Look) +
                "<br>" +
                "Disposition: " + rollOnOracleSF(oraclesSF.Character.Disposition) +
                "<br>" +
                "Role: " + rollOnOracleSF(oraclesSF.Character.Role) +
                "<br>" +
                "Goal: " + rollOnOracleSF(oraclesSF.Character.Goal) +
                "<br>" +
                "Revealed aspect:" + rollOnOracleSF(oraclesSF.Character.Revealed_Aspect)

            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }


        function createCharacterCreationSF(display) {
            var txt = rollOnOracleSF(oraclesSF.Character_Creation.Background_Assets) +
                "<br>" +
                "Backstory Prompts: " + rollOnOracleSF(oraclesSF.Character_Creation.Backstory_Prompts) +
                "<br>" +
                "<br>" +
                "Starship History: " + rollOnOracleSF(oraclesSF.Character_Creation.Starship_History) +
                "<br>" +
                "Starship Quirks: " + rollOnOracleSF(oraclesSF.Character_Creation.Starship_Quirks) +
                "<br>" +
                "<br>" +
                "Sector Trouble: " + rollOnOracleSF(oraclesSF.Character_Creation.Sector_Trouble) +
                "<br>" +
                "Inciting Incident: " + rollOnOracleSF(oraclesSF.Character_Creation.Inciting_Incident)

            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createSectorNameSF(display) {
            var txt = "Sector name prefix: " + rollOnOracleSF(oraclesSF.Space["Sector_Name_-_Prefix"]) +
                "<br>" +
                "Sector name suffix: " + rollOnOracleSF(oraclesSF.Space["Sector_Name_-_Suffix"])
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }



        function createEnvironmentCreatureSF(environment) {
            return "Environment: " + environment +
                "<br>" +
                "Scale: " + rollOnOracleSF(oraclesSF.Creature.Scale) +
                "<br>" +
                "Basic Form: " + rollOnOracleSF(oraclesSF.Creature.Basic_Form[environment]) +
                "<br>" +
                "First Look: " + rollOnOracleSF(oraclesSF.Creature.First_Look) +
                "<br>" +
                "Encountered Behavior: " + rollOnOracleSF(oraclesSF.Creature.Encountered_Behavior) +
                "<br>" +
                "Revealed Aspect: " + rollOnOracleSF(oraclesSF.Creature.Revealed_Aspect)
        }

        function createSpaceCreatureSF(display) {
            var environment = "Space";
            var txt = createEnvironmentCreatureSF(environment);
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createInteriorCreatureSF(display) {
            var environment = "Interior";
            var txt = createEnvironmentCreatureSF(environment);
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createLandCreatureSF(display) {
            var environment = "Land";
            var txt = createEnvironmentCreatureSF(environment);
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createLiquidCreatureSF(display) {
            var environment = "Liquid";
            var txt = createEnvironmentCreatureSF(environment);
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createAirCreatureSF(display) {
            var environment = "Air";
            var txt = createEnvironmentCreatureSF(environment);
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createPlanetFeaturesByClassSF(planetaryClass) {
            var planetaryClassKey = spaceToUnderscore(planetaryClass);
            return "" +
                "Name: " + pickRandomFromJsArray(oraclesSF.Planet[planetaryClassKey]["Sample Names"]) + "<br>" +
                "Class: " + planetaryClass + "<br>" +
                "Description: " + oraclesSF.Planet[planetaryClassKey].Description + "<br>" +
                "Atmosphere: " + rollOnOracleSF(oraclesSF.Planet[planetaryClassKey].Atmosphere) + "<br>" +
                "Settlements: " + rollOnOracleSF(oraclesSF.Planet[planetaryClassKey].Settlements) + "<br>" +
                "Observed From Space: " + rollOnOracleSF(oraclesSF.Planet[planetaryClassKey].Observed_From_Space) + "<br>" +
                "Planetside Feature: " + rollOnOracleSF(oraclesSF.Planet[planetaryClassKey].Planetside_Feature) + "<br>" +
                "Life: " + rollOnOracleSF(oraclesSF.Planet[planetaryClassKey].Life) + "<br>" +

                "";
        }

        function createPlanetSF(display) {
            var planetaryClassText = cleanText(rollOnOracleSF(oraclesSF.Planet.Planetary_Class));
            var planetaryClass = planetaryClassText.split(' ').slice(0, 2).join(' ');
            var txt = "<div style='background-color: " + BACKGROUND_COLOR_PLANET + "; margin: 10px;'>" +
                createPlanetFeaturesByClassSF(planetaryClass) +
                "</div>";
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createInteriorPrecursorVaultSF(display) {
            var txt = "<div style='background-color: " + BACKGROUND_COLOR_PRECURSOR_VAULT_INTERNAL + "; margin: 10px;'>Vault Interior" + "<br>" +
                "First look: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Interior.First_Look) + "<br>" +
                "Feature: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Interior.Feature) + "<br>" +
                "Peril: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Interior.Peril) + "<br>" +
                "Opportunity: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Interior.Opportunity) + "<br>" +
                "</div>";
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createSanctumPrecursorVaultSF(display) {
            var txt = "<div style='background-color: " + BACKGROUND_COLOR_PRECURSOR_VAULT_INTERNAL + "; margin: 10px;'>Vault Sanctum" + "<br>" +
                "Purpose: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Sanctum.Purpose) + "<br>" +
                "Feature: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Sanctum.Feature) + "<br>" +
                "Peril: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Sanctum.Peril) + "<br>" +
                "Opportunity: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Vault_Sanctum.Opportunity) + "<br>" +
                "</div>";
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createPrecursorVaultSF(display) {
            var txt = "<div style='background-color: " + BACKGROUND_COLOR_PRECURSOR + "; margin: 10px;'> Precursor Vault:" + "<br>" +
                "Location: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Location) + "<br>" +
                "Scale: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Scale) + "<br>" +
                "Form: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Form) + "<br>" +
                "Shape: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Shape) + "<br>" +
                "Material: " + rollOnOracleSF(oraclesSF.Precursor_Vault.Material) + "<br>" +
                "Outer First Look: " + rollOnOracleSF(oraclesSF.Precursor_Vault.First_Look) + "<br>" +
                createInteriorPrecursorVaultSF(false) + "<br>" +
                createSanctumPrecursorVaultSF(false) + "<br>" +
                "</div>";
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;

        }

        function createSettlementSF(display) {
            var txt = "<div style='background-color: " + BACKGROUND_COLOR_SETTLEMENT + "; margin: 10px;'> Settlement:" + "<br>" +
                "Name: " + rollOnOracleSF(oraclesSF.Settlement.Name) + "<br>" +
                "Location: " + rollOnOracleSF(oraclesSF.Settlement.Location) + "<br>" +
                "Population: " + rollOnOracleSF(oraclesSF.Settlement.Population) + "<br>" +
                "First Look: " + rollOnOracleSF(oraclesSF.Settlement.First_Look) + "<br>" +
                "Authority: " + rollOnOracleSF(oraclesSF.Settlement.Authority) + "<br>" +
                "Initial Contact: " + rollOnOracleSF(oraclesSF.Settlement.Initial_Contact) + "<br>" +
                "Projects: " + rollOnOracleSF(oraclesSF.Settlement.Projects) + "<br>" +
                "Trouble: " + rollOnOracleSF(oraclesSF.Settlement.Trouble) + "<br>" +
                "</div>";
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createCreatureSF(display) {
            var environment = rollOnOracleSF(oraclesSF.Creature.Environment);
            var txt = createEnvironmentCreatureSF(environment);
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }


        function createDerelictFeaturesByZoneSF(zone) {

            var access = "";
            if (zone != 'Access') {
                var access = "Access:" + "<br>" +
                    createDerelictFeaturesByZoneSF("Access");
            }
            var result = "Zone:" + zone + "<br>" +
                "Area:" + rollOnOracleSF(oraclesSF.Derelict[zone].Area) + "<br>" +
                "Feature:" + rollOnOracleSF(oraclesSF.Derelict[zone].Feature) + "<br>" +
                "Peril:" + rollOnOracleSF(oraclesSF.Derelict[zone].Peril) + "<br>" +
                "Opportunity:" + rollOnOracleSF(oraclesSF.Derelict[zone].Opportunity) + "<br>" +
                access;

            return result;
        }

        function createZoneStarshipSF() {
            return rollOnOracleSF(oraclesSF.Derelict.Zone["Derelict_Zone_-_Starship"]);
        }

        function createZoneSettlementSF() {
            return rollOnOracleSF(oraclesSF.Derelict.Zone["Derelict_Zone_-_Settlement"]);
        }

        function createDerelictZoneByTypeSF(derelictType) {
            var result = "";
            if (derelictType == "Starship") {
                result = rollOnOracleSF(oraclesSF.Derelict.Zone["Derelict_Zone_-_Starship"])
            }
            if (derelictType == "Settlement") {
                result = rollOnOracleSF(oraclesSF.Derelict.Zone["Derelict_Zone_-_Settlement"])
            }

            return cleanText(result);
        }

        function createDerelictByLocationAndTypeSF(location, derelictType) {
            var access = "<div style='background-color: " + BACKGROUND_COLOR_DERELICT_LOCATION + "; margin: 10px;'> Access:" + "<br>" +
                createDerelictFeaturesByZoneSF("Access") +
                "</div>";
            var firstZone = "<div style='background-color: " + BACKGROUND_COLOR_DERELICT_LOCATION + "; margin: 10px;'> First zone:" + "<br>" + createDerelictFeaturesByZoneSF(createDerelictZoneByTypeSF(derelictType)) +
                "</div>"
            var secondZone = "<div style='background-color: " + BACKGROUND_COLOR_DERELICT_LOCATION + "; margin: 10px;'> Second zone:" + "<br>" + createDerelictFeaturesByZoneSF(createDerelictZoneByTypeSF(derelictType)) +
                "</div>"
            var thirdZone = "<div style='background-color: " + BACKGROUND_COLOR_DERELICT_LOCATION + "; margin: 10px;'> Third zone:" + "<br>" + createDerelictFeaturesByZoneSF(createDerelictZoneByTypeSF(derelictType)) +
                "</div>"
            return "Location: " + location + "<br>" +
                "Type: " + derelictType + "<br>" +
                "Condition: " + rollOnOracleSF(oraclesSF.Derelict.Condition) + "<br>" +
                "Outer First Look: " + rollOnOracleSF(oraclesSF.Derelict.Outer_First_Look) + "<br>" +
                "Inner First Look: " + rollOnOracleSF(oraclesSF.Derelict.Inner_First_Look) + "<br>" +
                access + "<br>" +
                firstZone + "<br>" +
                secondZone + "<br>" +
                thirdZone + "<br>" +
                ""
        }

        function createDerelictSF(display) {
            var location = rollOnOracleSF(oraclesSF.Derelict.Location);
            var derelictType = rollOnOracleSF(oraclesSF.Derelict.Derelict_Type[spaceToUnderscore(location)])
            var txt = "<div style='background-color: " + BACKGROUND_COLOR_DERELICT + "; margin: 10px;'>" +
                createDerelictByLocationAndTypeSF(location, derelictType) +
                "</div>";

            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function rollActionAndThemeSF(display) {
            var txt =
                "Action and Theme: " +
                rollOnOracleSF(oraclesSF.Core.Action) +
                " " +
                rollOnOracleSF(oraclesSF.Core.Theme)
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function rollDescriptorAndFocusSF(display) {
            var txt =
                "Descriptor and Focus: " +
                rollOnOracleSF(oraclesSF.Core.Descriptor) +
                " " +
                rollOnOracleSF(oraclesSF.Core.Focus)
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }

        function createStarshipSF(display) {
            var txt = rollOnOracleSF(oraclesSF.Starship.Name) +
                "<br>" +
                "Starship Type: " + rollOnOracleSF(oraclesSF.Starship.Starship_Type) +
                "<br>" +
                "Fleet: " + rollOnOracleSF(oraclesSF.Starship.Fleet) +
                "<br>" +
                "Initial Contact: " + rollOnOracleSF(oraclesSF.Starship.Initial_Contact) +
                "<br>" +
                "First Look: " + rollOnOracleSF(oraclesSF.Starship.First_Look)
            if (display == null || display) {
                displayInModal(txt);
            }
            return txt;
        }