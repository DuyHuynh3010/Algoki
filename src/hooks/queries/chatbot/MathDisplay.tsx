import Latex from "react-latex-next";
import "katex/dist/katex.min.css"; // Import KaTeX styles in the component if not global

function MathDisplay({ latexString }: { latexString: string }) {
    return <Latex>{latexString}</Latex>;
}

export default MathDisplay;
