import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FirstMain from "./pages/FirstMain";
import Intro from "./pages/Intro";
import TestInfo from "./pages/TestInfo";
import "../src/App.css";

const App = () => {
	/*const heaer_wrap= {
		backgroundColor: "yellow"
	}*/

	return (
		<BrowserRouter>
			<div className="Container">
				<Header />
				{/* <FirstMain /> */}
				<Routes>
					<Route path="/" element={<FirstMain />} />
					<Route path="intro" element={<Intro />} />
					<Route path="testinfo" element={<TestInfo />} />
				</Routes>
				<Footer />
			</div>
		</BrowserRouter>
	);
};

export default App;
