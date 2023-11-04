import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./UserApp"; // 사용자 페이지 컴포넌트
import ManagerApp from "./ManagerApp"; // 관리자 페이지 컴포넌트

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route path="/*" element={<UserApp />} />
					<Route path="/manager/*" element={<ManagerApp />} />
				</Routes>
			</BrowserRouter>
		);
	}
}

export default App;
