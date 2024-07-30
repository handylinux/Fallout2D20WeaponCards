
import Rules from "./rules";

import weapons from "./weapons.json";
import weaponMods, {applyMod} from "./mods";
import OverflowStyled from "./OverflowStyled";
import { ColoredImage } from "./ColoredImage";
//overflowClasses={["small", "small-flavour", "tiny", "red", "no-flavour"]}


function Weapon({weapon}){
  const imageName = weapon.Name.replace(/\W/g, '').toLowerCase();
  const imageUrl = `./images/${imageName}.png`
  return  <OverflowStyled
    className={`card-wrapper ${weapon["Weapon Type"].toLowerCase().replace(/\W/g, '-')}`}
    loadingClass="loading"
    overflowClasses={[
      "medium-font",
      "use-icon",
      "tiny-icon",
      "squeeze-text",
      "small-flavour",
      "small-rules",
      "no-icon",
      "no-flavour",
      "red"
    ]}
  >
    <div className="card">
    <div className="overlay"/>
    <div className="title_bar">
      <div className="title">
        <div className="prefix">{weapon.Prefix}</div>
        {weapon.Name}
        <div className="sub_title">{weapon["Weapon Type"]+" "}{weapon["Ammo"] && <span className="ammo">  {weapon.Ammo}</span>}</div>
      </div>
      <div className="stat_bar misc">
        <div>
          <div>Cost</div>
          <div className="stat">{weapon["Cost"]}</div>
          <div className="sub_stat">caps</div>
        </div>
        <div>
          <div>Weight</div>
          <div className="stat">{weapon["Weight"]}</div>
          <div className="sub_stat">lbs</div>
        </div>
        <div>
          <div>Rarity</div>
          <div className="stat">{weapon["Rarity"]}</div>
        </div>
      </div>
    </div>
    <div className="stat_bar combat">
      <div>
        <div>Damage Dice</div>
        <div className="stat">{weapon["Damage Rating"]}</div>
        <div className="sub_stat">{weapon["Damage Type"]}</div>
      </div>
      {(weapon["Rate of Fire"] || weapon["Rate of Fire"] === 0)&& <div>
        <div>Rate of Fire</div>
        <div className="stat">{weapon["Rate of Fire"]}</div>
      </div>}
      <div>
        <div>Range</div>
        <div className="stat">{weapon["Range"] || "-"}</div>
      </div>
    </div>
    <ColoredImage 
      src={imageUrl}
      className="image"
    />
    <Rules
      special={weapon.Rules}
      keywords={[
        ...weapon.Qualities.split(","),
        ...weapon["Damage Effects"].split(",")
      ]}
      icon={imageUrl}
    />
    <div className="flavour">{weapon["Flavour"]}</div></div>
  </OverflowStyled>
}

function applyRandomMod(weapon){
  const modPool = weaponMods[weapon.Name];
  if(!modPool) return weapon;
  const randomMod = modPool[Math.floor(Math.random()*modPool.length)];
  if(!randomMod) return weapon;
  return applyMod(randomMod, weapon);
}

export default function App() {
  return weapons.map(weapon=>applyRandomMod(weapon)).map((weapon) => (
    <Weapon weapon={weapon} key={weapon.Name}/>
  ));
}

