import React, { Component, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./UserApp";
import ManagerApp from "./ManagerApp";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// Firebase 초기화
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
		const readFirebasefile = async (folder_name, file) => {
			if (folder_name === "userAchiveFile") {
				console.log(file);
				const storage = getStorage(app);
				const storageRef = ref(storage, folder_name + "/" + file.achive_file);

				try {
					// 다운로드 URL 가져오기
					const url = await getDownloadURL(storageRef);
					return { achive_filename: file.achive_filename, achive_file: url }; // 파일 이름과 URL을 객체로 반환
				} catch (error) {
					console.error("Error getting download URL: ", error);
					throw error;
				}
			} else {
				const storage = getStorage(app);
				const storageRef = ref(storage, folder_name + "/" + file);

				try {
					// 다운로드 URL 가져오기
					const url = await getDownloadURL(storageRef);
					console.log(url);

					return url;
				} catch (error) {
					console.error("Error getting download URL: ", error);
					throw error;
				}
			}
		};
		return (
			<BrowserRouter>
				<Routes>
					<Route
						path="/*"
						element={<UserApp app={app} readFirebasefile={readFirebasefile} />}
					/>
					<Route
						path="/manager/*"
						element={
							<ManagerApp app={app} readFirebasefile={readFirebasefile} />
						}
					/>
				</Routes>
			</BrowserRouter>
		);
	}
}

export default App;
