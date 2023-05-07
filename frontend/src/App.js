import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import FirstMain from "./pages/FirstMain";
import Intro from "./pages/Intro";
import "../src/App.css";

class App extends Component {
	// state = {
	// 	members: [],
	// };
	// async componentDidMount() {
	// 	try {
	// 		const res = await fetch("http://127.0.0.1:8000/api/");
	// 		const members = await res.json();
	// 		this.setState({
	// 			members,
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }
	render() {
		return (
			// <div className="App">
			// 	{this.state.members.map((item) => (
			// 		<div key={item.id}>
			// 			<h1>{item.email}</h1>
			// 		</div>
			// 	))}
			// </div>
			<BrowserRouter>
				<div className="Container">
					<Header />
					{/* <FirstMain /> */}
					<Routes>
						<Route path="/" element={<FirstMain />} />
						<Route path="intro" element={<Intro />} />
					</Routes>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
