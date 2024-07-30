import qualities from "./qualities.json";
import { ColoredImage } from "./ColoredImage";

export default function Rules(props) {
  const rules = {
    ...(props.special && { Special: props.special })
  };

  if (props.keywords) {
    props.keywords.forEach((keywordRaw) => {
      const keyword = keywordRaw.trim();
      if (!keyword) return;
      const ruling = qualities.find((q) => q.Name === keyword);
      rules[keyword] = ruling ? ruling.Effect : "???";
    });
  }

  return (
    <div className="rules">
       <ColoredImage 
        src={props.icon}
        className="icon"
      />
      {Object.entries(rules).map(([name, text]) => (
        <div className="rule" key={name}>
          <b>{name}:</b> <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
