import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Intro from "./pages/Intro";
import "../src/App.css";
import Setting from "./pages/Setting";
import Myclass from "./pages/Myclass";
import Likeclass from "./pages/Likeclass";
import Judge from "./pages/Judge";
import CreateClass from "./pages/CreateClass/CreateClass";
import CreateClassDetail from "./pages/CreateClass/CreateClassDetail";
import Allclass from "./pages/ReadClass/AllClass";
import ReadClassDetail from "./pages/ReadClass/ReadClassDetail";

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
						<Route path="judge" element={<Judge />} />
						<Route path="createclass" element={<CreateClass />} />
						<Route path="createClass/detail" element={<CreateClassDetail />} />
						<Route path="readClass/allClass" element={<Allclass />} />
						<Route path="readClass/classDetail" element={<ReadClassDetail />} />
					</Routes>

					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
