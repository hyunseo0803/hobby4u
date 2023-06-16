import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Intro from "./pages/Intro";
import "../src/App.css";

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="Container">
					<Header />
					{/* <FirstMain /> */}
					<Routes>
						<Route path="intro" element={<Intro />} />
					</Routes>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
