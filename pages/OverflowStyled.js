import React, { useEffect } from "react";
const THRESHHOLD = 5;
export default function OverflowStyled({
  overflowClasses,
  children,
  className,
  loadingClass,
  style
}) {
  const [remainingClasses, setRemainingClasses] = React.useState(
    overflowClasses
  );
  const [activeClasses, setActiveClasses] = React.useState([className]);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const ref = React.useRef(null);

  useEffect(()=>{
    document.fonts.ready.then(()=>{
      setFontsLoaded(true);
    });
  }, [])

  React.useEffect(() => {
    if (ref !== null && ref.current && fontsLoaded) {
      const progressIfOverflowing = () => {
        if (remainingClasses.length === 0) return;
        const el = ref.current;
        void(el.offsetHeight);
        if (el.clientHeight < el.scrollHeight - THRESHHOLD) {
          const toAdd = remainingClasses[0];
          setActiveClasses([...activeClasses, toAdd]);
          setRemainingClasses(remainingClasses.filter((c) => c !== toAdd));
        }else{
          setLoading(false);
        }
      };
      const id = setInterval(progressIfOverflowing, 150);
      return () => clearInterval(id);
    }
  }, [ref, remainingClasses, activeClasses, fontsLoaded]);

  if(!fontsLoaded) return null;

  return (
    <div style={style} ref={ref} className={[...activeClasses, ...(loading ? [loadingClass] : [])].join(" ")}>
      {children}
    </div>
  );
}
