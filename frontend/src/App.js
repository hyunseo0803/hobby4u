import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Intro from "./pages/Intro";
import "../src/App.css";
import Setting from "./pages/Setting";
import Myclass from "./pages/Myclass";
import Likeclass from "./pages/Likeclass";
import Exam from "./pages/Exam";
import CreateClass from "./pages/CreateClass";
import CreateClassDetail from "./pages/CreateClassDetail";

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="Container">
					<Header />
					{/* <FirstMain /> */}
					<Routes>
						<Route path="intro" element={<Intro />} />
						<Route path="setting" element={<Setting />} />
						<Route path="myclass" element={<Myclass />} />
						<Route path="likeclass" element={<Likeclass />} />
						<Route path="exam" element={<Exam />} />
						<Route path="createclass" element={<CreateClass />} />
						<Route path="createClass/detail" element={<CreateClassDetail />} />
					</Routes>

					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
