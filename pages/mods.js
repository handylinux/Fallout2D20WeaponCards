import data from './mods.json';
import qualities from './qualities.json';

function filterValid(mods){
    return mods.filter(mod => mod.Name && mod.Prefix)
}

function toWeaponMod(mod){
    const effects = mod.Effects
        .split(',')
        .map(effect => effect.trim())
        .map(toEffect);
    return {
        ...mod,
        Weapons: mod['Mod Applies to list'].split(',').map(name => name.trim()),
        Effects:  effects
    }
}

function toEffect(string){
    try{
        if(string.match(/^gain/i) || string.match(/^lose/i)){
            const isAdd = string.match(/^gain/i);
            const what = string.split(/^gain|^lose/i)[1].trim();
            const quality = qualities.find(q => q.Name === what);
            if(quality){
                return {
                    Type: isAdd ? 'Add Quality' : 'Remove Quality',
                    Value: what
                }
            }
            throw new Error(`Unknown quality: ${what}`)
        }
        if(string.match(/^ammo/i)){
            const what = string.split(/ammo/i)[1].trim();
            return {
                Type: 'Ammo',
                Value: what
            }
        }
        if(string.match(/^plus/i) || string.match(/^minus/i) || string.match(/^set/i)){
            const isMinus = string.match(/^minus/i);
            const isSet = string.match(/^set/i);
            const valueString = string.match(/\d+/g)[0];
            const value = parseInt(valueString) * (isMinus ? -1 : 1);
            const what = string.split(valueString)[1].trim();
            if(['CD Damage', 'Range', 'Fire Rate'].includes(what)){
                return {
                    Type: isSet ? `Set ${what}` : `Modify ${what}`,
                    Value: value
                }
            }else{
                throw new Error(`Unknown stat: ${what}`);
            }
        }
        throw new Error(`Unknown effect: ${string}`)
    }catch(e){
        console.error(e, string);
        return {}
    }
}

const weaponMods = filterValid(data).map(toWeaponMod);


export function applyEffect({Type, Value}, weapon){
    if(Type === 'Add Quality'){
        return {
            ...weapon,
            Qualities: [...weapon.Qualities.split(/,\s*/), Value].join(', ')
        }
    }
    if(Type === 'Remove Quality'){
        return {
            ...weapon,
            Qualities: (weapon.Qualities.split(/,\s*/)).filter(q => q !== Value).join(', ')
        }
    }
    if(Type === 'Ammo'){
        return {
            ...weapon,
            Ammo: Value
        }
    }
    if(Type === 'Set CD Damage'){
        return {
            ...weapon,
            "Damage Rating": Value
        }
    }
    if(Type === 'Set Range'){
        throw new Error('Not implemented')
    }
    if(Type === 'Set Fire Rate'){
        return {
            ...weapon,
            "Rate of Fire": Value
        }
    }
    if(Type === 'Modify CD Damage'){
        return {
            ...weapon,
            "Damage Rating": weapon["Damage Rating"] + Value
        }
    }
    if(Type === 'Modify Range'){
        return {
            ...weapon,
            "Range": numberToRange(rangeToNumber(weapon["Range"]) + Value)
        }
    }
    if(Type === 'Modify Fire Rate'){
        return {
            ...weapon,
            "Rate of Fire": weapon["Rate of Fire"] + Value
        }
    }
    throw new Error(`Unknown type: ${Type}`)
}

export function applyMod(mod, weapon){
    const {Prefix, Effects} = mod;
    const modified =  Effects.reduce((weapon, effect) => applyEffect(effect, weapon), weapon);
    return {
        ...modified,
        Cost: weapon.Cost + mod.Cost,
        Rarity: weapon.Rarity + 1,
        Prefix
    }
}

function numberToRange(number){
    const result = {
        1: 'C',
        2: 'M',
        3: 'L',
        4: 'X',
    }[number]
    if(!result){
        throw new Error(`Unknown number: ${number}`)
    }
    return result
}

function rangeToNumber(range){
    const result = {
        C: 1,
        M: 2,
        L: 3,
        X: 4,
    }[range]
    if(!result){
        throw new Error(`Unknown range: ${range}`)
    }
    return result
}

const weaponModsByWeapon = weaponMods.reduce((acc, mod) => {
    mod.Weapons.forEach(weapon => {
        if(!acc[weapon]){
            acc[weapon] = [];
        }
        acc[weapon].push(mod);
    });
    return acc;
}, {});

export default weaponModsByWeapon
