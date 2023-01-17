import Title from "./components/Title.js";
import Description from "./components/Description.js";

// css
import "./css/style.css";

const App = () => {
	return (
		<div className="container">
			{/* including the Title as well as Description components */}
			<Title />
			<Description />
		</div>
	)
}

export default App