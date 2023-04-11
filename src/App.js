import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FirstMain from "./pages/FirstMain";
import Test from "./pages/Test";
import TestInfo from "./pages/TestInfo";
const App = () => {
	/*const heaer_wrap= {
		backgroundColor: "yellow"
	}*/
	return (
		<BrowserRouter>
			<div className="App">
				<Header />
				{/* <FirstMain /> */}
				<Routes>
					<Route path="/" element={<FirstMain />} />
					<Route path="test" element={<Test />} />
					<Route path="testinfo" element={<TestInfo />} />
				</Routes>
				<Footer />
			</div>
		</BrowserRouter>
	);
};

export default App;
