import t from 'ts-runtime/lib';
import { ConditionMeter, IConditionMeter } from "../general/ConditionMeter";
import { MdString } from "../general/MdString";
import { ISource, Source } from "../general/Source";
import { AssetAbility, IAssetAbilityData } from "./AssetAbility";
import { AssetType } from "./AssetType";
import { IInput, Input, isNumberInput, isSelectInput, isTextInput, NumberInput, SelectInput, TextInput } from "../general/Input";
import { IAssetAttachment } from "./AssetAttachment";

export type AssetId = `Assets / ${string}`;

// interface for outgoing json + dezerialization
export interface IAsset {
  $id: AssetId;
  Name: string;
  Aliases?: string[] | undefined;
  "Asset Type": AssetType;
  Attachments?: IAssetAttachment | undefined;
  Inputs?: Input[] | undefined;
  Requirement?: string | undefined;
  Abilities: AssetAbility[];
  "Condition Meter"?: ConditionMeter | undefined;
  Source: Source;
}

// interface for incoming json
export interface IAssetData {
  $id?: AssetId | undefined;
  Name: string;
  Source?: ISource;
  Aliases?: string[] | undefined;
  "Asset Type": AssetType;
  Attachments?: IAssetAttachment | undefined;
  Inputs?: IInput[] | Input[] | undefined;
  Requirement?: MdString | undefined;
  Abilities: IAssetAbilityData[];
  "Condition Meter"?: IConditionMeter | undefined;
}

export class Asset implements IAsset {
  $id: AssetId;
  Name: string;
  Aliases?: string[] | undefined;
  "Asset Type": AssetType;
  Attachments?: IAssetAttachment | undefined;
  Inputs?: Input[] | undefined;
  Requirement?: string | undefined;
  Abilities: AssetAbility[];
  "Condition Meter"?: ConditionMeter | undefined;
  Source: Source;
  constructor(json: IAssetData, source: ISource) {
    this.$id = `Assets / ${json.Name}`;
    console.info(`[Asset.constructor] Building ${this.$id}...`);
    this.Name = json.Name;
    this.Aliases = json.Aliases;
    this["Asset Type"] = json["Asset Type"];
    this.Attachments = json.Attachments;
    if (json.Inputs) {
      this.Inputs = (json.Inputs as IInput[]).map(inputJson => {
        const idString = `${this.$id} / Inputs / ${inputJson.Name}`;
        if (isNumberInput(inputJson)) {
          return new NumberInput(inputJson, idString);
        }
        else if (isSelectInput(inputJson)) {
          return new SelectInput(inputJson, idString);
        }
        else if (isTextInput(inputJson)) {
          return new TextInput(inputJson, idString);
        }
        else { new Error("Unable to assign input data to a type - make sure it's correct."); }
      }) as Input[];
    }
    this.Requirement = json.Requirement;
    this.Abilities = json.Abilities.map((ability, index) => new AssetAbility(ability, this.$id + ` / Abilities / ${index + 1}`));
    this["Condition Meter"] = json["Condition Meter"] ? new ConditionMeter(json["Condition Meter"], this.$id + " / Condition Meter", this["Asset Type"]) : undefined;
    this.Source = new Source(source);
  }
}
