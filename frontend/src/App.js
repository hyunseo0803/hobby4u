import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./UserApp"; // 사용자 페이지 컴포넌트
import ManagerApp from "./ManagerApp"; // 관리자 페이지 컴포넌트

// Firebase 초기화
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// admin.initializeApp(functions.config().firebase);
// const gcs = admin.storage();
const firebaseConfig = {
	apiKey: "AIzaSyD1AfQr25o6N7G63_d2bBnSXp86RUsJLzs",
	authDomain: "hivehobby.firebaseapp.com",
	projectId: "hivehobby",
	storageBucket: "hivehobby.appspot.com",
	messagingSenderId: "894049331466",
	appId: "1:894049331466:web:98cd705371e2717c4f32f3",
	measurementId: "G-56BBXTMD4E",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route path="/*" element={<UserApp app={app} />} />
					<Route path="/manager/*" element={<ManagerApp app={app} />} />
				</Routes>
			</BrowserRouter>
		);
	}
}

export default App;
