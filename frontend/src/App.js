import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserApp from "./UserApp";
import ManagerApp from "./ManagerApp";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// Firebase 초기화
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGEING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
